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
- **每次完成任务都要主动询问用户是否要提交并推送**

---

## 目录结构总览

```
docs/md/
├── guide/           # 指南文档（AI、Claude Code、CS、开发、终端、OS 等）
│   ├── ai/          # AI 编程资源、Skills、Vibe Writing
│   ├── claude-code/ # Claude Code 指南
│   ├── openclaw/    # OpenClaw 指南
│   ├── terminal/    # 终端工具指南
│   ├── cs/          # CS 基础
│   ├── os/          # 操作系统
│   ├── dev/         # 开发工具
│   ├── career/      # 职业发展
│   ├── business/    # 商业指南
│   ├── research/    # 研究方法
│   └── vm/          # 虚拟机
├── columns/         # 深度专栏（24 个）
│   ├── indie-hub/   # 独立开发者出海
│   │   └── seo/     # SEO 建站（22 个子分类）
│   ├── agentic-engineer/ # AI Agent 工程
│   ├── ai-agent/    # AI Agent 教程
│   ├── harness-engineering/ # Harness 工程
│   ├── vibe-coding/ # Vibe Coding
│   ├── vibe-coding-and-design/ # Vibe Coding + 设计
│   ├── openclaw/    # OpenClaw 专栏
│   ├── opc/         # OPC 专栏
│   ├── gstack-skills/ # GStack Skills
│   ├── superpowers-skills/ # Superpowers Skills
│   ├── mattpocock-skills/ # Matt Pocock Skills
│   ├── get-shit-done-skills/ # GSD Skills
│   ├── prompt-engineering-book/ # 提示词工程
│   ├── content-engineering/ # 内容工程
│   ├── cognition/   # 认知科学
│   ├── drawing/     # 绘图
│   ├── diary/       # 日记专栏
│   ├── investment/  # 投资
│   ├── java-best-practices/ # Java 最佳实践
│   ├── lenny-newsletter/ # Lenny  Newsletter
│   ├── paws/        # PAWS
│   ├── qwenpaw/     # QwenPaw
│   ├── recruitment/ # 招聘
│   └── social-media/ # 社交媒体
├── wiki/            # LLM Wiki 知识库
│   ├── sources/     # 原始文章（verbatim，唯读）
│   ├── summaries/   # 精读摘要
│   ├── concepts/    # 概念页
│   ├── products/    # 产品页
│   ├── patterns/    # 模式页
│   ├── comparisons/ # 对比页
│   ├── entities/    # 实体页
│   ├── journal/     # 日记
│   ├── read-later/  # 稍后读
│   ├── 商业分析/    # 商业分析
│   └── images/      # 配图
├── books/           # 专题书籍（16 类，PDF 内嵌预览）
│   ├── ai-software/ # AI 软件
│   ├── claude-code-src/ # Claude Code 源码
│   ├── DDIA/        # 数据密集型应用
│   ├── harness/     # Harness
│   ├── hermes/      # Hermes
│   ├── k8s/         # Kubernetes
│   ├── linux-network/ # Linux 网络
│   ├── openclaw/    # OpenClaw
│   ├── software-engineering/ # 软件工程
│   ├── social-media/ # 社交媒体
│   ├── spring/      # Spring
│   ├── transformer-embedding/ # Transformer
│   ├── visual-systems/ # 视觉系统
│   ├── zettelkasten/ # 卡片笔记
│   └── misc/        # 其他
├── slides/          # 横向翻页网页 PPT
├── tutorial/        # 教程区
│   ├── codex-practice/
│   ├── full-keyboard/
│   ├── tutorial-one/
│   └── tutorial-two/
├── agi/             # AGI 相关教程
│   ├── Anthropic-Academy/
│   └── claude-code-src/
├── business/        # 商业分析
│   ├── market-analysis/
│   ├── business-models/
│   ├── investment/
│   ├── ai-relay-station/
│   └── digital-products/
├── blog/            # 博客
│   ├── category/
│   ├── series/
│   └── archive/
├── sitelog/         # 站点自身文档
│   ├── architecture/
│   ├── features/
│   ├── development/
│   ├── dev-log/
│   ├── evolution/
│   └── reference/
├── prompts/         # 提示词
│   └── design/
└── assets/          # 静态资源
    └── diagram-icons/
```

---

## 🔍 路由表（关键字 → 路径）

### 指南类

