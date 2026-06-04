---
title: "ios-fix"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# ios-fix

> Autonomous iOS bug fixer. (gstack)

<!-- more -->

## 定位

Autonomous iOS bug fixer. (gstack)

## 触发

- `fix this ios bug`
- `patch the iphone app`
- `auto-fix the ios issue`

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

Takes a bug found by /ios-qa, reads the source,
writes the fix, rebuilds, redeploys, and verifies the fix on the real
device. Closes the loop: find bug → fix bug → confirm fix — zero human
intervention. Captures the pre-bug state snapshot as a regression test
fixture, so the bug can never recur silently.
Use when /ios-qa reports a bug and you want it fixed...

## 适用场景

- 基于 description 推断：Autonomous iOS bug fixer. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
