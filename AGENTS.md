---
title: "AI Agent 操作规范"
---

# Agent 操作规范 (Nova Vault Studio)

> VitePress 文档站点，没有传统工程工具链（无 lint/test/TS），内容即代码。

---

## 项目本质

- 这是一个 **纯内容站点**，不要运行 `npm test`/`npm run lint` — 这些命令不存在
- 所有 `.md` 文件放在 `docs/md/` 下，侧边栏和导航由文件系统扫描自动生成
- **每次完成任务都要主动汇报进度**

---

## 系统功能矩阵概览

### 内容板块（11 个）

| 板块 | 用途 |
|------|------|
| guide | 指南文档（AI、Claude Code、CS、开发、终端、OS 等） |
| wiki | LLM Wiki 知识库（四层架构） |
| columns | 20 个深度专栏 |
| books | 16 个书籍分类，支持 PDF 内嵌预览 |
| slides | 横向翻页网页 PPT 集合 |
| tutorial | 教程区 |
| agi | AGI 相关教程 |
| business | 商业分析（市场、模式、投资） |
| sitelog | 站点自身文档 |

### Skills 能力（18 个）

| 类别 | 主要 Skill |
|------|-----------|
| 知识采集 | markdown-proxy、wiki-ingest-article |
| 知识管理 | llm-wiki、content-factory |
| 内容创作 | guizang-ppt-skill、article-illustrate、huashu-bookwriter |
| 学习工具 | book-study、sigma、book2skill、nuwa-skill |
| 文档处理 | pdf-to-markdown |
| Git 工作流 | commit-as-prompt、gh-push |
| 元技能 | skill-forge |

### 站点特性

- 全文搜索（中文分词）
- Mermaid 图表、Markmap 思维导图
- PDF 预览、HTML PPT 嵌入
- 亮/暗主题切换、自动侧边栏
- Sitemap、Vercel Analytics、Giscus 评论

> 📋 **详细功能矩阵**：[sitelog/features/feature-matrix.md](./docs/md/sitelog/features/feature-matrix.md)

---

## ⚠️ 致命坑

### Frontmatter `title` 是必填的，缺失会阻断提交

pre-commit hook (`check-frontmatter.py`) 检查所有 staged `.md` 文件，缺 `title` 直接拒绝提交。
`date`、`url` 缺失仅警告不阻断。

```yaml
---
title: "标题"          # 必填
date: "YYYY-MM-DD"     # 推荐
source: "来源"         # 推荐
url: "https://..."     # 推荐
---
```

### 微信 CDN 图片是 WebP 假扮 PNG

URL 后缀 `.png` 不代表文件格式就是 PNG。必须用 `convert` 转换后再确认：

```bash
curl -L -o /tmp/temp.png "URL"
convert /tmp/temp.png images/{文章名}/{图片名}.png
file images/{文章名}/{图片名}.png    # 必须输出 "PNG image data"
```

### 公众号采集必须两步走：正文 + 图片

`fetch_weixin.py` 只抓 Markdown 正文和远程图片 URL，**不会下载图片到本地**。漏掉第二步图片就白抓了。

```bash
# 第一步：抓正文（含远程图片 URL），输出到 _sandbox/
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "WEIXIN_URL" > _sandbox/{文章英文名}.md

# 第二步：下载图片到 _sandbox/images/{文章英文名}/（用 --prefix 指定目录）
python3 .claude/skills/markdown-proxy/scripts/download-images.py _sandbox/{文章英文名}.md --prefix "images/{文章英文名}/"
```

> **铁律**：markdown-proxy SKILL.md 已更新为强制两步流程。Agent 采集公众号时自动执行。手动调 `fetch_weixin.py` 必须补调 `download-images.py`。
> **重要**：`download-images.py` 默认输出到 `./images/{prefix}/`，**必须用 `--prefix`** 指定为 `_sandbox/images/{文章英文名}/`，否则图片散落一地。

### 公众号采集后续处理

**1. 图片路径已由脚本自动替换为本地相对路径**（`images/{文章英文名}/001.png` 等），无需手动修正。

**2. 清理双 frontmatter**

baoyu-fetch 可能产生两块 `---`：
- 第一块：YAML 元数据（title/date/source/url 等）
- 第二块：可能是额外的元数据或直接是正文