| 关键字 | 目标路径 |
|--------|---------|
| AI 编程资源、AI 工具、Claude Skills | `guide/ai/ai-programming-resources.md` |
| Claude Code 资源、Claude 教程 | `guide/ai/claude-code-resources.md` |
| Claude Code 指南 | `guide/claude-code/` |
| OpenClaw 指南 | `guide/openclaw/` |
| 提示词工程、Prompt | `guide/ai/prompt-engineering/` |
| 结构化 Prompt 开发 | `guide/ai/structured-prompt-driven-development.md` |
| Vibe Coding 教程 | `guide/ai/vibe-coding-core-pitfalls.md` |
| AI 编程幻灯片 | `guide/ai/ai-programming-slides/` |
| 终端工具、命令行 | `guide/terminal/` |
| CS 基础、计算机科学 | `guide/cs/` |
| 操作系统、OS | `guide/os/` |
| 开发工具、Dev | `guide/dev/` |
| 职业发展、Career | `guide/career/` |
| 研究方法、Research | `guide/research/` |
| 虚拟机、VM | `guide/vm/` |
| 商业指南 | `guide/business/` |

### 专栏类

| 关键字 | 目标路径 |
|--------|---------|
| 独立开发者、出海、Indie Hub | `columns/indie-hub/` |
| SEO 建站、Google SEO、排名 | `columns/indie-hub/seo/` |
| 关键词分析、Keyword | `columns/indie-hub/seo/keyword-analysis/` |
| 域名、Domain | `columns/indie-hub/seo/domain/` |
| 落地页、Landing Page | `columns/indie-hub/seo/webcafe-landing-page/` |
| 需求挖掘 | `columns/indie-hub/seo/webcafe-demand/` |
| 外链、Backlink | `columns/indie-hub/seo/webcafe-seo-backlink/` |
| 上站、上线、Ship | `columns/indie-hub/seo/webcafe-ship/` |
| 工具站、Tool Site | `columns/indie-hub/seo/webcafe-tool-site/` |
| 新手入门、SEO 基础 | `columns/indie-hub/seo/webcafe-beginner/` |
| 进阶教程 | `columns/indie-hub/seo/webcafe-advanced/` |
| 社群复盘、社区动态 | `columns/indie-hub/seo/community-recap/` |
| Google Ads 广告 | `columns/indie-hub/seo/google-ads/` |
| 赚钱方法、套利、Money | `columns/indie-hub/money-methods/` |
| Dropshipping、一件代发 | `columns/indie-hub/dropshipping-resources/` |
| 独立 App、App 实战 | `columns/indie-hub/app-playbook/` |
| AI 产品、AI 工具 | `columns/indie-hub/ai-product/` |
| zlbigger 系列 | `columns/indie-hub/zlbigger/` |
| 出海实战、outsea | `columns/indie-hub/outsea-playbook/` |
| 跨境电商、AI 电商 | `columns/indie-hub/ai-cross-border-ecommerce-research/` |
| Agentic Engineer、Agent 工程 | `columns/agentic-engineer/` |
| 多 Agent 协作冲突 | `columns/agentic-engineer/multi-agent-collision/` |
| cc-connect 配置 | `columns/agentic-engineer/cc-connect/` |
| GStack、GSD | `columns/agentic-engineer/gstack/` |
| oh-my-claudecode | `columns/agentic-engineer/oh-my-claudecode/` |
| Agent 范式演进 | `columns/agentic-engineer/agent-paradigm-evolution/` |
| Ralph Loop | `columns/agentic-engineer/ralph-loop/` |
| Pensieve | `columns/agentic-engineer/pensieve/` |
| AI Agent 教程 | `columns/ai-agent/` |
| Harness 工程 | `columns/harness-engineering/` |
| Vibe Coding 工作流 | `columns/vibe-coding/` |
| Vibe Coding + 设计 | `columns/vibe-coding-and-design/` |
| OpenClaw 专栏 | `columns/openclaw/` |
| OPC 专栏 | `columns/opc/` |
| GStack Skills | `columns/gstack-skills/` |
| Superpowers Skills | `columns/superpowers-skills/` |
| Matt Pocock Skills | `columns/mattpocock-skills/` |
| GSD Skills | `columns/get-shit-done-skills/` |
| 提示词工程书 | `columns/prompt-engineering-book/` |
| 内容工程 | `columns/content-engineering/` |
| 认知科学 | `columns/cognition/` |
| 绘图、Drawing | `columns/drawing/` |
| 投资 | `columns/investment/` |
| Java 最佳实践 | `columns/java-best-practices/` |
| Lenny Newsletter | `columns/lenny-newsletter/` |
| 社交媒体 | `columns/social-media/` |
| QwenPaw | `columns/qwenpaw/` |
| 招聘 | `columns/recruitment/` |

