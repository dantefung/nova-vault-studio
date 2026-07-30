---
title: "Matt Pocock wayfinder + handoff：AI Agent 跨 5 次会话接力赛不掉链"
date: "2026-07-30"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/H1httNlFmRqN9jyOAO380A"
---

# Matt Pocock wayfinder + handoff：AI Agent 跨 5 次会话接力赛不掉链

🚩 2026 年「术哥无界」系列实战文档 X 篇原创计划 第181篇，AI 编程最佳实战「2026」系列第63篇大家好，欢迎来到术哥无界 | ShugeX ｜ 运维有术。我是术哥，一名专注于 AI 编程、AI 智能体、Agent Skills、MCP、云原生、AIOps、Milvus 向量数据库的技术实践者与开源布道者！Talk is cheap, let's explore。无界探索，有术而行。5 次会话接力同一张 map 的视觉封面你这周跟 Agent 协作的方式，大概长这样：会话 1 跟你聊了一个半小时，把需求敲定了，写了三百行代码。会话 2 一打开，Agent 看着你给的 prompt 客气地问：能先说说这个项目的背景吗？你深吸一口气，把昨天的对话重新复述了一遍。会话 3 你想做点调整，发现 Agent 又把上次讨论过的为什么不能用 X 方案重新讨论了一遍，结论还跟上次相反。这不是 Agent 笨。这是上下文窗口本身就是一次性的。Matt Pocock 在skills/engineering/wayfinder/SKILL.md和skills/productivity/handoff/SKILL.md里给出了一套接力协议：用wayfinder维护一张跨会话共享的地图，用handoff在会话之间交接上下文。这篇文章不演示怎么跑通它，那是 hands-on 文章干的事。我把源码扒开，告诉你什么时候用哪个、为什么这么用、什么时候别用。1. 先搞清楚一个边界：会话不是无限的Matt Pocock 维护的dictionary-of-ai-coding里有一个关键术语：smart zone。原文是这么说的：Early in a session the agent is in a 'smart zone' — sharp, focused, recall is good. As the session grows it drifts into a 'dumb zone': sloppier, forgetful, more mistakes — and more faithfulness hallucinations. ... On frontier models, the dumb zone commonly begins around125K-150K tokens— though this is debated.ask-matt/SKILL.md把它简化成了~120K tokens的工作阈值。社区里这个数字还有 100K 的说法（来自 AI Engineer 96-min workshop），但dictionary自己都加了this is debated-别把它当硬阈值，理解机制就行：会话拖长后，注意力会逐渐稀薄，模型也更容易自信地忘掉你一小时前定下的约束。这就引出了 wayfinder 和 handoff 要解决的同一个问题：会话装不下，但又不能在一个会话里硬塞。但它们解决的装不下不是同一种。搞清楚这个，才能在具体场景里选对工具。2. 三选一：wayfinder / handoff / 直接 main flow我把源码里反复出现的判断信号整理成一张表：场景信号选谁为什么目的地清晰，一两个会话能搞定main flow（/grill-with-docs→/to-spec→/to-tickets→/implement）路上没雾，没必要地图当前会话快到 smart zone，但任务规模不大/handoff换窗口不换任务，把对话搬到下一个会话任务太大、雾太大，还说不清目的地/wayfinder先把目的地钉死，再 fan out 出票原文对此有个非常直接的措辞，藏在wayfinder/SKILL.mdchart 步骤的内部提示里：If this surfaces no fog — the way to the destination is already clear, the whole journey small enough for one session — you don't need a map. Stop and ask the user how they'd like to proceed.反过来ask-matt/SKILL.md里也明说：when a thread is full or you need to branch off (e.g. into a/prototypesession), this compacts the conversation into a markdown file所以两个工具的本质区别是：wayfinder解决的是工作本身就需要多会话这种装不下。一次启动就在为多会话协作铺路。handoff解决的是当前会话快到边界了这种装不下。本来一两会话能干完，只是要开个新会话把上下文搬过去。混用信号：如果你发现自己既想用 wayfinder 又想用 handoff，多半是任务规模被低估了。强行拆会出现在 wayfinder 里开 handoff 又再开 wayfinder的套娃。wayfinder / handoff / main flow 三选一判断表3. 一张贯穿多会话的地图：5 次会话接力真实案例为了把抽象规则落到地上，我虚构一个正在发生的任务（不是我已经做完的项目，别问你跑通了吗，没跑）：任务背景：把一个内部工具的指标存储从 SQLite 迁移到 ClickHouse。工作量未知，因为还没调研清楚现有 schema 的复杂度、迁移过程的停机容忍度、回滚条件。按wayfinder的工作方式，5 次会话的接力链大致是这样：会话 1  Chart the map↓会话 2  解决 1 张 frontier ticket（research 类型）↓会话 3  解决 1 张 frontier ticket（grilling 类型）↓会话 4  解决 1 张 frontier ticket（task 类型）↓会话 5  map 清空 → 回到 main flow（/to-spec → /to-tickets → /implement）下面分别说每一次会话在做什么。会话 1：Chart the map进入wayfinder的 chart 模式。SKILL.md明确写的是 6 步：Name the destination（用/grilling+/domain-modeling钉死终点）Map the frontier（广度优先 grilling，不深挖）Create the map（打wayfinder:map标签，挂在 issue tracker）Create the tickets you can specify now（子 issue，先 create 后 wire blocking）Fire the research subagents（并行跑/research）Stop- chart 只产 map，不解决任何 ticket这一步绝对不能省。SKILL.md里反复警告：Plan, don't do- 默认情况下 wayfinder 只产决策不产交付品。如果你在 chart 阶段就忍不住让 Agent 写代码，整个多会话协议的纪律就破了。对迁移任务来说，会话 1 产出的 map 大概长这样（map 的 5 段结构，原文逐字）：# Map: SQLite → ClickHouse 迁移### Destination指标查询从 SQLite 切换到 ClickHouse，停机 ≤ 5 分钟，回滚路径完整。### Notes-领域：指标存储-effort: large-该 effort 每次会话都要读：/data-modeling, /grilling-偏好：所有 ticket 必须带 ADR 链接### Decisions so far-[destination-grilling] (link) - 终点是**查询切到 CH + 停机可控**-[schema-survey] (link) — 现有 SQLite schema 已盘点，3 张宽表### Not yet specified-实时写入策略（CH 默认走 batch，sync 还是异步？）-旧数据回填窗口（一次性 vs 灰度）-验证测试矩阵（哪些查询必须双跑？）### Out of scope-Grafana 面板改造-跨集群复制-实时聚合管道（aggregator 单独 effort）注意两个细节：第一，Decisions so far每行就是一个已关闭的 ticket。原文写的是- [name](link) - one-line gist，map 本身不存决策，只索引到对应 ticket。map 是索引，不是仓库（原文：an index, not a store） - 这条很重要，意味着如果你在 map 正文里写了长篇决策，等同于违反纪律，下个会话会读到过期版本。第二，Not yet specified不是简单的待办。原文给的判据是：Fog or ticket? The test is whether you can state the question precisely now -notwhether you can answer it now.也就是：能精确描述问题，但还不能精确回答 - 这种雾才进Not yet specified。已经决定的事、已经有 ticket 的事、已经确认出 scope 的事，都不进 Not yet specified。那Out of scope和雾的区别呢？原文一句话：Scope, not sharpness, lands it here.雾是还说不清怎么问，out of scope 是清楚知道这不在 destination 内。out of scope永远不会 graduate，它直接关掉，写一行进 map，然后遗忘。会话 2-4：每次解决 1 个 frontier ticketSKILL.md给出的 work 模式 5 步是：Load map（低分辨率）Choose ticket（用户指定或取第一个 frontier）Claim（assign to self）ResolveRecord resolution（评论 + 关闭 + 加 context pointer 到Decisions so far）+ graduate fog + 处理 out-of-scope关键约束是每会话最多解决 1 个 ticket。这条听起来反直觉 - 为啥不一次解决两个，省得切换会话？因为 ticket 之间会互相污染 working state。1 个 ticket 配 1 个干净的会话上下文，是这套纪律的最低单元。research类型是例外 - 它是AFK（Away From Keyboard），可以并发跑多个/researchsubagent，但结果要落回 ticket，而不是直接 commit 到代码。下面看 ticket 类型学。5 次会话接力链流程图4. 4 种 ticket 和 HITL / AFK 划分SKILL.md的## Ticket Types一节给出了完整的 4 类划分：Type模式含义怎么 resolveResearchAFK查文档 / 第三方 API / 本地资源/researchsubagent 并行跑PrototypeHITL用原型提升讨论保真度（LOGIC / UI 两个分支）/prototypeskill，需要人和 Agent 一起看GrillingHITL一问一答对话/grilling+/domain-modelingTaskHITL 或 AFK阻塞决策的手工操作看情况注意HITL 和 AFK 不是 ticket 类型的修饰词，而是 ticket 的执行模式。research永远是 AFK（因为就是查资料，不需要人盯着）；grilling永远是 HITL；task看情况。为什么grilling必须是 HITL？SKILL.md里有一句非常严厉的话：A HITL ticket only resolves through that live exchange; the agent never stands in for the human's side of it (a grilling agent that answers its own questions has broken this).翻译一下：Agent 自己回答自己提的 grilling 问题 = ticket 协议已损坏。这条划在grilling上尤其敏感 - grilling 的本质就是问题还没收敛，需要人和 Agent 一问一答来回打磨。如果 Agent 直接写一个答案上去，那 ticket 形式上 close 了，实质上 fog 没收敛，下一个会话读到的就是虚假的清晰度。社区 issue#667（2026-07-25）反映过这个边界争议：wayfinder:task类型在 HITL 和 AFK 之间摇摆，命名分类还没完全收敛。换句话说，你用的时候，遇到 task ticket 要先想清楚它到底该谁来执行，不能照着标签硬上。issue#683（2026-07-28）讨论的正是wayfinder/SKILL.md里的Notes 覆盖条款-Plan, don't do的默认行为可以被 Notes 里的 effort 字段覆盖。这给 wayfinder 留出了从只产决策越权到直接执行交付的口子。社区在 pushback 这条，但官方文本目前没改。你如果用 wayfinder，要注意 effort 默认值是不是真的留在了 plan 档。5. handoff 的 5 条硬约束：怎么把上下文搬到下个会话handoff/SKILL.md只有 16 行，但每行都是硬约束。原文 5 条：保存到 OS 临时目录，不是当前 workspace必须包含suggested skillssection，给出下次会话应调用的 skill不重复其他产物（specs / plans / ADRs / issues / commits / diffs），只引用 path / URL脱敏：API key、密码、PII用户参数 → 作为下次的 focus 调整文档举个例子，对接迁移任务的会话 3（grilling ticket 还没收敛就快到 smart zone 了），handoff 文档应该长这样：# Handoff: SQLite → ClickHouse 迁移，会话#3### State正在跟用户对**实时写入策略**。当前 fog 收敛度：约 60%，还剩 1-2 轮问答。### Suggested skills下次会话开场应该跑：-/wayfinder work map:sqlite-to-ch-migration-/grilling — 继续会话#3没完成的对话### Pointers（不要重复内容）-Map issue: 详见仓库 issue#42-进行中的 ticket:#47(realtime-write-strategy)-当前 spec 草稿: .scratch/sqlite-to-ch/spec-draft.md-会话#1、#2的决议: 详见上面 map 的 Decisions so far### User parameters下次 focus：**继续打磨 realtime-write-strategy 这张 ticket**，把它收敛到可以 close。"### Redacted（无敏感信息）5 条约束的实际含义：保存到 OS 临时目录：意味着文件不在 git 里，下次会话如果想引用，得用绝对路径或者 issue 里的附件。社区 issue#670（2026-07-26，标题Handoff skill - copy handoff file path to clipboard）就直接吐槽这个体验问题 -handoff 写到 temp dir 后用户得自己找路径给下次会话用。这意味着你不能假设下次会话会自动找到 handoff 文档，得自己复制路径。不重复其他产物：specs / plans / ADRs / issues / commits / diffs 都已经在别处有权威来源，handoff 只挂引用。原文理由是：下次会话如果从 handoff 里读到旧的 spec 内容，会覆盖掉最新 commit 上的真相，这是有信息代价的。脱敏：这个容易理解，但容易漏。handoff 把对话搬走时，会话里提到的.env内容、本地路径里的用户名、报错日志里的 token，全部会一起进文档。suggested skills：这条最容易被当成装饰忽略。但它是下次会话的开场指令- handoff 文档读完，下一个 Agent 第一件事是按 suggested skills 跑。如果不写，下个会话不知道该用哪个 skill，整个多会话协作就断了。用户参数作为 focus：handoff 的argument-hint是What will the next session be used for?，这个参数会重塑文档的 focus 段落，决定下次会话开场时把哪些状态放最前面。6. /handoff 和 /compact 不是一回事ask-matt/SKILL.md给了一句非常清晰的分界：/handoff: You don't continue in place -you open a new session and reference that fileto carry the context across. ... It's the bridge between context windows, in either direction./compact: stay in thesame conversation, letting the earlier turns be summarized. ... Don't compact mid-phase - the agent can lose its way.一句话总结：**/handoffforks，/compactcontinues**。展开说，dictionary-of-ai-coding 给出了一个更细的三层模型：Handoff artifact：文件落到磁盘，下个会话能读、能修改、能复用。Compaction：内存里把早期 turns 压成摘要，有损，原文说detail traded for headroom。Clearing：直接关掉会话，什么都不传。但 transcript 通常还在磁盘上。/compact的最大风险是mid-phase compact：自动 compaction 触发的时机是接近 token 上限，而会话恰好在做复杂任务的中段（重写一半的函数、改到一半的 schema）。dictionary给的症状很具体：The classic symptom: the agent carries on confidently but has quietly forgotten a constraint you established an hour ago, and you only notice when its work starts contradicting it./compact触发后，summary 自行决定哪些决策值得保留-决定权不在你手里。/handoff没有这个问题：handoff 文档是你（或 Agent 在你眼皮下）写的，focus 段落是用户参数驱动的。所以两者的判断：想继续当前对话，但会话太满了 →/compact（但别在 phase 中段）想开新会话继续工作 →/handoff反模式：把/handoff当轻量备忘用，只塞几行 note 进去。这样做跟/compact没区别 - 丢掉了 handoff 作为 artifact 的核心价值（你能在它之上审阅、修正、复用）。7. 衔接主路：map 清空后必须回到 main flowwayfinder 不是终点，是 on-ramp。ask-matt/SKILL.md的原话：When the map clears, it hands off, it doesn't build: merge onto the main flow at/to-spec, which collapses the map's linked decisions into a buildable plan, then/to-ticketsand/implementas usual.也就是说，**wayfinder 推进到 "way is clear" 之后，必须回到/to-spec→/to-tickets→/implement。不能直接跳到/implement**。为什么？原文警告：Looping the map straight into/implementskips that collapse and throws the linked detail away — go straight to/implementonly when the effort turned out genuinely small./to-spec这一步的作用是collapse，把 map 里散落的 ticket 决策折叠成一个可执行的 spec。跳过这一步，意味着/implement直接从 map 拉 ticket。ticket 之间的依赖、约束、ADR 链接全丢了，wayfinder 维护的跨会话共享地图在最后一个会话被自己打回原形。回到迁移任务的接力链：会话 5↓map 清空（所有 frontier ticket 已 close，fog 已收敛）↓回到 main flow:→ /to-spec       把 map 折成 spec→ /to-tickets    spec 拆 vertical slices→ /implement     每次 implement 一个 ticket（implement 之间清空上下文）↓ship如果会话 5 你嫌烦直接/implement，会得到一个能跑但没有 spec 留底的产物 - 下次有人接手这段代码，没有任何文档能解释为什么 CH 选了 batch 而不是 sync。反例 1（过度规划）：上面那张 5 段 map 是为目的地模糊 + 多会话的任务设计的。如果任务一两个会话能搞定，画 map 本身就是浪费时间。典型场景：我想加一个健康检查接口- 你不需要 wayfinder。/grill-with-docs+/implement直接干，handoff 都不用开。反例 2（接力失败）：handoff 文档漏写 suggested skills。下次会话读完 handoff 不知道该跑哪个 skill，原地愣住或者跑错 skill，整条接力断在第一个 handoff 上。issue#670反映的找不到 handoff 路径问题会把这个反例的痛感放大 10 倍。反例 3（接力失败）：handoff 文档重复了 ticket 内容而不是引用 ticket。下次会话读到 handoff 里的旧 spec，没去翻最新 commit，写出跟代码不一致的代码。handoff 的不重复其他产物约束就是为了防这个。过度规划与接力失败两种错位反例对照8. 前置依赖：setup-matt-pocock-skillswayfinder 不是开箱即用的。它依赖setup-matt-pocock-skills跑一次把环境配好：issue tracker 选哪个（默认 GitHub issues，可降级为本地 markdown）、triage labels、domain doc layout 怎么放。SKILL.md里的原文：setup-matt-pocock-skills: 必须在其他 engineering skill 第一次使用前跑一次这一条对写代码实践的人来说很关键：不是所有 Agent 工具都支持同一套 issue tracker 与 native blocking 关系。如果你用的是 Notion / Linear / Jira，native dependency 的支持程度不一样。wayfinder/SKILL.md给的 fallback 方案是用 body convention 代替 native blocking，但这条 fallback 是降级，不是等价。换句话说：用 GitHub Issues：完整支持 wayfinder（labels、native blocking、assignment 都齐）用 Notion / Linear / Jira：先验证是否支持 blocking、labels、assignee，否则 wayfinder 协议的核心约束会被削弱没 issue tracker：降级到.scratch/one/本地 markdown，这等价于git 当 tracker，但失去并发协作能力9. 事实清单：源码说 vs 作者建议这里得把源码事实和作者建议分开，免得被社区贴的标签带偏：源码事实（你能从 SKILL.md 里查到原文的）：map 是 5 段结构（Destination / Notes / Decisions so far / Not yet specified / Out of scope）ticket 有 4 类（research / prototype / grilling / task），分 HITL / AFKgrilling必须是 HITL，agent 不能自己答handoff 有 5 条硬约束（temp dir / suggested skills / 不重复 / 脱敏 / 用户参数）/handoffforks，/compactcontinueswayfinder → main flow 的衔接是/to-spec→/to-tickets→/implementsmart zone 阈值存在，但具体数字（100K / 120K / 125K-150K）有争议作者实践建议（我基于上面的事实给出的判断，不是源码承诺的）：一两个会话能搞定的任务别上 wayfinder不要把/handoff当轻量备忘注意 wayfinder 的 Notes effort 字段会绕过 plan-only 默认多会话工作流不要混用 wayfinder 和 handoffhandoff 路径得自己复制给下次会话，issue#670反映这是真实痛点我不承诺wayfinder 一定减少返工、一定省 token；也不承诺handoff 一定保留全部上下文。这两条都没在源码里写过 - 写文章的人最常犯的错就是用一个 tool 名加一个希望，编出一篇评测。一句话总结wayfinder 解决工作本身横跨多次会话，handoff 解决会话快到边界。选错工具的代价是规划跑得比实现还贵。map 是索引不是仓库：决策只活在 ticket 里，map 只挂链接。/handoff是 fork（开新会话 + 引用文件），/compact是 continue（同一会话压摘要）。两者不是轻量 / 重量的区别，是方向的区别。setup-matt-pocock-skills是这套协议的地基，没有 issue tracker + native blocking + labels 的环境，wayfinder 协议会被削弱一半能力。写到这里，我反而想抛个我答不出来的问题给你：smart zone的具体阈值（100K / 120K / 125K-150K）在不同模型上漂移，源码自己也说this is debated，你打算怎么给你的 Agent 设个快到了就 handoff的实际触发点？这条工程上没人替你决定。说明：本文内容基于 Matt Pocock Skills 仓库、Matt Pocock 的 aihero.dev 字典词条（smart zone）与社区 GitHub Issues（#670/#683/#667）分析整理而成，区分源码事实与作者实践建议。文中对 wayfinder 减少返工、handoff 保留上下文的描述仅为机制层面分析，实际效果请以你的 Agent 工具与模型测试结果为准。如果你有 wayfinder 或 handoff 的实际使用经验，欢迎在评论区分享交流。好啦，谢谢你观看我的文章，如果喜欢可以点赞转发给需要的朋友，我们下一期再见！敬请期待！

