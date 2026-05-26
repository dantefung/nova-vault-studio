---
title: "grok-cli"
date: "2026-05-24"
---

# grok-cli

> 终端优先、可脚本化、Agent 就绪的 Grok / xAI CLI，集成了 SKILL 和 Rust CLI

## Core Features

- **OAuth 认证**：SuperGrok 或 X Premium+ 登录，无需 API key
- **扁平命令面**：一个 CLI 搞定 chat、search、image、video、audio、usage
- **默认流式输出**：人类可读文本，`--json` 适配自动化
- **媒体输入**：本地文件和远程 URL（image、video、audio）
- **跨平台**：macOS Apple Silicon 和 Windows x64 预构建

## Installation

```bash
# Agent 运行时（推荐）
npx --yes skills add Moore-developers/grok-cli --skill grok-cli --global --yes

# 源码安装（Rust 1.88+）
cargo install --git https://github.com/Moore-developers/grok-cli.git --locked

# Release binary
# 从 GitHub Releases 下载
```

## Commands

| Command | Description |
|---------|-------------|
| `login` | 启动 xAI OAuth 浏览器登录 |
| `status` | 检查 OAuth 会话状态 |
| `refresh` | 刷新保存的 access token |
| `logout` | 删除本地 auth 状态 |
| `chat` | 与 Grok 文本聊天（默认含网络搜索） |
| `search` | 通过 Grok `x_search` 搜索 X |
| `image` | 生成图片 |
| `image-edit` | 编辑参考图片 |
| `video` | 生成视频 |
| `video-edit` | 编辑视频 |
| `video-extend` | 延长视频 |
| `tts` | 文本转语音 |
| `stt` | 语音转文本 |
| `usage` | 显示会话用量和限流快照 |
| `model` | 设置默认文本模型 |

## JSON Output

所有命令支持 `--json` 输出稳定结构化数据：

```json
{
  "ok": true,
  "command": "chat",
  "data": {}
}
```

## For AI Agents

为 Codex、Claude Code、Cursor 等 Agent 运行时设计。安装 bundled skill 自动处理认证、命令路由和安装检查：

```bash
npx --yes skills add Moore-developers/grok-cli --skill grok-cli --global --yes
```

## State

- **Auth tokens**: `~/.grok-cli/auth.json`
- **Usage history**: `~/.grok-cli/session.db` (SQLite)

## Resources

- [GitHub](https://github.com/Moore-developers/grok-cli)