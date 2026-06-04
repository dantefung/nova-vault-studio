---
title: "manager"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# manager

> Interactive command center for managing a milestone from a single terminal. Shows a dashboard of all phases with visual status, dispatches discuss inline and plan/execute as background agents, and loo

<!-- more -->

## 定位

Interactive command center for managing a milestone from a single terminal. Shows a dashboard of all phases with visual status, dispatches discuss inline and plan/execute as background agents, and loops back to the dashboard after each action. Enables parallel phase work from one terminal.

## 核心流程/章节

- initialize
- dashboard
- handle_action
- background_completion
- exit

## 原文要点

## 1. Initialize Bootstrap via manager init: ```bash INIT=$(gsd-sdk query init.manager) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse JSON for: `milestone_version`, `milestone_name`, `phase_count`, `completed_count`, `in_progress_count`, `phases`, `recommended_actions`, `all_complete`, `waiting_signal`, `manager_flags`, and the optional trio `queued_milestone_version

## 适用场景

- 基于 description 推断：Interactive command center for managing a milestone from a single terminal. Shows a dashboard of all phases with visual status, dispatches discuss inl

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
