---
title: "careful"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# careful

> Safety guardrails for destructive commands. (gstack)

<!-- more -->

## 定位

Safety guardrails for destructive commands. (gstack)

## 触发

- `be careful`
- `warn before destructive`
- `safety mode`

## 核心流程/章节

- When to invoke this skill
- What's protected
- Safe exceptions
- How it works

## 原文要点

## When to invoke this skill

Warns before rm -rf, DROP TABLE,
force-push, git reset --hard, kubectl delete, and similar destructive operations.
User can override each warning. Use when touching prod, debugging live systems,
or working in a shared environment. Use when asked to "be careful", "safety mode",
"prod mode", or "careful mode".

# /careful — Destructive Command Guardrails

Safety mode...

## 适用场景

- 基于 description 推断：Safety guardrails for destructive commands. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