> 🚩 2026 年「术哥无界」系列实战文档 X 篇原创计划 第181篇，AI 编程最佳实战「2026」系列第63篇大家好，欢迎来到术哥无界 | ShugeX ｜ 运维有术。我是术哥，一名专注于 AI 编程、AI 智能体、Agent Skills、MCP、云原生、AIOps、Milvus 向量数据库的技术实践者与开源布道者！

🚩 2026 年「术哥无界」系列实战文档 X 篇原创计划 第181篇，AI 编程最佳实战「2026」系列第63篇

大家好，欢迎来到术哥无界 | ShugeX ｜ 运维有术。

我是术哥，一名专注于 AI 编程、AI 智能体、Agent Skills、MCP、云原生、AIOps、Milvus 向量数据库的技术实践者与开源布道者！

> Talk is cheap, let's explore。无界探索，有术而行。

Talk is cheap, let's explore。无界探索，有术而行。

你这周跟 Agent 协作的方式，大概长这样：

会话 1 跟你聊了一个半小时，把需求敲定了，写了三百行代码。会话 2 一打开，Agent 看着你给的 prompt 客气地问：能先说说这个项目的背景吗？你深吸一口气，把昨天的对话重新复述了一遍。

会话 3 你想做点调整，发现 Agent 又把上次讨论过的为什么不能用 X 方案重新讨论了一遍，结论还跟上次相反。

