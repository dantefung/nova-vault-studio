---

title: "拆解 Claude Code：把每个零件都做成可配置的"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-claude-code/"

description: "用十一个零件逐项对照 Claude Code：权限模式与分类器、钩子、四种扩展方式、两档多 Agent，以及它的代价。"

---



# 拆解 Claude Code：把每个零件都做成可配置的




[从零手写 Agent · EP12](/agent/)




Teardown · Claude Code



> 第三部分开篇。前两部分，我们亲手写了一个 Agent 的十一个零件：循环、工具、权限、上下文、技能、渠道、定时、MCP、子 Agent、计划、记忆。从这一课开始，拿这十一个零件当尺子，一个一个量主流 Agent。

>

> 第一个是 Claude Code。它是这一轮"编码 Agent"浪潮里最早成型、也最有代表性的产品，后来者的很多设计都能在它身上找到原型。



这一课不写新代码。每一节都会对照 nami-agent 里对应的那一课，看同一个问题，一个成熟产品是怎么做的、为什么。



* * *



## 01它是什么



Claude Code 是 Anthropic 的编码 Agent。2025 年 2 月和 Claude 3.7 Sonnet 一起以研究预览发布，5 月正式可用。最早只是一个终端程序，现在同一个内核跑在终端、IDE 插件、桌面应用、网页和 Slack 里。



它本身不开源。但 Anthropic 把它的内核做成了 Claude Agent SDK，开发者可以用同一套循环、工具和权限机制，搭自己的 Agent。



一句话概括它的设计取向：**核心循环保持简单，所有可能因人而异的东西，都做成可配置、可扩展的。** 权限有模式和规则，说明有分层文件，能力有技能、子 Agent、插件、MCP，流程有钩子。下面逐个看。



## 02十一个零件，对一遍



零件 | nami-agent | Claude Code

---|---|---

循环（第 1 课） | while 循环，模型不再请求工具就结束 | 同样的循环；SDK 把它开放给开发者

工具（第 2 课） | 注册表 + 统一执行器 | 内置读、写、编辑、搜索、Bash、网页等工具，外加 MCP 工具

权限（第 3 课） | 硬规则 → 风险分级 → 人工确认 | 六种权限模式 + allow / ask / deny 规则 + 受保护路径 + 分类器审核

上下文（第 4 课） | 截断 → 清理 → 摘要 | 先清旧工具输出，不够再完整摘要；可写压缩时保留什么

说明与技能（第 5 课） | AGENTS.md 常驻，技能按需加载 | 分层 CLAUDE.md；Agent Skills 标准的技能

渠道（第 6 课） | Telegram 长轮询 | 终端、IDE、桌面、网页、Slack；Channels 把 Telegram、Discord 接进运行中的会话

定时（第 7 课） | 预授权的定时任务 + 心跳 | 本地 
`/loop`
；云端定时任务（Routines）

MCP（第 8 课） | stdio 客户端，
`mcp__服务器__工具`
 | 本地和远程服务器、OAuth；工具多时延迟加载

子 Agent（第 9 课） | explore / worker，一层，并行只读 | 内置 Explore、Plan、通用子 Agent；自定义；可嵌套；worktree 隔离；实验性的 Agent 团队

计划（第 10 课） | 待办清单 + 代码强制的计划模式 | 待办工具 + 作为权限模式之一的计划模式

记忆（第 11 课） | 每条确认的 MEMORY.md + 会话检索 | CLAUDE.md（你写）+ 自动记忆（它写）



表格只是概览。下面挑最有特点的几处展开。



## 03权限：从一个开关到一套系统



第 3 课我们写了三关：硬规则、风险分级、人工确认。Claude Code 把同样的结构做成了一套可配置的系统。



**模式决定默认行为。** 六种模式：



  * 
`default`
：读不问，改文件、跑命令、联网之前问

  * 
`acceptEdits`
：工作目录里的编辑和常见的文件操作也不问

  * 
`plan`
：只调查、出方案，批准后才能改

  * 
`auto`
：交给分类器模型审

  * 
`dontAsk`
：凡是需要问的一律拒绝，适合锁死的 CI 环境

  * 
`bypassPermissions`
：全部放行，只建议在隔离的容器里用



**规则在模式之上叠加。** allow 规则预先放行（比如 
`Bash(npm test)`
），ask 规则强制询问，deny 规则在**任何模式** 下都生效，包括 bypass。这正是我们"第 1 关硬规则，人也放行不了"的思路，只不过规则可以由你自己写。



**受保护路径。** 
`.git`
、
`.bashrc`
、
`.claude`
 这类目录和文件，写入永远不会被自动批准，allow 规则也放行不了。我们第 5 课把技能目录设成只读，第 8 课把 MCP 配置放在工作区之外，是同一类考虑：有些文件被改了，后果会持续到以后的每一次运行。



