---
title: "Astro 全量迁移实施报告"
date: "2026-11-12"
source: "Nova Vault Studio"
url: ""
---

# Astro 全量迁移实施报告

> 分支：`feat/astro-rebuild`
> 目标：把整站从 VitePress 1.6.4 迁移到 Astro（静态输出），实现「现代化 MDX → HTML」。
> 关联文档：`devlog/analysis/2026-11-12-tech-stack-rebuild-branches.md`、`devlog/plans/2026-11-12-astro-full-migration-plan.md`

---

## 一、结论先说

| 项 | 结果 |
|---|---|
| 全站页面 | **3,999 篇全部构建通过**（VitePress 时期同为 3,999 篇） |
| 构建耗时 | 本地 **53–90 秒**（VitePress 时期需 7 分钟且在 Vercel 上 OOM） |
| 站内死链 | **迁移新增 0 条**（脚本 `scripts/compare-dead-links.mjs` 可复现验证） |
| URL 兼容 | `/md/**` 全部保持不变，3000+ 条历史链接不失效 |
| 遗留死链 | 103 条，**VitePress 时期同样存在**（`ignoreDeadLinks: true` 掩盖），本次未新增 |

---

## 二、架构决策与理由

### 2.1 为什么选 Astro 而不是 Next.js

| 维度 | Astro | Next.js |
|---|---|---|
| 内容模型 | Content Collections + Zod schema，frontmatter 编译期校验 | 无内置内容层，需自建 MDX loader |
| MDX 支持 | `@astrojs/mdx` 官方集成， remark/rehype 可插拔 | 需手写 loader / mdx-remote |
| 输出 | 纯静态 HTML，零运行时函数 | 默认 SSR，需配置静态导出 |
| 内存 | 内容在构建期处理，运行期无 Node 进程 | SSR 常驻内存 |
| 站内搜索 | 可生成静态索引，客户端匹配 | 需单独搜索服务 |

站内是**内容站**（3,999 篇文档 + 843MB 资源），不是应用。Astro 的「构建期做完一切、运行期只发静态文件」正好对上需求，也顺手解决了 VitePress 时期 Vercel 构建 OOM 的老问题。

### 2.2 关键实现决策

**① 内容源不搬家，用自定义 loader 读取**

`src/lib/docs-loader.ts` 代替 `astro/loaders` 的 `glob()`。原因：glob loader 会让 `astro:assets` 接管 md 里的图片并走 sharp 优化，站内大量 SVG 让 sharp 的元数据解析直接抛 `NoImageMetadata`，构建中断。图片早已压过（`scripts/optimize-images.mjs` + 500KB 钩子），且必须按 VitePress 时期的原路径提供（`/md/.../images/x.png`），不能哈希化。

**② Markdown 走自建管线，不用 Astro 内置**

`src/lib/markdown.ts` 补齐 VitePress 时期的 8 项能力：

| 能力 | 说明 |
|---|---|
| wikilink | `[[concepts/foo]]` → 站内链接；**解析不到目标时保留纯文本**（VitePress 原本就原样显示，转成死链是倒退） |
| 相对 `.md` 链接 | 按源文件所在目录解析，剥掉 `.md` |
| 相对图片 | 同上，解析成 `/md/...` 绝对路径 |
| 容器块 | `::: info` → `<div class="vp-block info">` |
| mermaid | 代码块 → `<div class="mermaid">`，客户端渲染 |
| markmap | 代码块 → `<svg class="markmap-svg">`，客户端渲染，DOM 结构与 VitePress 一致 |
| VitePress 组件 | `<PdfViewer>` / `<PdfList>` / `<HtmlViewer>` → 同名自定义元素 |
| Vue 专用块 | `<script setup>` / `<template>` 移除 |

**③ 主题用 CSS 变量 + data 属性，从根上消除白屏**

VitePress 1.6.4 的首页白屏根因是「SSR 渲染的分支与客户端期望不一致」。Astro 静态输出没有这个中间态：主题切换只改 `html[data-theme]`，所有差异由 CSS 变量承载，**不触发任何 DOM 结构变化**。

**④ 侧边栏/导航逻辑与 VitePress 共用一份**

`docs/.vitepress/sidebar.js` 里那 100+ 条中文目录名映射与排序规则，薄包装成 `scripts/lib/sidebar-core.mjs`，VitePress 侧改为 re-export，Astro 侧 `scripts/build-astro-nav.mjs` 直接引用。两边不会漂移。

**⑤ 搜索从全量分词改为轻量索引**

VitePress 时期的 local search 需要在构建期渲染全部 3,999 篇才能建索引，这正是 Vercel 构建内存压力大、需要 `SEARCH_MODE=partial` 降级的原因。Astro 侧改为构建期只提取「标题 + 摘要 + 首段 + 分类」，索引 1,064 KB，客户端按需加载后做子串匹配。

