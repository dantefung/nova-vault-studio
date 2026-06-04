---
title: "design-shotgun"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# design-shotgun

> Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate. (gstack)

<!-- more -->

## 定位

Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate. (gstack)

## 触发

- `explore design variants`
- `show me design options`
- `visual design brainstorm`

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

Standalone design exploration you can
run anytime. Use when: "explore designs", "show me options", "design variants",
"visual brainstorm", or "I don't like how this looks".
Proactively suggest when the user describes a UI feature but hasn't seen
what it could look like.

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check...

## 适用场景

- 基于 description 推断：Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
