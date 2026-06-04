---
title: "ship"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# ship

> Create a pull request from completed phase/milestone work, generate a rich PR body from planning artifacts, optionally run code review, and prepare for merge. Closes the plan → execute → verify → ship

<!-- more -->

## 定位

Create a pull request from completed phase/milestone work, generate a rich PR body from planning artifacts, optionally run code review, and prepare for merge. Closes the plan → execute → verify → ship loop.

## 核心流程/章节

- initialize
- preflight_checks
- push_branch
- generate_pr_body
- create_pr
- optional_review
- track_shipping
- report

## 原文要点

Parse arguments and load project state: ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse from init JSON: `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `padded_phase`, `commit_docs`. Also load config for branching strategy: ```bash CONFIG=$(gsd-sdk query state.load) ``` Extract: `branching_strategy`, 

## 适用场景

- 基于 description 推断：Create a pull request from completed phase/milestone work, generate a rich PR body from planning artifacts, optionally run code review, and prepare fo

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