处理方式：只保留第一块 frontmatter（`---` 闭合后到下一个 `---` 之间的内容全部删除），正文从 `# 标题` 行开始。

**2. 清理双 frontmatter**

baoyu-fetch 可能产生两块 `---`：
- 第一块：YAML 元数据（title/date/source/url 等）
- 第二块：可能是额外的元数据或直接是正文

处理方式：只保留第一块 frontmatter（`---` 闭合后到下一个 `---` 之间的内容全部删除），正文从 `# 标题` 行开始。

**3. 修复 YAML frontmatter 常见问题**

- URL 折行：`url: "https://..."` 必须在一行内，不能在 URL 中间换行
- 验证：`python3 .claude/hooks/check-frontmatter.py {file}`（无输出 = 通过）

**4. Commit 规范**

- commit message 用 `prompt:` 前缀，例：`prompt: 采集 xxx 文章`
- pre-commit hook 会检查 title 必填，缺则拒绝提交

### `ignoreDeadLinks: true` — 死链接静默放过

构建时不会因为死链接报错。如果改动了文件路径或删除了页面，相关引用不会自动发现。

---

## 归档文章到专栏

1. 文件放到专栏目录（如 `docs/md/columns/agentic-engineer/`）
2. **手动更新专栏 `index.md` 的表格** — 侧边栏自动生成，但 index.md 的索引表不自动维护
3. YAML frontmatter 必须含 `title`, `date`, `source`, `url`

---

## 图片存放规范

```
docs/md/{分类}/{子目录}/images/{文章英文名}/{图片文件}
```

- 图片放在文章同级的 `images/` 目录
- **每篇文章必须有独立的图片子目录**（以文章英文名命名）
- 引用路径用相对路径：`images/{文章英文名}/{图片文件}.png`

---

## HTML PPT 归档规范

外部 HTML PPT（如 guizang-ppt-skill 生成的）归档到本知识库时，遵循以下流程：

### 目标位置

```
docs/md/slides/ppt-{英文简称}/
├── index.html          ← 原始 HTML（verbatim）
├── index.md            ← VitePress 入口（必建）
└── images/             ← 引用的图片（如有）
    ├── slide-01.png
    └── slide-02.png
```

- 目录命名：`ppt-` 前缀 + 英文 kebab-case（如 `ppt-how-to-write-prompt`）
- 放在 `docs/md/slides/` 专用目录下，按主题分类

### 操作步骤

```bash
# 1. 创建目录
mkdir -p docs/md/slides/ppt-{英文名}/images

# 2. 复制文件
cp {源}/index.html docs/md/slides/ppt-{英文名}/
cp {源}/images/*.png docs/md/slides/ppt-{英文名}/images/

# 3. 创建 index.md（见下方模板）

# 4. 更新 docs/md/slides/index.md 的目录索引
```

### index.md 模板

```markdown
---
title: "{PPT 标题}"
date: "{YYYY-MM-DD}"
source: "{来源项目}"
url: ""
---

# {PPT 标题}

> {一句话描述}

[打开 PPT →](./index.html)

---

## 内容概览

- 要点 1
- 要点 2
```

### 索引更新

在 `docs/md/slides/index.md` 的对应主题章节追加：

```markdown
- [{PPT 标题}](./ppt-{英文名}/index.md) — {一句话描述}
```

### ⚠️ 注意事项

- `index.html` **原样复制**，不要修改内容（保持 PPT 可独立运行）
- `index.md` 的 `title` 必填（pre-commit hook 检查）
- 如果 HTML 引用了外部 CDN 字体/脚本，保留不动（PPT 需要联网加载）
- 图片如果在 HTML 中是内联 base64，则不需要单独复制 images 目录

---

## PDF 归档到 books 目录

### 目标位置

```
docs/md/books/{分类目录}/
├── index.md                    ← VitePress 入口（手动编辑，用 <PdfList> 组件）
├── {书名}.pdf                  ← 原始 PDF
├── {书名-kebab-case}.md        ← PDF 预览页（手动创建）
└── cover.png                   ← 封面图（可选）
```

### 操作步骤

