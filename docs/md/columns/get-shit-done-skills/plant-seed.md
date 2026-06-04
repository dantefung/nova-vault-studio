---
title: "plant-seed"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# plant-seed

> Capture a forward-looking idea as a structured seed file with trigger conditions.
Seeds auto-surface during /gsd:new-milestone when trigger conditions match the
new milestone's scope.

Seeds beat defe

<!-- more -->

## 定位

Capture a forward-looking idea as a structured seed file with trigger conditions.
Seeds auto-surface during /gsd:new-milestone when trigger conditions match the
new milestone's scope.

Seeds beat deferred items because they:
- Preserve WHY the idea matters (not just WHAT)
- Define WHEN to surface (trigger conditions, not manual scanning)
- Track breadcrumbs (code references, related decisions)
- Auto-present at the right time via new-milestone scan

**One-shot capture**: the seed file is written immediately from the idea text alone.
Trigger / Why / Scope are optional enrichment — they can be provided now or added
later. The file is never gated behind questions.

## 核心流程/章节

- parse-idea
- create-seed-dir
- generate-seed-id
- write-seed
- collect-breadcrumbs
- commit-seed
- confirm
- enrich-seed

## 原文要点

Parse `$ARGUMENTS` for the idea summary. First, check for an enrich flag: ```bash if echo "$ARGUMENTS" | grep -qE '\-\-enrich[[:space:]]+SEED-[0-9]+'; then ENRICH_TARGET=$(echo "$ARGUMENTS" | grep -oE 'SEED-[0-9]+') SEED_FILE=$(ls .planning/seeds/${ENRICH_TARGET}-*.md 2>/dev/null | head -1) # Skip to enrich-seed step — do not prompt for $IDEA else if [ -n "$ARGUMENTS" ]; then IDEA="$ARGUMENTS" els

## 适用场景

- 基于 description 推断：Capture a forward-looking idea as a structured seed file with trigger conditions.
Seeds auto-surface during /gsd:new-milestone when trigger conditions

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
