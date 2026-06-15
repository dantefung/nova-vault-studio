---
title: "Nova Vault Studio 功能矩阵"
date: "2026-06-15"
source: "项目自述"
---

# Nova Vault Studio 功能矩阵

> 系统知识库框架全景：内容板块、知识架构、Skills 能力、站点特性、自动化工具。

---

## 内容板块（11 个）

| 板块 | 路径 | 用途 |
|------|------|------|
| **guide** | `docs/md/guide/` | 指南文档（AI、Claude Code、CS、开发、终端、OS、VM、OpenClaw、研究） |
| **wiki** | `docs/md/wiki/` | LLM Wiki 知识库（四层架构） |
| **columns** | `docs/md/columns/` | 19 个深度专栏（Agentic Engineer、Vibe Coding、Lenny's Newsletter 等） |
| **books** | `docs/md/books/` | 16 个书籍分类，支持 PDF 内嵌预览 |
| **slides** | `docs/md/slides/` | 横向翻页网页 PPT 集合 |
| **tutorial** | `docs/md/tutorial/` | 教程区 |
| **agi** | `docs/md/agi/` | AGI 相关教程（Anthropic Academy、Claude Code 源码分析） |
| **business** | `docs/md/business/` | 商业分析（市场、模式、投资） |
| **sitelog** | `docs/md/sitelog/` | 站点自身文档 |
| **assets** | `docs/md/assets/` | 静态资源 |
| **pdf-preview** | `docs/md/pdf-preview.md` | PDF 预览入口 |

---

## Wiki 知识库架构（四层）

| 层级 | 目录 | 内容 | 可变性 |
|------|------|------|--------|
| 原始层 | `sources/` | 原始原文（公众号、X、YouTube 等） | 唯读 |
| 摘要层 | `summaries/` | LLM 精读摘要 | LLM 维护 |
| 概念层 | `concepts/` | 提炼的知识页，含交叉引用 | LLM 维护 |
| 产出层 | `artifacts/` | 原创产出（articles/threads/notes） | 用户维护 |

**额外子目录**：products、patterns、comparisons、entities、synthesis、journal、read-later、brainstorming、images

---

## Skills 能力矩阵（18 个）

| 类别 | Skill | 功能 |
|------|-------|------|
| **知识采集** | markdown-proxy | URL 转 Markdown（支持 r.jina.ai、defuddle.md、Playwright） |
| | wiki-ingest-article | 任意平台文章一键采集归档（微信、X、YouTube、飞书、知乎） |
| | wiki-ingest | 将文章/文档编译为结构化 wiki 页面 |
| **知识管理** | llm-wiki | 持久化复利知识库模式（Raw → Wiki → Schema） |
| | content-factory | 本地素材到选题装配的完整流水线 |
| **内容创作** | guizang-ppt-skill | 横向翻页网页 PPT（杂志风 + 瑞士风） |
| | article-illustrate | 文章配图全流程（分析 → Gemini 生图 → 插入） |
| | gemini-web-image | 通过 Playwright 操作 Gemini Web UI 生图 |
| | huashu-bookwriter | 花叔风格书籍创作框架 |
| **学习工具** | book-study | 系统化读书教练（知识编译、间隔重复） |
| | sigma | Bloom's 2-Sigma 掌握式学习家教 |
| | book2skill (cangjie) | 把一本书蒸馏成一组可执行 skills |
| | nuwa-skill | 人物 Skill 蒸馏（输入人名 → 深度调研 → 生成 Skill） |
| **文档处理** | pdf-to-markdown | PDF 转 Markdown（pdftotext + pdfimages） |
| **Git 工作流** | commit-as-prompt | Git 提交记录转 AI 上下文 Prompt |
| | gh-push | 使用 gh 命令进行 git 提交和推送 |
| **元技能** | skill-forge | 创建高质量 Claude Code Skills |

---

## 站点特性

| 特性 | 实现方式 |
|------|---------|
| **全文搜索** | VitePress 内置本地全文索引，支持中文分词 |
| **Mermaid 图表** | `vitepress-plugin-mermaid` 插件 |
| **Markmap 思维导图** | 自定义 `markdown-it-markmap.js` 插件 |
| **PDF 预览** | 自定义 Vue 组件（PdfViewer、PdfList、PdfOutline） |
| **HTML PPT 嵌入** | 自定义 `HtmlViewer.vue` 组件 |
| **主题切换** | 亮/暗主题，防闪烁脚本 |
| **字体系统** | LXGW WenKai 本地字体，支持 CDN/本地双模式 |
| **自动侧边栏** | `sidebar.js` 扫描文件系统自动生成 |
| **Clean URLs** | URL 无 `.html` 后缀 |
| **Sitemap** | 自动生成 `sitemap.xml` |
| **Vercel Analytics** | 访问分析 |
| **Giscus 评论** | GitHub Discussions 评论系统 |
| **OG 元数据** | Open Graph meta 标签 |
| **lastUpdated** | 页面最后更新时间显示 |

---

## 自动化工具

| 工具 | 功能 |
|------|------|
| **generate-pdf-pages.js** | 自动扫描 PDF 生成预览页（dev/build 前运行） |
| **html2md.py** | HTML 转 Markdown（3 个版本） |
| **pdf2md_batch.py** | 批量 PDF 转 Markdown |
| **check-frontmatter.py** | Pre-commit hook，检查 frontmatter `title` 必填 |
| **fetch_weixin.py** | 微信公众号文章抓取（Playwright） |
| **download-images.py** | 图片下载器（带 Referer 穿越防盗链） |
| **fetch_feishu.py** | 飞书文档抓取 |

---

## 构建与部署

| 项目 | 详情 |
|------|------|
| **框架** | VitePress 1.6.4 + Vue 3 |
| **部署平台** | Vercel |
| **域名** | `system-vault.site` |
| **输出目录** | `docs/.vitepress/dist` |
| **字体策略** | 默认本地字体，可选 CDN |

---

## 统计概览

| 维度 | 数量 |
|------|------|
| 内容板块 | 11 个 |
| 深度专栏 | 19 个 |
| 书籍分类 | 16 个 |
| Skills 能力 | 18 个 |
| 自动化脚本 | 7+ 个 |
| 站点特性 | 14 项 |
