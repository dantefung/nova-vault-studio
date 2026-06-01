---
name: wiki-ingest-article
description: "将微信公众号文章采集归档到本知识库（docs/md/wiki/sources/）。触发词：采集文章、归档文章、ingest article、wiki ingest、文章入库。自动完成：正文抓取 → 图片下载本地化 → 精读摘要 → 写入 sources/ → 更新 log.md。"
---

# Wiki Ingest Article

将微信公众号文章一键采集归档到本知识库（`docs/md/wiki/sources/`）。

---

## 使用方法

```bash
/vast-wiki-ingest-article
```

或直接提供 URL：

```bash
/vast-wiki-ingest-article https://mp.weixin.qq.com/s/xxxxxxxx
```

---

## 执行步骤

### 步骤 1：获取文章 URL

支持两种输入方式：

1. **对话中粘贴 URL** — 直接粘贴 `https://mp.weixin.qq.com/s/...` 格式的微信公众号文章链接
2. **交互式输入** — 如果没有提供 URL，技能会提示输入

### 步骤 2：判断平台类型

| URL 特征 | 处理方式 |
|----------|----------|
| `mp.weixin.qq.com` | 使用 `scripts/fetch_weixin.py` 抓取 |
| 其他 | 使用 `r.jina.ai` 代理抓取 |

### 步骤 3：抓取正文（两步走）

**第一步**：抓取 Markdown 正文

```bash
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL" > /tmp/article.md
```

**第二步**：下载图片到本地

```bash
python3 .claude/skills/markdown-proxy/scripts/download-images.py /tmp/article.md --prefix "images/{article-slug}/" --keep-original
```

> **铁律**：两步必须连续执行。`fetch_weixin.py` 只抓正文和远程图片 URL，不下载图片到本地。

### 步骤 4：下载图片到 wiki 目录

若 `download-images.py` 因路径问题失败，手动下载：

```python
# 创建目录
mkdir -p docs/md/wiki/images/{article-slug}/

# 下载图片（Referer 穿越微信防盗链）
python3 -c "
import urllib.request, re

headers = {
    'Referer': 'https://mp.weixin.qq.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

with open('/tmp/article.md', 'r') as f:
    content = f.read()

urls = re.findall(r'https://mmbiz[^\s\)]+', content)
seen = set()
for i, url in enumerate(urls):
    if url in seen:
        continue
    seen.add(url)
    ext = 'jpg' if 'jpeg' in url else 'png'
    path = f'docs/md/wiki/images/{article-slug}/{i+1:03d}.{ext}'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            with open(path, 'wb') as f:
                f.write(resp.read())
    except Exception as e:
        print(f'  ❌ {path}: {e}')
"
```

### 步骤 5：精读摘要 + 重写

不要直接提交原始 Markdown。精读后重写，写入 `docs/md/wiki/sources/{article-slug}.md`。

重写要求：
- 用自己的话重构，保持核心观点不变
- 补充 `<!-- more -->` 截断点
- 保留所有图片的本地相对路径 `../images/{article-slug}/NNN.ext`
- 保留 yaml frontmatter（title、date、source、url）

frontmatter 模板：

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

### 步骤 6：更新 log.md

追加 ingest 记录到 `docs/md/wiki/log.md`：

```markdown
## [YYYY-MM-DD] ingest: 文章关键词

- 归档《文章标题》公众号长文至 sources/{article-slug}.md
- 下载 N 张配图至 images/{article-slug}/
- 内容摘要：……（一句话）
```

---

## 文件命名规范

- 英文小写、中划线分隔
- 示例：`ai-local-brain`、`claude-code-setup`、`linux-file-descriptor`
- 来源 URL 中提取关键主题词

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
├── index.md              ← 分类索引（不自动维护，手动更新）
└── log.md                ← ingest 记录（只追加）
```

---

## 完整示例

```bash
# 抓取
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "https://mp.weixin.qq.com/s/xxxxx" > /tmp/article.md

# 下载图片
python3 .claude/skills/markdown-proxy/scripts/download-images.py /tmp/article.md --prefix "images/ai-local-brain/" --keep-original

# 精读重写后写入 sources/
# 更新 log.md
git add -A && git commit -m "prompt(wiki): 归档《文章标题》含N图"
```

---

## 快速入口

```bash
# 传统模式（手动两步）
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL" > /tmp/article.md
python3 .claude/skills/markdown-proxy/scripts/download-images.py /tmp/article.md --prefix "images/{slug}/" --keep-original
```

---

## 注意

- 图片必须是本地路径，不允许热链接
- `../images/` 是相对于 `sources/` 目录的正确路径格式
- frontmatter 中 `title` 是必填的，缺失会阻断 pre-commit hook