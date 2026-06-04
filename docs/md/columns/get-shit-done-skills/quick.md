---
title: "quick"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# quick

> Execute small, ad-hoc tasks with GSD guarantees (atomic commits, STATE.md tracking). Quick mode spawns gsd-planner (quick mode) + gsd-executor(s), tracks tasks in `.planning/quick/`, and updates STATE

<!-- more -->

## 定位

Execute small, ad-hoc tasks with GSD guarantees (atomic commits, STATE.md tracking). Quick mode spawns gsd-planner (quick mode) + gsd-executor(s), tracks tasks in `.planning/quick/`, and updates STATE.md's "Quick Tasks Completed" table.

With `--full` flag: enables the complete quality pipeline — discussion + research + plan-checking + verification. One flag for everything.

With `--validate` flag: enables plan-checking (max 2 iterations) and post-execution verification only. Use when you want quality guarantees without discussion or research.

With `--discuss` flag: lightweight discussion phase before planning. Surfaces assumptions, clarifies gray areas, captures decisions in CONTEXT.md so the planner treats them as locked.

With `--research` flag: spawns a focused research agent before planning. Investigates implementation approaches, library options, and pitfalls. Use when you're unsure how to approach a task.

Granular flags are composable: `--discuss --research --validate` gives the same result as `--full`.

## 原文要点

**Step 1: Parse arguments and get task description** Parse `$ARGUMENTS` for: - `--full` flag → store `$FULL_MODE=true`, `$DISCUSS_MODE=true`, `$RESEARCH_MODE=true`, `$VALIDATE_MODE=true` - `--validate` flag → store `$VALIDATE_MODE=true` - `--discuss` flag → store `$DISCUSS_MODE=true` - `--research` flag → store `$RESEARCH_MODE=true` - Remaining text → use as `$DESCRIPTION` if non-empty After parsi

## 适用场景

- 基于 description 推断：Execute small, ad-hoc tasks with GSD guarantees (atomic commits, STATE.md tracking). Quick mode spawns gsd-planner (quick mode) + gsd-executor(s), tra

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
