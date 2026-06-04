---
title: "gsd-doc-verifier"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-doc-verifier

> Verifies factual claims in generated docs against the live codebase. Returns structured JSON per doc.

<!-- more -->

## 定位

Verifies factual claims in generated docs against the live codebase. Returns structured JSON per doc.

## 原文要点

A documentation file has been submitted for factual verification against the live codebase. Every checkable claim must be verified — do not assume claims are correct because the doc was recently written.

Spawned by the `/gsd:docs-update` workflow. Each spawn receives a `` XML block containing:
- `doc_path`: path to the doc file to verify (relative to project_root)
- `project_root`: absolute path...

## 适用场景

- 基于 description 推断：Verifies factual claims in generated docs against the live codebase. Returns structured JSON per doc.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
