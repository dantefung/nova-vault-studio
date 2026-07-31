---
title: "周一 30 issue + 3 bug + 1 新模块：先做哪个？Matt Pocock 用 3 条 on-ramp 帮你分流"
date: "2026-07-31"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/Obn3th61vpLSsi7eZs-DKg"
---

# 周一 30 issue + 3 bug + 1 新模块：先做哪个？Matt Pocock 用 3 条 on-ramp 帮你分流

🚩 2026 年「术哥无界」系列实战文档 X 篇原创计划 第182篇，AI 编程最佳实战「2026」系列第64篇大家好，欢迎来到术哥无界 | ShugeX ｜ 运维有术。我是术哥，一名专注于 AI 编程、AI 智能体、Agent Skills、MCP、云原生、AIOps、Milvus 向量数据库的技术实践者与开源布道者！Talk is cheap, let's explore。无界探索，有术而行。![image](../images/Obn3th61vpLSsi7eZs-DKg/001.png)Matt Pocock 三类 on-ramp 入口决策信息图封面周一早上九点。你打开仓库，看到通知栏里有三个完全不同的东西在等你：GitHub 仓库里积累了 30 个未处理的 issue，从 typo 文档、模糊的 feature request、到一条上周三在生产环境炸过的 bug report，全堆在needs-triage标签下。CI 上挂着三个回归 test 在变红- 这几个 test 昨天还是绿的，没人改过相关代码，但今天就是红了。你脑子里还有一个想做半个月的新模块，设计稿草草画过，没人 review，目的地模糊，但不做又放不下。三类输入，三个完全不同的来源，三种完全不同的处理节奏。如果你把它们一股脑丢给同一个 Agent 会话，结果大概率是先做最吵的那条 issue（因为通知最多），三个回归 bug 被推到明天，新模块被硬塞进当前会话做到一半就 context 跑满。Matt Pocock 的skills仓库把这个问题前置到ask-mattskill 的一开头处理 - 三类输入各有自己的入口 on-ramp，汇入主链路之前先做分流。这篇文章不讲 on-ramp 概览，专门讲判断准则：什么工作该走哪条路，以及按错顺序走会出什么问题。说明：本文内容基于 Matt Pocockskills仓库源码和ask-matt/SKILL.md等文档分析整理而成，文章中的判断准则和"周一早晨 30 issue + 3 bug + 1 新模块"等场景数字是写作构造的示例，不构成对真实项目使用效果的承诺。文中的判断准则和分类思路仅供参考，实际使用时请以你的 issue tracker 配置、团队工作流和具体场景测试结果为准。如果你有实战经验，欢迎在评论区分享。1. 三类 on-ramp 不是工具，是输入分类器ask-matt/SKILL.md里的 on-ramp 段落不长，但定位非常清晰：A starting situation that generates work, then merges onto the main flow.Bugs and requests piling up→/triage...Something's broken→/diagnosing-bugs...A huge, foggy effort - a greenfield project or a huge feature build, too big for one session→/wayfinder...注意判断的依据是输入的来源和形态，不是优先级，也不是紧迫度，更不是我想先做哪个。三个 on-ramp 各自接收的输入，差异不是工作量大小，而是来源：输入来源形态起点不是我节奏别人提的 bug report、外部 feature request、堆积的 issueraw、未分类是大量并行、互相独立突然变红的行为、间歇性 flake、藏在上一个 known-good 状态里的回归真实症状，定位未知不一定单点深挖我想做的全新模块、巨型特性、超出单会话范围想法模糊，目的地未确定不是串行、每会话一票第三列起点不是我听起来不起眼，但它解释了为什么/to-tickets产出的工单不能再走 triage - 后面会展开。"Triage is only for issues you didn't create - bug reports, incoming feature requests, anything that arrives raw. Tickets that/to-ticketsproduced are already agent-ready, so don't triage them." -skills/engineering/ask-matt/SKILL.md2. 周一早晨的连续场景让我们把开头那段真实场景按 on-ramp 拆开看。2.1 那 30 个 issue：走/triage这一类是外部输入。Reporter 大多是陌生人或者同事，描述里夹着术语、上下文、情绪、甚至截图。它们的共同特征是 raw。triage 不是给你修 bug 的，是给 issue打标签 + 写 brief的。它的产物是一份agent-ready brief，下一个 agent 接过去不用再回头问问题。triage 的输出会进入/implement，由/implement真正去写代码。按triage/SKILL.md第 26-45 行的定义，每个 issue 必须恰好带一个category role（bug或enhancement）和一个state role（五个之一）。2.2 那 3 个回归 bug：走/diagnosing-bugs这一类是症状已知、原因未知。CI 上红的就是这三个 test，你昨天没动它们，前天没动，但它们就是红了。diagnosing-bugs跟普通 debug 不一样。它一开始不让你读代码、不让你提假设、不让你二分。它强制你先造一个能在本地复现这个 bug 的命令- 一个运行起来就红的命令，且只对这个 bug 红。红线写在 SKILL.md 第 60 行：If you catch yourself reading code to build a theory before this command exists, stop - jumping straight to a hypothesis is the exact failure this skill prevents.No red-capable command, no Phase 2.它的产物是fix + regression test。如果修完之后发现根因是架构问题（没有好 seam），它会把发现 hand off 给/improve-codebase-architecture- 这是它独有的分支出口。2.3 那个新模块：走/wayfinder这一类是目的地不清晰。你脑子里有一个方向，但连 spec 都没定型，更别说 ticket。wayfinder/SKILL.md第 7 行把这个 skill 的本质讲得很直白：Wayfinding is about finding that way, not charging at the destination. This skill charts the way as ashared mapon the repo's issue tracker, then works itsdecision tickets- questions whose resolution is a decision, not slices of a build to execute - one at a time until the route is clear.wayfinder不做实现，只做决策。它的产物是一张 issue tracker 上的 map，每张 ticket 是个需要回答的问题。当 map 上的 fog 散尽、路线清楚时，它把 map 交给/to-spec，由 to-spec 把那些决策坍缩成可执行的 spec，再走/to-tickets→/implement主链路。2.4 三个出口在 main flow 的位置on-ramp出口汇入点产物形式/triageagent-ready issue/implementbrief + state label/diagnosing-bugsfix + regression test修复完即结束；如发现缺 seam →/improve-codebase-architecturediff + test/wayfinder决策地图（map of decision tickets）/to-spec→/to-tickets→/implementissue tracker 上的 map注意：只有 triage 是直接汇入/implement的，wayfinder 必须先经过to-spec才能进 main flow，diagnosing-bugs 严格来说不走 main flow（它本身已经把 bug 修完了）。![image](../images/Obn3th61vpLSsi7eZs-DKg/002.png)三类 on-ramp 与 main flow 衔接架构图3. on-ramp 选择判断决策表这是文章最核心的一张表。按这张表判断，比凭感觉决定今天先干啥靠谱得多。输入形态起点工作体量症状清晰度走哪个 on-ramp直接出口别人的 issue/PR、raw bug report、外部 feature request我没创建1 条 1 条独立描述可能模糊也可能清楚，但作者不是我/triage/implement（带 agent-ready brief）我自己 to-tickets 拆出来的工单我创建的，brief 已写好已切片已清晰不要再走 triage/implementCI 红 / 测试不通过 / 行为突然异常我自己代码单点症状清楚，根因未知/diagnosing-bugs修复（必要时 hand off seam 问题）简单 typo、显而易见的不一致、第一次排查就明白原因的 bug我自己代码微小症状=根因不走 diagnosing-bugs，直接/implement/implement我想做的全新模块 / 巨型 feature / 超出单会话我创建半月以上目的地未确定/wayfinder/to-spec已经有清晰 spec 的小特性我创建几天内已清晰不走 wayfinder/to-spec→/to-tickets→/implement这张表里两个最容易被忽略的判断：raw 不 raw是 triage 的入口过滤器。/to-tickets出来的工单不是 raw，不能再走 triage。难不难定位是 diagnosing-bugs 的入口过滤器。第一次读代码就明白的 bug 不需要 6 phase 全跑。![image](../images/Obn3th61vpLSsi7eZs-DKg/003.png)on-ramp 选择判断决策结构图4. 三类判断准则的细节4.1 按 issue 数量和来源判断要不要 triage数字本身不重要，但量级有意义。如果你的 issue 列表里出现以下任一信号，就该停下来分批 triage，而不是直接挑着做：跨来源：有陌生 reporter 提的 issue + 有同事口头说的 feature + 有 bot 报的 crash，全混在一起。跨状态：有的写得很完整（复现步骤、期望行为、实际行为齐全），有的只有一句话它不工作了。未分类：labels 是空的或只有needs-triage，没有人做过 category/state 判断。triage/SKILL.md第 26-45 行定义的2 个 category + 5 个 state就是用来处理这种混乱的。2 个 category（bug/enhancement）回答是什么；5 个 state（needs-triage/needs-info/ready-for-agent/ready-for-human/wontfix）回答现在该谁处理。五类状态机解决的实际管理问题：triage 之前你面对的是一堆 raw 文本，五类 state 之后，每个 issue 都落在一条已知的处理路径上。要么等更多信息（needs-info）、要么已可以交给 agent（ready-for-agent）、要么必须人介入（ready-for-human）、要么不需要做了（wontfix）。这条流水线把30 个 issue 不知道从哪开始换成30 个 issue 各自在哪一步。标签流转示例（一条典型 issue 的轨迹）第 12 号 issue 是陌生 reporter 报的：进入仓库：labels 为空，state 为隐式needs-triage。triage agent 读完 body 和 comments：信息不全，需要复现步骤。 → 加needs-info标签，回复模板化的 Triage Notes（注：源码triage/SKILL.md第 94-106 行的官方模板是 "What we've established so far / What we still need from you (@reporter)" 两段式，下面是基于此改写的中文示意，不是官方模板）：> *This was generated by AI during triage.*> Triage Notes> - Category: bug（疑似，但待复现确认）> - Reported version: 未提供> - Reproduction: 需要 reporter 提供以下信息 -> 1. 触发该 bug 的具体步骤> 2. 期望行为与实际行为> 3. 错误日志或截图> ```3.reporter 回复后，重新 triage：能复现，category 确认为`bug`，state 改为`ready-for-agent`。→ 写一份 agent-ready brief，结构对应`triage/AGENT-BRIEF.md`模板：```markdown## Agent Brief**Category:** bug**Summary:** 用户报告 X 操作在 Y 条件下崩溃**Current behavior:** ...（系统的实际行为）**Desired behavior:** ...（应该的行为）**Key interfaces:** ...（涉及的接口/类型/函数）**Acceptance criteria:** ...（每条都可独立验证）**Out of scope:** ...（显式说明不做什么）这条 issue 现在被/implement拾起。triage 不再介入。为什么/to-tickets产出的工单不能再被 triage这是这一节最容易踩的坑。/to-tickets自身的输出（SKILL.md 第 27-40 行）已经是vertical slice + agent-ready的工单。每条工单穿 schema/API/UI/tests 全栈、可独立 demo、大小适配一个新 context window。它出来的工单结构上等价于 triage 出来的 brief。让 triage 二次处理它们会发生什么？会产生重复标签、状态错位、brief 被覆盖三类事故。更糟的是 - 它会让 triage 失去raw 入口的语义。把我没创建的东西和我已经结构化好的东西混在一起处理，整个 on-ramp 的入口过滤就失效了。triage/SKILL.md第 88-90 行还留了一个quick state override的口子：maintainer 说move#42to ready-for-agent可以直接执行，跳过 grilling。这条口子是为了避免 triage 变成橡皮图章- 如果一个 issue 信息已经够了，再走一遍完整 grilling 是浪费。4.2 按 bug 严重度判断要不要 diagnosing-bugs不是所有 bug 都需要 diagnosing-bugs。这条边界值很值得花一段讲清楚。diagnosing-bugs/SKILL.md第 12-14 行把 Phase 1 写成了 skill 的灵魂：This is the skill.Everything else is mechanical. If you have a tight pass/fail signal for the bug - one that goes red onthisbug - you will find the cause ... If you don't have one, no amount of staring at code will save you.判断准则：症状是不是一眼看不懂。第一次看代码就发现是空指针 → 不走 diagnosing-bugs。报错信息直接指向某行代码 → 不走 diagnosing-bugs。间歇性 flake，跑了 10 次只红 1 次 → 走 diagnosing-bugs。上一个 known-good commit 之后某 test 突然变红，找不到改动 → 走 diagnosing-bugs。报告里写我点了 X 然后 Y 挂了但你本地复现不出来 → 走 diagnosing-bugs。判断的核心是有没有 tight feedback loop。一个 tight feedback loop 必须满足 4 条（SKILL.md第 53-58 行）：Red-capable- 跑的是 bug 的实际代码路径，断言用户的精确症状Deterministic- 同输入同结果（flaky 就用 pinned reproduction rate 钉死）Fast- 秒级，不是分钟级Agent-runnable- 可以无人值守跑（最后手段是 HITL bash 模板）red-capable command 模板示例（演示用，非官方）假设一条 bug 报告是在 macOS 14 上执行git mv重命名带空格的文件后，提交时索引报错。下面是 Phase 1 产物的最小模板（注：源码diagnosing-bugs/scripts/目录下只有hitl-loop.template.sh（HITL 专用，41 行）一个脚本，下面是基于[DEBUG-a4f2]标签模式和 red-capable 4 条验收标准自构的演示，不要当作官方模板）：#!/usr/bin/env bash# [DEBUG-a4f2] tight feedback loop for issue#142# Red-capable: 在受控环境下复现 "rename + space + commit" 失败路径# Deterministic: 使用固定输入文件名 + 固定 git 版本# Fast: 端到端 < 5s# Agent-runnable: 无需人工交互；失败即 exit 1set-euo pipefail# 1. 准备受控 repoTMP=$(mktemp -d)trap'rm -rf "$TMP"'EXITcd"$TMP"git init -qgit config user.email"loop@local"&& git config user.name"loop"# 2. 创建带空格的源文件echo"seed">"my file.txt"git add"my file.txt"&& git commit -q -m"seed"# 3. 重命名 + 试图提交git mv"my file.txt""renamed file.txt"# 关键断言：这一步在 bug 存在时应该让 `git commit` 失败git commit -q -m"rename"2>/dev/null || {echo"[DEBUG-a4f2] BUG REPRODUCED: git commit after mv of spaced file failed"exit1}# 4. 收尾断言：通过则说明 bug 已修gitlog--oneline | grep -q"rename"|| {echo"[DEBUG-a4f2] UNEXPECTED: commit did not contain rename"exit1}echo"[DEBUG-a4f2] OK: bug not reproduced"exit0四个 tag 全部满足之前不许进入 Phase 2。Phase 3 才提假设，且必须 3-5 个 ranked hypotheses，每个写成 falsifiable 格式：If`<X>`is the cause, then changing`<Y>`will make the bug disappear / changing`<Z>`will make it worse.为什么只提一个假设是反模式？因为单假设锚定在第一个 plausible idea 上，会让你跳过早该考虑的方向。SKILL.md第 84 行原文：Generate3–5 ranked hypothesesbefore testing any one of them. Single-hypothesis generation anchors on the first plausible idea.它如何把修一个 bug 升级为留下一个 regression test + 一个 seamdiagnosing-bugs跑完之后留下来的不只是 fix，还有两样东西：Regression test- 就是上面那个 red-capable command。它现在变绿了，但以后这个 bug 再回来它会重新变红。Seam- 一个正确的接缝点，让测试能锁定 bug 的真实模式。SKILL.md第 110-115 行原文：A correct seam is one where the test exercises thereal bug patternas it occurs at the call site. If the only available seam is too shallow...更关键的一条规则写在同段：If no correct seam exists, that itself is the finding.Note it. The codebase architecture is preventing the bug from being locked down. Flag this for the next phase.也就是说 -修一个 bug 留下一句"缺 seam"的话，diagnosing-bugs 把它 hand off 给/improve-codebase-architecture，让架构层面的改造来解决接缝缺失。这个 hand off 在 Phase 6 的 post-mortem 里完成，而不是修 bug 之前- 因为修完之后你对根因的理解比开始时深。4.3 按工作体量判断要不要 wayfinderwayfinder 是三个 on-ramp 里认知负担最重的。SKILL.md在 ask-matt 章节里直接写"save it for exactly that, never a well-scoped feature"。判断准则只有一条：目的地是否清晰。目的地清晰（一个 spec 草稿、一组已写好的接口、新模块的第一个 PR 范围已经收敛） → 不走 wayfinder。目的地模糊（只知道大致方向，不知道边界在哪，feature 大到要拆若干个 spec） → 走 wayfinder。一眼看不到头（greenfield、巨型 build、超出单会话多次的体量） → 走 wayfinder。SKILL.md第 112 行留了一个明确信号：If this surfaces no fog - the way to the destination is already clear, the whole journey small enough for one session - you don't need a map. Stop and ask the user how they'd like to proceed.也就是说 wayfinder 不是先无脑开图、跑完再判断 - 它开图之后第一步就是检查有没有 fog，没有 fog 就关掉。这是个内置的反例闸门。为什么是决策地图而不是交付物wayfinder 的 map 是 issue tracker 上的索引，不是仓库。第 23 行原文：The map is anindex, not a store. It lists the decisions made and points at the tickets that hold their detail; a decision lives in exactly one place - its ticket - so the map never restates it, only gists it and links.四类 ticket 各司其职：Research（AFK） - 读文档、外部资源；/researchsubagent 跑Prototype（HITL） - 提升讨论保真度；答案是一个 artifact（UI sketch、状态模型）Grilling（HITL） -/grilling+/domain-modeling一问一答；agent 不能替人答- "a grilling agent that answers its own questions has broken this"Task（HITL or AFK） - 必须先有动作才能做决策；唯一会真做事的 type，存在的理由是 unblock 一个 decision注意：一次会话只解一个 ticket，research 类型例外。这是 wayfinder 的节奏，跟 main flow 多 ticket 并行完全不同。5. 三类反例：按错顺序走会出什么问题5.1 反例一：先做最吵的 issue，回归 bug 没人修操作：周一打开仓库，看到一条高赞 issue 标题里带 emoji，写得很激动。直接/implement开始修。三个 CI 红的 test 继续红。问题：那条 issue 本身大概率会走 triage 跑成needs-info，因为描述再激动也没复现步骤。三个回归 bug 错过了症状最明显的时间窗- 它们的 red 信号还新鲜，diagnosing-bugs 跑起来最快。等一周后没人记得它们怎么红的，feedback loop 会变难。triage 队列里 29 条 issue 没动。正确顺序：回归 bug 优先（症状热 + 风险高）→ issue 批 triage → 新模块评估要不要 wayfinder。5.2 反例二：先抢修 bug，错过结构性机会操作：诊断一个 bug 修到一半，发现根因是缺 seam（接缝缺失）。但因为想赶紧让 CI 绿，跳过了/improve-codebase-architecture的 hand off，临时打补丁绕过。问题：bug 是修了，但缺 seam 的根因还在。下次同模式 bug 还会出现，diagnosing-bugs 还得重新跑一遍。多个相关 bug 可能都共享这个 seam 问题 - 这次修了三个 bug，下次还是同样的 patch 套路。正确顺序：bug 修复完成后保留 seam 缺失的发现，hand off 给/improve-codebase-architecture。SKILL.md第 134-136 行原文：Make the recommendationafterthe fix is in, not before - you have more information now than when you started.5.3 反例三：先上 wayfinder 反而比 to-spec 更慢操作：想做的新模块有大概方向，开个 wayfinder 会话，画一个 map，挂 20 个 decision ticket。问题：你的 spec 草稿其实已经能写完，只是没人 review。这种情况 wayfinder 是在做 to-spec 该做的事 - 前者把信息分散到 20 张 ticket里，后者坍缩在一份文档里。前者慢十倍以上，且 map 还得回头交给 to-spec 坍缩一次（兜一圈浪费）。SKILL.md自己在第 112 行埋了反例闸门："If this surfaces no fog ... you don't need a map."正确顺序：先评估目的地是不是已经清晰。如果只是需要访谈 grill →/grill-me或/grill-with-docs；如果需要 spec 化 → 直接/to-spec；只有目的地真的不清晰才上/wayfinder。![image](../images/Obn3th61vpLSsi7eZs-DKg/004.png)三类反例对照图：错序处理 vs on-ramp 顺序处理6. 上游产物如何接入下游节点最后把这三个 on-ramp 的产物和下游节点的关系列清楚。这张表跟第 2 节的出口表呼应，但视角换成上游产物。上游产物来自哪个 on-ramp产物形态下游节点备注ready-for-agentissue + brief/triageissue body + category/state 标签/implementbrief 已经行为化、可验收、不指路径ready-for-humanissue/triage同结构 brief +为什么不能委派一段人适合 maintainer 处理needs-infoissue/triageTriage Notes 模板等 reporter 回复不进 main flowwontfixissue/triage简短原因 +（若是 enhancement）.out-of-scope/留档关 issue已实现的 wontfix 不进 out-of-scopefix + regression test +（可选）缺 seam备注/diagnosing-bugsdiff + test + post-mortem合并 / 部署；如发现缺 seam →/improve-codebase-architecturehand off 时机是 fix 之后决策 map + linked decision tickets/wayfinderissue tracker 上的 map/to-spec不能跳过 to-spec 直接 implement- 会扔掉决策细节spec/to-specmarkdown/to-ticketsto-spec不访谈，只综合已被 grill 过的共识vertical-slice 工单/to-ticketsissue / ticket/implement已 agent-ready，不再 triage实现的 diff/implementPR/code-reviewcommit 时清上下文注意最后一行 -/implement输出走/code-review，这条主链路在另一篇（06 篇 main flow）展开。![image](https://mmbiz.qpic.cn/sz_mmbiz_png/icibtH5FrDwPcE3F3g3HxWm6h1ONM0HWP0eM1IooBkUQHXm9NVEx1armkl6T8YzeVko6DNfdwlvIOGdDC0wjH1QJUSoGDueniba89QsKBqZf5c/640?wx_fmt=png&from=appmsg&watermark=1#imgIndex=4)上游产物与下游节点映射结构图总结把三类输入混在一起处理，Agent 默认会挑最吵的 - 那条高赞 issue、那个 emoji 标题、那个看起来能做的小需求。这不是 Agent 偷懒，是它没有分类器。ask-matt的三类 on-ramp 提供的就是这个分类器：raw 进来的、不是你创建的→/triage，产 agent-ready brief症状清晰根因未知的→/diagnosing-bugs，造 red-capable command 后再继续目的地模糊超出单会话的→/wayfinder，先决策后执行判断准则只有三条，按这个顺序走 - 不是按哪个最吵。按错顺序的代价不是浪费几小时，是错过 CI 红的窗口期、把缺 seam 的根因埋掉、或者把一个清晰特性拆成 20 张 ticket 兜一圈再合回来。文章没承诺 triage 就会减少积压、diagnosing-bugs 就会减少 bug 复发、wayfinder 就会减少返工 - 这些都是结果，不是承诺。它们能保证的是输入被分到合适的入口，至于入口之后怎么样，取决于具体 issue、具体 bug、具体 feature。好啦，谢谢你观看我的文章，如果喜欢可以点赞转发给需要的朋友，我们下一期再见！敬请期待！

