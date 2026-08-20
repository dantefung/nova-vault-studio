---
title: "逆向 Claude Design：huashu-design 深度解析"
date: "2026-04-21"
source: "Agent 工程化"
url: "https://mp.weixin.qq.com/s/1ByNBBS94CGgdTErdgSg6g"
---

# 逆向 Claude Design：huashu-design 深度解析

> huashu-design（花叔 Design）是一个面向 AI Coding Agent 的 HTML 原生设计 Skill。核心理念：在 Agent 里打一句话，拿回一份能交付的设计。不需要 Figma、不需要 After Effects，只需一行 prompt，3 到 30 分钟内就能产出一个产品发布动画、一个可点击的 App 原型、一套可编辑的 PPT 或一份印刷级的信息图。

- **作者**：花生（花叔 / Alchain）
- **GitHub**：[alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)（1.2k+ Stars）
- **安装**：`npx skills add alchaincyf/huashu-design`
- **支持 Agent**：Claude Code、Cursor、Codex、OpenClaw、Hermes

---

## 一、核心价值主张

| 维度 | 说明 |
|------|------|
| **一句话交付** | 从模糊需求到可交付设计，全程对话驱动 |
| **HTML 原生** | 所有产出物为 HTML 文件，双击即用，不依赖特定工具链 |
| **多格式导出** | MP4（25fps/60fps）、GIF、PPTX、PDF、PNG、SVG |
| **设计哲学驱动** | 内置 5 流派 × 20 种设计哲学，避免视觉同质化 |
| **Agent-Agnostic** | 不绑定特定 Agent，任何支持 skills.sh 的环境均可使用 |

**适用场景**：交互原型 / 设计变体探索 / 演示幻灯片（1920×1080 HTML deck）/ 时间轴动画 / 信息图

**不适用**：生产级 Web App、SEO 网站、需要后端的动态系统

---

## 二、核心架构

### 仓库结构

```
huashu-design/
├── SKILL.md                  # Skill 入口文件（规则引擎，约 56KB）
├── README.md
├── assets/
│   ├── animations.jsx        # Stage + Sprite 动画引擎
│   ├── deck_stage.js         # 幻灯片外壳 Web Component
│   ├── design_canvas.jsx     # 设计变体并排展示画布
│   ├── ios_frame.jsx         # iPhone 15 Pro 精确机身框架
│   ├── browser_window.jsx    # 浏览器窗口框架
│   ├── bgm-*.mp3             # 6 首场景化 BGM
│   ├── sfx/                  # 音效库（28 个分类音效）
│   └── showcases/            # 24 个预制 showcase（8 场景 × 3 风格）
├── references/
│   ├── design-styles.md      # 20 种设计哲学详细库
│   ├── workflow.md           # Junior Designer 工作流
│   ├── animation-pitfalls.md # 16 条动画踩坑实录
│   ├── video-export.md       # 视频导出完整指南
│   └── tweaks-system.md      # 实时变体调参系统
├── scripts/
│   ├── render-video.js       # HTML → MP4 录制
│   ├── convert-formats.sh    # MP4 → 60fps + GIF
│   ├── add-music.sh          # MP4 + BGM 混音
│   └── html2pptx.js          # HTML → 可编辑 PPTX
└── demos/                    # 演示 HTML 文件
```

### 四大核心机制

1. **品牌资产协议** — 涉及具体品牌时强制执行的 5 步硬流程，确保品牌色值从权威来源获取
2. **设计方向顾问** — 需求模糊时的 Fallback 模式，从 20 种设计哲学中推荐 3 个差异化方向
3. **Junior Designer 工作流** — 默认工作模式，先写假设再迭代的渐进式设计流程
4. **反 AI Slop 规则** — 避免一眼 AI 的视觉最大公约数

---

## 三、工作流管线

![工作流管线](images/huashu-design-deep-dive/001.png)

| 阶段 | 步骤 | 说明 |
|------|------|------|
| 一：品牌资产确认 | 3-5 | 需求涉及具体品牌时强制执行政策，色值来自权威来源 |
| 二：设计方向选择 | 6-9 | 从 5 流派 × 20 种设计哲学推荐 3 个差异化方向，并行生成 Demo |
| 三：渐进式设计 | 10-12 | Junior Designer 模式，先写假设和占位符，尽早获取用户反馈 |
| 四：交付与验证 | 13-14 | Playwright 自动截图验证，确保浏览器实际渲染与预期一致 |

---

## 四、源码分析

### 4.1 SKILL.md — Skill 入口与规则引擎

文件大小约 56KB，包含完整的设计规则体系：

- **原则 #0（最高优先级）**：事实验证先于假设。涉及具体产品/技术/规格参数时，必须先 WebSearch 验证
- **品牌资产协议**：5 步硬流程（问 → 搜 → 下载 → grep 色值 → 写 spec）
- **设计方向顾问**：从 5 流派 × 20 种设计哲学推荐 3 个差异化方向
- **Junior Designer 工作流**：4 轮迭代（Assumptions → 真实组件 → 细节打磨 → 验证交付）
- **反 AI Slop 规则**：避免紫渐变、emoji 图标、Inter 做 display font 等 AI 视觉通病

