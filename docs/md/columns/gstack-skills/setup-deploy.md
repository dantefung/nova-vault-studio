---
title: "setup-deploy"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# setup-deploy

> Configure deployment settings for /land-and-deploy.

<!-- more -->

## 定位

Configure deployment settings for /land-and-deploy.

## 触发

- `configure deploy`
- `setup deployment`
- `set deploy platform`

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

Detects your deploy
platform (Fly.io, Render, Vercel, Netlify, Heroku, GitHub Actions, custom),
production URL, health check endpoints, and deploy status commands. Writes
the configuration to CLAUDE.md so all future deploys are automatic.
Use when: "setup deploy", "configure deployment", "set up land-and-deploy",
"how do I deploy with gstack", "add deploy...

## 适用场景

- 基于 description 推断：Configure deployment settings for /land-and-deploy.

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