> 🚩 2026 年「术哥无界」系列实战文档 X 篇原创计划 第182篇，AI 编程最佳实战「2026」系列第64篇大家好，欢迎来到术哥无界 | ShugeX ｜ 运维有术。我是术哥，一名专注于 AI 编程、AI 智能体、Agent Skills、MCP、云原生、AIOps、Milvus 向量数据库的技术实践者与开源布道者！

🚩 2026 年「术哥无界」系列实战文档 X 篇原创计划 第182篇，AI 编程最佳实战「2026」系列第64篇

大家好，欢迎来到术哥无界 | ShugeX ｜ 运维有术。

我是术哥，一名专注于 AI 编程、AI 智能体、Agent Skills、MCP、云原生、AIOps、Milvus 向量数据库的技术实践者与开源布道者！

> Talk is cheap, let's explore。无界探索，有术而行。

Talk is cheap, let's explore。无界探索，有术而行。

周一早上九点。你打开仓库，看到通知栏里有三个完全不同的东西在等你：

GitHub 仓库里积累了 30 个未处理的 issue，从 typo 文档、模糊的 feature request、到一条上周三在生产环境炸过的 bug report，全堆在needs-triage标签下。

CI 上挂着三个回归 test 在变红- 这几个 test 昨天还是绿的，没人改过相关代码，但今天就是红了。

