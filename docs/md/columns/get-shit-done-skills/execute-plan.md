---
title: "execute-plan"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# execute-plan

> Execute a phase prompt (PLAN.md) and create the outcome summary (SUMMARY.md).

<!-- more -->

## 定位

Execute a phase prompt (PLAN.md) and create the outcome summary (SUMMARY.md).

## 核心流程/章节

- init_context
- identify_plan
- record_start_time
- parse_segments
- init_agent_tracking
- segment_execution
- load_prompt
- previous_phase_check

## 原文要点

Load execution context (paths only to minimize orchestrator context): ```bash INIT=$(gsd-sdk query init.execute-phase "${PHASE}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Extract from init JSON: `executor_model`, `commit_docs`, `sub_repos`, `phase_dir`, `phase_number`, `plans`, `summaries`, `incomplete_plans`, `state_path`, `config_path`. If `.planning/` missing: erro

## 适用场景

- 基于 description 推断：Execute a phase prompt (PLAN.md) and create the outcome summary (SUMMARY.md).

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
