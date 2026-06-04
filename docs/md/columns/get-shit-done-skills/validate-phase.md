---
title: "validate-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# validate-phase

> Audit Nyquist validation gaps for a completed phase. Generate missing tests. Update VALIDATION.md.

<!-- more -->

## 定位

Audit Nyquist validation gaps for a completed phase. Generate missing tests. Update VALIDATION.md.

## 原文要点

## 0. Initialize ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS_AUDITOR=$(gsd-sdk query agent-skills gsd-nyquist-auditor) ``` Parse: `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`. ```bash AUDITOR_MODEL=$(gsd-sdk query resolve-model gsd-nyquist-auditor --raw) NYQUIST_CFG=$(gsd-sdk q

## 适用场景

- 基于 description 推断：Audit Nyquist validation gaps for a completed phase. Generate missing tests. Update VALIDATION.md.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