你脑子里还有一个想做半个月的新模块，设计稿草草画过，没人 review，目的地模糊，但不做又放不下。

三类输入，三个完全不同的来源，三种完全不同的处理节奏。如果你把它们一股脑丢给同一个 Agent 会话，结果大概率是先做最吵的那条 issue（因为通知最多），三个回归 bug 被推到明天，新模块被硬塞进当前会话做到一半就 context 跑满。

Matt Pocock 的skills仓库把这个问题前置到ask-mattskill 的一开头处理 - 三类输入各有自己的入口 on-ramp，汇入主链路之前先做分流。这篇文章不讲 on-ramp 概览，专门讲判断准则：什么工作该走哪条路，以及按错顺序走会出什么问题。

> 说明：本文内容基于 Matt Pocockskills仓库源码和ask-matt/SKILL.md等文档分析整理而成，文章中的判断准则和"周一早晨 30 issue + 3 bug + 1 新模块"等场景数字是写作构造的示例，不构成对真实项目使用效果的承诺。文中的判断准则和分类思路仅供参考，实际使用时请以你的 issue tracker 配置、团队工作流和具体场景测试结果为准。如果你有实战经验，欢迎在评论区分享。

说明：本文内容基于 Matt Pocockskills仓库源码和ask-matt/SKILL.md等文档分析整理而成，文章中的判断准则和"周一早晨 30 issue + 3 bug + 1 新模块"等场景数字是写作构造的示例，不构成对真实项目使用效果的承诺。文中的判断准则和分类思路仅供参考，实际使用时请以你的 issue tracker 配置、团队工作流和具体场景测试结果为准。如果你有实战经验，欢迎在评论区分享。

