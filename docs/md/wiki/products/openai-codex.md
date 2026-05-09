---
title: "OpenAI Codex"
date: "2026-05-09"
---

# OpenAI Codex

> OpenAI 官方推出的编程 Agent，Harness Engineering 概念的原始实践平台。

## Core Capabilities

- AI 自治编程：从需求到 PR 合并的完整流程
- 基于 git worktree 的任务隔离沙箱
- 双向 JSON-RPC API
- 流式工具调用结果

## Technical Highlights

- **App Server 架构**：统一 Web/CLI/IDE 通信
- **AGENTS.md**：驭化层主配置（≤100 行）
- **skills/ 目录**：技能文档组织
- **Human-in-the-loop**：敏感操作确认流程

## Use Cases

- 大规模自动化编程
- 代码审查和重构
- 多任务并行处理

## Related Pages

- [concepts/harness-engineering](concepts/harness-engineering)
- [patterns/context-engineering](patterns/context-engineering)
- [comparisons/ai-coding-tools](comparisons/ai-coding-tools)
- [comparisons/harness-vs-scaffolding](comparisons/harness-vs-scaffolding)

## Sources

- docs/md/guide/ai/harness/ecosystem-tools-comparison.md
