---
title: "主题控件与编辑部文档体验开发日志"
date: "2026-08-03"
source: "Nova Vault Studio"
url: ""
---

# 主题控件与编辑部文档体验开发日志

## 本次目标

本次开发围绕同一条用户路径展开：用户从首页选择知识库或博客视觉风格，再进入文档阅读。目标不是增加更多主题，而是让已有的 `quiet` 和 `easton` 两种风格在桌面端、移动端和文档内页形成一致、稳定的体验。

具体目标包括：

1. 修复桌面顶部下拉菜单错位。
2. 解决 Markmap 运行时依赖重新优化导致的旧 chunk 白屏。
3. 将首页风格切换和颜色切换从突兀的大胶囊收敛为两套共享逻辑、不同皮肤的控件。
4. 让 Easton 博客主题的正文、代码块和移动端导航真正符合编辑部视觉，而不是圆角卡片堆叠。
5. 修复博客主题下从首页点击“开始阅读”后文档无法渲染的问题。
6. 删除博客页无信息价值的装饰性 `E` 圆形标识，只保留文字品牌。

## 最终结果

### 知识库与博客控件

- 知识库模式使用克制分段式 `知识库 | 博客`。
- 博客模式使用编辑部文字式 `Library / Blog`。
- 知识库颜色模式使用晴空、暗夜、纸卷三个线性图标。
- 博客颜色模式使用三个轻量纸张色点。
- 两种皮肤继续共享 `useTheme.js` 中的状态、持久化和切换逻辑，没有复制第二套业务状态。
- `light`、`dark`、`sepia` 与 `quiet`、`easton` 仍是两个正交维度。

### 编辑部正文与代码块

- Easton 正文纸面圆角由 `30px` 收敛为 `2px`。
- 代码块、表格、翻页区域和 Giscus 外框统一为 `2px` 圆角。
- 引用块改为直角，删除代码块和附属卡片的浮夸阴影。
- 正文纸面使用轻微错位硬阴影，保留纸张层次但不再像 SaaS 卡片。
- 代码块只由 `pre` 管理内边距和横向滚动，`code` 不再重复加 padding。
- 长代码在代码块内部横向滚动，不再撑破正文列或页面。

### 移动端导航

- `768px` 以下隐藏桌面版首页风格和颜色切换控件。
- 隐藏两组重复的桌面主题控件，主题偏好统一进入设置面板；各布局原有的导航和搜索入口继续保留。
- 默认文档布局中的搜索与设置按钮收敛为 `36px` 和 `2px` 小圆角，不再使用突兀的大圆形。
- 首页、博客列表和默认文档布局都接入同一个 `MobileNavSheet`。
- 底部设置面板及选项统一为 `0-2px` 圆角。
- 面板打开时保存原有 `body.style.overflow`，关闭或组件卸载时恢复，避免路由切换后页面永久无法滚动。

## 修改文件

| 文件 | 修改内容 |
|------|----------|
| `docs/.vitepress/config.js` | 将 `mermaid`、`markmap-lib`、`markmap-view` 加入依赖预优化，避免开发期重新优化使旧 chunk 失效 |
| `docs/.vitepress/theme/fix-navigation.js` | 删除脚本对 `.VPMenu` 的二次绝对定位 |
| `docs/.vitepress/theme/navigation-fix.css` | 删除 `.VPMenu` 的重复定位和无效偏移补丁 |
| `docs/.vitepress/theme/components/LandingThemeSwitcher.vue` | 实现知识库分段式与博客编辑部文字式两套视觉皮肤 |
| `docs/.vitepress/theme/components/ThemeSwitcher.vue` | 实现知识库线性图标与博客色点皮肤；移动端隐藏桌面控件 |
| `docs/.vitepress/theme/components/MobileNavSheet.vue` | 收敛移动端视觉，补齐滚动锁资源清理 |
| `docs/.vitepress/theme/components/ReadingTime.vue` | 删除对不存在的 `useData().source` 的访问，改为从已渲染正文估算阅读时间 |
| `docs/.vitepress/theme/layouts/HomeLayout.vue` | 首页移动端增加统一设置面板入口 |
| `docs/.vitepress/theme/layouts/BlogLayout.vue` | 博客列表移动端增加统一设置面板入口 |
| `docs/.vitepress/theme/components/EastonCloneLayout.vue` | 同步删除旧博客布局中的装饰性 `E` 标识，避免未来复用时恢复旧视觉 |
| `docs/.vitepress/theme/override.css` | 删除无人使用的圆形 Logo 样式，只保留文字品牌排版 |
| `docs/.vitepress/theme/easton-doc.css` | 重做正文纸面、代码块、引用、表格、翻页和移动端导航视觉及溢出规则 |

