---
title: "Blog Editorial Redesign Implementation Plan"
date: "2026-08-12"
source: "Nova Vault Studio"
url: ""
---

# Blog Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将博客索引体系改造成克制出版风格，同时保留现有数据、路由、主题和导航能力。

**Architecture:** 复用现有博客索引和布局分发，只调整展示组件。`BlogIndexLayout` 负责精选与普通列表的数据切分，`ArticleCard` 负责合法、可复用的文章条目结构，页面级 CSS 负责主题和响应式布局。

**Tech Stack:** Vue 3、VitePress、CSS、自生成博客索引

---

### Task 1: 重构文章元信息和条目语义

**Files:**
- Modify: `docs/.vitepress/theme/components/ArticleMeta.vue`
- Modify: `docs/.vitepress/theme/components/ArticleCard.vue`

- [ ] 删除 Emoji、精选胶囊、标签胶囊和伪封面首字。
- [ ] 为 `ArticleMeta` 增加 `linked` 开关，卡片内部关闭元信息链接。
- [ ] 将卡片根元素改为 `<article>`，标题使用唯一文章链接，消除嵌套 `<a>`。
- [ ] 保留 `feature`、`default`、`compact`、`row` 变体，但全部使用编辑式文字结构。
- [ ] 运行 `npm run build`，预期 VitePress 构建成功且无 Vue 模板错误。

### Task 2: 实现首页精选与索引模式

**Files:**
- Modify: `docs/.vitepress/theme/layouts/BlogIndexLayout.vue`

- [ ] 从 `featuredArticles(5)` 取显式精选，并用最新文章补足到 5 篇。
- [ ] 最新模式显示编辑导语、5 篇精选和排除精选后的文章目录。
- [ ] 分类和系列模式继续使用原数据，但改为带编号的文字目录。
- [ ] 为三种模式提供明确的标题和数量，不新增持久化状态。
- [ ] 运行 `npm run build`，预期索引数据访问和模板渲染成功。

### Task 3: 统一分类、系列与归档结构

**Files:**
- Modify: `docs/.vitepress/theme/layouts/SeriesLayout.vue`
- Modify: `docs/.vitepress/theme/layouts/CategoryArchiveLayout.vue`
- Modify: `docs/.vitepress/theme/layouts/ArchiveLayout.vue`

- [ ] 分类和系列页使用统一编辑页头与 `row` 文章目录。
- [ ] 归档页按月份输出时间锚点和紧凑文章行。
- [ ] 空集合显示一句明确状态，不制造空卡片。
- [ ] 运行 `npm run build`，预期所有布局可静态生成。

### Task 4: 收敛公共页头与页脚

**Files:**
- Modify: `docs/.vitepress/theme/layouts/BlogLayout.vue`

- [ ] 将品牌和文案改为作者博客语气，保留原有导航目标和控制组件。
- [ ] 删除未使用的 `BlogArticleLayout` 导入和死分支。
- [ ] 将页脚收敛为作者说明、主要导航和版权信息。
- [ ] 运行 `npm run build`，预期博客路由分发保持不变。

### Task 5: 重写博客视觉和响应式规则

**Files:**
- Modify: `docs/.vitepress/theme/easton-blog.css`

- [ ] 用纸张背景、细线和排版层级替换卡片网格、圆角、阴影和位移动画。
- [ ] 为 5 个精选位置提供固定的低饱和编辑插画纹理，不影响普通目录。
- [ ] 为 light、dark、sepia 提供主题变量，而不是逐组件复制颜色覆盖。
- [ ] 在 900px 和 640px 两个断点收敛精选、归档、页头和目录布局。
- [ ] 运行 `npm run build` 和 `git diff --check`，预期均成功。

### Task 6: 浏览器验收与文档同步

**Files:**
- Modify: `docs/md/sitelog/development/blog-visual-directions.md`
- Modify: `docs/md/sitelog/dev-log/blog-visual-redesign-skills-2026-08-12.md`

- [ ] 启动 `npm run dev -- --host 127.0.0.1`，检查首页、分类、系列、归档。
- [ ] 在桌面和 390px 移动端检查导航、标签切换、主题切换和无横向滚动。
- [ ] 检查 DOM 中不存在 `.article-card a .article-meta a` 嵌套链接。
- [ ] 把实际实施结果和验收结论写入设计记录与开发日志。
- [ ] 运行两个 Markdown 文件的 frontmatter、HTML 标签和图片引用 hooks。
- [ ] 停止开发服务器并关闭测试浏览器页面。
