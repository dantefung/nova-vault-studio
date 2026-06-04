---
title: "settings-advanced"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# settings-advanced

> Interactive configuration of GSD power-user knobs — plan bounce, node repair, subagent timeouts,
inline plan threshold, cross-AI execution, base branch, branch templates, response language,
context wi

<!-- more -->

## 定位

Interactive configuration of GSD power-user knobs — plan bounce, node repair, subagent timeouts,
inline plan threshold, cross-AI execution, base branch, branch templates, response language,
context window, gitignored search, graphify build timeout, and runtime model tier overrides.

This is a companion to `/gsd:settings` — the common-case prompt there covers model profile,
research/plan_check/verifier toggles, branching strategy, UI/AI phase gates, and worktree
isolation. This advanced command covers everything else that is user-settable, grouped into
seven sections so each prompt batch stays cognitively scoped. Every answer pre-selects the
current value; numeric-input answers that are non-numeric are rejected and re-prompted.

## 核心流程/章节

- ensure_and_load_config
- read_current
- present_settings
- update_config
- confirm

## 原文要点

Ensure config exists and resolve the workstream-aware config path (mirrors `settings.md`): ```bash gsd-sdk query config-ensure-section if [[ -z "${GSD_CONFIG_PATH:-}" ]]; then if [[ -f .planning/active-workstream ]]; then WS=$(tr -d '\n\r' ```bash cat "$GSD_CONFIG_PATH" ``` Parse the following current values. If a key is absent, fall back to the documented default shown in parentheses: Planning Tu

## 适用场景

- 基于 description 推断：Interactive configuration of GSD power-user knobs — plan bounce, node repair, subagent timeouts,
inline plan threshold, cross-AI execution, base branc

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
