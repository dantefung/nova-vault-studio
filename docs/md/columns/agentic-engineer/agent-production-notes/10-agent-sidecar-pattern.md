---
title: "Agent 系统的 SideCar 模式：主链路之外的异步能力"
date: "2026-07-22"
source: "微信公众号：老梁agent"
---

# Agent 系统的 SideCar 模式：主链路之外的异步能力

> 生产实战笔记系列第 10 篇。关键路径做完立刻返回，非关键操作「挂」在请求后面异步完成——像 F1 进站，换轮胎做完立刻出发，数据采集在车出去之后处理。

---

## 核心问题

用户看到回复的时间 = LLM 推理 + 成本记录 + 审计写入 + 指标上报 + 记忆存储。后四项跟用户完全无关，但每一项都在增加时延。

## SideCar 的四个职责

| 职责 | 说明 |
|------|------|
| **成本记录** | LLM 调用后统计 token 数和费用，异步写入 |
| **记忆写入** | 对话结束后写 L1/L2 记忆，摘要生成和画像更新走异步 |
| **审计落库** | 工具调用入参/返回/耗时/状态写入 PostgreSQL，executionId 可回溯 |
| **指标上报** | 请求耗时、成功/失败、熔断次数推送到 Micrometer + Prometheus |

## 容错设计

SideCar 使用专用线程池（`sidecarExecutor`），与主线程完全隔离。异步任务失败不阻塞主链路，不中断 Agent 回复，不影响用户体验。

> 📎 完整原文见知识库：[wiki/sources/agent-sidecar-pattern.md](../../../wiki/sources/agent-sidecar-pattern.md)

---

[← 上一篇：调度并发](./09-agent-scheduling-concurrency.md) | [下一篇：RAG 混合检索 →](./11-rag-hybrid-retrieval.md)