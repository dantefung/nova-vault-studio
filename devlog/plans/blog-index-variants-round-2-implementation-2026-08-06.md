---
title: "博客首页第二轮多方向实现计划"
date: "2026-08-06"
source: "Nova Vault Studio"
url: ""
---

# 博客首页第二轮多方向实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven development. Each branch is isolated and receives independent implementation, spec review, code-quality review, build verification, and remote push.

**Goal:** 从固定基线 `c14d0c5` 实现并推送报纸头版、研究台账、书目目录、分栏阅读室四个博客首页版本。

**Architecture:** 每条分支只修改 `BlogIndexLayout.vue`、`ArticleCard.vue` 和 `easton-blog.css`。首页新增一个专属 ArticleCard variant 与独立布局类；共享 variant 和 `.blog-grid` 保持原契约。

**Tech Stack:** Vue 3、VitePress 1.6.4、CSS、Playwright。

---

## Task 1：建立隔离 Worktree

**Branches:**
- `blog-newspaper`
- `blog-research-notebook`
- `blog-bibliography`
- `blog-reading-room`

- [ ] 四条分支均从 `c14d0c5` 创建，Worktree 放在仓库外的 `/home/fenghaolin/.cache/tmp/opencode/`。
- [ ] 为构建临时链接主仓库 `node_modules`，提交前删除软链。
- [ ] 确认四个 Worktree 初始 `git status --short` 干净。

## Task 2：并行实现四个版本

**Files (each branch):**
- Modify: `docs/.vitepress/theme/layouts/BlogIndexLayout.vue`
- Modify: `docs/.vitepress/theme/components/ArticleCard.vue`
- Modify: `docs/.vitepress/theme/easton-blog.css`

- [ ] `blog-newspaper` 增加 `newspaper` variant，实现 50 篇文章的 CSS 三栏连续流。
- [ ] `blog-research-notebook` 增加 `research` variant，实现固定列研究台账。
- [ ] `blog-bibliography` 增加 `bibliography` variant，实现按 `categoryTitle` 分组的书目目录。
- [ ] `blog-reading-room` 增加 `reading-room` variant，实现分类锚点导航与文章流双区布局。
- [ ] 四个实现均保留 `default`、`compact`、`feature`、`row` 和 `.blog-grid` 原契约。

## Task 3：规格与代码质量复审

- [ ] 每个实现由独立审查代理对照 `devlog/prd/blog-index-variants-round-2-2026-08-06.md` 检查规格覆盖。
- [ ] 每个实现由独立代码质量代理检查 Vue 运行时风险、共享页面回归、主题 token、响应式和空数据降级。
- [ ] 所有高严重度问题由原实现分支修复并重新审查，直到清零。

## Task 4：完整构建与浏览器验收

- [ ] 每个 Worktree 运行 `git diff --check`，预期退出码 0。
- [ ] 每个 Worktree 运行 `npm run build`，预期包含：

```text
Blog index built: 519 articles, 1 series, 15 categories
build complete
```

- [ ] Playwright 在 1440x900、768x1024、390x844 检查 `/md/blog/` 无横向溢出。
- [ ] 点击最新、分类、系列并验证数量 50、15、1 与链接前缀。
- [ ] 抽查分类、系列、归档和文章详情，确认共享卡片与 `.blog-grid` 未退化。

## Task 5：提交与推送

- [ ] 每条分支只暂存三个目标文件。
- [ ] 删除 Worktree 的 `node_modules` 软链和临时构建目录。
- [ ] 分别提交：

```text
feat(blog): implement newspaper front page variant
feat(blog): implement research notebook variant
feat(blog): implement bibliography variant
feat(blog): implement reading room variant
```

- [ ] 分别执行 `git push -u origin <branch>`。
- [ ] 验证本地 HEAD 与对应远端 HEAD 一致，Worktree 干净。
