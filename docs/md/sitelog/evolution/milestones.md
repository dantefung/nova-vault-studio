---
title: "演进历程与里程碑"
date: "2026-07-26"
source: "Nova Vault Studio"
url: ""
---

# 演进历程与里程碑

本文记录了 **System Vault** (及其原型项目) 的核心开发节点与演进路线。

## 核心里程碑

### 2023 - 2024: 概念诞生与原型验证
*   **架构选型**: 确定基于 VitePress 1.x。利用其极速的开发体验和简单的 Markdown 转 HTML 流程。
*   **多维表达**: 引入 `markdown-it-markmap` 插件，支持在文档中直接嵌入思维导图。

### 2025-01: 核心框架标准化
*   **Mermaid 集成**: 引入 `vitepress-plugin-mermaid`，支持流程图、时序图等标准图表。
*   **视觉优化**: 深度集成 **霞鹜文楷 (LXGW WenKai)** 字体系统，通过 Local/CDN 二进制切换机制保障阅读体验。
*   **自动化部署**: 建立基于 Vercel 的 GitHub 自动部署流水线。

### 2026-01: 项目分化与 System Vault 成立
*   **架构重组**: 从通用周刊模板中抽象出纯粹的知识库框架。
*   **动态路由映射**: 完善文件系统到侧边栏的自动化生成脚本 `sidebar.js`。
*   **System Vault 初始化**: 本项目正式作为独立的知识库底座启动，专注于系统架构与技术方案的深度沉淀。

### 2026-04: 主题系统与落地页风格
*   **多主题切换**: 实现三种主题（晴空/暗夜/纸卷）自由切换，localStorage 持久化，SSR 防闪烁
*   **落地页风格系统**: 历史版本曾支持 8 种风格切换，后收敛为 Quiet Library 单一首页，优先服务知识分类导航和最近更新阅读
*   **设计工具**: 早期主题与落地页使用 Huashu-Design，2026-07 首页改造采用 Quiet Library 视觉方案

