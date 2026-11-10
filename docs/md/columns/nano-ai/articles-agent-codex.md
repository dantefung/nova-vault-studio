---

title: "拆解 Codex：开源，并把边界交给操作系统"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-codex/"

description: "沙箱 × 审批两根轴、一个核心多个界面、AGENTS.md 成为标准，以及 Codex 默认保守的整体风格。"

---



# 拆解 Codex：开源，并把边界交给操作系统




[从零手写 Agent · EP13](/agent/)




Teardown · Codex



> 上一课的 Claude Code 把每个零件都做成了可配置的。这一课的 Codex 是 OpenAI 的编码 Agent，它和 Claude Code 功能上越来越像，但在两件事上选了不同的路：**代码开源，安全边界由操作系统强制。**



* * *



## 01它是什么



Codex 这个名字在 OpenAI 用过好几次，这里说的是 2025 年以来的编码 Agent。



  * **2025 年 4 月** ：Codex CLI 发布，开源，Apache 2.0 许可证。最初用 TypeScript 写成。

  * **2025 年 5 月** ：云端 Codex 推出，每个任务在一个预装了你仓库的独立环境里运行。

  * **之后** ：CLI 用 Rust 重写。据第三方统计，不到一年，仓库里 Rust 代码已占九成以上。

  * **2026 年 2 月** ：桌面应用发布，用来同时管理多个长时间运行的 Agent。

  * **2026 年 7 月** ：桌面应用并入 ChatGPT 桌面应用。



用户规模上，据维基百科汇总的报道，Codex 周活跃用户在 2026 年 3 月中旬超过了 200 万。



和 Claude Code 最直观的区别是：**你可以读它的全部源码。** 本课很多细节能讲得这么具体，正是因为它开源。



## 02十一个零件，对一遍



零件 | nami-agent | Codex

---|---|---

循环（第 1 课） | while 循环 | 同样的循环，写在 Rust 的核心库里，可以嵌入别的程序

工具（第 2 课） | 注册表 + 统一执行器 | 所有工具调用都经过一个路由器，统一套上审批和沙箱

权限（第 3 课） | 硬规则 → 风险分级 → 人工确认 | 两根轴：操作系统级沙箱 × 审批策略

上下文（第 4 课） | 截断 → 清理 → 摘要 | 接近上限时自动压缩；自家模型走服务端压缩

说明与技能（第 5 课） | AGENTS.md + 技能 | AGENTS.md（它推广开的标准）+ Agent Skills

渠道（第 6 课） | Telegram | CLI、IDE 插件、网页、桌面，同一个 App Server 驱动

定时（第 7 课） | 定时任务 + 心跳 | 云端任务；本系列不展开

MCP（第 8 课） | stdio 客户端 | 既是 MCP 客户端，也能把自己作为 MCP 服务器暴露出去

子 Agent（第 9 课） | explore / worker | 只在你要求时派；默认 6 个并发、深度 1；TOML 自定义

计划（第 10 课） | 
`update_plan`
 \+ 计划模式 | 
`update_plan`
 工具

记忆（第 11 课） | 每条确认的 MEMORY.md | 会话结束后两阶段抽取和整理，需手动开启



## 03权限：沙箱和审批，两根轴



这是 Codex 最值得学的地方，也最能回答第 3 课第八节留下的问题。



第 3 课我们承认过：
`run_shell`
 的 
`cwd=WORKSPACE`
 只是起点，命令里一个 
`cd /`
 就出去了；路径检查只覆盖文件工具；真正的隔离需要操作系统层面的手段。Codex 做的就是这件事。



**第一根轴：沙箱，管"能做到什么"。**



  * 
`read-only`
：只能读

  * 
`workspace-write`
：只能写工作区，本地使用时的默认值

  * 
`danger-full-access`
：没有限制



沙箱由操作系统强制：macOS 用系统自带的 Seatbelt，Linux 用 bubblewrap，Windows 用受限令牌和文件权限控制。在 
`workspace-write`
 下，不管命令写得多巧，
`cd /`
 之后想写 
`/etc`
，被拦下的是系统调用，不是一条正则表达式。而且沙箱作用在工具调用产生的**整个进程树** 上，命令再启动别的程序，照样被关在里面。



**第二根轴：审批，管"要不要问人"。**



  * 
`on-request`
：在沙箱里自己干，需要越过沙箱时问你

  * 
`never`
：从不停下来问



两根轴分开，组合起来就很灵活：日常开发用"只能写工作区 + 越界时问"，几乎不会被打扰；放进 CI 里跑，用"只读 + 从不问"，不会有人等它。



对比一下我们的设计：nami-agent 只有"审批"这一根轴，没有沙箱，所以 
`run_shell`
 只能每条都问。Codex 有了沙箱，大部分命令可以放心地不问。**沙箱越可靠，需要的确认就越少** ，这就是第 3 课说的"真正可靠的边界在操作系统"。



## 04工程架构：一个核心，多个界面



Codex 用 Rust 重写之后，结构很清楚，值得对照我们第 6 课"核心不动，只换输入输出"的思路。



据第三方对源码的分析，主要的组件有：



  * **核心库** ：Agent 循环、会话、上下文压缩、工具分发都在这里，设计成可以被别的程序嵌入

  * **终端界面** ：全屏的终端 UI

  * **无头运行器** ：
`codex exec`
，给脚本和 CI 用

  * **App Server** ：把核心通过 JSON-RPC 暴露出去，IDE 插件、网页、桌面应用都通过它和核心说话

  * **MCP 组件** ：既当 MCP 客户端，也能当 MCP 服务器



