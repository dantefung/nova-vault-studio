---

title: "拆解 DeepSeek Harness：一切皆插件"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-deepseek-harness/"

description: "没有特权内核，连循环都是插件；四种模式、审批与沙箱分开、只追加的会话日志、能调用别家 Agent 的子 Agent。"

---



# 拆解 DeepSeek Harness：一切皆插件




[从零手写 Agent · EP16](/agent/)




Teardown · DeepSeek Harness



> 前面拆的几个 Agent，各自有一个固定的内核，扩展都是往内核上挂东西。DeepSeek 今年 8 月开源的 DeepSeek Harness（命令行叫 dsh）换了一个思路：**没有需要打补丁的特权内核。** 模型、工具、会话、沙箱、调度、界面，连 Agent 循环本身，都是可以替换的插件。

>

> 这一课看看这种设计带来了什么，又付出了什么。



* * *



## 01它是什么



  * **2026 年 8 月 13 日** ：DeepSeek 开源 DeepSeek Harness，版本 0.1，开发者预览，MIT 许可证，仓库在 
`deepseek-ai/deepseek-harness`
。同一天 DeepSeek 宣布 V4-Pro 全面可用。

  * 一条命令就能启动：
`npx @deepseek-ai/dsh web`
，在本机 127.0.0.1:3080 打开一个网页界面。

  * 另有 macOS 和 Windows 的桌面版、无头模式、Python SDK，以及给编辑器用的 ACP 协议接口。



它不只支持 DeepSeek 的模型。模型适配本身就是一个插件，官方带了 DeepSeek 的适配，也能接 Anthropic、OpenAI 和兼容接口，或者通过 Ollama 接本地模型。



需要先说清楚：它目前是开发者预览，官方明确提醒会有不兼容的改动。本课描述的是发布后两个多月的状态。



## 02十一个零件，对一遍



零件 | nami-agent | DeepSeek Harness

---|---|---

循环（第 1 课） | 写死在 agent.py 里 | 一个插件，可以替换

工具（第 2 课） | 注册表 | 工具注册表也是插件；四种模式提供不同的工具组合

权限（第 3 课） | 三道关 | 审批和沙箱是两个独立的控制项；默认只能写工作区和临时目录

上下文（第 4 课） | 截断 → 清理 → 摘要 | 会话是只追加的事件日志，支持恢复、分叉、搜索、回放

说明与技能（第 5 课） | AGENTS.md + 技能 | 
`SKILL.md`
 技能；内置写插件的技能和办公文档技能

渠道（第 6 课） | Telegram | 网页、桌面、无头、SDK、ACP

定时（第 7 课） | 定时任务 + 心跳 | 实验性的定时任务插件，模型用 
`schedule_create`
 创建任务

MCP（第 8 课） | stdio 客户端 | 内置客户端，默认不启用任何服务器

子 Agent（第 9 课） | explore / worker | 子 Agent 插件；还能把 Claude Code、Codex 当作子 Agent 调用；实验性的 Agent 团队

计划（第 10 课） | 待办 + 计划模式 | 计划和目标是 Standard 模式里的工具

记忆（第 11 课） | MEMORY.md + 检索 | 事件日志可搜索；没有专门的记忆机制介绍



## 03"一切皆插件"是什么意思



nami-agent 的结构是：一个固定的 
`agent.py`
，里面写死了循环；其他模块往注册表里登记工具。你想改循环（比如换一种压缩策略、加一个钩子），就得改 
`agent.py`
。



DeepSeek Harness 建在一个叫 Cordis 的插件框架上。插件通过服务名向框架要依赖，比如要工具注册表、要模型；框架负责按依赖关系启动插件，并且在插件卸载时，把它注册过的东西一并清理掉。在这个结构里：



  * **模型适配** 是插件：换一家模型，换一个插件

  * **工具注册表** 是插件

  * **会话存储** 是插件：可以换成别的存储

  * **沙箱** 是插件

  * **Agent 循环** 也是插件：觉得默认的循环不合适，可以整个换掉



插件按组打包，几组叠成一个运行配置（profile）。后面的配置覆盖前面的，并且是整块替换而不是合并；
`--dump-config`
 能显示每一项设置来自哪个文件。



