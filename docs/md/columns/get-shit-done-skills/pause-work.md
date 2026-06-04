---
title: "pause-work"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# pause-work

> Create structured `.planning/HANDOFF.json` and `.continue-here.md` handoff files to preserve complete work state across sessions. The JSON provides machine-readable state for `/gsd:resume-work`; the m

<!-- more -->

## 定位

Create structured `.planning/HANDOFF.json` and `.continue-here.md` handoff files to preserve complete work state across sessions. The JSON provides machine-readable state for `/gsd:resume-work`; the markdown provides human-readable context.

## 核心流程/章节

- detect
- gather
- write_structured
- write
- commit
- confirm

## 原文要点

## Context Detection Determine what kind of work is being paused and set the handoff destination accordingly: ```bash # Check for active phase phase=$(( ls -lt .planning/phases/*/PLAN.md 2>/dev/null || true ) | head -1 | grep -oP 'phases/\K[^/]+' || true) # Check for active spike spike=$(( ls -lt .planning/spikes/*/SPIKE.md .planning/spikes/*/DESIGN.md .planning/spikes/*/README.md 2>/dev/null || t

## 适用场景

- 基于 description 推断：Create structured `.planning/HANDOFF.json` and `.continue-here.md` handoff files to preserve complete work state across sessions. The JSON provides ma

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
