---
title: "Astro 站点部署指南（Vercel / Cloudflare）"
date: "2026-11-17"
source: "Nova Vault Studio"
url: ""
---

# Astro 站点部署指南（Vercel / Cloudflare）

> 适用分支：`feat/astro-rebuild`
> 关联：`devlog/analysis/2026-11-12-astro-migration-report.md`、`astro-app/wrangler.toml`

---

## 一、产物形态

构建产物在 `astro-app/dist/`，是**纯静态文件**，不依赖任何运行时：

```
astro-app/dist/
├── index.html              # 落地页
├── 404.html
├── md/                     # 全站文档（3,999 篇）
│   ├── wiki/index.html                # 目录索引页（对应 /md/wiki/）
│   ├── wiki/sources/foo.html          # 普通页面（对应 /md/wiki/sources/foo）
│   ├── wiki/images/...                # 图片
│   └── books/...                      # PDF（仅保留正文直接链接的 3 个）
├── slides/                 # HTML 演示稿（来自 docs/public）
├── favicon.png / robots.txt
├── rss.xml / sitemap-index.xml / search-index.json / pdf-manifest.json
└── _astro/                 # JS/CSS 产物
```

产物指标（2026-11-17 实测）：

| 指标 | 值 | 平台限制 | 结论 |
|---|---|---|---|
| 体积 | 1.1 GB | 无总量硬限 | 通过 |
| 文件数 | 14,639 | 20,000 | 通过 |
| 单文件最大 | 16.5 MiB | 25 MiB | 通过 |
| 页面数 | 4,013 | — | — |
| 构建耗时 | 34–90 秒 | 10 分钟 | 通过 |

---

## 二、Cloudflare 部署

### 2.1 Pages（推荐，改动最小）

在 Cloudflare Pages 项目的 **Settings → Builds & deployments** 里配置：

| 配置项 | 值 |
|---|---|
| Framework preset | None |
| Build command | `cd astro-app && npm run build` |
| Build output directory | `astro-app/dist` |
| Root directory | 仓库根（保持默认） |
| Environment variable | `NODE_VERSION=22` |
| Install command | `cd astro-app && npm install` |

**NODE_VERSION 必须设置**：Astro 5 的 `engines` 要求 `^18.20.8 || ^20.3.0 || >=22.0.0`，
而 Cloudflare Pages 默认给 Node 18.x，不改会直接构建失败。

**HTML 处理保持默认 `auto-trailing-slash` 即可**：产物是 `.html` 文件形态（与 VitePress 时期一致），
`/md/wiki/sources/foo` 直接命中 `foo.html`，目录索引页 `/md/wiki/` 命中 `wiki/index.html`，无需任何跳转配置。

### 2.1.1 目录型路由必须产出 index.html

CF 的 `auto-trailing-slash` 规则下：

| 请求 | 产物 | 结果 |
|---|---|---|
| `/md/wiki/sources/foo` | `foo.html` | 200 |
| `/md/wiki/sources/foo/` | `foo.html` | 308 → `/md/wiki/sources/foo` |
| `/md/wiki/` | `wiki/index.html` | 200 |
| `/md/wiki` | `wiki/index.html` | 301 → `/md/wiki/` |

所以**目录型路由页（博客四个视图、资源导航）必须产出 `index.html`**，否则站内导航点击
就会多一跳 308。在 Astro 里的做法：

- 静态目录页 → 文件放到 `<dir>/index/index.astro`（Astro 会产出 `<dir>/index.html`）
- 动态目录页 → 用 `[...slug].astro` 且 params 为 `'<slug>/index'`
  （单段参数 `[slug]` 不接受斜杠，会报 `Missing parameter: slug`）

### 2.1.2 wrangler.toml 的坑

- Pages 形态需要 `pages_build_output_dir`，缺了 wrangler 会忽略配置文件
- Pages 形态**不支持** `[observability]`（那是 Workers 的配置项），加了直接报
  `Configuration file for Pages projects does not support "observability"` 并退出
