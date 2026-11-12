---
title: "纳米AI（@antiAIvo）：Agent 工程心法——七成在传统后端，三成在处理模型不确定性"
date: "2026-11-03"
source: "X/Twitter"
author: "纳米AI (@antiAIvo)"
url: "https://x.com/antiAIvo/status/2117244503560225108"
---

# 纳米 AI（@antiAIvo）：Agent 工程心法——七成在传统后端，三成在处理模型不确定性

> 拆解 Agent 工程师的能力模型与本质分工：七成是经典后端工程（状态机、RPC、存储缓存、任务队列工作流、沙箱权限、可观测性）；三成是概率性组件的不确定性治理，核心依托两根支柱——运行时约束 Harness（让 Agent 跑稳）与数据集评测 Eval（验证演进方向）。

<!-- more -->

Agent 工程，我的感觉是七成后端，三成在处理不确定性

七成后端很好理解

主循环是状态机，工具调用是 RPC

记忆是存储和缓存，长任务是队列和工作流

再加上沙箱、权限、可观测性

这也是为什么大厂的 Agent 工程师很多是后端转过去的

三成的不确定性

Agent 的核心组件是概率性的

同一个请求跑十次，结果可能都不一样

处理这种不确定性，主要靠两样东西

1. Harness，运行时约束，让 agent 跑的稳
2. Eval，用数据集打分，判断改动是变好了还是变坏了

## 相关页面

- [[sources/antivo-deepseek-super-agent-distributed-master-worker]]
- [[sources/criscxuan-deepseek-super-agent-architecture-teardown]]
- [[concepts/harness-engineering]]
- [[concepts/durable-execution]]
