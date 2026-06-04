---
title: "code-review-fix"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# code-review-fix

> Auto-fix issues from REVIEW.md. Validates phase, checks config gate, verifies REVIEW.md exists and has fixable issues, spawns gsd-code-fixer agent, handles --auto iteration loop (capped at 3), commits

<!-- more -->

## 定位

Auto-fix issues from REVIEW.md. Validates phase, checks config gate, verifies REVIEW.md exists and has fixable issues, spawns gsd-code-fixer agent, handles --auto iteration loop (capped at 3), commits REVIEW-FIX.md once at the end, and presents results.

## 核心流程/章节

- initialize
- check_config_gate
- check_review_exists
- check_review_status
- spawn_fixer
- auto_iteration_loop
- commit_fix_report
- present_results

## 原文要点

Parse arguments and load project state: ```bash PHASE_ARG="${1}" INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse from init JSON: `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `padded_phase`, `commit_docs`. **Input sanitization (defense-in-depth):** ```bash # Validate PADDED_PHASE contains only digits and op

## 适用场景

- 基于 description 推断：Auto-fix issues from REVIEW.md. Validates phase, checks config gate, verifies REVIEW.md exists and has fixable issues, spawns gsd-code-fixer agent, ha

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
