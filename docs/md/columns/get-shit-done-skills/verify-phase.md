---
title: "verify-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# verify-phase

> Verify phase goal achievement through goal-backward analysis. Check that the codebase delivers what the phase promised, not just that tasks completed.

Executed by a verification subagent spawned from

<!-- more -->

## 定位

Verify phase goal achievement through goal-backward analysis. Check that the codebase delivers what the phase promised, not just that tasks completed.

Executed by a verification subagent spawned from execute-phase.md.

## 核心流程/章节

- load_context
- establish_must_haves
- verify_truths
- verify_artifacts
- verify_wiring
- verify_requirements
- verify_decisions
- behavioral_verification

## 原文要点

Load phase operation context: ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Extract from init JSON: `phase_dir`, `phase_number`, `phase_name`, `has_plans`, `plan_count`. Then load phase details and list plans/summaries: ```bash gsd-sdk query roadmap.get-phase "${phase_number}" grep -E "^| ${phase_number}" .planning

## 适用场景

- 基于 description 推断：Verify phase goal achievement through goal-backward analysis. Check that the codebase delivers what the phase promised, not just that tasks completed.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