## 问题与根因

### 1. 顶部下拉菜单错位

**现象**：桌面端点击“文档”后，下拉面板没有与按钮右边缘对齐。

**根因**：VitePress 已由外层 flyout 容器负责定位，项目脚本和 CSS 又给内部 `.VPMenu` 添加 `position: absolute` 及偏移，形成二次定位。

**修复**：删除内部菜单的重复定位，让框架原生容器成为唯一定位所有者。

**验证**：浏览器实测“文档”按钮范围约为 `x=533-603`，下拉面板约为 `x=475-603`，右边缘正确对齐。

### 2. Markmap 开发期白屏

**现象**：开发服务器运行过程中出现依赖重新优化，浏览器继续请求旧 chunk，页面白屏。

**根因假设**：`markmap-lib` 和 `markmap-view` 没有在开发服务器启动时稳定进入依赖预优化集合，符合开发期依赖重新优化后旧 chunk 失效的表现。本次没有保留完整的故障前后网络日志，因此不能把这一项写成已完全证实的根因。

**修复**：在 `optimizeDeps.include` 中显式加入 `mermaid`、`markmap-lib`、`markmap-view`。

**验证边界**：生产构建通过，说明显式预优化配置没有破坏打包；仍需在独立任务中长时间运行开发服务器并重复打开 Markmap 页面，确认不再出现旧 chunk 白屏。

### 3. 代码块圆角突兀并溢出

**现象**：Easton 正文是大圆角纸面，代码块又套一层 `18px` 圆角和阴影；长代码在移动端撑破正文。

**根因**：同一份 `18px 22px` padding 同时应用在 `pre` 和 `code` 上，尺寸被重复放大。外层用 `overflow: hidden` 只是裁切症状，没有建立正确的滚动所有权。

**修复**：

- 外层代码块只负责边框、背景和宽度约束。
- `pre` 独占 padding 与 `overflow-x: auto`。
- `code` 使用 `padding: 0`。
- 外层 `max-width: 100%`、`min-width: 0`，长内容只在 `pre` 内滚动。

### 4. 移动端顶部控件拥挤

**现象**：移动端同时出现三色色板、搜索、设置和汉堡按钮，控件尺寸和圆角互相冲突，导航被挤满。

**根因**：`LandingThemeSwitcher` 已在移动端隐藏，但 `ThemeSwitcher` 仍显示；同时设置入口已经提供了相同能力，造成重复入口。

**修复**：移动端隐藏两个桌面主题切换器，并将全部偏好放进底部面板。首页和博客自定义布局也补上同一入口；各布局原有的开始阅读、GitHub、博客导航、搜索或汉堡菜单按原逻辑保留。

### 5. 博客主题点击“开始阅读”后正文不渲染

**复现路径**：

1. 打开首页并选择博客主题。
2. 点击“开始阅读”。
3. 进入 `/md/guide/getting-started`。
4. 页面在 `ArticleHero -> ReadingTime` 渲染期间抛出异常，正文无法正常挂载。

**浏览器错误**：

```text
TypeError: Cannot read properties of undefined (reading 'value')
at ComputedRefImpl.fn (.../ReadingTime.vue)
```

**根因**：`ReadingTime.vue` 使用 `const { frontmatter, source } = useData()`，但 VitePress `useData()` 不提供 `source`。代码随后执行 `source.value`，因此必然读取 `undefined.value`。博客主题会挂载 `ArticleHero` 和 `ReadingTime`，知识库主题不挂载，所以问题看起来像“博客主题路由白屏”，实际是组件数据契约错误。

此前提交只把 `frontmatter.value.readingTime` 改成了 `frontmatter.value?.readingTime`，解决了一个 SSR 空值访问，却遗漏了根本不存在的 `source`。这说明 optional chaining 不能替代 API 契约检查。

**修复**：

- 保留显式 `frontmatter.readingTime` 的最高优先级。
- 未配置时，在客户端从 `.vp-doc` 已渲染文本估算阅读时间。
- 使用 `page.relativePath` 监听 SPA 页面切换，并在 `nextTick` 后重新估算。
- SSR 使用稳定的 1 分钟默认值，不访问 DOM，也不访问不存在的数据字段。

**修复后验证**：博客主题从首页点击“开始阅读”可正常显示标题、正文和代码块；阅读时间显示为 `1 分钟`。控制台不再出现 `ReadingTime.vue` 异常，剩余 Giscus 404 属于评论仓库查询，与正文渲染无关。

