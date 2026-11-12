---
title: "技术栈重构分支调查报告（非 VitePress 方案）"
date: "2026-11-12"
source: "Nova Vault Studio"
url: ""
---

# 技术栈重构分支调查报告（非 VitePress 方案）

> 调查日期：2026-11-12
>
> 背景：VitePress 1.6.4 在 SPA 切换到 `easton-clone` 风格时首页白屏（根因：SSR 阶段无法读 `localStorage` / `<html>.dataset`，v-if 渲染错误）。团队围绕修复做了多条技术栈重建对照实验，本报告梳理「全面重构技术栈、且方案不是 VitePress」的分支。

## 一、结论速览

符合「换栈重构且非 VitePress」的，只有两条，且都是**首页 + 博客系统 + 文章详情**的局部重建，并非整站重写（wiki/books/guide 等仍在 VitePress）：

| 分支 | 栈 | 目录 | 最新提交 | 状态 |
|------|-----|------|----------|------|
| `feat/astro-rebuild` | Astro（`output:'server'` + Node adapter） | `astro-app/` | `5872d09d` | SSR 三风格渲染已验证、构建通过 |
| `feat/next-rebuild` | Next.js 15 App Router + RSC + SSG/SSR 混合 | `next-app/` | `1fec0af9` | 966 个静态页构建通过、CDP 验证全通 |

两者同源对照（同一批 worktree 实验），`docs/md/sitelog/evolution/milestones.md` 有详细对照记录（方案 3 / 方案 4）。

若目标是「整站脱离 VitePress」，这两条只验证了前台部分，**不覆盖全站**，需另行评估。

---

## 二、feat/astro-rebuild（方案 3，Astro）

- **提交**：`5872d09d` feat(astro): rebuild home + blog in Astro, fix landingTheme SSR bug（基于 `edcf627e` 之后，与 `feat/next-rebuild` 同一起点）
- **方案**：Astro `output: 'server'` + Node adapter。SSR 阶段直接读 `Astro.cookies.get('landingTheme')`，hydrate 前把正确风格写进 HTML，绕过 VitePress SPA 切换时的 v-if 重渲染白屏。
- **路由**（与 VitePress 对齐）：

  | URL | 说明 |
  |-----|------|
  | `/` | 首页（按 cookie 决定 quiet / easton / easton-clone） |
  | `/blog/` | 列表（latest / category / series 三视图，`?view=...`） |
  | `/blog/archive/` | 按年-月归档 |
  | `/blog/series/`、`/blog/series/<slug>/` | 系列索引 / 详情 |
  | `/blog/category/`、`/blog/category/<slug>/` | 分类索引 / 详情 |
  | `/article/[...path]/` | 文章详情（runtime walk `docs/md/{wiki,columns,business}/`） |

- **架构要点**：
  - `astro-app/src/lib/blog-index.ts` 复用 `docs/.vitepress/generated/blog-index.json`（510 篇 / 1 系列 / 14 分类），不重新生成
  - `article-loader.ts` 用 fs walk + gray-matter 直接读 markdown
  - `theme.ts` 提供 SSR 读 cookie 的工具；`BaseLayout.astro` SSR 写 `data-theme`，首屏脚本同步 localStorage → cookie
  - 文章详情 `import.meta.glob` + `fs.readFileSync`，有内存缓存
  - 配套 `scripts/cdp-validate.mjs`（Chrome DevTools Protocol 真浏览器验证）
- **Trade-off**：
  - SSR（server output），不能纯静态托管；需 Node 运行时（Vercel Functions / 自托管 / Railway）
  - Easton doc 内页（`easton-doc.css`）未迁移，仍在 VitePress 1.6.4 主分支维护
  - 无 latest/category/series 三视图 tab（Next.js 版有）

## 三、feat/next-rebuild（方案 4，Next.js）

- **提交**：`1fec0af9` feat(next-app): 用 Next.js 15 App Router 重构首页与博客系统
- **方案**：Next.js 15 App Router + RSC。`layout.tsx` 顶层 `await cookies()`（Next.js 15 异步）决定 `<html data-theme>`；`<head>` 内联 SYNC_SCRIPT 在 hydration 前同步 localStorage → cookie；切换时 `localStorage + router.refresh()`（无需整页 reload）。
- **架构**：
  - `next-app/src/lib/blog-index.ts` 同样复用 `blog-index.json`；`article-loader.ts` 同理 fs walk + gray-matter（gray-matter 需放 `serverExternalPackages`）
  - 三风格分流：`page.tsx` 根据 cookie 渲染 `<EastonCloneHome>` / `<EastonHome>` / `<QuietHome>` 三种服务端组件
  - 文章详情 `generateStaticParams` 做 SSG（catch-all `string[]`）；上下篇 + 相关文章
  - `outputFileTracingRoot` 显式指向 worktree 根
  - cookie 名用 `vp-landing-theme`（沿用 VitePress 原值，零迁移成本）；Astro 版用 `landingTheme`
  - 博客列表 `searchParams.view` 实现 latest/category/series 三视图 tab
