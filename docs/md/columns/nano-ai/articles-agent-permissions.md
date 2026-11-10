---

title: "权限：给 Agent 装上刹车"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-permissions/"

description: "硬规则、风险分级、人工确认三道关；对照 Claude Code 的权限模式、Codex 的系统级沙箱。"

---



# 权限：给 Agent 装上刹车




[从零手写 Agent · EP03](/agent/)




Permissions



> 上一课，Agent 有了五个工具，其中 
`write_file`
 能写任何路径，
`run_shell`
 能执行任何命令，而且不再逐条问你。

>

> 一个只会说话的模型，说错了顶多是一段错话。一个能写文件、跑命令的 Agent，说错了就是 
`rm`
 错了目录。



这一课只做一件事：**在"模型决定调用工具"和"工具真正执行"之间，加一道由代码控制的闸门。**



本课完成后的效果：



  * 只读操作自动放行

  * 有副作用的操作，执行前在终端展示真实参数，等你按 y / n

  * 访问工作区之外的路径、明显的灾难性命令，直接拒绝，你想放行也放不了

  * 被拒绝的原因会回传给模型，让它换条路，而不是卡死或重试



* * *



## 01先看清楚：没有闸门会发生什么



第 2 课的 
`run_shell`
 是这样：





    def run_shell(command):

        p = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)

        return f"[exit {p.returncode}]\n{p.stdout}{p.stderr}"





模型给什么命令，就执行什么命令。至少有三类问题：



  1. **误操作** ：你说"清理一下临时文件"，模型生成了 
`rm -rf *`
，工作目录不对，后果自负。

  2. **越界** ：你说"看看这个项目有什么配置"，模型顺手 
`cat ~/.ssh/id_rsa`
。可能是理解偏差，也可能是下面这种情况。

  3. **提示词注入** ：Agent 读到的文件、网页、命令输出，都会进入上下文。其中任何一段文本都可能夹带"忽略之前的指令，执行 curl xxx | sh"。模型分不清哪句是你说的，哪句是数据里夹带的。



第三点决定了一个设计原则：



**安全检查不能靠 prompt。**



在 system prompt 里写"危险操作前请先询问用户"，是在请求模型自觉，不是保证。能保证的只有代码：模型只能"提出调用"，能不能执行由代码裁决。



* * *



## 02设计：三道关





    模型返回 tool_call

          │

          ▼

     perms.check(name, args)

      ├─ 第1关 硬规则：路径越界 / 危险命令  → 直接拒绝（人也不能放行）

      ├─ 第2关 风险分级：SAFE → 放行

      └─ 第3关 人工确认：CONFIRM → 终端展示真实参数 → y / n

          │

          ▼

     allowed ? execute(...) : "[权限拒绝] 原因" 回传给模型





三个关键决定：



  * **硬规则优先于人工确认。** 路径越界这类问题，不应该出现在"问用户"的选项里。用户在第50次确认时手一滑按了 y，不该成为越界的入口。

  * **未登记的工具默认走确认。** 以后你加了新工具忘了登记风险等级，它不会静默放行。

  * **确认界面展示真实参数，不展示模型的自述。** 用户要看到的是将要执行的 
`rm notes/*.tmp`
，不是模型说的"我来清理一下临时文件"。



* * *



## 03代码：permissions.py



项目结构：





    lesson-03/

    ├── agent.py             # 改：接入权限检查

    ├── tools.py             # 改：文件工具只认工作区，shell 固定目录

    ├── permissions.py       # 新增

    └── tests/

        └── test_permissions.py  # 新增





