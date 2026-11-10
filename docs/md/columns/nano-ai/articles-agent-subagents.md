---

title: "子 Agent 与多 Agent：把活分出去"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-subagents/"

description: "独立上下文的子 Agent，并行只读、写入单线程；对照 Anthropic 多 Agent 研究系统、Claude Code 团队、Codex 子 Agent。"

---



# 子 Agent 与多 Agent：把活分出去




[从零手写 Agent · EP09](/agent/)




Subagents & Multi-Agent



> 上一课接上了 MCP，Agent 能用的工具多了，能做的事大了。可任务一大，老问题又回来了：上下文被填满。

>

> 第 4 课的办法是压缩，属于事后补救。这一课换个思路：**有些工作，从一开始就不该进主 Agent 的上下文。**



这一课新增 
`subagent.py`
，约 100 行，
`agent.py`
 改动十几行。



* * *



## 01问题：查资料的过程，比结论大得多



让 Agent 回答"这个项目里，权限检查是在哪里做的"。它可能要列目录、读五六个文件、搜几个关键词，才能得出一句话的结论。



这一句话的结论有用，但读过的那几万字原文，在得出结论之后就没用了。它们却全部留在 messages 里，之后每一轮请求都要再发一遍，直到被第 4 课的机制清理或压缩。



如果把"查"这件事交给另一个 Agent 呢？





    主 Agent 的上下文：

      用户：权限检查在哪里做的？

      主 Agent → delegate("找出权限检查的位置……")

      工具结果：[子 Agent 的结论] 在 permissions.py 的 check()，agent.py 的 handle_call 调用它……

      主 Agent：权限检查在……



    子 Agent 自己的上下文（用完即弃）：

      任务说明

      list_dir → 读 agent.py → 读 permissions.py → 读 tools.py → ……

      结论





主 Agent 只多了一条工具结果。子 Agent 读过的几万字，从来没进过主 Agent 的上下文。



这就是子 Agent 的本质：**一个新的会话，自己的 messages，自己的工具清单，用完只交回结论。** 不需要新的框架，第 6 课的 
`Session`
 已经够用。



## 02设计：四个决定



**1\. 子 Agent 看不到主对话。** 它的上下文里只有一段 system prompt 和一段任务说明。好处是干净、便宜；代价是主 Agent 必须把任务写清楚，因为子 Agent 不知道你们之前聊过什么。



**2\. 分两种：explore 和 worker。** explore 只拿只读工具，用来查资料、读代码；worker 能写文件、跑命令，但每个有副作用的操作，照样走第 3 课的权限检查，确认请求直接发给你。



**3\. 只允许一层。** 子 Agent 不能再派子 Agent。层数一多，成本成倍增长，出了问题也很难追。定时任务、计划这类工具，子 Agent 也拿不到。



**4\. 并行只给只读的。** 几件互不相关的调查可以同时派出去；写文件的活一次只做一件。原因第六节会讲：并行写，比并行读难得多。



## 03先改 Session：每个会话有自己的工具清单



第 6 课的 
`Session`
 加三个参数：





    class Session:

        """一个会话 = 一份 messages + 一个权限管理器 + 上一次的 token 数

        第 9 课新增：tools 限定能用的工具（None 表示全部），system 可替换，depth 记录是第几层"""



        def __init__(self, name, ask=None, persist=True, tools=None, system=None, depth=0):

            self.name = name

            self.persist = persist

            self.tools = set(tools) if tools is not None else None

            self.depth = depth

            saved = load_session(name) if persist else None

            self.messages = saved or [{"role": "system", "content": ""}]

            self.messages[0] = {"role": "system", "content": system or build_system()}

            self.perms = PermissionManager(ask=ask)

            self.prompt_tokens = 0



        def schemas(self):

            all_ = get_schemas()

            if self.tools is None:

                return all_

            return [s for s in all_ if s["function"]["name"] in self.tools]





主循环里，发给模型的工具说明改用 
`session.schemas()`
。
`handle_call`
 也加一道检查：模型请求了一个没发给它的工具，直接拒绝。





    def handle_call(call, perms, allowed=None):

        name = call.function.name

        if allowed is not None and name not in allowed:      # 模型请求了一个没发给它的工具

            return f"Error: 当前不能使用工具 {name}"

        ...





