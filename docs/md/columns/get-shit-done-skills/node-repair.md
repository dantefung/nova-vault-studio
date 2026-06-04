---
title: "node-repair"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# node-repair

> Autonomous repair operator for failed task verification. Invoked by execute-plan when a task fails its done-criteria. Proposes and attempts structured fixes before escalating to the user.

<!-- more -->

## 定位

Autonomous repair operator for failed task verification. Invoked by execute-plan when a task fails its done-criteria. Proposes and attempts structured fixes before escalating to the user.

## 核心流程/章节

- diagnose
- execute_retry
- execute_decompose
- execute_prune
- execute_escalate

## 原文要点

Read the error and done-criteria carefully. Ask: 1. Is this a transient/environmental issue? → RETRY 2. Is the task verifiably too broad? → DECOMPOSE 3. Is a prerequisite genuinely missing and unfixable in scope? → PRUNE 4. Has RETRY already been attempted with this task? Check REPAIR_BUDGET. If 0 → ESCALATE If RETRY: 1. Apply the specific adjustment stated in the directive 2. Re-run the task impl

## 适用场景

- 基于 description 推断：Autonomous repair operator for failed task verification. Invoked by execute-plan when a task fails its done-criteria. Proposes and attempts structured

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