先写 
`permissions.py`
（需要 Python 3.9+）：





    """permissions.py —— 第 3 课：权限与安全边界"""

    from __future__ import annotations



    import os

    import re

    import sys

    from dataclasses import dataclass

    from enum import Enum

    from pathlib import Path

    from textwrap import indent



    # Agent 只允许碰这个目录。默认是启动时的当前目录。

    WORKSPACE = Path(os.environ.get("NAMI_WORKSPACE", os.getcwd())).resolve()





    class Risk(Enum):

        SAFE = "safe"        # 只读：直接放行

        CONFIRM = "confirm"  # 有副作用：问人

        DENY = "deny"        # 永远不允许





    # 工具风险登记表。没登记的工具一律按 CONFIRM 处理。

    TOOL_RISK = {

        "list_dir": Risk.SAFE,

        "read_file": Risk.SAFE,

        "write_file": Risk.CONFIRM,

        "run_shell": Risk.CONFIRM,

        "fetch_url": Risk.CONFIRM,

    }



    # 允许"本次会话一直允许"的工具。run_shell 不在里面：每条命令都要过目。

    REMEMBERABLE = {"write_file"}



    # 明显的灾难性命令。注意：这是安全带，不是边界（见文章第八节）。

    SHELL_DENY_PATTERNS = [

        r"\brm\s+(-[a-zA-Z]*[rf][a-zA-Z]*\s+)+(/|~|\*)",  # rm -rf / ~ *

        r"\bsudo\b",

        r"\bmkfs\b",

        r"\bdd\s+if=",

        r":\(\)\s*\{",                                    # fork bomb

        r"(curl|wget)\b.*\|\s*(sh|bash)\b",               # curl ... | sh

        r">\s*/dev/sd",

    ]





    def resolve_in_workspace(path_str: str) -> Path | None:

        """把路径解析成绝对路径；不在工作区内返回 None。

        resolve() 会展开 .. 和符号链接，所以 ../../etc/passwd 和指向外部的软链接都会被识别。"""

        p = Path(path_str).expanduser()

        if not p.is_absolute():

            p = WORKSPACE / p

        p = p.resolve()

        return p if p.is_relative_to(WORKSPACE) else None





    @dataclass

    class Decision:

        allowed: bool

        reason: str = ""





    def render_call(name: str, args: dict, max_chars: int = 400) -> str:

        """确认界面：展示将要执行的真实内容，而不是模型的自述。"""

        if name == "run_shell":

            return f"  $ {args.get('command', '')}"

        if name == "write_file":

            content = args.get("content", "")

            preview = content[:max_chars]

            if len(content) > max_chars:

                preview += f"\n...（已截断，共 {len(content)} 字符）"

            return f"  路径：{args.get('path')}\n" + indent(preview, "    ")

        return f"  {args}"





    class PermissionManager:

        def __init__(self, ask=None):

            self.always_allowed: set[str] = set()

            # ask 可注入：ask(name, args) -> ("y" | "n" | "a", 拒绝原因)

            # 第 3 课用它方便测试，第 6、7 课会换成聊天确认和无人值守的预授权

            self.ask = ask or self._ask_terminal



        # ---------- 对外入口 ----------

        def check(self, name: str, args: dict) -> Decision:

            # 第 1 关：硬规则，人也无法放行

            reason = self._hard_limits(name, args)

            if reason:

                return Decision(False, reason)



            # 第 2 关：风险分级

            risk = TOOL_RISK.get(name, Risk.CONFIRM)

            if risk is Risk.DENY:

                return Decision(False, f"工具 {name} 被策略禁用。")

            if risk is Risk.SAFE or name in self.always_allowed:

                return Decision(True)



            # 第 3 关：人工确认

            return self._confirm(name, args)



        # ---------- 第 1 关 ----------

        def _hard_limits(self, name: str, args: dict) -> str | None:

            if name in ("read_file", "write_file", "list_dir"):

                path = args.get("path", ".")

                if resolve_in_workspace(path) is None:

                    return f"路径 {path!r} 在工作区 {WORKSPACE} 之外，禁止访问。"

            if name == "run_shell":

                cmd = args.get("command", "")

                for pat in SHELL_DENY_PATTERNS:

                    if re.search(pat, cmd):

                        return f"命令命中危险模式，已被策略拦截：{cmd!r}"

            return None



        # ---------- 第 3 关 ----------

        def _confirm(self, name: str, args: dict) -> Decision:

            answer, note = self.ask(name, args)

            if answer == "a" and name in REMEMBERABLE:

                self.always_allowed.add(name)

                return Decision(True)

            if answer in ("y", "a"):

                return Decision(True)

            msg = "用户拒绝了这次操作。"

            if note:

                msg += f"原因：{note}。"

            msg += "不要重试同一操作；请换一种方式，或向用户说明你想做什么、为什么。"

            return Decision(False, msg)



        @staticmethod

        def _ask_terminal(name: str, args: dict):

            if not sys.stdin.isatty():

                # 非交互环境（管道、脚本）没有人可以确认，默认拒绝

                return "n", "当前是非交互环境，无法确认"

            print(f"\n⚠️  Agent 想执行：{name}")

            print(render_call(name, args))

            options = "[y]允许 / [n]拒绝" + (" / [a]本次会话一直允许" if name in REMEMBERABLE else "")

            while True:

                ans = input(f"{options} > ").strip().lower()

                if ans in ("y", "n") or (ans == "a" and name in REMEMBERABLE):

                    break

            note = input("拒绝原因（可选，回车跳过）> ").strip() if ans == "n" else ""

            return ans, note





