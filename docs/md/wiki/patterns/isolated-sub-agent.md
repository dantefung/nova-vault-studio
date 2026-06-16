---
title: "Isolated Sub-Agent"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Isolated Sub-Agent

子 Agent 不是主 Agent 的复制品。它是有自己上下文、自己工具集、跑在更便宜模型上的专业单元。

## 成本模型精妙之处

编排器用 Opus（贵但管思路），子 Agent 用 Sonnet 或 Haiku（便宜管执行）。同时推进任务量是纯 Opus 方案的 5-10 倍，总成本还更低。

## 隔离原则

主 Agent 委派任务给子 Agent，子 Agent 拿到干净窗口，只装任务和必要文件，完成后返回摘要——不是返回完整对话记录。

## 相关

- [[context-engineering]] — 上下文工程
- [[orchestrator-pattern]] — 编排器
