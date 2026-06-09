---
title: "refactoringhq/tolaria — Markdown 知识库桌面管理应用（14.1k Stars）"
date: "2026-06-09"
source: "GitHub"
url: "https://github.com/refactoringhq/tolaria"
---

# refactoringhq/tolaria — Markdown 知识库桌面管理应用（14.1k Stars）

> Desktop app to manage markdown knowledge bases. Files-first, Git-first, AI-first but not AI-only, Keyboard-first.

<!-- more -->

## 核心定位

跨平台（macOS/Windows/Linux）Markdown 知识库桌面应用。作者 Luca 用它管理 10,000+ 笔记的 Refactoring 工作 + 个人日记。

## 核心原则

| 原则 | 说明 |
|------|------|
| Files-first | 纯 Markdown 文件，无专有格式 |
| Git-first | 每个 vault 即 git 仓库，完整版本历史 |
| Offline-first, zero lock-in | 无账号/无订阅/无云依赖 |
| Open source | AGPL-3.0 |
| Standards-based | Markdown + YAML frontmatter |
| Types as lenses, not schemas | 类型是导航工具，非强制约束 |
| AI-first but not AI-only | 支持 Claude Code/Codex/Gemini CLI，也可手动编辑 |
| Keyboard-first | 为键盘操作用户设计 |

## 技术栈

- Tauri（Rust 后端）+ React + TypeScript
- 内置 MCP Server
- 支持 Claude Code / Codex / Gemini CLI setup path

## 安装

```bash
# Homebrew（macOS）
brew install --cask tolaria

# 下载 releases（所有平台）
https://refactoringhq.github.io/tolaria/download/
```

## 数据

- **14.1k Stars** · **982 Forks** · **3,046 Commits** · **AGPL-3.0**
- 另有 [tolaria-getting-started](https://github.com/refactoringhq/tolaria-getting-started) 入门 vault