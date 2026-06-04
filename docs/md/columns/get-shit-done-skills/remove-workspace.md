---
title: "remove-workspace"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# remove-workspace

> Remove a GSD workspace, cleaning up git worktrees and deleting the workspace directory.

<!-- more -->

## 定位

Remove a GSD workspace, cleaning up git worktrees and deleting the workspace directory.

## 原文要点

## 1. Setup Extract workspace name from $ARGUMENTS. ```bash INIT=$(gsd-sdk query init.remove-workspace "$WORKSPACE_NAME") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse JSON for: `workspace_name`, `workspace_path`, `has_manifest`, `strategy`, `repos`, `repo_count`, `dirty_repos`, `has_dirty_repos`. **If no workspace name provided:** First run `/gsd-list-workspaces` to

## 适用场景

- 基于 description 推断：Remove a GSD workspace, cleaning up git worktrees and deleting the workspace directory.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
