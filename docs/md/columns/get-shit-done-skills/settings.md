---
title: "settings"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# settings

> Interactive configuration of GSD workflow agents (research, plan_check, verifier) and model profile selection via multi-question prompt. Updates .planning/config.json with user preferences. Optionally

<!-- more -->

## 定位

Interactive configuration of GSD workflow agents (research, plan_check, verifier) and model profile selection via multi-question prompt. Updates .planning/config.json with user preferences. Optionally saves settings as global defaults (~/.gsd/defaults.json) for future projects.

## 核心流程/章节

- ensure_and_load_config
- read_current
- present_settings
- update_config
- save_as_defaults
- confirm

## 原文要点

Ensure config exists and load current state: ```bash gsd-sdk query config-ensure-section INIT=$(gsd-sdk query state.load) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi # `state.load` returns STATE frontmatter JSON from the SDK — it does not include `config_path`. Orchestrators may set `GSD_CONFIG_PATH` from init phase-op JSON; otherwise resolve the same path gsd-tools uses for

## 适用场景

- 基于 description 推断：Interactive configuration of GSD workflow agents (research, plan_check, verifier) and model profile selection via multi-question prompt. Updates .plan

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
