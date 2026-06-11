---
title: "Design-to-HTML（UI截图视觉还原）"
date: "2026-06-11"
---

# Design-to-HTML（UI截图视觉还原）

> A Codex / Claude skill for recreating UI screenshots as HTML/CSS. 先拆解再还原，截图验证修正。

## Key Points

- **核心定位**：面向已有 UI 截图/设计稿的 HTML/CSS 还原，**不是 UI 生图 Skill**
- **适用场景**：给 AI 一张 UI 截图让它还原成 HTML/CSS、把 Landing Page 设计稿做成静态网页、把 SaaS 页面/后台页面/空状态页面还原成前端页面
- **核心流程**：拆解页面地图 → 分离代码结构和视觉资产 → 设置画布比例 → 写 HTML/CSS → 浏览器截图验证 → 对比修正视觉误差

## 关键设计原则

### 先拆设计，再写代码

先生成简洁的页面地图，避免直接从图片跳到代码导致结构跑偏。

### 代码 UI 与图片资产分离

- 导航、卡片、表单、按钮、表格等 → HTML/CSS 实现
- Logo、复杂插画、产品截图、人物图、3D 视觉等 → 图片资产，不硬用 CSS 画

### 画布尺寸与浏览器预览适配

明确区分参考画布和展示视口，避免固定尺寸设计在浏览器里出现溢出、裁切、缩放错位、黑边过大等问题。

### 真实浏览器截图校验

实现后用浏览器渲染截图，对比参考图检查布局、比例、间距、字体、颜色，再针对具体误差迭代修正。

## 安装

| Agent | 路径 |
|-------|------|
| Codex | `~/.codex/skills/ky-design-to-html` |
| Claude | `~/.claude/skills/ky-design-to-html` |

## 数据

- **57 Stars** · **5 Forks**
- Python 100%

## Related Pages

- [products/open-design](products/open-design) — 开源 Claude Design 替代
- [products/taste-skill](products/taste-skill) — AI前端防丑Skill

## Sources

- GitHub KyrieCheungYep/ky-design-to-html-skill (2026-06-04)