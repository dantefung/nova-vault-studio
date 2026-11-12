---
title: "Blog Theme and Zen Regression Fix Implementation Plan"
date: "2026-08-13"
source: "Nova Vault Studio"
url: ""
---

# Blog Theme and Zen Regression Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 恢复统一博客品牌，使 Library 与 Blog 都能完整呈现博客结构，并修复 Easton 文章页的桌面布局、重复分页和可持久化 Zen 侧边栏。

**Architecture:** 保留现有布局分发和索引数据，把 `easton-blog.css` 拆成主题无关结构与两套视觉令牌。`MyLayout.vue` 单独拥有桌面 Zen 状态和持久化，文章增强组件只修正自身布局，不修改 VitePress 内部代码。

**Tech Stack:** Vue 3、VitePress、CSS、localStorage、Playwright/浏览器验收

---

## 文件职责

- `docs/.vitepress/theme/layouts/BlogLayout.vue`：恢复博客公共品牌。
- `docs/.vitepress/theme/easton-blog.css`：共享博客结构、Blog 视觉令牌和 Library 视觉令牌。
- `docs/.vitepress/theme/components/ArticleCard.vue`：让标题字体由当前 landing theme 的页面令牌控制。
- `docs/.vitepress/theme/MyLayout.vue`：Easton 文章 Zen 状态、持久化和顶部切换按钮。
- `docs/.vitepress/theme/easton-doc.css`：Zen 按钮视觉、桌面侧栏隐藏、VitePress 偏移回收及原生分页定向隐藏。
- `docs/.vitepress/theme/layouts/BlogArticleShell.vue`：使用完整单列，并在存在 series 时追加系列进度。
- `docs/.vitepress/theme/components/RelatedArticles.vue`：将相关文章的单列断点统一为 960px。
- `docs/superpowers/specs/2026-08-13-blog-theme-and-zen-regression-fix-design.md`：已批准的验收真源，不在实施中改变需求。

### Task 1: 恢复品牌并建立博客双主题样式边界

**Files:**
- Modify: `docs/.vitepress/theme/layouts/BlogLayout.vue:28-68`
- Modify: `docs/.vitepress/theme/easton-blog.css:1-363`
- Modify: `docs/.vitepress/theme/components/ArticleCard.vue:146-152`

- [ ] **Step 1: 记录当前失败基线**

启动开发站点并在浏览器分别把 landing theme 设为 `quiet` 和 `easton`，访问 `/md/blog/`。确认 quiet 下 `.blog-featured-grid` 的 computed `display` 不是 `grid`，并确认页头文字为“花叔的系统笔记”。

Run: `npm run dev -- --host 127.0.0.1`

Expected: 页面可访问，Library 模式缺少 `easton-blog.css` 的核心布局规则，品牌为错误文案。

- [ ] **Step 2: 恢复统一品牌**

将 `BlogLayout.vue` 页头和页脚的两处品牌文字都改为：

```vue
<span>System Vault</span>
```

保留现有作者说明、链接和控制组件不变。

- [ ] **Step 3: 为两种 landing theme 定义页面令牌**

将 `easton-blog.css` 的根规则改为页面类作用域。Blog 令牌继续使用现值：

```css
.blog-page {
  --clone-bg: var(--vp-c-bg);
  --clone-surface: var(--vp-c-bg-soft);
  --clone-ink: var(--vp-c-text-1);
  --clone-body: var(--vp-c-text-2);
  --clone-accent: var(--vp-c-brand-1);
  --clone-rule: var(--vp-c-divider);
  --easton-doc-bg: var(--clone-bg);
  --easton-doc-surface: var(--clone-surface);
  --easton-doc-soft: var(--vp-c-bg-soft);
  --easton-doc-ink: var(--clone-ink);
  --easton-doc-body: var(--clone-body);
  --easton-doc-muted: var(--vp-c-text-3);
  --easton-doc-accent: var(--clone-accent);
  --easton-doc-rule: var(--clone-rule);
  min-height: 100vh;
  background: var(--clone-bg);
  color: var(--clone-ink);
}

.blog-page.landing-theme-easton {
  --clone-bg: #f5f0e8;
  --clone-surface: #fffaf3;
  --clone-ink: #24211e;
  --clone-body: #6e655c;
  --clone-accent: #e7683d;
  --clone-rule: #d7cec2;
  --easton-doc-soft: #eee5d8;
  --blog-heading-font: Georgia, 'LXGW WenKai', serif;
  font-family: 'LXGW WenKai', Georgia, serif;
}

.blog-page.landing-theme-quiet {
  --blog-heading-font: var(--vp-font-family-base);
  font-family: var(--vp-font-family-base);
}
```

