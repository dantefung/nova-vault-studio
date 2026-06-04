---
title: "fast"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# fast

> Execute a trivial task inline without subagent overhead. No PLAN.md, no Task spawning,
no research, no plan checking. Just: understand → do → commit → log.

For tasks like: fix a typo, update a config

<!-- more -->

## 定位

Execute a trivial task inline without subagent overhead. No PLAN.md, no Task spawning,
no research, no plan checking. Just: understand → do → commit → log.

For tasks like: fix a typo, update a config value, add a missing import, rename a
variable, commit uncommitted work, add a .gitignore entry, bump a version number.

Use /gsd:quick for anything that needs multi-step planning or research.

## 核心流程/章节

- parse_task
- scope_check
- execute_inline
- commit
- log_to_state
- done

## 原文要点

Parse `$ARGUMENTS` for the task description. If empty, ask: ``` What's the quick fix? (one sentence) ``` Store as `$TASK`. **Before doing anything, verify this is actually trivial.** A task is trivial if it can be completed in: - ≤ 3 file edits - ≤ 1 minute of work - No new dependencies or architecture changes - No research needed If the task seems non-trivial (multi-file refactor, new feature, ne

## 适用场景

- 基于 description 推断：Execute a trivial task inline without subagent overhead. No PLAN.md, no Task spawning,
no research, no plan checking. Just: understand → do → commit →

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
