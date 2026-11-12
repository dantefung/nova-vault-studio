---
title: "SEO 基建修复：sitemap 死域名与 robots.txt 缺失"
date: "2026-09-21"
source: "Nova Vault Studio"
url: ""
---

# SEO 基建修复：sitemap 死域名与 robots.txt 缺失

## 背景与问题现象

站点对外服务的真实域名是 `https://vault.moneylab.ccwu.cc`，首页、文章页、搜索全部正常返回 200。但两个面向爬虫的基础设施是坏的：

**问题一：sitemap 全量死链。**

`docs/.vitepress/config.js` 的 `sitemap.hostname` 从 Initial commit `bc83e803` 起一直写着 `https://system-vault.site`。该域名**从未注册**——无 DNS 记录，WHOIS 为空，`curl` 直接报 `Could not resolve host`。

后果是线上 `sitemap.xml` 里 **3149 条 `<loc>` 全部指向一个不存在的域名**。搜索引擎爬虫打开地图，看到的是一整页死链。这比没有 sitemap 更糟：等于主动声明"本站有 3149 个 404"。

**问题二：没有 robots.txt。**

`/robots.txt` 返回 VitePress 的 404 页面。爬虫只能靠猜 `/sitemap.xml` 才能发现地图，而 `robots.txt` 里的 `Sitemap:` 指令正是让搜索引擎主动来拉地图的标准通道。两者必须配套，缺一个都是白干。

两个问题的共同特征是：**从首页完全看不出来。** 站点能正常打开、样式正常、搜索正常，只有去抓 `/sitemap.xml` 并比对域名，才会暴露。

## 域名链路

```
vault.moneylab.ccwu.cc
  → Cloudflare（172.67.180.192 / 104.21.31.235）
    → Vercel（alias: vault-studio-rj61fydch-dantefungs-projects.vercel.app）
```

父域 `moneylab.ccwu.cc` 同在 Cloudflare IP 上，但指向另一个项目（`money-px58n1wm1-...`），不是同一个站。

## 修复内容

### 1. sitemap 域名（commit `90d28b9c`）

| 文件 | 改动 |
|------|------|
| `docs/.vitepress/config.js:52` | `hostname` 由 `https://system-vault.site` 改为 `https://vault.moneylab.ccwu.cc` |
| `docs/md/sitelog/features/feature-matrix.md:109` | 「构建与部署」表格的域名条目同步 |

hostname **不加结尾斜杠**。VitePress 自行用 `/路径` 拼接，带了斜杠会产出 `ccwu.cc//md/xxx`。实测输出中双斜杠数量为 0。

### 2. robots.txt（commit `7b4de95a`）

新增 `docs/public/robots.txt`：

```txt
User-agent: *
Allow: /

Sitemap: https://vault.moneylab.ccwu.cc/sitemap.xml
```

全站公开，没有需要拦爬虫的私有内容，所以 `Allow: /`。

**没有写 `Disallow: /assets/`。** 这是常见写法，但是自欺欺人——Google 明确建议放行 CSS/JS，否则它渲染不出页面，反而索引不全。别为省爬取预算牺牲渲染。

放 `docs/public/` 而不改 `config.js`：VitePress 的 `publicDir` 会把该目录内容原样平铺到站点根。已实测两遍（`favicon.png → dist/favicon.png`、`robots.txt → dist/robots.txt`）。

## 关键开发经验

### 1. 首页正常不等于站点健康

这次是最典型的一课。首页 200、样式正常、搜索正常——所有"看得见"的验收全部通过，而面向爬虫的接口烂了一个多月。

给爬虫看的接口（sitemap、robots.txt、canonical、OG 标签）没有 UI，坏了不会有任何视觉信号。**验收一个站点不能只验收首页**，至少要单独抓一次 `/sitemap.xml` 并核对域名。

### 2. 验证线上内容必须用真实域名

排查过程中我一度判断"站点没有自定义域名，只能通过带 SSO 的部署地址访问"。这个结论是错的，错因很具体：我只测了 `system-vault.site`（必然解析失败）和带 SSO 保护的部署 URL，**从没测过真实域名**。

教训：判断"站点是否公开"之前，先拿到真实域名。而真实域名不在 `vercel domains ls` 里（见下条），要去 Cloudflare 侧或 Vercel alias 记录里找。用错误的域名去验证，会把"域名没注册"误判成"站点没上线"——失败原因和部署无关，却长得像部署故障。

