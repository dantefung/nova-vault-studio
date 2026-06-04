---
title: "note"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# note

> Zero-friction idea capture. One Write call, one confirmation line. No questions, no prompts.

**Text mode (`workflow.text_mode: true` in config or `--text` flag):** Set `TEXT_MODE=true` if `--text` is

<!-- more -->

## 定位

Zero-friction idea capture. One Write call, one confirmation line. No questions, no prompts.

**Text mode (`workflow.text_mode: true` in config or `--text` flag):** Set `TEXT_MODE=true` if `--text` is present in `$ARGUMENTS` OR `text_mode` from init JSON is `true`. When TEXT_MODE is active, replace every `AskUserQuestion` call with a plain-text numbered list and ask the user to type their choice number. This is required for non-Claude runtimes (OpenAI Codex, Gemini CLI, etc.) where `AskUserQuestion` is not available.
Runs inline — no Task, no AskUserQuestion, no Bash.

## 核心流程/章节

- storage_format
- parse_subcommand
- append
- list
- promote

## 原文要点

**Note storage format.** Notes are stored as individual markdown files: - **Project scope**: `.planning/notes/{YYYY-MM-DD}-{slug}.md` — used when `.planning/` exists in cwd - **Global scope**: `~/.claude/notes/{YYYY-MM-DD}-{slug}.md` — fallback when no `.planning/`, or when `--global` flag is present Each note file: ```markdown --- date: "YYYY-MM-DD HH:mm" promoted: false --- {note text verbatim} 

## 适用场景

- 基于 description 推断：Zero-friction idea capture. One Write call, one confirmation line. No questions, no prompts.

**Text mode (`workflow.text_mode: true` in config or `--

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
