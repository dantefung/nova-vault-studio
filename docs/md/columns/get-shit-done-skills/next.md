---
title: "next"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# next

> Detect current project state and automatically advance to the next logical GSD workflow step.
Reads project state to determine: discuss → plan → execute → verify → complete progression.

<!-- more -->

## 定位

Detect current project state and automatically advance to the next logical GSD workflow step.
Reads project state to determine: discuss → plan → execute → verify → complete progression.

## 核心流程/章节

- detect_state
- safety_gates
- spike_sketch_notice
- determine_next_action
- show_and_execute

## 原文要点

Read project state to determine current position: ```bash # Get state snapshot gsd-sdk query state.json 2>/dev/null || echo "{}" ``` Also read: - `.planning/STATE.md` — current phase, progress, plan counts - `.planning/ROADMAP.md` — milestone structure and phase list Extract: - `current_phase` — which phase is active - `plan_of` / `plans_total` — plan execution progress - `progress` — overall perc

## 适用场景

- 基于 description 推断：Detect current project state and automatically advance to the next logical GSD workflow step.
Reads project state to determine: discuss → plan → execu

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
