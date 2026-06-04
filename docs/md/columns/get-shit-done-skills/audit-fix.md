---
title: "audit-fix"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# audit-fix

> Autonomous audit-to-fix pipeline. Runs an audit, parses findings, classifies each as
auto-fixable vs manual-only, spawns executor agents for fixable issues, runs tests
after each fix, and commits atom

<!-- more -->

## 定位

Autonomous audit-to-fix pipeline. Runs an audit, parses findings, classifies each as
auto-fixable vs manual-only, spawns executor agents for fixable issues, runs tests
after each fix, and commits atomically with finding IDs for traceability.

## 核心流程/章节

- parse-arguments
- run-audit
- classify-findings
- present-classification
- fix-loop
- report

## 原文要点

Extract flags from the user's invocation: - `--max N` — maximum findings to fix (default: **5**) - `--severity high|medium|all` — minimum severity to process (default: **medium**) - `--dry-run` — classify findings without fixing (shows classification table only) - `--source ` — which audit to run (default: **audit-uat**) Validate `--source` is a supported audit. Currently supported: - `audit-uat` 

## 适用场景

- 基于 description 推断：Autonomous audit-to-fix pipeline. Runs an audit, parses findings, classifies each as
auto-fixable vs manual-only, spawns executor agents for fixable i

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
