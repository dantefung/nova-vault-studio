---
title: "list-workspaces"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# list-workspaces

> List all GSD workspaces found in ~/gsd-workspaces/ with their status.

<!-- more -->

## 定位

List all GSD workspaces found in ~/gsd-workspaces/ with their status.

## 原文要点

## 1. Setup ```bash INIT=$(gsd-sdk query init.list-workspaces) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse JSON for: `workspace_base`, `workspaces`, `workspace_count`. ## 2. Display **If `workspace_count` is 0:** ``` No workspaces found in ~/gsd-workspaces/ Create one with: /gsd:workspace --new --name my-workspace --repos repo1,repo2 ``` Done. **If workspaces exist

## 适用场景

- 基于 description 推断：List all GSD workspaces found in ~/gsd-workspaces/ with their status.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
