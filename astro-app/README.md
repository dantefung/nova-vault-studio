# System Vault — Astro Rebuild

> 实验分支：用 Astro 重建首页和博客系统，绕过 VitePress 1.6.4 的 SSR cookie 限制。

## 解决的问题

**已知 bug**（详见 `docs/md/sitelog/evolution/milestones.md`）：
VitePress 1.6.4 在 SPA 切换到 `easton-clone` 风格时首页白屏，根因是 SSR 阶段
无法读 `localStorage`/`<html>.dataset`，导致 v-if 渲染错误。

**修复方式**：Astro `output: 'server'` + Node adapter。SSR 阶段直接读
`Astro.cookies.get('landingTheme')`，hydrate 之前就把正确风格写进 HTML，
不依赖客户端 JS 触发 v-if 重渲染。

## 启动

```bash
cd astro-app
npm install
npm run build   # 生成 blog-index.json + astro build
npm start       # 启动 Node SSR 服务 (默认 :4321)
```

环境变量：
- `SYSTEM_VAULT_ROOT`：worktree 根目录（默认自动检测）
- `PORT`：服务端口（默认 4321）

## 路由

| URL | 说明 |
|-----|------|
| `/` | 首页（按 cookie 决定 quiet / easton / easton-clone） |
| `/blog/` | 博客列表（latest / category / series 三视图，`?view=...`） |
| `/blog/archive/` | 按年-月归档 |
| `/blog/series/` | 系列索引 |
| `/blog/series/<slug>/` | 单系列详情 |
| `/blog/category/` | 分类索引 |
| `/blog/category/<slug>/` | 单分类详情 |
| `/article/[...path]/` | 文章详情（来自 `docs/md/**`） |

## Cookie 机制

```
请求进入 → SSR 读 cookie → 选 landingTheme → 写 html data-theme
                 ↓
        客户端脚本：localStorage → cookie 同步（首次访问时）
                 ↓
        切换按钮：localStorage + cookie + reload
```

`scripts/cdp-validate.mjs` 是基于 Chrome DevTools Protocol 的真浏览器验证脚本，
可以验证 `landingTheme=easton-clone` 下首页内容是否真渲染（hero/featured/latest/series/category）。

## 内容源

- 复用 `scripts/build-blog-index.js`（已存在的 510 篇索引）→ `docs/.vitepress/generated/blog-index.json`
- 文章详情 runtime 直接 walk `docs/md/{wiki,columns,business}/` 目录（避免 Astro 把外部 .md 当 content collection 处理）

## 已知 trade-off

- 这是 SSR（server output），不能纯静态托管到 Vercel Edge。需要 Node 运行时（Vercel Functions / 自托管 / Railway）。
- 文章详情页用的是 `import.meta.glob` + fs.readFileSync，**首次请求会触发磁盘扫描**，可加内存缓存（当前已有 `cached`）。
- Easton doc 内页（`easton-doc.css`）未迁移——仍在 VitePress 1.6.4 主分支维护。