## 1. 三类 on-ramp 不是工具，是输入分类器

ask-matt/SKILL.md里的 on-ramp 段落不长，但定位非常清晰：

> A starting situation that generates work, then merges onto the main flow.Bugs and requests piling up→/triage...Something's broken→/diagnosing-bugs...A huge, foggy effort - a greenfield project or a huge feature build, too big for one session→/wayfinder...

A starting situation that generates work, then merges onto the main flow.

Bugs and requests piling up→/triage...

Something's broken→/diagnosing-bugs...

A huge, foggy effort - a greenfield project or a huge feature build, too big for one session→/wayfinder...

注意判断的依据是输入的来源和形态，不是优先级，也不是紧迫度，更不是我想先做哪个。三个 on-ramp 各自接收的输入，差异不是工作量大小，而是来源：

输入来源形态起点不是我节奏别人提的 bug report、外部 feature request、堆积的 issueraw、未分类是大量并行、互相独立突然变红的行为、间歇性 flake、藏在上一个 known-good 状态里的回归真实症状，定位未知不一定单点深挖我想做的全新模块、巨型特性、超出单会话范围想法模糊，目的地未确定不是串行、每会话一票

输入来源

形态

起点不是我

节奏

别人提的 bug report、外部 feature request、堆积的 issue