对比第 12 课：Claude Code 很可配置，但它的循环是固定的，你只能在循环的节点上挂钩子。DeepSeek Harness 允许你替换循环本身。对比第 14 课：Pi 也追求可扩展，但它的方式是"内核很小，扩展往上加"；DeepSeek Harness 是"根本没有内核，全是插件"。



这种设计最适合的人，是**想在 Agent 框架上做研究或者做产品的开发者** 。你想试一种新的压缩策略、新的循环结构，不用 fork 整个项目。



## 04四种模式：同一个框架，不同的工具组合



DeepSeek Harness 预设了几种 Agent 模式，正好可以和这个系列的几课对上：



**Standard：完整的编码 Agent。** 文件编辑、shell、文件和网页搜索、技能、计划、目标、子 Agent、工作流。相当于 nami-agent 第 11 课的完整版本。



**Code（也叫 PTC）：让模型写程序来调工具。** 工具通过一个生成的 SDK 暴露，模型写一段 TypeScript 程序，在程序里连续调用多个工具，通过 
`run_code`
 执行。第 8 课讲过，工具一多，说明书就占满上下文；第 14 课讲过 Pi 1.0 用 Codemode 解决同一个问题。两家不约而同地走到了"让模型写代码来调工具"这条路上。



**Minimal：两个工具。** 一个持久的 bash，一个字符串替换式的文件编辑器。DeepSeek 发布模型基准测试时引用的就是这个模式。和第 14 课 Pi 的四个工具一样，说明一个编码 Agent 的最低配置可以非常小。



**Creator：用对话写插件。** 检查运行时、在内存里测试插件。你在对话里描述想要的插件，Agent 写出来、装上、验证。和 Pi"让 Agent 给自己写扩展"是同一个方向，而在"一切皆插件"的框架里，这意味着 Agent 可以改写自己的几乎任何部分。



## 05权限：审批和沙箱分开



第 13 课讲过 Codex 的两根轴。DeepSeek Harness 也把这两件事分开：



  * **审批** ：要不要人确认

  * **沙箱** ：在哪里、以什么限制执行



权限预设只是把两者打包。新会话默认用 
`workspace-write`
：bash 和写文件被限制在工作区和临时目录。



但有几个细节，第三方的介绍写得很清楚，值得注意：



  * **读和联网不受限制。** 只限制了写。

  * **隔离程度取决于后端。** Linux 上用 bubblewrap 能隐藏主机上的其他进程；用 Landlock 或 macOS 的 Seatbelt 则不会。

  * **最精简的 SDK 配置是全权限，没有审批。** 适合放在你自己控制的环境里。

  * **MCP 服务器的命令作为可信代码运行，不在 Agent 的沙箱里。** 和第 8 课说的一样：启动服务器就是执行代码。



DataCamp 对它的介绍里还专门强调了一句，和本系列第 3 课的第一条原则几乎一字不差：**在 system prompt 里写"只能读文件"，不是一个被强制执行的边界。**



还有一个实验性的"自动审批"插件，思路接近 Claude Code 的 auto 模式：让另一个模型来审。



## 06会话：一份只追加的日志



第 4 课我们把会话存成一个 JSON 列表，压缩时直接改写它。第 14 课的 Pi 把会话存成树，压缩不影响完整历史。



DeepSeek Harness 的做法是：**会话是一个只追加的事件日志。** 每一轮的输入、模型输出、工具调用和结果，都作为事件追加进去，从不修改。在这之上可以做恢复、分叉、搜索和回放。界面里有一个"轨迹"视图，按时间线展示每一步的模型回复、工具调用、嵌套的工具活动、耗时和 token 用量，排查问题时非常有用。



"只追加"的好处和 Pi 的树一样：发给模型的上下文可以压缩、裁剪，但原始记录永远在。这也正好补上了第 11 课"会话检索"的基础：搜索的对象是完整的历史，而不是被压缩过的版本。



有一点要留意：据第三方介绍，使用 DeepSeek 官方 API 时，会话日志插件默认开启，会把日志上传给 DeepSeek，可以在设置里关掉。这再次说明了"一切皆插件"的另一面：**每个插件做了什么，你得自己弄清楚。**



