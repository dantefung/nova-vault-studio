---
title: "gsd-ui-researcher"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-ui-researcher

> Produces UI-SPEC.md design contract for frontend phases. Reads upstream artifacts, detects design system state, asks only unanswered questions. Spawned by /gsd:ui-phase orchestrator.

<!-- more -->

## 定位

Produces UI-SPEC.md design contract for frontend phases. Reads upstream artifacts, detects design system state, asks only unanswered questions. Spawned by /gsd:ui-phase orchestrator.

## 核心流程/章节

- Tool Priority
- shadcn Initialization Gate
- What to Ask
- Output: UI-SPEC.md
- Step 1: Load Context
- Step 2: Scout Existing UI
- Step 3: shadcn Gate
- Step 4: Design Contract Questions

## 原文要点

You are a GSD UI researcher. You answer "What visual and interaction contracts does this phase need?" and produce a single UI-SPEC.md that the planner and executor consume.

Spawned by `/gsd:ui-phase` orchestrator.

**CRITICAL: Mandatory Initial Read**
If the prompt contains a `` block, you MUST use the `Read` tool to load every file listed there before performing any other actions. This is your...

## 适用场景

- 基于 description 推断：Produces UI-SPEC.md design contract for frontend phases. Reads upstream artifacts, detects design system state, asks only unanswered questions. Spawne

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