、未分类

是

大量并行、互相独立

突然变红的行为、间歇性 flake、藏在上一个 known-good 状态里的回归

，定位未知

不一定

单点深挖

我想做的全新模块、巨型特性、超出单会话范围

，目的地未确定

不是

串行、每会话一票

第三列起点不是我听起来不起眼，但它解释了为什么/to-tickets产出的工单不能再走 triage - 后面会展开。

> "Triage is only for issues you didn't create - bug reports, incoming feature requests, anything that arrives raw. Tickets that/to-ticketsproduced are already agent-ready, so don't triage them." -skills/engineering/ask-matt/SKILL.md

"Triage is only for issues you didn't create - bug reports, incoming feature requests, anything that arrives raw. Tickets that/to-ticketsproduced are already agent-ready, so don't triage them." -skills/engineering/ask-matt/SKILL.md

## 2. 周一早晨的连续场景

让我们把开头那段真实场景按 on-ramp 拆开看。

### 2.1 那 30 个 issue：走/triage

这一类是外部输入。Reporter 大多是陌生人或者同事，描述里夹着术语、上下文、情绪、甚至截图。它们的共同特征是 raw。

triage 不是给你修 bug 的，是给 issue打标签 + 写 brief的。它的产物是一份agent-ready brief，下一个 agent 接过去不用再回头问问题。triage 的输出会进入/implement，由/implement真正去写代码。

按triage/SKILL.md第 26-45 行的定义，每个 issue 必须恰好带一个category role（bug或enhancement）和一个state role（五个之一）。

### 2.2 那 3 个回归 bug：走/diagnosing-bugs

这一类是症状已知、原因未知。CI 上红的就是这三个 test，你昨天没动它们，前天没动，但它们就是红了。

diagnosing-bugs跟普通 debug 不一样。它一开始不让你读代码、不让你提假设、不让你二分。它强制你先造一个能在本地复现这个 bug 的命令- 一个运行起来就红的命令，且只对这个 bug 红。红线写在 SKILL.md 第 60 行：

> If you catch yourself reading code to build a theory before this command exists, stop - jumping straight to a hypothesis is the exact failure this skill prevents.No red-capable command, no Phase 2.

If you catch yourself reading code to build a theory before this command exists, stop - jumping straight to a hypothesis is the exact failure this skill prevents.No red-capable command, no Phase 2.

它的产物是fix + regression test。如果修完之后发现根因是架构问题（没有好 seam），它会把发现 hand off 给/improve-codebase-architecture- 这是它独有的分支出口。

### 2.3 那个新模块：走/wayfinder

这一类是目的地不清晰。你脑子里有一个方向，但连 spec 都没定型，更别说 ticket。

wayfinder/SKILL.md第 7 行把这个 skill 的本质讲得很直白：

> Wayfinding is about finding that way, not charging at the destination. This skill charts the way as ashared mapon the repo's issue tracker, then works itsdecision tickets- questions whose resolution is a decision, not slices of a build to execute - one at a time until the route is clear.

