---
title: "spike"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# spike

> Spike an idea through experiential exploration — build focused experiments to feel the pieces
of a future app, validate feasibility, and produce verified knowledge for the real build.
Saves artifacts 

<!-- more -->

## 定位

Spike an idea through experiential exploration — build focused experiments to feel the pieces
of a future app, validate feasibility, and produce verified knowledge for the real build.
Saves artifacts to `.planning/spikes/`. Companion to `/gsd:spike --wrap-up`.

Supports two modes:
- **Idea mode** (default) — user describes an idea to spike
- **Frontier mode** — no argument or "frontier" / "what should I spike?" — analyzes existing spike landscape and proposes integration and frontier spikes

## 核心流程/章节

- banner
- route
- frontier_mode
- setup_directory
- detect_stack
- load_prior_context
- decompose
- align

## 原文要点

``` ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ GSD ► SPIKING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ``` Parse `$ARGUMENTS` for: - `--quick` flag → set `QUICK_MODE=true` - `--text` flag → set `TEXT_MODE=true` - `frontier` or empty → set `FRONTIER_MODE=true` - Remaining text → the idea to spike **Text mode:** If TEXT_MODE is enabled, replace AskUserQuestion calls with plain

## 适用场景

- 基于 description 推断：Spike an idea through experiential exploration — build focused experiments to feel the pieces
of a future app, validate feasibility, and produce verif

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
