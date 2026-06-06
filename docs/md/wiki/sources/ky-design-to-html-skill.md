---
title: "ky-design-to-html — UI 截图转高质量 HTML/CSS 的视觉还原 Skill"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/KyrieCheungYep/ky-design-to-html-skill"
---

# ky-design-to-html — UI 截图转高质量 HTML/CSS 的视觉还原 Skill

> A Codex / Claude skill for recreating UI screenshots as HTML/CSS. 先拆解再还原，截图验证修正。

<!-- more -->

## 核心定位

**不是 UI 生图 Skill**，而是面向已有 UI 截图/设计稿的 HTML/CSS 还原。重点是：
- 资产分离（代码 UI vs 图片资产）
- 画布适配（设计稿画布 vs 浏览器展示）
- 截图验证 + 视觉误差修正

## 适用场景

- 给 AI 一张 UI 截图，让它还原成 HTML/CSS
- 把 Landing Page 设计稿做成静态网页
- 把 SaaS 页面、后台页面、空状态页面还原成前端页面
- 避免 AI 直接照图写 HTML 后把页面挤变形、资产画糊、比例跑偏

## 核心流程

```
1. 拆解页面地图（布局比例、组件层级、颜色系统、字体层级、间距、圆角、阴影）
2. 分离代码结构和视觉资产（HTML/CSS vs 图片资产）
3. 设置设计稿画布和浏览器展示比例
4. 写 HTML/CSS
5. 浏览器截图验证
6. 对比修正视觉误差
```

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

## 文件结构

```
ky-design-to-html/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── asset-handling.md         # 资产分离处理
│   └── visual-error-taxonomy.md   # 视觉误差分类
└── scripts/
    └── screenshot_page.py         # 截图验证脚本
```

## 安装

| Agent | 路径 |
|-------|------|
| Codex | `~/.codex/skills/ky-design-to-html` |
| Claude | `~/.claude/skills/ky-design-to-html` |

## 使用方法

```
Use $ky-design-to-html to recreate this UI screenshot as a standalone HTML/CSS page.
```

或中文：

```
使用 ky-design-to-html，把这张 UI 截图还原成一个 HTML/CSS 页面。
```

## 局限

不适合纯文字出设计（无截图/mockup 时走普通前端设计流程）。

## 数据

- **57 Stars** · **5 Forks**
- Python 100%