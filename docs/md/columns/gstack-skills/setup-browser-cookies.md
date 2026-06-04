---
title: "setup-browser-cookies"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# setup-browser-cookies

> Import cookies from your real Chromium browser into the headless browse session. (gstack)

<!-- more -->

## 定位

Import cookies from your real Chromium browser into the headless browse session. (gstack)

## 触发

- `import browser cookies`
- `login to test site`
- `setup authenticated session`

## 核心流程/章节

- When to invoke this skill
- Preamble (run first)
- Plan Mode Safe Operations
- Skill Invocation During Plan Mode
- Skill routing
- Artifacts Sync (skill start)
- Model-Specific Behavioral Patch (claude)
- Voice

## 原文要点

## When to invoke this skill

Opens an interactive picker UI where you select which cookie domains to import.
Use before QA testing authenticated pages. Use when asked to "import cookies",
"login to the site", or "authenticate the browser".

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check 2>/dev/null || .claude/skills/gstack/bin/gstack-update-check...

## 适用场景

- 基于 description 推断：Import cookies from your real Chromium browser into the headless browse session. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
