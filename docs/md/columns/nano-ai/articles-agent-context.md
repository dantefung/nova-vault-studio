---

title: "上下文管理：别让 Agent 被自己的历史撑爆"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-context/"

description: "截断、清理、摘要三层，按真实 token 数触发；对照 Claude Code、Codex、Pi、Hermes 的压缩策略。"

---



# 上下文管理：别让 Agent 被自己的历史撑爆




[从零手写 Agent · EP04](/agent/)




Context Management



> 前三课，Agent 有了最小循环、工具系统、权限确认。它能干活，也不会乱干活。

>

> 但只要让它连续干十几步，就会撞上第一个真实的工程问题：**messages 越来越长，直到 API 报错，或者变慢、变贵、变笨。**



这一课只解决这一个问题，新增 
`context.py`
，约 100 行。



* * *



## 01先复现问题



每一轮循环，我们都在往 
`messages`
 里追加内容：assistant 的回复、tool_calls、tool 的返回。而每次调用 API，**整个 messages 都要重新发一遍** 。



最容易撑爆上下文的是工具结果。比如让 Agent 读一个大文件：





    # 让 Agent 连续读几个大文件，然后打印每轮的 prompt_tokens

    resp = client.chat.completions.create(model=model, messages=messages, tools=tools)

    print("prompt_tokens:", resp.usage.prompt_tokens)





你会看到 
`prompt_tokens`
 一轮比一轮大，而且基本是单调递增的。没有任何机制会让它自己变小。



三个后果：



  1. 超过模型窗口，请求直接失败

  2. 即使没超，输入越长，延迟和费用越高

  3. 上下文里堆满了早已无用的旧内容，模型更容易被干扰



所以我们需要在 Agent 里加一层**上下文管理** 。



* * *



## 02整体思路：三层，从便宜到贵



不要一上来就做"摘要压缩"。按代价从低到高，分三层：



层 | 做什么 | 代价

---|---|---

第 1 层 | 工具结果入库前截断 | 几乎为零

第 2 层 | 清理旧的工具结果 | 为零，但会丢细节

第 3 层 | 把早期对话压缩成摘要 | 多一次模型调用



另外加一个小功能：**会话持久化** ，让关掉程序再打开还能接着聊。



触发时机怎么判断？不要自己估算 token，直接用 API 返回的 
`usage.prompt_tokens`
，它就是服务端实际计算的数字。



* * *



## 03新建 context.py





    # context.py

    import json

    import os

    from pathlib import Path



    MAX_TOOL_CHARS = 4000          # 单个工具结果最多保留的字符数

    KEEP_RECENT_TOOL_RESULTS = 3   # 清理时，保留最近几条工具结果

    KEEP_LAST_TURNS = 2            # 压缩时，原样保留最近几轮用户对话



    # 程序自己的状态（会话记录、后面的定时任务）放在工作区之外，Agent 的文件工具碰不到

    STATE_DIR = Path(os.environ.get("NAMI_STATE_DIR", Path.home() / ".nami-agent"))

    SESSION_DIR = STATE_DIR / "sessions"



    PLACEHOLDER = "[旧工具结果已清理，如需要请重新调用工具]"



    SUMMARY_PROMPT = """你是对话摘要器。把下面这段 Agent 的历史对话压缩成摘要，要求：

    1. 保留：用户的目标、已完成的步骤、关键结论、重要的文件路径和参数、尚未解决的问题

    2. 丢弃：寒暄、重复内容、工具返回的大段原文

    3. 用简洁的条目写，不要超过 500 字

    只输出摘要本身。"""





### 第 1 层：截断工具结果



大文件、长命令输出，最好在**进入 messages 之前** 就截断。保留头和尾，因为报错信息、命令结果通常在末尾。





    def truncate_tool_result(text, limit=MAX_TOOL_CHARS):

        if len(text) <= limit:

            return text

        half = limit // 2

        return f"{text[:half]}\n...[中间省略 {len(text) - limit} 字符]...\n{text[-half:]}"





第 2 课的 
`execute`
 已经把结果截到 8000 字、只留开头。这里是进入 messages 前的第二道，更短，并且头尾都留。



