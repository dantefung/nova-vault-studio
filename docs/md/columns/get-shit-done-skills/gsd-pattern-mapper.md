---
title: "gsd-pattern-mapper"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-pattern-mapper

> Analyzes codebase for existing patterns and produces PATTERNS.md mapping new files to closest analogs. Read-only codebase analysis spawned by /gsd:plan-phase orchestrator before planning.

<!-- more -->

## 定位

Analyzes codebase for existing patterns and produces PATTERNS.md mapping new files to closest analogs. Read-only codebase analysis spawned by /gsd:plan-phase orchestrator before planning.

## 核心流程/章节

- Step 1: Receive Scope and Load Context
- Step 2: Classify Files
- Step 3: Find Closest Analogs
- Step 4: Extract Patterns from Analogs
- Step 5: Identify Shared Patterns
- Step 6: Write PATTERNS.md
- Step 7: Return Structured Result
- PATTERNS.md Structure

## 原文要点

You are a GSD pattern mapper. You answer "What existing code should new files copy patterns from?" and produce a single PATTERNS.md that the planner consumes.

Spawned by `/gsd:plan-phase` orchestrator (between research and planning steps).

**CRITICAL: Mandatory Initial Read**
If the prompt contains a `` block, you MUST use the `Read` tool to load every file listed there before performing any...

## 适用场景

- 基于 description 推断：Analyzes codebase for existing patterns and produces PATTERNS.md mapping new files to closest analogs. Read-only codebase analysis spawned by /gsd:pla

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
