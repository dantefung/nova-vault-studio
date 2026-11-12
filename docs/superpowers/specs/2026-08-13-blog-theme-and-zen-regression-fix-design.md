---
title: "博客双主题与文章 Zen 布局回归修复设计"
date: "2026-08-13"
source: "Nova Vault Studio"
url: ""
---

# 博客双主题与文章 Zen 布局回归修复设计

## 目标

修复博客视觉升级后出现的四项用户可见回归：恢复统一站点品牌、让 Library 模式完整呈现博客结构、恢复 Easton 文章页的桌面布局，并让文章页默认进入可恢复的 Zen 阅读模式。

## 范围

- 调整 `/md/blog/` 在 Library 与 Blog 两种 landing theme 下的样式边界和视觉令牌。
- 调整 Easton 内容文章页的侧边栏、上一篇/下一篇、相关文章和系列进度布局。
- 保留现有博客信息结构、URL、索引数据、主题切换和移动端导航。
- 不修改 Markdown 内容、博客索引生成脚本、VitePress 源码或 `node_modules`。

## 品牌

- 博客页头和页脚统一使用站点品牌 `System Vault`。
- 删除博客布局中的“花叔的系统笔记”文案。
- 本次只恢复现有品牌，不新增品牌配置层或子品牌机制。

## 博客双主题

本文中的主题名称与状态值固定对应：Library 为 `currentLandingTheme === 'quiet'`，Blog 为 `currentLandingTheme === 'easton'`。

### 共享结构

Library 与 Blog 模式复用同一套 Vue 结构和结构 CSS，包括：

- 编辑式导语。
- 5 篇精选文章。
- 全部文章文字目录。
- 分类、系列和归档布局。
- 900px 与 640px 响应式行为。

网格、间距、排列和断点不得依赖 `html[data-landing-theme="easton"]`。切换到 Library 后，页面不能退化为仅有全局页头和无布局内容的半成品状态。

### 主题视觉

- Blog 模式继续使用现有“克制出版”视觉：纸张感表面、编辑式衬线标题、宽留白和低饱和强调色。
- Library 模式保留相同信息结构，复用 VitePress `--vp-c-*` 颜色令牌、站点无衬线正文字体和现有 Library 页面边线；纵向间距不得大于同一结构在 Blog 模式下的间距。
- 两种模式通过页面级视觉令牌区分，不复制组件 DOM，也不复制整份博客 CSS。
- `ArticleCard` 使用的颜色变量必须在两种模式下都有定义，不能依赖只在 Easton 根节点存在的变量。

## Easton 文章桌面布局

### 布局规则

- 无系列文章使用完整单列增强区，不预留空的 `280px` 系列栏。
- 有系列文章使用单列，系列进度排在相关文章之后。VitePress 正文容器最大宽度为 820px，不再把它硬拆成狭窄的正文增强区和 `280px` 系列栏。
- 相关文章在 `>= 960px` 时显示双列，低于 `960px` 时显示单列；CSS 边界使用 `max-width: 959.98px` 避免与桌面规则重叠。

### 文章导航

- Easton 内容文章只保留 `ArticleNav` 生成的一套上一篇/下一篇。
- 导航顺序继续来自博客索引，避免改变现有博客阅读顺序。
- Easton 文章页定向隐藏 VitePress 原生 `VPDocFooter` 分页，避免同页出现两套顺序可能不同的导航。
- 普通知识库文档继续使用 VitePress 原生分页，不受影响。

## Zen 侧边栏

### 默认行为

- Easton 内容文章在桌面端默认折叠 VitePress 侧边栏。
- “Easton 内容文章”严格沿用 `MyLayout.vue` 的 `isArticle` 判定：landing theme 为 `easton`，且路由不属于 landing page 或 `/md/blog/`，并且路由以 `/md/wiki/`、`/md/columns/`、`/md/business/` 开头或被 `articleByPath(route.path)` 命中。例如 `/md/columns/agentic-engineer/pensieve/01-architecture` 启用 Zen；`/md/blog/` 和 quiet 模式下的同一路由不启用 Zen。
- 顶部导航在符合 Zen 条件的桌面文章页始终显示“显示目录/隐藏目录”切换按钮。
- 用户手动切换后，将选择写入 `localStorage` 的 `easton-article-sidebar-collapsed` 键；值域仅为字符串 `true` 或 `false`。刷新页面、进入其他 Easton 文章以及切换到 quiet 后再切回 Easton时，均恢复该选择。
- 尚无持久化值时使用“折叠”作为默认值。
- 缺失值和非法值都按 `true` 处理；读取或写入失败时保留当前会话中的响应式状态，不阻断渲染。

