---
title: "resume-project"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# resume-project

> Instantly restore full project context so "Where were we?" has an immediate, complete answer.

<!-- more -->

## 定位

Instantly restore full project context so "Where were we?" has an immediate, complete answer.

## 核心流程/章节

- initialize
- load_state
- check_incomplete_work
- present_status
- determine_next_action
- offer_options
- route_to_workflow
- update_session

## 原文要点

Load all context in one call: ```bash INIT=$(gsd-sdk query init.resume) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse JSON for: `state_exists`, `roadmap_exists`, `project_exists`, `planning_exists`, `has_interrupted_agent`, `interrupted_agent_id`, `commit_docs`. **If `state_exists` is true:** Proceed to load_state **If `state_exists` is false but `roadmap_exists` or 

## 适用场景

- 基于 description 推断：Instantly restore full project context so "Where were we?" has an immediate, complete answer.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
