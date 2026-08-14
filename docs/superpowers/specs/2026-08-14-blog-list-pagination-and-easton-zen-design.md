---
title: "博客列表分页与 Easton 文章 Zen 布局修复设计"
date: "2026-08-14"
source: "Nova Vault Studio"
url: ""
---

# 博客列表分页与 Easton 文章 Zen 布局修复设计

## 目标

解决三项用户可见问题：

- `/md/blog/` 首页的“全部文章”一次渲染 582 篇，页面极长、滚动和首屏成本线性增长。
- Easton 文章 Zen 模式下正文没有与 Hero、文章尾部、评论统一水平居中。
- Zen 模式下顶部导航仍是白色背景，没有跟随 Easton 的 light/dark/sepia 色调。

## 范围

- 给 `/md/blog/` 首页的“全部文章”增加前端分页，页码同步到 URL。
- 把 Easton 文章页的 Hero、正文、文章尾部、评论统一到一个 `820px` 居中阅读列。
- 补齐 Zen 状态下顶部导航的 Easton 主题视觉。
- 保留文章索引数据、URL、主题切换、精选区、分类/系列/归档页和移动端行为。
- 不修改 Markdown 内容、`build-blog-index.js`、VitePress 源码或 `node_modules`。

## 列表分页

### 数据流

`BlogIndexLayout.vue` 只做展示层改动：

1. `allArticles` 仍是完整列表（除精选）。
2. `PAGE_SIZE = 20`。
3. 由 `?page=N` 解析当前页，深色回退到 `1`；超出有效范围时收敛到最近有效页。
4. 只渲染 `currentPage.slice`，页码变化时把数字写入 URL query。

### 页面结构

- 第一页：保留当前 5 篇“编辑精选” + 20 篇普通文章。
- 后续页：只显示 20 篇普通文章，不再重复展示精选区。
- 不存在文章时的提示沿用现有 `.blog-empty`。

### 分页器

- 显示“上一页”“下一页”“第 X / Y 页”和右侧总数。
- 相邻页码按钮各 2 个，当前页高亮，首尾页保留。
- 换页后滚动到“全部文章”`.blog-subhead`，不跳回页面顶端。
- 非法或不存在的页码不加 `.?page=`，只收敛到相邻有效页。
- 样式使用现有 `--clone-*` 令牌，与行式目录 `.blog-tile` 视觉一致。

## Zen 统一阅读列

### 根因

Zen 折叠只隐藏了 `.VPSidebar` 并回收几处偏移，但 Hero、`.VPDoc .content-container`、`.blog-article-shell`、Giscus 各自有不同的宽度和对齐来源，导致正文并不与 Hero 共享同一条竖线。

### 规则

- 定义统一阅读宽度变量 `--easton-reading-width: 820px` 于 `html[data-landing-theme="easton"]`。
- Hero 宽屏下不再用 `margin-left: 32px` 和 `width: calc(100% - 256px)`，改为 `max-width: var(--easton-reading-width); margin-inline: auto`。
- 正文 `.content-container` 保持 `max-width: var(--easton-reading-width)` 且 `margin-inline: auto`。
- `.blog-article-shell` 与 `.giscus` 同样以该宽度水平居中。
- 删除为不同偏移追加的 `>= 1440px` 居中补偿，统一由阅读列自身居中。
- 保持 820px 阅读宽度、17px 正文字和 1.92 行高不变。
- Zen 折叠时正文、Hero、尾部、评论对齐同一条中心线与左右边缘。

### 移动端

- `< 960px` 继续使用现有单列阅读，超过容器宽度的内容按现状处理。
- Zen 仅桌面语义，不在移动端制造第二套模式。

## Zen 导航主题

### 根因

导航有 Easton 色彩规则，但 `.VPNav`/`.VPNavBar` 的白色背景、底部边框、菜单文字、搜索框和下拉菜单在 `has-sidebar`/Zen 状态仍有部分依赖 VitePress 默认变量，未全部被 Easton 令牌覆盖。

### 规则

- 在 `html[data-landing-theme="easton"] .easton-doc-shell` 作用域下，强制 `.VPNav`、`.VPNavBar`、`.VPNavBar .title`、`.VPNavBarMenuLink`、`.VPNavBarMenuGroup .button`、`.DOCSearch-Button`、`.VPNavBarExtra` 及下拉层使用 `--easton-doc-bg/surface/ink/body/accent/rule`。
- 三种色调（light/dark/sepia）经由现有 `html[data-theme]` 变量继承，不新增重复色值。
- “显示目录/隐藏目录”切换按钮在 zen 折叠时保持暖色描边与 body 文字，不显示为白色。
- 确保移动端 `< 960px` 仍显示移动菜单，不因本次规则被误隐藏。

## 组件边界

- `BlogIndexLayout.vue`：拥有分页状态、URL 同步与分页器。
- `MyLayout.vue`：Zen 状态与切片不变，仅通过 class 表达统一阅读列。
- `ArticleHero.vue`：改为阅读列居中。
- `easton-doc.css`：承载阅读列变量与几何、导航主题补齐。
- `easton-blog.css`：承载分页器样式。

## 兼容性

- 不改变文章 URL、分类、系列、归档或索引数据。
- 普通 VitePress 文档、Library/quiet 模式、分类/系列/归档页保持原行为。
- 不删除死代码，不扩大改动范围。

## 验收标准

- `/md/blog/` 首页第一页显示 5 篇精选 + 20 篇普通文章；翻页后只显示 20 篇，页码反映在 URL。
- 第二页及之后刷新、分享链接、浏览器前进后退均保持正确页码。
- 非法页码收敛到相邻有效页，不产生 `.?page=` 或空白页。
- Easton 文章在 960px、1200px、1440px 及以上，展开/折叠侧栏时 Hero、正文、文章尾部、评论都对齐同一条垂直中心线。
- Zen 下顶部导航在 light/dark/sepia 三色调均使用 Easton 背景与文字色，不再显示白色。
- 移动端 `< 960px` 分页器不溢出，Zen 按钮不显示，移动菜单正常。
- 运行 `python3 .claude/hooks/check-frontmatter.py <spec>`、`npm run build` 和 `git diff --check` 全部通过，并在浏览器按上述断点人工核对。