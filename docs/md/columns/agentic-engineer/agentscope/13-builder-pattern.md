---
title: "纯 Java 构建 AI 对话机器人：AgentScope 2.0 Builder 模式与流式输出实战"
date: "2026-07-25"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/l1HmsYK2w11U0hk-tadpLg"
---

# 纯 Java 构建 AI 对话机器人

> AgentScope 迁移系列第 13 篇。用 Builder 模式配置 Agent，支持流式输出和深度思考模式——纯 Java 生态，零 Python 依赖。

---

## 核心要点

- **Builder 模式**：链式配置 Agent 的名称、系统提示、模型、工具等
- **流式输出**：`stream()` 方法实时推送 token，前端可逐字展示
- **深度思考**：通过配置开启模型的思考模式，复杂任务推理质量更高

## 三种调用模式对比

| 模式 | 方法 | 适用场景 |
|------|------|---------|
| 同步调用 | `call()` | 简单问答、测试 |
| 流式输出 | `stream()` | 长文本、聊天界面 |
| 异步调用 | `call().block()` | 高并发服务 |

> 📎 完整原文见知识库：[wiki/sources/agentscope-2.0-builder-pattern.md](../../../wiki/sources/agentscope-2.0-builder-pattern.md)

---

[← 上一