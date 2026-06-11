---
title: "Career Ops（AI求职系统）"
date: "2026-06-11"
---

# Career Ops（AI求职系统）

> AI-powered job search system built on Claude Code. 14 skill modes, Go dashboard, PDF generation, batch processing.

## Key Points

- **核心定位**：将求职变成可用代码管理的自动化 DevOps 流
- **作者成果**：用它评估了 740+ 职位，生成了 100+ 份定制简历，最终斩获 Head of Applied AI offer

## 核心功能

| 功能 | 说明 |
|------|------|
| Auto-Pipeline | 粘贴 URL → 完整评估 + PDF + tracker |
| 6-Block Evaluation | 角色摘要/CV 匹配/级别策略/薪酬研究/个性化/面试准备 |
| Interview Story Bank | 积累 STAR+Reflection 故事，应对任何行为面试题 |
| Negotiation Scripts | 薪酬谈判框架/地域折扣反驳/竞品杠杆 |
| ATS PDF Generation | 关键词注入 CV，Space Grotesk + DM Sans 设计 |
| Portal Scanner | 45+ 公司预配置（Anthropic/OpenAI/ElevenLabs 等） |
| Batch Processing | `claude -p` 并行评估多 offer |
| Dashboard TUI | Go + Bubble Tea 终端仪表盘 |

## 评估维度（A-F六块）

1. Role Summary — 角色本质
2. CV Match — 与简历匹配度
3. Level Strategy — 级别策略
4. Comp Research — 薪酬研究
5. Personalization — 个性化（STAR+R）
6. Interview Prep — 面试准备

## 安装

```bash
# 一行安装
npx @santifer/career-ops init

# 然后
cd career-ops && claude
```

## 数据

- **51.2k Stars** · **10.4k Forks** · **232 Commits** · **v1.8.0**
- MIT License
- Featured in WIRED / Business Insider

## Sources

- GitHub santifer/career-ops (2026-06-09)