### 知识库类

| 关键字 | 目标路径 |
|--------|---------|
| Wiki 知识库、LLM Wiki | `wiki/` |
| 原始文章、Sources | `wiki/sources/` |
| 摘要、Summaries | `wiki/summaries/` |
| 概念、Concepts | `wiki/concepts/` |
| 产品、Products | `wiki/products/` |
| 模式、Patterns | `wiki/patterns/` |
| 对比、Comparisons | `wiki/comparisons/` |
| 实体、Entities | `wiki/entities/` |
| 日记、Journal | `wiki/journal/` |
| 稍后读、Read Later | `wiki/read-later/` |
| 商业分析 | `wiki/商业分析/` |

### 书籍类

| 关键字 | 目标路径 |
|--------|---------|
| AI 软件书籍 | `books/ai-software/` |
| Claude Code 源码书 | `books/claude-code-src/` |
| DDIA、数据密集型 | `books/DDIA/` |
| Harness 书籍 | `books/harness/` |
| Hermes 书籍 | `books/hermes/` |
| Kubernetes、k8s | `books/k8s/` |
| Linux 网络 | `books/linux-network/` |
| OpenClaw 书籍 | `books/openclaw/` |
| 软件工程 | `books/software-engineering/` |
| 社交媒体 | `books/social-media/` |
| Spring | `books/spring/` |
| Transformer、Embedding | `books/transformer-embedding/` |
| 视觉系统 | `books/visual-systems/` |
| 卡片笔记、Zettelkasten | `books/zettelkasten/` |

### 其他

| 关键字 | 目标路径 |
|--------|---------|
| 网页 PPT、Slides | `slides/` |
| 教程、Tutorial | `tutorial/` |
| AGI 教程 | `agi/` |
| 商业分析（顶层） | `business/` |
| 博客、Blog | `blog/` |
| 站点日志、Sitelog | `sitelog/` |
| 提示词、Prompts | `prompts/` |

---

## 系统功能矩阵概览

### 内容板块（11 个顶层分类）

| 板块 | 用途 | 路径 |
|------|------|------|
| guide | 指南文档（AI、Claude Code、CS、开发、终端、OS 等） | `docs/md/guide/` |
| wiki | LLM Wiki 知识库（四层架构） | `docs/md/wiki/` |
| columns | 24 个深度专栏 | `docs/md/columns/` |
| books | 16 个书籍分类，支持 PDF 内嵌预览 | `docs/md/books/` |
| slides | 横向翻页网页 PPT 集合 | `docs/md/slides/` |
| tutorial | 教程区 | `docs/md/tutorial/` |
| agi | AGI 相关教程 | `docs/md/agi/` |
| business | 商业分析（市场、模式、投资） | `docs/md/business/` |
| blog | 博客 | `docs/md/blog/` |
| sitelog | 站点自身文档 | `docs/md/sitelog/` |
| prompts | 提示词集合 | `docs/md/prompts/` |

### Skills 能力

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

### Frontmatter 中 title 值不能嵌套双引号

YAML 中 `title: "..."` 的值内部不能再出现未转义的双引号 `"`，否则 YAML 解析器会报错，导致 VitePress 构建失败：

```yaml
# 错误 ❌ — 嵌套双引号
title: "Agent 的"上下文链接器"——如何管理能力"

# 正确 ✅ — 使用中文引号
title: "Agent 的「上下文链接器」——如何管理能力"

# 正确 ✅ — 使用单引号包裹
title: 'Agent 的"上下文链接器"——如何管理能力'
```

pre-commit hook 现在会验证 frontmatter 是否能被 YAML 正确解析，不合法则拒绝提交。

### 裸露 HTML 标签阻断提交

pre-commit hook 同时检查 `.md` 文件中是否有裸露的 HTML 标签（非代码块内）。Vue 编译器会把 `<tag>` 当作真实 HTML 解析，导致构建失败：

- **代码片段必须加反引号**：`<h1>`、`<head>`、`</body>` 等必须写成 `` `<h1>` ``、`` `<head>` ``、`` `</body>` ``
- **浏览器扩展污染**：`<readpronunciation-*>` 等注入标签会被 hook 拦截——用 `git checkout -- <file>` 回退

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

**3. 修复 YAML frontmatter 常见问题**

