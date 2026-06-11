---
title: "GStack Skills（AI编程助手团队化）"
date: "2026-06-11"
---

# GStack Skills（AI编程助手团队化）

> Garry Tan（YC President & CEO）业余开源的 gstack 技能集——把通用 AI 编程助手拆分成多个专业角色，按工程生命周期组织成完整团队。

## Key Points

- **核心思路**：把一个通用 AI 编程助手拆分成多个专业角色，让 AI 不只是写代码，还能像完整工程团队一样参与
- **角色覆盖**：产品构思、需求澄清、架构设计、代码审查、测试发布、复盘改进
- **工程生命周期**：思考 → 规划 → 构建 → 审查 → 测试 → 发布 → 反思

## 5 大类 Skills

| 类别 | 代表 Skill |
|------|-----------|
| 核心规划与启动 | `/office-hours`、`/plan-*` |
| 设计与实现 | 设计/原型/实现相关 |
| 审查、QA 与安全 | `/review`、`/cso`、`/qa` |
| 发布、文档与运维 | `/ship`、`/document-release` |
| 其他辅助 Power Tools | 各类工具型 Skill |

## 闭环工作流

```
/office-hours → /autoplan 或 /plan-* → 实现 → /review + /cso → /qa → /ship
```

**起点**是产品构思与需求澄清（`/office-hours`），**终点**是发布（`/ship`），中间经过规划、设计、审查、QA，每个阶段都有对应 Skill 接管。

## Related Pages

- [patterns/multi-agent-architecture](patterns/multi-agent-architecture) — 多Agent架构模式
- [concepts/harness-engineering](concepts/harness-engineering) — 驭化工程

## Sources

- 微信公众号《gstack Skills 把 AI 编程助手升级为一支工程团队》(2026-06-04)