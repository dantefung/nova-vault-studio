---
title: "pair-agent"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# pair-agent

> Pair a remote AI agent with your browser. (gstack)

<!-- more -->

## 定位

Pair a remote AI agent with your browser. (gstack)

## 触发

- `pair with agent`
- `connect remote agent`
- `share my browser`

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

One command generates a setup key and
prints instructions the other agent can follow to connect. Works with OpenClaw,
Hermes, Codex, Cursor, or any agent that can make HTTP requests. The remote agent
gets its own tab with scoped access (read+write by default, admin on request).
Use when asked to "pair agent", "connect agent", "share browser", "remote browser",
"let...

## 适用场景

- 基于 description 推断：Pair a remote AI agent with your browser. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
