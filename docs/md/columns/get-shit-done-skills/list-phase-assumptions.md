---
title: "list-phase-assumptions"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# list-phase-assumptions

> Surface Claude's assumptions about a phase before planning, enabling users to correct misconceptions early.

Key difference from discuss-phase: This is ANALYSIS of what Claude thinks, not INTAKE of wh

<!-- more -->

## 定位

Surface Claude's assumptions about a phase before planning, enabling users to correct misconceptions early.

Key difference from discuss-phase: This is ANALYSIS of what Claude thinks, not INTAKE of what user knows. No file output - purely conversational to prompt discussion.

## 核心流程/章节

- validate_phase
- analyze_phase
- present_assumptions
- gather_feedback
- offer_next

## 原文要点

Phase number: $ARGUMENTS (required) **If argument missing:** ``` Error: Phase number required. Usage: /gsd-list-phase-assumptions [phase-number] Example: /gsd-list-phase-assumptions 3 ``` Exit workflow. **If argument provided:** Validate phase exists in roadmap: ```bash cat .planning/ROADMAP.md | grep -i "Phase ${PHASE}" ``` **If phase not found:** ``` Error: Phase ${PHASE} not found in roadmap. A

## 适用场景

- 基于 description 推断：Surface Claude's assumptions about a phase before planning, enabling users to correct misconceptions early.

Key difference from discuss-phase: This i

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
