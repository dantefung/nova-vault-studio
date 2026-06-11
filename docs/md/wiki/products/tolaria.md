---
title: "Tolaria（Markdown知识库桌面管理）"
date: "2026-06-11"
---

# Tolaria（Markdown知识库桌面管理）

> Desktop app to manage markdown knowledge bases. Files-first, Git-first, AI-first but not AI-only, Keyboard-first.

## Key Points

- **核心定位**：跨平台（macOS/Windows/Linux）Markdown 知识库桌面应用
- **核心原则**：Files-first + Git-first + Offline-first + AI-first but not AI-only + Keyboard-first
- **技术栈**：Tauri（Rust 后端）+ React + TypeScript，内置 MCP Server

## 核心原则

| 原则 | 说明 |
|------|------|
| Files-first | 纯 Markdown 文件，无专有格式 |
| Git-first | 每个 vault 即 git 仓库，完整版本历史 |
| Offline-first, zero lock-in | 无账号/无订阅/无云依赖 |
| Standards-based | Markdown + YAML frontmatter |
| AI-first but not AI-only | 支持 Claude Code/Codex/Gemini CLI，也可手动编辑 |
| Keyboard-first | 为键盘操作用户设计 |

## 安装

```bash
# Homebrew（macOS）
brew install --cask tolaria

# 下载 releases（所有平台）
https://refactoringhq.github.io/tolaria/download/
```

## 数据

- **14.1k Stars** · **982 Forks** · **3,046 Commits**
- AGPL-3.0

## Related Pages

- [concepts/llm-wiki](concepts/llm-wiki) — LLM Wiki 知识库模式
- [patterns/personal-ai-infrastructure](patterns/personal-ai-infrastructure) — 个人AI基础设施

## Sources

- GitHub refactoringhq/tolaria (2026-06-09)