这一步要明确告诉模型"被省略了"。否则它会把截断后的内容当成完整内容，得出错误结论。



### 第 2 层：清理旧的工具结果



Agent 三步之前读过的那个文件内容，现在大概率已经不需要了。把旧的 tool 消息内容替换成占位符。



注意：**只改 content，不要删消息** 。API 要求每个 
`tool_call_id`
 都有对应的 tool 消息，删掉会直接报错。





    def clear_old_tool_results(messages, keep=KEEP_RECENT_TOOL_RESULTS):

        tool_idx = [i for i, m in enumerate(messages) if m["role"] == "tool"]

        old = tool_idx[:-keep] if keep > 0 else tool_idx

        for i in old:

            messages[i]["content"] = PLACEHOLDER





### 第 3 层：摘要压缩



当前两层都不够用时，把早期对话交给模型压成一段摘要。



这里有一个**必须处理的坑** ：不能随便从中间切。如果切在 assistant 的 
`tool_calls`
 和对应的 tool 消息之间，就会产生孤立的 tool 消息，API 会报错。



最稳的切法是**只在 user 消息处切** ，因为 user 消息一定是一个完整回合的开头。





    def split_for_compact(messages, keep_turns=KEEP_LAST_TURNS):

        """返回 (要被压缩的旧消息, 原样保留的新消息)；没有可压缩的内容返回 None。

        约定 messages[0] 是 system。"""

        user_idx = [i for i, m in enumerate(messages) if m["role"] == "user"]

        if len(user_idx) <= keep_turns:

            return None

        cut = user_idx[-keep_turns]

        return messages[1:cut], messages[cut:]





    def render_for_summary(msgs):

        lines = []

        for m in msgs:

            if m["role"] == "assistant" and m.get("tool_calls"):

                calls = ", ".join(

                    f'{c["function"]["name"]}({c["function"]["arguments"]})'

                    for c in m["tool_calls"]

                )

                if m.get("content"):

                    lines.append(f'[assistant] {m["content"]}')

                lines.append(f"[assistant 调用工具] {calls}")

            else:

                lines.append(f'[{m["role"]}] {m.get("content") or ""}')

        return "\n".join(lines)





    def compact(client, model, messages):

        parts = split_for_compact(messages)

        if parts is None:

            return messages

        old, recent = parts

        resp = client.chat.completions.create(

            model=model,

            messages=[

                {"role": "system", "content": SUMMARY_PROMPT},

                {"role": "user", "content": render_for_summary(old)},

            ],

        )

        summary = resp.choices[0].message.content

        return [

            messages[0],

            {"role": "user", "content": f"[以下是此前对话的摘要]\n{summary}"},

            {"role": "assistant", "content": "好的，我已了解之前的进展，继续。"},

            *recent,

        ]





结构是：
`system`
 \+ 摘要（user/assistant 成对）+ 最近几轮原文。角色交替保持正常。



### 会话持久化



messages 本身就是一个 list of dict，直接存 JSON 即可：





    def save_session(name, messages):

        SESSION_DIR.mkdir(parents=True, exist_ok=True)

        (SESSION_DIR / f"{name}.json").write_text(

            json.dumps(messages, ensure_ascii=False, indent=2), encoding="utf-8")





    def load_session(name):

        path = SESSION_DIR / f"{name}.json"

        if not path.exists():

            return None

        return json.loads(path.read_text(encoding="utf-8"))





这里有个前提：messages 里的每一项都得是**纯 dict** 。这就是第 1 课起我们一直用 
`msg.model_dump(exclude_none=True)`
 的原因。



**会话文件放在哪，是一个安全问题。** 会话记录里有你和 Agent 的全部对话。如果把它放在工作区里（比如 
`./.sessions/`
），Agent 就能用 
`read_file`
 读到，甚至用 
`write_file`
 改写自己的历史。所以它放在 
`~/.nami-agent/sessions/`
，在工作区之外，第 3 课的路径检查会把 Agent 的文件工具挡在外面（
`run_shell`
 仍然可以 
`cat`
 到它，但每条命令都要你确认）。原则是：**程序自己的状态，不和 Agent 能碰的文件放在一起。** 第 7 课的定时任务也会放在这里。



