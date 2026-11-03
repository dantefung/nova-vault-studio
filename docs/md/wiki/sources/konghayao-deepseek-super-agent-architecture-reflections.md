---
title: "江夏尧（@konghayao）：关于 DeepSeek SuperAgent 架构设计的深度反思与开源工程映射"
date: "2026-11-03"
source: "X/Twitter"
author: "KonghaYao - 江夏尧 (@konghayao)"
url: "https://x.com/konghayao/status/2117076017865277865"
---

# 江夏尧（@konghayao）：关于 DeepSeek SuperAgent 架构设计的深度反思与开源工程映射

> 以 Agent 框架作者与底层系统视角评析 DeepSeek SuperAgent 架构：RCRA Loop 消息队列解耦与事件驱动输入、Async Subagent 与 Cursor Multitask 范式、Inline/Spill 工具落盘与多跳检索的 Channel 化，以及面对 LLM API Error 与停机中断时 Durable 持久化的真正必要性。

<!-- more -->

关于 DS SuperAgent 的架构设计思考：

1. 首先，我们先了解 peri RCRA Loop 的底层概念。RCRA 在 ReAct 基础上扩充了 MessageQueue 来存放未进入 Loop 的外部消息，可以持久化保证 durable，外部消息只能由这个 MessageQueue 来进入 Loop 内部。

2. 借由 1 的基础，我们可以高度解耦解构消息系统和 Agent 系统。

我们向外设计一个 EventSystem，它用来合并所有的外部系统的输入，所有的 IM 或者是 Github 的 webhook 均由此输入，并管控相应的投递逻辑与权限。并在 Event 来到时做可靠投递，到 Agent 系统就进入了一个 session 的 MQ 里面，两侧只有通信耦合。

消息的过滤其实 jev 非常非常合适，不需要构建代码，只需要构建 Agent 需要监听的方向，进行过滤。

3. 我们先了解 Async Subagent System + Cursor Multitask。

Async Subagent System：主 agent 的 Agent 工具立刻返回一个 agent id 和能够与 subagent 通信的方式，subagent 自动异步执行。

Cursor Multitask：multitasks 是一组提示词，关于主子 agent 如何操作的提示词，保证 Async Subagent System 能够在上下文设计中能够运行。

那么 SuperAgent 人机交互中的大部分都是旧有设计。

关于 Router + Worker 的 Agent 系统设计，我认为是非必要的。或者说不需要在代码中构建出这个逻辑，传统的 Agent 核心就有这个能力。这个设计中必要的能力是 ，源头是 Cursor 的 Multitask 和一众以 async 优先的 Agent 设计。

Peri 在实现的时侯，已经做到了 Cursor Multitask 的 Agent Mode 设计。能够由门户 Agent 路由与管理多个 Subagent 工作。

4. 关于 Inline & Spill 就是社区里面非常成熟的工具落盘机制 你可以在 CC、Codex、Peri Code、MCode 和 Pi 的源码里面找到。核心是当消息超过阈值，自动放到磁盘，并给出简化的 tool result 和 寻回方式，通过 Agent 的能力就能完成。

5. 多跳检索这个东西，建议是 EventSystem 提供 Channel 历史的 list 接口，那么其实让 agent 直接从 list 接口找就行了，多跳检索行为可以简化为系统数据找回，无需对 Agent 系统改造。

6. “计算、状态与环境的分离” 的设计源头是 Claude Managed Agent，社区和各大框架有比较成熟的设计，这里不再展开。

7. Watch Dog 的设计算是普普通通，如果 Agent 系统内部设计的得当，那么几乎 95% 的 error 不会阻挡 agent 的正常运行。

经过我们的统计，LLM API Error 和停机中断是两大核心因素，反而是长久以来云服务开发体系的 Agent 系统本身非常稳定。这两个问题，其中一个是 durable 设计能够解决的，比如 pi-durable 尝试解决停机中断恢复。另外一个则可以由 Agent 系统的进程重试来尝试唤醒，在 L LM API uptime 之后自动继续。

8. 关于遮蔽对人的 session 掌控权：这个方向是对的，在 2027 年初，我们应该面对的问题是如何构建一个人，而不是构建一堆 session。

总而言之，SuperAgent 的这篇文章更像是综述了 Agent 设计工程的成熟设计，但是其中的细节和系统的解耦理解还处于一个实验阶段。可以说循着 SuperAgent 的设计，在社区里面能看到非常多已经成熟的设计，借以扩充整个 Agent 体系的视野。

## 相关页面

- [[sources/criscxuan-deepseek-super-agent-architecture-teardown]]
- [[sources/antivo-deepseek-super-agent-distributed-master-worker]]
- [[sources/xiaohu-deepseek-super-agent-experiments-and-security-cost]]
- [[concepts/deepseek-harness-agent-formula]]
