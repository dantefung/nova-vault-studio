---
title: "autoplan"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# autoplan

> Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with auto-decisions using 6 decision principles. (gstack)

<!-- more -->

## 定位

Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with auto-decisions using 6 decision principles. (gstack)

## 触发

- `run all reviews`
- `automatic review pipeline`
- `auto plan review`

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

Surfaces
taste decisions (close approaches, borderline scope, codex disagreements) at a final
approval gate. One command, fully reviewed plan out.
Use when asked to "auto review", "autoplan", "run all reviews", "review this plan
automatically", or "make the decisions for me".
Proactively suggest when the user has a plan file and wants to run the full review
gauntlet...

## 适用场景

- 基于 description 推断：Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with auto-decisions using 6 decision

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
