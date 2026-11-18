---
title: "用完全网最火的PM Skills，我决定把163个Skill推倒重做"
date: "2026-06-15"
source: "空格丶"
url: "https://mp.weixin.qq.com/s/TPbC9HPDvx-fGujacY7hcQ"
---

## 核心洞察

Skill 已进化到 2.0 时代。Skill 1.0 是单 md 文件，Skill 2.0 是 Plugin——包含 Skill+Command+Hooks 的完整发行单位。

## Plugin 体系四层

| 层级 | 作用 |
|------|------|
| Plugin | 发行单位，包含 name/version/author/dependencies |
| Command | 工作流编排，用斜杠命令触发 3-8 个 Skill 串联 |
| Skill | 原子能力，不可再分 |
| Hooks | 生命周期钩子，强制性约束（与 Skill 的建议性相反）|

## pm-skills 案例

9 个 Plugin：产品发现/战略/交付/增长等，每个 Plugin 包含多个 Command 和 Skill。

常用 Command：/discover（4 个 Skill 自动接力）、/write-prd、/pre-mortem、/red-team-prd、/ship-check、/north-star

## Hooks 应用场景

- session-start：自动加载写作风格.md
- 索引同步：写完文章自动追加 articles_index.jsonl
- session-end：自动写 daily_log.jsonl

## Skill 2.0 四个参考

1. 不要只做一个 Skill，做一套（3-5 个原子 Skill）
2. 用 Command 串起来（/new-article 一条龙）
3. Skill>10 个改成 Plugin
4. 用 Hooks 自动化重复事务

## 关联工具

skill-plugin-architect：扫描本地所有 Skill→聚类成 Plugin→推荐 Command/Hooks→一键生成 Plugin 结构

## 关联概念

[[Skill 2.0]] [[Plugin]] [[Command]] [[Hooks]] [[pm-skills]] [[Skill 编排]]
