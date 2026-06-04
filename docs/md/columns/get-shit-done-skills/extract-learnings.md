---
title: "extract-learnings"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# extract-learnings

> Extract decisions, lessons learned, patterns discovered, and surprises encountered from completed phase artifacts into a structured LEARNINGS.md file. Captures institutional knowledge that would other

<!-- more -->

## 定位

Extract decisions, lessons learned, patterns discovered, and surprises encountered from completed phase artifacts into a structured LEARNINGS.md file. Captures institutional knowledge that would otherwise be lost between phases.

## 核心流程/章节

- initialize
- collect_artifacts
- extract-learnings
- capture_thought_integration
- write_learnings
- update_state
- report

## 原文要点

Parse arguments and load project state: ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse from init JSON: `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `padded_phase`. If phase not found, exit with error: "Phase {PHASE_ARG} not found." Read the phase artifacts. PLAN.md and SUMMARY.md are required; VER

## 适用场景

- 基于 description 推断：Extract decisions, lessons learned, patterns discovered, and surprises encountered from completed phase artifacts into a structured LEARNINGS.md file.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
