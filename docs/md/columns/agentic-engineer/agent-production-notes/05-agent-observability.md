---
title: "Agent 可观测性实战：全链路追踪 + JSON 结构化日志"
date: "2026-07-08"
source: "微信公众号：老梁agent"
---

# Agent 可观测性实战：全链路追踪 + JSON 结构化日志

> 生产实战笔记系列第 05 篇。可观测性三根支柱——日志、指标、追踪，把 Agent 从黑盒变成透明引擎。

---

## 核心问题

MVP 的日志能跑通但排不了障：散落的 `log.info()`、没有 Trace ID 关联、无法区分不同请求的日志流。

## 三根支柱

| 支柱 | 实现 | 解决什么 |
|------|------|---------|
| **结构化日志** | 所有日志输出为 JSON 事件，含 trace_id / request_id / agent_name / step | 日志可过滤、可聚合、可关联 |
| **Micrometer 指标** | 请求量、延迟分布、工具调用次数、错误率、Prompt 变更次数 | 看趋势，不看单点 |
| **全链路追踪** | 每个 RuntimeContext 携带 Trace ID，贯穿 Controller → Agent → Tool → LLM | 一次请求的完整调用链 |

## Prompt Hash

`prompt_hash` 是一个被低估的可观测利器——Prompt 一旦变更，hash 随之变化，日志中能直接追溯「这次出错用的是哪个版本的 Prompt」。

> 📎 完整原文见知识库：[wiki/sources/agent-observability.md](../../../wiki/sources/agent-observability.md)

---

[← 上一篇：Runtime 状态机](./04-agent-runtime-state-machine.md) | [下一篇：调试追踪 →](./06-agent-debug-trace.md)