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

## 后续约束

- 不要把大图以内联 base64 形式放进 Markdown。
- 图片应落盘到文章同级 `images/` 目录，用相对路径引用。
- Vercel 生产环境默认不启用本地全文搜索；如需生产搜索，优先接 Algolia 或生成独立轻量索引。
- 大体积内容入库后，应优先检查单个 Markdown 文件大小和构建产物 chunk 大小。
