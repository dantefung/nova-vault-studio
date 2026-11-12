---

title: "100 行代码，写出第一个 Agent"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-minimal-loop/"

description: "工具、工具说明、循环三块，100 行写出能读写文件、跑命令的 Agent，并对照 Pi、DeepSeek Harness、Grok Bot 看主流 Agent 的内核。"

---



# 100 行代码，写出第一个 Agent




[从零手写 Agent · EP01](/agent/)




Minimal Agent Loop



> 新系列开篇。前面几个系列，我们从零手写了大模型本身：它怎么推理、怎么训练。这个系列往上走一层：**给模型装上手脚，让它自己干活。**

>

> 这一课不讲概念，直接做。做完你会发现，Claude Code、Codex 这类产品的内核，就是这一课的那个循环，只是外面包了很多层。



* * *



## 01目标



给 Agent 一句话任务，它自己读文件、写文件、跑命令，直到完成：





    python agent.py "在当前目录创建 hello.py，打印 hello，并运行它"





整个程序约 100 行，只依赖一个 
`openai`
 库。



## 02准备





    pip install openai

    export API_KEY=你的模型密钥





默认用 DeepSeek。DeepSeek 兼容 OpenAI 的接口格式，所以直接用 
`openai`
 库。想换别的模型，再设两个环境变量就行：





    export BASE_URL=模型服务的地址

    export MODEL=模型名





整个系列都用这三个环境变量，后面不再重复。



## 03先搞清楚：模型自己不会"动手"



很多人以为 Agent 是模型直接在你电脑上执行命令。不是。



模型只会输出文字。所谓"调用工具"，是一次约定好的对话：



  1. 你把问题，连同一份**工具说明** （有哪些工具、每个要传什么参数）一起发给模型

  2. 模型如果觉得需要用工具，就不直接回答，而是返回一段结构化的请求：「请帮我调用 
`write_file`
，参数是 
`{"path": "hello.py", ...}`
」

  3. **你的代码** 真正去执行这个函数

  4. 你把执行结果作为一条 
`tool`
 消息追加到对话里，再问模型一次



模型是大脑，你写的代码才是手。这一点贯穿整个系列：**模型只提出请求，执行与否、怎么执行，由代码决定。**



## 04整个 Agent 只有三块



**1\. 工具** ：就是普通的 Python 函数。本课三个：
`read_file`
、
`write_file`
、
`run_shell`
。





    def read_file(path: str) -> str:

        with open(path, encoding="utf-8") as f:

            return f.read()





    def write_file(path: str, content: str) -> str:

        with open(path, "w", encoding="utf-8") as f:

            f.write(content)

        return f"已写入 {path}（{len(content)} 字符）"





    def run_shell(command: str) -> str:

        # 第 1 课先用最朴素的权限控制：每条命令人工确认

        if input(f"\n[需要确认] 执行命令：{command}\n允许？(y/n) ").strip().lower() != "y":

            return "用户拒绝执行该命令"

        try:

            p = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=60)

        except subprocess.TimeoutExpired:

            return "命令超时（60 秒）"

        return (p.stdout + p.stderr)[-4000:] or "(无输出)"  # 截断，避免撑爆上下文





    TOOL_FUNCS = {"read_file": read_file, "write_file": write_file, "run_shell": run_shell}





**2\. 工具说明** ：一段 JSON，告诉模型"你有哪些工具、每个要传什么参数"。模型看不到你的代码，只看得到这段说明。





    def _tool(name, desc, props):

        return {

            "type": "function",

            "function": {

                "name": name,

                "description": desc,

                "parameters": {

                    "type": "object",

                    "properties": {k: {"type": "string", "description": v} for k, v in props.items()},

                    "required": list(props),

                },

            },

        }





    TOOLS = [

        _tool("read_file", "读取文件内容", {"path": "文件路径"}),

        _tool("write_file", "写入文件（覆盖）", {"path": "文件路径", "content": "完整文件内容"}),

        _tool("run_shell", "执行 shell 命令并返回输出", {"command": "要执行的命令"}),

    ]