这不是 Agent 笨。这是上下文窗口本身就是一次性的。

Matt Pocock 在skills/engineering/wayfinder/SKILL.md和skills/productivity/handoff/SKILL.md里给出了一套接力协议：用wayfinder维护一张跨会话共享的地图，用handoff在会话之间交接上下文。

这篇文章不演示怎么跑通它，那是 hands-on 文章干的事。我把源码扒开，告诉你什么时候用哪个、为什么这么用、什么时候别用。

## 1. 先搞清楚一个边界：会话不是无限的

Matt Pocock 维护的dictionary-of-ai-coding里有一个关键术语：smart zone。原文是这么说的：

> Early in a session the agent is in a 'smart zone' — sharp, focused, recall is good. As the session grows it drifts into a 'dumb zone': sloppier, forgetful, more mistakes — and more faithfulness hallucinations. ... On frontier models, the dumb zone commonly begins around125K-150K tokens— though this is debated.

Early in a session the agent is in a 'smart zone' — sharp, focused, recall is good. As the session grows it drifts into a 'dumb zone': sloppier, forgetful, more mistakes — and more faithfulness hallucinations. ... On frontier models, the dumb zone commonly begins around125K-150K tokens— though this is debated.

ask-matt/SKILL.md把它简化成了~120K tokens的工作阈值。社区里这个数字还有 100K 的说法（来自 AI Engineer 96-min workshop），但dictionary自己都加了this is debated-别把它当硬阈值，理解机制就行：会话拖长后，注意力会逐渐稀薄，模型也更容易自信地忘掉你一小时前定下的约束。

