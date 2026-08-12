---
title: "Vercel 构建 OOM"
date: "2026-06-26"
source: "Nova Vault Studio"
url: ""
---

# Vercel 构建 OOM

## 现象

Vercel 部署执行 `rm -rf docs/.vitepress/cache && npm run build` 失败，退出码为 1。

日志中出现：

```txt
The language 'gitignore' is not loaded, falling back to 'txt' for syntax highlighting.
The language 'prompt' is not loaded, falling back to 'txt' for syntax highlighting.
"getCurrentInstance" is imported from external module "vue" but never used in "docs/.vitepress/theme/composables/useTheme.js".
At least one "Out of Memory" ("OOM") event was detected during the build.
```

## 根因

主要原因不是 `gitignore` / `prompt` 语法高亮 warning，而是 VitePress 构建内存放大：

- `docs/md` 内容体积约 1.1GB，Markdown 页面约 1900+ 个。
- 存在多个超大 Markdown 文件，最大页面接近 10MB。
- 部分 Markdown 内联了 `data:image/...;base64` 图片，构建时会进入 Markdown 源、页面 JS chunk、搜索索引等多个阶段。
- VitePress 默认 `buildConcurrency` 为 64，Vercel 构建容器内存有限。
- 本地全文搜索会在构建时额外渲染全站页面并生成索引，进一步抬高峰值内存。

## 修复

修改 `docs/.vitepress/config.js`：

- 增加低内存构建判断：`VERCEL=1` 或 `VITEPRESS_LOW_MEMORY_BUILD=1`。
- 低内存构建时将 `buildConcurrency` 降为 4。
- Vercel 上默认关闭 VitePress 本地搜索索引。
- 本地搜索保留 200KB 页面大小保护，超大 Markdown 不进入搜索索引。
- 自定义 Markdown 代码高亮为 HTML escape，避免未加载语言造成额外高亮处理和 warning。

修改 `docs/.vitepress/theme/composables/useTheme.js`：

- 移除未使用的 `getCurrentInstance` 和 `watch` import。

## 验证

本地模拟 Vercel 环境执行：

```bash
rm -rf docs/.vitepress/cache docs/.vitepress/.temp docs/.vitepress/dist && VERCEL=1 npm run build
```

结果：

```txt
build complete in 85.69s.
```

退出码为 0。

## 2026-08-12 再次优化

随着页面数量增长到约 2449 页，Vercel 构建再次超过 45 分钟。本地基线构建耗时约 191 秒，峰值内存约 6.07 GiB，文件系统写出约 6.7 GiB。

本轮确认了四个叠加因素：

- 本地全文搜索会再次渲染页面并生成全站索引。
- 每个页面重复内联站点 metadata，放大 HTML 产物。
- `vercel.json` 每次构建前删除缓存，阻止 VitePress 复用有效缓存。
- 43 篇 Markdown 中仍有 463 张 Base64 图片，编码文本约 71.9 MB。

完成以下调整：

- Vercel 和低内存构建关闭本地搜索，本地开发继续保留搜索。
- 搜索关闭时同步隐藏自定义搜索入口，避免出现空搜索框。
- 启用 VitePress `metaChunk`，把重复 metadata 提取为共享 chunk。
- Vercel 构建不再强制删除 `docs/.vitepress/cache`。
- 保留 `lastUpdated`，避免更新时间功能回归。
- 修复《冒号课堂》PDF 文件名不匹配导致的重复预览页。

本地模拟 Vercel 环境执行：

```bash
VERCEL=1 /usr/bin/time -v npm run build
```

结果：

```txt
build complete in 115.30s.
Elapsed: 1:57.08
Maximum resident set size: 6239728 kB
File system outputs: 3480400
```

相较 191 秒基线，构建时间缩短约 39%，文件系统写出约减半。峰值内存仍接近 6 GiB，说明 Base64 图片仍是下一阶段主要瓶颈。

随后将 43 篇 Markdown 中的 463 个 Base64 图片引用全部迁移为文章同级独立图片文件：

- 每篇文章使用独立的 `images/{文章名}/` 目录。
- PNG、JPEG、WebP 保持原格式；11 张 GIF 经明确确认后作为例外保留动画，没有按默认归档规范转为静态 PNG。
- 同一文章内按图片内容去重，共落盘 454 张图片。
- 超过 500 KB 的图片压缩到仓库限制以内。
- 图片检查 hook 增加引用式 Markdown 支持，避免路径或大小检查漏报。
- 新增 `scripts/extract-base64-images.mjs`，再次执行时不产生改动。

迁移后再次执行 Vercel 模式构建：

```txt
build complete in 99.09s.
Elapsed: 1:40.63
Maximum resident set size: 4921564 kB
File system outputs: 2914528
```

相较最初基线，构建时间缩短约 47%，峰值内存下降约 23%，文件系统写出下降约 57%。

## 后续约束

- 不要把大图以内联 base64 形式放进 Markdown。
- 图片应落盘到文章同级 `images/` 目录，用相对路径引用。
- Vercel 生产环境默认不启用本地全文搜索；如需生产搜索，优先接 Algolia 或生成独立轻量索引。
- 大体积内容入库后，应优先检查单个 Markdown 文件大小和构建产物 chunk 大小。