**3\. 循环** ：这是 Agent 的本体。





    messages = [system, user]

    重复：

        让模型回复

        如果模型没有调用工具 → 结束

        否则：执行工具，把结果作为 tool 消息追加到 messages，继续





写成代码：





    def run(task: str) -> None:

        messages = [

            {"role": "system", "content": SYSTEM},

            {"role": "user", "content": task},

        ]

        for step in range(1, MAX_STEPS + 1):

            resp = client.chat.completions.create(model=MODEL, messages=messages, tools=TOOLS)

            msg = resp.choices[0].message

            messages.append(msg.model_dump(exclude_none=True))



            # 模型没有要调用工具 = 它认为任务做完了，循环结束

            if not msg.tool_calls:

                print(f"\n[完成，共 {step} 步]\n{msg.content}")

                return



            # 模型要调用工具：执行，并把结果作为 tool 消息喂回去

            for call in msg.tool_calls:

                name = call.function.name

                print(f"[第 {step} 步] {name}({call.function.arguments[:80]})")

                try:

                    args = json.loads(call.function.arguments)

                    result = TOOL_FUNCS
[name](**args)


                except Exception as e:  # 工具出错也要告诉模型，让它自己修正

                    result = f"工具执行出错：{type(e).__name__}: {e}"

                messages.append({"role": "tool", "tool_call_id": call.id, "content": result})



        print(f"\n[达到 {MAX_STEPS} 步上限，已停止]")





关键点：**模型自己决定什么时候停** 。它不再请求任何工具，就代表它认为做完了。



再补上开头的几行配置，就是完整的程序：





    import json

    import os

    import subprocess

    import sys



    from openai import OpenAI



    client = OpenAI(

        api_key=os.environ["API_KEY"],

        base_url=os.environ.get("BASE_URL", "https://api.deepseek.com"),

    )

    MODEL = os.environ.get("MODEL", "deepseek-flash")

    MAX_STEPS = 20  # 防止死循环：Agent 最多转 20 圈



    SYSTEM = (

        "你是一个能操作本地文件和命令行的编程助手。"

        "需要时调用工具，完成任务后直接用文字总结，不要再调用工具。"

    )



    if __name__ == "__main__":

        if len(sys.argv) < 2:

            sys.exit('用法：python agent.py "你的任务"')

        run(sys.argv[1])





## 05跑起来



**建一个空目录，在里面跑。** 这个版本的 Agent 能写任何文件，第 3 课之前，不要在放着重要文件的地方运行它。





    mkdir playground && cd playground

    python agent.py "在当前目录创建 hello.py，打印 hello，并运行它"





你会看到类似这样的输出（示意，具体步骤取决于模型）：





    [第 1 步] write_file({"path": "hello.py", "content": "print(\"hello\")"})

    [需要确认] 执行命令：python hello.py

    允许？(y/n) y

    [第 2 步] run_shell({"command": "python hello.py"})



    [完成，共 3 步]

    已创建 hello.py 并运行，输出 hello。





注意 "共 3 步"：前两步各调用了一次工具，第三次模型没有再请求工具，而是给出了总结，循环结束。



## 06几个不起眼但重要的设计



**1\. messages 是 Agent 的全部记忆。** 每一轮都把完整的 messages 发给模型。模型之所以"记得"它刚写过 hello.py，是因为那条 tool 消息就在 messages 里。第 4 课会专门处理它越来越长的问题。



**2\. 每个 tool_call 都必须有回应。** 模型可能一次请求好几个工具，比如同时读三个文件。每一个 
`tool_call_id`
 都必须对应一条 tool 消息，少一条，下一次请求接口就会报错。所以内层是一个 
`for`
 循环。



**3\. 工具报错也返回给模型。** 文件不存在、命令写错，都把报错原文当结果交回去。模型看到报错，常常能自己修正：先 
`ls`
 看看，再读正确的文件。这是 Agent 比普通脚本"聪明"的地方。



