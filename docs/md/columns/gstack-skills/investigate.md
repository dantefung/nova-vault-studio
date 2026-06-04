---
title: "investigate"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# investigate

> Systematic debugging with root cause investigation. (gstack)

<!-- more -->

## 定位

Systematic debugging with root cause investigation. (gstack)

## 触发

- `debug this`
- `fix this bug`
- `why is this broken`
- `root cause analysis`
- `investigate this error`

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

Four phases: investigate,
analyze, hypothesize, implement. Iron Law: no fixes without root cause.
Use when asked to "debug this", "fix this bug", "why is this broken",
"investigate this error", or "root cause analysis".
Proactively invoke this skill (do NOT debug directly) when the user reports
errors, 500 errors, stack traces, unexpected behavior, "it was...

## 适用场景

- 基于 description 推断：Systematic debugging with root cause investigation. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
