---
title: "小红书运营手册·AI工作台"
date: "2026-07-13"
source: "王梦珂"
url: "https://github.com/nihe0909/xiaohongshu-ai-workbench"
---

## 核心内容

配套《小红书运营手册》的免费开源Codex Skills，给有好产品、有真实经验但不知道怎么讲清楚的人用。手册负责讲判断，AI工作台负责帮你执行。

## 6个Skill

| Skill | 用途 | 使用场景 |
|-------|------|----------|
| xiaohongshu-suite | 母skill，路由和组合工作流 | 不知道该先优化哪里 |
| xiaohongshu-title | 标题生成/诊断/优化 | 要起标题、改标题 |
| xiaohongshu-profile | 主页体检+简介改写 | 看主页第一印象 |
| xiaohongshu-topic-planner | 选题策划和系列规划 | 做选题池、系列内容 |
| xiaohongshu-comment-reply | 评论回复+置顶评论 | 回复评论、引导讨论 |
| xiaohongshu-conversion-path | 成交路径设计 | 内容→私信→产品转化 |

## 推荐工作流

冷启动：xiaohongshu-profile → xiaohongshu-topic-planner → xiaohongshu-title
新笔记：xiaohongshu-topic-planner → xiaohongshu-title → xiaohongshu-comment-reply
卖服务：xiaohongshu-profile → xiaohongshu-conversion-path → xiaohongshu-topic-planner → xiaohongshu-title

## 设计原则

- 每个skill只解决一个稳定工作流
- 先诊断问题，再给可执行输出
- 不编造数据、案例、效果、背书
- 不承诺涨粉、成交、爆款或平台算法结果
- 适合小红书/RED社媒场景，不泛化成普通写作工具

## 关联概念

[[小红书运营]] [[Codex Skills]] [[内容运营]] [[个人IP]]
