---
title: "reapply-patches"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# reapply-patches

> Reapply Local Patches Workflow

<!-- more -->

## 定位

Reapply Local Patches Workflow

## 原文要点

## Step 1: Detect backed-up patches Check for local patches directory: ```bash expand_home() { case "$1" in "~/"*) printf '%s/%s\n' "$HOME" "${1#~/}" ;; *) printf '%s\n' "$1" ;; esac } PATCHES_DIR="" # Env overrides first — covers custom config directories used with --config-dir if [ -n "$KILO_CONFIG_DIR" ]; then candidate="$(expand_home "$KILO_CONFIG_DIR")/gsd-local-patches" if [ -d "$candidate" 

## 适用场景

- 基于 description 推断：Reapply Local Patches Workflow

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
