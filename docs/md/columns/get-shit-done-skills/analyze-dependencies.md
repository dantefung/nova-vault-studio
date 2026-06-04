---
title: "analyze-dependencies"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# analyze-dependencies

> Analyze ROADMAP.md phases for dependency relationships before execution. Detect file overlap between phases, semantic API/data-flow dependencies, and suggest `Depends on` entries to prevent merge conf

<!-- more -->

## 定位

Analyze ROADMAP.md phases for dependency relationships before execution. Detect file overlap between phases, semantic API/data-flow dependencies, and suggest `Depends on` entries to prevent merge conflicts during parallel execution by `/gsd:manager`.

## 原文要点

## 1. Load ROADMAP.md Read `.planning/ROADMAP.md`. If it does not exist, error: "No ROADMAP.md found — run `/gsd:new-project` first." Extract all phases. For each phase capture: - Phase number and name - Scope/Goal description - Files listed in `Files` or `files_modified` fields (if present) - Existing `Depends on` field value ## 2. Infer Likely File Modifications For each phase without explicit `

## 适用场景

- 基于 description 推断：Analyze ROADMAP.md phases for dependency relationships before execution. Detect file overlap between phases, semantic API/data-flow dependencies, and 

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
