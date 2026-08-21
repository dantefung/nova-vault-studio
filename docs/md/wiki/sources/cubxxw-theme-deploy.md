---
title: "cubxxw.com 主题复刻部署记录"
date: "2026-08-21"
source: "自建项目"
url: "https://f1ef4f72.nova-vault-f1p.pages.dev"
---

# cubxxw.com 主题复刻部署记录

> 复刻 cubxxw.com 编辑风格到 Nova Vault，使用 Next.js + Tailwind CSS + Cloudflare Pages 部署。

## 部署信息

| 项目 | 值 |
|------|-----|
| **生产地址** | https://f1ef4f72.nova-vault-f1p.pages.dev |
| **仓库分支** | feat/cubxxw-theme-clone |
| **技术栈** | Next.js 16.3.1 + Tailwind CSS v4 |
| **部署平台** | Cloudflare Pages |
| **输出大小** | 8.2MB |
| **构建时间** | ~3s |

## 页面状态

| 路由 | 状态 |
|------|------|
| `/` | ✅ 200 OK |
| `/articles` | ✅ 200 OK |
| `/about` | ✅ 200 OK |
| `/articles/[slug]` | ✅ 200 OK (SSG) |

## 设计令牌

```
--color-paper:        #fbf9f4  (暖纸张背景)
--color-ink:          #350003  (深墨红黑文字)
--color-accent:       #862122  (深红强调色)
--color-primary:      #0e7490  (青色次要操作)
--font-display:       Space Grotesk
--font-prose:         Noto Serif SC
--font-body:          Inter
--font-mono:          JetBrains Mono
--content-width:      720px
```

## 组件清单

- `Header.tsx` - 导航栏（响应式，含移动端菜单）
- `Footer.tsx` - 页脚
- `Hero.tsx` - 首页英雄区
- `CategoryGrid.tsx` - 分类网格入口
- `RecentPosts.tsx` - 最新文章列表
- `ArticleList.tsx` - 文章卡片列表
- `ArticleContent.tsx` - 文章详情页

## 字体加载

Google Fonts 预加载：
- Space Grotesk (700, 600, 500)
- Inter (400, 500, 600, 700)
- Noto Serif SC (400, 500, 600, 700)
- JetBrains Mono (400, 500, 700)

## 暗色模式

通过 `data-theme="dark"` 切换，支持 localStorage 持久化。

## 后续步骤

1. 绑定自定义域名到 Cloudflare Pages
2. 迁移 Nova Vault 内容到 Markdown 数据源
3. 接入 RSS feed 作为动态内容
4. 添加 Giscus 评论系统

---

> 💡 本文档自动生成于部署完成后。
