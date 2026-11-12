---
title: "pi-herdsman：可以继续往下嵌套 Agent"
date: "2026-09-21"
---

# pi-herdsman：可以继续往下嵌套 Agent

> 不只是一个 Leader 带几个 Agent，而是 Agent 下面还能继续挂 Agent，已经开始有点"组织架构"的味道了。

## 定位

**可嵌套的层级 Agent 结构**。

## 核心能力

- **层级嵌套**：Agent 下继续挂 Agent，形成树状组织
- **组织架构感**：不再是扁平结构，而是有层级关系
- **职责分解**：每个 Agent 负责更细分的工作单元

## 与其他插件的区别

| 插件 | 结构 |
|------|------|
| pi-agentteam | 扁平，Leader + 若干 Teammates |
| pi-herdsman | 层级，Agent 下继续挂 Agent |
| pi-agent-teams | 常驻 + 共享任务板 |

## 适用场景

复杂的大型任务，需要多层级分工，如：
- 组织架构级别的项目分解
- 大型产品的模块化开发
- 多层次的研究分析任务

## 参见

- [pi-agentteam](./pi-agentteam.md) — 扁平 Leader + Teammates
- [pi-agent-teams](./pi-agent-teams.md) — 常驻队友
- [pi-crew](./pi-crew.md) — 完整工作流