OpenAI 在 2026 年初描述过这个统一的 App Server：命令行、VS Code 插件、网页、macOS 应用和第三方 IDE 集成，背后是同一个服务，会话和审批请求在各个界面之间保持一致。



这就是第 6 课那张图的工业版本。我们把 Agent 核心和 Telegram 分开，靠的是一个 
`ask`
 参数和一个 
`Session`
 类；Codex 把这条分界线做成了一个正式的协议。



## 05AGENTS.md：一个文件名变成了标准



第 5 课我们把项目说明放在 
`AGENTS.md`
 里。这个文件名就是 Codex 推广开的：一个普通的 Markdown 文件，写给 Agent 看的项目说明，各家 Agent 都去读同一个文件，不用为每个工具各写一份。



2025 年 12 月，Linux 基金会成立了 Agentic AI Foundation，首批项目有三个：Anthropic 贡献的 MCP、Block 贡献的 goose，以及 OpenAI 贡献的 AGENTS.md。当时的公告说，已有超过 6 万个开源项目和 Agent 框架采用了 AGENTS.md。



Codex、Grok Build、Pi 都读 
`AGENTS.md`
。Claude Code 读的是自己的 
`CLAUDE.md`
。到这一步，"写给 Agent 看的说明"和"Agent 能调用的工具"（MCP），都已经有了跨厂商的标准。



## 06上下文、子 Agent、记忆



这三块在第 4、9、11 课都对照过，这里串起来看它的整体风格。



**压缩：能交给服务端的就交给服务端。** 接近窗口上限时自动压缩。用 OpenAI 自家模型时，压缩由服务端完成，返回一段加密的内容，下一轮由服务端解开；用其他模型时在本地做摘要，并标记摘要，避免它被反复再压。



**子 Agent：保守的默认值。** 只在你明确要求时才派，不会自己决定拆任务。默认最多 6 个并发、深度 1，子 Agent 继承父会话的沙箱，可以单独收紧，比如探索用的设成只读。这和第 9 课"只允许一层"的选择一致。



**记忆：后台批量整理。** 不在对话中途写，而是每段会话结束后由模型抽取要点，再由一个全局任务合并、去掉过时的，更新 
`MEMORY.md`
。整理任务跑在一个没有网络、只能写记忆目录的子 Agent 里。默认关闭，要手动开启。



把这三点放在一起，能看出 Codex 的整体风格：**默认保守，把自动化放在你看得见、管得住的地方。** 子 Agent 不自己派，记忆不自己开，沙箱默认只能写工作区。



## 07它的取舍与代价



**1\. 沙箱会挡路。** 操作系统级的沙箱是硬边界，也就意味着它不懂上下文。一个合理的操作（比如往工作区之外的缓存目录写文件、访问内网服务）也会被挡住，你得学会调整可写目录和网络设置。



**2\. 平台差异。** 三个操作系统三套沙箱机制，行为不可能完全一致。



**3\. 开源不等于随便改。** 代码可以读、可以改，但最好的体验依然和 OpenAI 自家模型绑定，比如服务端压缩只对自家模型生效。



**4\. 安全问题照样会有。** 维基百科记录了一个已修复的漏洞：恶意的 GitHub 分支名可以在云端任务的准备阶段注入命令，拿到 GitHub 令牌。沙箱管住了 Agent 执行的命令，却管不到 Agent 之外的那些环节。



## 08从 nami-agent 到 Codex，还差什么



最值得借鉴的只有一件事：**给
`run_shell`
 套一层操作系统沙箱。**



在 macOS 上可以用 
`sandbox-exec`
 加一份只允许写工作区的配置，在 Linux 上可以用 
`bwrap`
 把工作区之外的目录挂成只读。做到之后，第 3 课的规则就可以改了：沙箱里的命令不用每条都问，只有越出沙箱的才问。这一步做完，确认疲劳会大幅缓解，安全性反而更高。



其次是把核心和界面之间的那条线做成协议。第 6 课的 
`ask`
 参数和 
`Session`
 类已经是这条线的雏形，往前一步，就是一个 JSON-RPC 服务。



## 09本课小结



  * Codex 开源，用 Rust 重写，一个核心库驱动 CLI、IDE、网页和桌面

  * 权限是两根轴：操作系统级沙箱管"能做到什么"，审批策略管"要不要问人"

  * 沙箱越可靠，需要的确认越少：这是第 3 课问题的正面解法

  * AGENTS.md 由它推广，已经成为跨厂商的标准

  * 整体风格是默认保守：子 Agent 不自己派，记忆不自己开



## 下期预告：拆解 Pi



Claude Code 和 Codex 都在做加法。下一课的 Pi 反过来：一个刻意做小的 Agent，只有四个工具，而它恰恰是 OpenClaw 的内核。



* * *



参考：



  * 
[OpenAI Codex（维基百科）](https://en.wikipedia.org/wiki/OpenAI_Codex_\(AI_agent\)
)

  * 
[Codex 文档：Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)


  * 
[The codex-rs Architecture（第三方分析）](https://codex.danielvaughan.com/2026/03/28/codex-rs-rust-rewrite-architecture/)


  * 
[Linux Foundation 宣布成立 Agentic AI Foundation](https://linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)


  * 
[Context Compaction Showdown（第三方分析）](https://codex.danielvaughan.com/2026/04/10/context-compaction-showdown-coding-agents/)


  * 
[The Official Codex Subagents Documentation（第三方整理）](https://codex.danielvaughan.com/2026/05/06/codex-subagents-official-docs-reference-patterns-csv-batch/)


  * 
[Codex Built-In Memory Deep Dive（第三方分析）](https://codex.danielvaughan.com/2026/04/18/codex-built-in-memory-system-deep-dive/)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