- URL 折行：`url: "https://..."` 必须在一行内，不能在 URL 中间换行
- 验证：`python3 .claude/hooks/check-frontmatter.py {file}`（无输出 = 通过）

**4. Commit 规范**

- commit message 用 `prompt:` 前缀，例：`prompt: 采集 xxx 文章`
- pre-commit hook 会检查 title 必填，缺则拒绝提交

### 大图片拖垮 Vercel 构建（OOM）

图片单个 >500KB 且大量堆积时，Vercel 构建会在「rendering pages」阶段 OOM（约 7 分钟超时失败）。**采集/归档图片后必须压缩**。

**规则**：
- 图片单个 >500KB 禁止直接提交
- pre-commit hook（`check-image-size.py`）会自动检查 staged 的 `.md` 引用图片和直接 staged 的图片文件，超限会阻断并给出压缩命令

**GIF 一律转 PNG**（sharp 提取首帧）：
```bash
node -e "const sharp=require('sharp'); \
  sharp('{图片}.gif',{animated:false}).png({compressionLevel:9,palette:true}) \
  .toFile('{图片}.png').then(()=>console.log('OK'))"
```
转换后必须：① 更新 `.md` 引用 `.gif`→`.png` ② 删除原 `.gif` 文件。

**PNG/JPG/WebP 压缩**（sharp，>500KB）：
```bash
node -e "const sharp=require('sharp'),fs=require('fs'); \
  sharp('{图片}').rotate().resize({width:1600,withoutEnlargement:true}) \
  .jpeg({quality:82,mozjpeg:true}).toFile('{图片}.tmp') \
  .then(()=>fs.renameSync('{图片}.tmp','{图片}'))"
```

**批量压缩**：项目根 `_sandbox/compress-images.js`（遍历 `docs/md/` 处理 >500KB 图片）。注意 PNG palette 转换可能变大，需降分辨率或换 JPEG 降质。

**⚠️ PNG 转 JPEG 后扩展名必须改**：用 sharp 把 `.png` 转成 JPEG 内容后，若文件名仍是 `.png`，虽然浏览器能渲染，但不符合规范。应 `mv x.png x.jpg` 并更新引用。未被引用的图片（孤立文件）可保留原名。

**⚠️ 项目是 ESM**：`package.json` 含 `"type": "module"`。写 node 脚本时 `.js` 会被当 ES module，`require` 会报错——用 `.cjs` 扩展名或 `import` 语法。

### `ignoreDeadLinks: true` — 死链接静默放过

构建时不会因为死链接报错。如果改动了文件路径或删除了页面，相关引用不会自动发现。

### 提交前检查图片引用是否存在

`.md` 文件中引用的图片必须与实际存在的文件匹配。格式错误（如引用 `.svg` 但实际是 `.png`）或文件名拼写错误会导致 VitePress 构建失败。

**检查方法**：
```bash
# 1. 搜索所有图片引用
rtk grep "images/" docs/md/

# 2. 检查引用中的文件名是否在对应目录存在
# 例如：引用 img_011.svg，但目录只有 img_011.png
rtk ls docs/md/{分类}/{文章}/images/{文章名}/
```

**常见问题**：
- 引用 `.svg` 但实际文件是 `.png` 或 `.jpg`
- 文件名拼写错误（如 `img_011` vs `img_0111`）
- 图片被删除但引用未清理

**处理方式**：将引用路径改为实际存在的文件名。

### Pre-commit Hook 配置

项目已配置 pre-commit hook，自动检查 staged 的 `.md` 文件：

- `check-frontmatter.py` — 验证 frontmatter title 必填
- `check-html-tags.py` — 检查裸露 HTML 标签
- `check-image-refs.py` — 验证图片引用是否存在
- `check-image-size.py` — 检查图片 >500KB（Vercel OOM 防护）

**首次配置（项目根目录执行）**：

```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
STAGED_MD_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.md$' | grep -v '^docs/public/')
STAGED_IMAGE_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(png|jpe?g|gif|webp)$')
[ -z "$STAGED_MD_FILES" ] && [ -z "$STAGED_IMAGE_FILES" ] && exit 0

for file in $STAGED_MD_FILES; do
    FULL_PATH="$PROJECT_ROOT/$file"
    python3 "$PROJECT_ROOT/.claude/hooks/check-frontmatter.py" "$FULL_PATH" || exit 1
    python3 "$PROJECT_ROOT/.claude/hooks/check-html-tags.py" "$FULL_PATH" || exit 1
    python3 "$PROJECT_ROOT/.claude/hooks/check-image-refs.py" "$FULL_PATH" || exit 1
done
for file in $STAGED_IMAGE_FILES; do
    FULL_PATH="$PROJECT_ROOT/$file"
    python3 "$PROJECT_ROOT/.claude/hooks/check-image-size.py" "$FULL_PATH" || exit 1
done
EOF
chmod +x .git/hooks/pre-commit
```

