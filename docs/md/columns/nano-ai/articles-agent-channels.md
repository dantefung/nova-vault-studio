---

title: "接入聊天软件：让 Agent 走出终端"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-channels/"

description: "Telegram 长轮询、聊天里确认、白名单与回滚；对照 OpenClaw、Hermes、Claude Code Channels、Grok Bot。"

---



# 接入聊天软件：让 Agent 走出终端




[从零手写 Agent · EP06](/agent/)




Channels



> 前五课，Agent 已经有了循环、工具、权限、上下文管理和技能。

>

> 但它有一个很朴素的限制：**你得坐在电脑前，开着终端，才能用它。**



这一课把它接到 Telegram 上。效果是：



  * 在手机上给机器人发消息，家里或服务器上的 Agent 收到后干活，再把结果发回来

  * 遇到需要确认的操作，它在聊天里问你，你回复 y 或 n

  * 只有白名单里的人能用，其他人发消息它一声不吭

  * 每个聊天有自己独立的会话，互不干扰



新增代码约 150 行，Agent 的核心逻辑几乎不动。



* * *



## 01问题：Agent 和终端绑死了



翻一下现在的代码，有两处直接和终端打交道：





    # agent.py 的 main()

    q = input("你> ").strip()



    # permissions.py 的 _ask_terminal()

    ans = input(f"{options} > ")





一处是"收任务"，一处是"问确认"。只要这两处还是 
`input()`
，Agent 就只能活在终端里。



好消息是，第 3 课设计 
`PermissionManager`
 时留了一个口子：
`ask`
 可以从外面传进去。当时是为了方便测试，这一课它派上了真正的用场。



* * *



## 02思路：核心不动，只换输入输出





              ┌──────────── Agent 核心（不变）────────────┐

     消息  →  │ Session: messages + perms + token 计数      │  →  回复

              │ run(): 循环 / 工具 / 权限 / 上下文 / 技能   │

              └─────────────────────────────────────────────┘

                   ↑ ask(name, args) 由渠道提供





渠道只负责三件事：收消息、发消息、在需要确认时问人。



为什么选 Telegram 做示范：它的 Bot API 支持**长轮询** （
`getUpdates`
），程序主动去拉消息，不需要公网 IP，不需要配回调地址，在自己电脑上就能跑；而且是纯 HTTP 接口，用标准库 
`urllib`
 就够了，不用装 SDK。



需要提醒的是，国内网络访问 Telegram 需要你自行解决网络环境。如果你更常用飞书、企业微信或钉钉，它们都有各自的机器人接口，接入方式不同，但只要实现同样的"收、发、问"三件事，Agent 这边的代码不用改。



* * *



## 03先重构：把会话状态收进 Session



第 4 课用了一个模块级变量记录上一次的 token 数：





    usage = {"prompt_tokens": 0}





只有一个终端、一个会话的时候，这样没问题。接入聊天软件后，可能有好几个聊天同时存在，A 聊天的 token 数会决定 B 聊天要不要压缩。这是一个典型的"单用户时代的全局变量，多用户时代的 bug"。



所以把一个会话需要的东西收进一个类：





    class Session:

        """一个会话 = 一份 messages + 一个权限管理器 + 上一次的 token 数"""



        def __init__(self, name, ask=None, persist=True):

            self.name = name

            self.persist = persist

            saved = load_session(name) if persist else None

            self.messages = saved or [{"role": "system", "content": ""}]

            self.messages[0] = {"role": "system", "content": build_system()}  # 每次用最新的技能列表

            self.perms = PermissionManager(ask=ask)

            self.prompt_tokens = 0



        def save(self):

            if self.persist:

                save_session(self.name, self.messages)





权限管理器也放进来了。第 3 课的"本次会话一直允许"记录在 
`perms.always_allowed`
 里，它本来就应该跟着会话走，而不是全局共享。




`run()`
 改为接收 Session，循环本身和第 5 课一样：





    def run(session, user_input, client, model=MODEL, log=print):

        messages = session.messages

        messages.append({"role": "user", "content": user_input})

        for _ in range(MAX_STEPS):

            if session.prompt_tokens > HARD_LIMIT:

                messages[:] = compact(client, model, messages)

            elif session.prompt_tokens > SOFT_LIMIT:

                clear_old_tool_results(messages)



            resp = client.chat.completions.create(model=model, messages=messages, tools=get_schemas())

            session.prompt_tokens = resp.usage.prompt_tokens if resp.usage else 0

            msg = resp.choices[0].message

            messages.append(msg.model_dump(exclude_none=True))



            if not msg.tool_calls:

                return msg.content or ""

            for call in msg.tool_calls:

                log(f"🔧 {call.function.name}({call.function.arguments[:80]})")

                result = handle_call(call, session.perms)

                messages.append({"role": "tool", "tool_call_id": call.id,

                                 "content": truncate_tool_result(result)})

        return "（达到最大步数，已停止）"