### 4.2 动画引擎 animations.jsx

采用 **Stage + Sprite 时间片段模型**，借鉴 Remotion 但轻量化实现：

**Stage 组件** — 动画容器：
- 管理播放/暂停/跳转状态
- 自动缩放画布以适配视口
- 等待字体加载完成后才启动时钟
- 支持 `window.__recording` 信号，录制时自动禁用循环

**Sprite 组件** — 时间片段：
- 通过 `start`/`end` 属性定义时间窗口
- 提供本地进度 `t`（0→1）和已过时间 `elapsed`
- 时间窗口外自动返回 null

**核心 API**：
- `useTime()` — 读取全局时间（秒）
- `useSprite()` — 读取本地进度 `{ t, elapsed, duration }`
- `interpolate(t, [inStart, inEnd], [outStart, outEnd], easing)` — 线性插值
- 缓动函数：`linear`、`easeIn`、`easeOut`、`easeInOut`、`expoOut`、`overshoot`、`spring`、`anticipation`

### 4.3 幻灯片外壳 deck_stage.js

实现为 Web Component `<deck-stage>`：

- 固定尺寸画布（默认 1920×1080）+ 自适应缩放 + Letterbox
- 键盘导航（←/→/Space/Home/End）和点击区域导航
- `localStorage` 持久化当前 slide
- Hash 导航（`#slide-5` 直接跳转）
- Speaker Notes 通过 `postMessage` 通知外层
- Cmd+P 打印为 PDF 支持
- 使用 Shadow DOM 隔离样式

### 4.4 视频渲染管线 render-video.js

**两阶段录制架构**：

| 阶段 | 操作 |
|------|------|
| Phase 1: Warmup（无录制） | 预加载字体和资源，然后关闭上下文 |
| Phase 2: Record（全新上下文） | 干净状态开始，动画从 t=0 录制 |

**录制同步机制**：
- HTML 端在 tick 首帧设置 `window.__ready = true`
- 脚本端 `waitForFunction` 等待此信号，精确计算 trim 偏移
- 额外调用 `window.__seek(0)` 作为第二道防线
- 注入 `window.__recording = true`，告知 HTML 禁用循环

**Chrome 元素隐藏**：
- 注入 CSS 隐藏 `.progress`、`.counter`、`.replay` 等调试元素
- JS 启发式检测固定位置的底部/顶部工具栏并隐藏
- `MutationObserver` 监听 DOM 变化，捕获 React/Vue 动态插入的 chrome 元素

### 4.5 设计哲学库 design-styles.md

20 种设计哲学，分为 5 大流派：

| 流派 | 编号 | 设计师/工作室 | 核心哲学 |
|------|------|-------------|---------|
| 信息建筑派 | 01-04 | Pentagram / Stamen / iA / Fathom | 数据是建筑材料 |
| 运动诗学派 | 05-08 | Locomotive / Active Theory / Field.io / Resn | 技术是流动的诗 |
| 极简主义派 | 09-12 | Experimental Jetset / Müller-Brockmann / Build / Sagmeister | 删减到无法再删 |
| 实验先锋派 | 13-16 | Zach Lieberman / Raven Kwok / Ash Thorp / Territory Studio | 打破规则即创造规则 |
| 东方哲学派 | 17-20 | Takram / Kenya Hara / Irma Boom / Neo Shen | 留白即内容 |

每种风格提供：哲学内核、核心特征、提示词 DNA（可直接用于 AI 生成）、代表作和搜索关键词。

---

## 五、功能详解

### 5.1 品牌资产协议（5 步硬流程）

| 步骤 | 动作 | 目的 |
|------|------|------|
| 1 · 问 | 询问用户是否有品牌指南 | 尊重已有资源 |
| 2 · 搜官方品牌页 | 搜索 `<brand>.com/brand` 等官方页面 | 获取权威色值 |
| 3 · 下载资产 | SVG → 官网 HTML → 产品截图（三条兜底） | 确保获取成功 |
| 4 · grep 色值 | 从资产提取 `#xxxxxx`，按频率排序，过滤黑白灰 | 绝不从记忆猜品牌色 |
| 5 · 固化 spec | 写 `brand-spec.md` + CSS 变量 | 不固化就会忘 |

A/B 测试数据：v2 版本（5 步硬流程）的稳定性方差比 v1 低 5 倍。

### 5.2 Junior Designer 工作流

| Pass | 内容 |
|------|------|
| **Pass 1** | Assumptions + Placeholders — 写假设和推理注释，用占位符构建结构，立刻展示 |
| **Pass 2** | 真实组件 + Variations — 用户批准方向后，用 React 组件替换占位符，开始变体探索 |
| **Pass 3** | 细节打磨 — 微调字号、间距、对比度、动画 timing |
| **Pass 4** | 验证 + 交付 — Playwright 截图验证，浏览器肉眼确认 |

