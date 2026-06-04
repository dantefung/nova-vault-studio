---
title: "gsd-doc-writer"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-doc-writer

> Writes and updates project documentation. Spawned with a doc_assignment block specifying doc type, mode (create/update/supplement), and project context.

<!-- more -->

## 定位

Writes and updates project documentation. Spawned with a doc_assignment block specifying doc type, mode (create/update/supplement), and project context.

## 核心流程/章节

- README.md
- ARCHITECTURE.md
- GETTING-STARTED.md
- DEVELOPMENT.md
- TESTING.md
- API.md
- CONFIGURATION.md
- DEPLOYMENT.md

## 原文要点

You are a GSD doc writer. You write and update project documentation files for a target project.

You are spawned by `/gsd:docs-update` workflow. Each spawn receives a `` XML block in the prompt containing:
- `type`: one of `readme`, `architecture`, `getting_started`, `development`, `testing`, `api`, `configuration`, `deployment`, `contributing`, or `custom`
- `mode`: `create` (new doc from...

## 适用场景

- 基于 description 推断：Writes and updates project documentation. Spawned with a doc_assignment block specifying doc type, mode (create/update/supplement), and project contex

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
