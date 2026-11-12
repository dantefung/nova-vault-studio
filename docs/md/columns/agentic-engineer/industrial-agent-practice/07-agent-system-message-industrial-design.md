---
title: "给 Agent 一个「人设」：SystemMessage 在工业场景的设计技巧"
date: "2026-06-09"
source: "微信公众号：老梁agent"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483762&idx=1&sn=7f7703aebf8f0d3da3e7d252a9f6baa8&chksm=f41d6b8fc36ae299517394d30fe72a2a31977b251e3af731270f198e10ad6e94c0902ec9304c#rd"
---

# 给 Agent 一个「人设」：SystemMessage 在工业场景的设计技巧

> 工业 AI Agent 实战派第 07 篇。LLM 觉得自己什么都知道——SystemMessage 就是划清边界的围栏。

---

## SystemMessage 的三个作用

1. **角色定位**：告诉 LLM 你是谁、你的知识边界在哪里
2. **行为约束**：规定输出格式、语言风格、安全规则
3. **工具引导**：强调优先使用工具而非依赖自身知识

## 四个设计原则

| # | 原则 | 说明 |
|---|------|------|
| 1 | **明确身份和边界** | 说清你能做什么、不能做什么 |
| 2 | **强调工具优先** | 「遇到技术问题优先使用工具查询，不要靠猜」 |
| 3 | **规范输出格式** | 指定 JSON / Markdown / 结构化文本 |
| 4 | **安全兜底** | 遇到无法回答的问题，明确说「不知道」而非编造 |

## SystemMessage vs @Tool 描述

SystemMessage 是宏观人设（你是谁、怎么做事），@Tool 描述是微观契约（这个工具做什么、参数是什么）。两者互补，不可互相替代。

> 📎 完整原文见知识库：[wiki/sources/agent-system-message-industrial-design.md](../../../wiki/sources/agent-system-message-industrial-design.md)

---

[← 上一篇：ChatMemory](./06-agent-chat-memory-3-strategies.md) | [→ 专栏首页](./index.md)