- Pages 与 Workers 是两套互斥形态（`pages_build_output_dir` vs `[assets]`），别混写

### 2.2 Workers（Static Assets）

仓库里已备好 `astro-app/wrangler.toml`：

```bash
cd astro-app
npx wrangler deploy
```

产物走 Workers 的 Static Assets 绑定，大文件可进一步迁到 R2。

### 2.3 为什么不用 Pages 默认的目录索引

产物里有两类文件（与 VitePress 时期产物形状一致）：

- 普通页面：`md/wiki/sources/foo.html` → URL `/md/wiki/sources/foo`
- 目录索引页：`md/wiki/index.html` → URL `/md/wiki/`

如果改用目录式产物（`foo/index.html`），Cloudflare 需要 `force-trailing-slash`，
每页访问都会多一次 301；改成文件式产物后 URL 与历史链接完全一致，零跳转。

---

## 三、Vercel 部署

`vercel.json` 已指向 Astro：

```json
{
  "installCommand": "cd astro-app && npm install",
  "buildCommand": "cd astro-app && npm run build",
  "outputDirectory": "astro-app/dist"
}
```

Vercel 的 `cleanUrls` 会把 `.html` 去掉，URL 形状与 Cloudflare 一致。

---

## 四、构建期各步骤在做什么

```bash
cd astro-app && npm run build
```

```
prebuild → build:data
  ├─ scripts/normalize-dates.mjs         统一 frontmatter 的 date 格式（中文日期 → ISO）
  ├─ scripts/build-blog-index.js          生成博客索引（RSS 与博客页依赖，文件在 .gitignore 里）
  ├─ scripts/build-astro-nav.mjs         生成侧边栏/导航 JSON（与 VitePress 共用 sidebar-core）
  ├─ scripts/build-astro-doc-index.mjs   生成全站文档 id 清单（wikilink 存在性判定）
  ├─ scripts/build-astro-search-index.mjs 生成搜索索引
  └─ scripts/build-resource-nav.js        生成资源导航数据

astro build
  ├─ content loader 读取 docs/md（3999 篇）
  ├─ 渲染 4,001 个静态页
  └─ astro:build:done → integrations/copy-md-assets.mjs
        └─ scripts/copy-assets.mjs --target dist --pdf skip
              ├─ docs/md/** 非 md 资源 → dist/md/**
              └─ docs/public/** → dist/**
```

### 4.1 资源直写 dist，而不是经 public/

走 `public/` 的话，Vite 会把 public 原样再复制一遍到 dist —— 站内 843MB 资源被读写两趟，
构建 I/O 与临时磁盘都翻倍。改成构建后直写 dist 少一整轮拷贝。

`public/` 只在 dev 用（`npm run dev` 会先复制一份到 `public/`，因为 dev 下 PDF 需要本地副本）。

### 4.2 PDF 为什么在生产被排除

站内 111 个 PDF 全部通过 `<PdfViewer repo-path="...">` 引用，而 VitePress 时期的生产策略就是
**生产走 GitHub Raw**（`docs/.vitepress/theme/utils/pdf-url.js` 的 `resolvePdfUrl` 在 PROD 分支
返回 `raw.githubusercontent.com` 地址），本地副本只在 dev 用。

排除本地副本带来两个收益：

1. 产物从 1.4 GB 降到 1.1 GB
2. 消除两个超过 Cloudflare 25 MiB 单文件上限的 PDF（`Spring技术内幕` 40 MiB、`Codex从入门到精通` 32 MiB）

例外：被正文以相对路径直接链接的 3 个 PDF 会保留（脚本自动识别），
其中 `把才华变成钱.pdf`（10.1 MiB）是真实可点的下载链接。

### 4.3 超限文件检查

`copy-assets.mjs` 每次都会检查产物里有没有超过 25 MiB 的文件，有就直接报错退出 ——
避免到部署阶段才发现。

