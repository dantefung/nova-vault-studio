---
title: "inbox"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# inbox

> Triage and review all open GitHub issues and PRs against project contribution templates.
Produces a structured report showing compliance status for each item, flags missing
required fields, identifies

<!-- more -->

## 定位

Triage and review all open GitHub issues and PRs against project contribution templates.
Produces a structured report showing compliance status for each item, flags missing
required fields, identifies label gaps, and optionally takes action (label, comment, close).

## 核心流程/章节

- preflight
- fetch_issues
- review_issues
- fetch_prs
- review_prs
- check_gates
- generate_report
- auto_actions

## 原文要点

Verify prerequisites: 1. **`gh` CLI available and authenticated?** ```bash which gh && gh auth status 2>&1 ``` If not available: print setup instructions and exit. 2. **Detect repository:** If `--repo` flag provided, use that. Otherwise: ```bash gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null ``` If no repo detected: error — must be in a git repo with a GitHub remote. 3. **Parse 

## 适用场景

- 基于 description 推断：Triage and review all open GitHub issues and PRs against project contribution templates.
Produces a structured report showing compliance status for ea

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