这就引出了 wayfinder 和 handoff 要解决的同一个问题：会话装不下，但又不能在一个会话里硬塞。

但它们解决的装不下不是同一种。搞清楚这个，才能在具体场景里选对工具。

## 2. 三选一：wayfinder / handoff / 直接 main flow

我把源码里反复出现的判断信号整理成一张表：

场景信号选谁为什么目的地清晰，一两个会话能搞定main flow（/grill-with-docs→/to-spec→/to-tickets→/implement）路上没雾，没必要地图当前会话快到 smart zone，但任务规模不大/handoff换窗口不换任务，把对话搬到下一个会话任务太大、雾太大，还说不清目的地/wayfinder先把目的地钉死，再 fan out 出票

场景信号

选谁

为什么

目的地清晰，一两个会话能搞定

（/grill-with-docs→/to-spec→/to-tickets→/implement）

路上没雾，没必要地图

当前会话快到 smart zone，但任务规模不大

换窗口不换任务，把对话搬到下一个会话

任务太大、雾太大，还说不清目的地

先把目的地钉死，再 fan out 出票

原文对此有个非常直接的措辞，藏在wayfinder/SKILL.mdchart 步骤的内部提示里：

> If this surfaces no fog — the way to the destination is already clear, the whole journey small enough for one session — you don't need a map. Stop and ask the user how they'd like to proceed.

