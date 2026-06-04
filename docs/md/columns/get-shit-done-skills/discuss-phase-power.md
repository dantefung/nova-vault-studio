---
title: "discuss-phase-power"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# discuss-phase-power

> Power user mode for discuss-phase. Generates ALL questions upfront into a JSON state file and an HTML companion UI, then waits for the user to answer at their own pace. When the user signals readiness

<!-- more -->

## 定位

Power user mode for discuss-phase. Generates ALL questions upfront into a JSON state file and an HTML companion UI, then waits for the user to answer at their own pace. When the user signals readiness, processes all answers in one pass and generates CONTEXT.md.

**When to use:** Large phases with many gray areas, or when users prefer to answer questions offline / asynchronously rather than interactively in the chat session.

## 核心流程/章节

- analyze
- generate_json
- generate_html
- notify_user
- wait_loop
- finalize

## 适用场景

- 基于 description 推断：Power user mode for discuss-phase. Generates ALL questions upfront into a JSON state file and an HTML companion UI, then waits for the user to answer 

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