历史上唯一的超限文件是 `docs/public/seo/webcafe-demand/keyword-research-tutorial-for-beginners.mp4`
（35.5 MiB，1920×1080，8 分 42 秒），已用 ffmpeg 重编码到 16.5 MiB（时长与分辨率不变）。

---

## 五、校验命令

```bash
# 构建
cd astro-app && npm run build

# 站内死链扫描
node scripts/check-links.mjs

# 迁移前后死链对比（新增死链应为 0）
node scripts/compare-dead-links.mjs

# 资源复制（dev 用；构建期由集成自动调用）
node scripts/copy-assets.mjs --target public --pdf keep
```

---

## 六、回滚

Astro 与 VitePress 在仓库里并存（`docs/.vitepress/` 未删除）：

- 回滚 Astro：把 `vercel.json` 的 buildCommand / outputDirectory 改回 VitePress
- 回滚 Cloudflare：Pages 项目里把构建命令改回 `npm run build`、输出目录改回 `docs/.vitepress/dist`

内容源（`docs/md/`）两套系统共用，切换不影响内容。

---

## 七、线上实测（2026-11-17）

预览部署：`https://feat-astro-rebuild.nova-vault-f1p.pages.dev`
（CF Pages 项目 `nova-vault`，分支 `feat/astro-rebuild`，14,639 文件）

### 7.1 路由状态码

| 路由 | 状态码 |
|---|---|
| `/`、`/md/wiki/`、`/md/blog/`、`/md/blog/archive/` | 200 |
| `/md/blog/category/`、`/md/blog/category/sources/` | 200 |
| `/md/blog/series/`、`/md/blog/series/pensieve/` | 200 |
| `/md/resources/`、`/md/guide/getting-started` | 200 |
| `/md/wiki/sources/<slug>`（带/不带尾斜杠） | 200 |
| `/rss.xml`、`/sitemap-index.xml`、`/search-index.json` | 200 |
| `/favicon.png`、`/robots.txt`、`/slides/ppt-gsd-skills/index.html` | 200 |
| 图片 / PDF / MP4 资源 | 200 |

### 7.2 站内链接零跳转（关键指标）

用 CF 规则模拟器（`/x` → `x.html`，`/x/` → `x/index.html`，不匹配则 301/308）
逐个请求产物里所有内部链接：

| 指标 | 值 |
|---|---|
| 站内 `/md/` 链接总数 | 3,741 |
| 直接 200 | 3,632 |
| **产生跳转** | **0** |
| 404 | 109（全部为 VitePress 时期已存在的历史死链） |

### 7.3 会被 CF 规范化跳转的形态（仅非规范请求，正常）

| 请求 | 结果 | 说明 |
|---|---|---|
| `/404.html` | 308 → `/404` | CF 统一去掉 `.html` 后缀 |
| `/md/wiki/sources/foo/` | 308 → `/md/wiki/sources/foo` | 带斜杠指向 `.html` 产物 |
| `/slides/ppt-gsd-skills/index.html` | 308 → 无后缀 | 同上 |

站内链接不产生这些形态（3,632 条零跳转已验证），只有外部旧链接或手敲 URL 会命中，
浏览器会自动跟随。

### 7.4 复现用命令

```bash
# 本地起一个模拟 CF Pages 解析规则的服务器
node /tmp/cf-emul.mjs astro-app/dist     # 监听 4399

# 扫描产物里所有内部 href 的跳转情况
node /tmp/scan-links.mjs astro-app/dist
```

---

## 八、待决项：生产域名切换

| 项 | 状态 |
|---|---|
| 生产域名 `vault.moneylab.ccwu.cc` | 仍绑在 Vercel，当前返回 **402 `DEPLOYMENT_DISABLED`** |
| CF Pages 项目 `nova-vault` | 无自定义域名，仅 `nova-vault-f1p.pages.dev` |
| 切换生产 | 需要在 CF Pages 里添加自定义域名并改 DNS 解析 |

切生产时注意：DNS 生效前 CF 会要求把域名 CNAME 到 `nova-vault-f1p.pages.dev`，
而 Vercel 那边要先解绑，否则两边抢解析。
