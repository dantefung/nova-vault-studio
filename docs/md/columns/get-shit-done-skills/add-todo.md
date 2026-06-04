---
title: "add-todo"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# add-todo

> Capture an idea, task, or issue that surfaces during a GSD session as a structured todo for later work. Enables "thought → capture → continue" flow without losing context.

<!-- more -->

## 定位

Capture an idea, task, or issue that surfaces during a GSD session as a structured todo for later work. Enables "thought → capture → continue" flow without losing context.

## 核心流程/章节

- init_context
- extract_content
- infer_area
- check_duplicates
- create_file
- update_state
- git_commit
- confirm

## 原文要点

Load todo context: ```bash INIT=$(gsd-sdk query init.todos) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Extract from init JSON: `commit_docs`, `date`, `timestamp`, `todo_count`, `todos`, `pending_dir`, `todos_dir_exists`. Ensure directories exist: ```bash mkdir -p .planning/todos/pending .planning/todos/completed ``` Note existing areas from the todos array for consisten

## 适用场景

- 基于 description 推断：Capture an idea, task, or issue that surfaces during a GSD session as a structured todo for later work. Enables "thought → capture → continue" flow wi

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
