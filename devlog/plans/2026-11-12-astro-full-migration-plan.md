---
title: "Astro 全量迁移计划：从 VitePress 到 MDX → HTML"
date: "2026-11-12"
source: "Nova Vault Studio"
url: ""
---

# Astro 全量迁移计划：从 VitePress 到现代化 MDX → HTML

> 依据 `devlog/analysis/2026-11-12-tech-stack-rebuild-branches.md` 附录的评估结论编写。
> 目标：把整站从 VitePress 1.6.4 迁移到 Astro（content collections + MDX 管线），修首页白屏问题并升级为现代化 frontmatter schema 校验。
> 立场：**默认全量迁移；若 P0 决策门不过，退回 VitePress 1.7+ 修复方案（成本最低，但不做 MDX/现代栈）。**

---

## 0. 已知前提（实测数据，2026-11-12）

| 指标 | 数值 | 说明 |
|------|------|------|
| Markdown 文件 | 3,999 | `docs/md/**/*.md` |
| 站点总体积 | 916 MB | 大头为 `docs/md/books/**` 的 PDF 与配图 |
| 自定义 Vue 组件页 | 167 | PdfViewer 116 + HtmlViewer 16 + PdfList 18 + giscus 2 + EastonSearch 1 |
| 图片引用 | 8,981 | |
| frontmatter 存量 | title 3,937 / date 3,218 / url 2,363 / coverImage 322 / author 1,120 | 约 1,800 文件缺 date、1,600+ 缺 url |
| VitePress | 1.6.4 | `ignoreDeadLinks:true`、Mermaid + markmap 自定义插件、local search、Giscus、sitemap、Vercel Analytics、PDF 内嵌预览 |
| 已验证底 | `feat/astro-rebuild` | 首页三风格 + 博客三视图 + 文章详情 SSR 通过、CDP 验证通过 |

---

## 1. 目标与非目标

### 1.1 目标
1. 全站由 Astro 静态/混合渲染输出 HTML（`output:'static'` 为主），部署到 Vercel
2. Markdown 内容零改写迁移（保留 `.md`），新功能允许 `.mdx`
3. frontmatter 升级为编译期 Zod schema 强校验（title 必填、date/url 渐进式）
4. 167 篇自定义组件页逐一迁移为 Astro 岛（Vue/React/Svelte island 或纯 HTML）
5. 保留并提升 SEO：sitemap / RSS / OG meta / 结构化数据 / giscus 评论
6. 构建内存不恶化（目标：Vercel 构建稳定不 OOM，图片策略不回退）

### 1.2 非目标
- 不重写文章内容本身（不借机润色/纠错正文）
- 不做视觉 redesign（沿用 Easton/Quiet/Easton-Clone 三风格与现有 CSS）
- 不清理存量死链之外的任何内容删除（先迁移、不删内容）
- 不改 Git 仓库历史，不重写 public/ 静态资源结构（除版本并存策略见 §5）

---

## 2. 范围分解

| 板块 | 路由数 | 复杂度 | 说明 |
|------|--------|--------|------|
| 首页（三风格） | 1 | 中 | 复用 `feat/astro-rebuild` 成果 |
| 博客列表/归档/分类/系列 | 4+~14+1 | 中 | 已有 Astro 实现，移植到 static output |
| 文章详情 | 3,999 | 低（批量）+ 中（组件页） | 3,800+ 纯文页几乎零改动；167 组件页逐个处理 |
| wiki | ~400 | 低 | wikilink `[[...]]` 需转标准链接或 Astro 插件 |
| books | 16 类 PDF | 高 | PdfViewer/PdfList + PDF 深路径，需决定保留方案 |
| slides（HTML PPT） | ~10 | 低 | HtmlViewer 嵌入 `docs/public/slides/*`，改 Astro iframe 组件即可 |
| guide/columns/books 等侧边栏 | 自动 | 中 | 侧边栏自动生成逻辑需重建（按目录树） |
| 搜索 / 评论 / RSS / sitemap | — | 中 | Pagefind + Giscus + @astrojs/rss + sitemap 集成 |

---

## 3. 阶段排期（建议）

> 单人、兼顾其他任务口径；纯专职可压缩到 2/3。总计约 4–8 周。

### P0 基础设施与决策门（约 1 周）
- [ ] 从 `feat/astro-rebuild` 拉 `feat/astro-full` 分支，`astro-app/` 升级为站点根（或 `site/`，见 §5 目录决策）
- [ ] `output:'static'` 改回静态输出；删除 Node 运行时依赖（Vercel static 直出）
- [ ] content collections 定义：`src/content.config.ts` + Zod schema
  - `title: z.string().min(1)`（必填，迁移完成前仅 warn）
  - `date: z.coerce.date()`、`url: z.string().url().optional()`、`author`/`source`/`coverImage` 可选
  - `layout: 'book' | 'post' | ...` 预留
