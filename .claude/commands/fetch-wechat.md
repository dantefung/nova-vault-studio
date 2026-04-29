---
name: fetch-wechat
description: 抓取微信公众号文章并入库（调度 markdown-proxy skill + 独立图片下载）
---

# 抓取微信公众号文章并入库

将微信公众号文章抓取并整理到知识库对应目录。

## 使用方法

```
/fetch-wechat
```

## Prompt 模板

收到微信公众号链接后，按以下流程处理：

### 1. 判断内容主题

| 内容主题 | 入库路径 |
|----------|---------|
| AI 编程/Agent | `docs/md/guide/ai/` |
| Claude Code 专项 | `docs/md/guide/ai/claude-code-resources.md` |
| Linux 系统/网络 | `docs/md/books/linux-network/` |
| 终端工具 | `docs/md/guide/terminal/` |
| CS 基础 | `docs/md/guide/cs/` |

### 2. 调度 markdown-proxy 抓取

调用 `/markdown-proxy` skill：

```
/markdown-proxy "微信公众号URL"
```

skill 会：
- 自动路由到 `fetch_weixin.py`（Playwright 渲染）
- 清洗广告内容
- 输出含 frontmatter 的 Markdown（title/author/date/source/url）
- 输出图片 URL 列表供 Step 4 使用

### 3. 保存到知识库目录

将 skill 输出的 md 文件移动到对应目录：

```bash
mv <文章标题>.md docs/md/guide/ai/
# 或
mv <文章标题>.md docs/md/books/linux-network/
```

### 4. 下载图片（可选）

文章含外部图片（mmbiz 等防盗链图）时执行：

```bash
python3 /home/fenghaolin/workspace/prj/opensource/nova-vault-studio/.claude/project-skills/markdown-proxy/scripts/download-images.py docs/md/.../xxx.md
```

脚本自动完成：
- 从 md 中提取所有外部图片 URL
- 带 Referer 下载（解决微信防盗链）
- 保存到 `images/<basename>/` 子目录
- 替换 md 中图片链接为本地相对路径

### 5. 提交

```bash
cd docs/md
git add -A
/vast-dev-commit-as-prompt
```

## 文件结构示例

```
docs/md/books/linux-network/
├── linux-network-packet-journey.md    ← 含 ./images/... 相对引用
└── images/
    └── linux-network-packet-journey/
        ├── linux-network-packet-journey-img1.png
        └── ...
```

## 依赖

```bash
pip install playwright beautifulsoup4 lxml
playwright install chromium
```
