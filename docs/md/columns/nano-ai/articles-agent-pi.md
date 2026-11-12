---

title: "拆解 Pi：故意做小的 Agent"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-pi/"

description: "四个工具、不弹窗、会话是一棵树、缺什么让 Agent 自己写；OpenClaw 的内核，1.0 用 Codemode 接入 MCP。"

---



# 拆解 Pi：故意做小的 Agent




[从零手写 Agent · EP14](/agent/)




Teardown · Pi



> 前两课的 Claude Code 和 Codex 都在做加法：更多模式、更多工具、更多扩展方式。这一课的 Pi 反其道而行：**能不做的都不做，缺什么让 Agent 自己写。**

>

> 它的体量很小，却是 OpenClaw 的内核。看懂 Pi，你会更清楚这个系列前十一课里，哪些是"必须有"，哪些只是"有了更好"。



* * *



## 01它是什么



Pi 是一个开源的编码 Agent，作者是 Mario Zechner，奥地利开发者，以游戏框架 libGDX 闻名。2025 年作为个人项目开始，MIT 许可证，用 TypeScript 写成。



几个时间点：



  * **2026 年初** ：OpenClaw 走红，而 OpenClaw 底下用的就是 Pi 的组件。Flask 的作者 Armin Ronacher 写过一句话："OpenClaw 底下是一个叫 Pi 的小编码 Agent。"

  * **2026 年 4 月** ：Ronacher 参与创办的公司 Earendil 接手 Pi 的开发，Mario 继续参与。Earendil 表示 Pi 会一直保持 MIT 许可。

  * **2026 年 10 月 1 日** ：Pi 1.0 发布，最大的变化是加入了 MCP。



它支持三十多家模型服务商，可以接本地模型。这是它和前两课最根本的不同：**它不属于任何一家模型公司。**



## 02十一个零件，对一遍



零件 | nami-agent | Pi

---|---|---

循环（第 1 课） | while 循环 | 同样的循环；Ronacher 说它的 system prompt 是他知道的最短的

工具（第 2 课） | 五个工具 | 默认四个：read、write、edit、bash

权限（第 3 课） | 三道关 | 不弹窗。建议放进容器里跑，或者自己写确认扩展

上下文（第 4 课） | 截断 → 清理 → 摘要 | 有损压缩，但会话存成树，完整历史一直在文件里

说明与技能（第 5 课） | AGENTS.md + 技能 | 读 AGENTS.md 和 CLAUDE.md；Agent Skills 标准的技能

渠道（第 6 课） | Telegram | 交互式终端、JSON 输出、RPC、SDK；渠道交给上层（比如 OpenClaw）

定时（第 7 课） | 定时任务 + 心跳 | 不内置；1.0 另出了一个面向长期运行的独立包

MCP（第 8 课） | stdio 客户端 | 1.0 之前不做；1.0 通过 Codemode 沙箱加入

子 Agent（第 9 课） | explore / worker | 不内置。用 tmux 起多个 Pi，或者写扩展

计划（第 10 课） | 待办 + 计划模式 | 不内置。计划写成文件就行

记忆（第 11 课） | MEMORY.md + 检索 | 不内置，交给扩展



一张表里有一半是"不做"。这不是功能少，而是一种立场。



## 03为什么只有四个工具



第 2 课说过，每个工具的说明书每一轮都要发给模型，工具越多，越费钱，模型也越难挑对。



Pi 把这一点推到了极致：read、write、edit、bash。前三个处理文件，最后一个处理其他一切。它的判断是：**模型已经很会用 shell 了。** 要搜索，
`grep`
；要看目录，
`ls`
；要调用某个服务，写一个命令行工具配一份 README，让模型读完自己调用。不需要为每件事都注册一个专门的工具。



这里有一个我们第 2 课提过的细节：它有 
`edit`
。给出原文和替换后的文字，只改一处，而不是每次重写整个文件。四个工具里留了一个位置给它，说明这是编码 Agent 真正离不开的东西。