将 dark、sepia 的 Easton 令牌限制到 `.blog-page.landing-theme-easton.theme-dark` 和 `.blog-page.landing-theme-easton.theme-sepia`，避免覆盖 Library 的 VitePress 令牌。

- [ ] **Step 4: 解耦全部结构选择器**

把所有如下选择器：

```css
html[data-landing-theme="easton"] .blog-page .blog-featured-grid
```

改成：

```css
.blog-page .blog-featured-grid
```

对 `main.blog-main`、索引页头、tabs、subhead、featured grid、row list、directory、tile、archive、empty、footer 及 900px/640px 响应式规则执行同样转换。仅 Easton 专属字体规则使用：

```css
.blog-page.landing-theme-easton .blog-index-intro h1,
.blog-page.landing-theme-easton .blog-archive-heading h1,
.blog-page.landing-theme-easton .blog-subhead h2,
.blog-page.landing-theme-easton .blog-tile b {
  font-family: Georgia, 'LXGW WenKai', serif;
}
```

把 `ArticleCard.vue` 的固定标题字体改为页面令牌：

```css
.article-card-title {
  font-family: var(--blog-heading-font, 'LXGW WenKai', Georgia, serif);
}
```

Library 的标题和条目由 `--blog-heading-font` 使用 VitePress 字体；Blog 继续使用 Easton 衬线字体，不复制整套结构。

- [ ] **Step 5: 收紧 Library 信息密度**

增加仅 quiet 模式生效的间距覆盖，确保不比 Blog 更松：

```css
.blog-page.landing-theme-quiet main.blog-main {
  padding-top: 56px;
  padding-bottom: 80px;
}

.blog-page.landing-theme-quiet .easton-clone-section-head {
  margin-bottom: 52px;
}

.blog-page.landing-theme-quiet .blog-all {
  margin-top: 72px;
}

.blog-page.landing-theme-quiet .blog-tile {
  padding-block: 16px;
}
```

- [ ] **Step 6: 验证博客两种主题**

在 `/md/blog/`、`/md/blog/category/sources/`、一个现有 series 路由和 `/md/blog/archive/` 上分别切换 Library/Blog。检查首页精选布局、子页文字目录、归档双列以及 900px、640px 响应式。

Expected: 两种模式 DOM 相同且结构完整；Library 使用 `--vp-c-*` 视觉，Blog 保持 `9bcc63ab` 基线；品牌均为 `System Vault`。

### Task 2: 消除文章增强区的空栏和错误响应式

**Files:**
- Modify: `docs/.vitepress/theme/layouts/BlogArticleShell.vue:25-79`
- Modify: `docs/.vitepress/theme/components/RelatedArticles.vue:62-72`

- [ ] **Step 1: 记录无 series 的空栏基线**

在一个 `articleByPath` 命中但无 `series` 的 Easton 文章上检查 `.blog-article-shell-grid`。确认 computed grid 仍为 `minmax(0, 1fr) 280px`，但 DOM 中不存在 `.blog-article-shell-aside`。

Expected: 复现空 280px 栏。

- [ ] **Step 2: 消除固定系列列**

保留 series 的条件渲染，把 Shell CSS 改为完整单列：

```css
.blog-article-shell-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

```

删除原固定 `280px` 列和相关媒体查询。VitePress 正文容器最大宽度为 820px，不在这个容器中硬塞第二列。

- [ ] **Step 3: 统一相关文章断点**

把 `RelatedArticles.vue` 的断点从 `720px` 改为：

