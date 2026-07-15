---
title: "小宇宙播客也能转文章了！开源OnePod全套Skills"
date: "2026-06-24"
source: "空格丶"
url: "https://mp.weixin.qq.com/s/kRrTqdWHmMV5yb7vrQ6Mww"
---

## 核心内容

OnePod 全套 Skills 开源，6个 Skill 覆盖播客处理完整链路：小宇宙音频→Whisper转录→结构化文章。

## 6个Skill

| Skill | 功能 |
|-------|------|
| youtube-feed | 播客更新监控，内置30个YouTube频道 |
| youtube-transcript-cn | YouTube字幕提取（中→英→自动） |
| content-digest | 内容提炼，短版核心观点+长版叙事文章 |
| podcast-workflow | 主控编排器，一句话串起全流程 |
| podcast-script-generator | 口播脚本，改写成3-5分钟短视频文案 |
| xiaoyuzhou-to-article | 小宇宙转文章（音频→Whisper→标点润色→改写） |

## 技术方案

小宇宙链路：下载音频 → ffmpeg切片 → Groq Whisper转录 → Llama 3.3 70B标点润色 → Agent改写

## OnePod架构

- Agent Code + Loop：每天自动循环运行
- 飞书：CMS（编辑+存储）
- Cloudflare Worker：定时同步+网站部署
- Loop Engineer模式：抓取→处理→更新→自我纠正

## 核心理念

Skill是可以像乐高一样不断拼接的能力模块。遇到具体需求→写一个Skill解决→接入主流程→自动化。

## 关联概念

[[OnePod]] [[播客转文字]] [[Whisper]] [[Skill编排]] [[Loop Engineering]] [[ReadBuddy]]
