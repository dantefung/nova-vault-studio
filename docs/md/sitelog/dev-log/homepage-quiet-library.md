---
title: "首页 Quiet Library 改造开发日志"
date: "2026-07-30"
source: "Nova Vault Studio"
url: ""
---

# 首页 Quiet Library 改造开发日志

## 变更目标

将 `https://eastondev.com/blog/zh/` 的首页视觉语言转化为 Nova Vault Studio 的首页样式。默认仍是 **A · Quiet Library**：浅色纸面、蓝色强调、圆角面板、克制交互；同时提供可选的 **Easton Blog** 编辑风格，服务于不同阅读偏好和知识导航。

本次范围严格限制为首页：

- 首页同时提供知识分类入口和最近更新内容。
- 文章页、Wiki 页、侧边栏、搜索和评论继续使用原有机制。
- 全局颜色模式（`light` / `dark` / `sepia`）与首页视觉风格（`quiet` / `easton`）独立保存、独立切换。
- 不增加后端、数据库、运行时文件扫描或虚构统计数据。

## 实现结果

后续新增了可手动切换的 **Easton Clone** 首页主题。该主题复刻 `eastondev.com/blog/zh/` 的内容门户结构，包括 Hero、阅读入口、系列专题、编辑精选、最新文章、分类浏览和页脚导航；内容和链接使用本仓库真实资料，不复制外站内容。

### 首页结构

首页从上到下分为：

1. 保留站点品牌、开始阅读、GitHub、首页视觉切换和全局颜色切换。
2. Hero：说明这是一个个人知识库，并给出 Guide 作为第一阅读路径。
3. 知识分类入口：Guide、Wiki、Columns、Books、Tutorial、AGI、商业、Slides 和知识库总览。
4. 最近更新：展示 4 篇仓库中真实存在的文章，并链接到真实页面。
5. 保留原有 footer。

### 代码改动

- `docs/.vitepress/theme/layouts/HomeLayout.vue`
  - 删除原来 8 套首页风格，保留 Quiet Library 默认首页结构。
  - 增加独立的 Quiet Library / Easton Blog 首页视觉切换。
  - 使用数组和 `v-for` 渲染分类入口与最近更新。
  - 入口全部使用普通站内链接，不用 click handler 伪造导航。

- `docs/.vitepress/theme/override.css`
  - 新增 `.vp-landing` 作用域下的首页样式。
  - 增加 `light`、`dark`、`sepia` 三套局部颜色 token。
  - 实现桌面三列、平板两列、移动单列布局。
  - 实现卡片 hover/focus、圆角、轻微阴影和 `prefers-reduced-motion`。
  - 保留原有侧边栏和输入框修复规则。

- `docs/.vitepress/theme/composables/useTheme.js`
  - 保留 `vp-theme` 全局颜色主题状态。
  - 增加独立的 `vp-landing-theme` 首页视觉状态。

- `docs/.vitepress/theme/components/LandingThemeSwitcher.vue`
  - 提供可访问的首页视觉模式下拉菜单。
  - 只读写首页视觉状态，不接管全局颜色主题。

- `docs/index.md`
  - 删除旧的 VitePress `hero` 和 `features` 配置。
  - 只保留 `title` 和 `layout: home`，避免 Markdown 首页和自定义 Layout 产生两套来源。

## 关键开发经验

### 1. 先确认技术栈，再套用目标站方法

目标站是 Astro 页面，而本仓库是 VitePress + Vue 主题。正确做法不是复制目标站的技术实现，而是提取可迁移的视觉事实：颜色、边框、圆角、导航密度、内容层级和交互节奏，再放进现有 VitePress Layout 边界内。

### 2. 首页是内容索引，不是营销落地页

知识库首页的核心不是大标题本身，而是让访问者快速找到下一步。因此首页同时需要“分类入口”和“最近更新”，但不能用虚构数量、流量或用户数据制造热闹感。

### 3. 先验证链接，再写卡片

首页卡片很容易产生死链接。实现前逐个核对目录和 Markdown 文件，最终发现 `/md/` 没有对应 `index.md`。审查阶段将“全部内容”改为真实存在的 `/md/wiki/`，并把文案改成“知识库总览”，避免链接语义和实际目标不一致。

