---
title: "follow-builders"
date: "2026-05-24"
---

# Follow Builders, Not Influencers

> AI 驱动的每日/每周摘要，跟踪 AI 领域真正的建设者（研究员、创始人、PM、工程师）的观点和作品

**理念**：关注做产品、有原创观点的人，而非复读信息的网红。

## Core Features

- **每日/每周摘要**：投送到 Telegram、Discord、WhatsApp 等消息应用
- **25 位精选 AI Builder 的 X/Twitter 摘要**
- **6 档精选播客节目摘要**（Latent Space、No Priors、Unsupervised Learning 等）
- **官方 AI 博客全文**（Anthropic Engineering、Claude Blog）
- **中英双语或纯英文可选**
- **无需 API Key**：所有内容集中获取，无隐私泄露

## Default Sources

### Podcasts (6)
- Latent Space
- Training Data
- No Priors
- Unsupervised Learning
- The MAD Podcast with Matt Turck
- AI & I by Every

### AI Builders on X (25)
Andrej Karpathy, Swyx, Josh Woodward, Kevin Weil, Peter Yang, Nan Yu, Madhu Guru, Amanda Askell, Cat Wu, Thariq, Google Labs, Amjad Masad, Guillermo Rauch, Alex Albert, Aaron Levie, Ryo Lu, Garry Tan, Matt Turck, Zara Zhang, Nikunj Kothari, Peter Steinberger, Dan Shipper, Aditya Agarwal, Sam Altman, Claude

### Official Blogs
- Anthropic Engineering — 技术深度解析
- Claude Blog — 产品更新

## Installation

### Claude Code
```bash
git clone https://github.com/zarazhangrui/follow-builders.git ~/.claude/skills/follow-builders
cd ~/.claude/skills/follow-builders/scripts && npm install
```

### OpenClaw
```bash
git clone https://github.com/zarazhangrui/follow-builders.git ~/skills/follow-builders
cd ~/skills/follow-builders/scripts && npm install
```

## How It Works

1. 中央源每日更新（博客爬取 + YouTube 字幕 via Supadata + X API）
2. Agent 一次 HTTP 请求获取 feed，无需 API key
3. Agent 按偏好重混内容生成摘要
4. 投送到消息应用或在聊天中展示

## Customization

可通过对话配置：
- "切换到每周一早晨的摘要"
- "语言改为中文"
- "让摘要更简短"

或直接编辑 `prompts/` 下的文件：
- `summarize-podcast.md` — 播客摘要方式
- `summarize-tweets.md` — Twitter 摘要方式
- `summarize-blogs.md` — 博客摘要方式
- `digest-intro.md` — 整体摘要格式和语调

## Resources

- [GitHub](https://github.com/zarazhangrui/follow-builders)