If this surfaces no fog — the way to the destination is already clear, the whole journey small enough for one session — you don't need a map. Stop and ask the user how they'd like to proceed.

反过来ask-matt/SKILL.md里也明说：

> when a thread is full or you need to branch off (e.g. into a/prototypesession), this compacts the conversation into a markdown file

when a thread is full or you need to branch off (e.g. into a/prototypesession), this compacts the conversation into a markdown file

所以两个工具的本质区别是：

wayfinder解决的是工作本身就需要多会话这种装不下。一次启动就在为多会话协作铺路。

handoff解决的是当前会话快到边界了这种装不下。本来一两会话能干完，只是要开个新会话把上下文搬过去。

混用信号：如果你发现自己既想用 wayfinder 又想用 handoff，多半是任务规模被低估了。强行拆会出现在 wayfinder 里开 handoff 又再开 wayfinder的套娃。

## 3. 一张贯穿多会话的地图：5 次会话接力真实案例

为了把抽象规则落到地上，我虚构一个正在发生的任务（不是我已经做完的项目，别问你跑通了吗，没跑）：

> 任务背景：把一个内部工具的指标存储从 SQLite 迁移到 ClickHouse。工作量未知，因为还没调研清楚现有 schema 的复杂度、迁移过程的停机容忍度、回滚条件。

任务背景：把一个内部工具的指标存储从 SQLite 迁移到 ClickHouse。工作量未知，因为还没调研清楚现有 schema 的复杂度、迁移过程的停机容忍度、回滚条件。

按wayfinder的工作方式，5 次会话的接力链大致是这样：

下面分别说每一次会话在做什么。

### 会话 1：Chart the map

