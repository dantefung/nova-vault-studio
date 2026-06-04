---
title: "subagent-driven-development"
date: "2026-06-04"
source: "superpowers"
url: "https://github.com/obra/superpowers"
---

# subagent-driven-development

> Use when executing implementation plans with independent tasks in the current session

<!-- more -->

## 定位

Use when executing implementation plans with independent tasks in the current session

## 核心流程/章节

- When to Use
- The Process
- Model Selection
- Handling Implementer Status
- Prompt Templates
- Example Workflow
- Advantages
- Red Flags

## 原文要点

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Why subagents:** You delegate tasks to specialized agents with isolated context. By precisely crafting their instructions and context, you ensure they stay focused and succeed at their task. They should never inherit your...

## 适用场景

- 基于 description 推断：Use when executing implementation plans with independent tasks in the current session

## 参见

- GitHub: [superpowers](https://github.com/obra/superpowers)
