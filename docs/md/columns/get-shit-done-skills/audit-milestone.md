---
title: "audit-milestone"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# audit-milestone

> Verify milestone achieved its definition of done by aggregating phase verifications, checking cross-phase integration, and assessing requirements coverage. Reads existing VERIFICATION.md files (phases

<!-- more -->

## 定位

Verify milestone achieved its definition of done by aggregating phase verifications, checking cross-phase integration, and assessing requirements coverage. Reads existing VERIFICATION.md files (phases already verified during execute-phase), aggregates tech debt and deferred gaps, then spawns integration checker for cross-phase wiring.

## 原文要点

## 0. Initialize Milestone Context ```bash INIT=$(gsd-sdk query init.milestone-op) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS_CHECKER=$(gsd-sdk query agent-skills gsd-integration-checker) ``` Extract from init JSON: `milestone_version`, `milestone_name`, `phase_count`, `completed_phases`, `commit_docs`. Resolve integration checker model: ```bash integration_che

## 适用场景

- 基于 description 推断：Verify milestone achieved its definition of done by aggregating phase verifications, checking cross-phase integration, and assessing requirements cove

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