Wayfinding is about finding that way, not charging at the destination. This skill charts the way as ashared mapon the repo's issue tracker, then works itsdecision tickets- questions whose resolution is a decision, not slices of a build to execute - one at a time until the route is clear.

wayfinder不做实现，只做决策。它的产物是一张 issue tracker 上的 map，每张 ticket 是个需要回答的问题。当 map 上的 fog 散尽、路线清楚时，它把 map 交给/to-spec，由 to-spec 把那些决策坍缩成可执行的 spec，再走/to-tickets→/implement主链路。

### 2.4 三个出口在 main flow 的位置

on-ramp出口汇入点产物形式/triageagent-ready issue/implementbrief + state label/diagnosing-bugsfix + regression test修复完即结束；如发现缺 seam →/improve-codebase-architecturediff + test/wayfinder决策地图（map of decision tickets）/to-spec→/to-tickets→/implementissue tracker 上的 map

on-ramp

出口

汇入点

产物形式

agent-ready issue

brief + state label

fix + regression test

修复完即结束；如发现缺 seam →/improve-codebase-architecture

diff + test

决策地图（map of decision tickets）

→/to-tickets→/implement

issue tracker 上的 map

注意：只有 triage 是直接汇入/implement的，wayfinder 必须先经过to-spec才能进 main flow，diagnosing-bugs 严格来说不走 main flow（它本身已经把 bug 修完了）。

## 3. on-ramp 选择判断决策表

这是文章最核心的一张表。按这张表判断，比凭感觉决定今天先干啥靠谱得多。

输入形态起点工作体量症状清晰度走哪个 on-ramp直接出口别人的 issue/PR、raw bug report、外部 feature request我没创建1 条 1 条独立描述可能模糊也可能清楚，但作者不是我/triage/implement（带 agent-ready brief）我自己 to-tickets 拆出来的工单我创建的，brief 已写好已切片已清晰不要再走 triage/implementCI 红 / 测试不通过 / 行为突然异常我自己代码单点症状清楚，根因未知/diagnosing-bugs修复（必要时 hand off seam 问题）简单 typo、显而易见的不一致、第一次排查就明白原因的 bug我自己代码微小症状=根因不走 diagnosing-bugs，直接/implement/implement我想做的全新模块 / 巨型 feature / 超出单会话我创建半月以上目的地未确定/wayfinder/to-spec已经有清晰 spec 的小特性我创建几天内已清晰不走 wayfinder/to-spec→/to-tickets→/implement

输入形态

起点

工作体量

症状清晰度

走哪个 on-ramp

直接出口

别人的 issue/PR、raw bug report、外部 feature request

我没创建

1 条 1 条独立

描述可能模糊也可能清楚，但作者不是我

（带 agent-ready brief）

我自己 to-tickets 拆出来的工单

我创建的，brief 已写好

已切片

已清晰

CI 红 / 测试不通过 / 行为突然异常

我自己代码

单点

症状清楚，根因未知

修复（必要时 hand off seam 问题）

简单 typo、显而易见的不一致、第一次排查就明白原因的 bug

我自己代码

微小

症状=根因

，直接/implement

我想做的全新模块 / 巨型 feature / 超出单会话

我创建

半月以上

已经有清晰 spec 的小特性

我创建

几天内

已清晰

→/to-tickets→/implement

这张表里两个最容易被忽略的判断：

raw 不 raw是 triage 的入口过滤器。/to-tickets出来的工单不是 raw，不能再走 triage。

难不难定位是 diagnosing-bugs 的入口过滤器。第一次读代码就明白的 bug 不需要 6 phase 全跑。

## 4. 三类判断准则的细节

### 4.1 按 issue 数量和来源判断要不要 triage

数字本身不重要，但量级有意义。如果你的 issue 列表里出现以下任一信号，就该停下来分批 triage，而不是直接挑着做：

跨来源：有陌生 reporter 提的 issue + 有同事口头说的 feature + 有 bot 报的 crash，全混在一起。

跨状态：有的写得很完整（复现步骤、期望行为、实际行为齐全），有的只有一句话它不工作了。

未分类：labels 是空的或只有needs-triage，没有人做过 category/state 判断。

triage/SKILL.md第 26-45 行定义的2 个 category + 5 个 state就是用来处理这种混乱的。2 个 category（bug/enhancement）回答是什么；5 个 state（needs-triage/needs-info/ready-for-agent/ready-for-human/wontfix）回答现在该谁处理。

五类状态机解决的实际管理问题：triage 之前你面对的是一堆 raw 文本，五类 state 之后，每个 issue 都落在一条已知的处理路径上。要么等更多信息（needs-info）、要么已可以交给 agent（ready-for-agent）、要么必须人介入（ready-for-human）、要么不需要做了（wontfix）。这条流水线把30 个 issue 不知道从哪开始换成30 个 issue 各自在哪一步。

标签流转示例（一条典型 issue 的轨迹）

第 12 号 issue 是陌生 reporter 报的：

进入仓库：labels 为空，state 为隐式needs-triage。

triage agent 读完 body 和 comments：信息不全，需要复现步骤。 → 加needs-info标签，回复模板化的 Triage Notes（注：源码triage/SKILL.md第 94-106 行的官方模板是 "What we've established so far / What we still need from you (@reporter)" 两段式，下面是基于此改写的中文示意，不是官方模板）：

这条 issue 现在被/implement拾起。triage 不再介入。

为什么/to-tickets产出的工单不能再被 triage

这是这一节最容易踩的坑。/to-tickets自身的输出（SKILL.md 第 27-40 行）已经是vertical slice + agent-ready的工单。每条工单穿 schema/API/UI/tests 全栈、可独立 demo、大小适配一个新 context window。它出来的工单结构上等价于 triage 出来的 brief。

让 triage 二次处理它们会发生什么？会产生重复标签、状态错位、brief 被覆盖三类事故。更糟的是 - 它会让 triage 失去raw 入口的语义。把我没创建的东西和我已经结构化好的东西混在一起处理，整个 on-ramp 的入口过滤就失效了。

triage/SKILL.md第 88-90 行还留了一个quick state override的口子：maintainer 说move#42to ready-for-agent可以直接执行，跳过 grilling。这条口子是为了避免 triage 变成橡皮图章- 如果一个 issue 信息已经够了，再走一遍完整 grilling 是浪费。

