---
title: "Panniantong/Agent-Reach — 给 AI Agent 装上互联网能力（25.3k Stars）"
date: "2026-06-09"
source: "GitHub"
url: "https://github.com/Panniantong/Agent-Reach"
---

# Panniantong/Agent-Reach — 给 AI Agent 装上互联网能力（25.3k Stars）

> Give your AI agent eyes to see the entire internet. Read & search Twitter, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu — one CLI, zero API fees.

<!-- more -->

## 核心痛点解决

AI Agent 能写代码改文档，但无法上网搜索/读取内容。Agent Reach 用一句话安装让 Agent 具备跨平台读取能力。

## 安装

```bash
# 一句话安装（发给 Agent）
帮我安装 Agent Reach：https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md
```

## 支持平台

| 平台 | 即装即用 | 需配置 |
|-------|----------|--------|
| 网页读取（Jina Reader） | ✅ | — |
| YouTube 字幕 + 搜索 | ✅ | — |
| RSS 订阅 | ✅ | — |
| 全网搜索（Exa MCP） | — | 免费，无需 Key |
| GitHub 公开仓库 | ✅ | — |
| Twitter/X 读推文 | — | Cookie 登录 |
| B站 | ✅（本地） | 服务器需代理 |
| Reddit | — | `rdt login` |
| 小红书 | — | Cookie 登录 |
| 微信公众号 | ✅ | — |
| 微博/雪球/抖音/LinkedIn/V2EX | ✅ | — |

## 设计理念

**脚手架而非框架**。每个平台背后是一个独立上游工具（twitter-cli/rdt-cli/xhs-cli/yt-dlp/gh CLI 等），不满意可替换对应 channel 文件。

## 安全特性

- Cookie 本地存储（`~/.agent-reach/config.yaml`），不上传
- 安全模式（`--safe`）不自动装系统包
- 完全开源可审查

## 数据

- **25.3k Stars** · **2.1k Forks** · **249 Commits** · **v1.4.0**
- MIT License