---
title: "用完全网最火的PM Skills，我决定把163个Skill推倒重做"
date: "2026-06-15"
source: "空格丶"
url: "https://mp.weixin.qq.com/s/TPbC9HPDvx-fGujacY7hcQ"
---

## 核心洞察

Skill已进化到2.0时代。Skill 1.0是单md文件，Skill 2.0是Plugin——包含Skill+Command+Hooks的完整发行单位。

## Plugin体系四层

| 层级 | 作用 |
|------|------|
| Plugin | 发行单位，包含name/version/author/dependencies |
| Command | 工作流编排，用斜杠命令触发3-8个Skill串联 |
| Skill | 原子能力，不可再分 |
| Hooks | 生命周期钩子，强制性约束（与Skill的建议性相反）|

## pm-skills案例

9个Plugin：产品发现/战略/交付/增长等，每个Plugin包含多个Command和Skill。

常用Command：/discover（4个Skill自动接力）、/write-prd、/pre-mortem、/red-team-prd、/ship-check、/north-star

## Hooks应用场景

- session-start：自动加载写作风格.md
- 索引同步：写完文章自动追加articles_index.jsonl
- session-end：自动写daily_log.jsonl

## Skill 2.0四个参考

1. 不要只做一个Skill，做一套（3-5个原子Skill）
2. 用Command串起来（/new-article一条龙）
3. Skill>10个改成Plugin
4. 用Hooks自动化重复事务

## 关联工具

skill-plugin-architect：扫描本地所有Skill→聚类成Plugin→推荐Command/Hooks→一键生成Plugin结构

## 关联概念

[[Skill 2.0]] [[Plugin]] [[Command]] [[Hooks]] [[pm-skills]] [[Skill编排]]
