---
title: "plan-milestone-gaps"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# plan-milestone-gaps

> Create all phases necessary to close gaps identified by `/gsd:audit-milestone`. Reads MILESTONE-AUDIT.md, groups gaps into logical phases, creates phase entries in ROADMAP.md, and offers to plan each 

<!-- more -->

## 定位

Create all phases necessary to close gaps identified by `/gsd:audit-milestone`. Reads MILESTONE-AUDIT.md, groups gaps into logical phases, creates phase entries in ROADMAP.md, and offers to plan each phase. One command creates all fix phases — no manual `/gsd-add-phase` per gap.

## 原文要点

## 1. Load Audit Results ```bash # Find the most recent audit file (ls -t .planning/v*-MILESTONE-AUDIT.md 2>/dev/null || true) | head -1 ``` Parse YAML frontmatter to extract structured gaps: - `gaps.requirements` — unsatisfied requirements - `gaps.integration` — missing cross-phase connections - `gaps.flows` — broken E2E flows If no audit file exists or has no gaps, error: ``` No audit gaps found

## 适用场景

- 基于 description 推断：Create all phases necessary to close gaps identified by `/gsd:audit-milestone`. Reads MILESTONE-AUDIT.md, groups gaps into logical phases, creates pha

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
