---
title: "using-git-worktrees"
date: "2026-06-04"
source: "superpowers"
url: "https://github.com/obra/superpowers"
---

# using-git-worktrees

> Use when starting feature work that needs isolation from current workspace or before executing implementation plans - ensures an isolated workspace exists via native tools or git worktree fallback

<!-- more -->

## 定位

Use when starting feature work that needs isolation from current workspace or before executing implementation plans - ensures an isolated workspace exists via native tools or git worktree fallback

## 核心流程/章节

- Overview
- Step 0: Detect Existing Isolation
- Step 1: Create Isolated Workspace
- Step 3: Project Setup
- Step 4: Verify Clean Baseline
- Quick Reference
- Common Mistakes
- Red Flags

## 原文要点

# Using Git Worktrees

## Overview

Ensure work happens in an isolated workspace. Prefer your platform's native worktree tools. Fall back to manual git worktrees only when no native tool is available.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set...

## 适用场景

- 基于 description 推断：Use when starting feature work that needs isolation from current workspace or before executing implementation plans - ensures an isolated workspace ex

## 参见

- GitHub: [superpowers](https://github.com/obra/superpowers)
