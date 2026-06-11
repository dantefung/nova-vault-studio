---
title: "Serenity Aleabitoreddit（完整推文档案）"
date: "2026-06-11"
---

# Serenity Aleabitoreddit（完整推文档案）

> Installable Serenity tweet archive + AI/semi supply-chain skill. 从 5,813 条推文 + 4 篇 X 长文中蒸馏而来。

## Key Points

- **核心内容**：Serenity（@aleabitoreddit）完整推文档案 + AI/半导体供应链 Skill
- **核心优势**：不要买最显眼的铲子——沿着供应链向上游追踪，找到那个小市场市值、但下游无法绕开的单点卡脖子

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

## Related Pages

- [concepts/serenity-investment-methodology](concepts/serenity-investment-methodology) — Serenity投资方法论
- [patterns/serenity-stock-research](patterns/serenity-stock-research) — 供应链卡点投研

## Sources

- GitHub yan-labs/serenity-aleabitoreddit (2026-06-06)