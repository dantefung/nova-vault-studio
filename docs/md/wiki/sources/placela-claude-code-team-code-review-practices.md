---
title: "placela（@Nokia0421）：Claude Code 团队是怎样做 Code Review 的？——90% 代码由 AI 编写下的六层防线与 Revert 护栏"
date: "2026-11-03"
source: "X/Twitter"
author: "placela (@Nokia0421)"
url: "https://x.com/Nokia0421/status/2114900164595114217"
coverImage: "../images/placela-claude-code-team-code-review-practices/001.jpg"
---

# placela（@Nokia0421）：Claude Code 团队是怎样做 Code Review 的？——90% 代码由 AI 编写下的六层防线与 Revert 护栏

> 深入复盘 Anthropic Claude Code 官方团队在每天 3 万+ 变更量级的 Monorepo 下，如何重构 Code Review 流程：从“是否有人读过代码”转向“错误由自动化还是人工抓更合适”，六层漏斗检查（PR 前多重验证、Fresh Context Subagent 二次审查、内部 Verification Skill、自动回滚机制），合并 PR 翻倍的同时 Revert 比例下降超过 40%。

<!-- more -->

原文链接：https://x.com/addyosmani/status/2114604912520921136?s=20

感谢 Addy 的分享

------------------------------------------------------------------------------

我们之前说过，Claude 大概写了 Claude Code 90% 的代码。那这个规模下 code review 到底怎么做？谁来读代码？代码出问题了怎么办？

这篇文章讲的是我们团队现在的 code review 流程，以及我们是怎么把它改过来的。6 月到 9 月之间，Claude Code 仓库合并的 PR 数量翻了一倍多，而需要 revert 的 PR 比例下降了超过 40%。

#

我们没有停掉 code review。而是把大部分“读代码”的工作自动化了，并且把流程调成优先省人的时间和精力。同时也在大力提升 revert 的速度和便利性。

## 重新思考 code review 的目标

agent 写代码之后，变更量会爆增。我们的 monorepo 从 5 月每天大概合并 2500 个变更，到 9 月已经超过 30000 个。

Claude Code 虽然不在这个 monorepo 里，但压力同样很大。跑得这么快的时候，再想逐行人工 review 基本不现实。

code review 本来有两个目的：

- 发布前把 bug 找出来并修掉

- 让团队对代码库有共同理解

这篇文章主要讲第一个目的，最后会简单提第二个。

我们现在不把“有人读过代码吗”当作核心指标，而是问：“这个变更可能出什么问题？用自动化检查还是人来抓更合适？”

这也改变了 review 的时机。以前是代码写完、PR 提了，再等人来看。现在更像写代码时一直在跑的 spellcheck，是持续进行的。

大部分变更在人看到之前，Claude 至少已经 review 并修过一次。常规 bug 基本被拦在前面，人只需要处理更高层次的问题。

## human time 和注意力

我们希望把人的时间和注意力留给只有人能做的事，其他尽量用自动化覆盖。即使现在这个速度，人还是有很多活要干，团队几乎每天都会碰到新问题。

所以 human time 是双向成本：不只是看 code review 花的时间，也包括因为烂代码引入 bug 之后再去修的时间。只减前者不减后者，其实没省下人的时间。

我们的目标是：Claude Code 相关仓库（CLI、桌面、Web、移动端）里大部分 PR，最多只需要一个人在 loop 里（可以是作者本人）就能合并，同时 revert 率和事故率不上升。

我们跟踪的指标包括：每个 PR 的中位数 human approval 次数（以及 95 分位）、human comment 数量、PR 等人的时间。revert 率和事故率是护栏——这两个指标一涨，就说明没真正省下 human time，只是把时间挪到别处了。

## 一个变更的完整流程

典型变更（不管是工程师本地写的，还是 Slack 里 Claude 会话产生的）都会过多层 review。

大部分流程是自动化的，人的注意力只集中在真正有风险的部分。

一共六层检查，外加最后的 rollback 机制。

每一层都会漏掉一些 bug，但能通过全部六层的很少。万一漏了，还有回滚兜底。

1. PR 前验证

