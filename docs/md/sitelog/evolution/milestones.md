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
- [ ] 评估去掉 `easton-clone` 首页整体特性，只保留文档内页 Easton 化（最稳）
- [ ] 评估引入 VitePress 1.7+ 或迁移到 Astro
- [ ] 评估把 `easton-clone` 拆为独立路由 `/easton-clone/` 避免 landingTheme 切换路径

