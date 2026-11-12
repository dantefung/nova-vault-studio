---
title: AgentScope 专栏
date: "2026-08-18"
source: "微信公众号"
---

# AgentScope 专栏

> AgentScope 是阿里巴巴开源的 Java Agent 框架，定位为「AI 原生应用开发平台」。本专栏收录 19 篇文章，从「为什么迁移」到「核心概念」到「高级特性」再到「实战复刻」和「工程化脚手架」，覆盖 ReActAgent、HarnessAgent、多 Agent 协作、事件系统、MCP 集成、Skill/Workflow 引擎等完整主题。

---

## 阅读路线

```
动机层    →  为什么迁移
概览层    →  2.0 深度解析
核心层    →  ReActAgent  +  工具系统  +  多 Agent  +  事件系统
进阶层    →  MCP 沙箱  +  HarnessAgent  +  Skill/Workflow
实战层    →  复刻 WorkBuddy
```

---

## 文章列表

| # | 文章 | 来源 | 主题 |
|---|------|------|------|
| 01 | [为什么我们要把 Agent 引擎从自研换成 AgentScope](./01-why-migrate-to-agentscope.md) | 老梁agent | 迁移动机与核心结论 |
| 02 | [AgentScope 2.0 深度解析](./02-2.0-deep-dive.md) | code2rich | 整体架构与核心变化 |
| 03 | [核心概念与 ReActAgent 深度解析](./03-reactagent-core.md) | 老梁agent | 核心 API 与设计模式 |
| 04 | [工具系统：@Tool、@ToolParam 与 Toolkit](./04-tools.md) | 老梁agent | 工具注册与调用机制 |
| 05 | [多 Agent 协作：SubAgent 与 Supervisor 模式](./05-multi-agent.md) | 老梁agent | 并行/串行/协调模式 |
| 06 | [事件系统与流式输出](./06-events.md) | 老梁agent | 事件驱动架构 |
| 07 | [MCP 协议集成与沙箱](./07-mcp-sandbox.md) | 老梁agent | MCP 工具集成与安全沙箱 |
| 08 | [HarnessAgent：高级封装与生产级特性](./08-harnessagent.md) | 老梁agent | HarnessAgent 架构与生产特性 |
| 09 | [Skill 与 Workflow 引擎](./09-skill-workflow-engine.md) | 老梁agent | 经验固化与流程编排 |
| 10 | [我用阿里 AgentScope 复刻了一个 WorkBuddy](./10-workbuddy.md) | 叶小钗 | 实战项目与架构图 |
| 11 | [HarnessAgent：为 ReActAgent 装上操作系统](./11-harnessagent-os-architecture.md) | 一灰灰blog | 四大子系统深度解析 |
| 12 | [ReActAgent 对比：Agent 自主决策 vs 传统 LLM 调用](./12-reactagent-comparison.md) | 一灰灰blog | ReAct 循环与 ReActAgent 设计 |
| 13 | [AgentScope Java 2.0 构建器模式](./13-builder-pattern.md) | 一灰灰blog | Builder 模式深度解析 |
| 14 | [AgentScope Java 2.0 工具架构](./14-tool-architecture.md) | 一灰灰blog | 工具系统三层架构 |
| 15 | [AgentScope Java 2.0 结构化输出](./15-structured-output.md) | 一灰灰blog | Structured Output |
| 16 | [AgentScope Java 2.0 工作区 Workspace](./16-workspace.md) | 一灰灰blog | 大脑外化与三文件机制 |
| 17 | [AgentScope Java 2.0 Skills](./17-skills.md) | 一灰灰blog | Skill 系统深度解析 |
| 18 | [AgentScope Java 2.0 Skill Repository](./18-skill-repository.md) | 一灰灰blog | Skill Repository 管理 |
| 19 | [Harness 工程化和脚手架实践](./19-harness-scaffolding-practice.md) | 华仔 | Java AgentScope 多 Agent 旅游规划项目 |

---

## 参考资料

- [AgentScope 官方仓库](https://github.com/agentscope-ai/agentscope)
- [AgentScope Java SDK](https://github.com/agentscope-ai/agentscope-java)
- [MCP 协议](https://modelcontextprotocol.io/)
- [Agent 范式演变](../agent-paradigm-evolution/agent-paradigm-evolution.md)