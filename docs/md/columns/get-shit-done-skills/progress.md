---
title: "progress"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# progress

> Check project progress, summarize recent work and what's ahead, then intelligently route to the next action — either executing an existing plan or creating the next one. Provides situational awareness

<!-- more -->

## 定位

Check project progress, summarize recent work and what's ahead, then intelligently route to the next action — either executing an existing plan or creating the next one. Provides situational awareness before continuing work.

## 核心流程/章节

- init_context
- load
- analyze_roadmap
- recent
- position
- report
- mvp_display
- route

## 原文要点

**Load progress context (paths only):** ```bash INIT=$(gsd-sdk query init.progress) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Extract from init JSON: `project_exists`, `roadmap_exists`, `state_exists`, `phases`, `current_phase`, `next_phase`, `milestone_version`, `completed_count`, `phase_count`, `paused_at`, `state_path`, `roadmap_path`, `project_path`, `config_path`.

## 适用场景

- 基于 description 推断：Check project progress, summarize recent work and what's ahead, then intelligently route to the next action — either executing an existing plan or cre

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
