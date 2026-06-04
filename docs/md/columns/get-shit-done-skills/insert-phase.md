---
title: "insert-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# insert-phase

> Insert a decimal phase for urgent work discovered mid-milestone between existing integer phases. Uses decimal numbering (72.1, 72.2, etc.) to preserve the logical sequence of planned phases while acco

<!-- more -->

## 定位

Insert a decimal phase for urgent work discovered mid-milestone between existing integer phases. Uses decimal numbering (72.1, 72.2, etc.) to preserve the logical sequence of planned phases while accommodating urgent insertions without renumbering the entire roadmap.

## 核心流程/章节

- parse_arguments
- init_context
- insert_phase
- update_project_state
- completion

## 原文要点

Parse the command arguments: - First argument: integer phase number to insert after - Remaining arguments: phase description Example: `/gsd:phase --insert 72 Fix critical auth bug` -> after = 72 -> description = "Fix critical auth bug" If arguments missing: ``` ERROR: Both phase number and description required Usage: /gsd:phase --insert Example: /gsd:phase --insert 72 Fix critical auth bug ``` Exi

## 适用场景

- 基于 description 推断：Insert a decimal phase for urgent work discovered mid-milestone between existing integer phases. Uses decimal numbering (72.1, 72.2, etc.) to preserve

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
