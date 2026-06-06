---
title: "gstack Skills 把 AI 编程助手升级为一支工程团队"
date: "2026-06-04"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/wCtuMC6KGwWVFxuVYw_Fgg"
author: "程序员石磊"
---

# gstack Skills 把 AI 编程助手升级为一支工程团队

> Garry Tan（YC President & CEO）业余开源的 gstack 技能集——把通用 AI 编程助手拆分成多个专业角色，按工程生命周期组织成完整团队。

<!-- more -->

## 背景

最近 Stanford CS153《AI 原生公司：如何成为 1000 倍效能工程师》课程里，Garry Tan（现任 YC President & CEO）分享了他的实践——把 AI 编程助手升级为一支完整工程团队。

## 核心思路

gstack 的核心思路：**把一个通用 AI 编程助手拆分成多个专业角色**，让 AI 不只是写代码，还能像完整工程团队一样参与：

- 产品构思
- 需求澄清
- 架构设计
- 代码审查
- 测试发布
- 复盘改进

## 角色组织

每个 Skill 对应一个清晰的职能，通过斜杠命令（如 `/office-hours`）调用。

### 工程生命周期

按"**思考 → 规划 → 构建 → 审查 → 测试 → 发布 → 反思**"组织。

### 5 大类 Skills

| 类别 | 代表 Skill |
|------|-----------|
| 核心规划与启动 | `/office-hours`、`/plan-*` |
| 设计与实现 | 设计/原型/实现相关 |
| 审查、QA 与安全 | `/review`、`/cso`、`/qa` |
| 发布、文档与运维 | `/ship`、`/document-release` |
| 其他辅助 Power Tools | 各类工具型 Skill |

## 闭环工作流

这些 Skills **高度集成**：前置输出（如设计文档）会自动被后续 Skill 读取。

### 典型流程

```
/office-hours → /autoplan 或 /plan-* → 实现 → /review + /cso → /qa → /ship
```

**起点**是产品构思与需求澄清（`/office-hours`），**终点**是发布（`/ship`），中间经过规划、设计、审查、QA，每个阶段都有对应 Skill 接管。

## 关联

- [gstack-skills 专栏](/columns/gstack-skills/) — 本仓 59 个 gstack skill 精读
- GitHub: [garrytan/gstack](https://github.com/garrytan/gstack)
- 原文: [gstack Skills 把 AI 编程助手升级为一支工程团队](https://mp.weixin.qq.com/s/wCtuMC6KGwWVFxuVYw_Fgg)
