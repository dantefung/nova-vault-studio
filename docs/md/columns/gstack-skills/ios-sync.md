---
title: "ios-sync"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# ios-sync

> Regenerate the iOS debug bridge against the latest upstream gstack templates. (gstack)

<!-- more -->

## 定位

Regenerate the iOS debug bridge against the latest upstream gstack templates. (gstack)

## 触发

- `resync the ios debug bridge`
- `regenerate ios accessors`
- `update the gstack ios instrumentation`

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

Updates StateServer.swift, DebugOverlay.swift, Package.swift,
and the typed @Observable state accessors. Use after you upgrade gstack
or add new ViewModels/properties that need accessor coverage.
Use when asked to "resync the iOS debug bridge", "regenerate iOS
accessors", or "update the gstack iOS instrumentation".

Voice triggers (speech-to-text aliases): "resync...

## 适用场景

- 基于 description 推断：Regenerate the iOS debug bridge against the latest upstream gstack templates. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
