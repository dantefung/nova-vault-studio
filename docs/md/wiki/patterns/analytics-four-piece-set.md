---
title: "analytics-four-piece-set"
date: "2026-10-14"
source: "wiki-ingest"
---

# 数据分析四件套（GSC + GA4 + PostHog + Clarity）

> 海外网站的四种数据分析工具各解决不同层面的问题，组合使用才能完整理解用户行为。

## 四种工具的定位

| 工具 | 层级 | 核心问题 | 关键指标 |
|------|------|---------|---------|
| Google Search Console | 搜索层 | 搜索引擎如何看待你的站 | 搜索词/展示/点击/排名 |
| Google Analytics 4 | 流量层 | 用户从哪里来、做什么 | 来源/国家/设备/转化事件 |
| PostHog | 产品层 | 用户在产品内如何行为 | 漏斗/留存/功能使用 |
| Microsoft Clarity | 体验层 | 用户实际怎么看/点 | 热图/录屏/滚动深度 |

## 各工具使用要点

### GSC（必须用）
- 看真实搜索词、展示次数、点击率、平均排名
- 有展示但点击少→优先改标题和描述
- 有点击但排名低→继续补充页面内容

### GA4（必须配置）
- 设置 page_view、sign_up、generate_lead、purchase 事件
- 按来源/国家/设备/落地页看转化
- 对照搜索词和注册事件，区分好奇心流量和明确需求用户

### PostHog（产品分析）
- 埋点：signup、onboarding_completed、first_result、subscription_created
- 建立注册到付费的Funnel
- 用户大量注册却未生成第一份结果→先检查首次使用流程

### Clarity（体验诊断）
- 看用户是否反复点击不可点击区域
- 看是否滚到Pricing、在哪个表单字段离开
- 把录屏行为和页面数据对照，找出用户说不清但行为已暴露的问题

## 组合使用原则

GSC告诉你是**什么词**带来流量，GA4告诉你是**哪类用户**来了，PostHog告诉你是**哪一步**流失了，Clarity告诉你是**为什么**流失。四者缺一，诊断不全。

## Related Pages

- [[concepts/overseas-tool-stack]]

## Sources

- 夏林果《出海必备的56个实战工具清单》：x.com/momo_peggy/status/2110301714876346822
