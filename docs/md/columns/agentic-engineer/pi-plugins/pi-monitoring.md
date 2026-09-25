---
title: "Pi 监控插件精选：把 Token 消耗和 Agent 行为摊开看"
date: "2026-09-21"
---

# Pi 监控插件精选：把 Token 消耗和 Agent 行为摊开看

> Pi 用久以后，开始玩起了监控插件——真正应该先搞清楚的是：Pi 到底加载了什么、Token 花在哪里、哪个模型最贵、为什么任务会越来越慢。

## 5 个监控插件

| 插件 | 定位 | 核心能力 |
|------|------|---------|
| [pi-inspect](./pi-inspect.md) | 把 Pi 当前加载的东西全部摊开 | 查看 System Prompt、Tools、Skills、Commands，适合排查谁把 Context 撑大了 |
| [pi-cost](./pi-cost.md) | 专门查钱花哪了 | 从 Project → Session → Message 拆开看 Token 和费用 |
| [pi-stats-dashboard](./pi-stats-dashboard.md) | 历史 Session 数据分析 | 模型、Provider、Tool、Cache、Token、错误统计 |
| [pi-usage-widget](./pi-usage-widget.md) | 实时消耗盯屏 | Context、Cache、Token、Cost 实时监控，异常提醒 |
| [pi-health](./pi-health.md) | 插件装多后的体检 | 配置/依赖/Extension 状态检测 |

## 适合人群

如果你想研究：
- **Token 消耗在哪？**
- **PI 的每一个流程是怎么运转的？**
- **核心流程为什么要这么设计？**

安装这些插件，用数据说话。

## 注意

如果你没有玩得那么深，暂时不建议安装——以测试为主，对体验提升较小。

## 参见

- [pi-agent-teams](./pi-agent-teams.md) — 常驻队友 + 共享任务板
- [pi-crew](./pi-crew.md) — 完整多 Agent 工作流
- [pi-core-subagent](./pi-core-subagent.md) — 底层 DAG 调度
