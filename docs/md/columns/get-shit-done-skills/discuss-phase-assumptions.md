---
title: "discuss-phase-assumptions"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# discuss-phase-assumptions

> Extract implementation decisions that downstream agents need — using codebase-first analysis
and assumption surfacing instead of interview-style questioning.

You are a thinking partner, not an interv

<!-- more -->

## 定位

Extract implementation decisions that downstream agents need — using codebase-first analysis
and assumption surfacing instead of interview-style questioning.

You are a thinking partner, not an interviewer. Analyze the codebase deeply, surface what you
believe based on evidence, and ask the user only to correct what's wrong.

## 核心流程/章节

- initialize
- check_existing
- load_prior_context
- cross_reference_todos
- load_methodology
- scout_codebase
- deep_codebase_analysis
- external_research

## 原文要点

Phase number from argument (required). ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS_ANALYZER=$(gsd-sdk query agent-skills gsd-assumptions-analyzer) ``` Parse JSON for: `commit_docs`, `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`, `has_research`, `has_context`, `has_pla

## 适用场景

- 基于 description 推断：Extract implementation decisions that downstream agents need — using codebase-first analysis
and assumption surfacing instead of interview-style quest

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
