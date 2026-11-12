---
title: "博客列表分页与 Easton 文章 Zen 布局修复实施计划"
date: "2026-08-14"
source: "Nova Vault Studio"
url: ""
---

# 博客列表分页与 Easton 文章 Zen 布局修复实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 `/md/blog/` 首页分页展示文章（每页 20 篇、页码同步 URL），并把 Easton 文章 Zen 模式的正文、Hero、文章尾部、评论统一为 820px 居中阅读列，补齐 Zen 导航的 Easton 主题色。

**Architecture:** 纯前端改动。`BlogIndexLayout.vue` 用 Vue Router query 维护页码并只渲染当前页切片；`easton-doc.css` 定义 `--easton-reading-width` 统一阅读列并强化 `.VPNav`/`.VPNavBar` 的 Easton 令牌覆盖；`ArticleHero.vue` 改为阅读列居中。不触碰索引生成脚本和 VitePress 源码。

**Tech Stack:** VitePress 1.6、Vue 3、单文件组件（`.vue` + scoped CSS）。

**验证方式说明:** 本项目为纯内容站点，无单元测试框架（见 `AGENTS.md`）。每个任务以「浏览器实测 + `npm run build`」作为验证信号。浏览器验证命令基于本仓库根目录 `npm run dev` 启动的本地服务。

---

## 文件结构

- `docs/.vitepress/theme/layouts/BlogIndexLayout.vue` — 分页状态、URL 同步、分页器模板。
- `docs/.vitepress/theme/easton-blog.css` — 分页器视觉（复用 `--clone-*` 令牌）。
- `docs/.vitepress/theme/components/ArticleHero.vue` — Hero 改为阅读列居中。
- `docs/.vitepress/theme/easton-doc.css` — 阅读列变量与几何、导航主题补齐、删除 1440px 偏移补偿。

---

### Task 1: 博客首页分页逻辑

**Files:**
- Modify: `docs/.vitepress/theme/layouts/BlogIndexLayout.vue`

- [ ] **Step 1: 在 `<script setup>` 顶部补齐导入与分页状态**

将 `BlogIndexLayout.vue:1-5` 的导入块替换为：

```js
<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()

const PAGE_SIZE = 20

const { index, featuredArticles, categories, series } = useBlogIndex()
```

- [ ] **Step 2: 在 `allArticles` 之后追加分页计算属性**

在 `BlogIndexLayout.vue:25`（`allArticles` 定义结束）之后追加：

```js
const pageCount = computed(() => Math.max(1, Math.ceil(allArticles.value.length / PAGE_SIZE)))

const currentPage = computed(() => {
  const raw = Number(route.query.page)
  if (!Number.isInteger(raw) || raw < 1) return 1
  return Math.min(raw, pageCount.value)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return allArticles.value.slice(start, start + PAGE_SIZE)
})

const showFeatured = computed(() => currentPage.value === 1)

const pageButtons = computed(() => {
  const total = pageCount.value
  const cur = currentPage.value
  const set = new Set([1, total, cur - 2, cur - 1, cur, cur + 1, cur + 2])
  return Array.from(set).filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
})
```

- [ ] **Step 3: 追加换页与 tab 切换函数**

在 `computed` 块之后、`</script>` 之前追加：

```js
async function goToPage(n) {
  const target = Math.min(Math.max(1, n), pageCount.value)
  await router.replace({ query: { ...route.query, page: target > 1 ? String(target) : undefined } })
  await nextTick()
  document.getElementById('all-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function selectMode(next) {
  mode.value = next
  router.replace({ query: {} })
}
```

- [ ] **Step 4: 更新模板：精选区仅在首页、列表走切片、追加分页器**

将 `BlogIndexLayout.vue:48-62` 的 `latest` 分支替换为：

```html
    <template v-if="mode === 'latest'">
      <section v-if="showFeatured && featured.length" class="blog-featured" aria-labelledby="featured-title">
        <div class="blog-subhead"><span>01</span><h2 id="featured-title">编辑精选</h2></div>
        <div class="blog-featured-grid">
          <ArticleCard v-for="a in featured" :key="a.path" :article="a" variant="feature" />
        </div>
      </section>
      <section class="blog-all" aria-labelledby="all-title">
        <div class="blog-subhead"><span>02</span><h2 id="all-title">全部文章</h2></div>
        <div v-if="paginatedArticles.length" class="blog-row-list">
          <ArticleCard v-for="a in paginatedArticles" :key="a.path" :article="a" variant="row" />
        </div>
        <p v-else class="blog-empty">暂无更多文章。</p>
        <nav v-if="pageCount > 1" class="blog-pagination" aria-label="文章分页">
          <button type="button" class="blog-pagination-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">上一页</button>
          <button
            v-for="p in pageButtons"
            :key="p"
            type="button"
            class="blog-pagination-btn"
            :class="{ active: p === currentPage }"
            :aria-current="p === currentPage ? 'page' : undefined"
            @click="goToPage(p)"
          >{{ p }}</button>
          <button type="button" class="blog-pagination-btn" :disabled="currentPage >= pageCount" @click="goToPage(currentPage + 1)">下一页</button>
          <span class="blog-pagination-total">共 {{ allArticles.length }} 篇 · {{ pageCount }} 页</span>
        </nav>
      </section>
    </template>
```

