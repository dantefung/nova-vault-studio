---
title: "spike-wrap-up"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# spike-wrap-up

> Package spike experiment findings into a persistent project skill — an implementation blueprint
for future build conversations. Reads from `.planning/spikes/`, writes skill to
`./.claude/skills/spike-

<!-- more -->

## 定位

Package spike experiment findings into a persistent project skill — an implementation blueprint
for future build conversations. Reads from `.planning/spikes/`, writes skill to
`./.claude/skills/spike-findings-[project]/` (project-local) and summary to
`.planning/spikes/WRAP-UP-SUMMARY.md`. Companion to `/gsd:spike`.

## 核心流程/章节

- banner
- gather
- auto_include
- group
- skill_name
- copy_sources
- synthesize
- write_skill

## 原文要点

``` ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ GSD ► SPIKE WRAP-UP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ``` ## Gather Spike Inventory 1. Read `.planning/spikes/MANIFEST.md` for the overall idea context and requirements 2. Glob `.planning/spikes/*/README.md` and parse YAML frontmatter from each 3. Check if `./.claude/skills/spike-findings-*/SKILL.md` exists for this proj

## 适用场景

- 基于 description 推断：Package spike experiment findings into a persistent project skill — an implementation blueprint
for future build conversations. Reads from `.planning/

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
