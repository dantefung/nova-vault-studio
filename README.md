# System Vault

> 系统知识库框架，参考 Money Hub 项目架构初始化。

## 特性

- ⚡️ 基于 VitePress  (已开启站内全文搜索，右上角输入关键词即可查找文章)
- 📊 支持 Mermaid 图表
- 🗺️ 支持 Markmap 脑图
- 📂 自动生成动态侧边栏
- 🎨 优化的阅读体验 (LXGW WenKai 字体支持)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

## 内容采集

### 公众号文章

项目内置了微信公众号文章采集技能，支持正文 + 图片完整抓取：

```bash
# 一步到位（Agent 自动执行两步流程）
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "WEIXIN_URL"
python3 .claude/skills/markdown-proxy/scripts/download-images.py <saved_md_file>
```

对 AI Agent 来说，只需说「采集 XXX，归档到 YYY 专栏」，Agent 会自动完成：

1. `fetch_weixin.py` — Playwright 抓取正文和远程图片 URL
2. `download-images.py` — 带 Referer 下载图片到 `images/{slug}/`，替换本地路径
3. 创建 `.md` 文件到专栏目录
4. 更新专栏 `index.md` 索引表
5. 提交推送

技能文件位于 `.claude/skills/markdown-proxy/`。

### PDF 转 Markdown

```bash
python3 .claude/skills/pdf-to-markdown/scripts/pdf2md.py input.pdf -o output.md
```

自动提取文字（pdftotext）+ 嵌入图片（pdfimages），生成带配图的 Markdown。

## LLM Wiki 知识库

本项目使用四层架构维护知识库，参考 Andrej Karpathy 的 llm-wiki 概念：

```
sources/     ← 原始原文（公众号文章、X/Twitter 帖子等），verbatim 不可修改
summaries/  ← 精读摘要（LLM 重写，含核心结论+关键证据+疑点+术语）
concepts/   ← 知识页（从摘要提炼，含定义+洞察+交叉引用）
artifacts/  ← 原创产出物（已发布的文章、推文串、笔记）
journal/    ← 探索日志（chronological 条目）
```

### 两条归档路径

| 路径 | 触发 | 目的地 |
|------|------|--------|
| 采集归档 | `/wiki-ingest-article` | sources → summaries → concepts |
| 创作发布 | 发布到专栏时 | 同步复制到 `wiki/artifacts/articles/` |

### Wiki 子目录

`concepts/`（概念）、`entities/`（实体）、`patterns/`（模式）、`products/`（产品）、`comparisons/`（对比）、`synthesis/`（综合）、`artifacts/`（产出）、`journal/`（对话）、`images/`（图片）

详细内容见 [AGENTS.md](./AGENTS.md)。

## 部署

本项目支持在 Vercel 一键部署。