## 07子 Agent：连别家的 Agent 都能调



子 Agent 是一个插件。默认最多 8 个同时运行的子 Agent，派生深度 1，和第 9 课、第 13 课 Codex 的保守默认值一致。



有意思的是，它还有可选的插件，能把 **Claude Code 和 Codex 作为子 Agent** 来调用。这把第 9 课的思路推得更远：子 Agent 不必是同一个程序的另一个会话，可以是另一个厂商的 Agent。主 Agent 负责拆任务和汇总，具体的活交给最擅长的那个。



Agent 团队是实验性插件，带一个共享的任务看板，和 Claude Code 的实验功能是同一类东西。



## 08它的取舍与代价



**1\. 灵活的代价是不稳定。** 开发者预览，插件接口经常变。今天写的插件，下个版本可能就要改。



**2\. 每个插件都要弄清楚。** 循环可以换、存储可以换，也意味着默认配置里每个插件的行为（比如日志上传、遥测）都需要你自己确认。第三方报告提到，桌面版的遥测设置可能和网页版不同，值得检查。



**3\. 沙箱不是均匀的。** 不同平台、不同后端的隔离程度不一样，读和联网默认不受限。



**4\. 它是一个框架，也是一个产品。** 对只想用一个编码 Agent 的人，Claude Code、Codex 更省心；对想在框架层面做实验的人，它提供了别处很难找到的自由度。



## 09DeepSeek Harness 给 nami-agent 的启发



如果你读完这个系列，想把 nami-agent 改成插件化的结构，最自然的第一步是：**把第 1 课的循环从
`agent.py`
 里拆出来。**



现在 
`_loop()`
 里写死了"先看要不要压缩，再调模型，再分发工具"。把这三步各自做成可替换的函数，通过配置选择用哪个实现，nami-agent 就有了 DeepSeek Harness 最核心的那一点能力。第 9 课的子 Agent、第 10 课的计划模式，都可以变成"换一个循环插件"，而不是在主循环里加判断。



第二步是把会话改成只追加的日志：压缩时不改写原始记录，只生成一份新的"发给模型的视图"。这同时解决了第 4 课的"摘要有损"和第 11 课的"检索不到被压缩的内容"。



## 10本课小结



  * DeepSeek Harness 没有特权内核：模型、工具、会话、沙箱、调度、界面，连循环都是插件

  * 四种模式对应不同的工具组合：完整、写程序调工具、最精简的两个工具、用对话写插件

  * 审批和沙箱分开；默认只限制写，读和联网不受限，隔离程度因平台而异

  * 会话是只追加的事件日志，能恢复、分叉、搜索、回放

  * 子 Agent 甚至可以是 Claude Code 和 Codex

  * 代价是不稳定，以及每个插件的行为都需要你自己弄清楚



## 下期预告：OpenClaw 与 Hermes



最后一个拆解对象是个人助手这条线：今年初爆红的 OpenClaw 为什么热度回落，接棒的 Hermes 又改了什么。这个系列第 6、7 课的很多设计，都是从它们身上来的。



* * *



参考：



  * 
[DeepSeek Harness 官方页面](https://deepseek.com/en/harness/)


  * 
[DSH Release Date: DeepSeek Harness Is Live（OrcaRouter）](https://www.orcarouter.ai/blog/dsh-deepseek-harness-release-date)


  * 
[DeepSeek Open-Sources Harness（Digital Applied）](https://www.digitalapplied.com/blog/deepseek-harness-open-source-agent-framework-2026)


  * 
[What Is DeepSeek Harness?（DataCamp）](https://www.datacamp.com/blog/what-is-deepseek-harness)


  * 
[DeepSeek Harness Tutorial（DataCamp）](https://www.datacamp.com/tutorial/deepseek-harness)


  * 
[DeepSeek Harness (dsh) explained（eesel）](https://www.eesel.ai/blog/deepseek-harness)




_完整拆解_ ：这一课是一课讲完的简版。想看一个部件一个部件的深度拆解，见第四部分 
[拆机 DeepSeek Harness →](/teardown/deepseek-harness/)




 _配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



