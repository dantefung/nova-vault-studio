---
title: "dispatching-parallel-agents"
date: "2026-06-04"
source: "superpowers"
url: "https://github.com/obra/superpowers"
---

# dispatching-parallel-agents

> Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies

<!-- more -->

## 定位

Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies

## 核心流程/章节

- Overview
- When to Use
- The Pattern
- Agent Prompt Structure
- Common Mistakes
- When NOT to Use
- Real Example from Session
- Key Benefits

## 原文要点

# Dispatching Parallel Agents

## Overview

You delegate tasks to specialized agents with isolated context. By precisely crafting their instructions and context, you ensure they stay focused and succeed at their task. They should never inherit your session's context or history — you construct exactly what they need. This also preserves your own context for coordination work.

When you have...

## 适用场景

- 基于 description 推断：Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies

## 参见

- GitHub: [superpowers](https://github.com/obra/superpowers)
