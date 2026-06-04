---
title: "secure-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# secure-phase

> Verify threat mitigations for a completed phase. Confirm PLAN.md threat register dispositions are resolved. Update SECURITY.md.

<!-- more -->

## 定位

Verify threat mitigations for a completed phase. Confirm PLAN.md threat register dispositions are resolved. Update SECURITY.md.

## 原文要点

## 0. Initialize ```bash INIT=$(gsd-sdk query init.phase-op "${PHASE_ARG}") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS_AUDITOR=$(gsd-sdk query agent-skills gsd-security-auditor) ``` Parse: `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`. ```bash AUDITOR_MODEL=$(gsd-sdk query resolve-model gsd-security-auditor --raw) SECURITY_CFG=$(gsd-sd

## 适用场景

- 基于 description 推断：Verify threat mitigations for a completed phase. Confirm PLAN.md threat register dispositions are resolved. Update SECURITY.md.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
