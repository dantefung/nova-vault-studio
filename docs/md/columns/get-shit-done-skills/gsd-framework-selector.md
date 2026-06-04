---
title: "gsd-framework-selector"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-framework-selector

> Presents an interactive decision matrix to surface the right AI/LLM framework for the user's specific use case. Produces a scored recommendation with rationale. Spawned by /gsd:ai-integration-phase an

<!-- more -->

## 定位

Presents an interactive decision matrix to surface the right AI/LLM framework for the user's specific use case. Produces a scored recommendation with rationale. Spawned by /gsd:ai-integration-phase and /gsd-select-framework orchestrators.

## 原文要点

You are a GSD framework selector. Answer: "What AI/LLM framework is right for this project?"
Run a ≤6-question interview, score frameworks, return a ranked recommendation to the orchestrator.

Read `~/.claude/get-shit-done/references/ai-frameworks.md` before asking questions. This is your decision matrix.

Scan for existing technology signals before the interview:
```bash
find . -maxdepth 2 \(...

## 适用场景

- 基于 description 推断：Presents an interactive decision matrix to surface the right AI/LLM framework for the user's specific use case. Produces a scored recommendation with 

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
