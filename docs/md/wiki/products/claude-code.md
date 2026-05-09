---
title: "Claude Code"
date: "2026-05-09"
---

# Claude Code

> Anthropic 推出的 AI 编程 Agent，采用薄封装理念，通过 CLAUDE.md + .claude/ 目录配置驭化层。

## Core Capabilities

- AI 辅助编程：代码生成、审查、重构
- 长时间运行任务守护（ralph-wiggum 插件）
- 多 Agent 协作（vibedevteam 框架）
- Hooks 系统支持自定义逻辑

## Technical Highlights

- **薄 Harness 理念**：对模型最薄的封装，让模型本身更强
- **CLAUDE.md**：上下文工程层，≤100 行索引
- **.claude/hooks/**：事件驱动的自定义逻辑
- **.claude/skills/**：可复用工作流
- **MCP 服务器**：工具扩展
- **自动压缩**：上下文窗口管理

## Use Cases

- 日常编程辅助
- 代码审查和重构
- 长时间运行的自动化任务
- 多 Agent 协作开发

## Related Pages

- [concepts/harness-engineering](concepts/harness-engineering)
- [patterns/context-engineering](patterns/context-engineering)
- [comparisons/harness-vs-scaffolding](comparisons/harness-vs-scaffolding)
- [comparisons/ai-coding-tools](comparisons/ai-coding-tools)

## Sources

- docs/md/guide/ai/harness/ecosystem-tools-comparison.md
- docs/md/guide/ai/claude-code-resources.md
