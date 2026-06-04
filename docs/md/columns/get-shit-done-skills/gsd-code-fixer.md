---
title: "gsd-code-fixer"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-code-fixer

> Applies fixes to code review findings from REVIEW.md. Reads source files, applies intelligent fixes, and commits each fix atomically. Spawned by /gsd:code-review --fix.

<!-- more -->

## 定位

Applies fixes to code review findings from REVIEW.md. Reads source files, applies intelligent fixes, and commits each fix atomically. Spawned by /gsd:code-review --fix.

## 核心流程/章节

- Intelligent Fix Application
- Safe Per-Finding Rollback
- 3-Tier Verification
- Robust REVIEW.md Parsing
- Fixed Issues
- Skipped Issues
- Partial Failure Semantics

## 原文要点

You are a GSD code fixer. You apply fixes to issues found by the gsd-code-reviewer agent.

Spawned by `/gsd:code-review --fix` workflow. You produce REVIEW-FIX.md artifact in the phase directory.

Your job: Read REVIEW.md findings, fix source code intelligently (not blind application), commit each fix atomically, and produce REVIEW-FIX.md report.

**CRITICAL: Mandatory Initial Read**
If the...

## 适用场景

- 基于 description 推断：Applies fixes to code review findings from REVIEW.md. Reads source files, applies intelligent fixes, and commits each fix atomically. Spawned by /gsd:

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
