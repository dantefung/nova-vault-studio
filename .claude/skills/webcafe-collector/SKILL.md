---
name: webcafe-collector
description: "采集 web.cafe（new.web.cafe）文章到知识库。触发词：采集 web.cafe、webcafe 文章、哥飞教程、web.cafe 入库。支持专栏文章和帖子，需登录 cookie。自动完成：cookie 设置 → Playwright 抓取 → 图片下载 → 创建档案。"
---

# Web.cafe Collector

采集 **web.cafe**（new.web.cafe）平台文章到本知识库。

---

## 前置条件

### 1. 获取 Cookie

web.cafe 是付费内容平台，需要登录 cookie 才能访问文章。

**获取方式：**
1. 在浏览器中登录 https://new.web.cafe
2. 打开 DevTools → Application → Cookies
3. 复制以下 cookie 值：

```
__Secure-authjs.session-token=eyJhbGciOi...
__Host-authjs.csrf-token=...
_pv_id=...
```

### 2. 设置环境变量

将 cookie 保存到环境变量或直接写入脚本：

```bash
export WEBCAFE_SESSION_TOKEN="eyJhbGciOi..."
export WEBCAFE_CSRF_TOKEN="..."
```

---

## 平台路由表

| URL 特征 | 平台 | 处理方式 |
|----------|------|----------|
| `new.web.cafe/topic/{uid}` | web.cafe 帖子 | Playwright + cookie |
| `new.web.cafe/tutorial/{column_uid}/{article_uid}` | web.cafe 专栏文章 | 重定向到 `/topic/{article_uid}` |

> **重要**：web.cafe 专栏文章的实际内容 URL 是 `/topic/{article_uid}`，不是 `/tutorial/...`

---

## 执行流程

### 步骤 1：设置 Cookie 并抓取文章

```python
from playwright.sync_api import sync_playwright
import time, json, re

COOKIES = [
    {"name": "_pv_id", "value": "YOUR_PV_ID", "domain": ".web.cafe", "path": "/"},
    {"name": "__Host-authjs.csrf-token", "value": "YOUR_CSRF_TOKEN", "domain": "new.web.cafe", "path": "/"},
    {"name": "__Secure-authjs.session-token", "value": "YOUR_SESSION_TOKEN", "domain": "new.web.cafe", "path": "/"},
]

def fetch_article(article_uid):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        context = browser.new_context()
        cdp = context.new_cdp_session(page=context.pages[0] if context.pages else context.new_page())
        
        # 设置 cookie
        for c in COOKIES:
            cdp.send("Network.setCookie", {
                "name": c["name"], 
                "value": c["value"], 
                "domain": c["domain"], 
                "path": c["path"], 
                "secure": True
            })
        
        page = context.new_page()
        url = f"https://new.web.cafe/topic/{article_uid}"
        page.goto(url, wait_until='networkidle', timeout=30000)
        time.sleep(3)
        
        # 提取标题和内容
        h1 = page.query_selector('h1')
        title = h1.inner_text() if h1 else 'untitled'
        
        body = page.query_selector('body').inner_text()
        # 从标题位置开始截取内容
        title_idx = body.find(title)
        if title_idx >= 0:
            content = body[title_idx + len(title):]
            # 去掉开头的元数据（收藏、作者、日期等）
            lines = content.split('\n')
            start = 0
            for i, line in enumerate(lines):
                line = line.strip()
                if len(line) > 20 and not line.startswith('收藏') and not line.startswith('哥飞') and '2024-' not in line and '2025-' not in line:
                    start = i
                    break
            content = '\n'.join(lines[start:])
        
        browser.close()
        return title, content
```

### 步骤 2：批量抓取（带间隔）

```python
articles = [
    ("article_uid_1", "文章标题1"),
    ("article_uid_2", "文章标题2"),
    # ...
]

results = []
for uid, title in articles:
    print(f"Fetching: {title} ({uid})")
    try:
        actual_title, content = fetch_article(uid)
        results.append({"uid": uid, "title": actual_title, "content": content, "success": True})
        print(f"  ✅ {len(content)} chars")
    except Exception as e:
        results.append({"uid": uid, "title": title, "content": "", "success": False})
        print(f"  ❌ {e}")
    time.sleep(3)  # 间隔 3 秒，避免频率限制
```

