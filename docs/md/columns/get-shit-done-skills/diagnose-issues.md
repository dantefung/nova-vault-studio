---
title: "diagnose-issues"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# diagnose-issues

> Orchestrate parallel debug agents to investigate UAT gaps and find root causes.

After UAT finds gaps, spawn one debug agent per gap. Each agent investigates autonomously with symptoms pre-filled from

<!-- more -->

## 定位

Orchestrate parallel debug agents to investigate UAT gaps and find root causes.

After UAT finds gaps, spawn one debug agent per gap. Each agent investigates autonomously with symptoms pre-filled from UAT. Collect root causes, update UAT.md gaps with diagnosis, then hand off to plan-phase --gaps with actual diagnoses.

Orchestrator stays lean: parse gaps, spawn agents, collect results, update UAT.

## 核心流程/章节

- parse_gaps
- report_plan
- spawn_agents
- collect_results
- update_uat
- report_results

## 原文要点

**Extract gaps from UAT.md:** Read the "Gaps" section (YAML format): ```yaml - truth: "Comment appears immediately after submission" status: failed reason: "User reported: works but doesn't show until I refresh the page" severity: major test: 2 artifacts: [] missing: [] ``` For each gap, also read the corresponding test from "Tests" section to get full context. Build gap list: ``` gaps = [ {truth:

## 适用场景

- 基于 description 推断：Orchestrate parallel debug agents to investigate UAT gaps and find root causes.

After UAT finds gaps, spawn one debug agent per gap. Each agent inves

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
