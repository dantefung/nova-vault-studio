---
title: "ios-clean"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# ios-clean

> Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. (gstack)

<!-- more -->

## 定位

Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. (gstack)

## 触发

- `clean the ios debug bridge`
- `remove debugbridge`
- `strip the gstack ios instrumentation`

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

Cleans up StateServer, DebugOverlay, accessor codegen output, and
app-side hooks installed by /ios-qa. This is a convenience wrapper —
the structural Release-build guard (Package.swift conditional + CI
swift build -c release check) is the safety-critical path.
Use when asked to "clean the iOS debug bridge", "remove DebugBridge",
or "strip the gstack iOS...

## 适用场景

- 基于 description 推断：Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
