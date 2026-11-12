---
title: "cc-connect 配置模板（脱敏备份）"
date: "2026-08-03"
source: "内部运维实践"
url: ""
---

# cc-connect 配置模板（脱敏备份）

> 本文件是从 `/root/.cc-connect/config.toml` 脱敏后的备份，敏感信息已替换为 `<PLACEHOLDER>`。
> **更新：2026-08-03 修复 openmind 项目重复声明问题，合并为单一 [[projects]] 块**

```toml
# cc-connect configuration
# Docs: https://github.com/chenhg5/cc-connect

language = "zh"

[log]
level = "info"

# ========================= nova-vault-studio ====================

[[projects]]
name = "nova-vault-studio"

[projects.agent]
type = "opencode"

[projects.agent.options]
work_dir = "/opt/workspace/nova-vault-studio"
mode = "default"

model = "sense-nova/deepseek-v4-flash"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "<FEISHU_APP_ID>"
app_secret = "<FEISHU_APP_SECRET>"
allow_chat = "<FEISHU_CHAT_ID>"

[[projects.platforms]]
type = "weixin"

[projects.platforms.options]
token = "<WEIXIN_TOKEN>"
base_url = "https://ilinkai.weixin.qq.com"
account_id = "<WEIXIN_ACCOUNT_ID>"

# ========================= vast-dev-skill ====================

[[projects]]
name = "vast-dev-skill"

[projects.agent]
type = "opencode"

[projects.agent.options]
work_dir = "/opt/workspace/vast-dev-skill"
mode = "yolo"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "<FEISHU_APP_ID>"
app_secret = "<FEISHU_APP_SECRET>"
allow_chat = "<FEISHU_CHAT_ID>"

# ========================= vibe-writer ====================

[[projects]]
name = "vibe-writer"

[projects.agent]
type = "opencode"

[projects.agent.options]
work_dir = "/opt/workspace/vibe-writer"
mode = "yolo"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "<FEISHU_APP_ID>"
app_secret = "<FEISHU_APP_SECRET>"

# ========================= money-hub ====================

[[projects]]
name = "money-hub"

[projects.agent]
type = "opencode"

[projects.agent.options]
work_dir = "/opt/workspace/money-hub"
mode = "yolo"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "<FEISHU_APP_ID>"
app_secret = "<FEISHU_APP_SECRET>"

# ========================= gtd_todo ====================

[[projects]]
name = "gtd_todo"

[projects.agent]
type = "opencode"

[projects.agent.options]
work_dir = "/opt/workspace/gtd_todo"
mode = "yolo"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "<FEISHU_APP_ID>"
app_secret = "<FEISHU_APP_SECRET>"

# ========================= openmind ====================

[[projects]]
name = "openmind"

[projects.agent]
type = "opencode"

[projects.agent.options]
work_dir = "/opt/workspace/openmind"
mode = "yolo"

model = "sense-nova/deepseek-v4-flash"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "<FEISHU_APP_ID>"
app_secret = "<FEISHU_APP_SECRET>"

[[projects.platforms]]
type = "weixin"

[projects.platforms.options]
token = "<WEIXIN_TOKEN>"
base_url = "https://ilinkai.weixin.qq.com"
account_id = "<WEIXIN_ACCOUNT_ID>"

[[projects.platforms]]
type = "telegram"

[projects.platforms.options]
token = "<TG_BOT_TOKEN>"
proxy = "http://127.0.0.1:7890"
proxy_username = ""
proxy_password = ""
```

## 字段说明

| 字段 | 说明 |
|------|------|
| `language` | 语言，`zh` 或 `en` |
| `projects[n].name` | 项目名称，用于标识 |
| `projects[n].agent.type` | 编码助手类型：`claudecode` / `codex` / `cursor` / `gemini` / `qoder` / `opencode` / `iflow` |
| `projects[n].agent.options.work_dir` | 项目工作目录 |
| `projects[n].agent.options.mode` | 运行模式：`default` / `yolo` |
| `projects[n].agent.options.model` | Agent 模型（如 `sense-nova/deepseek-v4-flash`） |
| `projects[n].platforms[n].type` | 消息平台：`feishu` / `telegram` / `slack` / `dingtalk` / `discord` / `line` / `wechat_work` / `weixin` / `qq` |
| `projects[n].platforms.options.app_id` | 飞书应用 App ID |
| `projects[n].platforms.options.app_secret` | 飞书应用 App Secret |
| `projects[n].platforms.options.allow_chat` | 允许的飞书群聊 ID（可选） |
| `projects[n].platforms.options.token` | Telegram Bot Token / 微信 ilink Bearer Token |
| `projects[n].platforms.options.base_url` | 微信 ilink 网关地址，默认 `https://ilinkai.weixin.qq.com` |
| `projects[n].platforms.options.account_id` | 微信 ilink 账号 ID（用于多账号状态隔离） |
| `projects[n].platforms.options.proxy` | Telegram 代理地址 |

## 当前项目配置（2026-08-03 修复后）

| 项目 | 工作目录 | Agent | 模式 | 消息平台 |
|------|----------|-------|------|---------|
| nova-vault-studio | `/opt/workspace/nova-vault-studio` | opencode | default | 飞书 + 微信 |
| vast-dev-skill | `/opt/workspace/vast-dev-skill` | opencode | yolo | 飞书 |
| vibe-writer | `/opt/workspace/vibe-writer` | opencode | yolo | 飞书 |
| money-hub | `/opt/workspace/money-hub` | opencode | yolo | 飞书 |
| gtd_todo | `/opt/workspace/gtd_todo` | opencode | yolo | 飞书 |
| openmind | `/opt/workspace/openmind` | opencode | yolo | 飞书 + 微信 + Telegram |

## ⚠️ TOML 重复声明警告

**同一 `[[projects]]` name 重复声明会导致后者覆盖前者**，不是合并。

错误示例：
```toml
[[projects]]
name = "openmind"      # ← 第一次
[[projects.platforms]]
type = "feishu"        # ← 第一次的平台

[[projects]]
name = "openmind"      # ← 重复声明！会覆盖上面
[[projects.platforms]]
type = "telegram"      # ← 只有 telegram 生效，feishu 丢失
```

正确做法：在一个 `[[projects]]` 块内声明所有平台：
```toml
[[projects]]
name = "openmind"
[[projects.platforms]]
type = "feishu"
[[projects.platforms]]
type = "telegram"
```

## 相关文档

- [微信个人号接入指南](./weixin-setup.md)
- [飞书接入指南](./cc-connect-feishu-guide.md)
- [多项目配置指南](./cc-connect-multi-project-guide.md)
- [模型切换指南](./cc-connect-model-switch.md)
- [GitHub 仓库](https://github.com/chenhg5/cc-connect)
