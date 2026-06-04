---
title: "cleanup"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# cleanup

> Archive accumulated phase directories from completed milestones into `.planning/milestones/v{X.Y}-phases/`. Identifies which phases belong to each completed milestone, shows a dry-run summary, and mov

<!-- more -->

## 定位

Archive accumulated phase directories from completed milestones into `.planning/milestones/v{X.Y}-phases/`. Identifies which phases belong to each completed milestone, shows a dry-run summary, and moves directories on confirmation.

## 核心流程/章节

- identify_completed_milestones
- determine_phase_membership
- show_dry_run
- archive_phases
- commit
- report

## 原文要点

Read `.planning/MILESTONES.md` to identify completed milestones and their versions. ```bash cat .planning/MILESTONES.md ``` Extract each milestone version (e.g., v1.0, v1.1, v2.0). Check which milestone archive dirs already exist: ```bash ls -d .planning/milestones/v*-phases 2>/dev/null || true ``` Filter to milestones that do NOT already have a `-phases` archive directory. If all milestones alrea

## 适用场景

- 基于 description 推断：Archive accumulated phase directories from completed milestones into `.planning/milestones/v{X.Y}-phases/`. Identifies which phases belong to each com

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