对照 nami-agent 的第 9 课：我们的 explore 子 Agent 因为没有 
`run_shell`
、又没有 
`grep`
，在大项目里找东西很慢。Pi 的思路会说：别加 
`grep`
 工具，给它 bash 就行。代价是 bash 没法像 
`read_file`
 那样做路径检查，于是就引出了下一个问题。



## 04为什么不弹窗



Pi 的文档明确列出：不做权限弹窗。它的建议是两个：放进容器里跑，或者自己写一个确认流程的扩展。



这看起来很大胆，但逻辑是连贯的。第 3 课第八节我们自己承认过：



  * 黑名单拦不住有意绕过的命令

  * 
`run_shell`
 里的命令不经过路径检查

  * 确认次数多了，人会不看就按 y



既然弹窗防不住有意的攻击、又会让人疲劳，Pi 的选择是不做这个半吊子的防线，把安全完全交给隔离。这和第 13 课 Codex 的结论其实是同一个方向：**可靠的边界在操作系统** 。区别在于，Codex 自己把沙箱做进了产品，Pi 把它留给你。



这个选择的前提是：用 Pi 的人知道自己在做什么。它的定位本来就是给愿意自己动手的工程师。



## 05会话是一棵树



第 4 课讲压缩时，我们承认了一个局限：摘要是有损的，压掉的细节就找不回来了。



Pi 的解法很巧：**会话存成一棵树。** 每条记录有自己的 
`id`
 和 
`parentId`
。你可以回到任何一个节点，从那里分叉出一条新路线。压缩只影响发给模型的那一份上下文，完整的历史一直留在文件里，用 
`/tree`
 随时可以回去看。



Ronacher 举过一个用法：主线上干活时发现某个工具坏了，就分出一条支线去修，修好之后把支线的经过总结回主线。修工具的那一大堆试错，不会占用主线的上下文。



这和第 9 课的子 Agent 解决的是同一个问题：**让一部分工作不进主上下文。** 子 Agent 是开一个新会话，树是在同一个会话里分叉。



DeepSeek Harness 后来也采用了类似的设计：会话是一个只追加的事件日志，支持恢复、分叉、搜索和回放。



## 06缺什么，让 Agent 自己写



Pi 不内置子 Agent、计划模式、待办清单，那缺了怎么办？它的回答是扩展：用 TypeScript 写的模块，可以加工具、加斜杠命令、加界面组件、挂事件，甚至替换内置的工具。



有意思的是，**这些扩展通常是让 Agent 自己写的。** Ronacher 列过他自己用的几个：



  * 
`/todos`
：在 
`.pi/todos`
 里管理 Markdown 待办

  * 
`/review`
：分叉出一个干净的上下文做代码评审

  * 
`/control`
：让一个 Pi 给另一个 Pi 发提示

  * 
`/answer`
：把 Agent 上一条回复里的问题提取出来，放进输入框让你逐个回答



他说这些大多是按他的要求让 Agent 写出来的，而不是去哪里下载的。扩展的状态可以存进会话，Agent 还能热加载自己刚写的扩展。



对照第 5 课：我们把技能目录设成只读，理由是防止注入内容被写进技能、之后反复触发。Pi 走的是另一个极端：Agent 不只能写技能，还能写扩展代码给自己加功能。两种选择背后是同一个取舍：**安全和自我扩展能力，此消彼长。** Pi 选择了后者，并用"放进容器里跑"来兜底。



## 071.0：在 MCP 上改了主意



Pi 早期明确不做 MCP。Ronacher 说这是一种哲学，不是偷懒：需要新能力，就让 Agent 扩展自己；想用 MCP 工具，可以用一个把 MCP 包装成命令行的小工具。



2026 年 10 月的 1.0 改了主意，加入了 MCP。Earendil 的说法是，今天的 MCP 和一年前已经不是一回事。但加入的方式保持了 Pi 的风格：**通过一个叫 Codemode 的 JavaScript 沙箱。**



