---

title: "拆解 OpenClaw 与 Hermes：个人助手这条线"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-openclaw-hermes/"

description: "OpenClaw 一年里的起落与网关设计，Hermes 改了什么；个人助手的竞争从「能做多少」转向「多稳多安全」。"

---



# 拆解 OpenClaw 与 Hermes：个人助手这条线




[从零手写 Agent · EP17](/agent/)




Teardown · OpenClaw & Hermes



> 前面拆的大多是编码 Agent。这一课看另一条线：**住在聊天软件里、替你打理日常事务的个人助手。** 这条线今年最出名的两个开源项目，一个是年初爆红的 OpenClaw，一个是后来居上的 Hermes。

>

> 这个系列第 6 课的"接入聊天软件"、第 7 课的"心跳"，原型都来自这条线。



* * *



## 01OpenClaw：一年里的起落



OpenClaw 的作者是 Peter Steinberger。它的名字改过好几次，时间线大致是：



  * **2025 年 11 月** ：以 Warelay 的名字首次发布，之后又叫过 CLAWDIS。

  * **2026 年 1 月初** ：改名 Clawdbot，开始走红。

  * **1 月 27 日** ：因为 Anthropic 的商标投诉，改名 Moltbot。同一天，有人上线了一个给 AI Agent 用的社交网络 Moltbook，又推高了一波关注。

  * **1 月 30 日** ：定名 OpenClaw。

  * **2 月 14 日** ：Steinberger 宣布加入 OpenAI，OpenClaw 交给一个非营利基金会维护，保持开源。

  * **3 月初** ：GitHub 星标约 24.7 万。



它的星标增长在 2 月初达到峰值，一周约 4 万。到 5 月下旬，星标总数约 37.4 万，npm 周下载量仍有五百多万。按任何标准，这都是一个被大量使用的项目。



然后热度开始回落。几件事叠在一起：



  * **技能市场出了大问题。** 2 月初，安全公司 Koi Security 审查了 ClawHub（OpenClaw 的技能市场）上的 2857 个技能，发现 341 个是恶意的。其中绝大多数在"安装前提"里诱导用户执行命令，在 macOS 上安装窃密木马。1 月底，思科的安全团队也发现过一个会悄悄外传数据、做提示词注入的第三方技能。

  * **监管收紧。** 3 月，据报道中国限制政府机构、国有企业和银行使用 OpenClaw，理由是安全风险。

  * **订阅被切断。** 4 月 4 日起，Anthropic 的 Claude 订阅不再覆盖 OpenClaw 这类第三方工具，用户要么另买额度，要么改用 API 计费。不少人原本是靠订阅额度在跑 OpenClaw 的。

  * **对手出现。** 据第三方统计，5 月 10 日，Hermes 在 OpenRouter 上的日 token 用量第一次超过 OpenClaw，之后差距拉大。



8 月底 OpenClaw 发布了 2.0，改进了安装、界面，加入了云端共享会话。The Register 的评价是：它仍然缺少网络和文件系统层面的安全边界，沙箱默认不开启。



需要说清楚的是："热度回落"和"没人用"是两回事。五月的数据里，它的星标和下载量依然远超 Hermes。回落的是增长势头和新用户的选择，而不是存量。



## 02OpenClaw 的设计：网关优先



### 内核是 Pi



第 14 课说过，OpenClaw 底下就是 Pi 的组件。循环、工具、会话这些"编码 Agent"的部分，用的是 Pi；OpenClaw 在上面加的是"个人助手"需要的东西。



### 网关：消息从哪来、回到哪去



OpenClaw 的核心不是循环，而是一个网关（gateway）。它负责：



  * 接入各个聊天渠道：Telegram、Discord、Signal 等

  * 决定一条消息属于哪个会话

  * 把回复投递回正确的地方



这就是我们第 6 课 
`bot.py`
 的放大版。我们只有一个渠道、只做私聊，靠 
`chat_id`
 区分会话；OpenClaw 要处理多种渠道、群聊、多设备，路由本身成了核心问题。



### 心跳：本系列第 7 课的原型



第 7 课的 
`HEARTBEAT_OK`
 就来自 OpenClaw。它的心跳默认每 30 分钟运行一次，读取工作区里的 
`HEARTBEAT.md`
 清单；清单是空的就直接跳过，连模型都不调用；回复以 
`HEARTBEAT_OK`
 开头或结尾、剩下的文字不超过 300 字，就不发给你。可以设置活跃时段，半夜不跑；可以让每次心跳用全新的会话，省 token。



### 技能与 ClawHub



技能用的是 
`SKILL.md`
 格式，工作区的技能优先于内置和全局的。ClawHub 是社区技能市场，一条命令就能安装。



问题恰恰出在这里。第 5 课我们说过：**技能就是提示词，也就是注入入口。只安装你读过的技能。** ClawHub 的事件是这句话最昂贵的注脚：341 个恶意技能，大部分并不需要什么高明的技术，只是在说明里写一句"使用前请先运行下面这条命令"，模型照做，用户也照做。



### 安全边界：默认不设



把这些放在一起，能看出 OpenClaw 的取向：**能力优先，边界靠用户自己加。** 它连接你的聊天软件、能执行代码、能安装社区技能，而沙箱默认不开。对熟悉风险的人，这是灵活；对大量被热度吸引进来的普通用户，这是隐患。



对照第 6 课第七节"威胁模型变了"那张表：从终端到聊天软件，谁能发任务、你在哪里确认、凭证有几份，全都变了。OpenClaw 的经历说明，这张表里的每一项，在大规模使用时都会变成真实的事故。



## 03Hermes：同一条路，改了什么