---

## 三、目录结构

```
astro-app/
├── astro.config.mjs          # 静态输出、sitemap、Vite 别名
├── package.json
├── scripts/
│   └── cdp-validate.mjs      # CDP 真浏览器验证（沿用原方案）
└── src/
    ├── content.config.ts     # collection 定义 + Zod schema
    ├── lib/
    │   ├── docs-loader.ts    # 自定义内容加载器（绕开 astro:assets）
    │   ├── markdown.ts       # Markdown 管线（8 项 VitePress 能力）
    │   ├── content.ts        # URL 映射与标题兜底
    │   └── theme.ts          # 主题定义与首屏脚本
    ├── layouts/BaseLayout.astro
    ├── components/           # Sidebar / NavBar / Outline / ThemeSwitcher / Giscus / SearchBox ...
    ├── pages/
    │   ├── index.astro                    # 落地页
    │   ├── md/[...path].astro             # 全站 3,999 篇文档
    │   ├── md/blog/**                     # 博客（列表/归档/分类/系列）
    │   ├── md/resources/index.astro       # 资源导航
    │   ├── pdf-manifest.json.ts           # PDF 书籍清单接口
    │   └── rss.xml.ts                     # RSS 订阅源
    ├── scripts/               # 客户端：theme / islands / mermaid / markmap / search
    ├── styles/                # site.css / pages.css + VitePress 设计变量
    └── generated/             # 构建期生成（nav.json / doc-index.json）
```

仓库级新增脚本：

| 脚本 | 作用 |
|---|---|
| `scripts/build-astro-nav.mjs` | 生成侧边栏/导航 JSON（复用 sidebar-core） |
| `scripts/build-astro-doc-index.mjs` | 生成全站文档 id 清单（wikilink 存在性判定） |
| `scripts/build-astro-search-index.mjs` | 生成搜索索引 |
| `scripts/copy-assets.mjs` | 把 docs/md 的 843MB 静态资源复制到 public/md/ |
| `scripts/normalize-dates.mjs` | 统一 249 个中文格式的 date 字段 |
| `scripts/check-links.mjs` | 站内死链扫描 |
| `scripts/compare-dead-links.mjs` | 迁移前后死链对比（回归验证） |

---

## 四、迁移过程中修掉的真实缺陷

### 4.1 相对链接解析（影响 900+ 条链接）

`index.md` 的 URL 是 `/md/books/xxx/`（带尾斜杠），普通文档是 `/md/wiki/sources/foo`（不带）。最初的实现对两者一视同仁地「去掉最后一段」，导致 `index.md` 里的 `./book/x.md` 被解析到**少一层**的路径上，产生 922 条死链。

修复：按 URL 是否以 `/` 结尾区分「目录索引页」与「普通文档」，目录索引页的基准目录就是它自己。

### 4.2 date 字段格式不统一（249 处）

站内 date 有三种写法共存：ISO（3,208 篇）、中文 `2023年9月24日 21:51`（247 篇）、残缺的 `2025年`（2 篇）。`z.coerce.date()` 遇到中文格式直接抛错，**一篇脏数据让全站构建失败**。

修复：`scripts/normalize-dates.mjs` 在构建前统一改写（幂等），schema 侧同时保留宽松解析作为双保险。

### 4.3 index 路由冲突（2 处）

`tutorial/tutorial-one.md` 与 `tutorial/tutorial-one/index.md` 内容相同，映射到同一路由会冲突覆盖。修复：优先保留目录版（与 VitePress 行为一致）。

### 4.4 content store 缓存导致 frontmatter 整体丢失（隐性坑）

Astro 的 content store 在 `digest` 未变时会跳过写入。loader 逻辑修好后，
旧缓存里的「`data: undefined`」会被继续沿用 —— 表现是**所有页面的 frontmatter
都读不到**：标题靠 H1 兜底还能看，但日期全空，落地页「最近更新」列表渲染为 0 条。

修复：`rm -rf node_modules/.astro .astro` 后重建。此后 `npm run clean:cache`
提供显式清理入口，文档里也标注了这个坑。

这类问题之所以难发现，是因为它**不报错**：构建成功、页面全出，只是少了字段。

---

## 五、验证结果

### 5.1 构建

```
[build] 3999 page(s) built in 53.04s
[@astrojs/sitemap] sitemap-index.xml created at dist
```

### 5.2 死链对比（`scripts/compare-dead-links.mjs`）

```
[compare] 产物页面 3999 个
[compare] 产物死链 103 个
[compare] 源文档死链 319 个
[compare] 迁移新增死链 0 个

结论：迁移未引入新的站内死链。
```

