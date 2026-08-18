---
title: "AgentScope 事件系统与流式输出"
date: "2026-08-05"
source: "微信公众号：老梁agent"
---

# AgentScope 事件系统与流式输出

> AgentScope 迁移系列第 06 篇。Agent 的「神经系统」——理解 AgentScope 的事件驱动架构与流式输出机制。

---

## 文章要点

- 事件系统的事件类型与发布/订阅模型
- 流式输出的实现方式：SSE / WebSocket / 阻塞模式
- 事件监听器的注册与生命周期
- 事件系统在调试与可观测性中的作用

> 📎 完整原文见知识库：[wiki/sources/agentscope-events.md](../../../wiki/sources/agentscope-events.md)

---

[← 上一篇：多 Agent 协作](./05-multi-agent.md) | [下一篇：MCP 沙箱 →](./07-mcp-sandbox.md)