### 6. 博客 Logo 模板化

**现象**：博客页在 `System Vault` 前放置一个橙色圆形 `E` 字母标识。它不是项目既有品牌资产，也不承载导航或状态信息，看起来像自动生成模板的占位 Logo。

**修复**：删除页头、页脚和旧 Easton 布局中的 `E` 标识，同时删除对应 CSS。品牌只保留衬线体 `System Vault` 文字，减少一个无意义的视觉概念。

### 7. 长标题文章布局失控

**现象**：长标题页面同时渲染 ArticleHero 标题和 Markdown H1；Hero 横跨正文与目录两列，标题侵入右侧目录；正文又被装进带背景和错位阴影的窄长卡片。元信息使用 Emoji，标签使用胶囊，整体更像模板而不是编辑部文章。

**修复**：

- Hero 宽度与正文列对齐，最大宽度 `820px`，不再进入目录列。
- 标题使用 frontmatter 原始标题，避免显示 VitePress 拼接的 `| System Vault`。
- Easton 模式由 ArticleHero 统一承担页面 H1，隐藏 Markdown 正文中的 H1；这也覆盖存量文章误写多个 H1 的情况。
- 无 frontmatter 标题时读取 VitePress 原始 `page.title`，不使用已经拼接站点名的浏览器标题。
- 只有右侧目录实际出现的宽屏断点才为 Hero 扣除目录宽度，中间宽度保持与正文一致。
- 删除元信息 Emoji，将日期、阅读时间、来源、作者改成斜杠分隔的纯文字信息行。
- 标签取消胶囊背景，改成轻量文本标签。
- 正文容器删除边框、独立背景和错位阴影，与 Hero 形成连续稿纸。

### 8. 研究文章缺少相关文章推荐

**现象**：`guide/research` 下的文章使用了 Easton 文章外观，但底部只有上一篇/下一篇，没有博客原有的相关文章推荐。

**根因**：布局通过手写目录前缀判断文章，博客索引又维护另一份扫描目录；`guide/research` 两边都未纳入。即使加入索引，推荐算法还会过滤所有零分候选，与“无同类时回退到最近文章”的设计注释不一致。

**修复**：

- 将 `docs/md/guide/research` 纳入博客索引，分类为“研究方法”。
- 布局保留原有 `wiki/columns/business` 文章范围，并让博客索引中的其它内容目录补充进入文章布局，避免未入索引的存量文章发生布局回归。
- 推荐排序保留零分候选，在没有同系列、同标签或同分类文章时回退到最近文章。

## 开发思路

### 1. 先找唯一所有者

菜单定位、代码块滚动和主题状态的问题本质相同：同一职责被两个层级同时管理。

- 菜单定位应只归外层 flyout 容器。
- 代码块滚动应只归 `pre`。
- 主题状态应只归 `useTheme.js`。
- 移动端主题入口应只归设置面板。

删除重复所有者，比继续叠加偏移、裁切和条件判断更可靠。

### 2. 视觉皮肤不能复制业务逻辑

知识库和博客的控件可以有不同文字、字体、边框和激活态，但它们仍然切换同一个 `currentLandingTheme` 和 `currentTheme`。如果为两套视觉各建一个状态机，后续会出现持久化不同步、移动端漏改和主题组合爆炸。

### 3. 编辑部风格不是把暖色卡片做圆

真正的编辑部视觉依赖纸张、细线、排版层级和克制的颜色，不依赖大圆角、胶囊和悬浮阴影。本次统一将正文相关圆角压到 `0-2px`，让边框和文字承担层级。

### 4. 构建通过不代表 SPA 路径可用

`npm run build` 能发现模板和 SSR 错误，但本次 `ReadingTime` 问题只在博客主题挂载该组件并进入文档时稳定暴露。必须按真实用户路径验证：选择主题、点击入口、进入页面、检查正文和控制台。

### 5. 不用兜底掩盖错误的数据契约

错误方案是把 `source.value` 改成 `source?.value`，这样虽然不崩，但阅读时间永远基于空文本，问题被隐藏。正确方案是确认 VitePress 真正提供什么数据，并选择真实存在的正文来源。

### 6. 不碰其他项目的测试资源

资源清理时检测到端口 `9000` 和 `5180` 上存在 `project-tracker` 项目的 Uvicorn/Vite 服务。本次只停止 Nova Vault Studio 使用的 `63324/63325` 服务，不清理不属于当前任务的进程。

## 实际使用的技能与协作方式

