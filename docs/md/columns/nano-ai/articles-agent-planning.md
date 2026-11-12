---

title: "计划：先说要做什么，再动手"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-planning/"

description: "待办清单 + 由代码强制只读的计划模式，计划经你批准才动手；对照 Claude Code、Codex、Grok Build、Pi。"

---



# 计划：先说要做什么，再动手




[从零手写 Agent · EP10](/agent/)




Planning



> 前面九课，Agent 拿到任务就开始干。小任务没问题；任务一大，常见两种失败。

>

> 一种是做到一半忘了还剩什么：第 4 课的压缩把早期的上下文压成了摘要，原本的五个步骤只剩模糊的一句。另一种更麻烦：一开始就理解偏了，等你发现时，它已经改了十几个文件。



这一课用两样东西对付这两种失败，新增 
`planning.py`
，约 80 行，权限层加几行：



  * **待办清单** （
`update_plan`
）：让模型把步骤写下来，每做完一步就更新。

  * **计划模式** ：动手之前先调查、出方案，你批准了才能改东西。



* * *



## 01待办清单：把步骤写进上下文



长任务里，模型并不是不会规划，而是**规划写在它的"脑子"里，没写在上下文里** 。第一轮它想好了五步，可这个想法只存在于那一轮的输出中。二十轮之后，那段输出可能已经被压缩掉，或者淹没在大量的工具结果里。



办法很朴素：给它一个工具，让它把计划写下来。





    STATUS = {"pending": "[ ]", "in_progress": "[→]", "completed": "[x]"}

    PLAN_MARK = "[plan]"

    OLD_PLAN = "[plan] 这是旧版计划，已被后面的版本取代"





    @tool(

        name="update_plan",

        description=("记录或更新当前任务的分步计划。步骤超过 3 步的任务，开始前先写计划；"

                     "每完成一步就再调用一次，把状态改掉。同一时间最多一个步骤是 in_progress。"

                     "每次都传完整的步骤列表。"),

        parameters={"type": "object", "properties": {"steps": {

            "type": "array", "items": {"type": "object", "properties": {

                "step": {"type": "string"},

                "status": {"type": "string", "enum": list(STATUS)}},

                "required": ["step", "status"]}}},

            "required": ["steps"]},

    )

    def update_plan(steps):

        if not steps:

            return "Error: steps 不能为空"

        bad = [s for s in steps if s.get("status") not in STATUS or not s.get("step")]

        if bad:

            return f"Error: 步骤格式不对：{bad[0]}，status 只能是 {', '.join(STATUS)}"

        if sum(s["status"] == "in_progress" for s in steps) > 1:

            return "Error: 同一时间最多一个步骤是 in_progress"

        session = _session()

        session.plan = steps

        # 旧版本的计划在上下文里已经没用了，换成一句话，只留最新一版

        for m in session.messages:

            if m["role"] == "tool" and m["content"].startswith(PLAN_MARK):

                m["content"] = OLD_PLAN

        done = sum(s["status"] == "completed" for s in steps)

        return f"{PLAN_MARK} 当前计划（{done}/{len(steps)} 完成）\n{render(steps)}"





这个工具什么都不"做"，它的全部作用是**让计划出现在上下文里** ，并且是最新的。几个细节：



**1\. 每次传完整列表。** 不提供"把第 3 步标成完成"这种增量操作。完整列表更简单，模型也不容易把状态搞乱。



**2\. 同时只能有一个 in_progress。** 这是在逼模型一次专注一件事。



**3\. 旧版本替换成一句话。** 十个步骤更新十次，就有十份几乎一样的清单躺在上下文里。只保留最新一版，旧的换成"已被取代"。代价是改动了历史消息，第 4 课说过这会影响前缀缓存。这里的取舍是：计划很短，被替换的位置分散，和反复堆积相比，这点缓存损失可以接受。



**4\. 它是 SAFE 的。** 只是记一份清单，不碰任何外部的东西，不需要确认。