### 4.2 按 bug 严重度判断要不要 diagnosing-bugs

不是所有 bug 都需要 diagnosing-bugs。这条边界值很值得花一段讲清楚。

diagnosing-bugs/SKILL.md第 12-14 行把 Phase 1 写成了 skill 的灵魂：

> This is the skill.Everything else is mechanical. If you have a tight pass/fail signal for the bug - one that goes red onthisbug - you will find the cause ... If you don't have one, no amount of staring at code will save you.

This is the skill.Everything else is mechanical. If you have a tight pass/fail signal for the bug - one that goes red onthisbug - you will find the cause ... If you don't have one, no amount of staring at code will save you.

判断准则：症状是不是一眼看不懂。

第一次看代码就发现是空指针 → 不走 diagnosing-bugs。

报错信息直接指向某行代码 → 不走 diagnosing-bugs。

间歇性 flake，跑了 10 次只红 1 次 → 走 diagnosing-bugs。

上一个 known-good commit 之后某 test 突然变红，找不到改动 → 走 diagnosing-bugs。

报告里写我点了 X 然后 Y 挂了但你本地复现不出来 → 走 diagnosing-bugs。

判断的核心是有没有 tight feedback loop。一个 tight feedback loop 必须满足 4 条（SKILL.md第 53-58 行）：

Red-capable- 跑的是 bug 的实际代码路径，断言用户的精确症状

Deterministic- 同输入同结果（flaky 就用 pinned reproduction rate 钉死）

Fast- 秒级，不是分钟级

Agent-runnable- 可以无人值守跑（最后手段是 HITL bash 模板）

red-capable command 模板示例（演示用，非官方）

假设一条 bug 报告是在 macOS 14 上执行git mv重命名带空格的文件后，提交时索引报错。下面是 Phase 1 产物的最小模板（注：源码diagnosing-bugs/scripts/目录下只有hitl-loop.template.sh（HITL 专用，41 行）一个脚本，下面是基于[DEBUG-a4f2]标签模式和 red-capable 4 条验收标准自构的演示，不要当作官方模板）：

四个 tag 全部满足之前不许进入 Phase 2。Phase 3 才提假设，且必须 3-5 个 ranked hypotheses，每个写成 falsifiable 格式：

> If`<X>`is the cause, then changing`<Y>`will make the bug disappear / changing`<Z>`will make it worse.

If`<X>`is the cause, then changing`<Y>`will make the bug disappear / changing`<Z>`will make it worse.

为什么只提一个假设是反模式？因为单假设锚定在第一个 plausible idea 上，会让你跳过早该考虑的方向。SKILL.md第 84 行原文：

> Generate3–5 ranked hypothesesbefore testing any one of them. Single-hypothesis generation anchors on the first plausible idea.

Generate3–5 ranked hypothesesbefore testing any one of them. Single-hypothesis generation anchors on the first plausible idea.

它如何把修一个 bug 升级为留下一个 regression test + 一个 seam

diagnosing-bugs跑完之后留下来的不只是 fix，还有两样东西：

Regression test- 就是上面那个 red-capable command。它现在变绿了，但以后这个 bug 再回来它会重新变红。

Seam- 一个正确的接缝点，让测试能锁定 bug 的真实模式。SKILL.md第 110-115 行原文：

> A correct seam is one where the test exercises thereal bug patternas it occurs at the call site. If the only available seam is too shallow...

A correct seam is one where the test exercises thereal bug patternas it occurs at the call site. If the only available seam is too shallow...

更关键的一条规则写在同段：

> If no correct seam exists, that itself is the finding.Note it. The codebase architecture is preventing the bug from being locked down. Flag this for the next phase.

If no correct seam exists, that itself is the finding.Note it. The codebase architecture is preventing the bug from being locked down. Flag this for the next phase.

也就是说 -修一个 bug 留下一句"缺 seam"的话，diagnosing-bugs 把它 hand off 给/improve-codebase-architecture，让架构层面的改造来解决接缝缺失。这个 hand off 在 Phase 6 的 post-mortem 里完成，而不是修 bug 之前- 因为修完之后你对根因的理解比开始时深。

### 4.3 按工作体量判断要不要 wayfinder

wayfinder 是三个 on-ramp 里认知负担最重的。SKILL.md在 ask-matt 章节里直接写"save it for exactly that, never a well-scoped feature"。

判断准则只有一条：目的地是否清晰。

目的地清晰（一个 spec 草稿、一组已写好的接口、新模块的第一个 PR 范围已经收敛） → 不走 wayfinder。

目的地模糊（只知道大致方向，不知道边界在哪，feature 大到要拆若干个 spec） → 走 wayfinder。

一眼看不到头（greenfield、巨型 build、超出单会话多次的体量） → 走 wayfinder。

SKILL.md第 112 行留了一个明确信号：

> If this surfaces no fog - the way to the destination is already clear, the whole journey small enough for one session - you don't need a map. Stop and ask the user how they'd like to proceed.

If this surfaces no fog - the way to the destination is already clear, the whole journey small enough for one session - you don't need a map. Stop and ask the user how they'd like to proceed.

也就是说 wayfinder 不是先无脑开图、跑完再判断 - 它开图之后第一步就是检查有没有 fog，没有 fog 就关掉。这是个内置的反例闸门。

为什么是决策地图而不是交付物

wayfinder 的 map 是 issue tracker 上的索引，不是仓库。第 23 行原文：

> The map is anindex, not a store. It lists the decisions made and points at the tickets that hold their detail; a decision lives in exactly one place - its ticket - so the map never restates it, only gists it and links.

The map is anindex, not a store. It lists the decisions made and points at the tickets that hold their detail; a decision lives in exactly one place - its ticket - so the map never restates it, only gists it and links.

四类 ticket 各司其职：

Research（AFK） - 读文档、外部资源；/researchsubagent 跑

Prototype（HITL） - 提升讨论保真度；答案是一个 artifact（UI sketch、状态模型）

Grilling（HITL） -/grilling+/domain-modeling一问一答；agent 不能替人答- "a grilling agent that answers its own questions has broken this"

