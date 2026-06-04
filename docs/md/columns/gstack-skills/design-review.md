---
title: "design-review"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# design-review

> Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interactions — then fixes them. (gstack)

<!-- more -->

## 定位

Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interactions — then fixes them. (gstack)

## 触发

- `visual design audit`
- `design qa`
- `fix design issues`

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

Iteratively fixes issues
in source code, committing each fix atomically and re-verifying with before/after
screenshots. For plan-mode design review (before implementation), use /plan-design-review.
Use when asked to "audit the design", "visual QA", "check if it looks good", or "design polish".
Proactively suggest when the user mentions visual inconsistencies or
wants...

## 适用场景

- 基于 description 推断：Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interactions — then fixes them. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