**auto 模式：让另一个模型来审。** 这是它在第 3 课"确认疲劳"问题上走得最远的一步。规则能直接判断的直接判断，只读操作和工作目录里的编辑直接放行，其余的交给一个单独的分类器模型决定放行还是拦下，拦下时把原因告诉 Agent。进入 auto 模式时，
`Bash(*)`
 这类过宽的放行规则会被自动丢掉，理由和我们不给 
`run_shell`
 "一直允许"一样。连续被拦 3 次或累计 20 次，就停下来问人。



auto 模式 2026 年 3 月以研究预览推出，7 月正式可用。它代表了一个方向：**确认不一定要由人来做，但不能由干活的那个模型自己做。**



## 04钩子：可以由你自己加的硬规则



这是 nami-agent 没有、而 Claude Code 很有代表性的一个零件。



我们的硬规则写死在 
`permissions.py`
 里，想加一条，就得改 Agent 的代码。Claude Code 的钩子（hooks）把这件事开放了出来：在循环的各个节点上，挂你自己的脚本。



  * 
`PreToolUse`
：工具执行前触发，脚本以退出码 2 结束，这次调用就被拦下，错误信息会交给模型

  * 
`PostToolUse`
：工具执行后触发，比如每次改完文件自动跑一遍格式化

  * 
`UserPromptSubmit`
：你的输入交给模型之前触发，可以拦下或者补充上下文

  * 
`Stop`
：Agent 准备结束时触发，可以让它别停，继续干

  * 还有会话开始和结束、压缩前后、子 Agent 结束等几十个节点



用 nami-agent 的话说，
`PreToolUse`
 就是在 
`perms.check()`
 旁边，开了一个让你插入自己代码的口子。比如"任何时候都不允许改 
`migrations/`
 目录"，你不需要说服模型，写一个十行的脚本挂在 
`PreToolUse`
 上就行。



钩子的价值在于它是**确定性的** 。模型可能忘记 CLAUDE.md 里的某条规则，但钩子每次都会运行。提示词管"建议"，钩子管"必须"。这和本系列反复强调的"安全检查不能靠 prompt"是一回事，只是把写硬规则的权力交给了使用者。



## 05能力扩展：四种方式，各管一件事



Claude Code 让你扩展它的方式很多，乍一看容易混。用 nami-agent 的零件来对照，其实很清楚：



方式 | 对应 nami-agent | 解决什么

---|---|---

CLAUDE.md | 第 5 课 AGENTS.md | 每次都要知道的项目约定

技能（Skills） | 第 5 课 skills | 偶尔需要的详细做法，按需加载

子 Agent | 第 9 课 subagent | 需要独立上下文、只交回结论的任务

MCP | 第 8 课 mcp_client | 外部系统的工具

钩子 | 无 | 必须每次都执行的规则

插件 | 无 | 把上面这些打包，一键安装和分享



插件（plugins）是最外面一层：一个插件可以同时带上技能、子 Agent、钩子、MCP 配置和斜杠命令，团队之间直接分享。2025 年 10 月推出，配套有插件市场。



**CLAUDE.md 是分层的。** 组织统一下发的、你个人的（所有项目通用）、项目的（提交到仓库，团队共享）、只在本地的（不提交）。从上到下依次加载、拼在一起，而不是互相覆盖。子目录里的 CLAUDE.md 在 Claude 读到那个目录的文件时才加载。这比我们只有一个 
`AGENTS.md`
 细得多，解决的是团队场景下"谁的规则"的问题。



## 06上下文与记忆：两层结构反复出现



Claude Code 在上下文和记忆上的设计，和我们第 4 课、第 11 课的结构高度一致，可以说明这些结构不是我们拍脑袋想出来的。



**压缩：先便宜，后贵。** 据第三方的拆解，它在上下文接近上限时，先做一步不调用模型的清理，把旧的工具输出清掉，不够再做完整摘要。你可以在 CLAUDE.md 里写"压缩时保留什么"，或者手动 
`/compact`
 时给出侧重点。



**记忆：你写的和它写的分开。** CLAUDE.md 是你写的。自动记忆是它写的：当你纠正了它、或者确认某个做法有效时，它判断这条信息以后用得上，就写进按项目分开的记忆目录。目录里 
`MEMORY.md`
 是简短的索引，会话开始时只加载前 200 行或 25KB；详细内容放在按主题拆开的文件里，需要时再读。常驻的短，详细的按需取，和第 11 课一样。



和我们不同的是"谁批准"：它的自动记忆不逐条问你，而是在界面上提示"正在写入记忆"，你可以随时用 
`/memory`
 查看、编辑或关闭。



