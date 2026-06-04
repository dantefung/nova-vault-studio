---
title: "undo"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# undo

> Safe git revert workflow. Rolls back GSD phase or plan commits using the phase manifest with dependency checks and a confirmation gate. Uses git revert --no-commit (NEVER git reset) to preserve histor

<!-- more -->

## 定位

Safe git revert workflow. Rolls back GSD phase or plan commits using the phase manifest with dependency checks and a confirmation gate. Uses git revert --no-commit (NEVER git reset) to preserve history.

## 核心流程/章节

- banner
- parse_arguments
- gather_commits
- dependency_check
- confirm_revert
- execute_revert
- summary

## 原文要点

Display the stage banner: ``` ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ GSD ► UNDO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ``` Parse $ARGUMENTS for the undo mode: - `--last N` → MODE=last, COUNT=N (integer, default 10 if N missing) - `--phase NN` → MODE=phase, TARGET_PHASE=NN (two-digit phase number) - `--plan NN-MM` → MODE=plan, TARGET_PLAN=NN-MM (phase-plan ID) If no va

## 适用场景

- 基于 description 推断：Safe git revert workflow. Rolls back GSD phase or plan commits using the phase manifest with dependency checks and a confirmation gate. Uses git rever

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