`client`
 也从全局变量改成参数传入，由一个小函数创建：





    def make_client():

        from openai import OpenAI

        return OpenAI(api_key=os.environ["API_KEY"],

                      base_url=os.environ.get("BASE_URL", "https://api.deepseek.com"))





这样测试时可以塞一个假的客户端进去，不用真的调模型。



终端版的 
`main()`
 改成：





    def main():

        client = make_client()

        session = Session("default")       # ask 不传，默认还是终端确认

        while True:

            q = input("你> ").strip()

            if q in ("exit", "quit"):

                break

            print("\n" + run(session, q, client) + "\n")

            session.save()





终端版照常能用。重构的标准就是这个：行为不变，结构变了。



* * *



## 04渠道：telegram.py





    """telegram.py —— 第 6 课：Telegram 渠道（长轮询，不需要公网 IP）"""

    import json

    import urllib.request



    MAX_LEN = 4000   # Telegram 单条上限 4096，留点余量





    class Telegram:

        def __init__(self, token, timeout=30):

            self.base = f"https://api.telegram.org/bot{token}/"

            self.timeout = timeout

            self.offset = 0

            self.pending = []      # 等待确认期间收到的"别的消息"，稍后处理



        def _call(self, method, **params):

            req = urllib.request.Request(self.base + method, data=json.dumps(params).encode(),

                                         headers={"Content-Type": "application/json"})

            with urllib.request.urlopen(req, timeout=self.timeout + 10) as r:

                body = json.loads(r.read())

            if not body.get("ok"):

                raise RuntimeError(f"Telegram API 错误：{body}")

            return body["result"]



        def fetch(self, timeout=None):

            """只拉新消息。返回 [(chat_id, user_id, text)]，只要私聊文本。"""

            updates = self._call("getUpdates", offset=self.offset,

                                 timeout=self.timeout if timeout is None else timeout)

            out = []

            for u in updates:

                self.offset = u["update_id"] + 1     # 确认已收到，下次不再返回

                m = u.get("message")

                if m and "text" in m and m["chat"]["type"] == "private":

                    out.append((m["chat"]["id"], m["from"]["id"], m["text"]))

            return out



        def poll(self, timeout=None):

            """先交出积压的消息，没有积压再去拉新的。"""

            if self.pending:

                out, self.pending = self.pending, []

                return out

            return self.fetch(timeout)



        def send(self, chat_id, text):

            text = text or "（空回复）"

            for i in range(0, len(text), MAX_LEN):

                self._call("sendMessage", chat_id=chat_id, text=text[i:i + MAX_LEN])





几个要点：



**长轮询是怎么工作的。** 
`getUpdates`
 带上 
`timeout=30`
，如果没有新消息，服务器会把请求挂住最多 30 秒再返回，有消息则立即返回。所以这个循环不会空转。
`offset`
 设为"最后一条的 id + 1"，表示之前的都已收到，下次不再返回。



**只处理私聊。** 群聊里有很多人，"谁在确认"会变得说不清。第一版先只做私聊。



**长消息要切段。** 单条消息有长度上限，Agent 的回复可能更长，所以 
`send`
 按 4000 字切开发送。



**
`fetch`
 和 
`poll`
 分开。** 这是为下一节的"聊天里确认"准备的。



* * *



## 05在聊天里确认：ask 的第二种实现



第 3 课的终端确认是"打印参数，等你输入"。聊天版本是"发一条消息，等你回复"：





    def make_chat_ask(channel, chat_id, wait=CONFIRM_WAIT):

        def ask(name, args):

            opts = "y 允许 / n 拒绝（可附原因，如：n 先列出来给我看）"

            if name in REMEMBERABLE:

                opts += " / a 本会话一直允许"

            channel.send(chat_id, f"⚠️ Agent 想执行：{name}\n{render_call(name, args)}\n\n"

                                  f"回复 {opts}\n{wait} 秒内不回复视为拒绝。")

            deadline = time.time() + wait

            while time.time() < deadline:

                left = max(1, int(deadline - time.time()))

                for c, u, text in channel.fetch(timeout=min(20, left)):

                    ans, _, note = text.strip().partition(" ")

                    if c == chat_id and ans.lower() in ("y", "n", "a"):

                        return ans.lower(), note.strip()

                    channel.pending.append((c, u, text))

            return "n", "确认超时"

        return ask





