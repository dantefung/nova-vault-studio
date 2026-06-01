---
title: "Cline Kanban"
source: "GitHub"
url: "https://github.com/orgs/cline/discussions"
date: "2026-05-31"
---

# Cline Kanban

本地并行跑多个 AI agent 的看板工具，解决 2026 年编码瓶颈——开发者注意力分散问题。

## 核心问题

早上 10:30，屏幕上 20 个终端窗口：agent 等确认 force push、40 分钟前跑完没人收、commit 走偏。每次切窗口花 30 秒~1 分钟重新载入上下文，一天累计吃掉一两个小时。

## 解决方案

`npx kanban` 启动本地看板，把每个 agent 任务变成一张卡。Claude Code、Codex、OpenCode、Cline CLI 都能在同一块板上混跑。

## 技术亮点

- **独立 worktree**：点 play 时用 git worktree 给每个任务建独立目录，各 agent 互不污染
- **共享依赖**：扫主仓 .gitignore，node_modules、.next、.cache 用 symlink 链回主仓——装一次，10 个并行任务从 30GB 降到 2.5GB
- **安全网**：任务拖进 Trash 先跑 `git diff --binary HEAD` 抓现场存 .patch 到 `~/.cline/kanban/trashed-task-patches/`，手抖删错 `git apply` 几秒还原

## 状态

Research Preview（v0.x），接口可能变更。

适合每天并行跑 3+ 个 agent、写 Node 项目、想横评 Claude Code 和 Codex 的人。