> **注意**：`.git/hooks/pre-commit` 是本地文件，不上传 git。每个开发者首次克隆项目后需要手动创建。

---

## 归档文章到专栏

1. 文件放到专栏目录（如 `docs/md/columns/agentic-engineer/`）
2. **手动更新专栏 `index.md` 的表格** — 侧边栏自动生成，但 index.md 的索引表不自动维护
3. YAML frontmatter 必须含 `title`, `date`, `source`, `url`

---

## 归档脱敏要求

归档文件时，检查并替换以下敏感信息：

- **Webhook URL**：飞书/企微机器人的 hook token 和 key
- **API Token / Secret Key**：Cloudflare 隧道 token、GitHub token、API key 等
- **ChatGPT 分享链接**：`chatgpt.com/share/` 链接可能泄露私人对话
- **云服务 Dashboard URL**：含 account ID 的链接（如 `dash.cloudflare.com/xxxxxxxx`）
- **服务器 IP / 域名**：如有生产环境敏感信息，用 `<SERVER_IP>` 替换
- **个人路径**：`/home/用户名` 等路径，用 `/home/<USER>` 替换

替换方式：用 `<PLACEHOLDER>` 占位符替代，如 `<WEBHOOK_TOKEN>`、`<API_KEY>` 等。

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

### 目标位置

```
docs/md/slides/ppt-{英文简称}/
├── index.html          ← 原始 HTML（verbatim）
├── index.md            ← VitePress 入口（必建）
└── images/             ← 引用的图片（如有）
    ├── slide-01.png
    └── slide-02.png
```

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

**轻量性质**：用户说"稍后读"= **只记链接**，**不要抓全文**，**不要**走 wiki-ingest 完整流程。

**文件**：`docs/md/wiki/read-later/index.md`——按平台分类追加一行，**绝不单独建文件**。

**格式**：

```markdown
| YYYY-MM-DD | https://... | **标题**：一句话摘要 + 关键洞察 + 交叉引用 |
```

**升级路径**：如果用户后续说「入库」「归档到仓库」「走完整流程」，再触发 `/wiki-ingest-article`——sources → summaries → concepts → index/log 更新。

### 四层结构

| 层级 | 目录 | 内容 | 是否可变 |
|------|------|------|----------|
| 原始层 | `sources/` | 原始原文（公众号文章、X/Twitter 帖子等），verbatim 不可修改 | 唯读 |
| 摘要层 | `summaries/` | 精读摘要（LLM 重写，含核心结论+关键证据+疑点+术语） | LLM 维护 |
| 概念层 | `concepts/` | 从摘要提炼的知识页，含定义+洞察+与其他概念交叉引用 | LLM 维护 |
| 产出层 | `artifacts/` | 你原创的完成品（已发布的文章、推文串、笔记） | 你维护 |

### 三条归档路径

| 路径 | 触发 | 目的地 | 重量 |
|------|------|--------|------|
| 稍后读 | "稍后读"/"先记下来" | `wiki/read-later/index.md` 追加一行 | ⚡ 极轻（只记链接） |
| 采集归档 | `/wiki-ingest-article` | `sources/` → `summaries/` → `concepts/` | 🔥 重（精读+配图+概念页） |
| 创作发布 | 写完发布到专栏时 | 同时写一份到 `artifacts/articles/` | 中 |

---

## 日记记录 (Journal Diary)

触发词：「记录日记」、「记一下」、「写个日记」、「随手记」。

- 目录：`docs/md/wiki/journal/`
- 文件名：`YYYY-MM-DD.md`
- 每条记录用 `## 主题` 分章节
- 更新 `index.md` 顶部索引（按日期倒序）

---

## TODO 待办列表

文件：`TODO.md`

格式：`| 日期 | 链接 | 描述 | 状态 |`

流程：记录 `pending` → 采集后标记 `done` → 移至「已完成」区块

---

## 临时记录

### Codex 实战课程仓库

路径：`codex-practice/`（相对于本仓库根目录）
GitHub：https://github.com/VastFuture/codex-practice