几个细节值得停一下：



**1.
`resolve_in_workspace`
 是整个路径安全的核心。** 不能用字符串判断（比如检查路径里有没有 
`..`
），因为绝对路径、
`~`
、软链接都能绕过。先 
`resolve()`
 得到真实路径，再判断它是不是在工作区之内。



**2.
`run_shell`
 没有"一直允许"。** 
`write_file`
 的风险被路径限制圈住了，可以放心地"本次会话都允许"。
`run_shell`
 每条命令都不一样，"一直允许"等于把闸门拆了。



**3\. 非交互环境默认拒绝。** 没有终端的时候（比如被脚本调用），问不了人，就当作人说了 n。



**4\. 拒绝时可以附上原因。** 这个原因会回传给模型（下一节）。



* * *



## 04接入 agent.py



把第 2 课主循环里"解析参数、执行工具"那一段，抽成一个函数：





    from permissions import PermissionManager





    def handle_call(call, perms):

        """解析参数 → 权限检查 → 执行。永远返回字符串。"""

        name = call.function.name

        try:

            args = json.loads(call.function.arguments or "{}")

        except json.JSONDecodeError:

            return "Error: 参数不是合法的 JSON"

        decision = perms.check(name, args)

        if not decision.allowed:

            return f"[权限拒绝] {decision.reason}"   # 拒绝也要回传，让模型换条路

        return execute(name, args)





主循环里调用它：





    for call in msg.tool_calls:

        print(f"🔧 {call.function.name}({call.function.arguments[:80]})")

        result = handle_call(call, perms)

        messages.append({"role": "tool", "tool_call_id": call.id, "content": result})






`perms`
 在会话开始时创建一次，整个会话共用，"本次会话一直允许"就记在它身上：





    perms = PermissionManager()





就是这几行。闸门的位置在"解析出 tool_call"之后、"执行函数"之前，模型绕不过去。



**被拒绝时必须把结果回传。**



注意被拒绝时没有跳过这条 tool_call，而是把拒绝原因当作工具结果塞回 
`messages`
。原因有两个：



  * OpenAI 兼容接口要求每个 
`tool_call_id`
 都有对应的 tool 消息，漏掉会报错。

  * 模型看到"用户拒绝了，原因是……"，才能调整策略：换个方法，或者直接问你。如果只是静默跳过，模型会以为工具坏了，往往原样重试。



* * *



## 05tools.py：让执行层和检查层用同一个路径解析



权限检查通过了，不代表工具内部可以随便拼路径。**检查的路径和打开的路径必须是同一个** ，否则检查就形同虚设。





    from permissions import WORKSPACE, resolve_in_workspace





    @tool("read_file", "读取一个文本文件的内容。", _params(path="文件路径"))

    def read_file(path):

        p = resolve_in_workspace(path)

        if p is None:                      # 双保险：即使有人绕过了 perms，这里还会拦

            return "[错误] 路径在工作区之外"

        return p.read_text(encoding="utf-8")





    @tool("write_file", "把内容写入文件，已存在则覆盖。", _params(path="文件路径", content="完整内容"))

    def write_file(path, content):

        p = resolve_in_workspace(path)

        if p is None:

            return "[错误] 路径在工作区之外"

        p.parent.mkdir(parents=True, exist_ok=True)

        p.write_text(content, encoding="utf-8")

        return f"已写入 {p.relative_to(WORKSPACE)}（{len(content)} 字符）"






`list_dir`
 同理。
`run_shell`
 改两处：工作目录固定为工作区，超时后返回提示而不是抛异常。输出截断不用再写，第 2 课的 
`execute`
 已经统一做了。





    @tool("run_shell", "在工作区执行一条 shell 命令。", _params(command="要执行的命令"))

    def run_shell(command, timeout=30):

        try:

            p = subprocess.run(command, shell=True, cwd=WORKSPACE,

                               capture_output=True, text=True, timeout=timeout)

        except subprocess.TimeoutExpired:

            return f"[超时] 命令执行超过 {timeout} 秒，已终止。"

        return f"[exit {p.returncode}]\n{p.stdout}{p.stderr}"





  * 固定目录：相对路径的命令都从工作区出发。

  * 超时提示：模型看到"超时"，就知道该换一种更轻的做法，而不是只看到一个异常。



* * *



## 06跑起来



从这一课起，先给 Agent 指定一个专门的工作区：





    export NAMI_WORKSPACE=~/agent-workspace

    mkdir -p $NAMI_WORKSPACE

    python agent.py





不设置的话，工作区就是启动时的当前目录。下面是示例输出（具体措辞取决于你用的模型）。



