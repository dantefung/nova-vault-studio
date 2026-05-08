---
title: "cc-connect 多项目配置指南"
date: "2026-05-08"
source: "GitHub libukai/cc-connect"
url: "https://github.com/libukai/cc-connect"
---

# cc-connect 多项目配置指南

> cc-connect 是一款连接 AI 编程助手与消息平台的开源工具，支持 Claude Code、OpenAI Codex、Cursor、 Gemini CLI 等主流 AI 编码工具，桥接至飞书、钉钉、Slack、Telegram、Discord 等消息平台。

---

## 核心概念

### 什么是 cc-connect

cc-connect 是一个多平台 AI 编程助手连接器，通过标准化的消息传递协议，将 AI 编码助手（Claude Code、Codex、Cursor 等）的输出实时同步到飞书、钉钉、Slack 等协作平台，同时支持接收人工审核指令并回传至 AI 助手。

### 架构设计

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  AI Coding Agent│    │  cc-connect       │    │  消息平台        │
│  (Claude Code   │◄──►│                  │◄──►│  (Feishu/Slack  │
│   Codex/Cursor) │    │  • 消息路由       │    │   DingTalk...)  │
│                 │    │  • 会话管理       │    │                 │
│                 │    │  • 指令转发       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 支持的 AI 编码助手

| 助手 | 状态 | 说明 |
|------|------|------|
| Claude Code | ✅ 稳定 | Anthropic 官方 CLI 工具 |
| OpenAI Codex | ✅ 稳定 | OpenAI 官方编程 Agent |
| Cursor | ✅ 稳定 | AI 代码编辑器 |
| Gemini CLI | ✅ 稳定 | Google Gemini 命令行工具 |
| Cursor Composer | 🔜 规划中 | Cursor 专业版功能 |
| Windsurf | 🔜 规划中 | Codeium 产品 |

### 支持的消息平台

| 平台 | 状态 | 审核模式 | 指令控制 |
|------|------|----------|----------|
| 飞书 | ✅ 稳定 | ✅ | ✅ |
| 钉钉 | ✅ 稳定 | ✅ | ✅ |
| Slack | ✅ 稳定 | ✅ | ✅ |
| Telegram | ✅ 稳定 | ✅ | ✅ |
| Discord | ✅ 稳定 | ✅ | ✅ |
| 企业微信 | 🔜 规划中 | 🔜 | 🔜 |

---

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/libukai/cc-connect.git
cd cc-connect

# 安装依赖
pnpm install

# 复制配置模板
cp config.example.yaml config.yaml
```

### 配置 AI 编码助手

编辑 `config.yaml`，配置至少一个 AI 编码助手：

```yaml
agents:
  claude_code:
    enabled: true
    command: "claude"
    args: ["--no-input"]
    workspace: "./workspace/claude"

  openai_codex:
    enabled: false
    command: "npx"
    args: ["@openai/codex", "--server"]
    workspace: "./workspace/codex"
```

### 配置消息平台

```yaml
platforms:
  feishu:
    enabled: true
    app_id: "${FEISHU_APP_ID}"
    app_secret: "${FEISHU_APP_SECRET}"
    bot_name: "AI 助手"
    sync_mode: "stream"  # stream | batch
```

### 启动服务

```bash
# 开发模式
pnpm dev

# 生产模式
pnpm build
pnpm start
```

---

## 多项目配置

### 项目目录结构

```
cc-connect/
├── config.yaml              # 主配置文件
├── projects/               # 多项目配置目录
│   ├── project-a/          # 项目 A 配置
│   │   ├── config.yaml     # 项目级覆盖配置
│   │   └── .env            # 项目环境变量
│   └── project-b/          # 项目 B 配置
│       └── config.yaml
├── workspaces/             # AI 助手工作区
│   ├── project-a/
│   └── project-b/
└── logs/                   # 日志目录
```

### 项目级配置覆盖

在 `projects/<project-name>/config.yaml` 中覆盖全局配置：

```yaml
# projects/project-a/config.yaml
agent:
  claude_code:
    workspace: "/workspace/project-a"
    system_prompt: "你是一个专精 React TypeScript 的高级工程师"

