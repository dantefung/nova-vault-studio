---
title: "gKev1n（@GKev1n）：别再沉迷让 Sub-agent 互相 Review 代码了——对抗式审查的三大死穴与实测形式化验证转向"
date: "2026-11-04"
source: "X/Twitter"
author: "gKev1n (@GKev1n)"
url: "https://x.com/GKev1n/status/2117484667012342215"
---

# gKev1n（@GKev1n）：别再沉迷让 Sub-agent 互相 Review 代码了——对抗式审查的三大死穴与实测形式化验证转向

> 深入探讨 AI 编程中多智能体对抗式审查（Adversarial Review）的巨大陷阱：响应 xAI 工程师 lauren（@poteto）缩减 pstack 中 interrogate 技能的判断，直指静态 AI 代码互审三大死穴——没苦硬吃钻牛角尖（Nitpicking 代码风格）、过度设计应付极端脑补推高系统臃肿度（违背 YAGNI）、以及用高昂推理 Token 盲猜逻辑却不用免费的编译器与 Linter。指出顶级工程团队的共识：两个大模型在终端里互撕一万句，不如测试框架红一次，不如实测与形式化验证一锤定音。

<!-- more -->

别再沉迷让 Sub-agent 互相 Review 代码了——你以为是“左脚踩右脚上天”，其实是“左手掏右手钱包”。🔥🤖

太赞同 poteto 小姐姐今天的说法了！！

她直言对抗式代码审查（Adversarial Review）大多是在纯烧 Token，不仅大幅砍掉了 pstack 里的 interrogate 技能，还打算把省下的算力全砸向“实测 + 形式化验证”。

跑过自动化 Agent 工作流的人都懂，静态的 AI 代码互审有三个近乎无解的死穴：

- 没苦硬吃：Reviewer 为了证明自己“干活了”，没 Bug 也要硬挑一堆可有可无的代码风格问题（Nitpicking）。
- 过度设计（YAGNI）：为了应付 Reviewer 脑补出来的“极端假设”，主 Agent 会疯狂往代码里塞毫无必要的抽象层和防御逻辑，越改越臃肿，上下文越滚越脏。
- 算力错配：用最贵的推理 Token 去“猜”代码会不会报错，却不用免费的编译器和 Linter 去直接跑一下。

一边是 xAI 工程师砍掉模型互撕、回归硬核验证；另一边是今天 OpenAI 和 Muse 狂提赏金、直接花钱买外部黑客打系统找 Bug。

顶级团队都在用行动投票：两个大模型在终端里吵一万句，不如测试框架红一次，更不如真实红队来一拳。

你的工作流里，AI 审查员到底是在帮你抓真漏洞，还是在帮你刷 API 账单？

maybe a hot take but i now consider adversarial reviews mostly a waste of tokens. far better to use those tokens on empirical combined with formal verification. i have updated pstack to use the interrogate skill less, and eventually i think i may remove it altogether

i have found very little value with code review in the abstract, agents tend to just get lost in the nitpicks and yagnis

## 相关页面

- [[sources/placela-claude-code-team-code-review-practices]]
- [[sources/leo-xiaolei-lauren-poteto-grok-bot-team-guide]]
- [[concepts/engineering-skills]]
- [[concepts/agent-autonomous-pipeline]]