```css
@media (max-width: 959.98px) {
  .related-articles-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: 验证文章增强布局**

检查无 series 文章和 `/md/columns/agentic-engineer/pensieve/01-architecture`：

- 959px：Shell 单列，相关文章单列。
- 960px、961px、1200px 和 1440px：Shell 仍使用完整单列，相关文章双列。
- 有 series 时，系列进度排在相关文章之后；无 series 时不渲染系列进度。

Expected: 不再出现无数据空栏，系列和相关文章断点与规格一致。

### Task 3: 实现可持久化的桌面 Zen 侧边栏

**Files:**
- Modify: `docs/.vitepress/theme/MyLayout.vue:1-98`
- Modify: `docs/.vitepress/theme/easton-doc.css:100-354`

- [ ] **Step 1: 在 MyLayout 中增加 SSR 安全状态**

合并 Vue 导入，加入 `onMounted`：

```js
import { computed, onMounted, ref, watch } from 'vue'
```

增加状态和固定存储合同：

```js
const SIDEBAR_STORAGE_KEY = 'easton-article-sidebar-collapsed'
const isArticleSidebarCollapsed = ref(true)

onMounted(() => {
  try {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    isArticleSidebarCollapsed.value = saved === 'false' ? false : true
  } catch {
    isArticleSidebarCollapsed.value = true
  }
})

function toggleArticleSidebar() {
  isArticleSidebarCollapsed.value = !isArticleSidebarCollapsed.value
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isArticleSidebarCollapsed.value))
  } catch {
    // Current-session state remains usable when storage is unavailable.
  }
}
```

- [ ] **Step 2: 给文章壳和顶部导航接入状态**

把文章外层改为：

```vue
<div
  v-else-if="isArticle"
  class="doc-layout-shell easton-doc-shell easton-article-shell"
  :class="{ 'is-sidebar-collapsed': isArticleSidebarCollapsed }"
>
```

在 `#nav-bar-content-after` 的现有控件之前加入：

```vue
<button
  type="button"
  class="easton-sidebar-toggle"
  :aria-expanded="String(!isArticleSidebarCollapsed)"
  aria-controls="VPSidebarNav"
  @click="toggleArticleSidebar"
>
  {{ isArticleSidebarCollapsed ? '显示目录' : '隐藏目录' }}
</button>
```

- [ ] **Step 3: 样式化切换按钮并限制到桌面**

在 `easton-doc.css` 增加：

```css
.easton-sidebar-toggle {
  display: none;
}

@media (min-width: 960px) {
  html[data-landing-theme="easton"] .easton-article-shell .easton-sidebar-toggle {
    display: inline-flex;
    align-items: center;
    height: 32px;
    padding: 0 10px;
    border: 1px solid var(--easton-doc-rule);
    border-radius: 2px;
    background: transparent;
    color: var(--easton-doc-body);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }
}
```

- [ ] **Step 4: 隐藏桌面侧栏并回收 VitePress 偏移**

在 `@media (min-width: 960px)` 下定向增加：

```css
html[data-landing-theme="easton"] .easton-article-shell.is-sidebar-collapsed .VPSidebar {
  display: none;
}

html[data-landing-theme="easton"] .easton-article-shell.is-sidebar-collapsed .VPContent.has-sidebar {
  padding-left: 0;
}

html[data-landing-theme="easton"] .easton-article-shell.is-sidebar-collapsed .VPNavBar.has-sidebar .title {
  position: relative;
  width: auto;
}

html[data-landing-theme="easton"] .easton-article-shell.is-sidebar-collapsed .VPNavBar.has-sidebar .content,
html[data-landing-theme="easton"] .easton-article-shell.is-sidebar-collapsed .VPNavBar.has-sidebar .divider,
html[data-landing-theme="easton"] .easton-article-shell.is-sidebar-collapsed .VPLocalNav.has-sidebar {
  padding-left: 0;
}
```

在 `@media (min-width: 1440px)` 下恢复居中 gutter，而不是保留侧栏宽度：

```css
html[data-landing-theme="easton"] .easton-article-shell.is-sidebar-collapsed .VPContent.has-sidebar {
  padding-left: calc((100vw - var(--vp-layout-max-width)) / 2);
}
```

- [ ] **Step 5: 验证 Zen 状态合同**

清除 `easton-article-sidebar-collapsed` 后进入 Easton 文章，确认桌面默认折叠。点击“显示目录”，确认键值为字符串 `false`；刷新、切换文章、切到 quiet 再切回 Easton，确认仍展开。再次折叠后确认键值为字符串 `true`。

手动写入非法值后刷新：

```js
localStorage.setItem('easton-article-sidebar-collapsed', 'invalid')
```

Expected: 非法值按折叠处理；390px、640px、899px、959px 不显示 Zen 按钮，原生移动侧栏可用。

