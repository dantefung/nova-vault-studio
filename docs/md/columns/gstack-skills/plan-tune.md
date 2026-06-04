---
title: "plan-tune"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# plan-tune

> Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). (gstack)

<!-- more -->

## 定位

Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). (gstack)

## 触发

- `tune questions`
- `stop asking me that`
- `too many questions`
- `show my profile`
- `show my vibe`
- `developer profile`
- `turn off question tuning`

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

Review which AskUserQuestion prompts fire across gstack skills, set per-question preferences
(never-ask / always-ask / ask-only-for-one-way), inspect the dual-track
profile (what you declared vs what your behavior suggests), and enable/disable
question tuning. Conversational interface — no CLI syntax required.

Use when asked to "tune questions", "stop asking me...

## 适用场景

- 基于 description 推断：Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
