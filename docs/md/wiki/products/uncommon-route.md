---
title: "UncommonRoute"
date: "2026-05-22"
---

# UncommonRoute

> 本地运行的 AI Router，根据任务难度自动匹配最合适的模型，日常 coding agent 可节省 80-90% API 成本。

## Core Capabilities

- **本地运行**：完全本地部署，无需云服务
- **智能路由**：根据任务难度自动匹配最合适的模型
- **成本优化**：简单任务走便宜模型，难的任务才上 Opus
- **零配置**：`pipx install uncommon-route` 一行代码搞定
- **多平台兼容**：Claude Code / Cursor / Codex 都能用

## Technical Highlights

- 实测 SWE-bench 上大幅减少花费，质量不掉
- 自动任务拆解与模型匹配
- 支持主流 Coding Agent

## Sources

- https://github.com/CommonstackAI/UncommonRoute