### 布局回收

折叠侧边栏时必须同时回收以下由 VitePress `has-sidebar` 状态产生的空间：

- `.VPSidebar` 本体。
- `.VPContent` 左侧偏移。
- `.VPNavBar` 标题、内容和分隔线偏移。
- `.VPLocalNav` 左侧偏移。

实现放在 `MyLayout.vue` 和 `easton-doc.css`，不修改 VitePress 内部组件。Zen 状态只作用于 Easton 内容文章，不能影响普通文档和博客索引页。

### 移动端

- 桌面 Zen 折叠规则仅在 `>= 960px` 生效。
- 移动端继续使用 VitePress 原生侧边栏抽屉和现有移动导航。
- Zen 切换按钮在移动端不显示，避免与原生菜单产生两个入口。

## 状态与数据流

1. `MyLayout.vue` 使用现有 `isArticle` 判断是否启用 Easton 文章壳；该判定已经包含 landing theme 条件。
2. 初始化时读取 `easton-article-sidebar-collapsed`；不存在或非法时默认为折叠。
3. 用户点击导航按钮后更新响应式状态并同步持久化。
4. 外层文章壳根据状态增加折叠类，CSS 负责隐藏侧边栏和回收布局空间。
5. 路由切换不重置状态，因此用户选择在文章之间保持。

## 组件边界

- `BlogLayout.vue`：恢复品牌，继续负责博客公共页头、页脚和路由分发。
- `easton-blog.css`：拆分共享结构规则与 Library/Blog 视觉令牌。
- `MyLayout.vue`：拥有 Easton 文章 Zen 状态、持久化逻辑和切换入口。
- `easton-doc.css`：负责桌面侧边栏折叠及 VitePress 布局偏移回收。
- `BlogArticleShell.vue`：使用完整单列；存在系列数据时在相关文章后追加系列进度。
- `ArticleNav.vue`：保持博客索引导航的数据所有权。
- `RelatedArticles.vue`：保持相关推荐内容逻辑，只调整必要的响应式布局。

## 兼容性

- 不改变任何文章 URL、分类、系列、归档或博客索引数据。
- 不改变 light、dark、sepia 内容主题能力。
- 不改变 Library 与 Blog landing theme 的切换方式。
- 不改变普通 VitePress 文档的侧边栏和原生分页。
- 不删除 `ArticleFooterNav.vue` 等与本次修复无关的死代码，避免扩大范围。

## 验收标准

- `/md/blog/` 首页、分类页、系列页和归档页在 Library 模式下完整显示既有结构，并使用 `--vp-c-*` 令牌、无衬线正文和不宽于 Blog 模式的纵向间距。
- `/md/blog/` 首页、分类页、系列页和归档页在 Blog 模式下保持当前提交 `9bcc63ab` 的“克制出版”视觉基线。
- 博客页头和页脚显示 `System Vault`，不再显示“花叔的系统笔记”。
- 以无 series 的普通索引文章验证不存在空的 `280px` 栏；以 `/md/columns/agentic-engineer/pensieve/01-architecture` 验证有 series 布局。
- Easton 文章页只有一套上一篇/下一篇；普通文档仍保留 VitePress 原生分页。相关文章在 `>= 960px` 呈双列，在 `< 960px` 呈单列。
- 首次进入 Easton 桌面文章时侧边栏折叠，正文占用回收后的可用宽度。
- 用户展开侧边栏后，刷新和切换文章仍保持展开；再次折叠后同样保持。
- 在 390px、640px、899px、959px、960px、1200px 和桌面宽屏下检查导航、侧栏、正文宽度、系列顺序和横向滚动；`< 960px` 继续使用原生菜单且不显示 Zen 按钮，文章增强区始终使用完整单列。
- 运行 `python3 .claude/hooks/check-frontmatter.py <spec>`、`python3 .claude/hooks/check-html-tags.py <spec>`、`python3 .claude/hooks/check-image-refs.py <spec>`、`npm run build` 和 `git diff --check`，全部通过。