返回值的格式和终端版完全一样：
`(答案, 拒绝原因)`
。
`PermissionManager`
 不知道也不关心确认是从哪里来的。




`render_call`
 直接复用第 3 课的函数，确认消息里展示的依然是**真实参数** ，不是模型的自述。



有三个设计决定值得说明：



**1\. 超时等于拒绝。** 你可能在开会、在睡觉。没有回复时，最安全的默认值是"不做"。这和第 3 课"非交互环境默认拒绝"是同一个原则。



**2\. 等待期间收到的其他消息先存起来。** 在等你回 y/n 的这段时间里，你可能顺手发了别的消息，或者别的聊天来了消息。这些不能丢，也不能被误当成确认，所以放进 
`pending`
，等当前任务结束后由 
`poll()`
 交出来处理。这就是 
`fetch`
 和 
`poll`
 要分开的原因：等确认时只拉新消息，不碰积压的。



**3\. 拒绝原因可以直接跟在 n 后面。** 回复"n 先列出来给我看"，原因会回传给模型，它会换一种做法。在手机上打字不方便，一条消息说完比两步交互顺手。



* * *



## 06主程序：bot.py





    """bot.py —— 第 6 课：常驻的 Agent"""

    import os

    import sys

    import time



    from agent import Session, run, make_client

    from context import SESSION_DIR

    from permissions import REMEMBERABLE, render_call

    from telegram import Telegram



    ALLOWED = {int(x) for x in os.environ.get("TG_ALLOWED_USERS", "").split(",") if x.strip()}

    CONFIRM_WAIT = 120



    # make_chat_ask 见上一节





    def handle_message(tg, client, sessions, chat_id, user_id, text):

        if user_id not in ALLOWED:

            print(f"[忽略] 非白名单用户 {user_id}")

            return

        if text.strip() == "/reset":

            sessions.pop(chat_id, None)

            (SESSION_DIR / f"tg-{chat_id}.json").unlink(missing_ok=True)

            tg.send(chat_id, "会话已重置。")

            return



        s = sessions.get(chat_id)

        if s is None:

            s = sessions[chat_id] = Session(f"tg-{chat_id}", ask=make_chat_ask(tg, chat_id))

        backup = list(s.messages)

        try:

            reply = run(s, text, client)

        except Exception as e:

            s.messages[:] = backup          # 回滚，避免留下没有配对的 tool_calls

            reply = f"[出错，本轮已撤销] {type(e).__name__}: {e}"

        s.save()

        tg.send(chat_id, reply)





    def main():

        if not ALLOWED:

            sys.exit("必须设置 TG_ALLOWED_USERS（逗号分隔的 Telegram 用户 ID），否则任何人都能操作你的电脑。")

        tg = Telegram(os.environ["TG_BOT_TOKEN"])

        client = make_client()

        sessions = {}

        print("nami-agent 已启动")

        while True:

            try:

                batch = tg.poll()

            except Exception as e:

                print(f"[轮询出错] {e}，5 秒后重试")

                time.sleep(5)

                continue

            for chat_id, user_id, text in batch:

                handle_message(tg, client, sessions, chat_id, user_id, text)





    if __name__ == "__main__":

        main()





这里有两处比其他代码都重要。



### 1\. 白名单：不设置就不启动



机器人的用户名是公开的。任何人搜到它、发一条消息，消息就会到达你的程序。如果没有白名单，等于把你电脑上的一个能读写文件、能执行命令的程序，开放给了整个互联网。



所以白名单不是可选配置。
`ALLOWED`
 为空时程序直接退出，并说明原因。不在名单里的人发消息，程序只在本地打印一行日志，**不回复** ，不暴露这是一个 Agent。



### 2\. 出错要回滚



终端版出错了，程序崩掉，你看得见。常驻版必须扛住单次失败继续运行，否则一次网络抖动就要你去服务器上重启。



