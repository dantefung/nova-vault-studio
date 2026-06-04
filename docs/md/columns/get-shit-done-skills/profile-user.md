---
title: "profile-user"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# profile-user

> Orchestrate the full developer profiling flow: consent, session analysis (or questionnaire fallback), profile generation, result display, and artifact creation.

This workflow wires Phase 1 (session p

<!-- more -->

## 定位

Orchestrate the full developer profiling flow: consent, session analysis (or questionnaire fallback), profile generation, result display, and artifact creation.

This workflow wires Phase 1 (session pipeline) and Phase 2 (profiling engine) into a cohesive user-facing experience. All heavy lifting is done by existing `gsd-sdk query` handlers (with legacy `gsd-tools.cjs` parity where needed) and the gsd-user-profiler agent -- this workflow orchestrates the sequence, handles branching, and provides the UX.

## 原文要点

## 1. Initialize Parse flags from $ARGUMENTS: - Detect `--questionnaire` flag (skip session analysis, questionnaire-only) - Detect `--refresh` flag (rebuild profile even when one exists) Check for existing profile: ```bash PROFILE_PATH="$HOME/.claude/get-shit-done/USER-PROFILE.md" [ -f "$PROFILE_PATH" ] && echo "EXISTS" || echo "NOT_FOUND" ``` **If profile exists AND --refresh NOT set AND --questi

## 适用场景

- 基于 description 推断：Orchestrate the full developer profiling flow: consent, session analysis (or questionnaire fallback), profile generation, result display, and artifact

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
