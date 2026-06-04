---
title: "document-release"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# document-release

> Post-ship documentation update. (gstack)

<!-- more -->

## 定位

Post-ship documentation update. (gstack)

## 触发

- `update docs after ship`
- `document what changed`
- `post-ship docs`

## 核心流程/章节

- When to invoke this skill
- Preamble (run first)
- Plan Mode Safe Operations
- Skill Invocation During Plan Mode
- Skill routing
- AskUserQuestion Format
- Artifacts Sync (skill start)
- Model-Specific Behavioral Patch (claude)

## 原文要点

## When to invoke this skill

Reads all project docs, cross-references the
diff, builds a Diataxis coverage map (reference/how-to/tutorial/explanation),
updates README/ARCHITECTURE/CONTRIBUTING/CLAUDE.md to match what shipped,
detects architecture diagram drift, polishes CHANGELOG voice with a sell-test
rubric, cleans up TODOS, and optionally bumps VERSION. Surfaces documentation
debt in the PR...

## 适用场景

- 基于 description 推断：Post-ship documentation update. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
