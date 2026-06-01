---
title: "Wiki Ingest Article (vast)"
date: "2026-06-01"
source: "skill"
---

# Wiki Ingest Article

将微信公众号文章一键采集归档到本知识库（`docs/md/wiki/sources/`）。

---

## 使用方法

```bash
/vast-wiki-ingest-article
```

交互式输入 URL，或直接粘贴：

```
https://mp.weixin.qq.com/s/xxxxxxxx
```

---

## 执行流程

### Step 1：抓取正文（两步走）

**第一步**：`fetch_weixin.py` 抓 Markdown 正文（含远程图片 URL）

```bash
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL" > /tmp/article.md
```

**第二步**：`download-images.py` 下载图片（Referer 穿越防盗链）

```bash
python3 .claude/skills/markdown-proxy/scripts/download-images.py /tmp/article.md --prefix "images/{slug}/" --keep-original
```

> 铁律：两步必须连续。漏掉第二步图片就白抓了。

### Step 2：精读摘要 + 重写

不要直接提交原始 Markdown。精读原文后重写，写入：

```
docs/md/wiki/sources/{article-slug}.md
```

图片路径格式（相对于 sources/）：

```
../images/{article-slug}/001.jpg
../images/{article-slug}/002.png
```

### Step 3：写 frontmatter

```yaml
---
title: "文章标题"
date: "YYYY-MM-DD"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/..."
---

# 文章标题

> 核心一句话摘要

<!-- more -->

## 精读正文

...
```

### Step 4：更新 log.md

追加到 `docs/md/wiki/log.md`：

```markdown
## [YYYY-MM-DD] ingest: 文章关键词

- 归档《文章标题》公众号长文至 sources/{article-slug}.md
- 下载 N 张配图至 images/{article-slug}/
- 内容摘要：……（一句话）
```

### Step 5：Git 提交

```bash
git add -A && git commit -m "prompt(wiki): 归档《文章标题》含N图"
git pull --rebase && git push
```

---

## 快速参考

| 操作 | 命令 |
|------|------|
| 抓正文 | `python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL" > /tmp/article.md` |
| 下载图片 | `python3 .claude/skills/markdown-proxy/scripts/download-images.py /tmp/article.md --prefix "images/{slug}/" --keep-original` |
| 提交 | `git add -A && git commit -m "prompt(wiki): 归档《标题》含N图" && git pull --rebase && git push` |

---

## 文件结构

```
docs/md/wiki/
├── sources/
│   └── {article-slug}.md    ← 文章归档位置
├── images/
│   └── {article-slug}/       ← 图片目录
│       ├── 001.jpg
│       └── 002.png
├── index.md                  ← 分类索引（手动更新）
└── log.md                    ← ingest 记录（只追加）
```

---

## 命名规范

- 英文小写、中划线分隔
- 来源 URL 提取主题词：`https://mp.weixin.qq.com/s/ai-local-brain` → `ai-local-brain`

---

## 注意

- frontmatter `title` 必填，缺失阻断 pre-commit
- 图片必须本地化，不允许热链
- 原始来源不可变——LLM 只读不改，只在 sources/ 归档摘要