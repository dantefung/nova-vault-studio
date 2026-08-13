---
title: "AI 编码会话的 5 次边界抉择：为什么 /compact 垫底"
date: "2026-08-13"
source: "微信公众号"
author: "术哥 / 运维有术"
url: "https://mp.weixin.qq.com/s/jBhfTVxCGvtDqyhhtg6Ttg"
---

# AI 编码会话的 5 次边界抉择：为什么 /compact 垫底

> 用 Claude Code 这类工具干复杂活的人，大概都卡过同一个地方：一个阶段干完了，Agent 停下问你下一步，你盯着那几个选项拿不定主意。继续？/clear？/handoff？/compact？每个选项看起来都合理，选起来全靠猜。本文基于 Matt Pocock 开源仓库 mattpocock/skills 的 PHASE-BOUNDARIES.md（一棵五问决策树），做源码级解读。

> 说明：本文内容基于 Matt Pocock 开源仓库 mattpocock/skills 的源码（ask-matt 的 PHASE-BOUNDARIES.md）和官方文档分析整理而成，属于源码级解读。文中 smart zone 约 15 万 tokens 为官方给出的有争议量级，不是精确保证。

## 背景：上下文和会话管理才是通用痛点

调研社区反馈时发现，这几乎是 agentic coding 的通用痛点。Reddit 上有个用户提到：换更好的 system prompt、改 plan-mode 习惯、收紧指令，全都碰不到他真正反复踩的失败点——那个失败点指向**上下文和会话管理**，而不是提示词技巧。

Matt Pocock 的开源仓库 mattpocock/skills 里有一个专门回答这个问题的文件，挂在 ask-matt skill 下，叫 **PHASE-BOUNDARIES.md**，是一棵五问决策树。这个仓库在 GitHub 上有十多万 star，被不少人当成 agentic coding 的教科书。有意思的是，Medium 上有人专门写了篇文章说：别把这仓库当提示词抄，最短的那个 skill 文件才是关键——很可能指的就是它。

## 1. 先看全景：一次计费接入的 6 次边界

![AI 编码会话决策树封面图](../images/ai-coding-phase-boundaries/001.jpg)

假设你要给一个内容创作工具接入第三方计费服务（订阅、用量计费、发票）。按官方 main flow 的编排，这次会话大概长这样：

grilling（拷问需求）→ to-spec（写规格）→ to-tickets（拆任务）→ implement（实现）→ code-review（评审）→ QA（验收）

阶段之间有 6 处真实出现的 phase boundary，每处停下决策树都会问一个不同的问题：

| 边界 | 决策点 | 结论 | 理由 |
|------|--------|------|------|
| 1 | grilling 结束，直接写 spec？ | Continue | 写 spec 要引用 grill 的原始回答，推理过程原文还在上下文里，是 spec 的一手来源；smart zone 还远 |
| 2 | spec 结束，直接拆 tickets？ | Continue | grill→spec→tickets 要保持不中断的上下文窗口，到 to-tickets 之后才允许 compact 或 clear |
| 3 | tickets 拆完，直接 implement ticket 1？ | **/clear** | 需求已全部落盘成 spec 和 tickets 文件，实现只认 ticket，窗口里的对话噪音可全丢 |
| 4 | ticket 1 实现完，直接做 ticket 2？ | /clear | 每个 /implement 从 ticket fresh 开始，ticket 之间清上下文；代码在文件系统里，Agent 自己会读 |
| 5 | 全部实现完，要不要 code-review？ | subagent | code-review 官方用 parallel sub-agents，Standards 和 Spec 双轴并行评审，互不污染上下文，可 AFK |
| 6 | 评审完，直接进 QA？ | /compact | 评审结论散布在整个 diff 会话里，QA 需要留在同一循环里，四问都不成立 |

**6 处边界用了 4 个选项：Continue、/clear、subagent、/compact。** 还差一个 /handoff 没出场——它很窄。

## 2. 五问决策树：五个选项的成立条件

![五问决策树](../images/ai-coding-phase-boundaries/002.jpg)

PHASE-BOUNDARIES.md 的核心不是五个选项的定义，而是**成立条件和问的顺序**。自上而下，先碰到的 yes 赢：

