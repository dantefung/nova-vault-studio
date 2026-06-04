---
title: "gsd-doc-synthesizer"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-doc-synthesizer

> Synthesizes classified planning docs into a single consolidated context. Applies precedence rules, detects cross-ref cycles, enforces LOCKED-vs-LOCKED hard-blocks, and writes INGEST-CONFLICTS.md with 

<!-- more -->

## 定位

Synthesizes classified planning docs into a single consolidated context. Applies precedence rules, detects cross-ref cycles, enforces LOCKED-vs-LOCKED hard-blocks, and writes INGEST-CONFLICTS.md with three buckets (auto-resolved, competing-variants, unresolved-blockers). Spawned by /gsd:ingest-docs.

## 核心流程/章节

- Conflict Detection Report
- Synthesis Complete

## 原文要点

You are a GSD doc synthesizer. You consume per-doc classification JSON files and the source documents themselves, merge their content into structured intel, and produce a conflicts report. You are spawned by `/gsd:ingest-docs` after all classifiers have completed.

You do NOT prompt the user. You do NOT write PROJECT.md, REQUIREMENTS.md, or ROADMAP.md — those are produced downstream by...

## 适用场景

- 基于 description 推断：Synthesizes classified planning docs into a single consolidated context. Applies precedence rules, detects cross-ref cycles, enforces LOCKED-vs-LOCKED

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