```bash
# 1. 创建分类目录（如不存在）
mkdir -p docs/md/books/{分类目录}

# 2. 复制 PDF
cp /path/to/源文件.pdf "docs/md/books/{分类目录}/{书名}.pdf"

# 3. 如果 PDF > 100MB，先用 ghostscript 压缩
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile="/tmp/compressed.pdf" \
   "docs/md/books/{分类目录}/{书名}.pdf"
cp /tmp/compressed.pdf "docs/md/books/{分类目录}/{书名}.pdf"

# 4. 创建 PDF 预览页（{书名-kebab-case}.md，见下方模板）

# 5. 更新 index.md 简介（可选）
```

### PDF 预览页模板

```markdown
---
title: "{书名}"
date: "{YYYY-MM-DD}"
source: "{来源}"
---

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./{书名}.pdf', import.meta.url).href
</script>

# {书名}

<PdfViewer :src="pdfUrl" />
```

### ⚠️ 关键约束

- **文件命名**：PDF 预览页用 kebab-case（如 `x-growth-100-to-110k.md`），引用中文名 PDF
- **不要创建与 PDF 同名的 .md**：`generate-pdf-pages.js` 在 dev/build 时会扫描 PDF 自动生成同名 `.md`。如果你手动创建了 kebab-case 的预览页，脚本会检测到该 PDF 已被其他 `.md` 引用，自动跳过生成。**但如果创建了与 PDF 同名（中文）的 `.md`，脚本会认为这是"已有页面"而保留，导致侧边栏出现两个入口**
- **压缩门槛**：PDF > 100MB 必须用 ghostscript 压缩（GitHub 单文件上限 100MB）
- **commit 体积**：超大 PDF 会导致 push 超时，等待即可（或者用 `git push --no-thin`）

---

## 临时目录

临时工作文件统一放在项目根目录 `_sandbox/` 下，完成后清理。不放在 `/tmp/`。

**采集完成后**，必须清理 `_sandbox/` 目录，删除临时文件和图片。

---

## 构建与预览

```bash
npm run dev       # 开发预览（自动生成 PDF 页面 + 本地字体）
npm run build     # 生产构建（同上）
npm run preview   # 预览构建产物
```

每次 dev/build 前自动运行 `generate-pdf-pages.js` 生成 PDF 入口页面。

---

## 侧边栏行为

- 侧边栏完全自动生成，新增 `.md` 文件即自动出现
- `index.md` 不出现在侧边栏中，但其所在目录会作为分组入口
- `tutorial/` 目录有特殊规则：只保留子目录中的文件，根目录文件被过滤

---

## Commit-As-Prompt Skill

将 Git 提交记录转化为供其他 AI 参考的上下文 Prompt。触发词：`/vast-commit-as-prompt`、`commit as prompt`、`提交转 prompt`。

```bash
/vast-commit-as-prompt
```

---

## LLM Wiki 约定

本项目使用 `llm-wiki` 模式维护知识库，采用四层架构。

### 稍后读 (Read Later)

**触发词**：「稍后读」「先记下来」「mark for later」「回头看」。

**轻量性质**：用户说"稍后读"= **只记链接**，**不要抓全文到 Downloads**，**不要**走 wiki-ingest 完整流程。

**文件**：`docs/md/wiki/read-later/index.md`——按平台分类追加一行，**绝不单独建文件**。

**格式**（微信公众号分类下）：

```markdown
| YYYY-MM-DD | https://mp.weixin.qq.com/s/xxx | **标题**：一句话摘要 + 关键洞察 + 跟本仓哪条概念链接 |
```

- 日期：当天 `YYYY-MM-DD`
- 摘要：3-5 个粗体关键词，1-2 句话讲核心
- 交叉引用：跟现有 wiki 概念（`[[llm-wiki]]` 等）的关联顺手标注

**升级路径**：如果用户后续说「入库」「归档到仓库」「走完整流程」，再触发 `/wiki-ingest-article`——sources → summaries → concepts → index/log 更新。

**反例**（INFP 常见陷阱：理想化预期、过度打磨）：不要"为了以防万一先抓全文存到 Downloads"——除非用户明确说"抓全文"或"入库"。

### 四层结构

