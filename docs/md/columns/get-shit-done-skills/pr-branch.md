---
title: "pr-branch"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# pr-branch

> Create a clean branch for pull requests by filtering out transient .planning/ commits.
The PR branch contains only code changes and structural planning state — reviewers
don't see GSD transient artifa

<!-- more -->

## 定位

Create a clean branch for pull requests by filtering out transient .planning/ commits.
The PR branch contains only code changes and structural planning state — reviewers
don't see GSD transient artifacts (PLAN.md, SUMMARY.md, CONTEXT.md, RESEARCH.md, etc.)
but milestone archives, STATE.md, ROADMAP.md, and PROJECT.md changes are preserved.

Uses git cherry-pick with path filtering to rebuild a clean history.

## 核心流程/章节

- detect_state
- analyze_commits
- create_pr_branch
- verify

## 原文要点

Parse `$ARGUMENTS` for target branch (default: `main`). ```bash CURRENT_BRANCH=$(git branch --show-current) TARGET=${1:-main} ``` Check preconditions: - Must be on a feature branch (not main/master) - Must have commits ahead of target ```bash AHEAD=$(git rev-list --count "$TARGET".."$CURRENT_BRANCH" 2>/dev/null) if [ "$AHEAD" = "0" ]; then echo "No commits ahead of $TARGET — nothing to filter." ex

## 适用场景

- 基于 description 推断：Create a clean branch for pull requests by filtering out transient .planning/ commits.
The PR branch contains only code changes and structural plannin

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
