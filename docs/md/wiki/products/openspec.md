---
title: "OpenSpec"
date: "2026-05-24"
---

# OpenSpec

> AI 编程中的需求管理工具，核心是 DAG 产物依赖图

## Core Concept

- **需求管理**：从创意/需求出发，管理 AI 编程中的需求到产物的映射关系
- **DAG 产物依赖图**：有向无环图展示产物之间的依赖关系，确保执行顺序和条件

## Use Case

在 Comet 项目中与 Superpowers 组合使用：
- OpenSpec 管归档能力
- Superpowers 管 TDD 驱动执行
- 两者组合实现"需求 → 归档 Spec → TDD → 实现验证"全流程

## Resources

- [GitHub](https://github.com/openspec-ai/OpenSpec)（推测）