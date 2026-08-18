---
title: 工业 AI Agent 实战派
date: "2026-08-18"
source: "微信公众号：老梁agent"
---

# 工业 AI Agent 实战派

> 从 IoT 架构师到 AI Agent 开发者——7 篇 LangChain4j 实战专辑，覆盖入门到框架深层理解的完整路径。

> 本专辑面向 Java 开发者，从「一个 IoT 架构师开始学 AI Agent」出发，逐步深入：第一个 Agent 搭建、工具设计原则、Function Calling 排坑、AiServices 框架深析、ChatMemory 策略选型、SystemMessage 设计技巧。

---

## 阅读路线

```
入门篇    →  IoT 转 Agent  +  第一个 Agent 搭建
工具篇    →  工具设计 5 原则  +  Function Calling 排坑
框架篇    →  AiServices 深度解析
记忆篇    →  ChatMemory 三种策略
提示词篇  →  SystemMessage 工业设计
```

---

## 文章列表

| # | 文章 | 日期 | 主题 |
|---|------|------|------|
| 01 | [一个 IoT 架构师开始学 AI Agent](./01-iot-architect-to-ai-agent.md) | 06-02 | 为什么不用 Python，Java 开发者的 Agent 路径 |
| 02 | [LangChain4j + DeepSeek：Java 开发者构建第一个 Agent 的完整指南](./02-langchain4j-deepseek-first-agent.md) | 06-04 | 7 步搭建第一个可用 Agent |
| 03 | [工业 Agent 工具设计的 5 个原则](./03-industrial-agent-tool-design-5-principles.md) | 06-05 | 具体描述/简单入参/JSON 返回/幂等/错误 JSON |
| 04 | [为什么我的 Agent 不调用工具？排查 Function Calling 的 4 个常见坑](./04-why-agent-not-call-tools-function-calling-4-pits.md) | 06-06 | @Tool 笼统/注解错误/LLM 不需要/log 没开 |
| 05 | [LangChain4j AiServices 深度解析：声明式 Agent 编程的魔法背后](./05-langchain4j-aiservices-deep-dive.md) | 06-08 | 动态代理 + 五大能力（人设/模板/记忆/流式/POJO） |
| 06 | [Agent 对话为什么会「失忆」？ChatMemory 三种策略对比与工业选型](./06-agent-chat-memory-3-strategies.md) | 06-09 | MessageWindow / TokenWindow / NoMemory 对比 |
| 07 | [给 Agent 一个「人设」：SystemMessage 在工业场景的设计技巧](./07-agent-system-message-industrial-design.md) | 06-09 | 三个作用 + 四个设计原则 |

---

## 参考资料

- [LangChain4j 官方文档](https://docs.langchain4j.dev/)
- [DeepSeek API](https://api.deepseek.com/)