通过浏览器运行时覆盖或 DevTools 断点让 `Storage.prototype.getItem` 抛错并刷新，确认页面仍按默认折叠渲染；再让 `Storage.prototype.setItem` 抛错并点击切换按钮，确认当前页面的按钮文案、折叠类和侧边栏状态仍然切换。恢复原方法后继续后续验收。

### Task 4: 消除 Easton 文章页的重复分页

**Files:**
- Modify: `docs/.vitepress/theme/easton-doc.css:290-296`

- [ ] **Step 1: 记录重复分页基线**

在一个同时有博客索引前后篇和 VitePress sidebar 前后篇的 Easton 文章中，确认页面包含 VitePress `.VPDocFooter .prev-next` 和自定义 `.article-nav`。

Expected: 同页出现两套上一篇/下一篇。

- [ ] **Step 2: 定向隐藏原生分页**

加入严格作用域规则：

```css
html[data-landing-theme="easton"] .easton-article-shell .VPDocFooter .prev-next {
  display: none;
}
```

不要隐藏 `.VPDocFooter` 本体，也不要作用于 `.easton-doc-shell` 或所有文档。

- [ ] **Step 3: 验证导航所有权**

检查 Easton `isArticle` 页面只剩 `.article-nav`。再检查一个不满足 `isArticle` 的普通 `/md/` 文档，确认 VitePress `.VPDocFooter .prev-next` 仍然存在。

Expected: Easton 文章按博客索引导航，普通文档不受影响。

### Task 5: 构建和浏览器回归验收

**Files:**
- Verify: `docs/.vitepress/theme/layouts/BlogLayout.vue`
- Verify: `docs/.vitepress/theme/easton-blog.css`
- Verify: `docs/.vitepress/theme/MyLayout.vue`
- Verify: `docs/.vitepress/theme/easton-doc.css`
- Verify: `docs/.vitepress/theme/layouts/BlogArticleShell.vue`
- Verify: `docs/.vitepress/theme/components/RelatedArticles.vue`
- Verify: `docs/superpowers/specs/2026-08-13-blog-theme-and-zen-regression-fix-design.md`
- Verify: `docs/superpowers/plans/2026-08-13-blog-theme-and-zen-regression-fix.md`

- [ ] **Step 1: 运行文档与差异检查**

Run:

```bash
python3 .claude/hooks/check-frontmatter.py docs/superpowers/specs/2026-08-13-blog-theme-and-zen-regression-fix-design.md
python3 .claude/hooks/check-html-tags.py docs/superpowers/specs/2026-08-13-blog-theme-and-zen-regression-fix-design.md
python3 .claude/hooks/check-image-refs.py docs/superpowers/specs/2026-08-13-blog-theme-and-zen-regression-fix-design.md
python3 .claude/hooks/check-frontmatter.py docs/superpowers/plans/2026-08-13-blog-theme-and-zen-regression-fix.md
python3 .claude/hooks/check-html-tags.py docs/superpowers/plans/2026-08-13-blog-theme-and-zen-regression-fix.md
python3 .claude/hooks/check-image-refs.py docs/superpowers/plans/2026-08-13-blog-theme-and-zen-regression-fix.md
git diff --check
```

Expected: 全部退出码为 0，无输出或仅有非阻塞说明。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: VitePress 构建成功；允许保留已知的三篇超长 Markdown route-level chunk 警告，不新增 Vue、CSS 或链接错误。

- [ ] **Step 3: 执行桌面与边界宽度验收**

使用浏览器检查 390px、640px、899px、959px、960px、1199px、1200px 和 1440px：

- `/md/blog/` 的 Library/Blog 主题。
- `/md/blog/category/sources/`、现有 series 页和 `/md/blog/archive/`。
- 一篇无 series 的 Easton 文章。
- `/md/columns/agentic-engineer/pensieve/01-architecture`。
- 一个普通 VitePress 文档。

Expected: 无横向滚动，断点、导航、侧栏和品牌均符合规格。

- [ ] **Step 4: 检查浏览器错误和资源清理**

确认控制台没有新增 error，停止 `npm run dev`，关闭测试打开的浏览器标签页，并检查残留进程：

Run: `ps aux | grep -E "(vite|uvicorn)" | grep -v grep`

Expected: 没有本次测试启动的 Vite 或 uvicorn 进程。
