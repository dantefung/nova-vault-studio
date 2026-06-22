---
title: "Agent Reach"
date: "2026-06-17"
source: "GitHub"
url: "https://github.com/Panniantong/agent-reach"
---

# Agent Reach

让 AI Agent 能够搜索和读取微信公众号等平台的开源工具。

**34,390 Stars · 2,745 Forks**

## 核心功能

- **多平台搜索**：Twitter、Reddit、YouTube、GitHub、Bilibili、小红书、微信公众号
- **零 API 费用**：无需付费 API Key
- **CLI 工具**：一个命令行工具搞定

## 安装

```bash
pipx install https://github.com/Panniantong/agent-reach/archive/main.zip
```

## 微信公众号支持

> ⚠️ v1.5.0 版本没有 `wechat.py`，需要手动从 v1.3.0 复制到 v1.5.0

**解决方案**：从 v1.3.0 版本的源码中提取 `wechat.py`，手动塞入 v1.5.0 目录。

## 用途

- 给 AI Agent 接入搜索能力
- 搜索微信公众号文章
- 无需官方 API 即可获取微信内容

## 相关

- [[ai-agent-search]] — AI Agent 搜索能力
- [[wechat-content-access]] — 微信公众号内容获取
