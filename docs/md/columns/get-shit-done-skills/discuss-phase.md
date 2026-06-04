---
title: "discuss-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# discuss-phase

> Extract implementation decisions that downstream agents need. Analyze the phase to identify gray areas, let the user choose what to discuss, then deep-dive each selected area until satisfied.

You are

<!-- more -->

## 定位

Extract implementation decisions that downstream agents need. Analyze the phase to identify gray areas, let the user choose what to discuss, then deep-dive each selected area until satisfied.

You are a thinking partner, not an interviewer. The user is the visionary — you are the builder. Your job is to capture decisions that will guide research and planning, not to figure out implementation yourself.

## 核心流程/章节

- initialize
- check_blocking_antipatterns
- check_spec
- check_existing
- load_prior_context
- cross_reference_todos
- scout_codebase
- analyze_phase

## 原文要点

**Express path available:** If you already have a PRD or acceptance criteria document, use `/gsd:plan-phase {phase} --prd path/to/prd.md` to skip this discussion and go straight to planning. Phase number from argument (required). ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS_ADVISOR=$(gsd-sdk query agent-skill

## 适用场景

- 基于 description 推断：Extract implementation decisions that downstream agents need. Analyze the phase to identify gray areas, let the user choose what to discuss, then deep

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
