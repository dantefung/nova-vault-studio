---
title: Pensieve 深度解析 — AI Agent 的项目记忆系统
description: 系统性解读 Pensieve 的架构设计、语义分层、双系统检索、知识图谱与生命周期管理
series: pensieve
created: 2026-06-03
---

# Pensieve 深度解析

> 📖 完整 HTML 可视化版本：[pensieve-deep-dive.html](/pensieve-deep-dive.html)

## 什么是 Pensieve

Pensieve 是一个为 AI Agent（特别是 Claude Code）设计的**项目级持久记忆系统**。名字来自《哈利波特》中的冥想盆——一个可以存储和提取记忆的容器。

它解决的核心问题：**LLM 有卓越的推理能力，但没有持久记忆。** 每次新会话开始，Agent 对项目的认知归零。Pensieve 通过结构化的 Markdown 知识库，让经验从一次会话传递到下一次。

## 文章索引

| # | 文档 | 主题 |
|---|------|------|
| 1 | [架构与设计哲学](./01-architecture.md) | 双层架构、系统代码与数据隔离、manifest 锚点 |
| 2 | [四层语义模型](./02-semantic-layers.md) | MUST/WANT/IS/HOW 分层、short-term 缓冲机制 |
| 3 | [双系统检索与 pensieve-wand](./03-dual-system.md) | 快思考/慢思考、认知预算、知识升级路径 |
| 4 | [工具链与 Pipeline](./04-tools-and-pipelines.md) | 七大工具职责、Pipeline 骨架、commit/refactor/review 工作流 |
| 5 | [知识图谱与生命周期](./05-graph-and-lifecycle.md) | `[[...]]` 链接系统、状态机、refine 五问法 |
| 6 | [实践指南与对比](./06-practice.md) | 安装配置、日常使用、vs RAG/Vector DB |

## 快速导航

- **想了解整体架构** → [01-architecture.md](./01-architecture.md)
- **想理解知识怎么分类** → [02-semantic-layers.md](./02-semantic-layers.md)
- **想看 Agent 怎么检索知识** → [03-dual-system.md](./03-dual-system.md)
- **想接入自己的项目** → [06-practice.md](./06-practice.md)

## 核心文件

- [Pensieve 架构深度分析](./pensieve-architecture.md) — Pensieve 项目源码分析与架构解读（早期版本）

## 设计原则

- **最少上下文**：通过 skill 渐进式披露，避免 token 浪费
- **全工具兼容**：不依赖特定 AI 工具，任何支持 Skill/MCP 的工具均可使用
- **自增长**：每次对话后自动沉淀知识，越用越精准
- **双轨记忆**：short-term（会话内）+ long-term（持久化）

## 元信息

- 项目地址：[github.com/kingkongshot/Pensieve](https://github.com/kingkongshot/Pensieve)
- 当前版本：v1.3.0
- 基于源码深度解析，非官方文档搬运