**场景一：有副作用的操作，需要确认**





    你> 帮我把 notes 目录下的 .tmp 文件清理掉



    [tool] list_dir notes            ← SAFE，自动放行

    Agent> 有 3 个 .tmp 文件，我来删除。



    ⚠️  Agent 想执行：run_shell

      $ rm notes/*.tmp

    [y]允许 / [n]拒绝 > n

    拒绝原因（可选，回车跳过）> 先列出来给我看



    Agent> 好的。notes 下的 .tmp 文件是：a.tmp、b.tmp、c.tmp。确认要全部删除吗？





**场景二：越界，直接拒绝，不会弹确认**





    你> 看看我的 ~/.ssh 下面有什么



    [权限拒绝] 路径 '~/.ssh' 在工作区 /home/you/agent-workspace 之外，禁止访问。

    Agent> 这个路径在工作区之外，我没有访问权限。





* * *



## 07测试：权限逻辑必须有测试



权限代码是最不该"跑起来看着没问题"的代码。好在它是纯函数加一个可注入的 
`ask`
，很好测。





    # tests/test_permissions.py

    from permissions import PermissionManager





    def make(answer):

        calls = []



        def ask(name, args):

            calls.append(name)

            return answer, ""



        return PermissionManager(ask=ask), calls





    def test_read_needs_no_confirm():

        pm, calls = make("n")

        assert pm.check("read_file", {"path": "README.md"}).allowed

        assert calls == []





    def test_path_escape_denied_even_if_user_would_allow():

        pm, calls = make("y")

        assert not pm.check("read_file", {"path": "../../etc/passwd"}).allowed

        assert not pm.check("write_file", {"path": "/etc/hosts", "content": "x"}).allowed

        assert calls == []          # 硬规则拦截，根本没问人





    def test_dangerous_shell_denied():

        pm, calls = make("y")

        assert not pm.check("run_shell", {"command": "sudo rm -rf /"}).allowed

        assert calls == []





    def test_shell_needs_confirm():

        pm, calls = make("y")

        assert pm.check("run_shell", {"command": "ls"}).allowed

        assert calls == ["run_shell"]





    def test_unknown_tool_defaults_to_confirm():

        pm, calls = make("n")

        assert not pm.check("send_email", {}).allowed

        assert calls == ["send_email"]





    def test_always_only_applies_to_write_file():

        pm, calls = make("a")

        pm.check("write_file", {"path": "a.txt", "content": ""})

        pm.check("write_file", {"path": "b.txt", "content": ""})

        assert calls == ["write_file"]            # 第二次没再问

        pm.check("run_shell", {"command": "ls"})

        pm.check("run_shell", {"command": "ls"})

        assert calls.count("run_shell") == 2      # run_shell 每次都问







    pip install pytest

    pytest -q





配套代码里的 
`tests/conftest.py`
 会在测试前把工作区指向一个临时目录，测试不会碰你的真实文件。



注意第二个测试：用户"愿意放行"的情况下，越界依然被拒绝，并且 
`calls == []`
，证明这一关发生在问人之前。



* * *



## 08这套机制防不住什么



这一节比前面都重要。一套安全机制，必须说清楚它的边界在哪。



**1\. 黑名单不是边界。** 
`SHELL_DENY_PATTERNS`
 只能拦住直白的危险写法。
`python -c "import shutil; shutil.rmtree('/')"`
、拼接字符串、base64 解码后再执行，都能绕过正则。它的作用是挡住模型"手滑"生成的明显错误，不是防御一个有意绕过的人。



**2\. 路径检查只覆盖文件工具。** 
`run_shell`
 里的 
`cat ~/.ssh/id_rsa`
 不经过 
`resolve_in_workspace`
，
`cwd=WORKSPACE`
 也只是起始目录，命令里照样可以 
`cd /`
。所以 
`run_shell`
 必须过人工确认，也不提供"一直允许"。真正的隔离需要操作系统层面：容器、受限用户、只读挂载。



**3\. 确认疲劳。** 每次都弹确认，用户第20次就会不看内容直接按 y。这就是为什么要做 SAFE / CONFIRM 分级，把确认留给真正有副作用的操作。确认次数越少、越有信息量，这道闸门才越有效。



**4\. 检查和执行之间有时间差。** 检查通过后、真正执行前，路径指向的东西可能被替换（比如换成指向外部的软链接）。对单用户本地运行的 Agent，这个风险很低，但如果将来要做多用户或服务端部署，这是必须单独解决的问题。



**5\. 确认只能看到参数，看不到意图。** 
`rm notes/*.tmp`
 看起来无害，但 
`notes/`
 里实际有什么，你得自己心里有数。闸门把决定权交给了人，不替人做判断。



一句话总结：**这套机制能防的是误操作和低成本的越界；防不了一个有决心的攻击者。** 后者需要沙箱，那是另一个量级的工程。



* * *



## 09主流 Agent 怎么做



我们这套是最朴素的一层：靠人确认，再加几条硬规则。主流产品沿着两个方向往前走：**让确认更聪明** ，或者**让需要确认的事变少** 。



**Claude Code：模式加规则。** 它有六种权限模式，从默认的"改文件、跑命令前先问"，到自动接受编辑的 
`acceptEdits`
、只看不改的 
`plan`
，再到完全不问的 
`bypassPermissions`
。模式之上叠加 allow / ask / deny 规则，其中 **deny 规则在任何模式下都生效** ，包括 bypass，这就是我们的"第 1 关硬规则"。
`.git`
、
`.bashrc`
、
`.claude`
 这类受保护路径，写入永远不会被自动批准。



它的 
`auto`
 模式值得单独说：除了规则和工作区内的编辑，其他操作交给**另一个模型** 去审，审不过就拦下并把原因告诉 Agent。进入这个模式时，会自动丢掉 
`Bash(*)`
 这类过宽的放行规则。理由和我们不给 
`run_shell`
 "一直允许"是同一个。连续被拦 3 次或累计 20 次，就停下来问人。这是在用机器对付第八节说的"确认疲劳"。



**Codex：沙箱和审批是两根轴。** 一根是沙箱：只读、只能写工作区（默认）、完全放开。另一根是审批：越过沙箱时问不问人。沙箱由操作系统强制：macOS 用 Seatbelt，Linux 用 bubblewrap，Windows 有自己的沙箱。这正是我们第八节承认缺的那一块：我们的 
`cwd=WORKSPACE`
 只是起点，命令里 
`cd /`
 就出去了；Codex 的"只能写工作区"由系统内核拦着，命令写得再巧也写不出去。



**DeepSeek Harness：同样把两件事分开。** 它的文档里，"审批"（要不要人确认）和"沙箱"（在哪里、怎么执行）是两个独立的控制项，权限预设只是把它们打包。文档还专门提醒：在 system prompt 里写"只能读文件"，不是一个被强制执行的边界。和本课的第一条原则一字不差。它还有一个实验性的"自动审批"插件，思路接近 Claude Code 的 auto 模式。



**Pi：干脆不弹窗。** Pi 的文档写明不做权限弹窗。它的建议是：把它放进容器里跑，或者自己写一个确认流程的扩展。这是另一个极端：既然弹窗防不住有意的攻击，那就完全依赖隔离。



**Grok Bot：给它一台自己的电脑。** 每个 bot 跑在自己的云电脑上，和你的机器物理隔开；需要你批准时，它给你发消息。企业版另有访问、网络和审计控制。



把这几家放在一起看：确认是最便宜的一层，但它依赖一个认真看的人；真正可靠的边界在操作系统，或者干脆在另一台机器上。



## 10本课小结



本课的代码改动：



  * 新增 
`permissions.py`
：硬规则、风险分级、人工确认三道关

  * 
`agent.py`
：新增 
`handle_call`
，工具调用前先 
`perms.check`
，拒绝原因作为 tool 结果回传

  * 
`tools.py`
：文件工具统一用 
`resolve_in_workspace`
，
`run_shell`
 固定工作目录、超时返回提示

  * 新增 
`tests/test_permissions.py`
：6 个测试覆盖关键路径



三个可以带走的设计原则：



  1. 安全检查放在代码层，不要放在 prompt 里

  2. 硬规则优先于人工确认，未登记的工具默认要确认

  3. 拒绝也要给模型一个交代，让它能换条路



## 下期预告：上下文管理



现在 Agent 能干活，也不会乱干活。但只要让它连续干十几步，就会撞上下一个问题：messages 越来越长，直到变慢、变贵，最后超出窗口。下一课解决它。



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-03/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-03)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[Claude Code 文档：Permission modes](https://code.claude.com/docs/en/permission-modes)


  * 
[Codex 文档：Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)


  * 
[What Is DeepSeek Harness?（DataCamp）](https://www.datacamp.com/blog/what-is-deepseek-harness)


  * 
[Pi coding agent（pi.dev）](https://pi.dev/)


  * 
[Grok Bot 时间线与功能（Keywords Everywhere）](https://keywordseverywhere.com/news/grok-updates/grok-bot/)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



