---
title: "哥飞 SEO Agent 对 Mulan.pro 的 SEO 诊断报告"
date: "2026-08-21"
source: "微信公众号（我是哥飞）"
url: "https://mp.weixin.qq.com/s/SadERYNN9BmRHJtgCbW8Ag"
---

# 哥飞 SEO Agent 对 Mulan.pro 的 SEO 诊断报告

## 概述

哥飞 SEO Agent 对 Mulan.pro（AI 视频工作流产品）进行了完整的 SEO 技术诊断。结论：团队完全没有 SEO 意识——从页面渲染到语言路由、robots/sitemap、错误状态、页面标签到站内结构，基础配置几乎全部缺失。

## 八个核心问题

### 1. 所有页面纯前端渲染（最严重）

- 所有页面首次返回的都是同一个约 2.4KB 的 HTML：`<div id="root"></div>` + 一个 JS 文件
- 原始 HTML 正文 0 词、无 H1、无内链
- 首页/英文页/Discover 页的 Title 全是 `MulanAI`，Description 都是单个词 `Mulan`
- Googlebot 第一次抓取拿不到任何正文内容，必须先跑 JS
- **建议**：首页和核心功能页改为 SSR/SSG/预渲染

### 2. 根目录不是固定首页

- 根目录 `/` 根据浏览器语言自动跳到 `/zh` 或 `/en`
- 搜索引擎和用户打开同一地址，目标 URL 由浏览器语言 + JS 决定
- **建议**：选择一种主语言（如英文）直接承载根目录，`/en` 301 到根目录，其他语言用 `/zh` `/ja` 子目录 + `hreflang` + `x-default`

### 3. robots.txt 和 sitemap.xml 被跳回首页

- `https://mulan.pro/robots.txt` → 跳回首页 HTML
- `https://mulan.pro/sitemap.xml` → 跳回首页 HTML
- 两个文件没有放对位置

### 4. 不存在的 URL 也被跳回首页（soft 404）

- 访问 `/this-page-should-not-exist-xyz123` 返回 200，哈希与首页一致
- 所有错误地址都跳回首页，告诉搜索引擎"页面正常存在"
- 应返回 404 或 410

### 5. 测试环境已进入 Google

- Google 收录了 `test.mulan.pro`、`dev-ent.mulan.pro`、`dev-api.mulan.pro`
- 测试环境公开可访问，源码暴露 `PUBLIC_MODE: "TEST"` 和测试存储地址
- **建议**：增加登录鉴权或 `noindex`

### 6. 没有 canonical 和 hreflang

- 原始 HTML 中缺少 canonical 和 hreflang
- 根目录还会按浏览器语言跳转，更需要写清多语言页面关系

### 7. 没有 H1、内链、OG 和结构化数据

- 原始 HTML 无 H1-H6
- 无可抓取的站内链接
- 无 Open Graph 和 Twitter Card
- 无 JSON-LD 结构化数据（SoftwareApplication、Organization）

### 8. 关键词集中在品牌词

- SimilarWeb 数据：2026 年 7 月估算访问量 3,203（前两个月：13,460 / 9,524）
- 主要搜索词：`mulan ai`、`木兰 AI`、`木兰 AI 融资`、`mulan pro`
- 几乎全是品牌词，非品牌搜索无法触达
- **建议**：把视频生成/编辑/批量生产等工作流能力拆成独立功能页，覆盖 `text to video`、`ai video editor` 等非品牌词

## 修复顺序建议

1. **先解决纯前端渲染和语言路由**：SSR/SSG/预渲染，稳定根目录，让 `/zh` `/en` 成为可直接抓取的语言页
2. **补齐基础文件和错误状态**：真正的 `robots.txt` + `sitemap.xml`，错误 URL 返回 404/410
3. **隔离测试环境**：内部子域加鉴权，公开预览加 `noindex`
4. **完善页面信号和关键词入口**：canonical、hreflang、OG、结构化数据、可抓取内链；拆功能页/教程页/FAQ

## 核心洞察

Mulan.pro 的问题不是某一个 Title 没写好，而是团队从一开始就没有把 SEO 放进网站建设流程。修复顺序：先让 Google 能直接拿到正确页面 → 再处理抓取/收录/页面信号 → 最后才是关键词和内容建设。

## 产品链接

- 哥飞 SEO Agent 在线体验：https://seo.web.cafe/chat/
- 网站 GSC 数据入口：https://seo.web.cafe/mysite/