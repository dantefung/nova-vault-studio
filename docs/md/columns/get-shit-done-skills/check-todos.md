---
title: "check-todos"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# check-todos

> List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action.

<!-- more -->

## 定位

List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action.

## 核心流程/章节

- init_context
- parse_filter
- list_todos
- handle_selection
- load_context
- check_roadmap
- offer_actions
- execute_action

## 原文要点

Load todo context: ```bash INIT=$(gsd-sdk query init.todos) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Extract from init JSON: `todo_count`, `todos`, `pending_dir`. If `todo_count` is 0: ``` No pending todos. Todos are captured during work sessions with /gsd-add-todo. --- Would you like to: 1. Continue with current phase (/gsd:progress) 2. Add a todo now (/gsd-add-todo)

## 适用场景

- 基于 description 推断：List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
