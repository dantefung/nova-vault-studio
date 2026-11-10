---

title: "总对照表：共识、分歧与全系列回顾"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-comparison/"

description: "七个 Agent、十一个零件放进同一张表：五个共识、四个分歧、四条路线，以及全系列回顾。"

---



# 总对照表：共识、分歧与全系列回顾




[从零手写 Agent · EP18](/agent/)




Comparison & Recap



> 最后一课。前十一课我们亲手写了一个 Agent 的十一个零件，后六课拿这些零件当尺子，量了 Claude Code、Codex、Pi、Grok Bot、DeepSeek Harness、OpenClaw 与 Hermes。

>

> 这一课把它们放进同一张表，回答两个问题：**哪些做法已经成了共识，哪些还在分歧。** 最后回顾整个系列。



* * *



## 01总对照表



为了放得下，表格分成两张。单元格只写最有代表性的做法，细节见各课。表格较宽，在手机上可以左右滑动查看。



### 基础零件（第 1–7 课）



零件 | nami-agent | Claude Code | Codex | Pi | Grok Bot | DeepSeek Harness | Hermes

---|---|---|---|---|---|---|---

循环 | 本机 while 循环 | 本机，SDK 开放 | 本机，Rust 核心库 | 本机，极简 | 云电脑上常驻 | 循环本身是插件 | 本机或云端后端

工具 | 5 个函数 | 内置一整套 + MCP | 统一路由器 | 4 个：read/write/edit/bash | 连接器优先，浏览器兜底 | 按模式组合 | 注册表 + MCP

权限 | 硬规则 + 分级 + 确认 | 6 种模式 + 规则 + 分类器 | 系统沙箱 × 审批 | 不弹窗，靠容器 | 按风险审批，可加规则 | 审批与沙箱分开 | 隔离后端可选

上下文 | 截断 → 清理 → 摘要 | 先清工具输出再摘要 | 服务端压缩 | 树形会话，历史不丢 | 未公开 | 只追加的事件日志 | 压缩前先存记忆

说明与技能 | AGENTS.md + 只读技能 | 分层 CLAUDE.md + 技能 | AGENTS.md + 技能 | AGENTS.md + 技能 + 扩展 | 技能，可"教一遍" | 技能 + Creator | 自己总结技能

渠道 | Telegram | 终端/IDE/桌面/网页/Slack/Channels | CLI/IDE/网页/桌面 | 终端/RPC/SDK | 桌面/iOS/X/Slack | 网页/桌面/无头/SDK/ACP | 6 个聊天平台

定时 | 预授权 + 心跳 | 本地 /loop + 云端 Routines | 本系列未展开 | 不内置 | Routines | 实验插件 | 自然语言 cron



### 进阶零件（第 8–11 课）



零件 | nami-agent | Claude Code | Codex | Pi | Grok Bot | DeepSeek Harness | Hermes

---|---|---|---|---|---|---|---

MCP | stdio 客户端 | 本地 + 远程，延迟加载 | 客户端 + 服务器 | 1.0 起，经 Codemode | 不依赖 | 内置，默认不启用 | 支持

子 Agent | 一层，并行只读 | 内置多种，可嵌套，worktree | 要求时才派，深度 1 | 不内置 | 多个长期 bot 协作 | 插件，可调别家 Agent | 隔离子 Agent

多 Agent 团队 | 无 | 实验功能 | 无 | 无 | bot 群聊 | 实验插件 | 无

计划 | update_plan + 强制只读 | 待办 + 计划模式（提示词） | update_plan | 不内置 | 未公开 | 计划与目标工具 | 未查到

记忆 | 每条确认 + 会话检索 | CLAUDE.md + 自动记忆 | 会话后整理，需开启 | 不内置 | 偏好与角色，按 bot 分开 | 日志可搜索 | 有上限、冻结快照、全文检索



## 02已经成了共识的五件事



**1\. 内核都是同一个循环。** 模型请求工具，代码执行，结果放回对话，模型不再请求就结束。七个 Agent 没有一个例外。第 1 课的 100 行，就是它们共同的地基。



**2\. 说明和技能分开，技能按需加载。** 常驻的项目说明要短（AGENTS.md / CLAUDE.md），详细的做法写成技能，平时只放名字和一句描述，需要时再读全文。
`SKILL.md`
 格式已经是事实标准，AGENTS.md 进了 Linux 基金会旗下的 Agentic AI Foundation。



**3\. 外部工具走 MCP。** 除了不依赖 MCP、走连接器和浏览器路线的 Grok Bot，其余几家都支持 MCP。连最坚决拒绝它的 Pi，1.0 也加上了。MCP 同样在 Agentic AI Foundation 里。



**4\. 上下文管理：先便宜，后贵；常驻的短，详细的按需取。** 截断、清理工具输出、摘要的顺序；记忆只放一小段常驻，其余靠检索。各家的实现细节不同，结构几乎一样。



**5\. 写操作不并行。** 子 Agent 被广泛使用，但多个 Agent 同时改同一份代码，没有一家把它当成默认做法。并行的大多是只读的调查；需要并行写的，用 git worktree 把每个人隔开。



## 03还在分歧的四件事



