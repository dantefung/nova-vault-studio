---
title: "博客首页去模板化改造 PRD"
date: "2026-08-04"
source: "Nova Vault Studio"
url: ""
---

# 博客首页去模板化改造 PRD

## 项目定义

把 `/md/blog/` 从模板化的卡片堆叠改造成符合 Easton 编辑部气质的视觉索引，并在正式改造前通过三份独立视觉稿确定方向。同时完成博客入口的打通与移动端导航修复。

## 背景与问题

`/md/blog/` 当前存在明显的模板化 AI 味：

1. 自动分类首字封面：`ArticleCard.vue` 用分类首字渲染伪封面，无信息价值。
2. 大圆角独立卡片：22px 圆角 + 独立边框 + 悬浮阴影，典型 SaaS 卡片感。
3. 标签胶囊与渐变背景：封面渐变 + 标签胶囊，与 Easton 纸面/细线/克制的原则冲突。
4. 模板化文案：“BLOG / 所有文章、系列与分类的统一入口。”这类文案无信息量。

## 目标

1. 通过三份方向原型（编辑器目录、杂志网格、极简时间线）确定改造方向，用真实数据、统一色板与视口对比，消除内容差异干扰。
2. 按选定方向改造 `BlogIndexLayout.vue`、`ArticleCard.vue`、`easton-blog.css`，去除伪封面、胶囊、悬浮阴影与模板化文案。
3. 保持 `/md/blog/` 全部现有能力：最新 / 分类 / 系列三种模式、搜索、主题切换、移动端。
4. 打通博客公共入口：桌面与移动导航、首页导航均可进入 `/md/blog/`。
5. 修复 Easton 移动端汉堡菜单展开不可见的问题。

## 范围

### 包含

- `/md/blog/` 三种模式（最新 / 分类 / 系列）的视觉改造。
- 博客文章卡片与索引布局的去模板化。
- 公共入口补充（`config.js` 导航、`HomeLayout.vue` 首页导航）。
- 移动端汉堡菜单与导航修复。

### 不包含

- 新增第三种视觉主题。
- 修改博客文章的正文样式（正文已在 2026-08-03 收敛）。
- 非博客板块（知识库 / 专栏）的改造。

## 方案（三选一，待选定）

| 方向 | 特征 | 取舍 |
|------|------|------|
| A 编辑器目录 | 标题为主角，日期/分类/阅读时间并列信息行，无伪封面无卡片 | 内容量大也撑得住，但相对“平” |
| B 杂志网格 | 头条 + 侧栏 + 故事栏的编辑层级，像期刊物 | 视觉记忆最强，但需人工编排主次，不适合完全自动生成 |
| C 极简时间线 | 按年月分组，最安静，扫描最快 | 维护成本最低，但摘要与主题感减弱 |

原型稿：`devlog/prototype/nova-blog-directions.html`（浏览器打开，顶部可切换三方向）。
原型记录：`devlog/logs/blog-index-direction-prototype-2026-08-04.md`。

## 完成前置项（已提交）

博客入口与移动端修复已在原型制作前完成并通过验证：

- `docs/.vitepress/config.js`：桌面与移动导航新增“博客”入口。
- `docs/.vitepress/theme/layouts/HomeLayout.vue`：首页导航新增“博客”入口。
- `docs/.vitepress/theme/composables/useBlogIndex.js`：新增并返回 `categories`、`series` computed，修复标签 `undefined.value`。
- `docs/.vitepress/theme/easton-doc.css`：`.VPNav` / `.VPNavBar` 的 `backdrop-filter` 层级修复，移动端汉堡菜单展开正常。

## 验收标准

1. 三方向原型验证通过：切换正常、桌面与移动均无横向溢出。
2. 正式页面无伪封面、无大圆角卡片、无悬浮阴影、无标签胶囊、无模板化文案。
3. 最新 / 分类 / 系列三种模式均可用，分类 15 项、系列 1 项。
4. 桌面与移动导航、首页导航均可进入 `/md/blog/`。
5. Easton 移动端汉堡菜单点击后正常展开。
6. `npm run build` 成功；`git diff --check` 与 pre-commit hook 通过。

## 相关文件

| 文件 | 职责 |
|------|------|
| `docs/.vitepress/theme/layouts/BlogIndexLayout.vue` | `/md/blog/` 首页结构与三种模式切换 |
| `docs/.vitepress/theme/components/ArticleCard.vue` | 文章卡片（当前含首字封面、圆角、胶囊） |
| `docs/.vitepress/theme/easton-blog.css` | 博客索引样式（标签页、卡片网格、分类/系列 tile） |
| `docs/.vitepress/theme/layouts/BlogLayout.vue` | 博客公共页头、导航、搜索 |
| `docs/.vitepress/theme/composables/useBlogIndex.js` | 博客数据接口 |
| `docs/.vitepress/config.js` | 导航与构建配置 |
| `docs/.vitepress/theme/layouts/HomeLayout.vue` | 首页布局 |

## 状态

- 前置项：已完成并提交（commit `65fc2f0`）。
- 方向原型：已完成并通过验证，待用户选定方向。
- 正式改造：未开始。
- 开发日志：待正式改造完成后编写。