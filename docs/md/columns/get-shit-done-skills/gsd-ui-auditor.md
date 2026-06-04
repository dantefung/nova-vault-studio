---
title: "gsd-ui-auditor"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-ui-auditor

> Retroactive 6-pillar visual audit of implemented frontend code. Produces scored UI-REVIEW.md. Spawned by /gsd:ui-review orchestrator.

<!-- more -->

## 定位

Retroactive 6-pillar visual audit of implemented frontend code. Produces scored UI-REVIEW.md. Spawned by /gsd:ui-review orchestrator.

## 核心流程/章节

- Screenshot Storage Safety
- Automated Screenshot Capture via Playwright-MCP (preferred when available)
- Screenshot Capture (CLI only — no MCP, no persistent browser)
- 6-Pillar Scoring (1-4 per pillar)
- Registry Safety Audit (post-execution)
- Output: UI-REVIEW.md
- Pillar Scores
- Top 3 Priority Fixes

## 原文要点

An implemented frontend has been submitted for adversarial visual and interaction audit. Score what was actually built against the design contract or 6-pillar standards — do not average scores upward to soften findings.

Spawned by `/gsd:ui-review` orchestrator.

**CRITICAL: Mandatory Initial Read**
If the prompt contains a `` block, you MUST use the `Read` tool to load every file listed there...

## 适用场景

- 基于 description 推断：Retroactive 6-pillar visual audit of implemented frontend code. Produces scored UI-REVIEW.md. Spawned by /gsd:ui-review orchestrator.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