- [ ] markdown 渲染管线：remark-gfm + rehype（heading 锚点、directive/containers 兼容 VitePress `::: info`、代码块高亮 shiki）
- [ ] 自定义插件移植：markmap / mermaid → remark/rehype 插件（或保留客户端 hydration 组件）
- [ ] 侧边栏生成脚本（目录树 → 侧边栏数据，构建期生成 JSON）
- [ ] 图片策略：`<Image>` 响应式 + 大图压缩清单（沿用 sharp 脚本，>450KB 压缩）
- [ ] **决策门 P0→P1**：`pnpm build` 全量 markdown 解析通过率 ≥ 99%（死链 warn 不 error）、首页/博客/文章详情本地跑通、Vercel preview 部署成功 → 继续；否则退回 VitePress 1.7+

### P1 内容全量迁移与组件岛化（约 2–4 周）
- [ ] 3,999 篇正文批处理：统一 frontmatter 字段名（如 `coverImage`）、缺 date 按文件 mtime 补齐并记录清单，缺 url 标注 optional
- [ ] 167 个自定义组件页迁移：
  - [ ] PdfViewer（116）：保留 `<PdfViewer>` 名，Astro 岛 + `<embed>`/`<object>` 或 iframe；大 PDF >100MB 维持 ghostscript 压缩规则
  - [ ] PdfList（18）、HtmlViewer（16）、giscus（2）、EastonSearch（1）逐个改写
- [ ] wikilink `[[...]]` 处理策略：**构建期正则 → 相对链接**（按 slug 索引解析），无法解析的输出 warn 清单，人工修
- [ ] Giscus 评论、Pagefind 搜索、RSS（@astrojs/rss）、sitemap、OG meta/JSON-LD
- [ ] Mermaid/Markmap 客户端岛：首屏不加载，可见区再 hydration
- [ ] 全站构建 + 本地 `pnpm preview` 抽样 100 篇（含全部 167 组件页）

### P2 QA / 灰度 / 切换（约 1–2 周）
- [ ] 链接完整性扫描（把 `ignoreDeadLinks:true` 下的死链一次性列出并修复或 301）
- [ ] 三风格（quiet/easton/easton-clone）+ 明暗主题全量过一遍（CDP 自动化脚本批量截图对比）
- [ ] 性能/内存：Vercel 构建时长、函数内存、静态产物体积；Lighthouse 抽样
- [ ] SEO 回归：Search Console 验证（需域名确权，走原流程）、sitemap 提交、canonical 对齐旧 URL
- [ ] 灰度：Vercel preview 指向 `main` 分支、域名 301/重定向规则；`vercel.json` 路由映射旧 VitePress 路径（尽量不变）
- [ ] 保留 VitePress 于 `legacy-vitepress/` 目录（只读）至少 1 个发布周期，作为回滚与内容 diff 依据
- [ ] 更新 `AGENTS.md`：目录结构、命令、组件约定、frontmatter schema、pre-commit 钩子重写（基于 Zod 校验 CLI 而非 6 个碎片脚本）

---

## 4. 目录结构建议

```
astro-app/                  # P0 起升级为唯一站点工程（不保留 VitePress 为并列）
├── astro.config.mjs        # integrations: mdx, vue (组件岛), sitemap, tailwind(可选)
├── src/
│   ├── content.config.ts   # collections + Zod
│   ├── content/            # ← docs/md 迁入（保持原有相对路径，图片引用不变）
│   ├── layouts/            # Base / Post / Book / WikiLayout
│   ├── components/         # PostCard, ThemeSwitcher, PdfViewerIsland, ...
│   ├── pages/              # blog/, wiki/, books/... 静态路由 + [...slug]
│   ├── lib/                # blog-index、sidebar、wikilink 解析
│   └── styles/
├── public/                 # ← docs/public（slides、fonts、logo...）
├── scripts/                # compress-images、check-links、migrate-frontmatter
└── legacy-vitepress/       # 迁移后冻结的旧 VitePress（不再构建）
```

> 决策：保留 `docs/md/**` 原路径直接迁入 `src/content/`，避免 8,981 个图片引用路径全部重写；相对图片路径 `../images/<slug>/...` 与 content collection 约定一致时可直接工作，需在 P0 验证 3 个最深嵌套样本。

---

## 5. 关键技术决策（待拍板）