`session.plan`
 里也存了一份。现在没用上，留给你扩展：比如在终端里随时显示进度，或者在第 4 课压缩时把它附在摘要后面，保证压缩后计划不丢。



跑起来的样子（示意）：





    你> 把 tools.py 里的工具按字母顺序重新排列，补上缺的 docstring，然后跑测试



    🔧 update_plan({"steps": [{"step": "读 tools.py，列出所有工具", "status": "in_progress"}, ...]})

    🔧 read_file({"path": "tools.py"})

    🔧 update_plan({"steps": [{"step": "读 tools.py，列出所有工具", "status": "completed"},

                               {"step": "重排并补 docstring", "status": "in_progress"}, ...]})

    ...





## 02计划模式：动手之前先让人看一眼



待办清单解决的是"忘"。"理解偏了"要靠另一个办法：**在动手之前，强制有一个人看方案的环节。**



计划模式的规则是：



  1. 由你决定进入。在终端里输入 
`/plan 任务`
，或者在聊天里发 
`/plan 任务`
。

  2. 进入后，Agent 只能读、只能调查。所有有副作用的工具，**由权限层直接拒绝，问都不问你** 。

  3. 它想清楚之后，调用 
`submit_plan`
 提交一份计划。确认界面展示计划全文。

  4. 你按 y，退出计划模式，开始执行；你按 n 并附上意见，它留在计划模式里，改完再交。



### 只读，由代码强制



改 
`permissions.py`
，
`PermissionManager`
 多一个 
`mode`
 属性：





            self.mode = "normal"      # 第 10 课："plan" 时只能读，由代码强制





在 
`check()`
 的第 2 关里加三行：





            # 第 10 课：计划模式下，除了提交计划，一切有副作用的操作都拒绝，问都不问

            if self.mode == "plan" and risk is not Risk.SAFE and name != "submit_plan":

                return Decision(False, "当前是计划模式，只能读和调查。想好后调用 submit_plan 提交计划，批准后才能动手。")





注意它的位置：在"一直允许"的检查之前。就算你之前对 
`write_file`
 选了"本次会话一直允许"，进入计划模式后也照样被拒绝。



为什么要强制，而不是在 prompt 里写"请不要修改文件"？还是第 3 课那句话：**安全检查不能靠 prompt。** 计划模式的意义在于"你可以放心地让它去调查"。如果只读要靠模型自觉，这个"放心"就打了折扣。下面"主流怎么做"会看到，这恰恰是一个有分歧的设计点。



### 提交计划：复用确认机制





    @tool(

        name="submit_plan",

        description="计划模式下使用：提交完整的执行计划给用户审批。批准后退出计划模式，可以开始修改。",

        parameters={"type": "object", "properties": {

            "plan": {"type": "string", "description": "分步骤的完整计划，写清要改哪些文件、怎么验证"}},

            "required": ["plan"]},

    )

    def submit_plan(plan):

        # 能走到这里，说明用户已经在确认界面看过计划并按了 y（submit_plan 是 CONFIRM 级）

        session = _session()

        if session.perms.mode != "plan":

            return "Error: 当前不在计划模式，直接执行即可"

        session.perms.mode = "normal"

        return "用户批准了计划。已退出计划模式，现在按计划执行；执行中如果需要偏离计划，先说明原因。"





审批没有写任何新代码。
`submit_plan`
 登记成 CONFIRM，它就会走第 3 课的确认流程：在终端里是 y/n，在聊天里是发消息问你，第 6 课实现的"n 后面跟原因"也照样能用。确认界面里要展示计划全文，
`render_call`
 加一个分支：





        if name == "submit_plan":                          # 第 10 课：计划全文都要给人看

            return indent(args.get("plan", ""), "  ")





你回复"n 先别动数据库那块"，这句话会作为拒绝原因回到模型那里，它留在计划模式里修改方案，再交一次。