为什么不能只靠"不发说明书"？因为模型偶尔会凭空编出一个工具名，比如它在训练数据里见过 
`write_file`
。**能不能用，要由执行层说了算，不能只看模型知不知道。** 这和第 3 课"安全检查不能靠 prompt"是同一个道理。



还有一处小改动。子 Agent 的工具要知道"是谁派的我"：用的是哪个模型客户端，确认请求该发给谁。我们在 
`run()`
 里用一个 
`ContextVar`
 记下当前正在运行的会话：





    CURRENT = contextvars.ContextVar("current_run", default=None)





    def run(session, user_input, client, model=MODEL, log=print, max_steps=MAX_STEPS):

        token = CURRENT.set((session, client, model, log))

        try:

            return _loop(session, user_input, client, model, log, max_steps)

        finally:

            CURRENT.reset(token)






`_loop`
 就是原来的主循环。用 
`ContextVar`
 而不是全局变量，是因为下面的并行子 Agent 会在多个线程里同时运行，每个线程要看到自己的那一份。



## 04代码：subagent.py



### 工具清单





    MAX_DEPTH = 1            # 只允许一层：子 Agent 不能再派子 Agent

    SUB_MAX_STEPS = 15

    MAX_PARALLEL = 3

    RESULT_LIMIT = 3000      # 子 Agent 交回来的结论最多这么长



    # 这些工具子 Agent 永远拿不到：派生、定时任务都只能由主 Agent 做

    NEVER_FOR_SUB = {"delegate", "delegate_parallel", "schedule_task", "cancel_task", "list_tasks"}





    def toolset(kind):

        """explore：只拿只读工具；worker：除了派生和定时之外的全部工具。"""

        names = set(TOOLS) - NEVER_FOR_SUB

        if kind == "explore":

            names = {n for n in names if TOOL_RISK.get(n) is Risk.SAFE}

        return names





explore 的工具清单直接从第 3 课的风险登记表算出来：所有 SAFE 的工具。上一课在配置里标成只读的 MCP 工具，也会自动出现在里面。



### 子 Agent 的 system prompt





    SUB_SYSTEM = ("你是一个子 Agent，被主 Agent 派来完成一件具体的事。"

                  "你看不到主 Agent 和用户之前的对话，只能根据下面的任务说明行动。"

                  "完成后用简洁的文字汇报结论，写清楚依据（读了哪些文件、看到了什么），"

                  "不要贴大段原文。做不到就直接说明原因。")





两句话最重要。"看不到之前的对话"让它不去假设上下文；"不要贴大段原文"保证交回去的是结论，不然把原文搬回主 Agent，子 Agent 就白派了。



### 派出一个子 Agent





    def _spawn(task, kind, parent, client, model, log, idx=None):

        from agent import Session, run              # 延迟导入，避免和 agent.py 循环引用

        tag = f"子Agent{'' if idx is None else idx}"

        sub = Session(f"{parent.name}/{tag}", ask=parent.perms.ask, persist=False,

                      tools=toolset(kind), system=SUB_SYSTEM, depth=parent.depth + 1)

        try:

            result = run(sub, task, client, model,

                         log=lambda m: log(f"  [{tag}] {m}"), max_steps=SUB_MAX_STEPS)

        except Exception as e:

            return f"[{tag} 出错] {type(e).__name__}: {e}"

        if len(result) > RESULT_LIMIT:

            result = result[:RESULT_LIMIT] + "\n...（子 Agent 的结论过长，已截断）"

        return f"[{tag} 的结论]\n{result}"





注意这几个参数：



  * 
`ask=parent.perms.ask`
：子 Agent 的确认请求，走的是主 Agent 的那一套。在终端里就是终端确认，在聊天里就是发消息问你，在无人值守的定时任务里就是预授权。**子 Agent 不会比派它的那个 Agent 权限更大。**

  * 
`persist=False`
：子 Agent 的会话不保存，用完就丢。

  * 
`depth=parent.depth + 1`
：记下层数。

  * 
`max_steps=SUB_MAX_STEPS`
：子 Agent 的步数上限更低一些。



还有一点：主 Agent "本次会话一直允许"写文件，子 Agent 并不继承，它有自己的 
`PermissionManager`
。宁可多问一次。