大部分 review 发生在创建 PR 之前。我们会让 Claude 做能实际跑起来的事，比如跑测试、构建、把截图和设计稿对比。不是说“做完了”，而是让它把结果展示出来。然后一个 fresh context 的 subagent 再看一遍 diff。这两点都是我们 best practice 的一部分。

开 PR 之前，很多人还会跑一堆内部 skill：bug hunting、diff reduction、端到端验证，以及对照设计规范检查 UI 变更。

Claude Code 的创建者 Boris Cherny 说过，给 Claude 配上 verification 流程，可能是提升输出质量最关键的一点。他估计 verification 能把质量提升 2-3 倍。

不同领域的 verification 差别很大：

- 有时只是跑一条 bash 命令

- 有时是跑测试套件

- 有时是在浏览器或手机模拟器里实际操作

如果自动化 reviewer 老是标同一个问题，我们就从源头修：改 skill、加 lint 规则，或者更新文档。

相关文件：

- CLAUDE.md：给 Claude 的项目上下文（技术栈、约定、目标、非目标）。每次 review 都会读这个文件，所以大仓库里我们写得很短，其他细节用链接引用。代码违反这里的约定，或者文档过时了，reviewer 会标出来。

- REVIEW.md：code owner 告诉 reviewer 这块代码最重要的是什么。我们会单独验证 reviewer 有没有真的按这个来。好的 REVIEW.md 都很短，重点是：定义什么叫项目失败、限制吹毛求疵、列出忽略路径、要求必须带文件+行号引用、要求顶层摘要（包括问题数量和明确说“没有问题”）。

2. 每个 PR 都跑 AI review

每个 PR 在人看之前都会先过一遍 Claude review。

它会结合整个代码库和 PR 作者写的意图来分析 diff，检查：

- 这个变更真的解决了要解决的问题

- 它能不能融入现有系统

- 会不会把别的地方搞坏

修 bug 的时候，它还会尝试找 root cause。

我们公开的产品 Code Review for Claude Code 现在对所有 Team 和 Enterprise 客户开放，也有更轻量的本地命令 `/code-review`。

从 research preview 到现在，内部 PR 收到实质性 review comment 的比例从 16% 涨到了 54%。超过 1000 行的 PR 大部分能被检出问题，小 PR 大部分直接过。管理员可以配置 Quick / Standard / Deep 三种模式。Deep 适合那种漏一个 bug 成本特别高的场景。

发现会先经过多层 agent 过滤：

- 多个 agent 并行找 bug

- 单独投票决定是真问题还是 false positive，票数不够的直接丢掉

- 纯 style / diagnostics / cleanup 相关的会被过滤掉（我们先在自己的 PR 上 A/B 测试过）

剩下的会以 inline comment 形式出现，按严重程度排序，并标记为：

- Important

- Nit

- Pre-existing（避免因为 PR 没引入的老 bug 惩罚作者）

所有发现都必须处理：要么修，要么用理由把 thread resolve 掉。很多时候 agent 会在晚上自己修，作者第二天回来已经是又过了一轮 review 的状态。

3. 可以 block 的 security review

还有自动化 security review。只要 code review 或 security review 还有 open finding，PR 就不能 merge。作者可以修，也可以用简短理由关掉 thread（处理 false positive）。

后续 commit 把问题解决了，finding 会自动关闭。开源的 security review GitHub Action 或 `/security-review` 命令也能做类似的事。

4. 会 block 的自动化检查

标准的 lint、type check、多平台测试、build。一个典型的 CLI PR 在人看之前可能已经跑了几十个检查。PR 模板里有“怎么测的”和“怎么 revert”的问题，Claude 可以帮你填，但作者必须自己确认。

5. 按风险分级的 human approval

有些变更风险高（比如 auto-updater），有些低（比如改文档），review 力度不一样。

风险等级是根据变更内容判断的，不是看作者是谁。一个 classifier 判断风险等级，另一个 classifier 判断即使等级不高，是否仍需要额外 approval。有些路径永远需要额外 approval：owner 标成 sensitive 的，以及任何 CI workflow 文件。

只有仓库 trusted list 上的作者才能享受放宽的 review 要求，基本就是这个仓库的 owner 团队。其他人一律需要第二个人 approve。agent 的 approval 不算 human approval。自动化 review 可以让低风险变更直接过，但该需要人的时候，它不能替代人。

