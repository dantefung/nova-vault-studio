---
title: "new-milestone"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# new-milestone

> Start a new milestone cycle for an existing project. Loads project context, gathers milestone goals (from MILESTONE-CONTEXT.md or conversation), updates PROJECT.md and STATE.md, optionally runs parall

<!-- more -->

## 定位

Start a new milestone cycle for an existing project. Loads project context, gathers milestone goals (from MILESTONE-CONTEXT.md or conversation), updates PROJECT.md and STATE.md, optionally runs parallel research, defines scoped requirements with REQ-IDs, spawns the roadmapper to create phased execution plan, and commits all artifacts. Brownfield equivalent of new-project.

## 原文要点

## 1. Load Context Parse `$ARGUMENTS` before doing anything else: - `--reset-phase-numbers` flag → opt into restarting roadmap phase numbering at `1` - remaining text → use as milestone name if present If the flag is absent, keep the current behavior of continuing phase numbering from the previous milestone. - Read PROJECT.md (existing project, validated requirements, decisions) - Read MILESTONES.

## 适用场景

- 基于 description 推断：Start a new milestone cycle for an existing project. Loads project context, gathers milestone goals (from MILESTONE-CONTEXT.md or conversation), updat

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
