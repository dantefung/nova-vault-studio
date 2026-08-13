---
title: "博客视觉升级设计阶段技能使用记录"
date: "2026-08-12"
source: "Nova Vault Studio"
url: ""
---

# 博客视觉升级设计阶段技能使用记录

## 本阶段目标

本阶段没有直接修改 `/md/blog/` 的正式页面，而是先完成现状审查、需求收敛、视觉方向比较和对比稿归档。最终确定采用 A「克制出版」的信息结构，并吸收 B「图像随笔」的 5 篇精选配图。

## 实际使用的全部技能

| 技能 | 使用阶段 | 实际用途与产出 |
|------|----------|--------------|
| `using-superpowers` | 会话入口 | 建立技能优先的工作方式，要求在响应和操作前先判断并加载适用技能。 |
| `systematic-debugging` | 移动端代码块修复、Vercel 构建故障 | 先追踪 CSS 宽度冲突，再确认 VitePress 默认负边距与 Easton `max-width` 的冲突；随后定位 YAML 报错实际来自 `title` 内嵌套双引号，而不是报错指向的 `date`。 |
| `frontend-design` | 移动端样式修复 | 约束修复保持现有 Easton 视觉语言，只做移动端最小覆盖，不引入新的视觉系统。 |
| `verification-before-completion` | CSS 修复、构建修复、提交前检查 | 要求以 `git diff --check`、Markdown hooks 和 `npm run build` 的新鲜结果作为完成依据。 |
| `gh-push` | Git 提交与推送 | 检查状态、差异、提交历史和远端，仅暂存目标文件；创建两个独立提交并推送 `main`。 |
| `brainstorming` | 博客整体视觉升级 | 在改正式代码前设置设计确认门槛；逐项确认产品定位、首页主角、视觉气质、配图范围和改版边界；要求先比较方案再实施。 |
| `redesign-existing-projects` | 现状视觉审查 | 系统检查伪封面、大圆角、胶囊标签、悬浮阴影、模板文案、等宽卡片墙和缺失状态等 AI 设计痕迹。 |
| `design-taste-frontend` | 视觉方向定义 | 将页面识别为个人作者博客，设定克制编辑感，避免三等分卡片、通用渐变、过度圆角和无意义装饰；限制生成配图只服务于 5 篇精选内容。 |
| `html-page-archiver` | 对比稿归档 | 将视觉对比稿保存到 `docs/public/blog-visual-directions/index.html`，创建 `HtmlViewer` 文档入口并使用 `/blog-visual-directions/index.html` 站内路径。 |
| `doc-coauthoring` | 设计决策文档化 | 将对比稿从临时视觉材料整理为面向后续开发者的决策记录，明确最终方向、范围和不做事项。 |
| `neat-freak` | 开发日志同步 | 区分规则文档、设计记录和开发日志的职责；本次技能流水写入开发日志，不追加到 `AGENTS.md` 或 `CLAUDE.md`。 |
| `writing-plans` | 设计批准后 | 将设计规格拆成组件语义、首页结构、归档结构、公共外壳、视觉规则和浏览器验收六组任务。 |
| `subagent-driven-development` | 正式实现 | 使用独立实现代理修改 8 个目标文件，再分别执行规格审查和代码质量审查；两轮审查发现并修复主题变量、页脚入口、完整文章数量、无障碍状态和 Vue 响应性问题。 |

## 技能带来的关键决策

1. 不直接从现有页面开始改 CSS，先确认博客要成为「个人作者博客」，而不是知识库目录或数字杂志。
2. 不为全部 586 篇文章生成图片。生成图只用于首页 5 篇精选内容，其余文章用排版建立层级。
3. 不把 A、B、C 三套方案混成一页。A 是全站结构，B 只贡献精选配图机制，C 不进入本次方案。
4. 不修改博客索引生成脚本和文章正文阅读页。本轮边界是博客首页、分类、系列、归档、页头和页脚。
5. 不把一次性的开发过程追加到项目规则文件。视觉稿进入文档系统，技能使用记录进入开发日志。

## 当前产物

- 视觉对比 HTML：`docs/public/blog-visual-directions/index.html`
- 站内查看入口：`docs/md/sitelog/development/blog-visual-directions.md`
- 技能使用记录：`docs/md/sitelog/dev-log/blog-visual-redesign-skills-2026-08-12.md`
- 设计规格：`docs/superpowers/specs/2026-08-12-blog-editorial-redesign.md`
- 实施计划：`docs/superpowers/plans/2026-08-12-blog-editorial-redesign.md`

## 实施与验收结果

- 正式改造覆盖 8 个主题组件与样式文件，没有修改文章正文或索引生成脚本。
- 首页展示 5 篇精选和 581 篇普通文章，文章路径无重复或遗漏。
- 分类入口 15 个、系列入口 1 个、归档文章 586 篇，均可正常访问。
- light、dark、sepia 主题颜色正确；390px 移动端没有横向滚动。
- DOM 中嵌套链接数量为 0，三种索引按钮都暴露正确的 `aria-pressed` 状态。
- `npm run build`、`git diff --check` 和两个独立审查均通过。

构建仍报告仓库既有的 `useTheme.js` 动静态混合导入和大 chunk 警告，本次没有扩大这些问题。
