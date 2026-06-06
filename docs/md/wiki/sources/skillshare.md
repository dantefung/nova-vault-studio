---
title: "skillshare — 一个命令同步所有 AI CLI Skills 到60+ 平台（2.1k Stars）"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/runkids/skillshare"
---

# skillshare — 一个命令同步所有 AI CLI Skills 到 60+ 平台（2.1k Stars）

> One source of truth for AI CLI skills, agents, rules, commands & more. Sync everywhere with one command — from personal to organization-wide. Codex, Claude Code, OpenClaw, OpenCode & 60+ more.

<!-- more -->

## 核心问题

每个 AI CLI 都有自己的 skills 目录。在这个工具改一下，忘了同步到另一个，久了就不知道哪个版本在哪里了。

**skillshare 解决**：一个源，all agents，`skillshare sync`。

## 架构

```
~/.config/skillshare/
├── skills/    ← skills（SKILL.md）
├── agents/    ← agents
└── extras/   ← rules, commands, prompts 等
        ↓ sync
┌─────────┐ ┌──────────┐  ┌──────────┐
│ Claude │  │ OpenCode │  │ OpenClaw │  ... 60+
└─────────┘  └──────────┘  └──────────┘
```

| 平台 | Skills源 | Agents 源 | Extras 源 | 链接方式 |
|------|-----------|-----------|-----------|----------|
| macOS/Linux | `~/.config/skillshare/skills/` | `~/.config/skillshare/agents/` | `~/.config/skillshare/extras/` | Symlinks |
| Windows | `%AppData%\skillshare\` | | | NTFS Junctions（无需 admin） |

##核心功能

### 同步
```bash
skillshare init              # 创建 config、source 和检测到的 targets
skillshare sync             # 同步 skills 到所有 targets
skillshare sync --all       # 同步 skills + agents + extras
skillshare sync agents       # 仅同步 agents
```

### 安装 & 更新
```bash
skillshare install github.com/reponame/skills
skillshare update --all
```

### 安全审计
```bash
skillshare audit # 在 skills 到达 agent 前扫描 prompt injection 和数据泄露
```

### 项目级 Skills
```bash
skillshare init -p && skillshare sync   # per-repo，提交到代码仓库
```

### Extras 管理
```bash
skillshare extras init rules     # 创建 rules extra
skillshare sync --all           # 同步 skills + extras
skillshare extras collect rules # 收集本地文件回源
```

### Web Dashboard
```bash
skillshare ui # 可视化控制面板
```

### Git 工作流
```bash
skillshare commit -m "Update review skill"    # 本地 checkpoint，不 push
skillshare commit --dry-run
```

## 支持的平台（60+）

Claude Code、Codex、OpenClaw、OpenCode、Cursor、Gemini、Copilot 等

## 安装

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/runkids/skillshare/main/install.sh | sh

# Windows PowerShell
irm https://raw.githubusercontent.com/runkids/skillshare/main/install.ps1 | iex

# Homebrew
brew install skillshare

# GitHub Actions
- uses: runkids/setup-skillshare@v1
  with:
    source: ./skills
- run: skillshare sync
```

## 数据

- **2.1k Stars** · **130 Forks** · **165 Releases** · **1,775 Commits**
- Go 76.6% · TypeScript 18.8% · Shell 2.1% · CSS 2.0%
- MIT License
- 单二进制，无 registry，无 telemetry，完全离线可用