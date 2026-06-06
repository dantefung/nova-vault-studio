---
title: "yan-labs/serenity-aleabitoreddit — Serenity 完整推文档案 + AI 供应链 Skill（112 Stars）"
date: "2026-06-06"
source: "GitHub"
url: "https://github.com/yan-labs/serenity-aleabitoreddit"
---

# yan-labs/serenity-aleabitoreddit — Serenity 完整推文档案 + AI 供应链 Skill（112 Stars）

> Installable Serenity tweet archive + AI/semi supply-chain skill. 从 5,813 条推文 + 4 篇 X 长文中蒸馏而来。

<!-- more -->

## 核心内容

**Serenity（@aleabitoreddit）** 是前 Reddit WSB 散户，现专注 AI 半导体供应链分析，39 万粉丝。她的核心方法：反推整条 AI 供应链，找最不可替代的卡脖子节点，提前布局小盘标的（部分标的单季度 +400%）。

## 核心优势（一句话）

> 不要买最显眼的铲子（NVDA）——沿着供应链向上游追踪，找到那个小市场市值、但下游无法绕开的单点卡脖子，光学/CPO、复合半导体衬底、存储、電力——在那里，最小的市值对应着最大的定价权错配。

## 语料规模

- **5,813 条推文**（2025-07-02 → 2026-06-05）
- **4 篇 X 长文**（2026-01 → 2026-05）
- **6 个时期的周期分析**

## 文件结构

```
serenity-aleabitoreddit/
├── SKILL.md                      # Agent Skill 入口
├── references/
│   ├── methodology.md            # 12 个命名原则 + 检查清单
│   ├── theses.md                # 按 ticker 聚类的知识库
│   ├── articles.md               # 长文摘要
│   ├── track-record.md           # 历史时间线 + 诚实校准说明
│   └── maintenance.md           # 增量更新规则
├── analysis/*.md                 # 6 个时期分析（溯源）
├── data/aleabitoreddit_tweets.json   # 完整推文档案
└── data/ticker_stats.txt         # $ticker 统计
```

## 安装

```bash
npx skills add yan-labs/serenity-aleabitoreddit
```

## 数据

- **112 Stars** · **20 Forks** · **160 Commits**
- Python 100%