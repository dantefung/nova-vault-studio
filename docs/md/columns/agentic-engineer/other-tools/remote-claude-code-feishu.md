---
title: "飞书 + Claude Code：远程指挥电脑干活"
author: "WangQingPing"
date: "2026-01-29"
source: "wangqingping.top"
url: "https://wangqingping.top/blog/post/remoteClaudeCode"
---

# 飞书 + Claude Code：远程指挥电脑干活

> 飞书机器人负责通信，Claude Code 当大脑指挥操作。无需公网 IP，群聊多人共享上下文。

---

## 核心架构

```
飞书群聊/私聊 → 飞书机器人 → WebSocket 长连接 → 本地 Python 服务 → Claude Code SDK → 电脑
```

跟 Clawdbot/Moltbot 同类思路，但用飞书替代 Telegram，无需对外暴露公网 IP。

---

## 飞书后台配置

1. 飞书开放平台 → 创建企业自建应用
2. 获取 App ID + App Secret
3. 添加机器人能力
4. 事件订阅选「使用长连接接收事件」，订阅 `接收消息`
5. 发布应用版本

---

## 本地 Python 服务核心设计

### 持久化：chat_id → session_id

Claude Code 靠 `session_id` 维护上下文。用飞书的 `chat_id` 做 key，SQLite 存映射：

```python
# 查询
def get_session(chat_id: str) -> str | None:
    cursor = conn.execute("SELECT session_id FROM sessions WHERE chat_id = ?", (chat_id,))
    ...

# 保存
def save_session(chat_id: str, session_id: str):
    conn.execute("INSERT OR REPLACE INTO sessions (chat_id, session_id) VALUES (?, ?)", ...)
```

### 消息队列：FIFO 串行处理

每个 `chat_id` 一个队列，保证消息按序处理、上下文不混乱：

```
入队 → 同 chat_id 进同队列 → worker FIFO 消费 → 队列空则移除线程
```

关键点：`_queue_lock` 保护队列创建/销毁/取消息操作，避免竞态。

### Claude Code 执行

通过官方 SDK `claude_agent_adk` 调用，需要开放权限：Read、Write、Edit、Bash、Glob、Grep。

---

## 与 cc-connect 对比

| 维度 | cc-connect | 本文方案 |
|------|-----------|---------|
| 部署 | 现成 Go 二进制 | 自建 Python 服务 |
| 配置 | TOML 配置文件 | 代码硬编码 |
| 持久化 | 内置 | SQLite 手写 |
| 消息队列 | 内置 | 手写线程队列 |
| 多平台 | 飞书/钉钉/Telegram/Slack 等 | 仅飞书 |
| 适合 | 开箱即用 | 深度定制理解原理 |

---

## 仓库地址

[GitHub: qingpingwang/remote-claude-code](https://github.com/qingpingwang/remote-claude-code)
