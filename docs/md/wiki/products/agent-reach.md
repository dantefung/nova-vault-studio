---
title: "Agent-Reach（AI Agent互联网能力扩展）"
date: "2026-06-11"
---

# Agent-Reach（AI Agent互联网能力扩展）

> Give your AI agent eyes to see the entire internet. Read & search Twitter, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu — one CLI, zero API fees.

## Key Points

- **核心痛点解决**：AI Agent 能写代码改文档，但无法上网搜索/读取内容。Agent Reach 用一句话安装让 Agent 具备跨平台读取能力
- **设计理念**：脚手架而非框架，每个平台背后是一个独立上游工具，不满意可替换
- **安全特性**：Cookie 本地存储，不上传；安全模式（`--safe`）不自动装系统包

## 支持平台

| 平台 | 即装即用 | 需配置 |
|------|----------|--------|
| 网页读取（Jina Reader） | ✅ | — |
| YouTube 字幕 + 搜索 | ✅ | — |
| RSS 订阅 | ✅ | — |
| 全网搜索（Exa MCP） | — | 免费，无需 Key |
| GitHub 公开仓库 | ✅ | — |
| Twitter/X 读推文 | — | Cookie 登录 |
| B站 | ✅（本地） | 服务器需代理 |
| Reddit | — | `rdt login` |
| 微信公众号 | ✅ | — |
| 微博/雪球/抖音/LinkedIn/V2EX | ✅ | — |

## 安装

```bash
# 一句话安装（发给 Agent）
帮我安装 Agent Reach：https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md
```

## 数据

- **25.3k Stars** · **2.1k Forks** · **249 Commits** · **v1.4.0**
- MIT License

## Related Pages

- [products/agent-browser](products/agent-browser) — Agent 浏览器自动化
- [products/index](products/index) — AI 产品索引

## Sources

- GitHub Panniantong/Agent-Reach (2026-06-09)