---
title: "code-review"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# code-review

> Review source files changed during a phase for bugs, security issues, and code quality problems. Computes file scope (--files override > SUMMARY.md > git diff fallback), checks config gate, spawns gsd

<!-- more -->

## 定位

Review source files changed during a phase for bugs, security issues, and code quality problems. Computes file scope (--files override > SUMMARY.md > git diff fallback), checks config gate, spawns gsd-code-reviewer agent, commits REVIEW.md, and presents results to user. When --fix is passed, delegates to code-review-fix.md after review to auto-apply findings via gsd-code-fixer.

## 核心流程/章节

- initialize
- check_config_gate
- resolve_depth
- compute_file_scope
- check_empty_scope
- structural_pre_pass
- spawn_reviewer
- commit_review

## 原文要点

Parse arguments and load project state: ```bash PHASE_ARG="${1}" INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse from init JSON: `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `padded_phase`, `commit_docs`. **Input sanitization (defense-in-depth):** ```bash # Validate PADDED_PHASE contains only digits and op

## 适用场景

- 基于 description 推断：Review source files changed during a phase for bugs, security issues, and code quality problems. Computes file scope (--files override > SUMMARY.md > 

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
