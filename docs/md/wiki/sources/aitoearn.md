---
title: "AiToEarn — AI 全自动自媒体内容生产与多平台分发变现平台（18.2k Stars）"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/yikart/AiToEarn"
---

# AiToEarn — AI 全自动自媒体内容生产与多平台分发变现平台（18.2k Stars）

> Let's use AI to Earn! 视频和图文全靠 AI 自动生成，抖音/小红书/B站/TikTok 全平台分发，点赞/关注/评论回复自动化，CPS/CPM 变现。普通人网页直接用，开发者 MIT 随便改，团队三行 Docker 部署。

<!-- more -->

## 核心定位

OPC（一人公司）的 AI 内容营销智能体。围绕内容创作者完整变现链路，提供四大 Agent 能力：

- **Monetize** — 内容赚钱（CPS/CPE/CPM 结算）
- **Publish** — 内容发布（一键分发 10+ 平台）
- **Engage** — 内容互动（自动点赞/关注/AI 评论回复）
- **Create** — 内容创作（AI 视频生成 + 图文生成）

## 支持平台

| 平台 | 发布 | 互动 |
|------|------|------|
| 抖音 | ✅ | ✅ |
| 小红书（Rednote） | ✅ | ✅ |
| 快手 | ✅ | ✅ |
| B站 | ✅ | ✅ |
| 视频号 | ✅ | ✅ |
| TikTok | ✅ | ✅ |
| YouTube | ✅ | ✅ |
| Facebook | ✅ | ✅ |
| Instagram | ✅ | ✅ |
| Threads | ✅ | ✅ |
| X（Twitter） | ✅ | ✅ |
| Pinterest | ✅ | ✅ |
| LinkedIn | ✅ | ✅ |

## 核心功能详解

### Monetize —— 内容赚钱

三种结算模式：
- **CPS**（Cost Per Sale）：按成交额结算
- **CPE**（Cost Per Engagement）：按互动量结算
- **CPM**（Cost Per Mille）：按播放量结算

### Publish —— 内容发布 Agent

- 一键分发到全球 10+ 主流平台，日历排期统一规划发布时间

### Engage —— 内容互动 Agent

- 浏览器插件实现自动点赞、收藏、关注
- AI 智能回复：调用大模型为每条评论生成针对性回复
- 评论挖掘：识别"求链接""怎么购买"等高转化信号
- 品牌监测：实时追踪品牌讨论，主动参与热点话题

### Create —— 内容创作 Agent

- **视频**：Agent 调用视频生成模型（Grok/Veo/Seedance）+ 视频翻译 + 剪辑，一站式完成
- **图文**：调用 Nano Banana 等顶级图片模型，自动生成高质量图文
- **批量生成**：并行生成多条内容，适合矩阵账号运营

## 使用方式

| 方式 | 适合谁 | 需要部署 |
|------|--------|----------|
| ① 网页直接用 | 所有用户 | ❌ |
| ② OpenClaw（龙虾）中用 | 龙虾用户 | ❌ |
| ③ Claude/Cursor AI 助手中用（MCP） | AI 工具用户 | ❌ |
| ④ Docker 一键部署 | 私有化部署团队 | ✅ |
| ⑤ 源码开发 | 开发者 | ✅ |

### MCP 接入（方式③）

任何兼容 MCP 的 AI 助手，只需配置：
- **MCP 地址**：`https://aitoearn.ai/api/unified/mcp`
- **认证 Header**：`x-api-key: 你的API-Key`

### Docker 部署（方式④）

```bash
git clone https://github.com/yikart/AiToEarn.git
cd AiToEarn
docker compose up -d
```

## 技术栈

- **Electron + React** — 桌面客户端
- **TypeScript 56.1%** · JavaScript 35% · CSS 7.6%
- **MCP 协议支持** — 可接入任何 MCP 兼容 Agent

## 数据

- **18.2k Stars** · **2.8k Forks** · **2,601 Commits** · **27 Releases**
- MIT License

## 相关项目

MoneyPrinterTurbo、NarratoAI、MuseTalk、video_spider、CosyVoice、facefusion