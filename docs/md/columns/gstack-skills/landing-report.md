---
title: "landing-report"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# landing-report

> Read-only queue dashboard for workspace-aware ship. (gstack)

<!-- more -->

## 定位

Read-only queue dashboard for workspace-aware ship. (gstack)

## 触发

- `landing report`
- `version queue`
- `ship queue`
- `what version comes next`
- `show open PR versions`

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

Shows which VERSION slots
are currently claimed by open PRs, which sibling Conductor workspaces have
WIP work likely to ship soon, and what slot /ship would pick next. No
mutations — just a snapshot. Use when asked to "landing report", "what's in
the queue", "show me open PRs", or "which version do I claim next".

# /landing-report — Version Queue Dashboard

##...

## 适用场景

- 基于 description 推断：Read-only queue dashboard for workspace-aware ship. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