但只"接住异常"还不够。设想模型返回了两个 tool_calls，执行完第一个，第二次调用模型时网络断了。此时 messages 的末尾停在一个不完整的状态，下一次请求很可能被 API 拒绝，这个聊天就"坏掉"了。



所以在运行前备份 messages，出错就整轮撤销。注意这只能撤销**对话记录** ，已经写入的文件、已经执行的命令不会被撤销。回复里写的是"本轮已撤销"，但你心里要清楚撤销的范围。



* * *



## 07安全：威胁模型变了



从终端到聊天软件，不只是换了一个输入框。



| 终端版 | 聊天版

---|---|---

谁能发任务 | 坐在电脑前的人 | 任何能给机器人发消息的人

确认时你在哪 | 就在屏幕前 | 可能在地铁上，只看一眼手机

凭证 | API Key | API Key + Bot Token



对应的做法：



  1. **白名单必须有** ，上一节已经写死在代码里。

  2. **Bot Token 等同于控制权。** 拿到 token 的人可以冒充你的机器人收发消息。只放在环境变量里，不要写进代码、不要提交到仓库。泄露了就去 BotFather 重新生成。

  3. **给它一个专门的工作区。** 启动前设置 
`NAMI_WORKSPACE`
 指向一个专门的目录，不要指向你的主目录。第 3 课的路径限制会把它圈在里面。

  4. **在手机上确认要更谨慎。** 屏幕小，人容易一扫而过。这正是第 3 课坚持 
`run_shell`
 每次都确认、且没有"一直允许"的原因。



第 3 课第八节说过的边界依然成立：这些措施防的是误操作和低成本的越界，不是一个有决心的攻击者。



* * *



## 08跑起来



  1. 在 Telegram 里找 @BotFather，发送 
`/newbot`
，按提示起名，拿到 token。

  2. 给你的新机器人随便发一条消息，然后在浏览器打开 
`https://api.telegram.org/bot<你的token>/getUpdates`
，在返回内容里找到 
`"from":{"id":...}`
，这个数字就是你的用户 ID。

  3. 启动：







    export API_KEY=你的模型密钥

    export TG_BOT_TOKEN=你的机器人token

    export TG_ALLOWED_USERS=你的用户ID

    export NAMI_WORKSPACE=~/agent-workspace

    mkdir -p $NAMI_WORKSPACE

    python bot.py





注意第2步要在启动 
`bot.py`
 之前做。程序启动后会持续拉取消息，你在浏览器里就看不到了。



在手机上的效果大致是（示意）：





    你：workspace 里有哪些文件

    Agent：notes.txt、todo.md，以及 skills/ 目录。



    你：把 todo.md 里已完成的条目删掉

    Agent：⚠️ Agent 想执行：write_file

      路径：todo.md

        - [ ] 写第7课

        - [ ] 回复评论

    回复 y 允许 / n 拒绝（可附原因，如：n 先列出来给我看） / a 本会话一直允许

    120 秒内不回复视为拒绝。



    你：y

    Agent：已更新 todo.md，删除了 3 条已完成的条目。





* * *



## 09验证



确认逻辑是这一课最容易出错的地方，用一个假的渠道就能测，不需要真的连 Telegram：





    class FakeChannel:

        def __init__(self, incoming=()):

            self.incoming = list(incoming); self.sent = []; self.pending = []

        def fetch(self, timeout=None):

            return [self.incoming.pop(0)] if self.incoming else []

        def send(self, chat_id, text):

            self.sent.append((chat_id, text))





    def test_chat_ask_with_reason_and_buffer():

        ch = FakeChannel([(1, 1, "顺便问个问题"), (2, 2, "别的人"), (1, 1, "n 先列出来")])

        ask = make_chat_ask(ch, 1, wait=5)

        assert ask("run_shell", {"command": "rm a"}) == ("n", "先列出来")

        # 不是确认回复的消息都被留下来，没有丢、也没有被当成确认

        assert ch.pending == [(1, 1, "顺便问个问题"), (2, 2, "别的人")]

        # run_shell 不提供"一直允许"

        assert "a 本会话一直允许" not in ch.sent[0][1]





    def test_chat_ask_timeout():

        ask = make_chat_ask(FakeChannel(), 1, wait=1)

        assert ask("run_shell", {"command": "ls"}) == ("n", "确认超时")





