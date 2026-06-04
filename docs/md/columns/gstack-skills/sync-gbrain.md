---
title: "sync-gbrain"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# sync-gbrain

> Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md. Wraps the gstack-gbrain-sync orchestrator with state (gstack)

<!-- more -->

## 定位

Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md. Wraps the gstack-gbrain-sync orchestrator with state (gstack)

## 触发

- `sync gbrain`
- `refresh gbrain`
- `reindex repo`
- `update gbrain`

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

probing, native code-surface registration, capability checks,
and a verdict block. Re-runnable, idempotent. Use when: "sync gbrain",
"refresh gbrain", "re-index this repo", "gbrain search isn't finding
things".

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check 2>/dev/null || .claude/skills/gstack/bin/gstack-update-check...

## 适用场景

- 基于 description 推断：Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md. Wraps the gstack-gbrain-sync orchestrator with state (gstack

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
