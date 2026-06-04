---
title: "ship"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# ship

> Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR. (gstack)

<!-- more -->

## 定位

Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR. (gstack)

## 触发

- `ship it`
- `create a pr`
- `push to main`
- `deploy this`

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

Use when asked to "ship", "deploy",
"push to main", "create a PR", "merge and push", or "get it deployed".
Proactively invoke this skill (do NOT push/PR directly) when the user says code
is ready, asks about deploying, wants to push code up, or asks to create a PR.

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check 2>/dev/null ||...

## 适用场景

- 基于 description 推断：Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
