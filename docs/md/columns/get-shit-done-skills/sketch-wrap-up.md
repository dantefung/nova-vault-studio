---
title: "sketch-wrap-up"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# sketch-wrap-up

> Curate sketch design findings and package them into a persistent project skill for future
UI implementation. Reads from `.planning/sketches/`, writes skill to `./.claude/skills/sketch-findings-[projec

<!-- more -->

## 定位

Curate sketch design findings and package them into a persistent project skill for future
UI implementation. Reads from `.planning/sketches/`, writes skill to `./.claude/skills/sketch-findings-[project]/`
(project-local) and summary to `.planning/sketches/WRAP-UP-SUMMARY.md`.
Companion to `/gsd:sketch`.

## 核心流程/章节

- banner
- gather
- curate
- group
- skill_name
- copy_sources
- synthesize
- write_skill

## 原文要点

``` ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ GSD ► SKETCH WRAP-UP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ``` ## Gather Sketch Inventory 1. Read `.planning/sketches/MANIFEST.md` for the design direction and reference points 2. Glob `.planning/sketches/*/README.md` and parse YAML frontmatter from each 3. Check if `./.claude/skills/sketch-findings-*/SKILL.md` exists for th

## 适用场景

- 基于 description 推断：Curate sketch design findings and package them into a persistent project skill for future
UI implementation. Reads from `.planning/sketches/`, writes 

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
