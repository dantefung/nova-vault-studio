---
title: "map-codebase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# map-codebase

> Orchestrate parallel codebase mapper agents to analyze codebase and produce structured documents in .planning/codebase/

Each agent has fresh context, explores a specific focus area, and **writes docu

<!-- more -->

## 定位

Orchestrate parallel codebase mapper agents to analyze codebase and produce structured documents in .planning/codebase/

Each agent has fresh context, explores a specific focus area, and **writes documents directly**. The orchestrator only receives confirmation + line counts, then writes a summary.

Output: .planning/codebase/ folder with 7 structured documents about the codebase state.

## 核心流程/章节

- parse_paths_flag
- init_context
- check_existing
- create_structure
- detect_runtime_capabilities
- spawn_agents
- collect_confirmations
- sequential_mapping

## 原文要点

Parse an optional `--paths ` argument. When supplied (by the post-execute codebase-drift gate in `/gsd:execute-phase` or by a user running `/gsd:map-codebase --paths apps/accounting,packages/ui`), the workflow operates in **incremental-remap mode**: - Pass `--paths ,,...` through to each spawned `gsd-codebase-mapper` agent's prompt. Agents scope their Glob/Grep/Bash exploration to the listed repo-

## 适用场景

- 基于 description 推断：Orchestrate parallel codebase mapper agents to analyze codebase and produce structured documents in .planning/codebase/

Each agent has fresh context,

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
