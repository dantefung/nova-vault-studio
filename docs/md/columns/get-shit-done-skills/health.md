---
title: "health"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# health

> Validate `.planning/` directory integrity and report actionable issues. Checks for missing files, invalid configurations, inconsistent state, and orphaned plans. Optionally repairs auto-fixable issues

<!-- more -->

## 定位

Validate `.planning/` directory integrity and report actionable issues. Checks for missing files, invalid configurations, inconsistent state, and orphaned plans. Optionally repairs auto-fixable issues.

## 核心流程/章节

- parse_args
- context_check
- run_health_check
- format_output
- offer_repair
- verify_repairs

## 原文要点

**Parse arguments:** Check if `--repair`, `--backfill`, or `--context` flags are present in the command arguments. ``` REPAIR_FLAG="" BACKFILL_FLAG="" CONTEXT_MODE="" if arguments contain "--repair"; then REPAIR_FLAG="--repair" fi if arguments contain "--backfill"; then BACKFILL_FLAG="--backfill" fi if arguments contain "--context"; then CONTEXT_MODE="true" fi ``` If `CONTEXT_MODE` is set, jump to

## 适用场景

- 基于 description 推断：Validate `.planning/` directory integrity and report actionable issues. Checks for missing files, invalid configurations, inconsistent state, and orph

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
