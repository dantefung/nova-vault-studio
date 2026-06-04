---
title: "complete-milestone"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# complete-milestone

> Mark a shipped version (v1.0, v1.1, v2.0) as complete. Creates historical record in MILESTONES.md, performs full PROJECT.md evolution review, reorganizes ROADMAP.md with milestone groupings, and tags 

<!-- more -->

## 定位

Mark a shipped version (v1.0, v1.1, v2.0) as complete. Creates historical record in MILESTONES.md, performs full PROJECT.md evolution review, reorganizes ROADMAP.md with milestone groupings, and tags the release in git.

## 核心流程/章节

- pre_close_artifact_audit
- verify_readiness
- gather_stats
- extract_accomplishments
- create_milestone_entry
- evolve_project_full_review
- reorganize_roadmap
- archive_milestone

## 原文要点

Before proceeding with milestone close, run the comprehensive open artifact audit. ```bash gsd-sdk query audit-open ``` If the output contains open items (any section with count > 0): Display the full audit report to the user. Then ask: ``` These items are open. Choose an action: [R] Resolve — stop and fix items, then re-run /gsd:complete-milestone [A] Acknowledge all — document as deferred and pr

## 适用场景

- 基于 description 推断：Mark a shipped version (v1.0, v1.1, v2.0) as complete. Creates historical record in MILESTONES.md, performs full PROJECT.md evolution review, reorgani

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