| 选项 | 成立条件 | 对上下文做了什么 |
|------|---------|-----------------|
| Continue | 下一阶段需要本阶段一手来源（grilling→implementation 要推理原文）；或 smart zone 还剩 ~15 万 tokens 量级 | 不碰，一手保留 |
| /clear | 上下文与下一步完全无关（典型：ticket 之间） | 全丢，从零开始 |
| /handoff | 换 harness / 换目录 / 交给同事 / mid-phase 叉支线，四选一 | 压成可移植文件，二手 |
| subagent | 任务紧到能 AFK、不阻塞主会话（典型：自动评审） | 外包，主会话不动，回二手报告 |
| /compact | 其余四问都不成立，决策树落在这里 | 压成摘要，二手 |

逐条拆开看成立条件，每条都窄得让人意外：

- **Continue**：不是图省事才选，有两个硬条件——要么下一阶段需要本阶段当一手来源（如 grilling→implementation 要的是推理过程原文，不是摘要），要么 smart zone 预算还够。smart zone 官方给的是 ~125K-150K tokens 量级，原文明说了 "this is debated"，有争议，别当精确阈值。
- **/clear**：条件是上下文与接下来完全无关。它是棋盘上代价最小的一步：不花时间、把整个窗口还回来，旧会话还能恢复。但选错的代价是单向的——清掉相关上下文，why 就丢了，翻不回来。
- **/handoff**：很窄，只在四种情况需要：换新 harness（Claude→Codex）、移到新目录或仓库、把工作交给同事、mid-phase 叉出支线而不打乱主线。它买到的是可移植性——一个能旅行的 markdown 文件。没有东西在旅行，就不需要它。
- **subagent**：条件是任务紧到可以离开键盘。范围要小、要自包含、不需要中途操控。自动评审是标准案例。
- **/compact**：兜底。相关上下文、同一 harness、同一目录、需要留在循环里——四问都不成立，就落在这里。而且它经常落在这里。

## 3. 边界 3 的完整推理：tickets 拆完该不该直接 implement

把边界 3 的决策过程完整走一遍，看这棵树怎么用。

**问题 1：能否在当前会话继续？** 两个条件都不成立——下一阶段需要本阶段一手来源？不需要，spec 和 tickets 已落盘，实现读文件就行；smart zone 预算还够？不，一个窗口撑了三个阶段，预算早见底。问题 1 是 no。

**问题 2：上下文与接下来完全无关？** 要丢的东西——grilling 时的来回拷问、spec 阶段被否决的方案、拆 tickets 的取舍理由。ticket 本身是自包含的，实现只认 ticket 里的验收标准。是，**/clear**。

关键：/clear 之前，信息必须已经迁移到别处。tickets 文件就是那个"别处"——/clear 丢的是窗口，不是重要信息。这就是为什么官方强调到 to-tickets 之后才 clear。

## 4. 一手 vs 二手：每次边界都是一次损耗交换

![一手 vs 二手损耗模型](../images/ai-coding-phase-boundaries/003.jpg)

核心模型一句话：**上下文是一次性资产**。除 Continue 外，每个边界动作都是把一手资料（primary source）压成二手资料（secondary source）的损耗交换。

| Source | 信息 | 噪音 | 活动空间 |
|--------|------|------|---------|
| 一手（Continue） | 全 | 多 | 小 |
| 二手（/compact、/handoff） | 有损 | 少 | 大 |

Continue 保留一手：信息全、噪音多、只能当前窗口活动。/compact 和 /handoff 产出二手：干净、有损、摘要可随身带走，但细节被压扁。

**subagent 特殊：它把损耗转移而不是支付。** 主会话窗口不动，token 密集的活在它自己的窗口里完成，还给你一份二手报告。所以 code-review 用 parallel sub-agents 不是炫技——它让主会话既不用 /compact 也不用 /clear，就能保持干净。

### 反直觉推论：退化来自长度本身

这个模型有个反直觉推论，来自 Context Rot 那篇论文：**退化是输入长度本身造成的，不是内容脏才造成的。** 实验把非目标 token 全换成空格，退化照样发生。也就是说，没法靠把上下文收拾干净来省钱——长度本身就在花钱。smart zone 就是这笔预算的度量。

Matt Pocock 自己写过文章吐槽 Anthropic 的 Ralph 插件：bash 循环每次迭代都是全新 context window，Ralph 插件却把迭代累积在一个会话里，三到四次迭代后 agent 就完全在 dumb zone 里工作。他的经验法则：大约 40% context 处开始退化，前 40% 是 smart zone，后 60% 是 dumb zone——边界有争议，但人人都同意边界存在。

