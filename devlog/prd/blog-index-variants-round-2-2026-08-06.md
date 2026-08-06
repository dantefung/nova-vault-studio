---
title: "博客首页第二轮多方向设计 PRD"
date: "2026-08-06"
source: "Nova Vault Studio"
url: ""
---

# 博客首页第二轮多方向设计 PRD

## 目标

在已完成的编辑部目录、杂志网格、极简时间线之外，再实现四种结构明显不同的博客首页。目的不是换颜色，而是比较不同的信息组织方式对 519 篇内容的浏览效率、主题感和移动端表现。

## 共同约束

四个版本均须遵守：

1. 四条分支统一从 commit `c14d0c5` 建立，保证比较时数据与基础代码一致。
2. 只修改：
   - `docs/.vitepress/theme/layouts/BlogIndexLayout.vue`
   - `docs/.vitepress/theme/components/ArticleCard.vue`
   - `docs/.vitepress/theme/easton-blog.css`
3. 每条分支只新增一个首页专属 variant：`newspaper`、`research`、`bibliography`、`reading-room`。专属 variant 只能由 `BlogIndexLayout.vue` 调用。
4. `default`、`compact`、`feature`、`row` 的不可变契约包括：原有 DOM 分区、封面显示条件、摘要显示条件、标签与箭头显示条件、链接目标、基础网格和移动端行为。不得删除这些 selector 或改变调用页的视觉结构。
5. `.blog-grid` 继续服务分类页、系列页和归档页；新首页布局使用独立类名。
6. 最新、分类、系列三种模式必须保留。
7. 保持 Easton 的纸面、细线、排版层级与克制色彩；禁止大圆角、悬浮阴影、渐变光效、胶囊标签和伪封面。
8. light、dark、sepia 主题均使用已有 `--easton-doc-*` token，不创造不存在的变量。
9. 在 1440x900、768x1024、390x844 三个视口均不能横向溢出。
10. 完成后必须经过独立代码复审、`git diff --check` 和 `npm run build`。

## D 报纸头版

**分支**：`blog-newspaper`

### 信息结构

- 页首采用报纸报头：站名、索引生成日期、最新 50 篇和固定编辑说明“系统、工具与独立创造的持续记录”。
- 最新模式把 50 篇文章放入连续三栏报纸流，所有文章同级，不设置头条、侧栏或故事卡。
- 每条展示标题、日期、分类和阅读时间；仅有摘要时展示两行摘要。
- 分类和系列模式使用连续两栏文字索引，不使用卡片容器。

### 视觉规则

- 使用报头、栏间竖线和窄栏正文制造报纸层级。
- 桌面三栏、平板两栏、移动端单栏；阅读顺序随 CSS 栏流自然推进。
- 不用图片模拟新闻封面。

## E 研究手账

**分支**：`blog-research-notebook`

### 信息结构

- 最新模式是研究台账矩阵，50 篇文章各占一行，顺序编号为 `001` 至 `050`。
- 桌面固定列为编号、日期、标题、来源、分类、阅读时间；摘要不进入矩阵。
- 来源缺失时显示 `—`，分类使用 `categoryTitle`，阅读时间缺失时显示 `—`，不伪造值。
- 分类和系列模式也使用台账矩阵，固定列为编号、名称、文章数量和入口。

### 视觉规则

- 模拟研究台账，而非时间线或文章卡片。
- 依赖行列网格、页码和小号等宽元数据建立秩序。
- 平板隐藏来源列；移动端改为“编号 + 标题”两列，日期、来源、分类和时长进入标题下的元数据行。

## F 书目目录

**分支**：`blog-bibliography`

### 信息结构

- 以出版社书目或图书馆目录为参照。
- 最新 50 篇按 `categoryTitle` 分组，分类名按中文 `localeCompare('zh-CN')` 排序；组内仍按日期倒序。
- 组内显示序号、标题、日期和阅读时间；不展示摘要，保持高密度。
- 分类和系列模式使用书目索引：名称、数量和跳转箭头。

### 视觉规则

- 使用目录点线、悬挂缩进、编号和分类章节标记。
- 不做卡片，不给每篇文章独立背景。
- 桌面允许高密度双栏；移动端改为单栏并取消目录点线，避免挤压标题。

## G 分栏阅读室

**分支**：`blog-reading-room`

### 信息结构

- 桌面左侧是分类统计与锚点导航，右侧是最新 50 篇连续文章流；点击分类仅跳到右侧该分类首次出现的位置，不在首页执行筛选或改变 URL。
- 最新模式左栏显示实际出现在 50 篇文章中的分类及数量，右栏按日期倒序展示文章。
- 分类模式左栏列出全部分类，右栏展示分类名称、数量和分类页入口。
- 系列模式左栏列出全部系列；只有一个系列时左栏仍保持窄索引，但右栏占据剩余宽度，不生成空卡位。
- 文章流展示日期、标题、摘要、分类和阅读时间。

