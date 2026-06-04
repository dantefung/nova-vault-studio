---
title: "mvp-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# mvp-phase

> Guide the user through MVP-mode planning for a phase. Prompts for an "As a / I want to / So that" user story, runs SPIDR splitting check on the story, writes the result to ROADMAP.md, and delegates to

<!-- more -->

## 定位

Guide the user through MVP-mode planning for a phase. Prompts for an "As a / I want to / So that" user story, runs SPIDR splitting check on the story, writes the result to ROADMAP.md, and delegates to `/gsd plan-phase` (which auto-detects MVP via the roadmap mode field shipped in PRD Phase 1).

## 原文要点

## 1. Parse and validate phase argument Extract the phase number from `$ARGUMENTS` (integer or decimal like `2.1`). Optional flag: `--force` (allow operating on `in_progress` / `completed` phases). If no argument: ``` ERROR: Phase number required Usage: /gsd mvp-phase Example: /gsd mvp-phase 1 Example: /gsd mvp-phase 2.1 ``` Exit. Normalize per `@~/.claude/get-shit-done/references/phase-argument-p

## 适用场景

- 基于 description 推断：Guide the user through MVP-mode planning for a phase. Prompts for an "As a / I want to / So that" user story, runs SPIDR splitting check on the story,

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
