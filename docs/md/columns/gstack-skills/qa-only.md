---
title: "qa-only"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# qa-only

> Report-only QA testing. (gstack)

<!-- more -->

## 定位

Report-only QA testing. (gstack)

## 触发

- `qa report only`
- `just report bugs`
- `test but dont fix`

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

Systematically tests a web application and produces a
structured report with health score, screenshots, and repro steps — but never
fixes anything. Use when asked to "just report bugs", "qa report only", or
"test but don't fix". For the full test-fix-verify loop, use /qa instead.
Proactively suggest when the user wants a bug report without any code changes.

Voice...

## 适用场景

- 基于 description 推断：Report-only QA testing. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
