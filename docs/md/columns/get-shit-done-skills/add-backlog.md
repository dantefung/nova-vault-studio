---
title: "add-backlog"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# add-backlog

> Add Backlog Item Workflow

<!-- more -->

## 定位

Add Backlog Item Workflow

## 原文要点

## Step 1: Read ROADMAP.md Check for existing backlog entries: ```bash cat .planning/ROADMAP.md ``` ## Step 2: Find next backlog number ```bash NEXT=$(gsd-sdk query phase.next-decimal 999 --raw) ``` If no 999.x phases exist yet, `phase.next-decimal` returns `999.1`. Sparse numbering is fine (e.g. 999.1, 999.3) — always use `phase.next-decimal`, never guess. ## Step 3: Write ROADMAP entry **Write t

## 适用场景

- 基于 description 推断：Add Backlog Item Workflow

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
