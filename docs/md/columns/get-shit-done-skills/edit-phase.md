---
title: "edit-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# edit-phase

> Edit any field of an existing phase in ROADMAP.md in place. The phase number and position are always preserved. Guarded against in-progress and completed phases unless --force is passed. Validates dep

<!-- more -->

## 定位

Edit any field of an existing phase in ROADMAP.md in place. The phase number and position are always preserved. Guarded against in-progress and completed phases unless --force is passed. Validates depends_on references before writing. Shows a diff and requests confirmation before writing.

## 核心流程/章节

- parse_arguments
- init_context
- load_phase
- check_phase_status
- present_current_values
- collect_edits
- validate_depends_on
- show_diff_and_confirm

## 原文要点

Parse the command arguments: - First argument: phase number to edit (integer or decimal) - Optional flag: --force (allow editing in_progress/completed phases) Examples: `/gsd-edit-phase 5` → phase = 5, force = false `/gsd-edit-phase 5 --force` → phase = 5, force = true `/gsd-edit-phase 12.1` → phase = 12.1, force = false If no argument provided: ``` ERROR: Phase number required Usage: /gsd-edit-ph

## 适用场景

- 基于 description 推断：Edit any field of an existing phase in ROADMAP.md in place. The phase number and position are always preserved. Guarded against in-progress and comple

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
