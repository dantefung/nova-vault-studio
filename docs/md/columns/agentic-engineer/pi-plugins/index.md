---
title: "Pi 社区 Agent Team 插件精选"
date: "2026-09-21"
---

# Pi 社区 Agent Team 插件精选

> Pi 官方不做 Sub-agent，社区却在玩 AI 公司

## 5 个值得玩的插件

| 插件 | 定位 | 特点 |
|------|------|------|
| [pi-agent-teams](./pi-agent-teams.md) | 常驻队友 + 共享任务板 | 多个 Teammate 常驻，共享任务、互相发消息 |
| [pi-agentteam](./pi-agentteam.md) | Leader + Teammates | 经典团队模式，Leader 调度下设 Researcher/Planner/Implementer |
| [pi-herdsman](./pi-herdsman.md) | 可嵌套 Agent | Agent 下继续挂 Agent，有组织架构味道 |
| [pi-crew](./pi-crew.md) | 完整多 Agent 工作流 | Team/Workflow/并行执行/Worktree/Review/Research，支持判断是否值得上多 Agent |
| [pi-core-subagent](./pi-core-subagent.md) | DAG + 后台任务 + 通信 | 按任务依赖图调度，支持后台 Run、Mailbox、Agent 间通信 |

## 推荐组合

**pi-agent-teams + pi-crew + pi-core-subagent**

- **pi-agent-teams**：最像真正的 Team
- **pi-crew**：偏完整工作流
- **pi-core-subagent**：适合研究底层调度
