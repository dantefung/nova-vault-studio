---
title: "review"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# review

> Pre-landing PR review. (gstack)

<!-- more -->

## 定位

Pre-landing PR review. (gstack)

## 触发

- `review this pr`
- `code review`
- `check my diff`
- `pre-landing review`

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

Analyzes diff against the base branch for SQL safety, LLM trust
boundary violations, conditional side effects, and other structural issues. Use when
asked to "review this PR", "code review", "pre-landing review", or "check my diff".
Proactively suggest when the user is about to merge or land code changes.

## Preamble (run...

## 适用场景

- 基于 description 推断：Pre-landing PR review. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
