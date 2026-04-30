---
title: "Nova Vault Studio"
description: Nova Vault Studio 项目规范
---

# Nova Vault Studio

> 团队知识库，基于 VitePress 构建，托管 AI 编程、系统架构、工具指南等专题内容。

---

## 项目概览

- **类型**：文档网站（VitePress）
- **包管理**：npm
- **站点目录**：`docs/`
- **源码目录**：`scripts/`

---

## 构建命令

```bash
npm run dev      # 开发预览（自动生成 PDF 页面）
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

---

## 目录结构

```
docs/
├── md/
│   ├── books/          # 专题书籍（PDF 阅读）
│   │   ├── ai-software/
│   │   ├── linux-network/
│   │   ├── k8s/
│   │   ├── DDIA/
│   │   └── ...
│   ├── guide/
│   │   ├── ai/         # AI 编程资源、Skills、Vibe Writing
│   │   ├── terminal/    # 终端工具指南
│   │   ├── cs/          # CS 基础
│   │   ├── os/          # 操作系统
│   │   └── drawing/     # 绘图工具指南
│   └── tutorial/
└── .vitepress/
    ├── config.js        # VitePress 配置
    └── sidebar.js       # 侧边栏自动生成逻辑
```

---

## 内容规范

### Markdown 文件 frontmatter（必须）

每个 `.md` 文件顶部必须有 YAML frontmatter：

```yaml
---
title: "页面标题"
date: "YYYY-MM-DD"
source: "来源类型"   # 如：微信公众号、Github、原创
url: "https://..."  # 原始链接
---
```

### 新增资源到导航页

- **AI 编程资源** → `docs/md/guide/ai/ai-programming-resources.md`
- **Claude Code 专项** → `docs/md/guide/ai/claude-code-resources.md`
- **终端工具** → `docs/md/guide/terminal/` 对应子目录

### 新增专题书籍

放入 `docs/md/books/` 下的专题目录，同一专题需创建 `index.md` 入口。

### Commit 规范

提交遵循 [Commit-As-Prompt](/home/fenghaolin/.claude/skills/vast-dev-commit-as-prompt) 规范：
- 使用 `/vast-dev-commit-as-prompt` 将变更转为 WHAT/WHY/HOW 结构
- 每次提交聚焦单一主题，避免噪声变更混入

---

## 常用工作流

### 登记新资源

1. 确认目标导航页（参考上方目录结构）
2. 按内容类型归类到对应分类
3. 每个链接附带一句话说明
4. 提交并 push

### 抓取公众号文章入库

```bash
python3 ~/.claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL"
# 抓取后按主题规划目录，添加 frontmatter，提交
```

### 新增 PDF 阅读页面

1. 将 PDF 放入对应 `books/` 子目录
2. 创建同名 `.md` 文件，使用 `PdfViewer` 组件
3. 参照已有页面格式：`title` + `PdfViewer` 组件

---

## 自动化工具

- `scripts/generate-pdf-pages.js` — 自动扫描 books 目录生成 PDF 页面入口
- `docs/.vitepress/sidebar.js` — 自动扫描 md 目录生成侧边栏

> 新增 Markdown 文件后会自动纳入侧边栏，无需手动配置。
