---
title: "一个 IoT 架构师开始学 AI Agent"
date: "2026-06-02"
source: "微信公众号：老梁agent"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483663&idx=1&sn=9e6bf6f58b6dd0c00c37f461329e740a&chksm=f41d6bf2c36ae2e405e0f9df3c498371b928f0aa5f6b254055480d64d4d5cd3fa69016082cfa#rd"
---

# 一个 IoT 架构师开始学 AI Agent

> 工业 AI Agent 实战派第 01 篇。10 年 IoT 从业者的 AI Agent 转型之路——为什么选择 Java 生态。

---

## 核心观点

做了 10 年物联网（智能家居 → 泛在物联网 → 工业物联网），面对 AI Agent 浪潮，选择从 Java 生态切入，用工业场景验证。

## 为什么是现在

以前实现「设备温度异常 → 自动诊断 → 给出维修建议」需要：建故障知识库 → 写规则/训练分类模型 → 开发诊断引擎 → 维护规则迭代。现在给 LLM 配上查询设备数据的工具，一句话就够了：

> 「CNC-001 告警了，查一下它的电流和历史数据，帮我分析一下可能原因。」

## 为什么不用 Python

AI Agent 不是替代 SCADA 或 MES，而是给工业系统加了一层会推理的中间件。Java 生态的 Spring Boot + LangChain4j 是工业场景的最佳载体。

> 📎 完整原文见知识库：[wiki/sources/iot-architect-to-ai-agent.md](../../../wiki/sources/iot-architect-to-ai-agent.md)

---

[← 专栏首页](./index.md) | [下一篇：第一个 Agent →](./02-langchain4j-deepseek-first-agent.md)