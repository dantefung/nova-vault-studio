---
title: "落地页风格系统"
date: "2026-07-30"
source: "Nova Vault Studio"
url: ""
---

# 落地页风格系统

System Vault 首页当前提供三种独立的视觉风格：默认的 **Quiet Library**、编辑化的 **Easton Blog**，以及尽量复刻 `eastondev.com/blog/zh/` 内容门户结构的 **Easton Clone**。三者都可以通过首页风格菜单手动切换。

历史版本曾支持 8 种首页风格切换，现已收敛为三种可维护的视觉模式。详细的实现过程和经验记录在[首页 Quiet Library 改造开发日志](../dev-log/homepage-quiet-library.md)。

> 本落地页系统使用 [Huashu-Design](https://github.com/alchaincyf/huashu-design) skill 设计生成。

## 设计理念

首页优先解决知识库导航问题，而不是展示风格选项：

| 目标 | 实现 |
|------|------|
| 快速开始 | Hero 提供 Guide 入口 |
| 内容导航 | 分类卡片链接到真实知识板块 |
| 持续阅读 | 最近更新列表链接到真实文章 |
| 长期使用 | 浅色、暗色、sepia 三种主题状态保持一致 |

## 两套独立状态

- **首页视觉风格**：`Quiet Library` / `Easton Blog` / `Easton Clone`，保存于 `vp-landing-theme`，只影响首页视觉和首页内容门户布局。
- **全局颜色模式**：`light` / `dark` / `sepia`，保存于 `vp-theme`，继续由现有主题切换器管理，影响首页和文档页的颜色模式。

这两个状态可以自由组合，例如 `Easton Clone + dark` 或 `Quiet Library + sepia`，互不覆盖，也不会改变文档页布局。

## Quiet Library 视觉规范

```text
背景: #f8fafc
内容表面: #ffffff
主文字: #172033
正文: #475569
强调色: #2563eb
浅蓝面板: #eff6ff
边框: #dbe4ef
```

首页布局使用居中内容列、三列分类网格和单列最近更新列表。平板端缩为两列，移动端缩为单列。卡片只使用轻微 hover 反馈，不使用轮播、视差或滚动驱动切换。

### 主题状态

- `light`：浅蓝灰纸面和蓝色强调。
- `dark`：深蓝灰背景、浅色文字和浅蓝强调。
- `sepia`：暖纸色背景、棕色文字和棕色强调。

所有首页 token 都限定在 `.vp-landing` 下，不修改文档页全局主题变量。

### Easton Blog 视觉规范

Easton 模式使用暖纸色背景、棕红强调色、衬线标题、粗分隔线和编号内容入口。它复用 Quiet Library 的 Hero、分类网格、最近更新和真实链接，不复制另一套首页模板。

### Easton Clone 视觉规范

Easton Clone 复刻目标站首页的内容门户结构：顶部博客导航、主 Hero、阅读入口、系列专题、编辑精选、最新文章、分类浏览和页脚资源导航。由于本仓库没有目标站的文章数据和插画资源，Clone 主题只复刻公开页面的结构、密度、色彩、分隔线、排版比例和交互层级，内容链接替换为本仓库真实页面，不直接复制目标站内容或资源。

## 历史风格

以下 8 种风格是历史实现，不再作为首页可切换功能保留。

### 1. 晴空 · 极简学术（Clear）

**默认风格**。白底大字衬线标题，橄榄绿品牌色点缀，克制留白，学术感。

```
背景: #ffffff
标题: #3c3c43
品牌色: #3451b2
字号: clamp(48px, 8vw, 80px)
字体: 系统衬线
```

适用场景：文档导航、日常查阅、最通用选择。

---

### 2. 杂志 · 大写叙事（Magazine）

深棕黑底配暖橙装饰色，粗体无衬线全大写标题，不对称几何色块。

```
背景: #1a1814
标题: #f5f0e8（暖白）
装饰色: #9b7653（琥珀橙）
字号: clamp(64px, 10vw, 120px)
```

适用场景：个人品牌展示、技术博客首页。

---

### 3. 极客 · 代码美学（Tech）

深灰底 `#0d1117` 模拟 GitHub Dark，终端窗口设计带光标闪烁动画。

```
背景: #0d1117
文字: #c9d1d9
强调: #3fb950（终端绿）
字体: SF Mono / Fira Code
特效: 光标闪烁动画
```

适用场景：开发者工具、命令行风格产品、技术文档首页。

---

### 4. 诗卷 · 东方诗意（Poetry）

暖米纸底 `#f5f0e8`，竖排繁体标题，水墨绿色点缀，古典阅读氛围。

```
背景: #f5f0e8（暖米纸）
标题: 竖排 #3a3328
品牌色: #2d6a4f（水墨绿）
排版: writing-mode: vertical-rl
```

适用场景：个人品牌、文学创作、东方审美站点。

---

### 5. 卡片 · 现代导航（Cards）

多彩图标卡片网格，清晰信息架构，适合内容导航导向。

```
背景: #fafafa
卡片: 白色 + 1px 边框
图标背景: 各色柔和背景
圆角: 12px
字体: 系统无衬线
```

适用场景：多内容分类导航（SaaS Dashboard、产品功能展示）。

---

### 6. 暗魄 · 粗野主义（Brutalist）

纯黑底 `#0a0a0a` 高对比，红色几何块 `#e63946`，激进无衬线全大写。

```
背景: #0a0a0a
主色: #e63946（激进红）
文字: #f5f5f5
边框: 2px solid #333
字号: clamp(56px, 9vw, 112px)
```

适用场景：创意工作室、个人 Portfolio、艺术类站点。

---

### 7. 暖域 · 杂志编辑（Editorial）

暖灰纸底 `#faf7f4`，杂志大图占位，橙调 `#d4a373` 点缀，期刊感排版。

```
背景: #faf7f4
装饰色: #d4a373（暖橙）
正文色: #6b5f4e
排版: 杂志两栏布局
```

适用场景：内容出版、Newsletter、个人杂志。

---

### 8. 静界 · 极简禅意（Zen）

纯白极简 `#fafafa`，超大留白，极细分隔线，单色系，禅意留白。

```
背景: #fafafa
文字: #1a1a1a
分隔线: 1px #e0e0e0
字重: 200（极细）
字间距: 0.15em
```

适用场景：高端品牌、艺术作品集、极简主义站点。

---

## 技术实现

### 文件结构

```
docs/.vitepress/theme/
├── layouts/
│   └── HomeLayout.vue           # Quiet Library 首页 Layout
├── index.js                      # 主题入口，根据路由分发 Layout
└── MyLayout.vue                  # 文档页 Layout（非落地页路由）
```

### 架构设计

```
VitePress 路由
├── /, /v2/, /v3/, /v4/, /v5/  → HomeLayout.vue（落地页）
└── /md/*                       → MyLayout.vue（文档页）

HomeLayout.vue 内部：
├── 导航栏 + 首页视觉切换 + 全局颜色切换
├── Hero 定位区域
├── 知识分类入口
└── 最近更新列表
```

### 首页数据结构

```javascript
const libraryEntries = [
  { label: '指南', href: '/md/guide/getting-started' },
  { label: 'Wiki', href: '/md/wiki/' },
  { label: '专栏', href: '/md/columns/' },
  { label: '书籍', href: '/md/books/' },
  { label: '教程', href: '/md/tutorial/' },
]

const recentUpdates = [
  { title: 'Happy Coder：用手机远程操控 Claude Code', href: '/md/guide/claude-code/happy-coder-remote-control' },
  { title: '网站分析与关键词挖掘：核心转折点全部突破', href: '/md/columns/indie-hub/seo/keyword-analysis/keyword-breakthrough-round-15' },
]
```

### CSS 隔离

首页样式统一使用 `.vp-landing` 前缀，避免影响文档页：

```css
.vp-landing {
  --library-bg: #f8fafc;
  --library-surface: #fff;
  --library-primary: #2563eb;
}

.vp-landing.theme-dark { /* dark tokens */ }
.vp-landing.theme-sepia { /* sepia tokens */ }
```

### 多路由支持

VitePress 支持通过创建多目录实现独立路由：

```
docs/
├── index.md        → /
├── v2/index.md     → /v2/
├── v3/index.md     → /v3/
├── v4/index.md     → /v4/
└── v5/index.md     → /v5/
```

当前版本使用同一 Layout 渲染两种首页视觉模式。首页视觉切换器只读写 `vp-landing-theme`，全局主题切换器只读写 `vp-theme`。

如需调整首页，应优先修改内容入口、最近更新数据和 `.vp-landing` 局部 token；新增视觉模式前先重新完成信息架构和维护成本评估。

## 相关文档

- [首页 Quiet Library 改造开发日志](../dev-log/homepage-quiet-library.md)