### 给模型的工具





    @tool(

        name="delegate",

        description=("把一件边界清楚的子任务交给一个子 Agent。它有独立的上下文，看不到当前对话，"

                     "所以 task 里要写清目标、范围和希望交回的格式。"

                     "kind=explore 只能读（查资料、读代码、找文件），kind=worker 还能写文件和执行命令，"

                     "每个有副作用的操作照样需要用户确认。适合：要读很多内容但只需要结论的任务。"),

        parameters={"type": "object", "properties": {

            "task": {"type": "string", "description": "完整的任务说明"},

            "kind": {"type": "string", "enum": ["explore", "worker"]}},

            "required": ["task"]},

    )

    def delegate(task, kind="explore"):

        try:

            parent, client, model, log = _current()

        except RuntimeError as e:

            return f"Error: {e}"

        return _spawn(task, kind, parent, client, model, log)






`_current()`
 从 
`CURRENT`
 里取出主 Agent，并检查层数，超过 
`MAX_DEPTH`
 就拒绝。描述里的"适合：要读很多内容但只需要结论的任务"是在教模型什么时候该派。第 2 课说过，description 本质上是提示词。



并行版本只多了一个线程池：





    @tool(

        name="delegate_parallel",

        description=(f"同时派出多个只读子 Agent（最多 {MAX_PARALLEL} 个），各自完成一件互不依赖的调查，"

                     "返回所有结论。tasks 是任务说明的列表。只能读，不能写。"),

        parameters={"type": "object", "properties": {

            "tasks": {"type": "array", "items": {"type": "string"}}},

            "required": ["tasks"]},

    )

    def delegate_parallel(tasks):

        try:

            parent, client, model, log = _current()

        except RuntimeError as e:

            return f"Error: {e}"

        if not tasks:

            return "Error: tasks 不能为空"

        if len(tasks) > MAX_PARALLEL:

            return f"Error: 一次最多 {MAX_PARALLEL} 个子 Agent，你给了 {len(tasks)} 个"

        with ThreadPoolExecutor(MAX_PARALLEL) as pool:

            futures = [pool.submit(_spawn, t, "explore", parent, client, model, log, i + 1)

                       for i, t in enumerate(tasks)]

            return "\n\n".join(f.result() for f in futures)





并行的只能是 explore。只读的子 Agent 只用 SAFE 工具，不会弹确认，三个线程不会同时在终端里问你问题。上一课的 MCP 客户端加了锁，三个子 Agent 同时调用同一个 MCP 服务器也不会把消息搅在一起。



最后在 
`permissions.py`
 里登记：
`delegate`
 和 
`delegate_parallel`
 都是 SAFE。派出子 Agent 本身没有副作用，子 Agent 的每个操作会各自接受检查。



## 05跑起来





    你> 帮我看看这个项目里，权限检查、上下文压缩、定时任务分别是在哪里实现的



    🔧 delegate_parallel({"tasks": ["找出权限检查的实现位置……", "找出上下文压缩……", "找出定时任务……"]})

      [子Agent1] 🔧 list_dir({"path": "."})

      [子Agent2] 🔧 list_dir({"path": "."})

      [子Agent3] 🔧 list_dir({"path": "."})

      [子Agent1] 🔧 read_file({"path": "permissions.py"})

      [子Agent3] 🔧 read_file({"path": "scheduler.py"})

      [子Agent2] 🔧 read_file({"path": "context.py"})

      ...



    权限检查在 permissions.py 的 PermissionManager.check()，分三关……

    上下文压缩在 context.py，三层……

    定时任务在 scheduler.py……





以上为示意。值得观察两件事：三个子 Agent 的日志是交错出现的，说明它们确实在并行；主 Agent 的上下文里，只多了一条包含三段结论的工具结果。



你也可以对比一下：不用子 Agent，直接让主 Agent 读这些文件，然后看第 4 课打印的 
`prompt_tokens`
。



## 06多 Agent：什么时候值得



子 Agent 是多 Agent 最简单的形态：一个管理者，几个干完活就走的帮手。再往前一步，就是几个 Agent 长期共存、互相发消息、分工协作。听起来很强大，但业界在这件事上踩过不少坑，结论值得先知道。



**1\. 多 Agent 很贵。** Anthropic 2025 年公开过他们的多 Agent 研究系统：一个主 Agent 规划，多个子 Agent 并行搜索。在内部的研究类评测上，它比单个 Agent 的表现高出 90.2%。但代价是：Agent 一般比普通聊天多用约 4 倍的 token，多 Agent 系统约 15 倍。他们还发现，在一个浏览类评测里，token 用量本身就能解释 80% 的表现差异。换句话说，多 Agent 好用，很大程度上是因为它允许在一个问题上花更多的 token。



