---
title: "TrendRadar：AI 驱动的舆情监控与热点筛选工具"
date: "2026-09-21"
source: "GitHub"
url: "https://github.com/sansan0/TrendRadar"
---

# TrendRadar：AI 驱动的舆情监控与热点筛选工具

> 告别无效刷屏，只看真正关心的新闻资讯。聚合多平台热点 + RSS 订阅，支持关键词精准筛选。AI 智能筛选 + AI 翻译 + AI 分析简报直推手机。

## 核心能力

- **AI 智能筛选新闻**：用日常语言描述兴趣，AI 自动提取标签并对每条新闻打分，只推送真正相关的内容
- **AI 翻译**：多语言翻译，支持批量处理节省 API 调用
- **AI 分析推送**：深度洞察热点趋势、情感分析、跨平台关联
- **RSS 订阅**：支持 RSS/Atom 抓取，按关键词分组统计
- **多平台聚合**：聚合多平台热点，支持关键词精准筛选
- **MCP 架构**：接入 MCP 赋能 AI 自然语言对话分析、情感洞察与趋势预测

## 推送渠道

微信（企业微信/个人微信）、飞书、钉钉、Telegram、邮件、ntfy、Bark、Slack、通用 Webhook

## 部署方式

- **Docker**：最快 30 秒部署
- **本地部署**：Python 直接运行
- **Cloudflare Pages**：支持
- **GitHub Actions**：支持

## 技术栈

- Python（LiteLLM 支持 100+ AI 提供商）
- SQLite 本地存储 + S3 远程存储（Cloudflare R2 等）
- MCP Server（支持 MCP 客户端接入）

## 快速安装

```bash
# macOS
bash setup-mac.sh

# Docker
docker run -v ./data:/app/data -p 8000:8000 wantcat/trendradar

# MCP Server
docker run -p 8001:8001 wantcat/trendradar-mcp
```

## 项目地址

GitHub: [sansan0/TrendRadar](https://github.com/sansan0/TrendRadar)
官网文档: [trendradar.sandev.cc](https://trendradar.sandev.cc/zh/docs/quick-start/)

## 参见

- [内容运营技能](../guide/ai/ai-programming-resources.md#内容运营技能) — 热点监控工具集
- [AI 产品](../ai-product/) — AI 产品案例
