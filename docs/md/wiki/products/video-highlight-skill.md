---
title: "Video Highlight（AI视频高光剪辑）"
date: "2026-06-11"
---

# Video Highlight（AI视频高光剪辑）

> AI video highlight skill for agents: analyze videos, cut clips with FFmpeg, export subtitles, and generate a shareable recap page.

## Key Points

- **核心功能**：分析视频 → 构建带时间戳的高光计划 → FFmpeg 剪辑 + SRT 字幕 → 生成可分享回顾页面
- **支持场景**：长视频、会议、课程、直播、产品演示、短视频
- **兼容**：Claude Code / OpenClaw / Codex / 自定义 Agent 系统

## 工作流

```
输入视频 → Agent 分析 → 生成 clip_plan.json
                              ↓
              FFmpeg 剪辑 + SRT 字幕
                              ↓
                    生成可分享回顾页面
```

## 输出结构（clip_plan.json）

每个高光片段含：`start` / `end` / `title` / `summary` / `reason` / `score`（1-100）/ `tags` / `quote` / `takeaways` / `subtitles`。

## 输出页面

- 左侧主视频播放器
- 右侧可滚动高光播放列表
- 每条高光含预览图、摘要、引言、原因、分数、标签、要点

## 技术依赖

- Python 3.9+
- FFmpeg
- FFprobe

语音转写和多模态理解由 Agent 框架提供。

## 数据

- **7 Stars** · **2 Forks** · **18 Commits**
- MIT License

## Sources

- GitHub inhai-wiki/video-highlight-skill (2026-06-08)