**2\. 编码这类任务，可并行的部分不多。** 同一篇文章写道：需要所有 Agent 共享同一份上下文、或者 Agent 之间依赖很多的任务，不适合多 Agent，而大部分编码任务真正能并行的部分比研究任务少。他们早期的版本还出现过一个简单问题派出 50 个子 Agent 的情况，后来在提示词里写明了"什么规模的问题派几个"。



**3\. 写操作要保持单线程。** 做 Devin 的 Cognition 2025 年写过一篇《Don't Build Multi-Agents》，核心论点是：每一次修改都隐含着决定（代码风格、边界情况怎么处理），几个 Agent 同时写，这些隐含的决定会互相冲突。今年 4 月他们发了续篇，结论更新了，但方向没变：多个 Agent 同时写代码的方案，至今没有真正被用起来；行得通的模式是**写操作保持单线程** ，其他 Agent 贡献"智力"而不是"动作"。比如一个 Agent 写代码，另一个用干净的上下文做代码评审；或者一个管理者拆任务、派出子 Agent、汇总结果。



这也是本课设计的依据：**并行的只读，写入的单线程。** 子 Agent 用干净的上下文去查、去审，主 Agent 负责决定和动手。



## 07验证



最关键的一个测试，验证"子 Agent 读过的内容不会进入主 Agent 的上下文"：





    def test_delegate_returns_only_conclusion():

        (WORKSPACE / "big.txt").write_text("x" * 5000)

        c = FakeClient([

            [tool_call("p1", "delegate", {"task": "读 big.txt，告诉我它有多长", "kind": "explore"})],

            [tool_call("s1", "read_file", {"path": "big.txt"})],     # 子 Agent 读文件

            "big.txt 有 5000 个字符",                                  # 子 Agent 的结论

            "子 Agent 说文件有 5000 个字符",                            # 主 Agent 的回答

        ])

        s = agent.Session("main", ask=lambda n, a: ("n", ""), persist=False)

        out = agent.run(s, "big.txt 多长？", c, log=lambda *_: None)

        assert out == "子 Agent 说文件有 5000 个字符"

        # 主 Agent 的上下文里只有结论，没有 5000 个 x

        tool_msgs = [m["content"] for m in s.messages if m["role"] == "tool"]

        assert len(tool_msgs) == 1 and "5000 个字符" in tool_msgs[0] and "xxxx" not in tool_msgs[0]

        # 子 Agent 只拿到了只读工具，而且有自己的 system prompt

        sub_request = c.seen[1]

        assert sub_request[0]["content"].startswith("你是一个子 Agent")

        assert len(sub_request) == 2          # system + 任务，没有主对话的历史





配套代码的 
`tests/test_subagent.py`
 还测了：explore 拿不到写工具，硬请求也会被执行层拒绝；子 Agent 不能再派子 Agent；三个并行子 Agent 确实跑在不同线程里，结论都交了回来；一次派超过 3 个会被拒绝。



## 08这一版的局限



  1. **子 Agent 看不到主对话，全靠任务说明。** 主 Agent 写的任务说明不清楚，子 Agent 就会做偏，而且主 Agent 很难察觉。Anthropic 的经验是，给子 Agent 的说明要写清目标、输出格式、可用的工具和任务边界。

  2. **explore 只有读文件和列目录。** 没有按内容搜索的工具，大项目里找东西会很慢。可以加一个只读的 
`grep`
 工具，登记成 SAFE，它会自动出现在 explore 的清单里。

  3. **并行只是"同时开始、全部结束才返回"。** 一个子 Agent 卡住，其他人都得等它。也没有中途汇报进度。

  4. **worker 的确认请求来自子 Agent。** 你在确认界面看到的参数是真实的，但发起它的是一个你看不到上下文的 Agent。日志里的 
`[子Agent]`
 前缀能帮你分辨，确认界面本身没有标注。

  5. **成本不透明。** 子 Agent 用了多少 token，主 Agent 和你都看不到。



## 09主流 Agent 怎么做



