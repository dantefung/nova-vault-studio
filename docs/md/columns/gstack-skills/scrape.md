---
title: "scrape"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# scrape

> Pull data from a web page. (gstack)

<!-- more -->

## 定位

Pull data from a web page. (gstack)

## 触发

- `scrape this page`
- `get data from`
- `pull from`
- `extract from`
- `what is on`

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

First call on a new intent prototypes the flow
via $B primitives and returns JSON. Subsequent calls on a matching intent
route to a codified browser-skill and return in ~200ms. Read-only — for
mutating flows (form fills, clicks, submissions), use /automate.
Use when asked to "scrape", "get data from", "pull", "extract from", or
"what's on" a page.

## Preamble (run...

## 适用场景

- 基于 description 推断：Pull data from a web page. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
