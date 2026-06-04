---
title: "session-report"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# session-report

> Generate a post-session summary document capturing work performed, outcomes achieved, and estimated resource usage. Writes SESSION_REPORT.md to .planning/reports/ for human review and stakeholder shar

<!-- more -->

## 定位

Generate a post-session summary document capturing work performed, outcomes achieved, and estimated resource usage. Writes SESSION_REPORT.md to .planning/reports/ for human review and stakeholder sharing.

## 核心流程/章节

- gather_session_data
- estimate_usage
- generate_report
- display_result

## 原文要点

Collect session data from available sources: 1. **STATE.md** — current phase, milestone, progress, blockers, decisions 2. **Git log** — commits made during this session (last 24h or since last report) 3. **Plan/Summary files** — plans executed, summaries written 4. **ROADMAP.md** — milestone context and phase goals ```bash # Get recent commits (last 24 hours) git log --oneline --since="24 hours ag

## 适用场景

- 基于 description 推断：Generate a post-session summary document capturing work performed, outcomes achieved, and estimated resource usage. Writes SESSION_REPORT.md to .plann

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
