---
name: add-resource
description: 登记资源到导航页
---

# 登记资源到导航页

将链接资源整理到对应的 AI 编程资源导航页面。

## 使用方法

```
/add-resource
```

## Prompt 模板

收到用户提供的链接后：

1. 判断链接类型（GitHub、公众号、飞书、工具网站等）
2. 判断归属分类：
   - AI 编程通用资源 → `docs/md/guide/ai/ai-programming-resources.md`
   - Claude Code 专项 → `docs/md/guide/ai/claude-code-resources.md`
   - 终端工具 → `docs/md/guide/terminal/` 对应子目录
   - AI 书籍 → `docs/md/books/` 对应专题目录
3. 每个链接附带一句话说明
4. 按分类插入适当位置，保持原有结构不变
5. 执行 `/vast-dev-commit-as-prompt` 提交

## 示例格式

```markdown
- [标题](URL) — 一句话说明（来源/特点/用途）
```
