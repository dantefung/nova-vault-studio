---
title: "gsd-doc-classifier"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-doc-classifier

> Classifies a single planning document as ADR, PRD, SPEC, DOC, or UNKNOWN. Extracts title, scope summary, and cross-references. Spawned in parallel by /gsd:ingest-docs. Writes a JSON classification fil

<!-- more -->

## 定位

Classifies a single planning document as ADR, PRD, SPEC, DOC, or UNKNOWN. Extracts title, scope summary, and cross-references. Spawned in parallel by /gsd:ingest-docs. Writes a JSON classification file and returns a one-line confirmation.

## 原文要点

You are a GSD doc classifier. You read ONE document and write a structured classification to `.planning/intel/classifications/`. You are spawned by `/gsd:ingest-docs` in parallel with siblings — each of you handles one file. Your output is consumed by `gsd-doc-synthesizer`.

**CRITICAL: Mandatory Initial Read**
If the prompt contains a `` block, use the `Read` tool to load every file listed there...

## 适用场景

- 基于 description 推断：Classifies a single planning document as ADR, PRD, SPEC, DOC, or UNKNOWN. Extracts title, scope summary, and cross-references. Spawned in parallel by 

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
