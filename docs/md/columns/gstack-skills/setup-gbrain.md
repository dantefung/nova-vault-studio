---
title: "setup-gbrain"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# setup-gbrain

> Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, capture per-remote trust policy. (gstack)

<!-- more -->

## 定位

Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, capture per-remote trust policy. (gstack)

## 触发

- `setup gbrain`
- `install gbrain`
- `connect gbrain`
- `start gbrain`
- `configure gbrain`

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

One command from zero to "gbrain is running, and this agent
can call it." Use when: "setup gbrain", "connect gbrain", "start
gbrain", "install gbrain", "configure gbrain for this machine".

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check 2>/dev/null || .claude/skills/gstack/bin/gstack-update-check 2>/dev/null || true)
[ -n...

## 适用场景

- 基于 description 推断：Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, capture per-remote trust policy. (gst

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
