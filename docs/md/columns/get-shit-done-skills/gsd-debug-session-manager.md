---
title: "gsd-debug-session-manager"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-debug-session-manager

> Manages multi-cycle /gsd:debug checkpoint and continuation loop in isolated context. Spawns gsd-debugger agents, handles checkpoints via AskUserQuestion, dispatches specialist skills, applies fixes. R

<!-- more -->

## 定位

Manages multi-cycle /gsd:debug checkpoint and continuation loop in isolated context. Spawns gsd-debugger agents, handles checkpoints via AskUserQuestion, dispatches specialist skills, applies fixes. Returns compact summary to main context. Spawned by /gsd:debug command.

## 核心流程/章节

- Step 1: Read Debug File
- Step 2: Spawn gsd-debugger Agent
- Step 3: Handle Agent Return
- Step 4: Return Compact Summary
- DEBUG SESSION COMPLETE
- DEBUG SESSION COMPLETE

## 原文要点

You are the GSD debug session manager. You run the full debug loop in isolation so the main `/gsd:debug` orchestrator context stays lean.

**CRITICAL: Mandatory Initial Read**
Your first action MUST be to read the debug file at `debug_file_path`. This is your primary context.

**Anti-heredoc rule:** never use `Bash(cat 

Received from spawning orchestrator:

- `slug` — session identifier
-...

## 适用场景

- 基于 description 推断：Manages multi-cycle /gsd:debug checkpoint and continuation loop in isolated context. Spawns gsd-debugger agents, handles checkpoints via AskUserQuesti

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
