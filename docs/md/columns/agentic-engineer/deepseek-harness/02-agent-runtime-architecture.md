---
title: "从 DeepSeek Harness 的架构，看 Agent Runtime 该怎么设计"
date: "2026-08-13"
source: "微信公众号"
---

# 从 DeepSeek Harness 的架构，看 Agent Runtime 该怎么设计

> DeepSeek Harness 专栏第 02 篇。从架构视角拆解 DSH 的设计决策：没有特权核心、append-only 事件流、Seam 机制、插件即配置。

---

## 架构核心：没有特权核心

> There is no privileged core to patch: you extend dsh by mounting a plugin beside the others.

模型适配器是插件，工具注册表是插件，会话日志是插件，**连 Agent Loop 本身都是插件**。这不是「帮你配好手脚」，而是「连骨架也是插件」。

![无特权核心架构](../../../wiki/images/deepseek-harness-agent-runtime-architecture/001.png)

## Session Log：append-only 事件流

> The session log is the source of the context the model sees. Model-visible means logged.

事件类型：turn/start → step/start → user/message → assistant/chunk → assistant/message → tool/call → tool/result → step/end → turn/end。上下文压缩不删除原始数据，只插入 replacement 事件改变视图。

**核心价值**：完整回放 Agent 的每一步决策，Fork 和 Resume 自然成为事件流的子集。

## Seam 机制：能力可替换的三角色设计

DSH 用 Context / Fiber / Service 三个角色管理跨插件关系，回答三个问题：哪些插件活着？插件退出时谁负责清理？能力没了哪些依赖它的插件也不能继续跑？

## Agent Loop：turn 和 step 两级生命周期

一次 turn = 用户发一条消息。一次 step = 模型发一次请求 + 执行一轮工具调用。两级生命周期让日志天然结构化为完整的 ReAct 轨迹。

> 📎 完整原文见知识库：[wiki/sources/deepseek-harness-agent-runtime-architecture.md](../../../wiki/sources/deepseek-harness-agent-runtime-architecture.md)

---

[← 上一篇：整体架构](./01-deepseek-harness.md) | [下一篇：插件运行机制 →](./03-plugin-architecture.md)