| # | 决策 | 选项 | 建议 |
|---|------|------|------|
| D1 | 输出模式 | `static` vs `server` | **static**（Vercel SSG，无运行时函数，内存最优） |
| D2 | 文章扩展名 | 保持 `.md` vs 全量 `.mdx` | **保持 .md**（按需把个别页面升 .mdx），3,999 文件改名收益为零 |
| D3 | 自定义组件形态 | Vue 岛 vs React 岛 vs 纯 Web Component | **Vue 岛优先**（最接近现状，降低重写成本） |
| D4 | wikilink | 构建期正则 vs 双向链接组件 | **先正则 + warn 清单**，未解析的手工修；不引入运行时成本 |
| D5 | 搜索 | Pagefind vs Algolia | **Pagefind**（零服务端、零费用、与 static 输出天然契合） |
| D6 | 图片路径 | 迁入 content vs 保持 `public/images` | 保持 content 内相对路径（见 §4），验证后即定 |
| D7 | 旧 URL 兼容 | 不变 vs 重定向 | **尽量不变**；变更项走 `vercel.json` redirects |
| D8 | `ignoreDeadLinks` | 直接关掉 vs 渐进 | **P2 前全量修复后关闭**（当前该 true 只是掩盖问题） |
| D9 | legacy 保留 | 删除 vs `legacy-vitepress/` | **保留 1 个发布周期**后归档到 `archive/vitepress-1.6/` |

---

## 6. 风险与对策

| 风险 | 等级 | 对策 |
|------|------|------|
| 916 MB 体积导致构建 OOM / 超时 | 高 | 图片 sharp 压缩清单（沿用 >450KB 规则）；books PDF 不进 build（保留现有 PdfViewer 直链 public 资源）；CI 分 shard |
| 167 组件页迁移遗漏/行为漂移 | 中 | 逐页 checklist；P1 末全量渲染比对（HTML diff 容差：忽略 hash 属性） |
| frontmatter 存量脏数据（1,800+ 缺 date） | 中 | mtime 补齐 + 显式 `filled-by-mtime: true` 标记；Zod 先 warn 后 error |
| wikilink 解析失败（~数百处？） | 中 | 构建期报告 + 人工修复 sprint；不阻塞迁移 |
| Giscus/评论、Analytics、sitemap 管线断裂 | 低 | P0 末即接通并在 preview 验证 |
| 死链大爆发（ignoreDeadLinks 已掩盖多年） | 中 | 先扫一份全站死链清单再决定修复/301/删除 |
| 双写期间内容漂移（迁移中还在采集新文） | 中 | 迁移期间的新采集只写新结构（直接落 `src/content/`），旧 VitePress 冻结 |
| 团队/单人带宽 | 中 | P0 只花 1 周验证可行性；P1 按板块分批（wiki → blog → guide → books），每批可独立上线 preview |

---

## 7. 验收标准

- [ ] 3,999 篇全部可构建输出，组件页渲染与 VitePress 版 1:1（人工抽样 167/167）
- [ ] Lighthouse Performance ≥ 90（移动端，抽样 10 篇）；无控制台报错
- [ ] Vercel 构建稳定（连续 5 次 preview 构建不 OOM，时长不劣化 >20%）
- [ ] 死链清单归零或全部有明确 301/修复记录
- [ ] Giscus/搜索/RSS/sitemap/OG 全部线上可用
- [ ] AGENTS.md 同步更新；pre-commit 钩子重写并通过全量提交
- [ ] Search Console 重新验证通过（域名属性不变）

---

## 8. 时间线（建议）

| 周 | 内容 | 产出 |
|----|------|------|
| W1 | P0：仓库升级、collections、插件移植、决策门 | preview 上线首页+博客+3 篇样本文章 |
| W2–W4 | P1：正文批处理 → wiki → blog → guide → books → 组件页 | 每板块独立 preview |
| W5 | P2：QA / 死链修复 / 灰度配置 / 文档同步 | 正式切换或退回决策 |
| W6–W8 | 缓冲：灰度观察、回滚演练、AGENTS.md 收尾 | 旧 VitePress 归档 |

---

## 9. 回滚预案

- 域名切换：`vercel.json` rewrites → 保留 `main` → VitePress 站 1 周（preview 域名保留）
- 内容损坏：以 `legacy-vitepress/` 为 diff 基准，逐文件 `git show` 对比
- 构建失败：`output:'server'` 兜底不启用；static 构建失败即停，不发布
- 回滚触发条件（任一）：preview 抽样 30 篇正文比对差异 ≥ 3 处未解释、Lighthouse 全站 < 80、构建连续 2 次 OOM

---

## 10. 决策门清单（P0 结束日评审）

1. 全量 markdown 解析通过率 ≥ 99%？
2. 首页三风格 + 博客 + 归档/分类/系列 + 5 篇样本文章（含 1 个 PdfViewer 页、1 个 Mermaid 页、1 个 wikilink 页）渲染正确？
3. Vercel preview 构建成功且耗时可接受？
4. Zod schema 能否直接收编 80% 存量 frontmatter（含 warn 降级）？
5. 团队（就自己）是否仍然同意全量迁移？若 2/4 不过 → 退回 VitePress 1.7+ 修复方案（成本最低，接受 MDX 目标放弃）