## 07多 Agent：两档，默认用轻的



第 9 课已经详细对照过，这里只说它的整体思路。



**子 Agent 是默认工具。** 内置的 Explore 只读、专门搜代码；Plan 在计划模式下做调研；通用子 Agent 什么都能做。主 Agent 自己判断什么时候派。子 Agent 只把结果交回，中间过程不进主上下文。还可以让子 Agent 在临时的 git worktree 里工作，改动不碰你当前的目录。



**Agent 团队是实验功能。** 默认关闭，要设环境变量打开。打开后，几个完整的 Claude Code 会话组成团队，有队长、共享任务列表、互相发消息的邮箱。文档自己写明：团队用的 token 多得多，只在能并行、彼此独立的工作上值得；顺序性的任务、改同一个文件的工作，用单个会话或子 Agent 更好。



这个"默认轻、按需重"的设置，和 Anthropic 在多 Agent 研究系统那篇文章里的结论一致：多 Agent 好用，但很贵，而且不是所有任务都能并行。



## 08它的取舍与代价



**1\. 可配置的代价是复杂。** 六种权限模式、几十个钩子节点、六种扩展方式。对新手来说，光是弄清楚"该把这条规则写在 CLAUDE.md、技能、钩子还是权限规则里"，就是一门功课。第五节那张表，就是在帮你理清这件事。



**2\. 计划模式靠提示词。** 第 10 课讲过，Armin Ronacher 研究后的结论是，它的只读主要靠一段注入的提醒，写工具并没有被拿走。它选了灵活，代价是"只读"不是硬保证。



**3\. 绑定自家模型。** Claude Code 只用 Claude 模型。好处是工具描述、提示词、缓存策略都可以针对一个模型家族深度调优；代价是你没法换模型。



**4\. 订阅只给自家工具用。** 2026 年 4 月，Anthropic 调整了 Claude 订阅的使用范围：订阅额度不再覆盖 OpenClaw 这类第三方 Agent 工具，用户要么另买额度，要么改用 API 计费。官方给的理由是这些工具的使用模式给系统带来了过大的压力；第三方报道也提到，自家工具会针对前缀缓存做优化来降低算力成本，第三方工具往往做不到。这件事对整个 Agent 生态影响不小，第 17 课讲 OpenClaw 时还会提到。



## 09从 nami-agent 到 Claude Code，还差什么



如果你想把 nami-agent 往 Claude Code 的方向推进，按收益排序，最值得补的是：



  1. **一个真正的编辑工具。** 第 2 课练习里的 
`edit_file`
：给出原文和替换文字，只改一处。编码 Agent 最常用的就是它。

  2. **按内容搜索。** 一个只读的 
`grep`
 工具。没有它，第 9 课的 explore 子 Agent 在大项目里寸步难行。

  3. **钩子。** 在 
`handle_call`
 里，执行前后各调用一次用户配置的脚本，退出码非零就拦下。二十行就能实现一个最小版本。

  4. **分层的项目说明。** 个人一份、项目一份，拼在一起。

  5. **流式输出。** 第 6 课局限里提过，任务跑完之前你什么都看不到。



## 10本课小结



  * Claude Code 的取向：核心循环简单，所有因人而异的东西都做成可配置、可扩展

  * 权限是一套系统：模式定默认、规则叠加、deny 永远生效、受保护路径、分类器审核

  * 钩子把"硬规则"的编写权交给了使用者：提示词管建议，钩子管必须

  * 上下文和记忆的结构和我们的一致：先便宜后贵，常驻的短、详细的按需取

  * 代价是复杂、绑定自家模型，以及计划模式这类地方选择了灵活而不是强制



## 下期预告：拆解 Codex



Claude Code 把"可配置"做到了极致。下一课的 Codex 走的是另一条路：开源，并且把安全边界交给操作系统。



* * *



参考：



  * 
[Claude Code 文档：Permission modes](https://code.claude.com/docs/en/permission-modes)


  * 
[Claude Code 文档：Hooks](https://code.claude.com/docs/en/hooks)


  * 
[Claude Code 文档：Subagents](https://code.claude.com/docs/en/sub-agents)


  * 
[Claude Code 文档：Agent teams](https://code.claude.com/docs/en/agent-teams)


  * 
[Claude Code Timeline（第三方整理）](https://www.scriptbyai.com/claude-code-timeline/)


  * 
[How Claude Code Memory Works（Fast.io）](https://fast.io/resources/claude-code-memory-context-guide/)


  * 
[What is Plan Mode?（Armin Ronacher）](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/)


  * 
[Anthropic cuts OpenClaw from Claude subscriptions（Implicator）](https://www.implicator.ai/anthropic-cuts-openclaw-from-claude-subscriptions-citing-unsustainable-compute-costs/)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



