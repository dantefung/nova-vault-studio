---
name: wiki-ingest-article
description: "将任意平台文章采集归档到本知识库（docs/md/wiki/sources/）。触发词：采集文章、归档文章、ingest article、wiki ingest、文章入库。支持的平台：微信公众号、Twitter/X、YouTube、博客、知乎等。自动完成：平台判断 → 抓取 → 图片本地化 → 精读摘要 → 写入 sources/ → 更新 log.md。"
---

# Wiki Ingest Article

将**任意平台文章**一键采集归档到本知识库（`docs/md/wiki/sources/`）。

---

## 使用方法

```bash
/vast-wiki-ingest-article
```

或直接提供 URL：

```bash
/vast-wiki-ingest-article https://example.com/article
```

---

## 平台路由表

收到 URL 后，先判断类型，走不同通道：

| URL 特征 | 平台 | 处理方式 |
|----------|------|----------|
| `mp.weixin.qq.com` | 微信公众号 | `fetch_weixin.py` + `download-images.py` |
| `x.com` / `twitter.com` | X / Twitter | `r.jina.ai` + `baoyu-danger-x-to-markdown` |
| `youtube.com` / `youtu.be` | YouTube | `baoyu-youtube-transcript` |
| `zhihu.com` | 知乎 | `r.jina.ai` |
| `blog.google` / `developer.chrome.com` | Google 博客/开发者 | `r.jina.ai` |
| 其他所有 URL | 通用博客/文章 | `r.jina.ai` |

> 优先使用平台专用工具（内容更完整），无专用工具时回退到 `r.jina.ai` 代理。

---

## 执行流程

### 步骤 1：平台判断

从 URL 自动判断平台类型，输出类似：

```
[路由] 微信公众号文章 → 使用 fetch_weixin.py
[路由] 博客文章 → 使用 r.jina.ai
```

### 步骤 2：抓取正文

**微信公众号（两步走）：**

```bash
# 第一步：抓正文（含远程图片 URL，不下载）
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL" > /tmp/article.md

# 第二步：下载图片到本地（必须紧跟）
python3 .claude/skills/markdown-proxy/scripts/download-images.py /tmp/article.md --prefix "images/{slug}/" --keep-original
```

> **铁律**：微信公众号必须两步走。漏掉第二步图片就白抓了。

**通用文章（r.jina.ai）：**

```bash
curl -s "https://r.jina.ai/URL" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content',''))" > /tmp/article.md
```

**X / Twitter：**

```bash
python3 .agents/skills/baoyu-danger-x-to-markdown/scrape.sh "URL" > /tmp/article.md
```

**YouTube 字幕：**

```bash
python3 .agents/skills/baoyu-youtube-transcript/transcribe.sh "URL" > /tmp/article.md
```

### 步骤 3：下载图片到 wiki 目录

若 `download-images.py` 因路径问题失败，手动下载：

```bash
mkdir -p docs/md/wiki/images/{slug}/

python3 -c "
import urllib.request, re

headers = {
    'Referer': 'https://mp.weixin.qq.com/',
    'User-Agent': 'Mozilla/5.0'
}

with open('/tmp/article.md', 'r') as f:
    content = f.read()

# 收集所有图片 URL（含 mmbiz 和通用图片）
urls = re.findall(r'https?://[^\s\)\"\'\]\.+(?:mmbiz|jpeg|jpg|png|webp|gif)[^\s\)\"\'\]*', content)
seen = set()
for i, url in enumerate(urls):
    if url in seen:
        continue
    seen.add(url)
    ext = 'jpg'
    if '.png' in url: ext = 'png'
    elif '.webp' in url: ext = 'webp'
    path = f'docs/md/wiki/images/{slug}/{i+1:03d}.{ext}'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            with open(path, 'wb') as f:
                f.write(resp.read())
        print(f'  ✅ {path}')
    except Exception as e:
        print(f'  ❌ {path}: {e}')
"
```

### 步骤 4：精读摘要 + 重写

**不要直接提交原始 Markdown。** 精读原文后重写，写入：

```
docs/md/wiki/sources/{article-slug}.md
```

图片路径格式（相对于 sources/）：

```
../images/{article-slug}/001.jpg
```

frontmatter 模板：

```yaml
---
title: "文章标题"
date: "YYYY-MM-DD"
source: "微信公众号"        # 或：X/Twitter、YouTube、博客、知乎等
url: "https://..."
---

# 文章标题

> 核心一句话摘要

<!-- more -->

## 精读正文

...
```

### 步骤 5：更新 log.md

追加到 `docs/md/wiki/log.md`：

```markdown
## [YYYY-MM-DD] ingest: 文章关键词

- 归档《文章标题》{平台}至 sources/{slug}.md
- 下载 N 张配图至 images/{slug}/
- 内容摘要：……（一句话）
```

---

## 文件命名规范

- 英文小写、中划线分隔
- 示例：`ai-local-brain`、`claude-code-setup`、`linux-file-descriptor`
- 从 URL 或标题提取关键主题词

---

## 目录结构

```
docs/md/wiki/
├── sources/              ← 文章归档位置
│   └── {article-slug}.md
├── images/              ← 图片目录
│   └── {article-slug}/
│       ├── 001.jpg
│       └── 002.png
├── index.md              ← 分类索引（不自动维护）
└── log.md                ← ingest 记录（只追加）
```

---

## 快速参考

| 平台 | 抓取命令 | 图片下载 |
|------|----------|----------|
| 微信公众号 | `fetch_weixin.py`（两步走） | `download-images.py` |
| 通用博客 | `r.jina.ai` | 手动下载 |
| X/Twitter | `baoyu-danger-x-to-markdown` | N/A |
| YouTube | `baoyu-youtube-transcript` | N/A（字幕文章无图） |

---

## 注意

- frontmatter `title` 是必填的，缺失会阻断 pre-commit hook
- 图片必须本地路径，不允许热链
- 原始来源不可变——LLM 只读不改，只在 sources/ 归档摘要
- `date` 使用当天日期 `YYYY-MM-DD`
- source 填写平台名称：微信公众号、X/Twitter、YouTube、博客、知乎等