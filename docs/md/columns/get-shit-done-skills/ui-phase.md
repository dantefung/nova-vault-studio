---
title: "ui-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# ui-phase

> Generate a UI design contract (UI-SPEC.md) for frontend phases. Orchestrates gsd-ui-researcher and gsd-ui-checker with a revision loop. Inserts between discuss-phase and plan-phase in the lifecycle.



<!-- more -->

## 定位

Generate a UI design contract (UI-SPEC.md) for frontend phases. Orchestrates gsd-ui-researcher and gsd-ui-checker with a revision loop. Inserts between discuss-phase and plan-phase in the lifecycle.

UI-SPEC.md locks spacing, typography, color, copywriting, and design system decisions before the planner creates tasks. This prevents design debt caused by ad-hoc styling decisions during execution.

## 原文要点

## 1. Initialize ```bash INIT=$(gsd-sdk query init.plan-phase "$PHASE") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS_UI=$(gsd-sdk query agent-skills gsd-ui-researcher) AGENT_SKILLS_UI_CHECKER=$(gsd-sdk query agent-skills gsd-ui-checker) ``` Parse JSON for: `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`, `has_context`, `has_research`, `com

## 适用场景

- 基于 description 推断：Generate a UI design contract (UI-SPEC.md) for frontend phases. Orchestrates gsd-ui-researcher and gsd-ui-checker with a revision loop. Inserts betwee

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
