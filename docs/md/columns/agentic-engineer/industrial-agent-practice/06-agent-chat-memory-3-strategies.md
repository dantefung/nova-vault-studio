---
title: "Agent 对话为什么会「失忆」？ChatMemory 三种策略对比与工业选型"
date: "2026-06-09"
source: "微信公众号：老梁agent"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483750&idx=1&sn=717029a5bfde585bddf5e5e413f7abdc&chksm=f41d6b9bc36ae28dab77d5b15068c0a7fe81b2ddae1f3d7940df8f984c0ff6be4d060a61b7e6#rd"
---

# Agent 对话为什么会「失忆」？ChatMemory 三种策略对比与工业选型

> 工业 AI Agent 实战派第 06 篇。Agent 的「失忆」不是 bug，是资源约束下的设计取舍——三种策略各有适用场景。

---

## 三种策略

| 策略 | 保留方式 | 适合场景 | 不适合场景 |
|------|---------|---------|-----------|
| **MessageWindow** | 最近 N 条消息 | 短对话、单次问答 | 长对话（会丢早期上下文） |
| **TokenWindow** | 最近 N 个 token | 需要控制成本 | 对话量波动大 |
| **NoMemory** | 无记忆 | 一次性问答、无状态 API | 多轮对话 |

## 工业场景选型

- 设备诊断类 → TokenWindow（2048 token，确保一次推理够用）
- 运维助手 → MessageWindow（最近 20 条，保留操作上下文）
- 知识问答 → NoMemory（每次独立查询，不依赖历史）

## 持久化

生产环境需要 ChatMemoryStore 实现持久化，重启不丢记忆。

> 📎 完整原文见知识库：[wiki/sources/agent-chat-memory-3-strategies.md](../../../wiki/sources/agent-chat-memory-3-strategies.md)

---

[← 上一篇：AiServices 深析](./05-langchain4j-aiservices-deep-dive.md) | [下一篇：SystemMessage →](./07-agent-system-message-industrial-design.md)