* * *



## 04接入 agent.py



只改循环里的几处，权限确认（第 3 课）的逻辑原样保留：





    # agent.py（只展示变化的部分）

    from context import (truncate_tool_result, clear_old_tool_results, compact,

                         save_session, load_session)



    SOFT_LIMIT = 16000   # 超过：清理旧工具结果

    HARD_LIMIT = 24000   # 超过：摘要压缩

    # 这两个是演示用的小值，方便你复现。实际按模型窗口的比例来设。



    usage = {"prompt_tokens": 0}   # 上一次调用的真实 token 数（第 6 课会收进 Session）





    def run(user_input, messages, perms):

        messages.append({"role": "user", "content": user_input})

        for _ in range(MAX_STEPS):

            # 用上一次调用的真实 token 数，决定这一轮要不要处理

            if usage["prompt_tokens"] > HARD_LIMIT:

                messages[:] = compact(client, MODEL, messages)

            elif usage["prompt_tokens"] > SOFT_LIMIT:

                clear_old_tool_results(messages)



            resp = client.chat.completions.create(model=MODEL, messages=messages, tools=get_schemas())

            usage["prompt_tokens"] = resp.usage.prompt_tokens if resp.usage else 0

            print(f"   [prompt_tokens={usage['prompt_tokens']}]")

            msg = resp.choices[0].message

            messages.append(msg.model_dump(exclude_none=True))



            if not msg.tool_calls:

                return msg.content or ""

            for call in msg.tool_calls:

                print(f"🔧 {call.function.name}({call.function.arguments[:80]})")

                result = handle_call(call, perms)          # 第 3 课的权限检查原样保留

                messages.append({"role": "tool", "tool_call_id": call.id,

                                 "content": truncate_tool_result(result)})   # 第 1 层

        return "（达到最大步数，已停止）"





主程序里加上会话的读写：





    def main():

        messages = load_session("default") or [{"role": "system", "content": SYSTEM}]

        perms = PermissionManager()

        while True:

            q = input("你> ").strip()

            if q in ("exit", "quit"):

                break

            print("\n" + run(q, messages, perms) + "\n")

            save_session("default", messages)





两个设计选择，说明一下理由：



**为什么用
`elif`
，而不是两层都做？** 压缩已经包含了"丢掉旧内容"的效果，没必要先清理再压缩。



**为什么不是每一轮都清理旧工具结果？** 因为修改历史消息会改变请求的前缀。如果你用的服务商支持前缀缓存，频繁改动前面的内容会让缓存失效。所以只在 token 数逼近上限时才动手。



* * *



## 05验证：不要只相信"看起来能跑"



**验证1：截断。** 不需要 API，直接断言：





    from context import truncate_tool_result



    text = "x" * 10000

    out = truncate_tool_result(text)

    assert len(out) < 4200

    assert "省略" in out

    assert truncate_tool_result("short") == "short"





**验证2：压缩后 tool 消息不能孤立。** 这是最容易出线上问题的地方，写个检查函数：





    def check_pairing(messages):

        """每条 tool 消息，前面必须有声明了该 tool_call_id 的 assistant 消息"""

        declared = set()

        for m in messages:

            if m["role"] == "assistant":

                for c in m.get("tool_calls") or []:

                    declared.add(c["id"])

            if m["role"] == "tool":

                assert m["tool_call_id"] in declared, f"孤立的 tool 消息: {m['tool_call_id']}"





构造一段包含多轮、多次工具调用的假 messages，调用 
`split_for_compact`
 切开后，对 
`[system] + recent`
 跑一遍 
`check_pairing`
，应该通过。配套代码的 
`tests/test_context.py`
 里有完整的测试，包括"清理只改内容、不删消息"和"会话文件不在工作区里"。



**验证3：真实跑一遍。** 把 
`SOFT_LIMIT`
 调到 3000、
`HARD_LIMIT`
 调到 6000，让 Agent 连续读几个大文件，观察每轮打印的 
`prompt_tokens`
：



  * 会先涨

  * 越过 SOFT_LIMIT 后，旧工具结果被替换，下一轮明显回落

  * 越过 HARD_LIMIT 后，出现摘要，数字大幅下降



