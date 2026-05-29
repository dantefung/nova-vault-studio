---
title: "attractor-guided-engineering-template"
date: "2026-05-29"
---

# Attractor-Guided Engineering Template

> 轻量级应用层项目脚手架，AI 辅助产品开发的持久结构

**GitHub**: https://github.com/entropy-cloud/attractor-guided-engineering-template

## Core Concept

AGE = Attractor-Guided Engineering（吸引子引导工程）

**核心问题**：随着人类和 AI 不断修改项目，仓库应该持续收敛向什么？

**吸引子**：应用项目在快速 AI 迭代中应持续回归的稳定产品、设计和架构结构。

## 文件结构

```
docs/
├── context/          # 必选：项目上下文和真相规则
├── backlog/           # 必选：优先级候选工作和 AI 就绪的下一步行动
├── requirements/      # 必选：实施就绪的需求解释
├── design/           # 必选：稳定的应用层行为和特性 owner 文档
├── architecture/      # 必选：稳定的技术结构和模块边界
├── plans/             # 触发时创建
├── audits/            # 触发时创建
├── logs/               # 触发时创建
├── testing/            # 触发时创建
└── bugs/               # 触发时创建
```

## AGE vs 其他方法

| 方法 | 核心问题 |
|------|---------|
| Harness-First Engineering | 如何约束 AI？如何验证输出？ |
| Spec-Driven Development | 行为变更如何组织成结构化 spec delta？ |
| AGE | 项目应持续回归的稳定结构是什么？ |

**Harness（plan/test/audit/log）只有在 attractor 存在后才有意义。**

## 核心原则

不要只通过聊天推进重要工作：
- 原始信息 → `docs/input/`
- 必选上下文和 owner 优先级 → `docs/context/`
- 优先级下一步行动 → `docs/backlog/`
- 模糊点 → `docs/discussions/`
- 稳定需求 → `docs/requirements/`
- 稳定设计决策 → `docs/design/` + `docs/architecture/`
- 执行控制 → `docs/plans/`
- 证明和历史 → `docs/logs/` + `docs/testing/` + `docs/bugs/`

## 默认最小设置

大多数中小项目只需要：
- `AGENTS.md`
- `docs/index.md`
- `docs/context/`
- `docs/backlog/`
- `docs/process/application-development-workflow.md`
- `docs/input/`
- `docs/requirements/`
- `docs/design/`
- `docs/architecture/`

## Plan 审计要求

创建的 plan 需要：
1. 实施前审计（plan audit）
2. 完成后关闭审计（closure audit）

## 相关项目

- [nop-chaos-flux](https://gitee.com/canonical-entropy/nop-chaos-flux) — 前端框架和低代码运行时实践
- [nop-entropy](https://gitee.com/canonical-entropy/nop-entropy) — 后端框架实践