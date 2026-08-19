---
title: "AgentScope Java 2.0 工具系统架构：@Tool、Toolkit、ToolGroup 三层设计详解"
date: "2026-07-27"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/3PPy1gB5gxhZSBSxWQ6rng"
---

# AgentScope 工具系统架构：三层设计详解

> AgentScope 迁移系列第 14 篇。AgentScope 的工具系统采用 @Tool / Toolkit / ToolGroup 三层架构，从注解注册到分组管理，完整覆盖工具生命周期。

---

## 三层架构

| 层级 | 机制 | 职责 |
|------|------|------|
| **@Tool** | Java 注解 | 将单个方法注册为工具，声明参数描述 |
| **Toolkit** | 工具集合 | 按功能聚合多个工具，统一注入 Agent |
| **ToolGroup** | 工具分组 | 批量管理工具组，支持动态加载/卸载 |

## 工具注册流程

`@Tool 注解 → 方法签名解析 → 参数校验 → 工具描述生成 → Toolkit 注入 → Agent 调用`

> 📎 完整原文见知识库：[wiki/sources/agentscope-2.0-tool-architecture.md](../../../wiki/sources/agentscope-2.0-tool-architecture.md)

---

[← 上一