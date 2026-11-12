---
title: "pi-core-subagent：DAG + 后台任务 + Agent 通信"
date: "2026-09-21"
---

# pi-core-subagent：DAG + 后台任务 + Agent 通信

> 更偏底层，可以按照任务依赖图调度多个 Agent，还支持后台 Run、Mailbox 和 Agent 之间通信。

## 定位

**底层 DAG 调度**插件，适合研究底层调度机制。

## 核心能力

- **DAG 调度**：按任务依赖图（Directed Acyclic Graph）调度 Agent
- **后台 Run**：支持后台执行任务
- **Mailbox**：Agent 间的消息邮箱机制
- **Agent 通信**：支持 Agent 之间的直接通信

## 适用场景

- 研究多 Agent 底层调度原理
- 需要精细控制任务依赖关系的复杂项目
- 需要后台异步执行 + 结果回传的场景

## 核心概念

```
任务依赖图（Acyclic）→ 按依赖顺序调度 → 后台执行 → Mailbox 通信
```

## 参见

- [pi-agent-teams](./pi-agent-teams.md) — 最像真正的 Team
- [pi-crew](./pi-crew.md) — 偏完整工作流
