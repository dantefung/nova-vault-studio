---

title: "工具系统：加工具不再改主循环"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-tools/"

description: "注册表 + 统一执行器，错误也是一种结果；对照 MCP、Pi 的 edit 工具和 Grok Bot 的「电脑即工具」。"

---



# 工具系统：加工具不再改主循环




[从零手写 Agent · EP02](/agent/)




Tool System



> 第 1 课我们用 100 行代码写出了最小 Agent。这一课让它真正好扩展：加工具只需要写一个函数，出错了它自己会修。



## 先回顾一下第 1 课



第 1 课的 Agent 只有三个零件：



  1. 一个 
`messages`
 列表，记录对话

  2. 一个循环，不断问模型"下一步做什么"

  3. 三个写死的工具函数，外加一份手写的工具说明



这个结构已经是 Agent 的骨架了。但它有两个很明显的问题：



  * 每加一个工具，都要改三个地方：写函数、写说明、登记到 
`TOOL_FUNCS`
，说明和函数还很容易对不上

  * 出错处理散落在主循环里：工具名不存在、参数不对、执行报错，各是各的情况



这一课要解决的就是这两件事。做完之后，你的 Agent 会具备这些能力：



  * 列目录、读写文件

  * 执行 shell 命令

  * 抓取网页内容

  * 工具出错时自己看报错、自己改参数重试



最后你会发现，**主循环几乎不用再改** ，往后加工具只是多写一个函数的事。



## 01一个工具由什么组成



第 1 课说过，模型本身**从不执行任何代码** ，它只返回"请帮我调用某个工具"的请求，执行的是你的代码。



从代码的角度看，一个工具由四个要素构成：



要素 | 作用 | 给谁看

---|---|---

name | 工具名称 | 模型、代码

description | 这个工具做什么、什么时候用 | 模型

parameters | 参数的 JSON Schema | 模型

func | 真正执行的 Python 函数 | 代码



前三项是给模型读的说明书，最后一项是给机器跑的实现。



这里有一个很多人忽略的点：**description 本质上是提示词** 。模型选不选这个工具、传什么参数，全靠它读你写的说明。描述写得含糊，工具再好也会被用错。



## 02工具注册：加工具不再改主循环



我们建一个 
`tools.py`
，核心是一个注册表加一个装饰器。





    # tools.py

    import subprocess

    import urllib.request

    from pathlib import Path



    MAX_OUTPUT = 8000   # 工具返回给模型的最大字符数

    TOOLS = {}          # 注册表：name -> {"schema": ..., "func": ...}





    def tool(name, description, parameters):

        """装饰器：把一个函数注册为工具"""

        def decorator(func):

            TOOLS[name] = {

                "schema": {"type": "function", "function": {

                    "name": name, "description": description, "parameters": parameters}},

                "func": func,

            }

            return func

        return decorator





    def get_schemas():

        """返回给模型看的全部工具说明书"""

        return [t["schema"] for t in TOOLS.values()]





    def _params(**props):

        """简写：所有参数都是必填的字符串"""

        return {"type": "object",

                "properties": {k: {"type": "string", "description": v} for k, v in props.items()},

                "required": list(props)}





之后每新增一个工具，只要在函数上面套一个 
`@tool(...)`
，注册表就自动多一项，主循环完全不用动。说明和函数写在一起，也不会再出现"改了函数忘了改说明"。




`_params`
 是一个偷懒的小函数：我们的工具参数都是字符串，不用每次手写一大段 JSON Schema。



## 03装上五个实用工具





    @tool("list_dir", "列出某个目录下的文件和子目录。", _params(path="目录路径，当前目录写 ."))

    def list_dir(path="."):

        p = Path(path)

        return "\n".join(sorted(x.name + ("/" if x.is_dir() else "") for x in p.iterdir())) or "(空目录)"





    @tool("read_file", "读取一个文本文件的内容。", _params(path="文件路径"))

    def read_file(path):

        return Path(path).read_text(encoding="utf-8")





    @tool("write_file", "把内容写入文件，已存在则覆盖，目录不存在会自动创建。",

          _params(path="文件路径", content="要写入的完整内容"))

    def write_file(path, content):

        p = Path(path)

        p.parent.mkdir(parents=True, exist_ok=True)

        p.write_text(content, encoding="utf-8")

        return f"已写入 {path}（{len(content)} 字符）"





    @tool("run_shell", "在当前目录执行一条 shell 命令，返回退出码、标准输出和错误输出。",

          _params(command="要执行的命令"))

    def run_shell(command):

        p = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)

        return f"[exit {p.returncode}]\n{p.stdout}{p.stderr}"





    @tool("fetch_url", "抓取一个网页或接口的文本内容。url 必须以 http 或 https 开头。",

          _params(url="完整的 URL"))

    def fetch_url(url):

        req = urllib.request.Request(url, headers={"User-Agent": "nami-agent"})

        with urllib.request.urlopen(req, timeout=15) as resp:

            return resp.read().decode("utf-8", errors="replace")





五个工具，加起来不到四十行。注意几个细节：



  * 