变更的作者最终负责。所以如果是 agent 提的 PR，操作这个 agent 的人会被算作必须的 reviewer 之一。一个 approval 只对当前 commit 有效。一旦有新的不可信 commit（agent 又推了东西，或者有人手动 resolve conflict），就得重新 approve。

6. merge queue、feature flag 和分阶段 rollout

merge queue 保证所有检查是在已经应用了这个变更的 main 上跑的，避免两个单独都能过的 PR 合在一起把 main 搞坏。

新功能通常先放在 feature flag 后面，Anthropic 内部先用。因为我们自己重度使用产品，经常能比外部用户更早发现回归。

公开 rollout 时，先上 latest channel，stable channel 滞后。

7. 快速反馈和 rollback

总会有坏变更漏过去。这是最后一道防线，重点是尽快发现。feature flag 后面的功能可以直接关掉，不用重新部署。

Claude Code 有每周 on-call 轮值。任何 incident review 都会回头看是哪一层该抓到却没抓到。作者和 on-call 仍然要盯着坏 merge，同时也看 revert 和 incident 的 dashboard。我们还没有根据这些指标自动调整 approval 要求的 circuit breaker，但随着人参与越来越少，这是我们在看的方向。

有人说过，放慢速度、减少产出其实能提高准确性，但主要是因为总工作量少了。我们真正想优化的是“快速发现并修正问题”的能力。

## 怎么让 reviewer 变得更好

这是个持续迭代的过程。

我们用 incident 当评估指标。团队把导致事故的 PR、它们的 fix-forward 和 revert 收集起来，让熟悉代码库的工程师确认 bug 位置和正确性。review 系统每天都会拿这套数据跑一遍。

每次新 incident 都会加进这个集合，review 系统的任何改动都要在整个集合上重新评估。

为了控制噪声，我们看人是怎么处理 review comment 的。如果允许报一堆非 bug，发现率很容易做上去，所以必须约束。每个 comment 我们会分类成：人修了、拒绝了、澄清是有意为之，还是觉得无关紧要。同时也会在已知干净的 PR 上跑，看系统会不会报出有害变更。

优先级是：先抓真 bug，其次减少 review 轮次。

作者是 agent 的时候，处理 comment 的成本更高。人随手 dismiss 一个 nit 只要一秒，agent 处理就会多一个 commit、再多一轮 review。

review 过程必须收敛。agent 作者和 agent reviewer 可能无限循环。我们见过 CLI 项目里一个 PR 在一晚上循环了 50 多次，最后是人手动停掉的，不然会一直转下去。

我们对 review 系统反复标的内容跑 git blame，大概 59% 是第一次就存在的代码。也就是说它很少发现新 bug，而是每轮都在老问题上多挖一点。

我们之前习惯默认跑多轮 review（因为每轮可能发现不同 bug），这反而让情况变糟。高风险变更多轮有用，但不是每个 PR 都需要。我们开始额外跟踪“多少轮才过”，并改了 re-review 策略：

- 限制总轮次。三轮之后让作者重新评估整体方案。

- 初始几轮之后只看新 diff。

- 指定 bug 类别，让作者一次性修完，而不是修一行再来一轮。

- 不再重复报告已经见过的问题。review agent 也会在夜间对当前代码库跑，提前挖历史 bug。

## human in the loop

让资深工程师停下手头工作去 review 一个常见错误，成本很高，自动化更划算。但有些事情仍然必须人来做：

- 这个功能到底该不该做？定愿景、定品味、定目标。

- 有团队说自己解决了 code review 瓶颈，但对团队外部的变更仍然要人 review，确保方向对。

- 审计危险代码（billing、auto-updater、CI workflow）。

- 架构 review（因为这些决定会变成其他人 follow 的 convention）。

- 验证证据（测试输出、跑过的命令、截图、reviewer comment）。如果你说不清检查会漏掉什么，就别只要求一个 👍，那需要真正的 review。

- 承担责任。不管代码是谁写的，最终都要有人负责。

## 团队上下文

code review 一直有传递代码库变化的作用。看同事的 diff 是大家理解代码库怎么工作的常见方式。如果大部分阅读交给机器，那人怎么学代码库？

