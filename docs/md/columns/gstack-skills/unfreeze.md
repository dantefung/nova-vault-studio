---
title: "unfreeze"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# unfreeze

> Clear the freeze boundary set by /freeze, allowing edits to all directories again. (gstack)

<!-- more -->

## 定位

Clear the freeze boundary set by /freeze, allowing edits to all directories again. (gstack)

## 触发

- `unfreeze edits`
- `unlock all directories`
- `remove edit restrictions`

## 核心流程/章节

- When to invoke this skill
- Clear the boundary

## 原文要点

## When to invoke this skill

Use when you want to widen edit scope without ending the session.
Use when asked to "unfreeze", "unlock edits", "remove freeze", or
"allow all edits".

# /unfreeze — Clear Freeze Boundary

Remove the edit restriction set by `/freeze`, allowing edits to all directories.

```bash
mkdir -p ~/.gstack/analytics
echo '{"skill":"unfreeze","ts":"'$(date -u...

## 适用场景

- 基于 description 推断：Clear the freeze boundary set by /freeze, allowing edits to all directories again. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