| 技能或方式 | 用途 |
|------------|------|
| `brainstorming` 工作流 | 在实现前比较 A 克制分段式、B 紧凑选择器、C 编辑部文字式，最终确认知识库 A + 博客 C |
| `investigate` | 对“博客主题点击开始阅读白屏”执行复现、堆栈收集、代码追踪、历史提交检查和根因验证，坚持先找根因再修复 |
| `neat-freak` | 收尾时识别开发日志真源，避免把历史流水账塞进 `AGENTS.md`，并同步开发日志与里程碑 |
| 独立验证代理 | 只读审查主题组件、移动端入口、代码块宽度和潜在回归；发现 `MobileNavSheet` 卸载后可能残留滚动锁 |
| Playwright 浏览器验证 | 复现真实点击路径，检查 DOM、computed style、页面横向溢出、控制台错误和移动端断点行为 |
| 生产构建验证 | 运行 VitePress 完整构建，覆盖客户端、服务端 bundle、页面渲染和 sitemap 生成 |

技能表只记录本次实际采用的工作流，不把普通文件读取、搜索或补丁工具伪装成技能。

## 失败尝试与诊断价值

| 情况 | 结果 | 得到的结论 |
|------|------|------------|
| 首次 `npm run build` 使用 120 秒时限 | 渲染页面阶段超时，但没有构建错误 | 大型内容站构建需要更长时限，不能把工具超时误判为构建失败 |
| Chrome DevTools 连接 `9222` | Chrome 未运行，无法连接 | 改用可用的 Playwright 会话，不阻塞验证 |
| 启动开发服务到 `63324` | 端口已占用，VitePress 自动切到 `63325` | 验证前必须读取服务日志确认真实端口 |
| 开发模式验证文章页 | `ReadingTime.vue` 抛错，正文未挂载 | 该错误后来成为“开始阅读白屏”的直接根因证据 |
| Playwright 元素截图与点击 | 个别操作因元素稳定等待超时 | 使用 DOM 计算值和原生 `el.click()` 继续验证，不把截图失败当作页面失败 |
| 仅检查外层代码块宽度 | 外层没有溢出，但内部长 `code` 仍超宽 | 需要同时检查 wrapper、`pre.clientWidth`、`pre.scrollWidth` 和页面级 scrollWidth |

## 验证证据

### 构建与静态检查

- `npm run build`：通过，完整构建约 112-119 秒。
- `git diff --check`：通过。
- VitePress 仍报告两个既有警告：`useTheme.js` 同时静态和动态导入、部分 chunk 超过 500 kB。本次未扩大范围处理。

### 桌面端

- Easton 正文容器圆角：`2px`。
- 代码块圆角：`2px`。
- 代码块横向滚动归 `pre`，`overflow-x: auto`。
- 页面级横向溢出：`0`。

### 390px 移动端

- `LandingThemeSwitcher`：`display: none`。
- `ThemeSwitcher`：`display: none`。
- 默认文档布局搜索按钮：约 `36 x 36px`，圆角 `2px`。
- 默认文档布局设置按钮：约 `36 x 36px`，圆角 `2px`。
- 设置面板：圆角 `0`，内部选项圆角 `2px`。
- 页面级横向溢出：`0`。

### 博客主题开始阅读路径

- URL：`/md/guide/getting-started`。
- 正文标题：`开始使用`。
- 代码块：正常显示 `npm install` 与 `npm run dev`。
- 阅读时间：正常显示。
- `ReadingTime.vue` 控制台异常：已消失。

## 后续维护规则

1. 使用 `useData()` 前先核对 VitePress 实际返回字段，不能凭名称猜测 `source`、`raw` 等字段存在。
2. 修改 Easton 文档视觉时，将正文、代码块、引用、表格、翻页和评论视为同一编辑系统检查。
3. 修改顶部主题控件时，同时验证桌面 `quiet/easton`、移动端设置面板及 `light/dark/sepia`。
4. 代码块必须由 `pre` 独占滚动和 padding，禁止再次给块级 `code` 添加同级 padding。
5. 浏览器验证必须覆盖从首页点击进入文档的 SPA 路径，不能只直接访问目标 URL。
6. 大型 VitePress 构建命令建议提供至少 360 秒时限。
7. `optimizeDeps` 的 Markmap 修复仍需补充开发服务器长时间运行和重复访问验证，不能仅凭生产构建判定开发期旧 chunk 问题彻底消失。

## 当前状态

- 功能修复已完成并通过浏览器真实路径验证。
- 本次改动尚未提交和推送。
- `.superpowers/brainstorm/30435-1785748122/` 是主题控件视觉比较稿，是否纳入提交应在提交前单独确认。
