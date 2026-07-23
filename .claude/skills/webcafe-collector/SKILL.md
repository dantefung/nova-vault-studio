---
name: webcafe-collector
description: "采集 web.cafe（new.web.cafe）文章到知识库。触发词：采集 web.cafe、webcafe 文章、哥飞教程、web.cafe 入库。支持专栏文章和帖子。自动完成：opencli 抓取 → 图片下载 → 创建档案。"
---

# Web.cafe Collector

采集 **web.cafe**（new.web.cafe）平台文章到本知识库。

---

## 前置条件

### 1. opencli 安装与浏览器桥接

```bash
# 安装 opencli
npm install -g opencli

# 安装 Browser Bridge 扩展（Chrome）
# 打开 chrome://extensions → 加载扩展 → 选择 extension/ 目录

# 验证连接
opencli doctor
```

输出 `Everything looks good!` 即可。

### 2. Chrome 登录 web.cafe

1. 打开 Chrome，访问 https://new.web.cafe
2. 确保已登录（右上角显示用户名，而非"登 录"）
3. 登录一次即可，opencli 会复用 Chrome 的登录 session

> **关键**：不需要手动提取 cookie，opencli 直接复用 Chrome 已登录的 session。

---

## 核心命令

```bash
opencli web read --url "https://new.web.cafe/tutorial/detail/{UID}"
```

**自动完成：**
- 抓取文章正文（含 frontmatter）
- 下载文章内所有图片到 `images/` 目录
- 输出 Markdown 文件到 `web-articles/` 目录

---

## 执行流程

### 步骤 1：发现文章 UID

从专栏页获取文章列表：

```bash
opencli web read --url "https://new.web.cafe/tutorial/{COLUMN_UID}"
```

或用 Chrome DevTools MCP 在已打开的专栏页上提取：

```
take_snapshot → 找到所有 /tutorial/detail/{UID} 链接
```

### 步骤 2：逐篇抓取

```bash
# 单篇
opencli web read --url "https://new.web.cafe/tutorial/detail/{UID}"

# 批量（间隔 15 秒，避免 Cloudflare）
for uid in UID1 UID2 UID3; do
  opencli web read --url "https://new.web.cafe/tutorial/detail/$uid"
  sleep 15
done
```

### 步骤 3：归档到知识库

将 `web-articles/` 中的文件移动到目标目录：

```bash
# 目标目录
DST="docs/md/columns/indie-hub/seo/{专栏名}"

# 移动文章（重命名为英文 kebab-case）
mv "web-articles/{中文标题}/{中文标题}.md" "$DST/{english-slug}.md"

# 移动图片（重命名以匹配文章）
mv "web-articles/{中文标题}/images/" "$DST/images/{english-slug}_"
```

更新图片路径（sed 批量替换）：

```bash
sed -i "s|images/{中文标题}/|images/{english-slug}_|g" "$DST/{english-slug}.md"
```

### 步骤 4：更新索引

更新专栏 `index.md` 的文章列表。

---

## Cloudflare 应对策略

web.cafe 使用 Cloudflare 保护，连续请求会触发验证。

| 情况 | 症状 | 解决 |
|------|------|------|
| 正常 | 返回完整文章 | 继续 |
| 频率限制 | 返回 `Security Verification` | **等待 15 秒后重试** |
| 持续被拦 | 多次重试仍失败 | **等待 30 秒后重试** |
| 登录墙 | 返回"本文登录可见" | 检查 Chrome 是否已登录 |

**经验法则：每篇间隔 15 秒，基本不会触发。**

---

## Chrome DevTools MCP 备用方案

如果 opencli 持续被 Cloudflare 拦截，可用 Chrome DevTools MCP：

1. 在 Chrome 中打开文章 URL
2. 用 `take_snapshot` 提取内容
3. 用 `evaluate_script` 提取图片 URL
4. 用 `curl` 下载图片

```
navigate_page → url: "https://new.web.cafe/tutorial/detail/{UID}"
take_snapshot → 提取文章内容
evaluate_script → 提取图片 URL 列表
```

---

## 目录结构

```
docs/md/columns/indie-hub/seo/
├── webcafe-advanced/
│   ├── index.md                    ← 专栏索引
│   ├── seo-3words-annotation.md    ← 文章档案
│   ├── tool-creation-full-process.md
│   └── images/
│       ├── gefei-seo-3words-annotation_001.jpg
│       └── gefei-tool-creation-full-process_001.png
```

---

## 文件命名规范

- 文章：英文小写、中划线分隔（如 `seo-3words-annotation`）
- 图片：`gefei-{文章slug}_{序号}.{ext}`（如 `gefei-seo-3words-annotation_001.jpg`）

---

## Frontmatter 模板

```yaml
---
title: "文章标题"
date: "YYYY-MM-DD"
source: "web.cafe"
author: "哥飞"
url: "https://new.web.cafe/tutorial/detail/{UID}"
---
```

---

## 快速参考

| 操作 | 命令 |
|------|------|
| 验证环境 | `opencli doctor` |
| 抓取单篇 | `opencli web read --url "https://new.web.cafe/tutorial/detail/{UID}"` |
| 批量抓取 | 循环 + `sleep 15` |
| 检查输出 | `ls web-articles/` |

---

## 故障排查

### opencli 返回 `Security Verification`

**原因**：Cloudflare 频率限制

**解决**：等待 15-30 秒后重试

### opencli 返回登录墙

**原因**：Chrome 未登录 web.cafe

**解决**：在 Chrome 中手动登录 https://new.web.cafe

### 图片未下载

**原因**：opencli 某些版本可能不下载图片

**解决**：手动下载
```bash
curl -sL -o img.jpg "https://s.web.cafe/image/{HASH}.png"
```

### opencli 未安装

**解决**：
```bash
npm install -g opencli
opencli doctor  # 验证
```