### 步骤 3：下载图片

web.cafe 文章中的图片通常需要从页面中提取：

```python
def download_images(page, article_uid, output_dir):
    """从页面中提取并下载图片"""
    images = page.query_selector_all('img')
    downloaded = []
    
    for i, img in enumerate(images):
        src = img.get_attribute('src')
        if not src or 'avatar' in src or 'icon' in src:
            continue
        
        # 下载图片
        ext = 'jpg'
        if '.png' in src: ext = 'png'
        elif '.webp' in src: ext = 'webp'
        
        filename = f"{article_uid}_{i:03d}.{ext}"
        filepath = f"{output_dir}/{filename}"
        
        # 使用 curl 下载
        import subprocess
        subprocess.run(['curl', '-sL', '-o', filepath, src], timeout=15)
        downloaded.append(filename)
    
    return downloaded
```

### 步骤 4：创建档案文件

```python
def create_archive(article, output_dir, images):
    """创建 markdown 档案文件"""
    uid = article["uid"]
    title = article["title"]
    content = article["content"]
    
    md_content = f"""---
title: "{title}"
date: "YYYY-MM-DD"
source: "web.cafe"
author: "哥飞"
url: "https://new.web.cafe/topic/{uid}"
---

# {title}

> 来源：[web.cafe 帖子](https://new.web.cafe/topic/{uid})
> 作者：哥飞

{content}
"""
    
    filepath = f"{output_dir}/{uid}.md"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    return filepath
```

### 步骤 5：更新索引和日志

```markdown
## [YYYY-MM-DD] ingest: web.cafe 文章

- 采集 web.cafe 专栏「XXX」N 篇文章
- 归档至 columns/indie-hub/seo/xxx/
- 下载 N 张配图
- 文章列表：...
```

---

## 目录结构

```
docs/md/columns/indie-hub/seo/
├── webcafe-advanced/
│   ├── index.md                    ← 专栏索引
│   ├── article-slug-1.md           ← 文章档案
│   ├── article-slug-2.md
│   └── images/
│       ├── article-uid_001.jpg
│       └── article-uid_002.png
```

---

## 文件命名规范

- 英文小写、中划线分隔
- 从文章标题提取关键词
- 示例：`seo-3words-annotation`、`tool-creation-full-process`

---

## Frontmatter 模板

```yaml
---
title: "文章标题"
date: "YYYY-MM-DD"
source: "web.cafe"
author: "哥飞"
url: "https://new.web.cafe/topic/{article_uid}"
---
```

---

## 注意事项

1. **Cookie 有效期**：session token 通常 7-30 天过期，需定期更新
2. **频率限制**：每次请求间隔 3-5 秒，避免被封
3. **付费内容**：只有登录用户才能查看文章正文
4. **URL 模式**：使用 `/topic/{article_uid}` 而非 `/tutorial/...`
5. **图片下载**：图片可能需要 Referer 头，使用 curl 时加上 `--referer`
6. **Vue 模板**：文章中的 `<xxx>` 标签需要用反引号包裹，避免 Vue 解析错误

---

## 快速参考

| 操作 | 命令 |
|------|------|
| 抓取单篇文章 | `fetch_article("article_uid")` |
| 批量抓取 | 循环 + `time.sleep(3)` |
| 下载图片 | `curl -sL -o img.jpg "URL"` |
| 创建档案 | 写入 markdown + frontmatter |

---

## 故障排查

### 问题：文章内容为空

**原因**：cookie 过期或 URL 模式错误

**解决**：
1. 检查 cookie 是否有效（在浏览器中测试）
2. 使用 `/topic/{article_uid}` 而非 `/tutorial/...`
3. 增加等待时间（`time.sleep(5)`）

### 问题：图片下载失败

**原因**：图片 URL 需要 Referer 头

**解决**：
```bash
curl -sL -o img.jpg --referer "https://new.web.cafe/" "IMAGE_URL"
```

### 问题：Vue 模板解析错误

**原因**：文章中的 `<xxx>` 标签被 Vue 解析

**解决**：用反引号包裹 `<xxx>` → `\`<xxx>\``