### 视觉规则

- 左栏窄、右栏宽，中间使用垂直细线，不做侧边栏卡片。
- 桌面左栏可使用 `position: sticky`，但不得覆盖页头或导致页面滚动异常。
- 移动端左栏变为顶部横向索引，右栏自然单列；横向索引自身可滚动，页面不可横向溢出。

## 数据边界

- 所有方案统一展示 `latest(50)`；分类和系列模式继续读取 `categories` 和 `series`。文章对象内已有的 `source`、`categoryTitle`、`date`、`readingTime` 和 `excerpt` 可直接使用。
- 不调用 `articlesByCategory()` 或 `featuredArticles()`，不增加筛选、分页或异步数据流。
- 不修改生成器和博客索引数据格式。
- 对文章数量不足进行自然降级：没有次头条、没有边注或只有一个系列时，布局自动收缩，不保留空列。
- 研究台账为保持固定列，缺失来源和阅读时间时显示 `—`；其他方案缺失摘要、来源、分类、日期或阅读时间时省略对应字段，不伪造数据。

## 验收标准

1. 结构判定：D 是 CSS 多栏流；E 是固定列矩阵；F 是分类分组目录；G 是双区锚点导航。不得改回头条网格、时间线或普通纵向目录。
2. 最新、分类、系列按钮均可切换；分类链接匹配 `/md/blog/category/{slug}/`，系列链接匹配 `/md/blog/series/{slug}/`。
3. 在 `/md/blog/category/sources/`、`/md/blog/series/pensieve/`、`/md/blog/archive/` 和任意文章详情页检查 `default`、`compact`、`feature`、`row` 没有退化。
4. 1440x900、768x1024、390x844 三个视口下 `scrollWidth <= innerWidth`；移动端不得把两个以上元数据字段塞入小于 80px 的固定列。
5. light、dark、sepia 三个主题下不存在未定义 token，文字与分割线可见。
6. 四个版本分别完整构建成功；构建生成数量必须与固定基线一致，当前观测值为 519 篇文章、15 个分类和 1 个系列。
7. 独立复审必须覆盖三个目标文件与四个共享调用页，所有高严重度 finding 修复后才能提交。
8. 每条分支仅提交三个目标文件，并分别推送远端。

## 机械验收流程

每个 Worktree 按相同步骤执行：

1. `git diff --check` 必须退出码为 0。
2. `npm run build` 必须输出 `Blog index built: 519 articles, 1 series, 15 categories` 和 `build complete`。
3. 运行预览服务器并用 Playwright 打开 `/md/blog/`，断言：
   - 页面存在且仅存在当前分支的根类：`.newspaper-index`、`.research-index`、`.bibliography-index` 或 `.reading-room-index`。
   - 点击“最新”“分类”“系列”后，对应列表分别有 50、15、1 个数据项。
   - 分类入口 href 匹配 `/md/blog/category/`，系列入口 href 匹配 `/md/blog/series/`。
4. 对 1440x900、768x1024、390x844 分别断言 `document.documentElement.scrollWidth <= window.innerWidth`。
5. 依次访问 `/md/blog/category/sources/`、`/md/blog/series/pensieve/`、`/md/blog/archive/` 和一篇文章详情页；控制台不得出现 Vue error，页面 `.blog-grid` 的 `display` 必须仍为 `grid`，相关文章 `.is-compact` 必须保留自定义样式。
6. 切换 light、dark、sepia 后，抽查根容器与分割线的 computed color/borderColor 不得为空或透明；代码搜索不得出现 `--clone-muted` 等未定义 token。
7. 独立审查代理检查三个改动文件和上述四个共享页面。高严重度 finding 清零后方可提交。

## 最终选型规则

四个远端分支交付后由用户决定最终合入方案。AI 提供统一对比表，每项 1 至 5 分：

| 维度 | 权重 | 判定 |
|------|------|------|
| 519 篇内容的扫描效率 | 35% | 在 30 秒内能否快速定位日期、分类和标题 |
| 结构辨识度 | 25% | 是否明显区别于前三个版本及其他候选 |
| 移动端阅读 | 20% | 390px 下是否保持清晰顺序和合理字号 |
| 自动维护成本 | 20% | 新文章进入后是否无需手工指定头条或版位 |

加权最高者为推荐方案；分差小于 0.3 时，优先选择自动维护成本分更高的版本。用户保留最终决定权。

## 交付物

| 方向 | 分支 | 预期提交信息 |
|------|------|--------------|
| 报纸头版 | `blog-newspaper` | `feat(blog): implement newspaper front page variant` |
| 研究手账 | `blog-research-notebook` | `feat(blog): implement research notebook variant` |
| 书目目录 | `blog-bibliography` | `feat(blog): implement bibliography variant` |
| 分栏阅读室 | `blog-reading-room` | `feat(blog): implement reading room variant` |
