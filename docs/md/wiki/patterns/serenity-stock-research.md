---
title: "Serenity Stock Research（供应链卡点投研）"
date: "2026-06-11"
---

# Serenity Stock Research（供应链卡点投研）

> 让 AI 用 Serenity 式投研方法，筛出上涨逻辑更清楚的股票和基金方向。

## Key Points

- **核心定位**：把 Serenity（@aleabitoreddit）的公开投研路径做成 Agent Skill，从热点出发拆产业链找供应链瓶颈
- **研究路径**：热点 → 拆解产业链 → 找低供应商数量/长验证周期/扩产困难/客户认证严格的环节 → 回到股票和基金方向判断 → 检查公告/财报/订单/产能/客户/风险 → 优先研究排序清单
- **不模仿说话方式，复用的是研究路径本身**

## 典型问题

| 你遇到的问题 | 可以这样问 |
|-------------|-----------|
| 刷到热点不知道从哪下手 | 最近 AI 半导体很火，普通人应该先研究哪些方向？ |
| 分不清机器人产业链谁更关键 | 机器人产业链里，哪些环节更可能先出机会？ |
| 担心推荐只是蹭热点 | 帮我挑战这家公司是不是 CPO 核心供应商 |
| 想买主题基金分不清方向 | 机器人主题基金应该重点看哪些上游环节？ |
| 想给候选股排研究顺序 | 比较 A、B、C 三家公司，谁的上涨逻辑更清楚？ |

## 研究流水线

```
热点 → 拆解产业链（需求/系统集成/芯片器件/设备/材料/封测/基础设施）
  → 找低供应商数量、长验证周期、扩产困难、客户认证严格的环节
  → 回到股票和基金方向，判断谁靠近真实瓶颈
  → 检查公告、财报、问询函、订单、产能、客户、风险
  → 优先研究排序清单
```

## 工具

- `serenity_scorecard.py` — 本地瓶颈打分卡
- `validate_skill.py` — Skill 校验

## 数据

- **356 Stars** · **62 Forks** · **4 Commits**
- Python 100% · MIT License

## Related Pages

- [products/go-stock](products/go-stock) — AI股票分析工具
- [patterns/ai-wealth-creation](patterns/ai-wealth-creation) — AI创富模式

## Sources

- GitHub muxuuu/serenity-skill (2026-06-06)