platform:
  feishu:
    chat_id: "oc_project_a_chat"
    mention_list:
      - "user_id_1"
      - "user_id_2"

notification:
  level: "verbose"  # minimal | normal | verbose
  include_files: true
```

### 使用项目启动

```bash
# 启动指定项目
cc-connect start --project project-a

# 启动所有项目（并行）
cc-connect start --all

# 查看项目状态
cc-connect status
```

---

## 消息同步模式

### 流式同步（Stream Mode）

实时同步 AI 输出的每一行，适合：
- 需要即时了解 AI 执行状态
- 有专人实时监控 AI 行为

```yaml
platforms:
  feishu:
    sync_mode: "stream"
    stream_interval: 100  # ms，发送间隔
```

### 批量同步（Batch Mode）

AI 完成一个完整任务后汇总发送，适合：
- 减少消息打扰
- 完整呈现 AI 思考过程

```yaml
platforms:
  feishu:
    sync_mode: "batch"
    batch_threshold: 5  # 任务完成后消息条数
    batch_timeout: 60  # 最大等待秒数
```

---

## 审核与指令控制

### 启用审核模式

```yaml
approval:
  enabled: true
  require_approval:
    - "file:write"      # 写文件
    - "bash:execute"     # 执行命令
    - "git:push"         # 推送代码
  auto_approved:
    - "file:read"        # 读文件自动通过
    - "file:list"        # 列出目录自动通过
```

### 审核消息格式

飞书收到审核消息示例：

```
🤖 AI 助手 申请执行操作

📋 操作类型: bash:execute
📝 命令: rm -rf node_modules/
💼 项目: project-a
⏰ 申请时间: 2026-05-08 10:30:00

[批准] [拒绝] [仅本次] [查看详情]
```

### 指令控制

在消息平台发送指令控制 AI：

| 指令 | 说明 | 示例 |
|------|------|------|
| `/approve <id>` | 批准操作 | `/approve abc123` |
| `/reject <id>` | 拒绝操作 | `/reject abc123` |
| `/pause` | 暂停 AI | `/pause` |
| `/resume` | 恢复 AI | `/resume` |
| `/status` | 查看状态 | `/status` |
| `/help` | 显示帮助 | `/help` |

---

## 环境变量参考

| 变量 | 说明 | 必填 |
|------|------|------|
| `FEISHU_APP_ID` | 飞书应用 App ID | 飞书启用时 |
| `FEISHU_APP_SECRET` | 飞书应用 App Secret | 飞书启用时 |
| `DINGTALK_APP_KEY` | 钉钉应用 Key | 钉钉启用时 |
| `DINGTALK_APP_SECRET` | 钉钉应用 Secret | 钉钉启用时 |
| `SLACK_BOT_TOKEN` | Slack Bot Token | Slack 启用时 |
| `SLACK_SIGNING_SECRET` | Slack 签名密钥 | Slack 启用时 |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | Telegram 启用时 |
| `DISCORD_BOT_TOKEN` | Discord Bot Token | Discord 启用时 |

---

## 故障排查

### AI 助手无响应

1. 检查 AI 助手是否正确安装
   ```bash
   claude --version  # Claude Code
   npx @openai/codex --version  # Codex
   ```
2. 检查 workspace 目录权限
3. 查看日志 `logs/agent.log`

### 消息平台连接失败

1. 验证环境变量配置
2. 检查平台应用权限设置
3. 确认网络能访问平台 API

### 审核消息未收到

1. 检查 webhook 配置是否正确
2. 确认机器人已被加入对应群组
3. 查看日志 `logs/platform.log`

---

## 相关资源

- [cc-connect GitHub 仓库](https://github.com/libukai/cc-connect)
- [cc-connect 官方文档](https://libukai.github.io/cc-connect/)
- [OpenClaw 配置指南](../openclaw/12-国内API配置指南.md) — 国内 API 配置