进入wayfinder的 chart 模式。SKILL.md明确写的是 6 步：

Name the destination（用/grilling+/domain-modeling钉死终点）

Map the frontier（广度优先 grilling，不深挖）

Create the map（打wayfinder:map标签，挂在 issue tracker）

Create the tickets you can specify now（子 issue，先 create 后 wire blocking）

Fire the research subagents（并行跑/research）

Stop- chart 只产 map，不解决任何 ticket

这一步绝对不能省。SKILL.md里反复警告：Plan, don't do- 默认情况下 wayfinder 只产决策不产交付品。如果你在 chart 阶段就忍不住让 Agent 写代码，整个多会话协议的纪律就破了。

对迁移任务来说，会话 1 产出的 map 大概长这样（map 的 5 段结构，原文逐字）：

注意两个细节：

第一，Decisions so far每行就是一个已关闭的 ticket。原文写的是- [name](link) - one-line gist，map 本身不存决策，只索引到对应 ticket。map 是索引，不是仓库（原文：an index, not a store） - 这条很重要，意味着如果你在 map 正文里写了长篇决策，等同于违反纪律，下个会话会读到过期版本。

第二，Not yet specified不是简单的待办。原文给的判据是：

> Fog or ticket? The test is whether you can state the question precisely now -notwhether you can answer it now.

Fog or ticket? The test is whether you can state the question precisely now -notwhether you can answer it now.

也就是：能精确描述问题，但还不能精确回答 - 这种雾才进Not yet specified。已经决定的事、已经有 ticket 的事、已经确认出 scope 的事，都不进 Not yet specified。

那Out of scope和雾的区别呢？原文一句话：

> Scope, not sharpness, lands it here.

Scope, not sharpness, lands it here.

雾是还说不清怎么问，out of scope 是清楚知道这不在 destination 内。out of scope永远不会 graduate，它直接关掉，写一行进 map，然后遗忘。

### 会话 2-4：每次解决 1 个 frontier ticket

SKILL.md给出的 work 模式 5 步是：

Load map（低分辨率）

Choose ticket（用户指定或取第一个 frontier）

Claim（assign to self）

Resolve

Record resolution（评论 + 关闭 + 加 context pointer 到Decisions so far）+ graduate fog + 处理 out-of-scope

关键约束是每会话最多解决 1 个 ticket。这条听起来反直觉 - 为啥不一次解决两个，省得切换会话？因为 ticket 之间会互相污染 working state。1 个 ticket 配 1 个干净的会话上下文，是这套纪律的最低单元。

research类型是例外 - 它是AFK（Away From Keyboard），可以并发跑多个/researchsubagent，但结果要落回 ticket，而不是直接 commit 到代码。

下面看 ticket 类型学。

## 4. 4 种 ticket 和 HITL / AFK 划分

SKILL.md的## Ticket Types一节给出了完整的 4 类划分：

Type模式含义怎么 resolveResearchAFK查文档 / 第三方 API / 本地资源/researchsubagent 并行跑PrototypeHITL用原型提升讨论保真度（LOGIC / UI 两个分支）/prototypeskill，需要人和 Agent 一起看GrillingHITL一问一答对话/grilling+/domain-modelingTaskHITL 或 AFK阻塞决策的手工操作看情况

Type

模式

含义

怎么 resolve

Research

查文档 / 第三方 API / 本地资源

subagent 并行跑

Prototype

用原型提升讨论保真度（LOGIC / UI 两个分支）

skill，需要人和 Agent 一起看

Grilling

一问一答对话

+/domain-modeling

Task

阻塞决策的手工操作

看情况

注意HITL 和 AFK 不是 ticket 类型的修饰词，而是 ticket 的执行模式。research永远是 AFK（因为就是查资料，不需要人盯着）；grilling永远是 HITL；task看情况。

为什么grilling必须是 HITL？SKILL.md里有一句非常严厉的话：

> A HITL ticket only resolves through that live exchange; the agent never stands in for the human's side of it (a grilling agent that answers its own questions has broken this).

A HITL ticket only resolves through that live exchange; the agent never stands in for the human's side of it (a grilling agent that answers its own questions has broken this).

翻译一下：Agent 自己回答自己提的 grilling 问题 = ticket 协议已损坏。

这条划在grilling上尤其敏感 - grilling 的本质就是问题还没收敛，需要人和 Agent 一问一答来回打磨。如果 Agent 直接写一个答案上去，那 ticket 形式上 close 了，实质上 fog 没收敛，下一个会话读到的就是虚假的清晰度。

社区 issue#667（2026-07-25）反映过这个边界争议：wayfinder:task类型在 HITL 和 AFK 之间摇摆，命名分类还没完全收敛。换句话说，你用的时候，遇到 task ticket 要先想清楚它到底该谁来执行，不能照着标签硬上。

issue#683（2026-07-28）讨论的正是wayfinder/SKILL.md里的Notes 覆盖条款-Plan, don't do的默认行为可以被 Notes 里的 effort 字段覆盖。这给 wayfinder 留出了从只产决策越权到直接执行交付的口子。社区在 pushback 这条，但官方文本目前没改。你如果用 wayfinder，要注意 effort 默认值是不是真的留在了 plan 档。

## 5. handoff 的 5 条硬约束：怎么把上下文搬到下个会话

handoff/SKILL.md只有 16 行，但每行都是硬约束。原文 5 条：

