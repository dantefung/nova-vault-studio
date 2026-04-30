---
name: docs-workflow
description: 知识库文档工作流：新增资源、新增文章、新增书籍的标准流程
---

---
name: docs-workflow
description: 知识库文档工作流：新增资源、新增文章、新增书籍的标准流程
---

# 知识库文档工作流

## 新增链接到导航页

### 流程

1. 判断链接类型和归属分类
2. 打开对应的导航页 `.md` 文件
3. 按分类插入链接，保持格式一致：
   ```markdown
   - [标题](URL) — 一句话说明
   ```
4. 每个链接附带来源标签（如来源平台、作者、更新频率）
5. 提交：`/vast-dev-commit-as-prompt`

### 导航页分类

| 导航页 | 路径 | 内容类型 |
|--------|------|---------|
| AI 编程资源导航 | `guide/ai/ai-programming-resources.md` | 通用 AI 工具/课程/白皮书 |
| Claude Code 专项 | `guide/ai/claude-code-resources.md` | Claude Code 工具/Skills/Rules/MCP |
| 终端工具 | `guide/terminal/*.md` | 终端工具配置与使用 |
| AI 书籍/专题 | `books/{专题}/` | 长文/系统解析文章 |

## 新增文章入库（公众号/网页）

### 流程

1. 抓取内容：
   ```bash
   # 公众号
   python3 ~/.claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL"
   # 其他网页
   curl -sL "https://r.jina.ai/URL"
   ```
2. 判断内容主题，对应到目录（参考上方表格）
3. 添加 YAML frontmatter：
   ```yaml
   ---
   title: "文章标题"
   author: "作者名"
   date: "YYYY-MM-DD"
   source: "微信公众号"
   url: "原始链接"
   ---
   ```
4. 写入 `.md` 文件（若是专题首次入库，同步创建 `index.md` 入口）
5. 提交：`/vast-dev-commit-as-prompt`

## 新增 PDF 书籍

### 流程

1. 将 PDF 放入 `books/{专题名}/` 目录
2. 创建同名 `.md` 文件：
   ```markdown
   ---
   title: "书籍标题"
   ---

   # 书籍标题

   <script setup>
   import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
   const pdfUrl = new URL('./书籍名.pdf', import.meta.url).href
   </script>

   <PdfViewer :src="pdfUrl" />
   ```
3. 若专题首次入库，创建 `index.md` 入口：
   ```markdown
   ---
   title: 专题名
   ---

   # 专题名

   > 专题简介。

   - [书籍名](./书籍名.md)
   ```
4. 提交

## 提交规范

所有提交使用 `/vast-dev-commit-as-prompt`，遵循 WHAT/WHY/HOW 结构。

## 自动化

- `scripts/generate-pdf-pages.js`：自动扫描 books 目录，生成 PDF 页面入口
- `docs/.vitepress/sidebar.js`：自动扫描 md 目录，生成侧边栏
- 新增 `.md` 文件自动纳入侧边栏，无需手动配置
