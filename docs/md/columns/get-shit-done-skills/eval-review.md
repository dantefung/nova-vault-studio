---
title: "eval-review"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# eval-review

> Retroactive audit of an implemented AI phase's evaluation coverage. Standalone command that works on any GSD-managed AI phase. Produces a scored EVAL-REVIEW.md with gap analysis and remediation plan.


<!-- more -->

## 定位

Retroactive audit of an implemented AI phase's evaluation coverage. Standalone command that works on any GSD-managed AI phase. Produces a scored EVAL-REVIEW.md with gap analysis and remediation plan.

Use after /gsd:execute-phase to verify that the evaluation strategy from AI-SPEC.md was actually implemented. Mirrors the pattern of /gsd:ui-review and /gsd:validate-phase.

## 原文要点

## 0. Initialize ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse: `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`, `commit_docs`. ```bash AUDITOR_MODEL=$(gsd-sdk query resolve-model gsd-eval-auditor 2>/dev/null | jq -r '.model' 2>/dev/null || true) ``` Display banner: ``` ━━━━━━━━━━━━━━━

## 适用场景

- 基于 description 推断：Retroactive audit of an implemented AI phase's evaluation coverage. Standalone command that works on any GSD-managed AI phase. Produces a scored EVAL-

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