`run_shell`
 设了 30 秒超时，防止模型随手跑个死循环把程序卡死

  * 
`run_shell`
 的结果带上退出码，模型能分清"命令成功了但没输出"和"命令失败了"

  * 每个工具的 description 都说清了"做什么"和"参数是什么"

  * 工具函数本身**不处理异常** ，路径不存在就让它直接抛出，统一交给下面的执行器处理



## 04统一执行器：错误也是一种结果



这一步是整节课最关键的设计。在 
`tools.py`
 末尾加上：





    def execute(name, args):

        """执行工具，永远返回字符串，永远不抛异常"""

        if name not in TOOLS:

            return f"Error: 不存在工具 '{name}'，可用工具：{', '.join(TOOLS)}"

        try:

            result = str(TOOLS[name]
["func"](**args)
)

        except Exception as e:

            return f"Error: {type(e).__name__}: {e}"

        if len(result) > MAX_OUTPUT:

            result = result[:MAX_OUTPUT] + f"\n...（已截断，共 {len(result)} 字符）"

        return result





这里有三个设计选择，每一个都值得单独说一下。



**1\. 出错不抛异常，而是把错误当结果返回。**



如果工具一报错整个程序就崩，那 Agent 就只是一个脆弱的脚本。反过来，把报错信息原样交给模型，它就能看到发生了什么，然后自己决定怎么办：换个路径、改个参数、换条命令。



比如模型想读 
`config.txt`
，结果文件不存在。它会收到：





    Error: FileNotFoundError: [Errno 2] No such file or directory: 'config.txt'





接下来它多半会先调用 
`run_shell("ls")`
 看看目录里到底有什么，再重新读正确的文件。这个"看报错、自己修正"的过程，正是 Agent 和普通脚本最大的区别。



**2\. 工具名不存在、参数不对，也走同一条路。**



模型偶尔会编造一个不存在的工具名，或者漏传参数。这时 
`**args`
 展开会抛 
`TypeError`
，同样会被 
`except`
 接住并回传，不需要额外写判断。



**3\. 输出要截断。**



模型读一个 10 万行的日志文件，如果全部塞回对话，上下文瞬间被撑爆，费用也飙升。截断并告诉模型"被截断了"，它就知道可以换种方式（比如用 
`grep`
 或 
`head`
）去精确查看。



## 05改造主循环



现在把 
`agent.py`
 改成这样：





    # agent.py

    import json

    import os



    from openai import OpenAI



    from tools import get_schemas, execute



    client = OpenAI(

        api_key=os.environ["API_KEY"],

        base_url=os.environ.get("BASE_URL", "https://api.deepseek.com"),

    )

    MODEL = os.environ.get("MODEL", "deepseek-flash")

    MAX_STEPS = 20   # 防止模型陷入无限循环



    SYSTEM = ("你是一个能使用工具的助手，在用户当前目录下完成任务。"

              "必要时调用工具，完成后用简洁的语言汇报结果。")





    def run(user_input, messages):

        messages.append({"role": "user", "content": user_input})



        for _ in range(MAX_STEPS):

            resp = client.chat.completions.create(model=MODEL, messages=messages, tools=get_schemas())

            msg = resp.choices[0].message

            messages.append(msg.model_dump(exclude_none=True))



            # 没有工具调用，说明模型给出了最终回答

            if not msg.tool_calls:

                return msg.content or ""



            # 模型可能一轮里请求多个工具，每个都必须回应

            for call in msg.tool_calls:

                name = call.function.name

                try:

                    args = json.loads(call.function.arguments or "{}")

                except json.JSONDecodeError:

                    result = "Error: 参数不是合法的 JSON"

                else:

                    print(f"🔧 {name}({call.function.arguments[:80]})")

                    result = execute(name, args)

                messages.append({"role": "tool", "tool_call_id": call.id, "content": result})



        return "（达到最大步数，已停止）"





    if __name__ == "__main__":

        messages = [{"role": "system", "content": SYSTEM}]

        while True:

            q = input("你> ").strip()

            if q in ("exit", "quit"):

                break

            print("\n" + run(q, messages) + "\n")





还有一个变化：第 1 课是一次性的命令行任务，这一课改成了对话式的循环，
`messages`
 在多次提问之间保留，你可以接着上一个任务继续说。



和第 1 课相比，主循环里**不再有任何具体工具的名字** 。它只做三件事：问模型、分发工具调用、把结果放回去。往后无论加多少工具，这段代码都不用改。



有一个容易漏的地方：**参数解析失败也要回应。** 模型偶尔会生成不合法的 JSON。这时也必须给这个 
`tool_call_id`
 回一条 tool 消息，告诉它参数有问题，否则下一次请求会因为缺少回应而报错。



## 06跑起来看看



建一个**空的测试目录** ，把 
`tools.py`
 和 
`agent.py`
 放进去，然后运行：





    python agent.py





输入第一个任务：





    你> 写一个 fib.py，输出斐波那契数列前 10 项，然后运行它确认结果是对的





