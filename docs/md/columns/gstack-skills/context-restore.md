---
title: "context-restore"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# context-restore

> Restore working context saved earlier by /context-save. (gstack)

<!-- more -->

## 定位

Restore working context saved earlier by /context-save. (gstack)

## 触发

- `resume where i left off`
- `restore context`
- `where was i`
- `pick up where i left off`
- `context restore`

## 核心流程/章节

- When to invoke this skill
- Preamble (run first)
- Plan Mode Safe Operations
- Skill Invocation During Plan Mode
- Skill routing
- AskUserQuestion Format
- Artifacts Sync (skill start)
- Model-Specific Behavioral Patch (claude)

## 原文要点

## When to invoke this skill

Loads the most recent
saved state (across all branches by default) so you can pick up where you
left off — even across Conductor workspace handoffs.
Use when asked to "resume", "restore context", "where was I", or
"pick up where I left off". Pair with /context-save.
Formerly /checkpoint resume — renamed because Claude Code treats /checkpoint
as a native rewind alias...

## 适用场景

- 基于 description 推断：Restore working context saved earlier by /context-save. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