再加一个测试，用一个"第二次调用就断网"的假模型客户端，验证白名单和回滚：非白名单用户发消息后 
`sent`
 为空、也不创建会话；断网后会话的 messages 回到只有 system 的状态。完整代码在配套代码的 
`tests/test_bot.py`
 里。



* * *



## 10这一版的局限



  1. **单线程，一次只做一件事。** 一个任务跑十几步时，其他消息都在排队。等你确认的那两分钟里，整个机器人都在等。

  2. **消息是"最多处理一次"。** 
`offset`
 在处理之前就已更新。如果处理到一半程序被杀掉，这条消息不会被重新拉取，等于丢了。

  3. **回滚只回滚对话。** 文件和命令的副作用不会被撤销。

  4. **等待确认时，你发的非 y/n 消息会被当成新任务。** 它会排在当前任务之后执行，而不是作为对当前确认的补充说明。

  5. **没有流式输出。** 任务跑完之前，你在手机上看不到任何进度，只能等最后的回复。



第1条是最影响体验的。解决它需要引入并发，而并发会带来"同一个会话被两个任务同时修改"的新问题。对个人助手来说，单线程的简单和可预期，目前比速度更重要。



* * *



## 11主流 Agent 怎么做



"Agent 住进聊天软件"是今年个人助手赛道的主线，几家的做法差别很大。



**OpenClaw：网关优先。** 它的核心不是循环，而是一个网关（gateway）：管理各个聊天渠道的消息路由、会话归属和投递。我们的 
`bot.py`
 就是一个只支持 Telegram、只支持私聊的最小网关。OpenClaw 今年初走红，后来连续出现安全问题和稳定性问题，热度明显回落，但"网关 + 渠道"这个结构被后来者继承了下来。



**Hermes：一个网关，多个平台。** 一个网关进程，同时接 Telegram、Discord、Slack、WhatsApp、Signal 和邮件，在一个平台上开始的对话可以换到另一个平台继续。它也提供从 OpenClaw 迁移的命令，可以把记忆、技能、命令白名单、消息设置导过来。



**Claude Code：Channels。** Anthropic 给 Claude Code 加了一个 Channels 功能，可以把 Telegram 或 Discord 接到一个正在运行的 Claude Code 会话上，在手机上给它发任务。思路和本课一样：核心不动，只换输入输出。



**Grok Bot：渠道就是它自己的 App。** 你在手机或电脑上给它派任务，同一段对话可以换设备接着聊。多个各有分工的 bot 还可以在群聊里互相发消息、协作。8 月底它又加了 X 连接器，可以搜帖子、看时间线和提及。



几家共同面对的，就是第七节那张表：**谁能给它发任务，确认时你在哪。** 白名单、聊天里确认、超时即拒绝，这三样在成熟产品里一样不少，只是做得更细。



## 12本课小结



  * 重构：会话状态收进 
`Session`
，
`client`
 改为参数，核心逻辑和 I/O 分离

  * 渠道：Telegram 长轮询，不需要公网 IP，标准库就能实现

  * 确认：复用第 3 课的 
`ask`
 注入点，在聊天里回复 y / n，超时视为拒绝

  * 安全：白名单不设置就不启动；出错回滚对话，避免会话损坏



现在 Agent 常驻了，但它依然是被动的：你不发消息，它什么都不做。



## 下期预告：定时任务与心跳



下一课：**定时任务与心跳** 。让它每天早上主动给你发一份汇总，或者每半小时检查一次有没有需要你注意的事。难点不在定时本身，而在于：**到点执行时，没有人在旁边确认。**



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-06/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-06)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[Hermes Agent vs OpenClaw: Deep Analysis of Runtime, Memory, and Agent Design（Kanaries）](https://docs.kanaries.net/articles/hermes-agent-vs-openclaw)


  * 
[Hermes Agent（GitHub）](https://github.com/NousResearch/hermes-agent)


  * 
[Claude Code 文档：Channels](https://code.claude.com/docs/en/channels)


  * 
[Anthropic turns Claude Code into an always-on AI agent with new channels feature（The Decoder）](https://the-decoder.com/anthropic-turns-claude-code-into-an-always-on-ai-agent-with-new-channels-feature/)


  * 
[Grok Bot 发布报道（GIGAZINE）](https://gigazine.net/gsc_news/en/20260812-spacexai-grok-bot/)


  * 
[Grok Bot 时间线与功能（Keywords Everywhere）](https://keywordseverywhere.com/news/grok-updates/grok-bot/)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