保存到 OS 临时目录，不是当前 workspace

必须包含suggested skillssection，给出下次会话应调用的 skill

不重复其他产物（specs / plans / ADRs / issues / commits / diffs），只引用 path / URL

脱敏：API key、密码、PII

用户参数 → 作为下次的 focus 调整文档

举个例子，对接迁移任务的会话 3（grilling ticket 还没收敛就快到 smart zone 了），handoff 文档应该长这样：

5 条约束的实际含义：

保存到 OS 临时目录：意味着文件不在 git 里，下次会话如果想引用，得用绝对路径或者 issue 里的附件。社区 issue#670（2026-07-26，标题Handoff skill - copy handoff file path to clipboard）就直接吐槽这个体验问题 -handoff 写到 temp dir 后用户得自己找路径给下次会话用。这意味着你不能假设下次会话会自动找到 handoff 文档，得自己复制路径。

不重复其他产物：specs / plans / ADRs / issues / commits / diffs 都已经在别处有权威来源，handoff 只挂引用。原文理由是：下次会话如果从 handoff 里读到旧的 spec 内容，会覆盖掉最新 commit 上的真相，这是有信息代价的。

脱敏：这个容易理解，但容易漏。handoff 把对话搬走时，会话里提到的.env内容、本地路径里的用户名、报错日志里的 token，全部会一起进文档。

suggested skills：这条最容易被当成装饰忽略。但它是下次会话的开场指令- handoff 文档读完，下一个 Agent 第一件事是按 suggested skills 跑。如果不写，下个会话不知道该用哪个 skill，整个多会话协作就断了。

用户参数作为 focus：handoff 的argument-hint是What will the next session be used for?，这个参数会重塑文档的 focus 段落，决定下次会话开场时把哪些状态放最前面。

## 6. /handoff 和 /compact 不是一回事

ask-matt/SKILL.md给了一句非常清晰的分界：

> /handoff: You don't continue in place -you open a new session and reference that fileto carry the context across. ... It's the bridge between context windows, in either direction./compact: stay in thesame conversation, letting the earlier turns be summarized. ... Don't compact mid-phase - the agent can lose its way.

/handoff: You don't continue in place -you open a new session and reference that fileto carry the context across. ... It's the bridge between context windows, in either direction.

/compact: stay in thesame conversation, letting the earlier turns be summarized. ... Don't compact mid-phase - the agent can lose its way.

一句话总结：**/handoffforks，/compactcontinues**。

展开说，dictionary-of-ai-coding 给出了一个更细的三层模型：

Handoff artifact：文件落到磁盘，下个会话能读、能修改、能复用。

Compaction：内存里把早期 turns 压成摘要，有损，原文说detail traded for headroom。

Clearing：直接关掉会话，什么都不传。但 transcript 通常还在磁盘上。

/compact的最大风险是mid-phase compact：自动 compaction 触发的时机是接近 token 上限，而会话恰好在做复杂任务的中段（重写一半的函数、改到一半的 schema）。dictionary给的症状很具体：

> The classic symptom: the agent carries on confidently but has quietly forgotten a constraint you established an hour ago, and you only notice when its work starts contradicting it.

The classic symptom: the agent carries on confidently but has quietly forgotten a constraint you established an hour ago, and you only notice when its work starts contradicting it.

/compact触发后，summary 自行决定哪些决策值得保留-决定权不在你手里。/handoff没有这个问题：handoff 文档是你（或 Agent 在你眼皮下）写的，focus 段落是用户参数驱动的。

所以两者的判断：

想继续当前对话，但会话太满了 →/compact（但别在 phase 中段）

想开新会话继续工作 →/handoff

反模式：把/handoff当轻量备忘用，只塞几行 note 进去。这样做跟/compact没区别 - 丢掉了 handoff 作为 artifact 的核心价值（你能在它之上审阅、修正、复用）。

## 7. 衔接主路：map 清空后必须回到 main flow

wayfinder 不是终点，是 on-ramp。ask-matt/SKILL.md的原话：

> When the map clears, it hands off, it doesn't build: merge onto the main flow at/to-spec, which collapses the map's linked decisions into a buildable plan, then/to-ticketsand/implementas usual.

When the map clears, it hands off, it doesn't build: merge onto the main flow at/to-spec, which collapses the map's linked decisions into a buildable plan, then/to-ticketsand/implementas usual.

也就是说，**wayfinder 推进到 "way is clear" 之后，必须回到/to-spec→/to-tickets→/implement。不能直接跳到/implement**。

为什么？原文警告：

> Looping the map straight into/implementskips that collapse and throws the linked detail away — go straight to/implementonly when the effort turned out genuinely small.

Looping the map straight into/implementskips that collapse and throws the linked detail away — go straight to/implementonly when the effort turned out genuinely small.

/to-spec这一步的作用是collapse，把 map 里散落的 ticket 决策折叠成一个可执行的 spec。跳过这一步，意味着/implement直接从 map 拉 ticket。ticket 之间的依赖、约束、ADR 链接全丢了，wayfinder 维护的跨会话共享地图在最后一个会话被自己打回原形。

回到迁移任务的接力链：

如果会话 5 你嫌烦直接/implement，会得到一个能跑但没有 spec 留底的产物 - 下次有人接手这段代码，没有任何文档能解释为什么 CH 选了 batch 而不是 sync。

