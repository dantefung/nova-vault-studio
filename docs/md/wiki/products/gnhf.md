---
title: "gnhf"
date: "2026-05-22"
---

# gnhf

> "Good Night, Have Fun" — 让 AI 替你熬夜改代码，你只管睡觉。

## Core Capabilities

- **全自动编码循环**：写好一条指令，自动调用 Claude Code / Codex / Rovo Dev / OpenCode / GitHub Copilot CLI 等
- **自动 Git 提交**：每改一版自动生成提交记录
- **自动回滚重试**：遇到报错自动回滚并重试，全程不需要人工盯着
- **跨轮次记忆**：每次结果写入笔记，AI 清楚自己之前做过什么
- **指数退避策略**：连续失败时自动降频，不白白烧 token
- **Worktree 多实例**：支持同时跑多个智能体，彼此不干扰

## How It Works

```
gnhf start → validate clean git → create/use branch → write prompt.md
→ build iteration prompt (inject notes.md context) → invoke agent
→ success? → commit + append notes.md : reset/repair → retry
```

## Quick Start

```bash
# 安装
npm install -g gnhf

# 开始全自动循环
gnhf "reduce complexity of the codebase without changing functionality"

# 限制迭代次数和 token
gnhf "keep improving this app" --max-iterations 10 --max-tokens 5000000

# 多实例并行（使用 worktree）
gnhf --worktree "implement feature X" &
gnhf --worktree "add tests for module Y" &
```

## Platform

- macOS
- Linux
- Windows

## Sources

- https://github.com/kunchenguid/gnhf