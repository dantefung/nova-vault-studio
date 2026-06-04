---
title: "sketch"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# sketch

> Explore design directions through throwaway HTML mockups before committing to implementation.
Each sketch produces 2-3 variants for comparison. Saves artifacts to `.planning/sketches/`.
Companion to `

<!-- more -->

## 定位

Explore design directions through throwaway HTML mockups before committing to implementation.
Each sketch produces 2-3 variants for comparison. Saves artifacts to `.planning/sketches/`.
Companion to `/gsd:sketch --wrap-up`.

Supports two modes:
- **Idea mode** (default) — user describes a design idea to sketch
- **Frontier mode** — no argument or "frontier" / "what should I sketch?" — analyzes existing sketch landscape and proposes consistency and frontier sketches

## 核心流程/章节

- banner
- route
- frontier_mode
- setup_directory
- mood_intake
- load_spike_context
- decompose
- research_stack

## 原文要点

``` ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ GSD ► SKETCHING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ``` Parse `$ARGUMENTS` for: - `--quick` flag → set `QUICK_MODE=true` - `--text` flag → set `TEXT_MODE=true` - `frontier` or empty → set `FRONTIER_MODE=true` - Remaining text → the design idea to sketch **Text mode:** If TEXT_MODE is enabled, replace AskUserQuestion calls 

## 适用场景

- 基于 description 推断：Explore design directions through throwaway HTML mockups before committing to implementation.
Each sketch produces 2-3 variants for comparison. Saves 

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