反例 1（过度规划）：上面那张 5 段 map 是为目的地模糊 + 多会话的任务设计的。如果任务一两个会话能搞定，画 map 本身就是浪费时间。典型场景：我想加一个健康检查接口- 你不需要 wayfinder。/grill-with-docs+/implement直接干，handoff 都不用开。反例 2（接力失败）：handoff 文档漏写 suggested skills。下次会话读完 handoff 不知道该跑哪个 skill，原地愣住或者跑错 skill，整条接力断在第一个 handoff 上。issue#670反映的找不到 handoff 路径问题会把这个反例的痛感放大 10 倍。

反例 3（接力失败）：handoff 文档重复了 ticket 内容而不是引用 ticket。下次会话读到 handoff 里的旧 spec，没去翻最新 commit，写出跟代码不一致的代码。handoff 的不重复其他产物约束就是为了防这个。

## 8. 前置依赖：setup-matt-pocock-skills

wayfinder 不是开箱即用的。它依赖setup-matt-pocock-skills跑一次把环境配好：issue tracker 选哪个（默认 GitHub issues，可降级为本地 markdown）、triage labels、domain doc layout 怎么放。

SKILL.md里的原文：

> setup-matt-pocock-skills: 必须在其他 engineering skill 第一次使用前跑一次

setup-matt-pocock-skills: 必须在其他 engineering skill 第一次使用前跑一次

这一条对写代码实践的人来说很关键：不是所有 Agent 工具都支持同一套 issue tracker 与 native blocking 关系。如果你用的是 Notion / Linear / Jira，native dependency 的支持程度不一样。wayfinder/SKILL.md给的 fallback 方案是用 body convention 代替 native blocking，但这条 fallback 是降级，不是等价。

换句话说：

用 GitHub Issues：完整支持 wayfinder（labels、native blocking、assignment 都齐）

用 Notion / Linear / Jira：先验证是否支持 blocking、labels、assignee，否则 wayfinder 协议的核心约束会被削弱

没 issue tracker：降级到.scratch/one/本地 markdown，这等价于git 当 tracker，但失去并发协作能力

## 9. 事实清单：源码说 vs 作者建议

这里得把源码事实和作者建议分开，免得被社区贴的标签带偏：

源码事实（你能从 SKILL.md 里查到原文的）：

map 是 5 段结构（Destination / Notes / Decisions so far / Not yet specified / Out of scope）

ticket 有 4 类（research / prototype / grilling / task），分 HITL / AFK

grilling必须是 HITL，agent 不能自己答

handoff 有 5 条硬约束（temp dir / suggested skills / 不重复 / 脱敏 / 用户参数）

/handoffforks，/compactcontinues

wayfinder → main flow 的衔接是/to-spec→/to-tickets→/implement

smart zone 阈值存在，但具体数字（100K / 120K / 125K-150K）有争议

作者实践建议（我基于上面的事实给出的判断，不是源码承诺的）：

一两个会话能搞定的任务别上 wayfinder

不要把/handoff当轻量备忘

注意 wayfinder 的 Notes effort 字段会绕过 plan-only 默认

多会话工作流不要混用 wayfinder 和 handoff

handoff 路径得自己复制给下次会话，issue#670反映这是真实痛点

我不承诺wayfinder 一定减少返工、一定省 token；也不承诺handoff 一定保留全部上下文。这两条都没在源码里写过 - 写文章的人最常犯的错就是用一个 tool 名加一个希望，编出一篇评测。

## 一句话总结

wayfinder 解决工作本身横跨多次会话，handoff 解决会话快到边界。选错工具的代价是规划跑得比实现还贵。map 是索引不是仓库：决策只活在 ticket 里，map 只挂链接。

/handoff是 fork（开新会话 + 引用文件），/compact是 continue（同一会话压摘要）。两者不是轻量 / 重量的区别，是方向的区别。

setup-matt-pocock-skills是这套协议的地基，没有 issue tracker + native blocking + labels 的环境，wayfinder 协议会被削弱一半能力。

写到这里，我反而想抛个我答不出来的问题给你：smart zone的具体阈值（100K / 120K / 125K-150K）在不同模型上漂移，源码自己也说this is debated，你打算怎么给你的 Agent 设个快到了就 handoff的实际触发点？这条工程上没人替你决定。

> 说明：本文内容基于 Matt Pocock Skills 仓库、Matt Pocock 的 aihero.dev 字典词条（smart zone）与社区 GitHub Issues（#670/#683/#667）分析整理而成，区分源码事实与作者实践建议。文中对 wayfinder 减少返工、handoff 保留上下文的描述仅为机制层面分析，实际效果请以你的 Agent 工具与模型测试结果为准。如果你有 wayfinder 或 handoff 的实际使用经验，欢迎在评论区分享交流。

说明：本文内容基于 Matt Pocock Skills 仓库、Matt Pocock 的 aihero.dev 字典词条（smart zone）与社区 GitHub Issues（#670/#683/#667）分析整理而成，区分源码事实与作者实践建议。文中对 wayfinder 减少返工、handoff 保留上下文的描述仅为机制层面分析，实际效果请以你的 Agent 工具与模型测试结果为准。如果你有 wayfinder 或 handoff 的实际使用经验，欢迎在评论区分享交流。

好啦，谢谢你观看我的文章，如果喜欢可以点赞转发给需要的朋友，我们下一期再见！敬请期待！