- [ ] **Step 5: 更新 tab 按钮点击，切模式时清页码**

将 `BlogIndexLayout.vue:42-44` 的三个 tab 按钮的 `@click` 改为：

```html
        <button :class="{ active: mode === 'latest' }" :aria-pressed="mode === 'latest'" @click="selectMode('latest')">最新</button>
        <button :class="{ active: mode === 'category' }" :aria-pressed="mode === 'category'" @click="selectMode('category')">分类</button>
        <button :class="{ active: mode === 'series' }" :aria-pressed="mode === 'series'" @click="selectMode('series')">系列</button>
```

- [ ] **Step 6: 浏览器验证分页行为**

运行 `npm run dev`（项目根目录），打开 `http://localhost:5173/md/blog/`：

- 首页第一页显示 5 篇精选 + 20 篇普通文章，列表底部出现分页器「上一页 1 2 … 30 下一页 共 582 篇 · 30 页」。
- 点击「下一页」：URL 变为 `?page=2`，滚动到「全部文章」标题，页面只显示 20 篇且无精选区。
- 直接打开 `http://localhost:5173/md/blog/?page=2`：显示第 2 页；`?page=999` 收敛到末页；`?page=abc` 收敛到第 1 页。
- 点击「分类」tab：URL 无 `page`，显示分类目录。
- 浏览器前进/后退能回到之前的页码。

**Expected:** 上述各点全部符合，控制台无报错。

---

### Task 2: 分页器样式

**Files:**
- Modify: `docs/.vitepress/theme/easton-blog.css`

- [ ] **Step 1: 在文件末尾（`BlogLayout.vue` 用到的 `@media (max-width: 640px)` 块之后）追加分页器样式**

```css
.blog-page .blog-pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  padding: 26px 0 0;
}

.blog-page .blog-pagination-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--clone-rule);
  border-radius: 2px;
  background: transparent;
  color: var(--clone-body);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease;
}

.blog-page .blog-pagination-btn:hover:not(:disabled),
.blog-page .blog-pagination-btn.active {
  color: var(--clone-accent);
  border-color: var(--clone-accent);
}

.blog-page .blog-pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.blog-page .blog-pagination-total {
  margin-left: auto;
  color: var(--clone-body);
  font-size: 12px;
}

@media (max-width: 640px) {
  .blog-page .blog-pagination-total {
    width: 100%;
    margin-left: 0;
    margin-top: 4px;
  }
}
```

- [ ] **Step 2: 验证样式**

在 Task 1 Step 6 的浏览器会话中刷新：

- 分页按钮使用 `--clone-*` 令牌，light/dark/sepia 三种色调下描边与文字跟随背景（切色调开关观察）。
- 当前页高亮为强调色，禁用按钮半透明，`.blog-pagination-total` 在桌面靠右、移动端换行靠左。
- 视口 390px 宽度下分页器不横向溢出。

**Expected:** 上述全部符合。

---

### Task 3: Hero 统一到阅读列

**Files:**
- Modify: `docs/.vitepress/theme/components/ArticleHero.vue`

- [ ] **Step 1: 桌面 Hero 改为阅读列居中**

将 `ArticleHero.vue:86-93` 的 `.article-hero` 规则改为：

```css
.article-hero {
  box-sizing: border-box;
  width: auto;
  max-width: var(--easton-reading-width, 820px);
  margin: 0 auto 32px;
  padding: 12px 42px 28px;
  border-bottom: 1px solid var(--easton-doc-rule, #d7cec2);
}
```

- [ ] **Step 2: 删除桌面 1280px 的宽度补偿**

删除 `ArticleHero.vue:164-168` 整个 `@media (min-width: 1280px)` 块（其中 `width: calc(100% - 256px)` 是导致 Hero 与正文不对齐的旧补丁）。

- [ ] **Step 3: 保留移动端规则不变**

`ArticleHero.vue:170-177` 的 `@media (max-width: 960px)` 保持 `width: auto; max-width: none; margin: 0 0 28px;`，仅作视觉确认。

**Expected:** 代码 diff 只包含上述两处几何改动。

---

### Task 4: 统一阅读列变量与正文/尾部/评论居中

**Files:**
- Modify: `docs/.vitepress/theme/easton-doc.css`

- [ ] **Step 1: 在 Easton 根节点定义阅读宽度变量**

在 `easton-doc.css:1-11` 的 `html[data-landing-theme="easton"] { ... }` 块内（`--easton-doc-shadow` 行之后）追加：

```css
  --easton-reading-width: 820px;
```

- [ ] **Step 2: 正文 content-container 使用变量并居中**

将 `easton-doc.css:123-130` 的 `.content-container` 规则改为：