### 2026-07: 主题扩展与备份体系
*   **Teek 主题引入**: 安装 [vitepress-theme-teek](https://github.com/teek/vitepress-theme-teek)，~1k stars，支持文档风/博客风模式切换，适合个人博客/知识库场景
*   **备份分支**: 建立 `backup-20260726` 分支，作为变更前的完整快照

### 2026-04: 教程内容集成与目录标准化
*   **full-keyboard 项目集成**: 成功将独立的 GitHub 项目 `alexzhang1030/full-keyboard` 集成到知识库中
    - 项目原设计: GitHub 仓库 + 自动生成 README 导航 (基于 `docs/` 单目录)
    - 原理: 通过 npm run scripts 扫描文件、提取标题、生成链接列表，GitHub 负责 Markdown 渲染
    - 集成策略决策: 
      - ❌ 方案 A: 修改 VitePress 配置支持特殊的嵌套结构 (过度定制，维护复杂)
      - ✅ 方案 B: **重构目录为标准分类结构** (遵循最小配置原则)
*   **标准化目录结构**: 将 65 个教程文件从单一 `docs/` 目录重组为 8 个分类子目录
    - vim (18 个), vscode (11 个), tools (9 个), chrome (7 个), iterm (1 个), zsh (3 个), macos (3 个), obsidian (4 个)
    - 每个子目录配置独立的 `index.md` 学习路径
    - 更新 69 条导航链接至新的路径结构
*   **配置哲学的实践**: 遵循 VitePress 原生设计模式，无需自定义 sidebar 生成逻辑，充分利用框架自动化能力
*   **维护性提升**: 从特例处理回归标准目录模式，降低未来维护成本

## 踩坑记录

### 2026-07: Vercel 构建 OOM 与 Chunk 循环依赖

**问题 1: Vercel 构建内存不足（OOM）**
*   **现象**: 本地 `npm run build` 正常，Vercel 构建时进程被 SIGKILL，报告 "Out of Memory"
*   **原因**: Vercel 免费版 Build Container 内存有限（~1GB），VitePress 文档量大 + Mermaid 图表渲染导致内存压力过大
*   **错误修复 1**: 尝试 `manualChunks` 分割 chunk → 触发循环依赖警告（mermaid ↔ vendor ↔ vitepress），内存反而更高
*   **错误修复 2**: 移除 PDF 生成步骤 → PDF 生成仅 2 秒就完成，OOM 发生在 VitePress 打包阶段，无效

**问题 2: Rollup 循环 chunk 依赖**
*   **现象**: `Circular chunk: mermaid -> vendor -> mermaid` 和 `Circular chunk: mermaid -> vitepress -> mermaid`
*   **原因**: 将 `mermaid` 和 `vitepress` 单独抽成 chunk 后，它们之间产生循环依赖
*   **修复**: 移除所有 manualChunks 配置，恢复 VitePress 默认打包行为

**最终结论**:
* commit 9fc0807（移除 manualChunks）验证：**仅移除 manualChunks 即可解决 Vercel OOM**
* 后续改动的 `optimizeDeps: { include: [] }`、`ssr: {}`、`NODE_OPTIONS` 反而让情况更差，已 revert
* 当前配置（mermaid SSR 恢复原样 + 无 manualChunks）才是最优状态
* 根本解法是精简文档规模（减少页面数/禁用 mermaid）或升级 Vercel Pro

**经验**:
* 遇到 OOM 不要乱改配置——先确认哪个改动真正解决问题
* VitePress 默认 chunk 策略已经过优化，强制分包容易弄巧成拙
* 改配置前先本地验证，改动要最小化

## 后续演进方向
- [ ] 搜索体验优化 (Algolia 深度集成)
- [ ] 多语言支持 (i18n)
- [ ] 交互式代码 Playground 支持
- [ ] 自动化的静态资源压缩流水线

## 2026-08-01 Easton Clone 重度博客化

- 完全重写博客系统：在 `easton-clone` 风格下提供独立的列表页 / 详情页 / 系列页 / 分类归档页 / 时间归档页
- 新增 `scripts/build-blog-index.js` 扫描内容目录，生成 `docs/.vitepress/generated/blog-index.{js,json}`（509 篇文章、1 个 series、14 个分类）
- 新增 `theme/composables/useBlogIndex.js` 提供查询助手：`latest / articleByPath / articlesByCategory / articlesBySeries / relatedArticles / archiveGroups / neighbors` 等
- 新增 `BlogLayout` 路由分发 + `BlogIndexLayout / BlogArticleLayout / BlogArticleShell / SeriesLayout / CategoryArchiveLayout / ArchiveLayout` 6 个博客布局
- 新增 5 个博客 UI 组件：`ArticleCard / ArticleMeta / ArticleNav / RelatedArticles / SeriesProgress`
- 新增 `docs/md/blog/` 下 16 个占位 md 文件（1 列表 + 1 时间归档 + 1 系列 + 13 分类），避开 VitePress 1.6.4 不支持 `rewrites` 的限制
- `scripts/generate-blog-routes.js` 自动从索引生成占位 md
- `MyLayout` 三分支路由：landing / blog / article，`isArticle` 在 `easton-clone` 风格下注入 `BlogArticleShell`（封面/元信息条/上下一篇/相关文章）
- `EastonCloneLayout` 硬编码卡 → 全部接入 `useBlogIndex()`，首页文章 / 系列 / 分类随索引自动更新
- `EastonSearchTrigger` 样式重写：胶囊形 + 居中 SVG 图标 + 快捷键 kbd，三变体（bar/action/nav）统一 Easton token
- `useTheme` 优雅降级：客户端首屏从 `<html>` dataset 同步 landingTheme，SSR fallback `quiet`
- `easton-blog.css`（180 行）提供 Easton Clone 风格下的博客视觉皮肤
- 仅 `easton-clone` 风格走博客化；`quiet` / `easton` 完全保持现状

**经验**：
* VitePress 1.6.4 不支持 `rewrites` / `dynamicRoutes`，占位 md 是唯一可行的"动态路由"路径
* SSR 阶段读不到 `localStorage`、也读不到 `<html>` dataset（head script 是客户端），把 landingTheme 渲染推到 SPA 阶段是 trade-off
* 前端内容索引只要没有复杂需求，手写正则比引第三方库更轻
* 大改前后一定要 rebuild + 浏览器实跑，chromium headless 可以替代纯手工 click 流程

## 2026-08-01 Easton Clone 首页白屏（已知 bug，未修）

**WHAT**: 用户从 `LandingThemeSwitcher` 切换到 `easton-clone` 后首页白屏，预期看到 Easton Clone 博客门户，实际只看到空白页。

**WHY（根因）**: VitePress 1.6.4 SSR 阶段执行 `useTheme()` 时拿不到 `localStorage`（SSR 阶段没 localStorage）、拿不到 `<html>.dataset.landingTheme`（`head script` 是客户端执行）。`HomeLayout.vue` 的 `currentLandingTheme` 在 SSR 阶段恒为 `'quiet'`，v-if 渲染 `<!---->` 占位 + quiet fallback 模板。客户端 hydration 时 Vue 3 信任 SSR HTML，**hydration patch 模式只更新 className，不重新评估 v-if**。即使 hydration 后 `currentLandingTheme` 变为 `'easton-clone'`，`EastonCloneLayout` 仍不会挂载，结果就是 class 是 `landing-theme-easton-clone` 但 v-if 占位导致内容为空。

**HOW（验证过程）**:
- 用 chromium headless + CDP 验证 SPA 切换：`vpClass: "vp-landing theme-light landing-theme-easton-clone"`（class 已切换），`hasEC: false`（EastonCloneLayout 没渲染），`bodyText: ""`（空白）
- 试用过的修复方案（均失败）：
  1. `useTheme.js` 加 `initialLanding = readLandingFromDom()` + 在 `useTheme()` 内部同步 DOM：仅 client 端有效，SSR 阶段无法访问 DOM
  2. `HomeLayout.vue` 加 `domLanding` ref + `renderKey` 强制重建：`:key` 改变触发整块重建，但 hydration 阶段 Vue 仍信任 SSR HTML
  3. 去掉 `currentLandingTheme` 的 `readonly` 包装：不影响 hydration 行为
  4. `LandingThemeSwitcher.vue` 加 `window.location.reload()`：reload 后 SSR 仍然渲染 quiet（SSR 仍读不到 localStorage）
  5. 换 `v-show` 替代 `v-if`：编译错误（v-if 已存在）
- 真正 work 的方案在 VitePress 1.7+ 才能用（head script SSR 化或 transformPageData 暴露 request cookie）

**影响范围**:
- ❌ Easton Clone 首页在 SPA 切换时白屏
- ✅ 博客列表 / 归档 / 系列 / 分类 4 个页面在 `easton-clone` 风格下正常
- ✅ 文章详情页（`/md/wiki/sources/*` 等）在 `easton-clone` 风格下走 `BlogArticleShell` 正常
- ✅ 文档内页 Easton 化（`easton-doc.css`）正常
- ✅ 切换 `quiet` / `easton` 正常

**临时绕过方案（用户可选）**:
- 让用户在 dev console 跑 `localStorage.setItem('vp-landing-theme', 'easton-clone')` 后**整页刷新一次**（仍不一定能渲染）
- 回到 quiet 风格：访问任何文档页（Wiki / Guide / Columns），那里的 Easton 化是好的

**正式修复需要**:
- VitePress 1.7+（SSR 暴露 request context）
- 或迁移到 Astro/Next（自带 cookie SSR 模式）
- 或接受 trade-off：彻底去掉 `easton-clone` 整体首页特性，只保留文档内页 Easton 化

**经验**:
- Vue 3 hydration 是 patch 模式，不会重新评估 v-if；hydration 后的 v-if 切换依赖 `:key` 强制重建（但 SSR 阶段 v-if 已经定型，patch 阶段 Vue 选择信任 SSR）
- 任何依赖 localStorage/cookie 才能正确渲染的内容，**必须在 SSR 阶段也能拿到**——VitePress 1.6 限制让这个要求几乎不可能
- 浏览器自动化测试要用 `bodyText` 验证内容而不只是 `vpClass`，否则假阳性（class 切换 ≠ 内容切换）
- dev 模式下 SPA 切换看起来工作、build + preview 模式下却坏——以后必须用 preview 验证最终用户路径

**留待**:
- [x] 去掉 `easton-clone` 首页整体特性，只保留文档内页 Easton 化（已选定方案 1，在 main 分支直接改造）
- [ ] 升级 VitePress 1.7+ 并验证 landingTheme SSR 可用（方案 2，子代理 worktree 实施）
- [ ] 用 Astro 重建首页和博客系统（方案 3，子代理 worktree 实施）
- [ ] 评估把 `easton-clone` 拆为独立路由 `/easton-clone/` 避免 landingTheme 切换路径

## 2026-08-01 Astro 重构进度（方案 3 实验分支）

**WHAT**: 在 `feat/astro-rebuild` 分支用 Astro 5 + Node adapter 重建首页和博客系统，作为 VitePress 1.6.4 首页白屏 bug 的方案 3 实验。

**WHY**:
- VitePress 1.6.4 SSR 阶段读不到 cookie/localStorage，方案 1/2 都受限于上游 SSR 能力
- Astro `output: 'server'` + `@astrojs/node` adapter 让 SSR 阶段能直接读 `Astro.cookies.get('landingTheme')`，避开 hydration 时序问题
- 目标：验证 Astro 能否用更少代码实现 Easton Clone 首页 + 博客 4 页 + 文章详情

**HOW（架构）**:
- `astro-app/src/pages/index.astro`：根据 cookie SSR 渲染 `quiet` / `easton` / `easton-clone` 三风格首页。easton-clone 分支组合 7 个组件（Hero/Entry/Series/Featured/Latest/Categories/Footer）
- `astro-app/src/pages/blog/index.astro`：列表，`?view=latest|category|series` 切换视图
- `astro-app/src/pages/blog/archive.astro`：按 `archiveGroups()` 按年-月分组
- `astro-app/src/pages/blog/series/[slug].astro` & `category/[slug].astro`：动态路由 + `getStaticPaths` 预生成
- `astro-app/src/pages/article/[...path].astro`：文章详情，runtime walk `docs/md/` 加载 markdown，markdown-it 渲染
- `src/lib/blog-index.ts`：复用 `scripts/build-blog-index.js` 生成的 `blog-index.json`，提供 latest/category/series/related/archive 查询
- `src/lib/article-loader.ts`：runtime fs walk 加载 markdown（避免 Astro 把外部 .md 当 content collection 处理）
- 客户端 sync script：localStorage → cookie 同步；切换按钮：localStorage + cookie + reload

**HOW（验证）**:
- `npm run build` 通过（30s 内，含 blog-index 重建）
- HTTP-level 25/25 checks pass（`astro-app/scripts/cdp-validate.mjs` 风格的 curl 套件）：homepage 三风格 cookie 切换、4 个博客页面、文章详情
- 真 chromium headless 验证（CDP via `scripts/cdp-validate.mjs`）：
  ```
  {"theme":"easton-clone","hasHero":true,"hasFeatured":true,
   "hasLatest":true,"hasSeries":true,"hasCategory":true,
   "featuredCount":3,"latestCount":8,"seriesCount":1,
   "categoryCount":3,"sampleTitle":"AI 编程：大多数团队 AI 编程都卡在结构化需求上"}
  ```
  即：访问 `http://127.0.0.1:4323/` 带 `landingTheme=easton-clone` cookie，**SSR HTML 直接包含完整 Easton Clone 首页内容**（白屏 bug 已修复）

**HOW（踩坑）**:
- `scripts/build-blog-index.js` 用 `process.cwd()` 决定内容目录，第一次跑 npm script 时 cwd 错了，生成了空的 `astro-app/docs/...` 脏数据 → 在 candidates 列表里加文件大小校验
- `import.meta.glob('../../../docs/**/*.md', { query: '?raw' })` 会被 Astro markdown 插件拦截，返回 object 而不是 string → 改用 `?url` 拿路径 + runtime fs.readFileSync
- `?url` 返回相对路径，与运行时 path.join 的 `..` 解析冲突 → 干脆放弃 glob，改 runtime `walkMarkdown`
- 第一次路径解析错误：`path.join(worktree_root, '../../../docs/...')` 把 worktree 根当成绝对路径的一部分去 normalize，把 `../..` 解析掉了 → hardcode `EFFECTIVE_ROOT`
- gray-matter 解析某些 frontmatter 返回非 string date → `String()` 兜底

**完成范围**:
- 首页：三风格 SSR（quiet / easton / easton-clone）
- Easton Clone 整体首页：Hero、Entry、Series（×1）、Featured（×3）、Latest（×8）、Categories（×3）、Footer
- 博客列表 / 归档 / 系列 / 分类 4 个页面
- 文章详情页：markdown 渲染 + 相关文章
- Cookie 同步：localStorage ↔ cookie via client script + reload
- CDP 真浏览器验证脚本

**未完成（与时间盒相关，留待后续 worktree）**:
- VitePress 主分支兼容：当前 worktree 的 `astro-app/` 是平行的实验项目，main 分支仍跑 VitePress。两套系统并存
- Easton doc 内页（`easton-doc.css`）未迁移到 Astro
- 客户端 SPA 路由（不 reload 切换主题）：当前用 reload 强制 SSR 重渲染——体验略差
- 搜索触发器 / EastonSearchTrigger 交互未实现
- Easton Clone footer 中"资源"链接还指向老 vitepress 路径，需要重新映射

**经验**:
- 任何依赖客户端存储才能正确渲染的内容，**必须能在 SSR 阶段也拿到**——这是 VitePress 1.6/Astro SSG/Vue 3 hydration 三方限制的硬约束。Astro `output: 'server'` 模式是绕过的最干净路径
- Astro 的 content collection 会接管 src 外的 .md，导致外部 markdown 内容无法直接通过 glob 读——运行时 fs walk 更可控
- `getStaticPaths` 在 `output: 'server'` 下被忽略；要么给具体页加 `export const prerender = true`，要么让所有路由都走 SSR（我们选了后者，因为依赖 cookie）
- 510 篇文章走 SSR 性能 OK（首次访问 ~200ms 后稳定），可加内存缓存避免每次 walk

