---
title: "Wiki Ingest Article (vast)"
date: "2026-06-01"
source: "skill"
url: ""
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

| URL 特征 | 平台 | 处理方式 |
|----------|------|----------|
| `mp.weixin.qq.com` | 微信公众号 | `fetch_weixin.py` + `download-images.py`（两步走） |
| `x.com` / `twitter.com` | X / Twitter | `r.jina.ai` 或 `baoyu-danger-x-to-markdown` |
| `youtube.com` / `youtu.be` | YouTube | `baoyu-youtube-transcript` |
| `zhihu.com` | 知乎 | `r.jina.ai` |
| 其他所有 URL | 通用 | `r.jina.ai` |

---

## 执行流程

### Step 1：平台判断 + 抓取

**微信公众号（必须两步走）：**

```bash
python3 .claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL" > /tmp/article.md
python3 .claude/skills/markdown-proxy/scripts/download-images.py /tmp/article.md --prefix "images/{slug}/" --keep-original
```

**通用文章：**

```bash
curl -s "https://r.jina.ai/URL" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content',''))" > /tmp/article.md
```

**X/Twitter：**

```bash
python3 .agents/skills/baoyu-danger-x-to-markdown/scrape.sh "URL" > /tmp/article.md
```

### Step 2：下载图片

```bash
mkdir -p docs/md/wiki/images/{slug}/
python3 -c "
import urllib.request, re
headers = {'Referer': 'https://mp.weixin.qq.com/', 'User-Agent': 'Mozilla/5.0'}
with open('/tmp/article.md', 'r') as f:
    content = f.read()
urls = re.findall(r'https?://[^\s\)\"\'\]]+(?:mmbiz|jpeg|jpg|png|webp|gif)[^\s\)\"\'\]*', content)
seen = set()
for i, url in enumerate(urls):
    if url in seen: continue
    seen.add(url)
    ext = 'jpg'
    if '.png' in url: ext = 'png'
    elif '.webp' in url: ext = 'webp'
    path = f'docs/md/wiki/images/{slug}/{i+1:03d}.{ext}'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            with open(path, 'wb') as f: f.write(resp.read())
        print(f'  ✅ {path}')
    except Exception as e:
        print(f'  ❌ {path}: {e}')
"
```

### Step 3：精读重写 → sources/

```yaml
---
title: "文章标题"
date: "YYYY-MM-DD"
source: "平台名称"
url: "https://..."
---

# 文章标题

> 核心一句话摘要

<!-- more -->

## 精读正文

...
```

图片路径：`../images/{slug}/001.jpg`

### Step 4：更新 log.md

```markdown
## [YYYY-MM-DD] ingest: 关键词

- 归档《文章标题》{平台}至 sources/{slug}.md
- 下载 N 张配图至 images/{slug}/
- 内容摘要：……
```

### Step 5：Git 提交

```bash
git add -A && git commit -m "prompt(wiki): 归档《标题》含N图" && git pull --rebase && git push
```

---

## 快速参考

| 平台 | 抓取 | 图片 |
|------|------|------|
| 微信公众号 | `fetch_weixin.py`（两步） | `download-images.py` |
| 通用博客 | `r.jina.ai` | 手动 |
| X/Twitter | `r.jina.ai` | 无 |

---

## 目录结构

```
docs/md/wiki/
├── sources/{slug}.md      ← 文章归档
├── images/{slug}/         ← 图片
│   ├── 001.jpg
│   └── 002.png
├── index.md              ← 分类索引（手动）
└── log.md                ← ingest 记录（只追加）
```

---

## 自动触发 Wiki-Ingest（Step 6）

写入 `sources/{slug}.md` 并更新 `log.md` 后，立即触发 `/wiki-ingest` 将文章提炼为 Wiki 知识页。

### 执行方式

```
/wiki-ingest
```

或通过 skill 工具加载 `wiki-ingest`（在 nova-vault-studio 项目中）。

### Wiki-Ingest 应完成的工作

1. **读取** `docs/md/wiki/sources/{slug}.md`
2. **提炼**出 Wiki 概念页（如 `concepts/{slug}.md`），包含：
   - 一句话核心定义
   - 关键洞察（3-5 条）
   - 原文核心章节摘要
   - 交叉引用到其他 wiki 页面
3. **写入** `docs/md/wiki/concepts/{slug}.md`（或 `summaries/`/`entities/`/`patterns/` 之一）
4. **更新** `docs/md/wiki/index.md` 分类索引

> 纯来源归档（公众号原文镜像）可跳过。含概念/工具/框架的文章必须触发。

### 流程串联

```
URL → 步骤1-5（抓取/图片/精写/sources/）
      ↓
   步骤6：/wiki-ingest（提炼知识页 → concepts/）
      ↓
   index.md 更新
      ↓
   git commit + push
```

---

## 注意

- `title` 必填，缺失阻断 pre-commit
- 图片必须本地化，禁止热链
- 来源不可变，sources/ 只归档摘要
- date 用当天日期，source 填平台名