三种现象都看到了，说明三层都生效了。



* * *



## 06这一版的局限



写教程不想只讲优点，这个实现有几处明确的短板：



  1. **摘要是有损的。** 摘要质量取决于你的 prompt 和模型，关键细节（比如某个具体的路径、参数）有可能丢。重要信息不要只靠摘要保存。

  2. **只能在 user 消息处切。** 如果用户只发了一条指令，Agent 自己跑了五十步，这一个回合内部没有可切的边界，只能靠第1、2层兜底。

  3. **阈值是经验值。** 16000 / 24000 只是演示。真实场景要按所用模型的窗口来定，并且给输出留出空间。

  4. **摘要会被反复摘要。** 第二次压缩时，上一次的摘要也在"旧消息"里，会被再压一遍，信息会逐轮衰减。



这些问题都不是靠再加一层就能彻底解决的，本质上是"有限窗口"这个约束决定的。



* * *



## 07主流 Agent 怎么做



三层"从便宜到贵"的思路，主流产品基本都是这么做的。区别在于第六节那几个局限，它们各自怎么补。



**Claude Code：先清理，再摘要。** 据第三方对它的拆解，Claude Code 在上下文接近上限时，先做一步不调用模型的清理，把旧的工具输出清掉（它叫 microcompact），只有不够时才做完整的摘要。和我们第 2 层、第 3 层的顺序一样。你还可以在项目说明里写"压缩时保留什么"，或者手动 
`/compact`
 时给出侧重点，这是在补"摘要可能丢掉关键细节"这个局限。



**Codex：摘要不再被反复摘要。** Codex 也是接近窗口上限时自动压缩。用它自家模型时，压缩交给 OpenAI 服务端完成，返回一段加密内容，下一轮由服务端解开；用其他模型时在本地做摘要，并给摘要打上标记，避免它在下次压缩时被再压一遍。这正好对应我们的局限 4。



**Pi：摘要有损，原文还在。** Pi 把会话存成一个 JSONL 文件，每条记录有自己的 
`id`
 和 
`parentId`
，整个会话是一棵树。压缩只影响发给模型的内容，完整历史一直留在文件里，用 
`/tree`
 可以回到任何一个节点，从那里分叉重来。它承认摘要有损，然后保证"损"的只是模型看到的那一份。



**Hermes：从"压缩"走向"检索"。** Hermes 用全文检索（SQLite 的 FTS5）索引过去所有的会话，需要时搜出相关片段，再让模型摘要。思路变了：与其把过去塞进窗口，不如需要时再找回来。这已经从"上下文管理"走到了"记忆"。



共同点是：**没有人能绕开有限窗口。** 大家做的都是同一件事：决定哪些内容留在窗口里，哪些压掉、清掉，或者放到窗口外，需要时再找回来。



## 08本课小结



  * 问题：messages 只增不减，工具结果是最大的体积来源

  * 方案：截断 → 清理 → 摘要，从便宜到贵逐层升级

  * 触发：用 API 返回的 
`usage.prompt_tokens`
，不自己估算

  * 红线：不能破坏 
`tool_calls`
 与 tool 消息的配对，只在 user 消息处切

  * 附带：messages 是纯 dict，所以持久化就是一次 
`json.dump`




到这里，Agent 已经具备：循环、工具、安全边界、上下文管理。一个能长时间稳定工作的最小 Agent，骨架基本齐了。



## 下期预告：Skills



上下文管理解决的是"历史太长"。还有一类内容，长度是你自己加上去的：给 Agent 的各种规矩和说明。全塞进 system prompt，每一轮都要付费。下一课讲怎么让它按需加载。



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-04/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-04)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[Context Compaction Showdown: How Codex CLI, Claude Code, and 5 Other Agents Handle Full Context Windows](https://codex.danielvaughan.com/2026/04/10/context-compaction-showdown-coding-agents/)
（第三方分析）

  * 
[Pi coding agent（pi.dev）](https://pi.dev/)


  * 
[Hermes Agent（GitHub）](https://github.com/NousResearch/hermes-agent)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