Task（HITL or AFK） - 必须先有动作才能做决策；唯一会真做事的 type，存在的理由是 unblock 一个 decision

注意：一次会话只解一个 ticket，research 类型例外。这是 wayfinder 的节奏，跟 main flow 多 ticket 并行完全不同。

## 5. 三类反例：按错顺序走会出什么问题

### 5.1 反例一：先做最吵的 issue，回归 bug 没人修

操作：周一打开仓库，看到一条高赞 issue 标题里带 emoji，写得很激动。直接/implement开始修。三个 CI 红的 test 继续红。

问题：

那条 issue 本身大概率会走 triage 跑成needs-info，因为描述再激动也没复现步骤。

三个回归 bug 错过了症状最明显的时间窗- 它们的 red 信号还新鲜，diagnosing-bugs 跑起来最快。等一周后没人记得它们怎么红的，feedback loop 会变难。

triage 队列里 29 条 issue 没动。

正确顺序：回归 bug 优先（症状热 + 风险高）→ issue 批 triage → 新模块评估要不要 wayfinder。

### 5.2 反例二：先抢修 bug，错过结构性机会

操作：诊断一个 bug 修到一半，发现根因是缺 seam（接缝缺失）。但因为想赶紧让 CI 绿，跳过了/improve-codebase-architecture的 hand off，临时打补丁绕过。

问题：

bug 是修了，但缺 seam 的根因还在。下次同模式 bug 还会出现，diagnosing-bugs 还得重新跑一遍。

多个相关 bug 可能都共享这个 seam 问题 - 这次修了三个 bug，下次还是同样的 patch 套路。

正确顺序：bug 修复完成后保留 seam 缺失的发现，hand off 给/improve-codebase-architecture。SKILL.md第 134-136 行原文：

> Make the recommendationafterthe fix is in, not before - you have more information now than when you started.

Make the recommendationafterthe fix is in, not before - you have more information now than when you started.

### 5.3 反例三：先上 wayfinder 反而比 to-spec 更慢

操作：想做的新模块有大概方向，开个 wayfinder 会话，画一个 map，挂 20 个 decision ticket。

问题：

你的 spec 草稿其实已经能写完，只是没人 review。这种情况 wayfinder 是在做 to-spec 该做的事 - 前者把信息分散到 20 张 ticket里，后者坍缩在一份文档里。前者慢十倍以上，且 map 还得回头交给 to-spec 坍缩一次（兜一圈浪费）。

SKILL.md自己在第 112 行埋了反例闸门："If this surfaces no fog ... you don't need a map."

正确顺序：先评估目的地是不是已经清晰。如果只是需要访谈 grill →/grill-me或/grill-with-docs；如果需要 spec 化 → 直接/to-spec；只有目的地真的不清晰才上/wayfinder。

## 6. 上游产物如何接入下游节点

最后把这三个 on-ramp 的产物和下游节点的关系列清楚。这张表跟第 2 节的出口表呼应，但视角换成上游产物。

上游产物来自哪个 on-ramp产物形态下游节点备注ready-for-agentissue + brief/triageissue body + category/state 标签/implementbrief 已经行为化、可验收、不指路径ready-for-humanissue/triage同结构 brief +为什么不能委派一段人适合 maintainer 处理needs-infoissue/triageTriage Notes 模板等 reporter 回复不进 main flowwontfixissue/triage简短原因 +（若是 enhancement）.out-of-scope/留档关 issue已实现的 wontfix 不进 out-of-scopefix + regression test +（可选）缺 seam备注/diagnosing-bugsdiff + test + post-mortem合并 / 部署；如发现缺 seam →/improve-codebase-architecturehand off 时机是 fix 之后决策 map + linked decision tickets/wayfinderissue tracker 上的 map/to-spec不能跳过 to-spec 直接 implement- 会扔掉决策细节spec/to-specmarkdown/to-ticketsto-spec不访谈，只综合已被 grill 过的共识vertical-slice 工单/to-ticketsissue / ticket/implement已 agent-ready，不再 triage实现的 diff/implementPR/code-reviewcommit 时清上下文

上游产物

来自哪个 on-ramp

产物形态

下游节点

备注

issue + brief

issue body + category/state 标签

brief 已经行为化、可验收、不指路径

issue

同结构 brief +为什么不能委派一段

人

适合 maintainer 处理

issue

Triage Notes 模板

等 reporter 回复

不进 main flow

issue

简短原因 +（若是 enhancement）.out-of-scope/留档

关 issue

已实现的 wontfix 不进 out-of-scope

fix + regression test +（可选）缺 seam备注

diff + test + post-mortem

合并 / 部署；如发现缺 seam →/improve-codebase-architecture

hand off 时机是 fix 之后

决策 map + linked decision tickets

issue tracker 上的 map

- 会扔掉决策细节

spec

markdown

to-spec不访谈，只综合已被 grill 过的共识

vertical-slice 工单

issue / ticket

已 agent-ready，不再 triage

实现的 diff

PR

commit 时清上下文

注意最后一行 -/implement输出走/code-review，这条主链路在另一篇（06 篇 main flow）展开。

## 总结

把三类输入混在一起处理，Agent 默认会挑最吵的 - 那条高赞 issue、那个 emoji 标题、那个看起来能做的小需求。这不是 Agent 偷懒，是它没有分类器。

ask-matt的三类 on-ramp 提供的就是这个分类器：

raw 进来的、不是你创建的→/triage，产 agent-ready brief

症状清晰根因未知的→/diagnosing-bugs，造 red-capable command 后再继续

目的地模糊超出单会话的→/wayfinder，先决策后执行

判断准则只有三条，按这个顺序走 - 不是按哪个最吵。按错顺序的代价不是浪费几小时，是错过 CI 红的窗口期、把缺 seam 的根因埋掉、或者把一个清晰特性拆成 20 张 ticket 兜一圈再合回来。

文章没承诺 triage 就会减少积压、diagnosing-bugs 就会减少 bug 复发、wayfinder 就会减少返工 - 这些都是结果，不是承诺。它们能保证的是输入被分到合适的入口，至于入口之后怎么样，取决于具体 issue、具体 bug、具体 feature。

好啦，谢谢你观看我的文章，如果喜欢可以点赞转发给需要的朋友，我们下一期再见！敬请期待！