**4\. MAX_STEPS。** 模型可能反复失败、反复重试。必须有上限，这是最便宜的保险。



**5\. 输出截断到 4000 字符。** 一条命令的输出可能有几万行，全塞回去会撑爆上下文。



**6\. 每条命令人工确认。** 最朴素的权限控制。第 3 课会把它换成一套分级的权限系统。



**7\. 存进 messages 的是纯 dict。** 
`msg.model_dump(exclude_none=True)`
 把 SDK 返回的对象转成字典。现在看不出区别，第 4 课要把会话存成 JSON 时就离不开它。



## 07主流 Agent 怎么做



拿这 100 行去对照现在的主流产品，会发现核心是一样的：模型请求工具，代码执行，结果追加回去，直到模型不再请求。差别在循环外面包了什么、循环本身放在哪里。



**Pi（极简派）。** Pi 是一个刻意做小的编码 Agent，默认只给模型四个工具：
`read`
、
`write`
、
`edit`
、
`bash`
。模型本来就会用 shell，很多事一条命令就能办；工具少，每一轮要发给模型的说明就短，模型选错工具的机会也少。我们这一课的三个工具，和它几乎是同一个思路。



**Claude Code、Codex。** 内核还是这个循环。它们在外面加了本系列后面几课要讲的东西：权限、上下文压缩、项目说明、技能、子 Agent，还有大量的工程细节。



**DeepSeek Harness（dsh）。** 它的思路是"一切皆插件"：模型适配、工具、会话、沙箱，甚至**循环本身** 都是可以替换的插件。它还有一种叫 PTC 的模式：模型不再一次请求一个工具，而是写一段程序，通过 
`run_code`
 在程序里调用多个工具。一轮往返做完以前要好几轮的事。



**Hermes Agent。** Nous Research 的个人助手 Agent，也支持类似的做法：让模型写 Python 脚本，通过 RPC 调用工具，把多步流程压成一步。



**Grok Bot。** xAI 今年 8 月推出的"常驻 Agent"，换了一个维度：循环不跑在你的电脑上。每个 bot 有自己的一台云电脑，你关机了它照样在干活，需要你批准时给你发消息。



所以这 100 行不是玩具。它就是这些产品共同的地基。后面的课，我们一层一层往上加，最后再拿亲手写的这些零件，去拆解这些主流产品。



## 08动手练习



  1. 让它读取 
`agent.py`
，用三句话总结这个程序。

  2. 让它写一个 
`fib.py`
，并运行测试 
`fib(10)`
 的结果。

  3. 故意给一个做不到的任务（比如"读取 secret.txt"，但目录里没有这个文件），观察它怎么失败、会不会反复重试。



## 09这个版本的局限



  * **加一个工具要改三个地方** ：函数、说明、
`TOOL_FUNCS`
。第 2 课用注册表解决。

  * **没有安全边界** ：
`write_file`
 能写任何路径。第 3 课解决。

  * **没有上下文管理** ：任务一长就变慢、变贵，最后超出窗口。第 4 课解决。

  * **跑完就忘** ：每次运行都从零开始。第 4 课加上会话持久化。



## 小结



  * Agent = 模型 + 工具 + 循环

  * 模型只提出请求，代码负责执行，结果作为 tool 消息回到对话

  * 模型不再请求工具，循环就结束

  * 必须有步数上限，工具出错要回传



## 下期预告：工具系统



下一课把"加一个工具改三个地方"变成"写一个函数、套一个装饰器"，再加两个工具：列目录和抓网页。



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-01/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-01)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[Pi coding agent（pi.dev）](https://pi.dev/)


  * 
[DeepSeek Harness 官方页面](https://deepseek.com/en/harness/)


  * 
[Hermes Agent（GitHub）](https://github.com/NousResearch/hermes-agent)


  * 
[Grok Bot 发布报道（GIGAZINE）](https://gigazine.net/gsc_news/en/20260812-spacexai-grok-bot/)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



