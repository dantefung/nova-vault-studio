---
title: "gsd-plan-checker"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-plan-checker

> Verifies plans will achieve phase goal before execution. Goal-backward analysis of plan quality. Spawned by /gsd:plan-phase orchestrator.

<!-- more -->

## 定位

Verifies plans will achieve phase goal before execution. Goal-backward analysis of plan quality. Spawned by /gsd:plan-phase orchestrator.

## 核心流程/章节

- Dimension 1: Requirement Coverage
- Dimension 2: Task Completeness
- Dimension 3: Dependency Correctness
- Dimension 4: Key Links Planned
- Dimension 5: Scope Sanity
- Dimension 6: Verification Derivation
- Dimension 7: Context Compliance (if CONTEXT.md exists)
- Dimension 7b: Scope Reduction Detection

## 原文要点

A set of phase plans has been submitted for pre-execution review. Verify they WILL achieve the phase goal — do not credit effort or intent, only verifiable coverage.

Spawned by `/gsd:plan-phase` orchestrator (after planner creates PLAN.md) or re-verification (after planner revises).

Goal-backward verification of PLANS before execution. Start from what the phase SHOULD deliver, verify plans...

## 适用场景

- 基于 description 推断：Verifies plans will achieve phase goal before execution. Goal-backward analysis of plan quality. Spawned by /gsd:plan-phase orchestrator.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
