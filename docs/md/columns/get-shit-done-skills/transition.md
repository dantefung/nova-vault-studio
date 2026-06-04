---
title: "transition"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# transition

> Mark current phase complete and advance to next. This is the natural point where progress tracking and PROJECT.md evolution happen.

"Planning next phase" = "current phase is done"

<!-- more -->

## 定位

Mark current phase complete and advance to next. This is the natural point where progress tracking and PROJECT.md evolution happen.

"Planning next phase" = "current phase is done"

## 核心流程/章节

- load_project_state
- verify_completion
- cleanup_handoff
- update_roadmap_and_state
- archive_prompts
- evolve_project
- graduation_scan
- update_current_position_after_transition

## 原文要点

Before transition, read project state: ```bash cat .planning/STATE.md 2>/dev/null || true cat .planning/PROJECT.md 2>/dev/null || true ``` Parse current position to verify we're transitioning the right phase. Note accumulated context that may need updating after transition. Check current phase has all plan summaries: ```bash (ls .planning/phases/XX-current/*-PLAN.md 2>/dev/null || true) | sort (ls

## 适用场景

- 基于 description 推断：Mark current phase complete and advance to next. This is the natural point where progress tracking and PROJECT.md evolution happen.

"Planning next ph

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
