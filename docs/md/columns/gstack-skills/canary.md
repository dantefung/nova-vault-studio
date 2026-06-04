---
title: "canary"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# canary

> Post-deploy canary monitoring. (gstack)

<!-- more -->

## 定位

Post-deploy canary monitoring. (gstack)

## 触发

- `monitor after deploy`
- `canary check`
- `watch for errors post-deploy`

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

Watches the live app for console errors,
performance regressions, and page failures using the browse daemon. Takes
periodic screenshots, compares against pre-deploy baselines, and alerts
on anomalies. Use when: "monitor deploy", "canary", "post-deploy check",
"watch production", "verify deploy".

## Preamble (run...

## 适用场景

- 基于 description 推断：Post-deploy canary monitoring. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
