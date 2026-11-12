---
title: "Blog 去AI味改造方案"
date: "2026-08-06"
source: "Nova Vault Studio"
url: ""
---

# Blog 去AI味改造方案

## 定义

"去AI味" = 让博客看起来不像模板生成、不像 SaaS 仪表盘、不像通用卡片堆叠，而是像**一个人认真写的出版物**。

当前博客的 AI 味具体表现为：

| 特征 | 代码位置 | 问题 |
|------|---------|------|
| 伪封面首字 | `ArticleCard.vue:17` | 用分类首字渲染封面，无信息价值 |
| 大圆角 22px | `ArticleCard.vue:40` | SaaS 卡片典型特征 |
| 悬浮阴影 + 上移 | `ArticleCard.vue:64-68` | 交互反馈过于模板化 |
| 标签胶囊 999px | `ArticleCard.vue:128-132` | 提示词工程常见痕迹 |
| 封面渐变 | `ArticleCard.vue:77-81` | 装饰性渐变，无信息承载 |
| 模板化文案 | `BlogIndexLayout.vue:21` | "所有文章、系列与分类的统一入口" |
| 胶囊 tab 切换 | `easton-blog.css:31-35` | 圆角 pill 按钮 |
| 等宽卡片网格 | `easton-blog.css:56-60` | flex-wrap 卡片瀑布 |

---

## 方案一：印刷编辑（Editorial Print）

**核心理念**：像报纸或杂志目录，去掉所有"容器"，只保留文字和细线。

### 改造内容

- 去掉 `ArticleCard` 的卡片边框、圆角、阴影、背景色
- 每条文章改为纯文字行：`[日期] 标题 · 分类 · 阅读时间`
- 方向 A（编辑部目录）的完整实现
- 用 `border-top` 细线分隔条目，线宽 0.5px-1px

### 关键样式

```css
/* 去掉卡片一切装饰 */
.article-card {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  gap: 24px;
  padding: 20px 0;
  border: 0;
  border-radius: 0;
  background: none;
  border-bottom: 1px solid var(--easton-doc-rule);
  transition: none;
}
.article-card:hover {
  border-color: var(--easton-doc-accent);
  transform: none;
  box-shadow: none;
}
```

### 取舍

- 优点：最干净，信息密度最高，更新频繁也撑得住
- 缺点：视觉上"平"，没有封面图和摘要的引导性

---

## 方案二：杂志布局（Magazine Layout）

**核心理念**：引入编辑层级，区分头条/侧栏/普通文章，用比例和位置替代卡片装饰。

### 改造内容

- 首页最新文章区改为 `feature + side + grid` 三层结构
- 头条文章占 1.35fr，侧栏 0.65fr，其余 3 列网格
- 去掉所有卡片，改为纯文字 + 分隔线
- 方向 B（杂志网格）的完整实现
- 每期一个"刊号"概念（ISSUE XXX · MONTH YEAR）

### 关键样式

```css
.blog-lead-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 44px;
  padding: 34px 0 40px;
  border-bottom: 1px solid var(--easton-doc-ink);
}
.blog-story-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.blog-story {
  padding: 28px 28px 30px 0;
  border-bottom: 1px solid var(--easton-doc-rule);
}
```

### 取舍

- 优点：视觉记忆最强，有"刊物"感
- 缺点：需要人工编排主次关系，不适合完全自动生成

---

## 方案三：极简档案（Minimal Archive）

**核心理念**：按时间线索引，去掉一切摘要和装饰，标题是唯一信息入口。

### 改造内容

- 按年月分组，年号作为分区标记
- 每条只保留：`日期 + 标题 + 分类/阅读时间`
- 无摘要、无封面、无标签
- 方向 C（极简时间线）的完整实现
- 年号左边线或独立纵列

### 关键样式

```css
.blog-year {
  display: grid;
  grid-template-columns: 130px 1fr;
  margin-top: 64px;
  border-top: 1px solid var(--easton-doc-ink);
}
.blog-year-label {
  padding-top: 22px;
  color: var(--easton-doc-accent);
  font-size: 30px;
  font-style: italic;
}
.blog-entry {
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: 24px;
  padding: 22px 0 24px 30px;
  border-bottom: 1px solid var(--easton-doc-rule);
}
```

### 取舍

- 优点：扫描最快，维护成本最低
- 缺点：摘要和主题感减弱，不适合内容发现场景

---

## 方案四：组件级渐进改造（Component-Level）

**核心理念**：不动整体布局，只替换有 AI 味的组件和样式，逐步收敛。

### 改造清单

| 组件/文件 | 改动 | 风险 |
|----------|------|------|
| `ArticleCard.vue` | 去掉伪封面、圆角、阴影、胶囊标签 | 低（独立组件） |
| `BlogIndexLayout.vue` | 去掉模板化文案 | 低 |
| `easton-blog.css` | 去掉胶囊 tab、卡片网格 | 中（影响布局） |
| `BlogArticleShell.vue` | 检查正文包裹样式 | 低 |

### 优先级

```
P0: 去掉伪封面 ArticleCard.vue:17
P0: 去掉模板文案 BlogIndexLayout.vue:21
P1: 圆角 22px → 0px / 4px
P1: 去掉悬浮阴影 + 上移
P2: 标签胶囊 → 内联文字
P2: 网格布局 → 列表布局
```

---

## 方案五：对比试验（A/B Test）

**核心理念**：保留当前版本，在 `devlog/prototype/` 中制作多个 mock，用真实数据进行视觉对比，选定方向后再实施正式改造。

### 步骤

1. 已在 `devlog/prototype/nova-blog-directions.html` 中制作 A/B/C 三方向原型
2. 使用真实文章数据（标题、分类、日期、阅读时间）
3. 统一 Easton 色板（`--paper: #f4eee5`, `--ink: #24211e`, `--rust: #a4492d`）
4. 桌面 + 移动端双视口验证
5. 选定方向后实施正式改造

### 当前状态

- 原型已完成，三方向切换正常
- 等待方向选定

---

## 推荐路线

建议采用**组合方案**：先按方案五（A/B Test）选定方向，再按方案四（组件级渐进改造）实施，最终收敛到方案一、二或三中的一种。

### 时间线预估

| 阶段 | 内容 | 预估 |
|------|------|------|
| 方向选定 | 用户确认方向 | 即时 |
| 组件改造 | 修改 ArticleCard + CSS | 1 次提交 |
| 布局改造 | 修改 BlogIndexLayout + easton-blog.css | 1 次提交 |
| 验收 | build 通过 + 移动端验证 | 即时 |

---

## 相关文件

| 文件 | 职责 |
|------|------|
| `docs/.vitepress/theme/components/ArticleCard.vue` | 文章卡片（当前含首字封面、圆角、胶囊） |
| `docs/.vitepress/theme/layouts/BlogIndexLayout.vue` | 博客首页结构 |
| `docs/.vitepress/theme/easton-blog.css` | 博客索引样式 |
| `devlog/prototype/nova-blog-directions.html` | 三方向视觉原型 |
| `devlog/prototype/blog-deai/` | 去AI味视觉原型项目 |