```css
html[data-landing-theme="easton"] .easton-doc-shell .VPDoc .content-container {
  max-width: var(--easton-reading-width);
  margin-inline: auto;
  padding: 42px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

- [ ] **Step 3: 文章尾部与评论居中**

在 `easton-doc.css:360`（`html[data-landing-theme="easton"] .easton-doc-shell div.giscus { padding: 24px; }`）之后追加：

```css
html[data-landing-theme="easton"] .easton-article-shell .blog-article-shell,
html[data-landing-theme="easton"] .easton-article-shell div.giscus {
  width: 100%;
  max-width: var(--easton-reading-width);
  margin-inline: auto;
}
```

- [ ] **Step 4: 删除 1440px 偏移补偿**

删除 `easton-doc.css:354-358` 的整个 `@media (min-width: 1440px)` 块：

```css
@media (min-width: 1440px) {
  html[data-landing-theme="easton"] .easton-article-shell.is-sidebar-collapsed .VPContent.has-sidebar {
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2);
  }
}
```

- [ ] **Step 5: 浏览器验证 Zen 居中对齐**

在 `http://localhost:5173` 的 Easton 文章页（例如 `/md/columns/agentic-engineer/pensieve/01-architecture`）：

- 桌面（1200px 与 1440px）下，Hero 左边缘、正文首列左边缘、文章尾部左边缘、评论左边缘在同一条竖线上，右边缘同理。
- 切换「显示目录/隐藏目录」后中心线不变。
- 390px 移动端正文与 Hero 保持现有单列，不产生横向滚动。

**Expected:** 各元素垂直中线重合。

---

### Task 5: Zen 导航主题补齐

**Files:**
- Modify: `docs/.vitepress/theme/easton-doc.css`

- [ ] **Step 1: 强化导航容器背景覆盖**

在 `easton-doc.css:76-78`（现有 `.VPNavBar { backdrop-filter }` 之后）追加：

```css
html[data-landing-theme="easton"] .easton-doc-shell .VPNav,
html[data-landing-theme="easton"] .easton-doc-shell .VPNavBar .container,
html[data-landing-theme="easton"] .easton-doc-shell .VPNavBar .content {
  background: transparent;
}
```

- [ ] **Step 2: 强化标题、菜单、搜索、下拉的令牌覆盖**

在 `easton-doc.css:98`（`.local-search-button` 规则之后）追加：

```css
html[data-landing-theme="easton"] .easton-doc-shell .VPNavBar .divider {
  background-color: var(--easton-doc-rule);
}

html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarTitle,
html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarMenu,
html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarExtra {
  background-color: transparent;
}

html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarMenuGroup .button,
html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarMenuLink {
  color: var(--easton-doc-ink);
}

html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarMenuGroup .button:hover,
html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarMenuLink:hover {
  color: var(--easton-doc-accent);
}

html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarSearch .DocSearch-Button,
html[data-landing-theme="easton"] .easton-doc-shell .VPNavBarSearch .local-search-button {
  border-color: var(--easton-doc-rule);
  background: color-mix(in srgb, var(--easton-doc-surface) 78%, transparent);
  color: var(--easton-doc-body);
}
```

- [ ] **Step 3: 浏览器验证三种色调**

在 Easton 文章页桌面（Zen 折叠态），依次切换 light / dark / sepia：

- 顶部导航背景始终为当前色调的 `--easton-doc-bg` 暖色，不再是白色。
- 菜单链接、标题、搜索框描边、下拉菜单背景跟随当前色调。
- 移动端 `< 960px` 仍显示移动菜单入口，未被误隐藏。

**Expected:** 三种色调下导航均非白色且文字可读。

---

### Task 6: 构建与全量验证

**Files:**
- None (verification only)

- [ ] **Step 1: 运行 Markdown hooks 与构建**

```bash
python3 .claude/hooks/check-frontmatter.py "docs/superpowers/specs/2026-08-14-blog-list-pagination-and-easton-zen-design.md"
python3 .claude/hooks/check-frontmatter.py "docs/superpowers/plans/2026-08-14-blog-list-pagination-and-easton-zen-implementation-plan.md"
git diff --check
npm run build
```

**Expected:** hooks 无输出，`git diff --check` 无输出，build 成功（`build complete in ...`）。

- [ ] **Step 2: 浏览器回归抽查**

在构建前 dev 会话中抽查：

- `/md/blog/`、`/md/blog/?page=3`、`/md/blog/category/…`、`/md/blog/series/…`、`/md/blog/archive/…` 均正常。
- Library/quiet 模式下的 `/md/blog/` 列表与 Easton 模式分页行为一致。
- 普通文档页（如 `/md/guide/…`）侧边栏、分页、导航无回归。

**Expected:** 上述各页正常，无控制台报错。

- [ ] **Step 3: 清理 visual companion server**

```bash
"/home/fenghaolin/.agents/skills/superpowers/skills/brainstorming/scripts/stop-server.sh" "/home/fenghaolin/workspace/prj/opensource/nova-vault-studio/.superpowers/brainstorm/1129921-1786685394"
ps aux | grep -E "(vitepress|vite)" | grep -v grep
```

**Expected:** visual companion server 停止；本项目 dev server 按要求保留或停止（执行时询问用户）。