| 层级 | 目录 | 内容 | 是否可变 |
|------|------|------|----------|
| 原始层 | `sources/` | 原始原文（公众号文章、X/Twitter 帖子等），verbatim 不可修改 | 唯读 |
| 摘要层 | `summaries/` | 精读摘要（LLM 重写，含核心结论+关键证据+疑点+术语） | LLM 维护 |
| 概念层 | `concepts/` | 从摘要提炼的知识页，含定义+洞察+与其他概念交叉引用 | LLM 维护 |
| 产出层 | `artifacts/` | 你原创的完成品（已发布的文章、推文串、笔记） | 你维护 |

### artifacts 子目录

```
artifacts/
├── articles/   ← 已发布到专栏的长文
├── threads/    ← 推文串/X threads
└── notes/      ← 随手笔记/想法片段
```

**artifacts 入口**：写完发布到专栏时，同步复制一份到 `wiki/artifacts/articles/`。
不是采集归档，是**创作产出物**。

### 三条归档路径（含稍后读）

| 路径 | 触发 | 目的地 | 重量 |
|------|------|--------|------|
| 稍后读 | "稍后读"/"先记下来" | `wiki/read-later/index.md` 追加一行 | ⚡ 极轻（只记链接） |
| 采集归档 | `/wiki-ingest-article` | `sources/` → `summaries/` → `concepts/` | 🔥 重（精读+配图+概念页） |
| 创作发布 | 写完发布到专栏时 | 同时写一份到 `artifacts/articles/` | 中 |

### Wiki 目录

- Wiki 路径：`docs/md/wiki/`
- Wiki 子目录：`artifacts/`、`concepts/`、`products/`、`patterns/`、`comparisons/`、`entities/`、`summaries/`、`synthesis/`、`sources/`、`journal/`、`images/`、`images/`（文章配图）
- **索引页维护**：每个分类（vibe-coding、agentic-engineer、出海建站等）需要在 `index.md` 的分类索引中登记，sidebar 自动生成但 index 索引需手动更新

---

## 日记记录 (Journal Diary)

用于记录用户的随思、感悟、语录等非结构化内容。触发词：「记录日记」、「记一下」、「写个日记」、「随手记」。

### 文件位置

- 目录：`docs/md/wiki/journal/`
- 文件名：`YYYY-MM-DD.md`（按日期分文件）

### 内容组织

按**内容主题**划分章节/条目，追加到当天的文件里。同一日期的多条记录放在同一个文件的不同章节。

### 格式

```markdown
## HH:MM 主题标签

内容...

*—— 来源*
```

### index.md 索引维护

`index.md` 是日记索引，**只登记不写内容**。每次新建/更新日记文件后，在 `index.md` 顶部追加索引条目：

```markdown
## YYYY-MM-DD

- [HH:MM] 主题标签 — 一句话摘要
- [HH:MM] 主题标签 — 一句话摘要
```

index.md 保持按日期倒序排列（最新日期在前）。

### 操作流程

1. 用户说"记录日记" → 记录内容到 `docs/md/wiki/journal/YYYY-MM-DD.md`
2. 更新 `index.md` 的索引条目

---

## TODO 待办列表

用于记录待爬取的公众号内容链接，与「稍后读」同级。文件位置：`TODO.md`。

**格式**：

```markdown
| 日期 | 链接 | 状态 |
|------|------|------|
| YYYY-MM-DD | https://... | pending |
```

**流程**：
1. 记录链接，状态设为 `pending`
2. 执行采集（`/wiki-ingest-article`）
3. 完成后更新状态为 `done`，移至「已完成」区块
- 一个页面 = 一个知识实体（概念、实体、摘要）
- 文件命名：小写、中划线分隔（如 `claude-code-setup.md`）
- 交叉引用：`[[pages/concept-name]]` Obsidian 兼容双括号格式
- `index.md`：每次 ingest 更新，按分类组织
- `log.md`：只追加、chronological 条目，条目以 `## [YYYY-MM-DD]` 开头
- `brainstorming/`：与 AI 对话的探索记录（chronological 条目）
- `artifacts/`、`concepts/`、`products/`、`patterns/`、`comparisons/`、`entities/`、`summaries/`、`synthesis/`、`sources/`、`images/`
