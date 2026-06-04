---
title: "add-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# add-phase

> Add a new integer phase to the end of the current milestone in the roadmap. Automatically calculates next phase number, creates phase directory, and updates roadmap structure.

<!-- more -->

## 定位

Add a new integer phase to the end of the current milestone in the roadmap. Automatically calculates next phase number, creates phase directory, and updates roadmap structure.

## 核心流程/章节

- parse_arguments
- init_context
- add_phase
- update_project_state
- completion

## 原文要点

Parse the command arguments: - All arguments become the phase description - Example: `/gsd-add-phase Add authentication` → description = "Add authentication" - Example: `/gsd-add-phase Fix critical performance issues` → description = "Fix critical performance issues" If no arguments provided: ``` ERROR: Phase description required Usage: /gsd-add-phase Example: /gsd-add-phase Add authentication sys

## 适用场景

- 基于 description 推断：Add a new integer phase to the end of the current milestone in the roadmap. Automatically calculates next phase number, creates phase directory, and u

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
