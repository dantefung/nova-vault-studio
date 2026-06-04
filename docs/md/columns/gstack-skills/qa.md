---
title: "qa"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# qa

> Systematically QA test a web application and fix bugs found. (gstack)

<!-- more -->

## 定位

Systematically QA test a web application and fix bugs found. (gstack)

## 触发

- `qa test this`
- `find bugs on site`
- `test the site`

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

Runs QA testing,
then iteratively fixes bugs in source code, committing each fix atomically and
re-verifying. Use when asked to "qa", "QA", "test this site", "find bugs",
"test and fix", or "fix what's broken".
Proactively suggest when the user says a feature is ready for testing
or asks "does this work?". Three tiers: Quick (critical/high only),
Standard (+ medium),...

## 适用场景

- 基于 description 推断：Systematically QA test a web application and fix bugs found. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