你会看到类似这样的过程（示意）：





    🔧 write_file({"path": "fib.py", "content": "a, b = 0, 1\nfor _ in range(10):\n    print(a)\n ...)

    🔧 run_shell({"command": "python fib.py"})



    已创建 fib.py 并运行，输出为 0 1 1 2 3 5 8 13 21 34，共 10 项，结果正确。





模型自己决定了先写文件、再运行验证，这就是一个完整的 Agent 循环。



再试一个故意制造错误的任务：





    你> 读一下 notes.txt 的内容





目录里并没有这个文件。观察输出，你大概率会看到它先收到 
`FileNotFoundError`
，然后自己调用 
`list_dir`
 查看目录，再告诉你"文件不存在，当前目录有这些文件"。**它没有崩，也没有胡编，而是看了报错再行动** 。这正是上一节"错误也是一种结果"的收益。



## 07一个故意留下的隐患



写到这里，请你停下来想一件事：




`run_shell`
 现在可以执行**任何命令** ，而且和第 1 课不同，它已经不再逐条问你了。



模型不是故意的，但它也会犯错：理解偏了、路径写错了、把"清理临时文件"理解得过于彻底。一个没有任何限制的 Agent，等于把你的终端完全交了出去。



所以我特意让这一课的代码**不设任何限制** ，也提醒你：



  * 一定要在空目录或测试目录里跑

  * 不要在放着重要文件的目录里试

  * 不要把这个版本直接接到任何对外的场景



这不是疏忽，而是留给下一课的伏笔。



## 08主流 Agent 怎么做



**工具从哪来：MCP。** 我们的工具是写在同一个 Python 进程里的函数。主流产品还支持另一种来源：MCP（Model Context Protocol）。工具跑在另一个进程里，Agent 通过协议问它"你有哪些工具"、再请它执行。本质和我们的注册表一样：拿到"说明书"交给模型，模型请求，代码转发执行。好处是一个工具写一次，各家 Agent 都能用。Claude Code、Codex、Grok Build、Hermes 都支持接入 MCP 服务器。



**Pi 曾经故意不做 MCP。** 它早期的文档给出的替代方案是：用命令行程序，配一份 README 说明用法。模型本来就会用 shell，读完 README 就会调用。工具越少，每一轮发给模型的说明书越短。这是一个值得想清楚的取舍：每多注册一个工具，它的说明就要在每一轮请求里付一次钱。10 月的 Pi 1.0 加入了 MCP，但方式依然是为了让工具清单保持短，第 8 课会细讲。



**改文件，不是重写文件。** 我们的 
`write_file`
 每次都要传完整内容，改一行也得把整个文件重写一遍：费 token，长文件还可能被模型写漏。所以 Pi 除了 
`write`
，还有一个 
`edit`
：给出一段原文和替换后的文字，只改这一处。DeepSeek Harness 最精简的 Minimal 模式，也只给模型两样东西：一个持久的 shell，和一个"字符串替换"式的编辑器。几家不约而同，说明这是编码 Agent 最实用的一个工具。



**没有接口的地方：把电脑本身当工具。** Grok Bot 走得更远。它不要求每个服务都有 API 或 MCP，而是像人一样登录网站、操作页面，包括那些根本没有 API 的服务。工具从"一个函数"变成了"一台电脑"。代价是更慢、更难预测，也更需要下一课的权限控制。



## 小结



这一课我们做了几件事：



  * 理解了 Tool Use 的本质：模型只提请求，执行的是你的代码

  * 用装饰器加注册表，让新增工具不再需要改主循环

  * 写了五个实用工具：列目录、读文件、写文件、执行命令、抓网页

  * 用统一的执行器把所有错误变成"可被模型看到的结果"，让 Agent 具备自我修正能力

  * 给工具输出加了截断，给主循环加了步数上限



## 课后小练习



给 Agent 再加一个你自己的工具，比如 
`get_time`
（返回当前时间）。



进阶一点：照着 Pi 的思路写一个 
`edit_file(path, old, new)`
，要求 
`old`
 在文件里**恰好出现一次** 才替换，出现零次或多次都返回错误、让模型给出更长的原文。你会发现整件事只需要写一个函数、套一个装饰器，其他地方一行都不用动。如果做到了这一点，说明这一课的设计目标达成了。



## 下一课预告



下一课：**让 Agent 敢用，安全与权限确认** 。



我们会给 
`run_shell`
 和 
`write_file`
 戴上"笼头"：



  * 危险操作执行前，先问你一句"确认吗"

  * 限制 Agent 只能在指定目录里活动

  * 给工具分级：只读的直接放行，会写入、会执行的需要确认



这一课让它从"能用"变成"敢用"。



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-02/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-02)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[Pi coding agent（pi.dev）](https://pi.dev/)


  * 
[DeepSeek Harness 官方页面](https://deepseek.com/en/harness/)


  * 
[Grok Build CLI 介绍](https://mer.vin/linkedin/grok-build-cli-xai-terminal-coding-agent-with-plan-mode-subagents-and-headless-ci-linkedin/)


  * 
[Grok Bot 发布报道（GIGAZINE）](https://gigazine.net/gsc_news/en/20260812-spacexai-grok-bot/)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



