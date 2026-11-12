---
title: "shared-weekly-pool"
date: "2026-10-14"
source: "wiki-ingest"
---

# 共用周池（Shared Weekly Pool）

> SpaceXSI 订阅大一统的核心机制：Grok 与 Cursor 共用一个每周刷新的 AI 用量池，打破单产品独立计量的限制。

## 核心概念

SpaceXSI（The X Subscription）将 Grok、Grok Bot、Cursor 和 X Premium 权益合并为一份订阅。关键设计是"共用周池"——Grok 和 Cursor 的 AI 用量共享同一个每周刷新的配额池，Chat/Imagine/Voice/Bot/API 全部从这口池子里消耗。

类比：家里装了一个共用气罐，厨房、热水器、取暖都从它出气，一周补一次。哪天火力开大了，只是这周紧一点，不是整月直接归零。

## 档位与用量关系

| 档位 | 月价 | 相对用量基准 |
|------|------|-------------|
| Plus ($8) | 入门级 | 基准 1× |
| Premium ($30) | 主力档 | 约 4× |
| Super ($100) | 重度用户 | 约 15× |
| Ultra ($200) | Power User | 约 50× |

Premium 是官方对新 AI 用户的默认推荐档位，包含 Grok Bot、最新模型、AI 图/视频、代码托管等完整能力。

## 注意事项

- **第三方模型另算**：Cursor 里用 Claude/GPT 等第三方模型不占周池，按 API 标价计费
- **一天造猛了不会吃光整月**，但见底了要么 top-up 要么等刷新
- **App Store 订阅切换有坑**：Apple 内购的 Cursor 官方无法取消，需自己向 Apple 申请退款

## Context

SpaceXSI 由 x.ai 推出，整合了原先独立的 Cursor、SuperGrok、X Premium 三个订阅体系。

## Related Pages

- [[products/grok-cli]]
- [[patterns/engineering-taste]]
- [[concepts/agent-loop]]

## Sources

- 蓝哥AI《SpaceXSI订阅大一统详解》：x.com/0xlangeai/status/2109848124017828195
