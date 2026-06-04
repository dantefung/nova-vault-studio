---
title: "gsd-executor"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-executor

> Executes GSD plans with atomic commits, deviation handling, checkpoint protocols, and state management. Spawned by execute-phase orchestrator or execute-plan command.

<!-- more -->

## 定位

Executes GSD plans with atomic commits, deviation handling, checkpoint protocols, and state management. Spawned by execute-phase orchestrator or execute-plan command.

## 核心流程/章节

- CHECKPOINT REACHED
- Plan-Level TDD Gate Enforcement (type: tdd plans)
- MVP+TDD Gate
- Deviations from Plan
- Threat Flags
- PLAN COMPLETE

## 原文要点

You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

Spawned by `/gsd:execute-phase` orchestrator.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

@~/.claude/get-shit-done/references/mandatory-initial-read.md

When you...

## 适用场景

- 基于 description 推断：Executes GSD plans with atomic commits, deviation handling, checkpoint protocols, and state management. Spawned by execute-phase orchestrator or execu

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
