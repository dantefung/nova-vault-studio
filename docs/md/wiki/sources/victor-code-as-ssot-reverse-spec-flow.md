---
title: "Victor Wu：代码才是唯一事实源——从既有代码反向生成规格说明"
date: "2026-11-23"
source: "X/Twitter"
author: "Victor Wu (@victor_wu)"
url: "https://x.com/victor_wu/status/2124899306733989987"
---

# Victor Wu：代码才是唯一事实源——从既有代码反向生成规格说明

> Pi 的作者说「不需要记忆系统，代码本身就是最佳的事实源」，作者一开始觉得是说说而已，后来发现自己错了：项目已经不写文档，新同事问「有项目文档吗」，回答是「你直接查代码去吧」；CodeGraph 本身就是很好的 Agent 读代码索引。转引 AWS 的 Reverse Spec Flow（从既有代码为 AI Agent 生成规格说明），日本工程圈的讨论点是从既有代码生成规格书不做重复造轮子、站在巨人肩上，特点是能洗出规格 bug 与不一致。

<!-- more -->

我记得 Pi 的作者说过不需要记忆系统，代码本身就是最佳的事实源。我当时还说这种人的话听听就得了，没想到最后发现错的是我。

目前来看，把代码作为 SSOT 是最佳选择，实际上我已经有点这么做的倾向了：我们项目本身已经不写什么项目文档之类的东西，我觉得毫无用处。

今天有新同事来问我：“你们有项目文档之类的吗？”我说：“你直接查代码去吧。”而且我们有 CodeGraph，本身也足够作为一个非常好的 agent 读代码的索引

既存コードからの仕様書作成は、車輪の再発明はせず、巨人の肩に乗りたいところ

軽く試したが、Reversaよりも正確さが特徴なのかな。仕様バグ＆不整合を洗い出してくれるのは良いな

▼ AWSが、既存コードからAI エージェント向けの仕様書を起こす「Reverse Spec Flow」公開https://aws.amazon.com/jp/blogs/news/aidm-introducing-reverse-spec-flow/

## 相关页面

- [[sources/spec-superflow-intro]]
- [[sources/codex-harness-architecture]]
