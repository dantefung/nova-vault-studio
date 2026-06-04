---
title: "autonomous"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# autonomous

> Drive milestone phases autonomously — all remaining phases, a range via `--from N`/`--to N`, or a single phase via `--only N`. For each incomplete phase: discuss → plan → execute using Skill() flat in

<!-- more -->

## 定位

Drive milestone phases autonomously — all remaining phases, a range via `--from N`/`--to N`, or a single phase via `--only N`. For each incomplete phase: discuss → plan → execute using Skill() flat invocations. Pauses only for explicit user decisions (grey area acceptance, blockers, validation requests). Re-reads ROADMAP.md after each phase to catch dynamically inserted phases.

## 核心流程/章节

- initialize
- discover_phases
- execute_phase
- smart_discuss
- iterate
- lifecycle
- handle_blocker

## 原文要点

## 1. Initialize Parse `$ARGUMENTS` for `--from N`, `--to N`, `--only N`, and `--interactive` flags: ```bash FROM_PHASE="" if echo "$ARGUMENTS" | grep -qE '\-\-from\s+[0-9]'; then FROM_PHASE=$(echo "$ARGUMENTS" | grep -oE '\-\-from\s+[0-9]+\.?[0-9]*' | awk '{print $2}') fi TO_PHASE="" if echo "$ARGUMENTS" | grep -qE '\-\-to\s+[0-9]'; then TO_PHASE=$(echo "$ARGUMENTS" | grep -oE '\-\-to\s+[0-9]+\.?

## 适用场景

- 基于 description 推断：Drive milestone phases autonomously — all remaining phases, a range via `--from N`/`--to N`, or a single phase via `--only N`. For each incomplete pha

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