### 4. 主题系统必须覆盖完整

项目的主题系统不只有亮色和暗色，还支持 sepia。最初只覆盖 `.theme-dark`，独立审查发现 sepia 首页会退回亮色 token。最终补充 `.theme-sepia` 局部 token，且没有改全局主题变量，避免影响文章页。

### 5. 全局 CSS 要有边界

首页样式全部使用 `.vp-landing` 前缀，不能直接改 `:root` 或通用文档选择器。这样才能保证首页换肤不会泄漏到 `.VPDoc`、侧边栏和搜索页面。

### 6. 设计确认和实现审查要分开

本次先通过视觉方向、信息架构、响应式和交互四个确认点，再写设计文档和实施计划。实现后分别做规格审查、代码质量审查和最终整体审查。审查不是形式，它实际发现了死链接、sepia 缺失、特色卡未挂载、圆角缺失和 hover 不完整等问题。

### 7. 构建成功不等于功能完成

`npm run build` 只能证明 Vue 模板和 VitePress 构建通过，不能证明链接、移动端布局和文档页回归正确。因此最终验证同时覆盖桌面端、390px 移动端、分类入口、最近更新、文章页、Wiki 页、搜索和主题切换。

### 8. 提交前检查新增 Markdown 的 frontmatter

仓库 pre-commit hook 会检查 staged Markdown。实施计划第一次提交时因为缺少 YAML frontmatter 被阻断，补充 `title/date/url` 后才通过。以后新增开发日志、方案和计划文件时，先按仓库规范写完整 frontmatter。

## 使用的技能

本次实际使用的技能和用途如下：

| 技能 | 用途 |
|------|------|
| `clone-website` | 按目标站取证、行为分析、页面拓扑和视觉克隆流程组织任务 |
| `using-superpowers` | 在行动前检查并加载适用技能，遵守技能调用顺序 |
| `brainstorming` | 先确认范围、首页目标、视觉方向、信息架构和交互，再进入实现 |
| `frontend-design` | 约束 Quiet Library 的视觉选择，避免泛化的 AI 页面风格 |
| `agent-reach` | 读取外部目标网页并分析目标站实际 HTML、导航和主题结构 |
| `writing-plans` | 将已确认设计拆成文件边界、实现任务和验证步骤 |
| `subagent-driven-development` | 用独立实现代理、规格审查代理和代码质量审查代理执行计划 |
| `gh-push` | 按仓库 Git 流程检查、提交并推送首页改造 |
| `neat-freak` | 收尾时检查过期文档，并同步修正仍描述 8 套首页风格的功能文档 |
| `retrospective-codify` | 从死链接、主题遗漏和构建验证中提炼可复用经验；本次经验属于项目开发日志，没有新增全局规则或技能 |

### 9. 两个主题维度必须分开

首页视觉模式不是颜色主题的别名。`Easton Blog` 必须在 `light`、`dark` 和 `sepia` 下都可读；全局主题切换不能把首页切回 Quiet，也不能影响文档页布局。

## 验证结果

- `npm run build`：通过。
- `git diff --check`：通过。
- 桌面首页：结构和入口正常。
- 390px 移动首页：无横向溢出，卡片和最近更新正常换行。
- 分类入口：均指向真实页面或目录。
- 最近更新：4 篇文章链接均指向真实页面。
- 文章页和 Wiki 页：继续使用默认 VitePress 文档布局。
- 搜索、全局颜色主题和首页视觉主题：回归验证通过。
- 本项目 VitePress 开发服务器：验证后已停止。

构建仍有两个既存警告：`useTheme.js` 同时被静态和动态导入，以及部分 chunk 超过 500 kB。这些不是本次首页改造引入的功能错误，留待独立性能任务处理。

## 后续维护规则

- 首页入口新增或改名时，必须先确认目标 Markdown 或目录真实存在。
- 修改主题 token 时，同时检查 `light`、`dark`、`sepia` 三种首页状态。
- 修改首页视觉模式时，同时检查 `quiet`、`easton` 两种状态及其与三种颜色模式的组合。
- 首页样式必须继续使用 `.vp-landing` 作用域。
- 修改首页后至少运行 `npm run build`，并验证移动端没有横向溢出。