Hermes Agent 是 Nous Research 2026 年 2 月发布的开源个人助手，MIT 许可证，用 Python 写成。它的定位和 OpenClaw 高度重叠：常驻、接聊天软件、能定时、能执行代码。它甚至提供了一条迁移命令 
`hermes claw migrate`
，可以把 OpenClaw 的人格设定、记忆、技能、命令白名单、消息设置和白名单里的 API 密钥导过来。



但它在几个关键地方做了不同的选择。



### 卖点是"越用越好"



Hermes 的核心卖点是一个"学习循环"：



  * **记忆** ：
`MEMORY.md`
 记环境和约定，
`USER.md`
 记你是谁、你的偏好，都有字符上限

  * **技能** ：完成复杂任务后，它会把做法总结成技能，之后在使用中继续改进

  * **会话检索** ：过去所有对话存在 SQLite 里，用全文索引检索



第 11 课已经详细对照过它的记忆设计：限额、会话开始时的冻结快照、写满了报错、压缩之前专门给一次记忆的机会。这些设计细节，比"自我改进"这个口号更值得学。



### 定时任务：和第 7 课同样的约束



Hermes 的定时任务用自然语言描述，到点在一个全新的、隔离的会话里运行，结果发到你的聊天渠道。有一条规则和我们第 7 课一模一样：**定时任务运行时，不能再创建定时任务** ，防止自动化失控。



### 执行环境：六种后端



它支持六种执行代码的后端：本地、Docker、SSH、Daytona、Singularity、Modal。其中几种是云端的，闲置时休眠，需要时唤醒。这让"在隔离环境里跑"变成了一个配置选项，而不是用户需要自己搭的东西。



### 其他



一个网关进程同时接 Telegram、Discord、Slack、WhatsApp、Signal 和邮件，在一个平台开始的对话可以换到另一个平台继续；支持 MCP；技能兼容 Agent Skills 开放标准；可以派出隔离的子 Agent 并行工作。



## 04两者对比



| OpenClaw | Hermes

---|---|---

发布 | 2025 年 11 月 | 2026 年 2 月

语言 | TypeScript | Python

内核 | Pi | 自己的循环

核心卖点 | 能力强、渠道多、社区技能多 | 记忆和技能"越用越好"

记忆 | 记忆文件 + 人格设定 | 有上限的 MEMORY.md / USER.md，冻结快照，会话检索

技能来源 | 社区市场 ClawHub 为主 | 自己总结 + 社区

执行隔离 | 默认不开沙箱 | 六种后端，可以一键放进容器或云端

定时 | 心跳 + 定时任务 | 自然语言 cron，隔离会话，不能再建 cron



把两者放在一起，能看出这条线一年里学到的东西：**个人助手的竞争，从"能做多少事"转向了"做得多稳、多安全、越用越懂你"。**



## 05这条线给 nami-agent 的启发



回头看第 6、7 课，我们当时做的几个"保守"选择，在 OpenClaw 的经历面前都显得很必要：



  * **白名单不设置就不启动** （第 6 课）：渠道一接上，任何能找到你机器人的人都能给它发任务，这一关不能交给用户自己记得配。

  * **技能目录只读、只装读过的技能** （第 5 课）：ClawHub 事件。

  * **定时任务预授权有上限、不能创建定时任务** （第 7 课）：Hermes 也采用了同样的约束。

  * **程序状态放在工作区之外** （第 4、7、8、11 课）：防止 Agent 改写自己的配置。



如果要往 Hermes 的方向走，最值得加的是**执行后端** ：让 
`run_shell`
 可以配置成在 Docker 容器里执行。这和第 13 课说的操作系统沙箱是同一件事，只是换了一种实现。



## 06本课小结



  * OpenClaw：2026 年初爆红，网关优先，内核是 Pi，心跳是本系列第 7 课的原型

  * 热度回落的原因叠加：技能市场的恶意技能、监管、订阅被切断、对手出现；存量依然很大

  * 它的取向是能力优先、边界靠用户自己加，规模一大，风险都成了真实的事故

  * Hermes：同一条路，卖点换成"越用越好"，记忆设计细致，执行隔离成了配置项

  * 这条线的竞争，从"能做多少事"转向了"做得多稳、多安全"



## 下期预告：总对照表



六个 Agent 拆完了。最后一课把它们放进同一张表，按十一个零件逐项对比，看看哪些已经成了共识，哪些还在分歧，以及这个系列的整体回顾。



* * *



参考：



  * 
[OpenClaw（维基百科）](https://en.wikipedia.org/wiki/OpenClaw)


  * 
[Researchers Find 341 Malicious ClawHub Skills（The Hacker News）](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html)


  * 
[Anthropic cuts OpenClaw from Claude subscriptions（Implicator）](https://www.implicator.ai/anthropic-cuts-openclaw-from-claude-subscriptions-citing-unsustainable-compute-costs/)


  * 
[OpenClaw vs Hermes Agent: Stars, Downloads & Usage 2026](https://glukhov.org/ai-systems/comparisons/openclaw-hermes-alternatives-popularity/)


  * 
[OpenClaw 文档：Heartbeat](https://docs.openclaw.ai/zh-CN/gateway/heartbeat)


  * 
[Hermes Agent（GitHub）](https://github.com/NousResearch/hermes-agent)


  * 
[Hermes Agent 5-pillar architecture（MindStudio）](https://www.mindstudio.ai/blog/hermes-agent-5-pillar-architecture-memory-skills-soul-crons)


  * 
[Hermes Agent vs OpenClaw: Deep Analysis（Kanaries）](https://docs.kanaries.net/articles/hermes-agent-vs-openclaw)


  * 
[Pi（Armin Ronacher）](https://lucumr.pocoo.org/2026/1/31/pi/)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)



