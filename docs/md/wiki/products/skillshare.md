---
title: "SkillShare（AI CLI Skills跨平台同步）"
date: "2026-06-11"
---

# SkillShare（AI CLI Skills跨平台同步）

> One source of truth for AI CLI skills, agents, rules, commands & more. Sync everywhere with one command — Codex, Claude Code, OpenClaw, OpenCode & 60+ more.

## Key Points

- **核心问题**：每个 AI CLI 都有自己的 skills 目录，在这个工具改一下，忘了同步到另一个，久了就不知道哪个版本在哪里了
- **解决方案**：一个源，all agents，`skillshare sync`
- **60+ 平台支持**：Claude、OpenCode、OpenClaw 等

## 架构

```
~/.config/skillshare/
├── skills/    ← skills（SKILL.md）
├── agents/    ← agents
└── extras/   ← rules, commands, prompts 等
        ↓ sync
┌─────────┐ ┌──────────┐  ┌──────────┐
│ Claude │  │ OpenCode │  │ OpenClaw │  ... 60+
└─────────┘└──────────┘  └──────────┘
```

## 核心功能

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

## 数据

- **2.1k Stars**
- 60+ 平台支持

## Sources

- GitHub runkids/skillshare (2026-06-04)