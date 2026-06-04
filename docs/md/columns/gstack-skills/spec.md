---
title: "spec"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# spec

> Turn vague intent into a precise, executable spec in five phases. (gstack)

<!-- more -->

## 定位

Turn vague intent into a precise, executable spec in five phases. (gstack)

## 触发

- `spec this out`
- `file an issue`
- `write up a ticket`
- `turn this into an issue`
- `make this a github issue`
- `turn this into a backlog item`

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

Files the issue,
optionally spawns a Claude Code agent in a fresh worktree, and lets /ship close
the source issue on merge. Use when asked to "spec this out", "file an issue",
"write up a ticket", "make this a GitHub issue", or "turn this into a backlog item".

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check 2>/dev/null ||...

## 适用场景

- 基于 description 推断：Turn vague intent into a precise, executable spec in five phases. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
