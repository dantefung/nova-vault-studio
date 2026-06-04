---
title: "AI Agent 操作规范"
---

# Agent 操作规范 (Nova Vault Studio)

> VitePress 文档站点，没有传统工程工具链（无 lint/test/TS），内容即代码。

---

## 项目本质

- 这是一个 **纯内容站点**，不要运行 `npm test`/`npm run lint` — 这些命令不存在
- 所有 `.md` 文件放在 `docs/md/` 下，侧边栏和导航由文件系统扫描自动生成

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
# 第一步：抓正文（含远程图片 URL）
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "WEIXIN_URL" > /tmp/temp.md

# 第二步：下载图片到本地（必须紧跟，带 Referer 穿越防盗链）
python3 .claude/skills/markdown-proxy/scripts/download-images.py -i /tmp/temp.md -o /tmp/temp.md
```

> **铁律**：markdown-proxy SKILL.md 已更新为强制两步流程。Agent 采集公众号时自动执行。手动调 `fetch_weixin.py` 必须补调 `download-images.py`。

### 公众号采集后续处理

**1. 移动图片到目标目录**

```bash
cp -r /tmp/images/{article}/ docs/md/{分类}/{文章名}/images/
```

> 注意：`download-images.py` 写入的路径前缀默认是 `./images/article/`，需手动修正为正确目录名。可用 sed 批量替换。

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
- Wiki 子目录：`artifacts/`、`concepts/`、`products/`、`patterns/`、`comparisons/`、`entities/`、`summaries/`、`synthesis/`、`sources/`、`journal/`、`images/`
- 一个页面 = 一个知识实体（概念、实体、摘要）
- 文件命名：小写、中划线分隔（如 `claude-code-setup.md`）
- 交叉引用：`[[pages/concept-name]]` Obsidian 兼容双括号格式
- `index.md`：每次 ingest 更新，按分类组织
- `log.md`：只追加、chronological 条目，条目以 `## [YYYY-MM-DD]` 开头
- `brainstorming/`：与 AI 对话的探索记录（chronological 条目）
- `artifacts/`、`concepts/`、`products/`、`patterns/`、`comparisons/`、`entities/`、`summaries/`、`synthesis/`、`sources/`、`images/`
