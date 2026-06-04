---
title: "verify-work"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# verify-work

> Validate built features through conversational testing with persistent state. Creates UAT.md that tracks test progress, survives /clear, and feeds gaps into /gsd:plan-phase --gaps.

User tests, Claude

<!-- more -->

## 定位

Validate built features through conversational testing with persistent state. Creates UAT.md that tracks test progress, survives /clear, and feeds gaps into /gsd:plan-phase --gaps.

User tests, Claude records. One test at a time. Plain text responses.

## 核心流程/章节

- initialize
- check_active_session
- automated_ui_verification
- find_summaries
- extract_tests
- create_uat_file
- present_test
- process_response

## 原文要点

If $ARGUMENTS contains a phase number, load context: ```bash GSD_WS="" echo "$ARGUMENTS" | grep -qE -- '--ws[[:space:]]+[^[:space:]]+' && GSD_WS=$(echo "$ARGUMENTS" | grep -oE -- '--ws[[:space:]]+[^[:space:]]+') PHASE_ARG=$(echo "$ARGUMENTS" | sed -E 's/--ws[[:space:]]+[^[:space:]]+//g' | xargs) INIT=$(gsd-sdk query init.verify-work "${PHASE_ARG}" ${GSD_WS}) if [[ "$INIT" == @file:* ]]; then INIT=

## 适用场景

- 基于 description 推断：Validate built features through conversational testing with persistent state. Creates UAT.md that tracks test progress, survives /clear, and feeds gap

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
