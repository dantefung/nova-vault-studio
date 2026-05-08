---
title: "Harness Engineering 知识导航"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# Harness Engineering 知识导航

本专栏收录 Harness Engineering（驭化工程）完整知识体系，来源于 Conn-Ho/harness-engineering 仓库。

## 核心概念

| 文件 | 内容 |
|------|------|
| [00-Overview](concepts/00-overview.md) | 什么是 Harness Engineering，三大支柱，历史背景 |
| [01-Context Engineering](concepts/01-context-engineering.md) | 上下文工程的设计原则与实现模式 |
| [02-Architectural Constraints](concepts/02-architectural-constraints.md) | 架构约束的机械化执行方法 |
| [03-Entropy Management](concepts/03-entropy-management.md) | 熵管理与垃圾回收策略 |
| [04-Agent Readability](concepts/04-agent-readability.md) | 7 项 Agent 可读性度量指标 |
| [05-Throughput Philosophy](concepts/05-throughput-philosophy.md) | 高吞吐合并哲学与 Agent-first 工作流 |
| [06-Harness vs Scaffolding](concepts/06-harness-vs-scaffolding.md) | 驭化层与脚手架的关键区别 |

## 实践指南

| 文件 | 内容 |
|------|------|
| [4 周入门路线图](practice/4-week-roadmap.md) | 4 周快速建立 Harness Engineering 基础 |
| [8 周深度改造蓝图](practice/8-week-blueprint.md) | 深度改造现有项目到 Staff/Principal 级别 |
| [仓库可读性评分清单](practice/repo-readability-checklist.md) | 7 项指标直接评分现有仓库 |
| [常见陷阱](practice/common-pitfalls.md) | 7 个常见陷阱与规避方法 |

## 模板

| 文件 | 用途 |
|------|------|
| [AGENTS.md 模板](templates/AGENTS-template.md) | 为任何项目创建 AGENTS.md |
| [ARCHITECTURE.md 模板](templates/ARCHITECTURE-template.md) | 架构文档模板 |
| [ADR 模板](templates/ADR-template.md) | 架构决策记录模板 |

## 关键数据记忆点

- **OpenAI**：3 人 × 5 个月 = 100 万行代码，1500 PR，0 行手写代码
- **Stripe**：每周 1300+ PR，全自动，无人介入
- **LangChain**：仅改驭化架构：52.8% → 66.5%（+13.7 点）
- **同模型不同驭化**：42% → 78%（+36 点）

## 推荐阅读顺序

**理解概念** → `concepts/00-overview.md`
**动手实施** → `practice/4-week-roadmap.md`
**评估现状** → `practice/repo-readability-checklist.md`
**深入某个支柱** → `concepts/01-` 至 `concepts/06-`