精髓：做到一半再展示一次，不要等全做完。

### 5.3 Motion Design 导出流程

```
render-video.js → 录制 25fps MP4
convert-formats.sh → 派生 60fps 版本和 GIF
add-music.sh → 混入场景化 BGM
```

使用示例：

```jsx
<Stage duration={10}>
  <Sprite start={0} end={3}><Title/></Sprite>
  <Sprite start={2} end={5}><Subtitle/></Sprite>
</Stage>
```

### 5.4 Tweaks 实时变体系统

- `useTweaks()` Hook 从 localStorage 读取持久化的参数值
- 右下角浮动面板提供颜色选择器、滑块、下拉框等控件
- 参数变更通过 CSS 变量实时反映到设计中
- 刷新页面不丢失配置
- 默认值本身必须是一个完整、可发布的设计

### 5.5 HTML 幻灯片与 PPTX 导出

`html2pptx.js` 读取 DOM 的 `computedStyle`，逐元素翻译成 PowerPoint 对象，导出的是**真文本框而非图片铺底**，确保用户可以在 PowerPoint 中编辑内容。

### 5.6 5 维度专家评审

| 维度 | 说明 |
|------|------|
| 哲学一致性 | 设计是否贯彻了选定的设计哲学 |
| 视觉层级 | 信息层级是否清晰 |
| 细节执行 | 字距、对齐、色彩精度等 |
| 功能性 | 交互是否完整、状态是否覆盖 |
| 创新性 | 是否突破了模板化思维 |

评审结果以雷达图可视化，输出 Keep / Fix / Quick Wins 清单。

---

## 六、技术亮点

### 6.1 反 AI Slop 规则

**禁止**：紫渐变背景 / emoji 作为图标 / 圆角 + 左 border accent / SVG 画人脸 / Inter 字体做 display font

**推荐替代**：`text-wrap: pretty` 排印细节 / CSS Grid 精准布局 / 精心选择的 serif display 字体 / `oklch` 色彩空间

### 6.2 动画踩坑实录（16 条）

| 问题 | 根因 | 修复 |
|------|------|------|
| 叠层布局错乱 | `position: absolute` 子元素的容器未设 `position: relative` | 容器显式设 relative |
| 动画无法 seek 回跳 | 使用 `setTimeout` 触发动画 | 用 `firedSet` 配合显式 reset |
| 字体加载前测量偏移 | 依赖 DOM 测量的布局代码未等字体加载 | 包在 `document.fonts.ready.then()` 里 |
| 录制时 loop 跳帧 | 录制脚本和 HTML 之间缺少握手协议 | 注入 `window.__recording` 信号 |
| 跨 scene 元素隐形 | 跨多 scene 复用的元素硬编码颜色 | 禁止硬编码颜色 |

### 6.3 跨 Agent 兼容设计

- Tweaks 系统使用纯前端 localStorage，不依赖宿主 postMessage
- 所有组件为纯 HTML/JS/CSS，不依赖特定构建工具
- 使用 Babel Standalone 在浏览器端编译 JSX，双击 HTML 即可运行
- `EDITMODE-BEGIN/END` 标记块保留向前兼容性

---

## 七、快速安装

```bash
npx skills add alchaincyf/huashu-design
```

### 典型使用场景

**做演讲 PPT**：

> 「做一份 AI 心理学的演讲 PPT，推荐 3 个风格方向让我选」

Skill 会推荐 3 个不同流派的设计方向，生成 Demo 供选择，然后按选定方向生成完整的 HTML 幻灯片。

**做 App 原型**：

> 「做个 AI 番茄钟 iOS 原型，4 个核心屏幕要真能点击」

使用 `ios_frame.jsx` 精确的 iPhone 15 Pro 机身框架，支持状态驱动的多屏切换。

**做动画并导出视频**：

> 「把这段逻辑做成 60 秒动画，导出 MP4 和 GIF」

使用 Stage + Sprite 引擎制作动画，通过 `render-video.js` 录制 MP4，`convert-formats.sh` 生成 60fps 版本和 GIF。

---

## 八、总结

huashu-design 的关键创新：

- **品牌资产协议**解决了 AI 设计中「猜品牌色」的顽疾，稳定性提升 5 倍
- **20 种设计哲学库 + 设计方向顾问**，系统性避免了 AI 视觉同质化
- **Stage + Sprite 动画引擎 + 完整的录制导出管线**，解决了 HTML 动画到视频的全链路问题
- **16 条动画踩坑实录**，是项目最珍贵的工程知识沉淀
- **跨 Agent 兼容设计**，基于纯前端方案而非特定宿主 API

适用人群：需要在 AI Agent 中快速获取高质量设计产出的开发者、产品经理、独立开发者。适合做原型验证、产品发布素材、演讲幻灯片、概念动画等场景。