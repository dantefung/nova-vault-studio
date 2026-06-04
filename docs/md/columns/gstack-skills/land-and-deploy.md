---
title: "land-and-deploy"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# land-and-deploy

> Land and deploy workflow. (gstack)

<!-- more -->

## 定位

Land and deploy workflow. (gstack)

## 触发

- `merge and deploy`
- `land the pr`
- `ship to production`

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

Merges the PR, waits for CI and deploy,
verifies production health via canary checks. Takes over after /ship
creates the PR. Use when: "merge", "land", "deploy", "merge and verify",
"land it", "ship it to production".

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check 2>/dev/null || .claude/skills/gstack/bin/gstack-update-check...

## 适用场景

- 基于 description 推断：Land and deploy workflow. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