103 条遗留死链的来源：2026-08-20 的 commit `b64cdfcc` 把 74 个解析出错的 wiki sources 移出 `docs/md`（`docs/md/wiki_sources_excluded/`），正文里指向它们的链接就成了死链。VitePress 时期配了 `ignoreDeadLinks: true`，构建期不报错，线上一直 404 —— 迁移把这个长期掩盖的问题显性化了，但**没有新增**。

### 5.3 全新克隆构建验证（模拟 CI / Vercel）

从远端克隆一份干净副本，只跑 `npm install && npm run build`：

```
[normalize-dates] 检查 3895 篇，改写 0 篇 date 字段
[build-astro-nav] nav: 10 组, sidebar: 72 个扫描根
[build-astro-doc-index] 3999 篇文档
[build-astro-search-index] 3794 条索引，1064 KB
[copy-assets] 复制 10644 个文件（843 MB）
[build] 4000 page(s) built in 41.80s
BUILD=0
```

这一步暴露了一个真问题：`docs/.vitepress/generated/blog-index.json` 在 `.gitignore` 里，
而 Astro 的博客页与 RSS 都依赖它 —— 干净克隆会因为找不到该文件而构建失败。
修复：把 `scripts/build-blog-index.js` 纳入 `build:data` 链。

### 5.4 关键路由 HTTP 验证

| 路由 | 状态 |
|---|---|
| `/` | 200 |
| `/md/wiki/` | 200 |
| `/md/blog/` | 200 |
| `/md/blog/archive/` | 200 |
| `/md/blog/category/` `/md/blog/category/sources/` | 200 |
| `/md/blog/series/` `/md/blog/series/pensieve/` | 200 |
| `/md/resources/` | 200 |
| `/md/guide/getting-started` | 200 |
| `/md/guide/ai/claude-code-resources/` | 200 |
| `/rss.xml` `/sitemap-index.xml` `/search-index.json` | 200 |

### 5.5 关键页面渲染抽查（preview 服务实测）

| 页面 | 检查结果 |
|---|---|
| `/` | 分类入口 8 个、最近更新 6 条（含日期）、搜索框就位 |
| `/md/wiki/sources/0xding-ankole-agent-os-for-teams/` | 正文 13,094 字符、4 张图、19 个标题、侧边栏 1430 条链接、大纲 18 条、Giscus 容器就位 |
| `/md/blog/` | 50 张文章卡片 |
| `/rss.xml` | 50 条 item，首条为最新文章 |

### 5.6 内容保真抽查

| 检查项 | 结果 |
|---|---|
| 图片路径 | `/md/wiki/images/0xding-ankole-agent-os-for-teams/005.webp`（与 VitePress 一致） |
| wikilink | `<a href="/md/wiki/concepts/harness-engineering">` 真实链接节点 |
| mermaid | `<div class="mermaid">` + 客户端渲染 |
| markmap | `<div class="markmap-container"><svg class="markmap-svg" data-code="...">` |
| PDF 组件 | `<pdf-viewer data-src="...">` / `<pdf-list data-dir="...">` |
| HTML 演示 | `<html-viewer data-src="..." data-title="...">` |

---

## 六、未完成 / 后续

| 项 | 状态 | 说明 |
|---|---|---|
| Giscus 评论 | 已接 | Web Component 实现，主题切换时重挂载 |
| 站内搜索 | 已接 | 轻量索引 + 客户端匹配 |
| RSS | 已接 | `/rss.xml`，取 blog-index 最近 50 篇 |
| sitemap | 已接 | `@astrojs/sitemap` |
| 资源导航页 | 已接 | 复用 `resource-nav.json` |
| Easton 博客版式 | 部分 | 复用了结构与配色变量，`easton-clone.css` / `override.css` 的完整样式未逐条迁移 |
| 移动端抽屉导航 | 已接 | 原生 `<dialog>`，无框架依赖 |
| 图片优化 | 未做 | 保持原样按原路径提供（与 VitePress 一致），未引入 Astro 资产管线 |
| PDF 预览器 | 简化版 | 原 VitePress 用 pdf.js 自绘 canvas（页码/缩放/目录），当前用 iframe 交给浏览器原生 PDF 阅读器 |
| 死链清理 | 未做 | 103 条遗留死链需要补内容或改链接，属内容工作，非迁移工作 |

---

## 七、切换与回滚

- **当前状态**：`feat/astro-rebuild` 分支上 Astro 站可完整构建，VitePress 侧代码仍在仓库里（`docs/.vitepress/`），两套并存。
- **切换方式**：改 `vercel.json` 的 `buildCommand` 与 `outputDirectory` 指向 astro-app。
- **回滚方式**：改回 VitePress 的构建配置即可，仓库内容不用回退。
- **建议**：先在 preview 域名跑一轮链接巡检（`scripts/check-links.mjs`）+ 人工抽查 20 篇，确认后再切生产。
