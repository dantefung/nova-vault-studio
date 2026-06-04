---
title: "docs-update"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# docs-update

> Generate, update, and verify all project documentation — both canonical doc types and existing hand-written docs. The orchestrator detects the project's doc structure, assembles a work manifest tracki

<!-- more -->

## 定位

Generate, update, and verify all project documentation — both canonical doc types and existing hand-written docs. The orchestrator detects the project's doc structure, assembles a work manifest tracking every item, dispatches parallel doc-writer and doc-verifier agents across waves, reviews existing docs for accuracy, identifies documentation gaps, and fixes inaccuracies via a bounded fix loop. All state is persisted in a work manifest so no work item is lost between steps. Output: Complete, structure-aware documentation verified against the live codebase.

## 核心流程/章节

- init_context
- classify_project
- build_doc_queue
- resolve_modes
- preservation_check
- dispatch_wave_1
- collect_wave_1
- dispatch_wave_2

## 原文要点

Load docs-update context: ```bash INIT=$(gsd-sdk query docs-init) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS=$(gsd-sdk query agent-skills gsd-doc-writer) ``` Extract from init JSON: - `doc_writer_model` — model string to pass to each spawned agent (never hardcode a model name) - `commit_docs` — whether to commit generated files when done - `existing_docs` — arr

## 适用场景

- 基于 description 推断：Generate, update, and verify all project documentation — both canonical doc types and existing hand-written docs. The orchestrator detects the project

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
