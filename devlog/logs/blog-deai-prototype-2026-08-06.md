---
title: "Blog 去AI味视觉原型项目开发日志"
date: "2026-08-06"
source: "Nova Vault Studio"
url: ""
---

# Blog 去AI味视觉原型项目开发日志

## 背景

博客系统当前存在明显的模板化 AI 味：伪封面首字、22px 圆角卡片、悬浮阴影、标签胶囊（999px 圆角）以及模板化文案。需要系统性地提供去 AI 味方案，并通过视觉原型进行对比验证。

## 产出物

### 1. 方案文档

`devlog/prd/blog-deai-approaches-2026-08-06.md`

五个方案：

| 方案 | 核心理念 | 成本 |
|------|---------|------|
| 印刷编辑 (A) | 纯文字目录，无卡片无边框 | 低 |
| 杂志布局 (B) | 头条 + 侧栏 + 故事栏，编辑层级 | 中 |
| 极简档案 (C) | 按年/月时间线索引 | 低 |
| 组件级渐进 (D) | Before/After 对比，逐步替换 | 低 |
| A/B Test (E) | 多方向 mock 对比选定 | 已有 |

### 2. 视觉原型项目

`devlog/prototype/blog-deai/`

```
blog-deai/
├── index.html                    # Hub 页面，展示所有方案
├── approach-editorial.html       # 方案A: 印刷编辑
├── approach-magazine.html        # 方案B: 杂志布局
├── approach-archive.html         # 方案C: 极简档案
├── approach-components.html      # 方案D: 组件级改造 (Before/After)
├── style.css                     # 共享设计系统 (Easton 色板)
├── vercel.json                   # Vercel 部署配置
├── deploy.sh                     # 部署脚本
└── README.md                     # 项目文档
```

### 3. 设计原则

- 统一 Easton 色板（`--paper`, `--ink`, `--rust`, `--rule` 等）
- 桌面 + 移动端双视口适配
- 真实文章数据（标题、分类、日期、阅读时间）
- 去掉所有装饰性元素，标题为唯一入口

## 部署状态

- **项目**: `blog-deai` (dantefungs-projects)
- **地址**: https://blog-deai.vercel.app
- **状态**: ✅ 已部署
- **部署方式**: `vercel deploy --prod --token $VERCEL_TOKEN`
- **配置**: 静态站点，无构建步骤，`framework: null`

## 待办

- [ ] 选定方向后实施正式改造

## 参考

- 此前三方向原型: `devlog/prototype/nova-blog-directions.html`
- 此前 PRD: `devlog/prd/blog-index-redesign-2026-08-04.md`
- Easton 设计系统: `docs/.vitepress/theme/easton-blog.css`