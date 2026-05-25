---
title: "cc-connect 多项目配置指南"
date: "2026-05-09"
source: "GitHub chenhg5/cc-connect"
url: "https://github.com/chenhg5/cc-connect"
---

# cc-connect 多项目配置指南

> cc-connect 是一款连接本地 AI 编程助手与消息平台的开源工具（Go 语言编写），支持 Claude Code、OpenAI Codex、Cursor Agent、Gemini CLI 等 10+ AI 编码助手，桥接至飞书、钉钉、Slack、Telegram、Discord、微博、LINE、企业微信、个人微信、QQ 等 11 个消息平台。大多数平台无需公网 IP。

---

## 核心概念

### 什么是 cc-connect

cc-connect 是一个本地运行的 AI 编程助手桥接器，将运行在你机器上的 AI 编码助手的输出实时同步到飞书、钉钉、Slack 等协作平台。单个进程可同时管理多个项目，每个项目绑定独立的 agent + 平台组合。

### 架构设计

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  AI Coding Agent│    │  cc-connect       │    │  消息平台        │
│  (Claude Code   │◄──►│  (单进程 Go 二进制) │◄──►│  (Feishu/Slack  │
│   Codex/Gemini/ │    │  • 会话管理       │    │   DingTalk/QQ/  │
│   Cursor...)    │    │  • Provider 路由  │    │   WeChat...)    │
│                 │    │  • 定时任务       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 支持的 AI 编码助手

| 助手 | 状态 | 说明 |
|------|------|------|
| Claude Code | ✅ 支持 | Anthropic 官方 CLI 工具 |
| Codex (OpenAI) | ✅ 支持 | OpenAI 官方编程 Agent |
| Cursor Agent | ✅ 支持 | Cursor AI 编辑器的 Agent 模式 |
| Gemini CLI (Google) | ✅ 支持 | Google Gemini 命令行工具 |
| Qoder CLI | ✅ 支持 | Qoder 编码 CLI |
| OpenCode (Crush) | ✅ 支持 | OpenCode 编码 Agent |
| iFlow CLI | ✅ 支持 | iFlow 编码 CLI |
| Kimi CLI (Moonshot) | ✅ 支持 | 月之暗面 Kimi 命令行工具 |
| Pi (Cursor Background Agent) | ✅ 支持 | Cursor 后台 Agent |
| ACP (Agent Client Protocol) | ✅ 支持 | 任何 ACP 兼容的 Agent |
| Devin (Cognition) | ✅ 支持 | 通过 ACP 协议接入 |
| Goose (Block) | 🔜 规划中 | Block 的 Agent |
| Aider | 🔜 规划中 | Aider 编码助手 |

### 支持的消息平台

| 平台 | 连接方式 | 需要公网 IP |
|------|----------|------------|
| 飞书 (Lark) | WebSocket | 否 |
| 钉钉 | Stream | 否 |
| Telegram | Long Polling | 否 |
| Slack | Socket Mode | 否 |
| Discord | Gateway | 否 |
| 微博 | WebSocket | 否 |
| LINE | Webhook | 是 |
| 企业微信 | WebSocket / Webhook | 否(WS) / 是(Webhook) |
| 个人微信 (ilink) | HTTP 长轮询 | 否 |
| QQ (NapCat/OneBot) | WebSocket | 否 |
| QQ Bot (官方) | WebSocket | 否 |

### 平台功能对标

| 能力 | 飞书 | 钉钉 | Telegram | Slack | Discord | LINE | 企微 | 微博 | 微信 | QQ |
|------|------|------|----------|-------|---------|------|------|------|------|-----|
| 文本和斜杠命令 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Markdown / 卡片 | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ |
| 流式输出 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 图片和文件 | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ✅ |
| 语音 / STT / TTS | ⚠️ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ | ✅ | ⚠️ |
| 私聊 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 群聊 / 频道 | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ✅ |

---

## 快速开始

### 安装

