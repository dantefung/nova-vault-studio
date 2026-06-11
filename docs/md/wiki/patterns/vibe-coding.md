---
title: "Vibe Coding（氛围编程建站）"
date: "2026-06-11"
---

# Vibe Coding（氛围编程建站）

> 不写一行代码，靠聊天完成完整网站。Vibe Coding 已可交付生产级产品。

## Key Points

- **核心特点**：非程序员通过 AI 编码工具完成建站全流程（需求→产品文档→设计优化→SEO→部署）
- **需求讨论是关键** — 让 AI 扮演用户挖掘真实需求，比直接写代码更重要
- **设计参考驱动** — 从 Dribbble 找素材让 AI 分析，生成设计规范文档
- **SEO 是核心流量来源** — 关键词研究 + 博客系统 + 多语言是增长引擎

## 典型工作流（15步）

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | 开 AI 聊需求 | 脑暴、深度追问、模拟客户 |
| 2 | 让它写文档 | 人工 Review 后继续对话调整 |
| 3 | 一把梭 | 把主流程干出来 |
| 4 | 优化首页 | 没想法用 SuperDesign，有想法找参考 |
| 5 | 找参考 | Dribbble 等设计素材网站 |
| 6 | 扔给 AI | 让它分析并写设计规范 |
| 7 | 找 Landing Page 参考 | 给 AI 写首页信息结构文档 |
| 8 | 开工 | 参考文档干首页 + 搭博客系统 |
| 9 | 版本管理 | 用 Runyoyo 本地管理 |
| 10 | 优化细节 | 用 21st.dev 组件，复制 Prompt 给 AI |
| 11 | 精细化微调 | 用 Stagewise 圈出控件做微调 |
| 12 | 搞后端 | 连上 Supabase MCP |
| 13 | 部署上线 | 推 Vercel，绑域名，设环境变量 |
| 14 | SEO 运营 | 一个窗口整内容，一个窗口做页面 |
| 15 | Show Me The Talk | 用产品说话 |

## 工具组合

```
Claude Code（编码）+ SuperDesign（UI）+ Stagewise（微调）
+ Supabase（后端）+ Vercel（部署）+ GA/GSC（分析）
```

## 关键经验

1. **需求讨论 > 写代码** — 先聊需求、脑暴、深度追问，让 AI 模拟客户，双向费曼
2. **设计规范先行** — Dribbble 找参考 → AI 分析 → 输出设计规范文档 → 人工审查 → 再开发
3. **SEO 是核心** — 关键词研究（Semrush）+ 博客系统（SEO 文章）+ 多语言（i18n）
4. **工具组合** — Claude Code + SuperDesign + Stagewise + Supabase + Vercel

## 案例：Dognames.vip

- **产品**：狗狗名字生成器
- **关键词**：girl / boy dog names（搜索量大、KD 小）
- **结果**：6 小时完成从需求到上线的全流程

## Related Pages

- [patterns/prompt-engineering](patterns/prompt-engineering) — Prompt 工程模式
- [patterns/ai-product-seo-launch](patterns/ai-product-seo-launch) — AI 产品 SEO 冷启动
- [patterns/engineering-taste](patterns/engineering-taste) — 工程品味

## Sources

- 微信公众号《不写代码，嘴喷AI6小时后，我也能建站了？！》(2025-07-15)