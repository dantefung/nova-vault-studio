---
name: fetch-wechat
description: 抓取微信公众号文章并入库
---

# 抓取微信公众号文章并入库

将微信公众号文章抓取并整理到知识库对应目录。

## 使用方法

```
/fetch-wechat
```

## Prompt 模板

收到微信公众号链接后：

1. 确认内容主题（AI/系统/工具/其他）
2. 判断入库目录：
   - AI 编程相关 → `docs/md/guide/ai/`
   - Linux/系统相关 → `docs/md/books/linux-network/` 或 `docs/md/guide/os/`
   - 工具使用 → `docs/md/guide/terminal/`
3. 执行抓取：
   ```bash
   python3 ~/.claude/skills/markdown-proxy/scripts/fetch_weixin.py "URL"
   ```
4. 添加 YAML frontmatter（title、author、date、source、url）
5. 按主题放到正确目录
6. 执行 `/vast-dev-commit-as-prompt` 提交

## 目录规划参考

| 内容主题 | 入库路径 |
|----------|---------|
| AI 编程资源/Agent | `docs/md/guide/ai/` |
| Claude Code 专项 | `docs/md/guide/ai/claude-code-resources.md` |
| Linux 系统/网络 | `docs/md/books/linux-network/` |
| 终端工具 | `docs/md/guide/terminal/` |
| CS 基础 | `docs/md/guide/cs/` |