**1\. 安全边界放在哪里。** 这是分歧最大的一处，大致有四种答案：



  * **问人** ：nami-agent、默认模式下的 Claude Code。简单，但会疲劳。

  * **让另一个模型审** ：Claude Code 的 auto 模式、DeepSeek Harness 的自动审批插件。减少打扰，但分类器会误判。

  * **操作系统沙箱** ：Codex，以及 DeepSeek Harness 的 workspace-write。硬边界，但会挡住合理的操作。

  * **换一台机器** ：Pi 建议的容器、Hermes 的云端后端、Grok Bot 的云电脑。最彻底，代价是环境和你的机器分离。



越往下越可靠，也越重。我们的判断是：对一个能执行命令的 Agent，至少要有一层不依赖模型的硬边界。



**2\. 计划要多正式。** 从"一个 Markdown 文件"（Pi）到"一种权限模式，靠提示词约束"（Claude Code），再到"代码强制只读加审批"（nami-agent）。越正式越可靠，也越笨重。



**3\. 谁来写记忆和技能。** Agent 自己写（Claude Code 的自动记忆、Hermes 的自我改进），后台批量整理（Codex），还是每条都要人批准（nami-agent）。核心矛盾是：自己写的越多，越省心，也越容易把一次注入固化成长期的问题。OpenClaw 技能市场的事件说明，这不是理论上的担心。



**4\. 模型绑不绑定。** Claude Code 只用 Claude；Codex 和自家模型深度绑定；Pi、DeepSeek Harness、Hermes 让你自由选；Grok Bot 干脆把模型藏起来。绑定能深度调优（缓存、压缩、工具描述），开放能换模型、能接本地模型。



## 04四条路线



把七个 Agent 按整体取向归类，大致是四条路线：



路线 | 代表 | 一句话

---|---|---

产品化，处处可配置 | Claude Code、Codex | 开箱即用，复杂度藏在配置里

极简，靠扩展 | Pi | 内核最小，缺什么让 Agent 自己写

框架化，一切皆插件 | DeepSeek Harness | 没有特权内核，连循环都能换

常驻的个人助手 | Grok Bot、OpenClaw、Hermes | 住在聊天软件或云端，替你长期干活



没有哪条路线全面胜出。选哪个，取决于你是想**用** 一个 Agent、**改** 一个 Agent，还是**在 Agent 上做产品** 。



## 05全系列回顾



十八课下来，nami-agent 的最终结构是：





    第一部分：手写核心

      agent.py         第 1 课起  主循环、Session；第 6 课起与 I/O 分离

      tools.py         第 2 课    工具注册表、统一执行器

      permissions.py   第 3 课    硬规则 → 风险分级 → 确认；第 10 课加计划模式

      context.py       第 4 课    截断 → 清理 → 摘要；会话持久化；状态目录

      skills.py        第 5 课    AGENTS.md 常驻，技能按需加载，技能只读

      telegram.py      第 6 课    长轮询渠道

      bot.py           第 6 课    白名单、聊天确认、出错回滚

      scheduler.py     第 7 课    定时任务、心跳、无人值守的预授权



    第二部分：主流能力

      mcp_client.py    第 8 课    MCP 客户端

      subagent.py      第 9 课    子 Agent，并行只读

      planning.py      第 10 课   待办清单、计划模式

      memory.py        第 11 课   长期记忆、会话检索



    第三部分：拆解主流 Agent

      第 12–17 课     Claude Code、Codex、Pi、Grok Bot、DeepSeek Harness、OpenClaw 与 Hermes





如果只能记住一句话，就是第 1 课开头那句，在后面的每一课里都反复出现：**模型只提出请求，执行与否、执行多少、结果怎么回去，由代码决定。**



所有的安全设计都从这里来：权限检查放在代码里，不放在提示词里；子 Agent 能用什么工具，由执行层强制；计划模式的只读，由权限层强制；记忆和技能的写入，要经过确认。主流产品在这些地方的分歧，本质上是在讨论：**这一层，要不要交给代码。**



## 06接下来学什么



读完这个系列，最好的下一步不是再读一个 Agent 的源码，而是：



  1. **拿 nami-agent 做一件你真正需要的事。** 看它在哪里出错、哪里让你烦。这比任何教程都更能告诉你，哪一课的哪个设计还不够好。

  2. **补上第 12 课列出的那几样。** 编辑工具、grep、钩子、流式输出。每一样都不超过五十行，做完它就能处理真实的代码仓库了。

  3. **试着把第 3 课的
`run_shell`
 放进沙箱。** 这是从"教学代码"走向"敢在自己电脑上长期跑"的那一步。

  4. **读 Pi 或 Codex 的源码。** 有了这个系列的十一个零件做地图，你会发现大型 Agent 的代码不再是一团迷雾，每个模块都能对上号。



这个系列到这里结束。配套代码一共十一个目录，第 11 课的版本有 49 个测试，代码开源在 GitHub：
[NamiAgent](https://github.com/aa1143/NamiAgent)
，还带一个本地网页端，能在浏览器里看 Agent 的每一步；也可以
[下载压缩包](/downloads/nami-agent.zip)
。



* * *



参考：



  * 第 12–17 课的参考链接

  * 
[Linux Foundation 宣布成立 Agentic AI Foundation](https://linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)


  * 
[How we built our multi-agent research system（Anthropic）](https://www.anthropic.com/engineering/multi-agent-research-system)


  * 
[Multi-Agents: What's Actually Working（Cognition）](https://cognition.com/blog/multi-agents-working)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



