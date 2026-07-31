---
title: "cc-connect 配置模板（脱敏备份）"
date: "2026-07-31"
source: "内部运维实践"
url: ""
---

# cc-connect 配置模板（脱敏备份）

> 本文件是从 `/root/.cc-connect/config.toml` 脱敏后的备份，敏感信息已替换为 `<PLACEHOLDER>`。

```toml
# cc-connect configuration
# Docs: https://github.com/chenhg5/cc-connect

language = "zh"

[log]
level = "info"

# ========================= project-1 ====================

[[projects]]
name = "<PROJECT_NAME>"

[projects.agent]
type = "opencode"

[projects.agent.options]
work_dir = "<WORK_DIR>"
mode = "default"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "<APP_ID>"
app_secret = "<APP_SECRET>"
allow_chat = "<CHAT_ID>"

# ========================= project-2 ====================

[[projects]]
name = "<PROJECT_NAME_2>"

[projects.agent]
type = "opencode"

[projects.agent.options]
work_dir = "<WORK_DIR_2>"
mode = "yolo"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "<APP_ID_2>"
app_secret = "<APP_SECRET_2>"
allow_chat = "<CHAT_ID_2>"
```

## 字段说明

| 字段 | 说明 |
|------|------|
| `language` | 语言，`zh` 或 `en` |
| `projects[n].name` | 项目名称，用于标识 |
| `projects[n].agent.type` | 编码助手类型：`claudecode` / `codex` / `cursor` / `gemini` / `qoder` / `opencode` / `iflow` |
| `projects[n].agent.options.work_dir` | 项目工作目录 |
| `projects[n].agent.options.mode` | 运行模式：`default` / `yolo` |
| `projects[n].platforms[n].type` | 消息平台：`feishu` / `telegram` / `slack` / `dingtalk` / `discord` / `line` / `wechat_work` / `weixin` / `qq` |
| `projects[n].platforms.options.app_id` | 飞书应用 App ID |
| `projects[n].platforms.options.app_secret` | 飞书应用 App Secret |
| `projects[n].platforms.options.allow_chat` | 允许的飞书群聊 ID |
| `projects[n].platforms.options.token` | Telegram Bot Token |
| `projects[n].platforms.options.proxy` | Telegram 代理地址 |

## 原配置项目结构

当前服务器配置了以下项目（均已脱敏）：

| 项目 | 工作目录 | Agent 类型 | 消息平台 |
|------|----------|-----------|---------|
| nova-vault-studio | `/opt/workspace/nova-vault-studio` | opencode | 飞书 |
| vast-dev-skill | `/opt/workspace/vast-dev-skill` | opencode | 飞书 |
| vibe-writer | `/opt/workspace/vibe-writer` | opencode | 飞书 |
| money-hub | `/opt/workspace/money-hub` | opencode | 飞书 |
| gtd_todo | `/opt/workspace/gtd_todo` | opencode | 飞书 |
| openmind | `/opt/workspace/openmind` | opencode | 飞书 |
| openmind | `/opt/workspace/openmind` | opencode | Telegram |

## 相关文档

- [飞书接入指南](./cc-connect-feishu-guide.md)
- [多项目配置指南](./cc-connect-multi-project-guide.md)
- [模型切换指南](./cc-connect-model-switch.md)
- [GitHub 仓库](https://github.com/chenhg5/cc-connect)