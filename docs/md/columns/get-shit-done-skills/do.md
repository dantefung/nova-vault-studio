---
title: "do"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# do

> Analyze freeform text from the user and route to the most appropriate GSD command. This is a dispatcher — it never does the work itself. Match user intent to the best command, confirm the routing, and

<!-- more -->

## 定位

Analyze freeform text from the user and route to the most appropriate GSD command. This is a dispatcher — it never does the work itself. Match user intent to the best command, confirm the routing, and hand off.

## 核心流程/章节

- validate
- check_project
- route
- display
- dispatch

## 原文要点

**Check for input.** **Text mode (`workflow.text_mode: true` in config or `--text` flag):** Set `TEXT_MODE=true` if `--text` is present in `$ARGUMENTS` OR `text_mode` from init JSON is `true`. When TEXT_MODE is active, replace every `AskUserQuestion` call with a plain-text numbered list and ask the user to type their choice number. This is required for non-Claude runtimes (OpenAI Codex, Gemini CLI

## 适用场景

- 基于 description 推断：Analyze freeform text from the user and route to the most appropriate GSD command. This is a dispatcher — it never does the work itself. Match user in

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
