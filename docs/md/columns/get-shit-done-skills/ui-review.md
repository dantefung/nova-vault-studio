---
title: "ui-review"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# ui-review

> Retroactive 6-pillar visual audit of implemented frontend code. Standalone command that works on any project — GSD-managed or not. Produces scored UI-REVIEW.md with actionable findings.

<!-- more -->

## 定位

Retroactive 6-pillar visual audit of implemented frontend code. Standalone command that works on any project — GSD-managed or not. Produces scored UI-REVIEW.md with actionable findings.

## 原文要点

## 0. Initialize ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS_UI_REVIEWER=$(gsd-sdk query agent-skills gsd-ui-auditor) ``` Parse: `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`, `commit_docs`. ```bash UI_AUDITOR_MODEL=$(gsd-sdk query resolve-model gsd-ui-auditor --raw) ``` Display

## 适用场景

- 基于 description 推断：Retroactive 6-pillar visual audit of implemented frontend code. Standalone command that works on any project — GSD-managed or not. Produces scored UI-

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