**Claude Code：子 Agent 和 Agent 团队两档。** 它的子 Agent 和本课的设计几乎一样：独立的上下文窗口，看不到主对话，只把最终结果交回。内置了几种：只读的 Explore（搜索和分析代码）、计划模式下调研用的 Plan、什么都能做的 general-purpose。你也可以在 
`.claude/agents/`
 下用一个 Markdown 文件定义自己的子 Agent：名字、描述、能用的工具、用哪个模型，正文就是它的 system prompt。不同的是，它默认允许子 Agent 再往下派，最多三层，可以配置；还支持让子 Agent 在一个临时的 git worktree 里工作，改动不碰你当前的目录。



更重的一档是 Agent 团队（agent teams），目前是实验功能，要手动打开。一个主会话当队长，几个队友各自是完整的 Claude Code 会话，通过一个共享的任务列表认领工作，通过"邮箱"直接互相发消息。文档写得很直白：团队比单个会话多用很多 token，适合调研、评审、互不干扰的新模块这类能并行的事；顺序性的任务、改同一个文件、依赖多的工作，单个会话或子 Agent 更合适；建议从 3 到 5 个队友开始；队友不能再组建自己的团队。还有一条和本课的权限设计呼应：一个 Agent 发给另一个 Agent 的消息，不能代替你批准权限。



**Codex：只在你要求时才派。** Codex 的子 Agent 只在你明确要求时才会派生，不会自己拆任务。默认最多 6 个并发、深度 1（子 Agent 不能再派），内置 default、worker、explorer 三种，也可以用 TOML 文件定义自己的。子 Agent 继承父会话的沙箱策略，可以单独收紧，比如给探索用的设成只读。它还有一个实验性的 
`spawn_agents_on_csv`
：按 CSV 的每一行派一个子 Agent，结果汇总成一张新表。



**Grok Build：子 Agent 加 worktree。** 大任务拆给并行的子 Agent，每个可以在自己的 git worktree 里工作，互不干扰。这是解决"并行写"冲突的一种工程办法：既然几个 Agent 写同一份代码会打架，那就各写一份，最后由人或主 Agent 合并。



**DeepSeek Harness：子 Agent 和团队都是插件。** Subagents 是它的官方插件，Agent teams 是实验性插件。符合它"一切皆插件"的设计：不想要，就不装。



**Hermes：隔离的子 Agent。** 它可以派出隔离的子 Agent 处理并行的工作流，也支持让模型写 Python 脚本、通过 RPC 调用工具，把多步流程压成一步。



几家在默认值上的差别，反映的是同一个判断：子 Agent 便宜好用，可以多用；多个 Agent 长期协作，要谨慎，而且写操作最好别并行。



## 10本课小结



  * 子 Agent = 一个新的 Session：自己的 messages、自己的工具清单、更低的步数上限，用完只交回结论

  * 它解决的是上下文问题：查资料的过程留在子 Agent 里，主 Agent 只拿结论

  * 权限：子 Agent 的确认请求走主 Agent 的那一套，工具清单由执行层强制

  * 并行的只读，写入的单线程；只允许一层

  * 多 Agent 的收益很大程度来自花了更多 token，先用子 Agent，确实需要再考虑团队



## 下期预告：计划



子 Agent 让主 Agent 的上下文更干净。但还有一类问题，上下文再干净也解决不了：Agent 理解偏了，一上来就改了一堆文件。下一课讲计划：**让它先写下要做什么，你点头了再动手。**



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-09/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-09)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[How we built our multi-agent research system（Anthropic）](https://www.anthropic.com/engineering/multi-agent-research-system)


  * 
[Multi-Agents: What's Actually Working（Cognition）](https://cognition.com/blog/multi-agents-working)


  * 
[Claude Code 文档：Subagents](https://code.claude.com/docs/en/sub-agents)


  * 
[Claude Code 文档：Agent teams](https://code.claude.com/docs/en/agent-teams)


  * 
[The Official Codex Subagents Documentation（第三方整理）](https://codex.danielvaughan.com/2026/05/06/codex-subagents-official-docs-reference-patterns-csv-batch/)


  * 
[Grok Build CLI（xAI）](https://x.ai/news/grok-build-cli)


  * 
[DeepSeek Harness 官方页面](https://deepseek.com/en/harness/)


  * 
[Hermes Agent（GitHub）](https://github.com/NousResearch/hermes-agent)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



