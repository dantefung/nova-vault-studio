---
title: "execute-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# execute-phase

> Execute all plans in a phase using wave-based parallel execution. Orchestrator stays lean — delegates plan execution to subagents.

<!-- more -->

## 定位

Execute all plans in a phase using wave-based parallel execution. Orchestrator stays lean — delegates plan execution to subagents.

## 核心流程/章节

- parse_args
- initialize
- safe_resume_gate
- check_blocking_antipatterns
- check_interactive_mode
- handle_branching
- validate_phase
- discover_and_group_plans

## 原文要点

Parse `$ARGUMENTS` before loading any context: - First positional token → `PHASE_ARG` - Optional `--wave N` → `WAVE_FILTER` - Optional `--gaps-only` keeps its current meaning - Optional `--cross-ai` → `CROSS_AI_FORCE=true` (force all plans through cross-AI execution) - Optional `--no-cross-ai` → `CROSS_AI_DISABLED=true` (disable cross-AI for this run, overrides config and frontmatter) If `--wave` 

## 适用场景

- 基于 description 推断：Execute all plans in a phase using wave-based parallel execution. Orchestrator stays lean — delegates plan execution to subagents.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
