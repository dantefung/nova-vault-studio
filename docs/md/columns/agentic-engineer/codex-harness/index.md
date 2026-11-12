---
title: "Codex Harness 专栏"
date: "2026-08-22"
source: "架构师 JiaGouX"
---

# Codex Harness 专栏

> 从 OpenAI Codex 源码解析 Harness 架构：App Server、Core Session、Agent Loop 的三层执行体系与三种接法选型；结合 Codex 核心团队复盘，看长任务里人的介入时机如何变化。

---

## 文章列表

| # | 文章 | 说明 |
|---|------|------|
| 1 | [Codex Harness 架构解析与应用](./01-codex-harness-architecture.md) | 源码基线 `ff0e95007c`，拆四层架构、Thread/Turn/Item 三对象、三层 Agent Loop、审批与业务授权分离、三种接法选型 |
| 2 | [Codex 核心团队复盘：从 30 秒一次反馈，到放手跑几小时](./02-codex-human-intervention-timing.md) | 基于 Every 万字复盘：长任务没有取消反馈，只是把反馈单位从「动作」换成「事件」；第一版 Cloud 失败的教训；Runtime 要存的不只是聊天记录；Goal 保存目标、证据决定结束 |
