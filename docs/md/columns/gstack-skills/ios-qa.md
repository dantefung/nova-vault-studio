---
title: "ios-qa"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# ios-qa

> Live-device iOS QA for SwiftUI apps. (gstack)

<!-- more -->

## 定位

Live-device iOS QA for SwiftUI apps. (gstack)

## 触发

- `ios qa`
- `test the iphone app`
- `test my ios app`
- `find bugs on the device`
- `qa the ios app`

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

Connects to a real iPhone via USB
CoreDevice IPv6 tunnel, reads Swift source to understand every screen, then
runs a vision-driven agent loop: screenshot → analyze → decide → act →
verify → repeat. All interaction happens via HTTP to an embedded
StateServer in the app under test. Optionally exposes the device over
Tailscale so remote agents (OpenClaw, Codex, any...

## 适用场景

- 基于 description 推断：Live-device iOS QA for SwiftUI apps. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
