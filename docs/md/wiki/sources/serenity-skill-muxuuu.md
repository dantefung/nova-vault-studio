---
title: "muxuuu/serenity-skill — Serenity 式供应链卡点股票研究 Agent Skill（356 Stars）"
date: "2026-06-06"
source: "GitHub"
url: "https://github.com/muxuuu/serenity-skill"
---

# muxuuu/serenity-skill — Serenity 式供应链卡点股票研究 Agent Skill（356 Stars）

> 让 AI 用 Serenity 式投研方法，筛出上涨逻辑更清楚的股票和基金方向。热度最高、Stars 最多的 Serenity Skill，62 Forks。

<!-- more -->

## 核心定位

把 Serenity（@aleabitoreddit）的公开投研路径做成 Agent Skill——从热点出发，拆产业链，找供应链瓶颈，筛候选公司和基金方向，再检查公告/财报/客户/产能/风险，整理成优先研究清单。

**不模仿说话方式，复用的是研究路径本身。**

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

## 仓库结构

```
serenity-skill/
├── SKILL.md                          # Agent Skill 入口
├── references/
│   ├── deep-research-workflow.md      # 深度研究工作流
│   ├── evidence-ladder.md            # 证据阶梯
│   ├── market-source-playbook.md     # 市场信息来源手册
│   ├── public-profile-and-evaluation.md
│   └── risk-and-compliance.md        # 风险与合规
├── assets/
│   ├── bottleneck-scorecard.json     # 瓶颈打分卡模板
│   ├── research-prompt-pack.md       # 可复制研究 Prompt 包
│   └── thesis-template.md            # 论文模板
├── scripts/
│   ├── serenity_scorecard.py
│   └── validate_skill.py
├── examples/
│   ├── a-share-ai-semiconductor-demo.md
│   ├── ai-infrastructure-chokepoint-demo.md
│   └── demo-conversation.md
└── evals/test-cases.md
```

## 安装

```bash
# Codex / OpenAI Agent Skills
mkdir -p ~/.agents/skills/serenity-skill
cp -R SKILL.md LICENSE references assets scripts examples agents ~/.agents/skills/serenity-skill/

# Claude Code
mkdir -p ~/.claude/skills/serenity-skill
cp -R SKILL.md LICENSE references assets scripts examples agents ~/.claude/skills/serenity-skill/

# Hermes Agent
mkdir -p ~/.hermes/skills/research/serenity-skill
cp -R SKILL.md LICENSE references assets scripts examples agents ~/.hermes/skills/research/serenity-skill/
```

## 数据

- **356 Stars** · **62 Forks** · **4 Commits**
- Python 100%
- MIT License

## 注意

这是今天第 8 个 Serenity Skill 仓库，也是 Stars 最多的一个（356 Stars）。