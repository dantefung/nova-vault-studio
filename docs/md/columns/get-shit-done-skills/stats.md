---
title: "stats"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# stats

> Display comprehensive project statistics including phases, plans, requirements, git metrics, and timeline.

<!-- more -->

## 定位

Display comprehensive project statistics including phases, plans, requirements, git metrics, and timeline.

## 核心流程/章节

- gather_stats
- present_stats
- mvp_summary

## 原文要点

Gather project statistics: ```bash STATS=$(gsd-sdk query stats.json) if [[ "$STATS" == @file:* ]]; then STATS=$(cat "${STATS#@file:}"); fi ``` Extract fields from JSON: `milestone_version`, `milestone_name`, `phases`, `phases_completed`, `phases_total`, `total_plans`, `total_summaries`, `percent`, `plan_percent`, `requirements_total`, `requirements_complete`, `git_commits`, `git_first_commit_date`

## 适用场景

- 基于 description 推断：Display comprehensive project statistics including phases, plans, requirements, git metrics, and timeline.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
