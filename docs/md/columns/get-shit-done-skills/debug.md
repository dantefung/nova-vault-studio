---
title: "debug"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# debug

> Debug Workflow

<!-- more -->

## 定位

Debug Workflow

## 原文要点

## 0. Initialize Context ```bash INIT=$(gsd-sdk query state.load) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Extract `commit_docs` from init JSON. Resolve debugger model: ```bash debugger_model=$(gsd-sdk query resolve-model gsd-debugger 2>/dev/null | jq -r '.model' 2>/dev/null || true) ``` Read TDD mode from config: ```bash TDD_MODE=$(gsd-sdk query config-get workflow.t

## 适用场景

- 基于 description 推断：Debug Workflow

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