- **验证**（milestones.md 记录的 CDP headless 检查）：
  - 首页三风格（easton-clone / easton / quiet-no-cookie fallback）hero+featured+latest+series+category 均真实渲染
  - `/blog/` 50 张卡片、`/blog/archive/` 25 个月份分组、series 索引/详情、category 索引/详情（sources 175 篇）、文章详情单篇正文 + 上下篇 + 相关文章 6 张
  - `next build` 通过，共 966 个静态页（940+ articles SSG + 14 categories + series + 首页 1 dynamic + 4 blog dynamic + archive）
- **与 Astro 版的差异**：路由结构对齐、URL 一致；Next.js 多一个 `latest(category|series)` 三视图 tab；`router.refresh()` 主题切换无需整页 reload（Astro 版靠 `location.reload()`）；Astro 走 `output:'server'` 全 SSR，Next.js 走 SSG/SSR 混合
- **未完成**：
  - 未接 Vercel 部署（根目录有 `vercel.json` 但未针对 next-app 配置）
  - 图片资源未处理（`% 图片已移除` 占位原样保留）
  - 搜索框是占位（未移植 Algolia / local search）
  - Lighthouse / 性能评估未做

## 四、容易混淆但不符合的分支

| 分支 | 实际内容 | 结论 |
|------|----------|------|
| `feat/pmaker-clone` | PMaker 克隆站（803 文件 / 8.7 万行插入，OpenNext + CF Pages 静态部署） | 独立山寨工程，非本站重构 |
| `feat/cubxxw-theme-clone` | `cubxxw-clone/`（Next.js + TS + Tailwind，部署到 Cloudflare） | 新子工程，非本站迁移 |
| `fix/vitepress-1.7` | VitePress 1.7+ 升级验证（仅改 `sitelog/evolution/milestones.md` 一个文件） | 仍是 VitePress |
| `blog-editorial` / `blog-magazine` / `blog-timeline` | Easton 博客 CSS/布局变体（`easton-blog.css` + `BlogIndexLayout.vue`） | VitePress 皮肤，换 CSS 不换栈 |
| `feat/blog-editorial-redesign` | 同上，列表分页 + Easton Zen 文章布局 | VitePress 皮肤 |
| `blog-bibliography` / `blog-newspaper` / `blog-reading-room` / `blog-research-notebook` | 与 main 无 diff（疑似已并入/空分支） | 皮肤实验 |
| `blog-variants-round-2-design` | 仅新增两份设计 PRD（`prd/blog-index-variants-round-2-*`） | 文档，未实现 |
| `origin/backup-20260726`、`origin/temp-backup` | main 的快照 / 内容备份 | 非重构 |
| `tmp-1780451642` | 内容采集备份（173 文件，主要是专栏/资源增补） | 非重构 |

## 五、评估与建议

1. **两个 rebuild 都只覆盖「首页 + 博客 + 文章详情」**，不迁移 docs/books/wiki/guide 等内容站点，离「整站脱离 VitePress」还有距离。
2. **Astro 版 vs Next.js 版**：功能对齐，Next.js 版多三视图 tab 与 `router.refresh()`；Astro 版更轻、依赖更少，但全 SSR 要求 Node 运行时。
3. 迁移全站的阻塞点（prereq）：PdfViewer / Markmap / Teek 主题 / Algolia 搜索 / reading-progress 等 VitePress 专属组件，以及 510 篇文章的图片与 frontmatter 规范——两个分支都没处理，需单列任务。
4. 首页白屏若只是要修，方案 1（main 直接改造 easton-clone / 去掉整页特性）与方案 2（VitePress 1.7+）成本最低；换栈是治本但重资产，建议以这两个分支的成果为底评估，再决定是否整站推进。

## 附：相关证据

- `docs/md/sitelog/evolution/milestones.md`（feat/next-rebuild 内，2026-08-01 Next.js 重构进度段）
- `astro-app/README.md`（feat/astro-rebuild）
- `devlog/analysis/`（本报告）
