---
title: "review"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# review

> Cross-AI peer review — invoke external AI CLIs to independently review phase plans.
Each CLI gets the same prompt (PROJECT.md context, phase plans, requirements) and
produces structured feedback. Resu

<!-- more -->

## 定位

Cross-AI peer review — invoke external AI CLIs to independently review phase plans.
Each CLI gets the same prompt (PROJECT.md context, phase plans, requirements) and
produces structured feedback. Results are combined into REVIEWS.md for the planner
to incorporate via --reviews flag.

This implements adversarial review: different AI models catch different blind spots.
A plan that survives review from 2-3 independent AI systems is more robust.

## 核心流程/章节

- detect_clis
- gather_context
- build_prompt
- invoke_reviewers
- write_reviews
- present_results

## 原文要点

Check which AI CLIs are available on the system: ```bash # Check each CLI command -v gemini >/dev/null 2>&1 && echo "gemini:available" || echo "gemini:missing" command -v claude >/dev/null 2>&1 && echo "claude:available" || echo "claude:missing" command -v codex >/dev/null 2>&1 && echo "codex:available" || echo "codex:missing" command -v coderabbit >/dev/null 2>&1 && echo "coderabbit:available" ||

## 适用场景

- 基于 description 推断：Cross-AI peer review — invoke external AI CLIs to independently review phase plans.
Each CLI gets the same prompt (PROJECT.md context, phase plans, re

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)
