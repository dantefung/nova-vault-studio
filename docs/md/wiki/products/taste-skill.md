---
title: "Taste-Skill（AI前端防丑Skill）"
date: "2026-06-11"
---

# Taste-Skill（AI前端防丑Skill）

> The Anti-Slop Frontend Framework for AI Agents. 专治 AI生成的默认丑，让页面从 boilerplate 升级到有品味。

## Key Points

- **核心理念**：专治"AI Look"——蓝紫渐变、统一卡片网格、`border-radius: 12px`、Inter 字体、居中布局
- **三档设计旋钮**：DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY
- **定位**：让页面不丑，而非简单样式清单

## 核心 Skill

| Skill | 功能 |
|------|------|
| **taste-skill（默认 v2）** |读取需求 → 推断设计语言 → 调节三档旋钮 → 设计系统地图 + GSAP 代码骨架 + 预检查 |
| **taste-skill-v1** | 原版 v1，稳定版 |
| **gpt-tasteskill** | 面向 GPT/Codex 更严格的规则，更高布局方差，更激进的 anti-slop |
| **image-to-code-skill** | 图生 → 分析 → 代码网站流水线 |
| **redesign-skill** | 已有项目审计后修复布局/间距/层级/样式 |
| **soft-skill** | 高端精致 UI（柔和对比、留白、spring 动效） |
| **minimalist-skill** | Notion/Linear 风格编辑产品 UI |
| **brutalist-skill** | 瑞士风格、工业感、实验性布局 |
| **output-skill** | 防止 Agent 输出半成品，强制完整交付 |

## 三档设计旋钮

- **DESIGN_VARIANCE**（1-10）：布局实验度（低=居中干净，高=不对称现代）
- **MOTION_INTENSITY**（1-10）：动效深度（低=hover，高=scroll/magnetic）
- **VISUAL_DENSITY**（1-10）：信息密度（低=留白，高=密集仪表盘）

## 图生 Skill

| Skill | 功能 |
|------|------|
| **imagegen-frontend-web** | 网站设计稿：hero、landing、强字体/间距/anti-slop 艺术方向 |
| **imagegen-frontend-mobile** | 移动端屏幕和流程：iOS/Android/跨平台 |
| **brandkit** | 品牌套件：logo 方向、配色、字体、身份应用 |

## 安装

```bash
npx skills add https://github.com/Leonxlnx/taste-skill
# 单个 skill
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

## 数据

- **34.1k Stars** · **2.5k Forks** · **97 Commits**
- Shell 100%

## Related Pages

- [patterns/engineering-taste](patterns/engineering-taste) — 工程品味
- [products/index](products/index) — AI 产品索引

## Sources

- GitHub Leonxlnx/taste-skill (2026-06-04)