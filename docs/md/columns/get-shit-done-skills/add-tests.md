---
title: "add-tests"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# add-tests

> Generate unit and E2E tests for a completed phase based on its SUMMARY.md, CONTEXT.md, and implementation. Classifies each changed file into TDD (unit), E2E (browser), or Skip categories, presents a t

<!-- more -->

## 定位

Generate unit and E2E tests for a completed phase based on its SUMMARY.md, CONTEXT.md, and implementation. Classifies each changed file into TDD (unit), E2E (browser), or Skip categories, presents a test plan for user approval, then generates tests following RED-GREEN conventions.

Users currently hand-craft `/gsd:quick` prompts for test generation after each phase. This workflow standardizes the process with proper classification, quality gates, and gap reporting.

## 核心流程/章节

- parse_arguments
- init_context
- analyze_implementation
- present_classification
- discover_test_structure
- generate_test_plan
- execute_tdd_generation
- execute_e2e_generation

## 原文要点

Parse `$ARGUMENTS` for: - Phase number (integer, decimal, or letter-suffix) → store as `$PHASE_ARG` - Remaining text after phase number → store as `$EXTRA_INSTRUCTIONS` (optional) Example: `/gsd:add-tests 12 focus on edge cases` → `$PHASE_ARG=12`, `$EXTRA_INSTRUCTIONS="focus on edge cases"` If no phase argument provided: ``` ERROR: Phase number required Usage: /gsd:add-tests [additional instructio

## 适用场景

- 基于 description 推断：Generate unit and E2E tests for a completed phase based on its SUMMARY.md, CONTEXT.md, and implementation. Classifies each changed file into TDD (unit

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
