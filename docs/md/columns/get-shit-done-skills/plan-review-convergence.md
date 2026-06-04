---
title: "plan-review-convergence"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# plan-review-convergence

> Cross-AI plan convergence loop — automates the manual chain:
gsd-plan-phase N → gsd-review N --codex → gsd-plan-phase N --reviews → gsd-review N --codex → ...
Each step runs inside an isolated Agent t

<!-- more -->

## 定位

Cross-AI plan convergence loop — automates the manual chain:
gsd-plan-phase N → gsd-review N --codex → gsd-plan-phase N --reviews → gsd-review N --codex → ...
Each step runs inside an isolated Agent that calls the corresponding Skill.
Orchestrator only does: init, loop control, parse CYCLE_SUMMARY for HIGH count, stall detection, escalation.

## 原文要点

## 1. Parse and Normalize Arguments Extract from $ARGUMENTS: phase number, reviewer flags (`--codex`, `--gemini`, `--claude`, `--opencode`, `--ollama`, `--lm-studio`, `--llama-cpp`, `--all`), `--max-cycles N`, `--text`, `--ws`. ```bash PHASE=$(echo "$ARGUMENTS" | grep -oE '[0-9]+\.?[0-9]*' | head -1) REVIEWER_FLAGS="" echo "$ARGUMENTS" | grep -q '\-\-codex' && REVIEWER_FLAGS="$REVIEWER_FLAGS --cod

## 适用场景

- 基于 description 推断：Cross-AI plan convergence loop — automates the manual chain:
gsd-plan-phase N → gsd-review N --codex → gsd-plan-phase N --reviews → gsd-review N --cod

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