```bash
# npm（推荐）
npm install -g cc-connect

# Homebrew (macOS / Linux)
brew install cc-connect

# 下载二进制 (Linux amd64)
curl -L -o cc-connect https://github.com/chenhg5/cc-connect/releases/latest/download/cc-connect-linux-amd64
chmod +x cc-connect
sudo mv cc-connect /usr/local/bin/

# 从源码构建 (需要 Go 1.22+)
git clone https://github.com/chenhg5/cc-connect.git
cd cc-connect && make build
```

### 配置

**推荐：使用 Web UI 配置**

```bash
cc-connect web
```

打开浏览器管理面板，可视化创建项目、添加平台、管理 Provider、与 Agent 聊天。支持 5 种语言（中/英/繁中/日/西）。

**手动配置**

```bash
mkdir -p ~/.cc-connect
cp config.example.toml ~/.cc-connect/config.toml
vim ~/.cc-connect/config.toml
```

配置文件使用 **TOML** 格式，所有字符串值支持 `${VAR_NAME}` 环境变量替换。

### 飞书应用配置

在编写 TOML 配置之前，需要先在飞书开放平台创建应用：

1. 进入 [飞书开放平台](https://open.feishu.cn/)，创建企业自建应用，获取 **APP_ID** 和 **APP_SECRET**
2. 添加机器人能力
3. **事件订阅** → 选择"使用长连接接收事件"
4. 添加事件：`im.message.receive_v1`
5. **权限管理** → 添加 `im:message` 相关权限
6. 发布应用版本

完成后将 APP_ID 和 APP_SECRET 填入下方 TOML 配置的 `app_id` / `app_secret` 字段。

### 基础配置示例

```toml
# cc-connect 配置文件

[log]
level = "info"

# 全局 Provider（避免重复配置 API Key）
[[providers]]
name = "anthropic"
api_key = "${ANTHROPIC_API_KEY}"
agent_types = ["claudecode"]

# 项目配置
[[projects]]
name = "my-project"
work_dir = "/path/to/my-project"

[projects.agent]
type = "claudecode"
provider_refs = ["anthropic"]

[[projects.platforms]]
type = "feishu"
app_id = "${FEISHU_APP_ID}"
app_secret = "${FEISHU_APP_SECRET}"
```

### 启动服务

```bash
cc-connect
```

---

## 多项目配置

### 项目配置结构

cc-connect 使用 `[[projects]]` 段落配置多项目，每个项目绑定独立的 agent + 平台组合：

```toml
# 项目 A：使用 Claude Code + 飞书
[[projects]]
name = "frontend-app"
work_dir = "/home/user/projects/frontend"

[projects.agent]
type = "claudecode"
provider_refs = ["anthropic"]

[[projects.platforms]]
type = "feishu"
app_id = "${FEISHU_APP_ID}"
app_secret = "${FEISHU_APP_SECRET}"

# 项目 B：使用 Codex + Telegram
[[projects]]
name = "backend-api"
work_dir = "/home/user/projects/backend"

[projects.agent]
type = "codex"
provider_refs = ["minimaxi-codex"]

[[projects.platforms]]
type = "telegram"
token = "${TELEGRAM_BOT_TOKEN}"
```

### 显示模式（每个项目可覆盖）

```toml
[[projects]]
name = "quiet-project"

[projects.display]
mode = "quiet"          # full | compact | quiet
thinking_messages = false
tool_messages = false

# mode 含义：
# full:    显示思考 + 工具消息，每条单独发送
# compact: 隐藏思考/工具消息，每段文本独立发送
# quiet:   隐藏思考/工具消息，所有文本合并到同一张卡片，完成后发送 done emoji
```

### 会话管理与空闲重置

```toml
[[projects]]
name = "my-project"
work_dir = "/path/to/project"

# 用户空闲 30 分钟后自动切换到新会话（防止上下文漂移）
reset_on_idle_mins = 30   # 默认 30；设为 0 禁用

# Agent 空闲超时（两次事件之间的最大等待分钟数）
idle_timeout_mins = 120   # 默认 120（2 小时）；设为 0 禁用
```

### 仓库管理员

```toml
[[projects]]
name = "my-project"
work_dir = "/path/to/project"
admin_from = "alice,bob"  # 允许执行 /dir、/shell 等特权命令的用户 ID
```

### OS 用户隔离

```toml
[[projects]]
name = "claude-sandboxed"
work_dir = "/path/to/project"
run_as_user = "partseeker-coder"  # 以不同 Unix 用户运行 Agent
run_as_env = ["PGSSLROOTCERT"]     # 跨 sudo 边界传递的环境变量
```

启动前审计：

```bash
cc-connect doctor user-isolation
```

---

## 会话与指令控制

### 会话管理

| 指令 | 说明 |
|------|------|
| `/new [name]` | 开始新会话 |
| `/list` | 列出所有会话 |
| `/switch <id>` | 切换会话 |
| `/current` | 显示当前会话 |

### 权限模式

| 指令 | 说明 |
|------|------|
| `/mode` | 显示可用模式 |
| `/mode yolo` | 自动批准所有工具 |
| `/mode default` | 每个工具询问确认 |

### Provider 与模型切换

| 指令 | 说明 |
|------|------|
| `/provider list` | 列出所有 Provider |
| `/provider switch <name>` | 切换 API Provider |
| `/model` | 列出可用模型 |
| `/model switch <alias>` | 切换模型 |

### 工作目录

| 指令 | 说明 |
|------|------|
| `/dir` | 显示当前工作目录和历史 |
| `/dir <path>` | 切换到指定路径 |
| `/dir <number>` | 从历史中切换 |
| `/dir -` | 切换到上一个目录 |
| `/cd <path>` | `/dir` 的兼容别名 |

### 定时任务

```bash
/cron add 0 6 * * * 总结 GitHub trending
```

### Agent 附件回传

Agent 生成的本地截图、图表等文件可回传到聊天：

```bash
cc-connect send --image /absolute/path/to/chart.png
cc-connect send --file /absolute/path/to/report.pdf
```

配置控制：

```toml
attachment_send = "on"   # 默认开启；设为 "off" 禁止回传
```

支持回传的平台：飞书、Telegram

---

## Provider 管理

### 全局 Provider 定义

```toml
[[providers]]
name = "anthropic"
api_key = "${ANTHROPIC_API_KEY}"
agent_types = ["claudecode"]

[[providers]]
name = "minimaxi-claude"
api_key = "${MINIMAXI_API_KEY}"
base_url = "https://api.minimaxi.chat/v1"
agent_types = ["claudecode"]
model = "claude-sonnet-4-20250514"

[[providers]]
name = "dashscope"
api_key = "${DASHSCOPE_API_KEY}"
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
model = "glm-5.1"
thinking = "disabled"
```

项目通过 `provider_refs` 引用全局 Provider，避免重复配置。

### 运行时切换

在聊天中使用 `/provider switch` 和 `/model switch` 动态切换。

---

## 生命周期事件钩子

```toml
[[hooks]]
event = "message"      # message | session | cron | permission | error
type = "shell"         # shell | http
command = "echo 'new message'"
# 或 HTTP webhook:
# url = "https://example.com/webhook"
```

钩子默认异步执行，失败不阻断主流程。

---

## 故障排查

### AI 助手无响应

1. 检查 AI 助手是否正确安装
   ```bash
   claude --version        # Claude Code
   codex --version         # Codex
   gemini --version        # Gemini CLI
   ```
2. 检查 `work_dir` 目录权限
3. 查看日志输出

### 消息平台连接失败

1. 验证环境变量配置（`${VAR_NAME}` 格式）
2. 检查平台应用权限设置
3. 确认网络能访问平台 API
4. 飞书/钉钉等无需公网 IP；LINE Webhook 模式需要公网 URL

### 用 Web UI 排查

```bash
cc-connect web   # 打开管理面板，查看会话和状态
```

---

## 相关资源

- [cc-connect GitHub 仓库](https://github.com/chenhg5/cc-connect)
- [cc-connect 使用文档](https://github.com/chenhg5/cc-connect/blob/main/docs/usage.md)
- [cc-connect 安装指南（AI Agent 可读）](https://github.com/chenhg5/cc-connect/blob/main/INSTALL.md)
- [配置模板 config.example.toml](https://github.com/chenhg5/cc-connect/blob/main/config.example.toml)