### 3. Vercel 的 alias 和 domain 是两回事

`vercel domains ls` 在 `dantefungs-projects` 账号下只有三项：`vastarcade.com`、`moneylab.cc`、`moneylab.work`。`ccwu.cc` **不在其中**，因此 `vercel domains inspect moneylab.ccwu.cc` 会报 `You don't have access to the domain`。

这看起来和 alias 列表矛盾，实际不矛盾：`ccwu.cc` 由 Cloudflare 侧管理 DNS，Vercel 只知道有一条 alias 指向它。

**实操结论：给这个站加子域名要走 `vercel alias set`，不要走 `vercel domains add`。**

### 4. sitemap 生成与搜索索引模式无关

`VITEPRESS_SEARCH_MODE=off` 构建后，sitemap 的 URL 集合与 `full` 模式**完全一致**（3156 条）。搜索模式只影响 `search.options._render` 是否返回空串，不参与页面渲染和 sitemap 生成。

所以调搜索模式不会影响 SEO，反过来排查 sitemap 问题也不用去翻搜索配置。

### 5. 并发会话下提交要逐 hunk 核对

修复时工作区里有另一个会话未提交的改动（`config.js` 的导航重构、资源页新增条目）。直接 `git add config.js` 会把别人的活一起提交。

做法是手写单 hunk patch，用 `git apply --cached --recount` 只暂存目标那一块，`git diff --cached` 确认后才提交。最终 `90d28b9c` 是干净的 `2 files changed, 2 insertions(+), 2 deletions(-)`。

**`git status` 看到多个已修改文件时，先搞清每个是谁的，再决定暂存什么。**

### 6. robots.txt 不驱动收录，只指路

`robots.txt` 里的 `Sitemap:` 指令只是"爬虫上门时告诉它地图在哪"，**不会**让 Google 主动来发现站点。对已被收录的页面有效（重爬时会重新读 robots.txt），对新站收录速度没有帮助。

想主动推送需要去 Google Search Console / Bing Webmaster Tools 提交 sitemap，那一步要验证域名所有权，无法在仓库内完成。

### 7. Cloudflare 会缓存 404

等新构建上线时轮询 `/robots.txt`，前 6 分钟一直返回 404——那是 Cloudflare 缓存的旧响应，不是构建没完成。加 `?v=N` 查询参数绕过缓存后才在状态码跳 200 的确切时刻确认上线。

排查"改了却没生效"时，先排除边缘缓存，再怀疑构建。

## 验证结果

**本地构建**（`VITEPRESS_SEARCH_MODE=off`，125.78s）：

- `dist/robots.txt` 76 字节，内容正确
- `dist/sitemap.xml` 3156 条 URL，全部为新域名，0 条旧域名，0 个双斜杠

**线上验证**：

| 项 | 结果 |
|----|------|
| 部署 `vault-studio-d4f5w4lx3`（sitemap 修复） | ● Ready，7 分钟，无 OOM |
| 部署 `vault-studio-3rhxx1ssb`（robots.txt） | ● Ready，7 分钟，无 OOM |
| `/sitemap.xml` | 3149 条 URL，3149 条新域名，0 条死域名 |
| `/robots.txt` | HTTP 200，与本地源文件逐字节一致 |
| 抽查页面 | 首页、`/md/guide/getting-started`、Mission Driver、功能矩阵 均 200 |
| 搜索功能 | 索引 chunk `@localSearchIndexroot` 存在（9.1 MB，partial 模式生效），首页搜索按钮正常 |

**回归检查**：全仓库 grep `system-vault` 无 URL 残留（仅剩 npm 包名与视觉稿标签）；`deployment.md` 未提及域名，无需同步。

## 后续待办

- **提交 sitemap 到 Search Console**：需要域名所有权验证，无法在仓库内完成。这是当前 SEO 工作唯一还没打通的一环。
- **OOM 安全垫仅剩 0.14 GiB**：partial 模式峰值 5.91 GiB 可通过，full 模式 6.05 GiB 触发 OOM。内容继续增长后 partial 也可能顶不住，届时需要把更多目录移出索引或改用 Algolia。
- **`docs/md/sitelog/dev-log/issues/index.md` 的 Web.Cafe 条目链接失效**：指向 `./webcafe-scraping-handover.md`，实际文件在 `../webcafe-scraping-handover.md`。因 `ignoreDeadLinks: true` 不会导致构建失败，但属于既有坏链。