### 进入计划模式：由人决定





    PLAN_MODE_PREFIX = ("[计划模式] 先调查，不要修改任何东西（有副作用的工具会被拒绝）。"

                        "想清楚之后调用 submit_plan 提交一份分步骤的计划，等用户批准后再执行。\n任务：")





    def enter_plan_mode(session, task):

        """由用户触发（终端里输入 /plan 任务），不是给模型的工具：进不进计划模式，由人决定。"""

        session.perms.mode = "plan"

        return PLAN_MODE_PREFIX + task





在 
`agent.py`
 的 
`main()`
 和 
`bot.py`
 里各加两行，识别 
`/plan`
 开头的输入。




`enter_plan_mode`
 不是工具，模型不能自己进入计划模式。理由很简单：计划模式是你给 Agent 戴的约束，戴不戴由你决定。



还有一处容易漏：**子 Agent 要继承计划模式。** 否则主 Agent 在计划模式里派一个 worker 子 Agent，就能绕过只读。
`_spawn`
 里加一行：





        sub.perms.mode = parent.perms.mode       # 第 10 课：计划模式下派出去的子 Agent 也只能读






`submit_plan`
 也加进 
`NEVER_FOR_SUB`
，计划只能由主 Agent 提交。



## 03跑起来





    你> /plan 给定时任务加一个"暂停"功能



    🔧 read_file({"path": "scheduler.py"})

    🔧 read_file({"path": "bot.py"})

    🔧 write_file({"path": "scheduler.py", ...})

       → [权限拒绝] 当前是计划模式，只能读和调查。想好后调用 submit_plan 提交计划……



    ⚠️  Agent 想执行：submit_plan

      1. scheduler.py：任务加 paused 字段，due() 跳过暂停的任务

      2. 新增 pause_task / resume_task 两个工具，风险等级 CONFIRM

      3. bot.py：/tasks 的输出里标出暂停状态

      4. 加测试：暂停的任务到点不执行，恢复后从当前时间重新计算下一次

    [y]允许 / [n]拒绝 > n

    拒绝原因（可选，回车跳过）> 恢复后不要重新计算，按原来的时间表走



    ⚠️  Agent 想执行：submit_plan

      1. ……

      4. 加测试：暂停期间错过的不补跑，恢复后按原时间表的下一个时间点执行

    [y]允许 / [n]拒绝 > y



    🔧 write_file({"path": "scheduler.py", ...})

    ...





以上为示意。注意第三步：模型在计划模式里"忍不住"想直接改文件，被权限层拒绝了，拒绝原因提醒它去提交计划。这正是"由代码强制"的意义：模型不总是守规矩，规矩要靠代码来守。



## 04验证





    def test_plan_mode_blocks_writes_even_if_user_says_yes():

        pm = PermissionManager(ask=lambda n, a: ("a", ""))

        pm.check("write_file", {"path": "x.txt", "content": ""})       # 先"一直允许"写文件

        pm.mode = "plan"

        assert not pm.check("write_file", {"path": "x.txt", "content": ""}).allowed

        assert not pm.check("run_shell", {"command": "ls"}).allowed

        assert pm.check("read_file", {"path": "x.txt"}).allowed         # 读照常

        assert pm.check("submit_plan", {"plan": "1. ..."}).allowed      # 提交计划要问人，这里人说了 a





再用假模型跑一遍完整流程：计划模式下想写文件被拒、提交计划、批准、写入成功，并且断言**你只被问了两次** （批准计划一次、写文件一次），计划模式下那次写入根本没有打扰你。配套代码的 
`tests/test_planning.py`
 里还测了：计划被拒后留在计划模式；
`update_plan`
 只保留最新一版；两个 in_progress 会报错；子 Agent 继承计划模式。



## 05这一版的局限



  1. **计划只是一段文字。** 批准之后，Agent 是否按计划执行，没有机制检查。它完全可以批准后做一件计划里没写的事。要更严格，可以让计划列出要改的文件，执行时只允许写这些文件。

  2. **批准是一次性的。** 退出计划模式后就回到正常模式，中途想再审一次，得重新 
