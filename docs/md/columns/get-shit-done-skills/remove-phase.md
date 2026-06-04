---
title: "remove-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# remove-phase

> Remove an unstarted future phase from the project roadmap, delete its directory, renumber all subsequent phases to maintain a clean linear sequence, and commit the change. The git commit serves as the

<!-- more -->

## 定位

Remove an unstarted future phase from the project roadmap, delete its directory, renumber all subsequent phases to maintain a clean linear sequence, and commit the change. The git commit serves as the historical record of removal.

## 核心流程/章节

- parse_arguments
- init_context
- validate_future_phase
- confirm_removal
- execute_removal
- commit
- completion

## 原文要点

Parse the command arguments: - Argument is the phase number to remove (integer or decimal) - Example: `/gsd-remove-phase 17` → phase = 17 - Example: `/gsd-remove-phase 16.1` → phase = 16.1 If no argument provided: ``` ERROR: Phase number required Usage: /gsd-remove-phase Example: /gsd-remove-phase 17 ``` Exit. Load phase operation context: ```bash INIT=$(gsd-sdk query init.phase-op "${target}") if

## 适用场景

- 基于 description 推断：Remove an unstarted future phase from the project roadmap, delete its directory, renumber all subsequent phases to maintain a clean linear sequence, a

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
