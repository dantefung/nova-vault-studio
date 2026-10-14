---
title: "viral-content-monitoring"
date: "2026-10-14"
source: "wiki-ingest"
---

# 爆款监控工作流

> 自动化监控对标账号的爆款内容，发现后推送给创作者用于二次创作或复用的工作流。

## 核心流程

1. 选定对标账号列表
2. 设置定时扫描（每小时扫描最近24小时帖子）
3. 爆款判断阈值（如曝光数据每小时超过5000）
4. 自动推送符合条件的帖子
5. 人工筛选后发帖
6. 等待数据反馈复盘

## 关键设计决策

- **夜里不扫描**：睡着时即使有爆款也看不到，浪费推送
- **每日基准轮**：早上6点先获取一轮数据作为初始基准，7点再进行爆款判断
- **数据留存**：推送到 GitHub 保留历史数据，可结合自己发的帖子复盘找到发帖节奏

## Token 零消耗技巧

如果每次推送都用主 Agent（Grok Bot）的 token，量大会很贵。解法：对接一个免费/便宜的第三方模型（如蚂蚁的 Ling-3.1-flash）专门处理数据推送，主 Agent 只负责爆款判断和决策。

Ling-3.1-flash 特点：约560B总参数，每个Token只激活约25B（MoE架构），上下文上限1M（免费期256K）。

## 开源实现

[github.com/aehyok/x-viral-monitor](https://github.com/aehyok/x-viral-monitor)

## Related Pages

- [[concepts/bot-vs-codex-context]]
- [[patterns/ai-agent-content-farm]]

## Sources

- AI少年《Grok Bot自动监控爆款并推送工作流》：x.com/aehyok/status/2109817788198158347
