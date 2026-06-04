---
title: "health"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# health

> Code quality dashboard. (gstack)

<!-- more -->

## 定位

Code quality dashboard. (gstack)

## 触发

- `code health check`
- `quality dashboard`
- `how healthy is codebase`

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

Wraps existing project tools (type checker, linter,
test runner, dead code detector, shell linter), computes a weighted composite
0-10 score, and tracks trends over time. Use when: "health check",
"code quality", "how healthy is the codebase", "run all checks",
"quality score".

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check...

## 适用场景

- 基于 description 推断：Code quality dashboard. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
