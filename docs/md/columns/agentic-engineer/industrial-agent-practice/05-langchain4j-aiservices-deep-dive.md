---
title: "LangChain4j AiServices 深度解析：声明式 Agent 编程的魔法背后"
date: "2026-06-08"
source: "微信公众号：老梁agent"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483742&idx=1&sn=52532c7a24b979cbb846acb4e265cc54&chksm=f41d6ba3c36ae2b5507e1528d7bc6d1ba01cabc723124ca50f6a377f6e5817a3d287a97bda16#rd"
---

# LangChain4j AiServices 深度解析：声明式 Agent 编程的魔法背后

> 工业 AI Agent 实战派第 05 篇。AiServices 的本质是动态代理——你定义接口，它负责执行。

---

## 核心：动态代理

`AiServices` 在运行时通过 Java 动态代理创建实现类，拦截方法调用，自动完成：拼接 SystemMessage → 拼接 UserMessage → 注入工具描述 → 调用 LLM → 解析工具调用 → 执行工具 → 循环直到完成。

## 五大能力

| 能力 | 注解 | 作用 |
|------|------|------|
| 人设 | `@SystemMessage` | 给 Agent 一个固定角色和行为边界 |
| 模板化提示 | `@UserMessage` | 参数化提示词，支持模板变量替换 |
| 记忆 | `ChatMemory` | 对话上下文持久化，不丢历史 |
| 流式响应 | `TokenStream` | SSE 流式输出，实时展示 token |
| 结构化输出 | POJO 返回 | 指定返回类型，LLM 输出自动反序列化为对象 |

> 📎 完整原文见知识库：[wiki/sources/langchain4j-aiservices-deep-dive.md](../../../wiki/sources/langchain4j-aiservices-deep-dive.md)

---

[← 上一篇：Function Calling 排坑](./04-why-agent-not-call-tools-function-calling-4-pits.md) | [下一篇：ChatMemory →](./06-agent-chat-memory-3-strategies.md)