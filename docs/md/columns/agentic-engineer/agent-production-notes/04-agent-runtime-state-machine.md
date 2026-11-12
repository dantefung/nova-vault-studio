---
title: "Agent Runtime 状态机：让 AI 推理每一步都可暂停、可回放、可审计"
date: "2026-07-07"
source: "微信公众号：老梁agent"
---

# Agent Runtime 状态机：让 AI 推理每一步都可暂停、可回放、可审计

> 生产实战笔记系列第 04 篇。从「一条直线」到「一个状态机」——8 个状态显式管理 Agent 生命周期。

---

## 核心问题

MVP 的 Agent 执行是一条直线：收到请求 → LLM 推理 → 调工具 → 返回结果。一旦中间出错，没有状态可恢复，没有步骤可重放。

## 8 个状态的显式状态机

每个 Agent 请求从创建到结束，经历 8 个明确定义的状态，每一步都有日志留痕，可暂停、可回放、可审计。

## RuntimeContext：单次请求的「护照」

每个请求携带一份 RuntimeContext，记录请求 ID、Trace ID、状态、各步骤结果，贯穿整个推理生命周期。

## 关键集成

- 与 CircuitBreaker（熔断器）集成：状态机感知熔断，超时状态不会阻塞线程池
- Controller 层为每个请求颁发「护照」，Agent 层凭护照执行

> 📎 完整原文见知识库：[wiki/sources/agent-runtime-state-machine.md](../../../wiki/sources/agent-runtime-state-machine.md)

---

[← 上一篇：工具层](./03-agent-tool-layer.md) | [下一篇：可观测性 →](./05-agent-observability.md)