`/plan`
。

  3. **待办清单没有持久化。** 存在会话的 messages 里，第 4 课压缩后可能丢失；
`session.plan`
 有一份，但还没接到压缩逻辑上。

  4. **计划模式依赖风险登记准确。** 一个 MCP 工具在配置里被错标成只读，计划模式就拦不住它。

  5. **模型可以不写计划。** 
`update_plan`
 是建议，不是强制。描述里写了"超过 3 步的任务先写计划"，模型照不照做，取决于模型。



## 06主流 Agent 怎么做



**Claude Code：计划模式 + 待办工具。** 它的计划模式是六种权限模式之一，在这个模式下 Claude 只调查、出方案，批准后才开始改。它也有待办清单工具，长任务里你会看到它一边做一边勾掉。



有意思的是实现方式。Flask 的作者 Armin Ronacher 去年底专门研究过 Claude Code 的计划模式，结论是：只读主要靠注入的一段提醒告诉模型"除了计划文件什么都不能改"，写文件的工具其实还在，他没找到别的强制手段；计划本身是模型写到一个计划目录里的 Markdown 文件，退出计划模式的工具读取这个文件，交给你审批。他的观点是，计划模式的效果大部分来自提示词，框架提供的主要是交互体验。这和本课"只读由代码强制"是两种取舍：靠提示词更灵活，模型可以在计划阶段写草稿文件；靠代码更可靠，但限制也更死。



**Codex：
`update_plan`
。** Codex 给模型的计划工具就叫 
`update_plan`
，本课的待办清单借用了它的名字和思路：模型维护一份带状态的步骤列表。



**Grok Build：计划可以逐条改。** 它的计划模式里，你不只是批准或拒绝，还可以对某一步批注、改写某一步，再让它执行。这比本课的 y/n 加一句原因更细。



**Pi：没有计划模式。** Pi 的文档明确列出不做计划模式，也不做内置的待办清单。用 Ronacher 的话，他自己的做法是让 Agent 先问清问题，在编辑器里回答，再迭代一个 Markdown 交接文件，效果相当，而且文件就在眼前，可以直接改。他还提到另一个编码 Agent Amp 也在去掉计划模式。这代表了一种观点：计划不需要专门的模式，一个文件加一句提示就够了。



**DeepSeek Harness：计划和目标是工具。** 它的 Standard 模式里，计划（planning）和目标（goals）是给模型的工具之一，和本课的 
`update_plan`
 是同一类东西。



几家的分歧，归结起来是一个问题：**计划要多正式？** 从"一个 Markdown 文件"（Pi）到"一种权限模式"（Claude Code），再到"由代码强制的只读加审批"（本课），越正式越可靠，也越笨重。对一个能执行命令的 Agent，本课选了可靠。



## 07本课小结



  * 待办清单：让计划出现在上下文里，并且始终是最新一版；它不做任何事，只是让模型"看得见"自己的计划

  * 计划模式：只读由权限层强制，审批复用第 3 课的确认流程，被拒的原因回到模型那里

  * 进不进计划模式由人决定；子 Agent 继承计划模式

  * 主流产品在"计划要多正式"上有分歧：提示词加文件，还是代码强制



## 下期预告：记忆



到这里，Agent 在一个会话里已经相当能干了。但关掉程序、开一个新会话，它就忘了你是谁、你们的项目有什么约定、上次踩过什么坑。最后一课讲记忆：**哪些东西值得跨会话记住，谁有权写，以及怎么防止记错。**



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-10/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-10)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[What is Plan Mode?（Armin Ronacher）](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/)


  * 
[Claude Code 文档：Permission modes](https://code.claude.com/docs/en/permission-modes)


  * 
[Grok Build CLI（xAI）](https://x.ai/news/grok-build-cli)


  * 
[What Is DeepSeek Harness?（DataCamp）](https://www.datacamp.com/blog/what-is-deepseek-harness)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



