---
title: "guizang-social-card-skill — 小红书图文/公众号封面对生成 Skill（3k Stars）"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/op7418/guizang-social-card-skill"
---

# guizang-social-card-skill — 小红书图文/公众号封面对生成 Skill（3k Stars）

> Claude Code / Codex skill — generate Xiaohongshu carousels & WeChat 21:9+1:1 cover pairs. Editorial × Swiss visual systems, 28 layouts, 10 themes, single-file HTML → PNG.

<!-- more -->

## 核心定位

一个适配 Claude Code / Codex 等 Agent 环境的图文卡片技能，用于从文章、文案、截图、产品笔记、字幕或照片生成**小红书 / Rednote 图文组图**与**公众号 21:9 + 1:1 封面对**。

姊妹项目：[guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)（横向翻页演讲），共享美学语言但独立维护。

## 双视觉系统

| 系统 | 风格参考 | 适合场景 |
|------|----------|----------|
| **Editorial 电子杂志风** | Monocle / Kinfolk / Cereal | 叙事、生活方式、旅行、阅读、影视、个人观察 |
| **Swiss 瑞士国际主义** | 网格、单一锚点色、直角发丝线 | 产品测评、数据、方法论、教程、AI 工具 |

## 核心规格

- **3 个画板尺寸**：`.poster.xhs` 1080×1440（小红书 3:4）、`.poster.wide` 2100×900（公众号 21:9）、`.poster.square` 1080×1080（公众号 1:1）
- **28 个版式骨架**：Editorial 16 个（M01-M16）+ Swiss 12 个（S01-S12）
- **10 套主题预设**：Editorial 6 套（墨水经典/靛蓝瓷/森林墨/牛皮纸/沙丘/Midnight Ink）+ Swiss 4 套锚点色（IKB 蓝/柠檬黄/柠檬绿/安全橙）

##7 步工作流

1. **Intake** — 抓 4 件事：目标平台 / 风格 / 内容素材 / 用户图
2. **Style & Theme** — 选 Editorial 或 Swiss，从 10 套预设里选主题色（不允许自定义 hex）
3. **Layout Selection** — 从 28 个版式骨架里挑、粘、改文案
4. **Asset Prep** — 取图（Unsplash → Pexels → Flickr CC → Wallhaven → 直接搜索），落本地 + 写 `SOURCES.md`
5. **Compose & Render** — 拷种子模板 → 替换 `<!-- POSTERS_HERE -->` → `node render.mjs`
6. **Deliver & Review** — PNG 给用户看，默认不自动核查
7. **Iterate** — 改 inline 样式或 swap 版式 / 替图，重渲

## 校验脚本

`node validate-social-deck.mjs` 6 条规则（基于 Playwright 真实渲染测量）：

- **R1** Overflow — 任何 section 超出 `.poster`
- **R2** Type Caps — 超字号上限
- **R3** Footer Collision — 内容压到底部
- **R4** 4-Band Density — 1440 高画布切 4 横带
- **R5** Frame Overflow — `.frame-img` / `.frame-shot` 子元素溢出
- **R6** Swiss Identity — Swiss 模板 inline `font-weight >= 700` 警告

## 11 个小红书品类适配

按能力圈分三档：
- **端到端强势**：旅行、职场、推荐（指定子类后）
- **文与结构强势，图依赖用户或搜图源**：游戏、影视、美食、彩妆教程、健身、家居、穿搭
- **能力圈外（主动说清）**：OOTD 实拍流 / 梦核 / 仿胶片调色等

## 技术特点

- **单文件 HTML + Playwright 渲染**：不需要前端构建链，`node render.mjs` 直接出 PNG
- **WebGL 墨流背景**：Editorial hero 页可挂动态墨流
- **图片底图遮罩 + 人脸避让**：满铺图必须叠遮罩，文字落点避开主体
- **MapLibre 地图组件**：支持多 pin + 连线，适合旅行攻略
- **材质背景**：9 张 WebP 真实材质背景（Editorial 5 / Swiss 4）

## 安装

```bash
npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill
```

## 触发方式

```
帮我基于这篇文章做一套瑞士风小红书图文，5 张，IKB 蓝。
基于这份产品测评做一套小红书 3:4，标题用电子杂志风。
帮我把这篇文章做成公众号封面对：21:9 头图 + 1:1 分享卡。
```

## 数据

- **3k Stars** · **274 Forks** · **5 Commits**
- HTML 73.3% · JavaScript 26.7%
- AGPL-3.0

## 核心设计原则

1. 克制优于喊话 —克制色板反而最显眼
2. 结构优于装饰 — 字号 + 字体对比 + 网格留白撑起信息层级
3. 版式优于自由 — 28 个版式骨架先选后改，不发明不存在的页面
4. 越大越细 — Swiss `.h-xl` 字号上去 → 字重必须下来
5. 默认不自动核查 — 先看图、再决定要不要 validate，省每轮几十秒