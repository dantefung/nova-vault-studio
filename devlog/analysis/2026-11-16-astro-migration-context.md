---
title: "Astro 全量迁移上下文 Prompt"
date: "2026-11-16"
source: "Nova Vault Studio"
url: ""
---

# Astro 全量迁移上下文 Prompt

> 用途：供其他 AI 快速了解 `feat/astro-rebuild` 分支上「整站从 VitePress 迁移到 Astro」
> 这件事的目标、动机与做法，无需通读 diff。
> 提交来源：`343ee92f`、`5120d61c`、`dfa1809f`、`895a9edd`
> 详细实施记录见 `devlog/analysis/2026-11-12-astro-migration-report.md`

<Context>
1. [WHAT] 把整站（3,999 篇 Markdown）从 VitePress 1.6.4 迁移到 Astro 静态站
   [WHY] VitePress 1.6.4 的 SSR 无法读取 cookie/localStorage，导致首页切换落地页风格时白屏；整站构建需 7 分钟且在 Vercel 上 OOM，必须靠 `SEARCH_MODE=partial` 降级才能构建出来。站点是内容站而非应用，需要「构建期做完一切、运行期只发静态文件」的形态
   [HOW] 内容源不搬家，仍以 `docs/md/` 为唯一事实来源，用自定义 content loader 读取（不用 glob loader：它会让 astro:assets 接管图片并走 sharp 优化，站内大量 SVG 使 sharp 元数据解析抛 NoImageMetadata 直接中断构建）；Markdown 走自建管线，补齐 VitePress 的 8 项能力（wikilink 解析不到目标时保留纯文本、相对 .md 链接、相对图片、`:::` 容器、mermaid、markmap、VitePress 自定义组件、`<script setup>`/`<template>` 移除）；主题改为 CSS 变量 + data 属性，只改属性不触发 DOM 变化，从架构上消除白屏；侧边栏那 100+ 条中文目录映射抽成 `scripts/lib/sidebar-core.mjs` 供两边共用，避免漂移；站内搜索从「渲染全站做 minisearch 分词」改为构建期只提取标题+摘要+首段的轻量索引（1,064 KB）；新增 7 个构建与校验脚本（导航/文档索引/搜索索引/资源复制/日期规范化/死链扫描/迁移前后对比）；路由前缀保持 `/md/**` 不变，3000+ 条历史链接不失效；验证方式为全新克隆 `npm install && npm run build` 构建 4,001 页（45 秒，BUILD=0）+ 15/15 关键路由 HTTP 200 + 死链对比脚本证明迁移新增死链 0 条；风险与影响：Easton 博客版式未逐条迁移、PDF 预览器改用浏览器原生阅读器替代 pdf.js 自绘版，生产切换只需改 vercel.json、回滚改回即可

2. [WHAT] 修复 content loader 丢失 frontmatter 导致全站元数据为空的问题
   [WHY] 上一条提交后页面能出但元数据读不到：标题靠 H1 兜底还能看，日期全空、落地页「最近更新」渲染为 0 条。这类问题不报错、构建也成功，只靠逐页肉眼比对很难发现，属于会长期潜伏的类型
   [HOW] 根因有两层：一是 `parseData` 返回的是解析后的 data 本身而非 `{ data }` 包装，取值层级错了一层；二是 Astro 的 content store 在 digest 未变时会跳过写入，loader 逻辑修好后旧的脏缓存（data: undefined）会一直沿用。修好取值后清理 `node_modules/.astro` 与 `.astro` 重建，frontmatter 恢复 3,895/3,995 条可用，并提供 `npm run clean:cache` 显式入口、在 loader 注释里写明该坑；补充实施报告的缓存坑章节与页面渲染抽查数据；验证方式为清理缓存后重建并逐项检查落地页「最近更新」条目数与文档页日期

3. [WHAT] 让全新克隆能直接构建，并补齐 404 页
   [WHY] 用干净副本模拟 CI/Vercel 构建时失败：博客页与 RSS 依赖的 `docs/.vitepress/generated/blog-index.json` 被 `.gitignore` 排除，克隆后不存在导致构建中断——这类问题在本地因为文件是历史生成残留而不会暴露，只有 CI 或新克隆才会踩到
   [HOW] 把 `scripts/build-blog-index.js` 纳入 astro-app 的 `build:data` 链，让构建前重新生成该索引；新增 `src/pages/404.astro`，与 VitePress 时期 DefaultTheme 自动提供的 404 行为对齐；验证方式为从远端克隆一份只含已提交内容的副本，跑 `npm install && npm run build` 得到 BUILD=0 与 4,001 页产物

4. [WHAT] 删除原型实验遗留的死代码
   [WHY] 原实验分支用运行时 fs walk 加载 markdown，新架构改用 content loader + 自建 Markdown 管线后，`src/lib/article-loader.ts` 已无任何引用，继续留着会误导后续维护者以为存在两条加载路径
   [HOW] 确认全仓无引用后用 `git rm` 删除，删除后重新构建验证产物页面数不变（4,001 页）
</Context>

---

## 速查

| 项 | 值 |
|---|---|
| 分支 | `feat/astro-rebuild` |
| 页面数 | 4,001（3,999 篇文档 + 404 + RSS/sitemap 等） |
| 构建耗时 | 45–90 秒（VitePress 时期约 7 分钟且 Vercel OOM） |
| 站内死链 | 迁移新增 0 条（`scripts/compare-dead-links.mjs` 可复现） |
| URL 兼容 | `/md/**` 完全保持不变 |
| 构建命令 | `cd astro-app && npm run build` |
| 死链校验 | `node scripts/compare-dead-links.mjs` |
