---
title: "update"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# update

> Check for GSD updates via npm, display changelog for versions between installed and latest, obtain user confirmation, and execute clean installation with cache clearing.

<!-- more -->

## 定位

Check for GSD updates via npm, display changelog for versions between installed and latest, obtain user confirmation, and execute clean installation with cache clearing.

## 核心流程/章节

- get_installed_version
- check_latest_version
- compare_versions
- show_changes_and_confirm
- backup_custom_files
- run_update
- display_result
- check_local_patches

## 原文要点

Detect whether GSD is installed locally or globally by checking both locations and validating install integrity. First, derive `PREFERRED_CONFIG_DIR` and `PREFERRED_RUNTIME` from the invoking prompt's `execution_context` path: - If the path contains `/get-shit-done/workflows/update.md`, strip that suffix and store the remainder as `PREFERRED_CONFIG_DIR` - Path contains `/.codex/` -> `codex` - Path

## 适用场景

- 基于 description 推断：Check for GSD updates via npm, display changelog for versions between installed and latest, obtain user confirmation, and execute clean installation w

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