模型不直接调用 MCP 工具。它写一小段程序，在程序里调用工具、筛选、合并结果，只把有用的部分交回对话。工具按需发现，不必一直摆在模型面前。第 8 课第五节说过，"工具说明书要付钱"是 MCP 最实际的问题；Codemode 就是 Pi 对这个问题的回答：工具可以很多，但模型面前的工具清单依然很短。



1.0 还加了延迟加载工具，以及一个叫 Pi Durable 的独立实验包，用于长期运行的 Agent 应用。之所以单独成包，就是为了让 Pi 本身保持小。



## 08它的取舍与代价



**1\. 安全靠你自己。** 不弹窗、bash 不受限，在你的主机上直接跑，等于把终端完全交出去。容器是前提，不是建议。



**2\. 门槛更高。** 子 Agent、计划、记忆都要自己加。对想要开箱即用的人，这是负担。



**3\. 功能分散在扩展里。** 每个人的 Pi 长得都不一样，别人的经验未必能直接用到你身上。



**4\. 但它是最好的教材。** 读 Pi 的源码，比读任何大型 Agent 都更容易看清一个 Agent 的骨架。这也是这个系列从 100 行开始的原因。



## 09Pi 给 nami-agent 的启发



把 Pi 和 nami-agent 并排放，会得出一个有意思的结论：**这个系列前十一课里，真正"必须有"的只有前四课。** 循环、工具、上下文管理是一个 Agent 能工作的最低要求；权限的必要性取决于你在哪里运行它。技能、渠道、定时、MCP、子 Agent、计划、记忆，都是"有了更好"，而且都可以作为扩展存在。



所以如果你要从 nami-agent 出发做自己的 Agent，Pi 提供了一个反方向的建议：先砍掉，而不是先加上。用一段时间，哪里真的疼，再把那一课的代码加回来。



## 10本课小结



  * Pi 刻意做小：默认四个工具，最短的 system prompt，能不做的都不做

  * 不弹窗，安全完全交给隔离；和 Codex 一样相信操作系统边界，但把沙箱留给使用者

  * 会话是一棵树：压缩有损，但完整历史一直在，可以随时分叉

  * 缺的功能由扩展补上，而扩展常常是 Agent 自己写的

  * 1.0 加入 MCP，但用 Codemode 沙箱让模型写代码调用，工具清单依然很短



## 下期预告：拆解 Grok Bot



前三个都是编码 Agent，跑在你的电脑上。下一课的 Grok Bot 换了个场景：Agent 有自己的一台云电脑，替你登录网站、长期在线干活。顺带也看看 xAI 的编码 Agent Grok Build。



* * *



参考：



  * 
[Pi（Armin Ronacher）](https://lucumr.pocoo.org/2026/1/31/pi/)


  * 
[Pi coding agent README（0.73）](https://cdn.jsdelivr.net/npm/@mariozechner/pi-coding-agent@0.73.1/README.md)


  * 
[Pi Coding Agent erklärt（eesel）](https://www.eesel.ai/de/blog/pi-coding-agent-erklaert)


  * 
[Pi 1.0 Release Guide: MCP, Codemode and Pi Durable](https://www.developersdigest.tech/blog/pi-1-0-release-guide-mcp-codemode-pi-durable)


  * 
[Pi 1.0's Code Mode（MindStudio）](https://www.mindstudio.ai/blog/pi-2-dot-0-code-mode-mcp)


  * 
[Pi 1.0 will include MCP（Techzine）](https://www.techzine.eu/news/devops/144715/pi-1-0-will-include-mcp-and-a-dedicated-layer-for-long-running-ai-agents/)


  * 
[DeepSeek Open-Sources Harness（Digital Applied）](https://www.digitalapplied.com/blog/deepseek-harness-open-source-agent-framework-2026)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



