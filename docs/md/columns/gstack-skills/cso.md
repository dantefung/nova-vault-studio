---
title: "cso"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# cso

> Chief Security Officer mode. (gstack)

<!-- more -->

## 定位

Chief Security Officer mode. (gstack)

## 触发

- `security audit`
- `check for vulnerabilities`
- `owasp review`

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

Infrastructure-first security audit: secrets archaeology,
dependency supply chain, CI/CD pipeline security, LLM/AI security, skill supply chain
scanning, plus OWASP Top 10, STRIDE threat modeling, and active verification.
Two modes: daily (zero-noise, 8/10 confidence gate) and comprehensive (monthly deep
scan, 2/10 bar). Trend tracking across audit runs.
Use when:...

## 适用场景

- 基于 description 推断：Chief Security Officer mode. (gstack)

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
