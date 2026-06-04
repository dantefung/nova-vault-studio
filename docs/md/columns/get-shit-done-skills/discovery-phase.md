---
title: "discovery-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# discovery-phase

> Execute discovery at the appropriate depth level.
Produces DISCOVERY.md (for Level 2-3) that informs PLAN.md creation.

Called from plan-phase.md's mandatory_discovery step with a depth parameter.

NO

<!-- more -->

## 定位

Execute discovery at the appropriate depth level.
Produces DISCOVERY.md (for Level 2-3) that informs PLAN.md creation.

Called from plan-phase.md's mandatory_discovery step with a depth parameter.

NOTE: For comprehensive ecosystem research ("how do experts build this"), use /gsd:plan-phase --research-phase instead, which produces RESEARCH.md.

## 核心流程/章节

- determine_depth
- level_1_quick_verify
- level_2_standard
- level_3_deep_dive
- identify_unknowns
- create_discovery_scope
- execute_discovery
- create_discovery_output

## 原文要点

Check the depth parameter passed from plan-phase.md: - `depth=verify` → Level 1 (Quick Verification) - `depth=standard` → Level 2 (Standard Discovery) - `depth=deep` → Level 3 (Deep Dive) Route to appropriate level workflow below. **Level 1: Quick Verification (2-5 minutes)** For: Single known library, confirming syntax/version still correct. **Process:** 1. Resolve library in Context7: ``` mcp__c

## 适用场景

- 基于 description 推断：Execute discovery at the appropriate depth level.
Produces DISCOVERY.md (for Level 2-3) that informs PLAN.md creation.

Called from plan-phase.md's ma

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