所以他给会话定了预算纪律：**一次会话一个任务**，每个任务给会话最锐利的部分。单个任务超过一个 smart zone，就拆开，在自然边界 handoff 或 compact。

决策树的逻辑：只在留下比损失更贵的时候，才付有损的代价。Continue 不付损耗，所以被优先排除；/compact 付损耗，所以垫底。

## 5. 为什么顺序就是逻辑

- **问题 1 先问**：Continue 代价最小、什么也不丢，rule it out first。如果继续没问题，后面四问根本不用问。
- **/clear 排问题 2**：它的代价是单向的。清掉相关上下文，丢的是 why——为什么选按席位计费而不是按用量。这些推理只存在于对话里，不在代码里，读多少 diff 都找不回来。
- **/compact 垫底**：它是 default，排在问题 5。从它按的失败模式是：新会话对一份被摘要压扁的决策自信地错——摘要看起来很完整，新会话不知道哪些细节被压掉了，基于残缺的决策做出自信的判断，很难发现，因为每一步看起来都对。

顺序本身就是在帮你省钱：先试零成本的，再试可逆的，有损的垫底。

**/clear 与 /handoff 的差别**：/handoff 也产出二手，但把摘要写进了文件，主会话随时能恢复，代价可逆；/clear 什么都不留，代价单向。所以决策树把 /clear 放问题 2、/handoff 放问题 3——先问能不能直接丢，丢不了才问要不要写下来带走。

## 6. 这是判断题，不是客观题

这棵树不给标准答案。源码里写得很清楚，每个问题都含**品味判断**——同一处边界，两天可能走两条路，两条都合理。

价值不在于选对，而在于**在边界问、按顺序问**。两件事分开说：

- **在边界问**：mid-phase 没有决策可做，只有两条出路——继续，或者把剩余工作拆给 subagent。mid-phase 里 /compact 会让 Agent 丢主线：它正在实现 ticket 3 的中段，你压一下，它忘了自己刚改到哪、为什么这么改，只能从摘要里猜。
- **按顺序问**：五个问题不是并列的五选一，是串行过滤。从 Continue 开始，每问一个就排除一类情况，剩下的才是 /compact。跳过问题 1 直接按 /compact，等于默认继续一定不行——多数时候这个默认是错的。

## 7. 四个选错的反例

![四个反例示意图](../images/ai-coding-phase-boundaries/004.jpg)

- **反例 1：上下文还很热就 /clear。** grilling 刚聊完需求就 /clear 写 spec。结果写 spec 时 Agent 问"免费层到底要不要"，你发现自己也记不清当时怎么定的了——需求的 why 已经丢了。
- **反例 2：stage 中间 /compact。** 实现 ticket 3 到一半随手 /compact，Agent 回来接着写，写出来的东西和之前方向对不上——它丢了 thread，只能从摘要推断。mid-phase 的正确出路只有继续或拆 subagent。
- **反例 3：本可 Continue 却 /handoff。** spec 刚写完、上下文还很健康，却写 handoff 交给新会话。代价是推理过程原文被压成摘要，新会话的 spec 质量取决于 handoff 文件写得有多好——而你本来可以直接继续。
- **反例 4：万事皆 compact。** 每个边界都压一次。会话很干净，但每一压都丢一层细节。压到第三次，新会话面对压了三遍的摘要照样自信地错——它不知道每次压缩各自丢了什么。这种失败模式很隐蔽，全程没有任何报错。

## 8. 总结

回到开头那个问题：阶段交界处，到底选哪个？

五问决策树的答案一句话：**按顺序问。**

> 能继续就继续；上下文无关就 /clear；有东西要旅行就 /handoff；能 AFK 就拆 subagent；实在不行才 /compact。

每个动作都是一次一手到二手的损耗交换，你只在留下比损失更贵的时候付这笔损耗。

需要注意：这套树以 Claude Code / Codex 为默认环境，/compact、/clear、subagent 机制不是所有 Agent 平台都有等价物——换平台前先确认你的 harness 支持哪些原语。

> 这棵树的真正价值不在五个选项，在于它把"什么时候处理上下文"从感觉变成了流程。阶段中间你不需要想，边界处你必须想。就凭这一点，它就比大多数上下文管理技巧值得抄。