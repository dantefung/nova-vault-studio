---
title: "skillify"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# skillify

> Codify the most recent successful /scrape flow into a permanent browser-skill on disk. (gstack)

<!-- more -->

## 定位

Codify the most recent successful /scrape flow into a permanent browser-skill on disk. (gstack)

## 触发

- `skillify`
- `codify this scrape`
- `save this scrape`
- `make this permanent`

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

Future /scrape calls with the same intent run
the codified script in ~200ms instead of re-driving the page. Walks
back through the conversation, synthesizes script.ts + script.test.ts
+ fixture, runs the test in a temp dir, and asks before committing.
Use when asked to "skillify", "codify", "save this scrape", or
"make this permanent".

## Preamble (run...

## 适用场景

- 基于 description 推断：Codify the most recent successful /scrape flow into a permanent browser-skill on disk. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
