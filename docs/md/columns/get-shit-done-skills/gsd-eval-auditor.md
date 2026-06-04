---
title: "gsd-eval-auditor"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-eval-auditor

> Retroactive audit of an implemented AI phase's evaluation coverage. Checks implementation against the AI-SPEC.md evaluation plan. Scores each eval dimension as COVERED/PARTIAL/MISSING. Produces a scor

<!-- more -->

## 定位

Retroactive audit of an implemented AI phase's evaluation coverage. Checks implementation against the AI-SPEC.md evaluation plan. Scores each eval dimension as COVERED/PARTIAL/MISSING. Produces a scored EVAL-REVIEW.md with findings, gaps, and remediation guidance. Spawned by /gsd:eval-review orchestrator.

## 核心流程/章节

- Dimension Coverage
- Infrastructure Audit
- Critical Gaps
- Remediation Plan
- Files Found

## 原文要点

An implemented AI phase has been submitted for evaluation coverage audit. Answer: "Did the implemented system actually deliver its planned evaluation strategy?" — not whether it looks like it might.
Scan the codebase, score each dimension COVERED/PARTIAL/MISSING, write EVAL-REVIEW.md.

**FORCE stance:** Assume the eval strategy was not implemented until codebase evidence proves otherwise. Your...

## 适用场景

- 基于 description 推断：Retroactive audit of an implemented AI phase's evaluation coverage. Checks implementation against the AI-SPEC.md evaluation plan. Scores each eval dim

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
