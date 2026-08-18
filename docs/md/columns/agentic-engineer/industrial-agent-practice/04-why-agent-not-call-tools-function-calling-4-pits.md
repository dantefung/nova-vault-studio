---
title: "为什么我的 Agent 不调用工具？排查 Function Calling 的 4 个常见坑"
date: "2026-06-06"
source: "微信公众号：老梁agent"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483736&idx=1&sn=637caaba3a9f73dbb2c48241731d7951&chksm=f41d6ba5c36ae2b31452c1b83c27b114497f07cb67be44994782f698860909d1a732fccf712e#rd"
---

# 为什么我的 Agent 不调用工具？排查 Function Calling 的 4 个常见坑

> 工业 AI Agent 实战派第 04 篇。Agent 不调用工具是最高频的调试问题，4 个常见坑逐一排查。

---

## 4 个常见坑

| # | 坑 | 表现 | 解决 |
|---|----|------|------|
| 1 | **@Tool 描述太笼统** | LLM 不知道什么时候该调用 | 写具体场景描述 |
| 2 | **import 了错的 @Tool 注解** | 工具没注册，LLM 看不到 | 确认 import dev.langchain4j.service.tool |
| 3 | **LLM 觉得「不需要」工具** | 问题本身 LLM 能回答，不走工具 | SystemMessage 中强调优先用工具 |
| 4 | **log-requests 没开** | 看不到 LLM 实际请求内容 | 开启 log-requests/log-responses 看 tool_calls |

## 快速排查清单

开启 `log-requests: true` 后检查：1) tools 数组里有没有你的工具？2) LLM 返回有没有 tool_calls？3) 如果没有，说明描述不够清晰或 LLM 认为不需要。

> 📎 完整原文见知识库：[wiki/sources/why-agent-not-call-tools-function-calling-4-pits.md](../../../wiki/sources/why-agent-not-call-tools-function-calling-4-pits.md)

---

[← 上一篇：工具设计 5 原则](./03-industrial-agent-tool-design-5-principles.md) | [下一篇：AiServices 深度解析 →](./05-langchain4j-aiservices-deep-dive.md)