---
title: "context-save"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# context-save

> Save working context. (gstack)

<!-- more -->

## 定位

Save working context. (gstack)

## 触发

- `save progress`
- `save state`
- `save my work`
- `context save`

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

Captures git state, decisions made, and remaining work
so any future session can pick up without losing a beat.
Use when asked to "save progress", "save state", "context save", or
"save my work". Pair with /context-restore to resume later.
Formerly /checkpoint — renamed because Claude Code treats /checkpoint as a
native rewind alias in current environments, which was...

## 适用场景

- 基于 description 推断：Save working context. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
