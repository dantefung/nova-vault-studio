---
title: "audit-uat"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# audit-uat

> Cross-phase audit of all UAT and verification files. Finds every outstanding item (pending, skipped, blocked, human_needed), optionally verifies against the codebase to detect stale docs, and produces

<!-- more -->

## 定位

Cross-phase audit of all UAT and verification files. Finds every outstanding item (pending, skipped, blocked, human_needed), optionally verifies against the codebase to detect stale docs, and produces a prioritized human test plan.

## 核心流程/章节

- initialize
- categorize
- present
- test_plan

## 原文要点

Run the CLI audit: ```bash AUDIT=$(gsd-sdk query audit-uat --raw) ``` Parse JSON for `results` array and `summary` object. If `summary.total_items` is 0: ``` ## All Clear No outstanding UAT or verification items found across all phases. All tests are passing, resolved, or diagnosed with fix plans. ``` Stop here. Group items by what's actionable NOW vs. what needs prerequisites: **Testable Now** (n

## 适用场景

- 基于 description 推断：Cross-phase audit of all UAT and verification files. Finds every outstanding item (pending, skipped, blocked, human_needed), optionally verifies again

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
