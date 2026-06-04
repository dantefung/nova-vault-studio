---
title: "new-workspace"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# new-workspace

> Create an isolated workspace directory with git repo copies (worktrees or clones) and an independent `.planning/` directory. Supports multi-repo orchestration and single-repo feature branch isolation.

<!-- more -->

## 定位

Create an isolated workspace directory with git repo copies (worktrees or clones) and an independent `.planning/` directory. Supports multi-repo orchestration and single-repo feature branch isolation.

## 原文要点

## 1. Setup **MANDATORY FIRST STEP — Execute init command:** ```bash INIT=$(gsd-sdk query init.new-workspace) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse JSON for: `default_workspace_base`, `child_repos`, `child_repo_count`, `worktree_available`, `is_git_repo`, `cwd_repo_name`, `project_root`. ## 2. Parse Arguments Extract from $ARGUMENTS: - `--name` → `WORKSPACE_N

## 适用场景

- 基于 description 推断：Create an isolated workspace directory with git repo copies (worktrees or clones) and an independent `.planning/` directory. Supports multi-repo orche

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
