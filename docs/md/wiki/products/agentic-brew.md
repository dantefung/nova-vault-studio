---
title: "Agentic Brew"
date: "2026-05-24"
---

# Agentic Brew

> AI 驱动的新闻room，监控 AI 生态每个角落 — 新闻站、X、GitHub、Reddit、YouTube、Product Hunt、Hugging Face、arXiv 等 200+ 信息源，合成每日精选简报

**RSS 配置**：`https://www.agenticbrew.ai/llms.txt`

## Feeds

| Feed | 内容 |
|------|------|
| [News clusters](https://www.agenticbrew.ai/feed/news.xml) | 合成新闻簇 — 标题 + 多 bullet 概述 |
| [Twitter/X trending](https://www.agenticbrew.ai/feed/twitter.xml) | X 热门 AI 话题 + 最热推文和互动数据 |
| [GitHub trending](https://www.agenticbrew.ai/feed/github.xml) | GitHub 热门 AI 仓库，含 star 数和日增量 |
| [Reddit trending](https://www.agenticbrew.ai/feed/reddit.xml) | 精选子版块热门 AI 帖子 |
| [YouTube AI videos](https://www.agenticbrew.ai/feed/youtube.xml) | AI 视频 + AI 生成摘要 |
| [Product Hunt AI](https://www.agenticbrew.ai/feed/product_hunt.xml) | 热门 AI 产品发布 |
| [Skills](https://www.agenticbrew.ai/feed/skill.xml) | Top Claude Code skills（skills.sh + clawhub） |
| [Blog articles](https://www.agenticbrew.ai/feed/blog.xml) | 精选 AI 博客文章 + AI 摘要 |
| [Research papers](https://www.agenticbrew.ai/feed/paper.xml) | 论文 + AI 摘要、机构、来源、票数 |
| [Upcoming events](https://www.agenticbrew.ai/feed/event.xml) | 即将到来的 AI 活动 |
| [All signals (union)](https://www.agenticbrew.ai/feed/all.xml) | 所有信号并集，最新 100 条 |

## For AI Agents

Claude Code 插件（ai-news-radar）一键安装：
```bash
claude plugin install github:sunxiayi/awesome-ai-sources/plugins/ai-news-radar
```

暴露命令：`/ai-news-radar [feed] [--limit N] [--query KEYWORD] [--json]`

## Practical Answer Pages

- [How to keep up with AI without getting overwhelmed](https://www.agenticbrew.ai/answers/how-to-keep-up-with-ai-without-overwhelm)
- [Best AI news sources for builders](https://www.agenticbrew.ai/answers/best-ai-news-sources-for-builders)
- [Best sources for AI agents news and updates](https://www.agenticbrew.ai/answers/best-sources-for-ai-agents-news-and-updates)

## Source Directory

- [awesome-ai-sources](https://github.com/sunxiayi/awesome-ai-sources) — 200+ 信息源的开放目录