我们没有正式机制。没有人脑子里装着 Claude Code 的完整 mental model，我们也不觉得需要。想了解某一块的时候，直接让 Claude 针对那一块生成 explainer，几分钟就能出，而且永远是最新的。

有些人还会让 Claude 再生成一个小的可视化 artifact，用自己喜欢的方式讲这块代码。

这比逐行读琐碎 diff 有用得多（一行文案改动基本学不到东西）。先让 Claude 给你要改的模块做个 explainer，学到的东西多很多。

另外我们默认开放，工作都在公开 Slack channel 里，别人在做什么大家都能看到。

“你落地它，你拥有它”

小改动或中等改动 merge 之后出问题，一般期望是你自己去修。不会失控的原因有几个：

- 小变更本身就好 review、好 debug、好 revert。

- 几乎都能 revert。feature flag、revert、分阶段 rollout 可以把大部分错误在几分钟内撤掉。

- 爆炸半径决定审查力度。越贵的代码，眼睛和验证越多。

- 回归会通过 telemetry 和内部使用很快暴露。

- 不是甩锅。修的人拥有它，是因为他最有上下文。incident review 看的是系统。

团队很多人在公开 channel 里协作，任何人都能看到别人在做什么、加入讨论，或者让 Claude 帮忙找缺口。反馈也不只来自 code owner。这种开放性是质量能保持、又不用每行都设卡的重要原因。

## 改变方向

有了 agent，开新活很便宜，但有时候不该开。常见情况是 channel 里有人指出这条路不对（引用之前的决定，或提出更好方案），作者直接关 PR 或者改实现。

因为代码本身写起来不难，关 PR 不会觉得亏。关键是早点在 thread 里转向，而不是等 PR 定稿了再来一个 blocking comment。

## 怎么落地

大部分组件现在已经能用。

PR 之前：

- 给 agent 一份它可以自己跑的检查清单，写在简短的 CLAUDE.md 里

- 用 hooks 让 agent 调用 formatter 和 linter

- 本地跑 `/code-review` 和 `/security-review`，或者用 fresh context 的 subagent 再看一遍

- 建 REVIEW.md，用它跟踪反复出现的问题

每个 PR：

- 强制 CI

- PR 模板加上 Testing、Risk、How to revert

- 先在一个仓库上接 AI reviewer（Code Review for Claude Code 或 Claude Code GitHub Action），迭代几周 REVIEW.md 再推广

- 加自动化 security review

- 要求所有 review thread resolve 之后才能 merge

- 按风险决定审查力度：常规变更快速过，高风险区域（bug 成本高的地方）彻底看。Code Review 有 Quick / Standard / Deep

- 限制 review 轮次，几轮之后只看新 diff

Approval：

- 风险等级按变更内容定，不按作者定。先严后松，看到数据再放宽

- 宽松路径只给 trusted author

- bot approval 不能算 required approval。有新 commit 就驳回之前的 approval

- auth、billing、CI、release workflow、installer 相关的代码和政策必须由人 approve。用 CODEOWNERS + branch protection 兜住

Merge 和 post-merge：

- 上 merge queue

- 试 feature flag

- 先给内部用户

- 分阶段 rollout

- 做一步 revert

- 用 incident 和 revert 记录建 eval set

- 改 prompt、工具或模型之后重新打分

- 跟踪 human effort，用 revert 率和事故率当护栏

## 接下来会怎么走

Code Review 产品发布时的定位是：最终 approve 还是人来做，产品只负责把发现贴出来。但在我们自己的仓库里已经走得更远：owner 可以决定哪些低风险变更在自动化检查通过后直接自动 merge。这个边界还会继续动。

每次 reviewer 漏东西，我们都会问：模型上下文里缺了什么？然后把它变成 CLAUDE.md、skill 或新检查。目标没变：在 revert 率不高于现在的前提下，减少每个变更消耗的 human effort。

如果你也让 agent 提 PR，欢迎告诉我们你自动化了哪些检查、哪些必须人来、以及我们哪里做错了。

（这是原文的重写版本，并用 Pangram 检查过。）

## 相关页面

- [[sources/fanbing-dsh-superagent-engineering-common-sense]]
- [[sources/aliez-ren-claude-code-fable-opus-coding-playbook]]
- [[concepts/engineering-skills]]
- [[concepts/agent-skill]]
