---
title: "spec-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# spec-phase

> Clarify WHAT a phase delivers through a Socratic interview loop with quantitative ambiguity scoring.
Produces a SPEC.md with falsifiable requirements that discuss-phase treats as locked decisions.

Th

<!-- more -->

## 定位

Clarify WHAT a phase delivers through a Socratic interview loop with quantitative ambiguity scoring.
Produces a SPEC.md with falsifiable requirements that discuss-phase treats as locked decisions.

This workflow handles "what" and "why" — discuss-phase handles "how".

## 原文要点

## Step 1: Initialize ```bash INIT=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" init phase-op "${PHASE}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse JSON for: `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`, `state_path`, `requirements_path`, `roadmap_path`, `planning_path`, `response_language`, `commit_docs`. **If 

## 适用场景

- 基于 description 推断：Clarify WHAT a phase delivers through a Socratic interview loop with quantitative ambiguity scoring.
Produces a SPEC.md with falsifiable requirements 

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
