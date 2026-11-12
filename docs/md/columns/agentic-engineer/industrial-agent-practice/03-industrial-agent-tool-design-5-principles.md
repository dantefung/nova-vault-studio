---
title: "工业 Agent 工具设计的 5 个原则"
date: "2026-06-05"
source: "微信公众号：老梁agent"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483735&idx=1&sn=88aeda6492f04fc816a436e977109a0e&chksm=f41d6baac36ae2bcd870f37da6154faa9ffc0eda375fbe49a78380a8e26b6480cf5577f6f186#rd"
---

# 工业 Agent 工具设计的 5 个原则

> 工业 AI Agent 实战派第 03 篇。工具是 Agent 的手脚，设计好坏直接决定 Agent 能否可靠工作。

---

## 五大原则

| # | 原则 | 要点 |
|---|------|------|
| 1 | **描述要具体，不要抽象** | 告诉 LLM 这个工具解决什么具体问题，不是泛泛的功能描述 |
| 2 | **入参用最简单类型** | String/Integer/Boolean 优先，避免复杂对象嵌套 |
| 3 | **返回 JSON，不是自然语言** | LLM 更容易解析结构化数据 |
| 4 | **工具要幂等** | 同一请求重复调用的结果应一致 |
| 5 | **错误也要返回 JSON** | 不要抛异常，返回含错误码和错误信息的 JSON |

> 📎 完整原文见知识库：[wiki/sources/industrial-agent-tool-design-5-principles.md](../../../wiki/sources/industrial-agent-tool-design-5-principles.md)

---

[← 上一篇：第一个 Agent](./02-langchain4j-deepseek-first-agent.md) | [下一篇：Function Calling 排坑 →](./04-why-agent-not-call-tools-function-calling-4-pits.md)