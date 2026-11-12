---
title: "Agent 调度与并发：读写分离、SSE 早返回与异步 SideCar"
date: "2026-07-20"
source: "微信公众号：老梁agent"
---

# Agent 调度与并发：读写分离、SSE 早返回与异步 SideCar

> 生产实战笔记系列第 09 篇。热路径上的「搭便车」代码——LLM 推理是用户唯一在等的，其余操作全部异步剥离。

---

## 核心问题

Agent 的响应时间就是用户的等待时间。但代码里多写的每一行同步操作（记成本、写记忆、推指标、存审计）都在占用这个时间——用户完全无感知。

## 改造策略

| 操作 | 用户需要等？ | 改造后位置 |
|------|------------|-----------|
| LLM 推理 | 是 | 主线程（热路径） |
| 工具调用 | 是 | 主线程（热路径） |
| Prompt 编译 | 是（毫秒级） | 主线程 |
| Token 成本记录 | 否 | SideCar 异步 |
| 写记忆 | 否 | SideCar 异步 |
| 推指标/审计 | 否 | SideCar 异步 |

## 关键机制

- **读写分离**：读操作（查告警、查数据）可并发，写操作（创建工单）串行
- **SSE 早返回**：LLM 推理完成后立即返回结果，后台继续处理非关键操作
- **SideCar 异步剥离**：非关键操作全部移入 SideCar，主链路零阻塞

> 📎 完整原文见知识库：[wiki/sources/agent-scheduling-concurrency.md](../../../wiki/sources/agent-scheduling-concurrency.md)

---

[← 上一篇：Prompt 编译引擎](./08-prompt-six-layer-compiler.md) | [下一篇：SideCar 模式 →](./10-agent-sidecar-pattern.md)