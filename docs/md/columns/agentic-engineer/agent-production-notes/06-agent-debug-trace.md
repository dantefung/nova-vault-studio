---
title: "为什么你的 Agent 答错问题你查不出来？"
date: "2026-07-10"
source: "微信公众号：老梁agent"
---

# 为什么你的 Agent 答错问题你查不出来？

> 生产实战笔记系列第 06 篇。推理链路可解释性——三件事让你的 Agent 从「黑盒」变成「透明」。

---

## 一个故事

周二下午，客户反馈 Agent 的诊断结论全是错的。工程师翻开几万行散落各处的 log，人肉搜索关键词，花了两个小时才定位到是 RAG 召回了过期文档。

这不是可选项，是必选项。

## 三件事让 Agent 可解释

| # | 措施 | 效果 |
|---|------|------|
| 1 | **每个请求带 Trace ID，返回给客户端** | 出问题客户端给 Trace ID，服务端一键拉取完整链路 |
| 2 | **LLM 和工具调用全量记录** | 每次 LLM 输入输出、每次工具调用参数与返回值都留痕 |
| 3 | **日志结构化** | JSON 格式，含 trace_id / request_id / agent_name / step / prompt_hash |

> 📎 完整原文见知识库：[wiki/sources/agent-debug-trace.md](../../../wiki/sources/agent-debug-trace.md)

---

[← 上一篇：可观测性](./05-agent-observability.md) | [下一篇：记忆模型 →](./07-agent-memory-four-tier.md)