---
title: "mvanhorn/last30days-skill — 近30天趋势研究 Skill（36.5k Stars）"
date: "2026-06-09"
source: "GitHub"
url: "https://github.com/mvanhorn/last30days-skill"
---

# mvanhorn/last30days-skill — 近30天趋势研究 Skill（36.5k Stars）

> AI agent skill that researches any topic across Reddit, X, YouTube, HN, Polymarket, and the web — then synthesizes a grounded summary.

<!-- more -->

## 核心功能

- 跨平台聚合搜索：Reddit / X / YouTube / TikTok / Instagram / Hacker News / Polymarket / GitHub / Bluesky / 小红书 / Threads / Pinterest
- 按真实参与度评分（ upvotes / likes / real money）而非编辑推荐
- AI agent 综合摘要 + 可分享 HTML brief
- 智能源解析：输入人名/公司名自动解析相关 X handle、GitHub repo、subreddit
- 支持 `/last30days --competitors` 自动发现竞品并并行比较

## 平台覆盖

| 平台 | 功能 | 费用 |
|------|------|------|
| Reddit + HN + Polymarket + GitHub | 即装即用 | 免费 |
| X/Twitter | 需登录 cookie | 免费 |
| YouTube | 字幕提取 + 搜索 | 免费（yt-dlp） |
| TikTok + Instagram + Threads | ScrapeCreators API | 免费额度后 PAYG |
| Bluesky | App password | 免费 |
| Perplexity Sonar | 需要 OpenRouter key | PAYG |

## 安装

```bash
# Claude Code（推荐）
/plugin marketplace add mvanhorn/last30days-skill

# 其他 CLI（Codex/Cursor/Copilot/Gemini CLI 等）
npx skills add mvanhorn/last30days-skill -g
```

## 输出示例

`/last30days OpenClaw` → 输出：GitHub stars 351K、r/ClaudeCode 社区评价（227 upvotes）、v3 核心特性、v2 vs v3 对比

## 数据

- **36.5k Stars** · **3k Forks** · **623 Commits** · **v3.3.0**
- MIT License