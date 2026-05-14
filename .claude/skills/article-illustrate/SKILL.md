---
name: article-illustrate
description: |
  文章配图全流程主编。当用户说 "文章配图"、"给文章插图"、"illustrate article" 时触发。
  自动分析文章 → 推荐配图方案(类型×风格×色板×预设) → 调用 gemini-web-image 生成图片 → 插入文章。
  底层引擎：gemini-web-image (gstack 浏览器操作 Gemini UI)。
---

# 文章配图（主编）

分析文章内容 → 推荐风格方案 → 确认 → 委托 gemini-web-image 生图 → 插入文章。

> **底层引擎**：`gemini-web-image`（项目级，gstack 浏览器操作 Gemini UI 生图）。

---

## 三维度选择模型

| 维度 | 控制什么 | 可选值 |
|------|---------|--------|
| **Type** | 信息结构 | infographic, scene, flowchart, comparison, framework, timeline |
| **Style** | 渲染风格 | blueprint, vector-illustration, notion, elegant, warm, editorial, scientific... |
| **Palette** | 色彩方案(可选) | 默认(style自带), macaron, warm, neon |

---

## 一、类型

| Type | 适用场景 |
|------|---------|
| `infographic` | 数据、指标、技术概念 |
| `scene` | 叙事、情感、氛围 |
| `flowchart` | 流程、步骤、工作流 |
| `comparison` | 对比、方案选择、PK |
| `framework` | 模型、架构、原则 |
| `timeline` | 历史、演进、时间线 |

## 二、风格画廊

| Style | 描述 | 最佳场景 |
|-------|------|---------|
| `blueprint` | 技术蓝图，蓝白配色，精密线条 | AI/系统设计/工程 |
| `vector-illustration` | 扁平矢量，粗几何形，鲜艳和谐 | 知识文章/教程/技术 |
| `notion` | 极简手绘线稿，柔和图标 | SaaS/产品/知识分享 |
| `elegant` | 精致高雅 | 商业/思想领导力 |
| `warm` | 温暖友好 | 个人成长/生活/教育 |
| `minimal` | 超简洁、禅意 | 哲学、极简主义 |
| `watercolor` | 柔和艺术水彩 | 生活、旅行、创意 |
| `editorial` | 杂志级信息图，数据可视化 | 数据新闻/报告/技术解说 |
| `scientific` | 学术精密图表 | 研究/论文/生物化学 |
| `chalkboard` | 黑板粉笔画 | 教育、教学 |
| `fantasy-animation` | 吉卜力/迪士尼手绘风 | 故事、魔法、情感 |
| `flat` | 现代粗几何 | 现代数字、当代 |
| `flat-doodle` | 可爱扁平粗线 | 可爱、友好 |
| `intuition-machine` | 技术简报旧纸风 | 技术简报、学术 |
| `nature` | 有机自然插画 | 环境、健康 |
| `pixel-art` | 复古8位像素 | 游戏、复古科技 |
| `playful` | 俏皮粉彩涂鸦 | 趣味、休闲、教育 |
| `retro` | 80/90年代霓虹几何 | 怀旧、大胆 |
| `sketch` | 铅笔笔记本草图 | 头脑风暴、创意 |
| `screen-print` | 海报艺术，半色调纹理，限色 | 观点、文化、影视 |
| `sketch-notes` | 柔和手绘笔记 | 教育、温馨笔记 |
| `vintage` | 羊皮纸历史风 | 历史、传统 |

## 三、Type × Style 兼容矩阵

| | vector | notion | warm | minimal | blueprint | watercolor | elegant | editorial | scientific | screen-print |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| infographic | ✓✓ | ✓✓ | ✓ | ✓✓ | ✓✓ | ✓ | ✓✓ | ✓✓ | ✓✓ | ✓ |
| scene | ✓ | ✓ | ✓✓ | ✓ | ✗ | ✓✓ | ✓ | ✓ | ✗ | ✓✓ |
| flowchart | ✓✓ | ✓✓ | ✓ | ✓ | ✓✓ | ✗ | ✓ | ✓✓ | ✓ | ✗ |
| comparison | ✓✓ | ✓✓ | ✓ | ✓✓ | ✓ | ✓ | ✓✓ | ✓✓ | ✓ | ✓ |
| framework | ✓✓ | ✓✓ | ✓ | ✓✓ | ✓✓ | ✗ | ✓✓ | ✓ | ✓✓ | ✓ |
| timeline | ✓ | ✓✓ | ✓ | ✓ | ✓ | ✓✓ | ✓✓ | ✓✓ | ✓ | ✓ |

✓✓ = 强烈推荐 | ✓ = 兼容 | ✗ = 不推荐

## 四、自动推荐

### 按 Type 推荐 Style

| Type | Primary | Secondary |
|------|---------|-----------|
| infographic | vector-illustration | notion, blueprint, editorial |
| scene | warm | watercolor, elegant |
| flowchart | vector-illustration | notion, blueprint |
| comparison | vector-illustration | notion, elegant |
| framework | blueprint | vector-illustration, notion |
| timeline | elegant | warm, editorial |

### 按内容信号推荐

| 内容信号 | Type | Style |
|---------|------|------|
| API, 数据, 指标, 对比, 数字 | infographic | blueprint, vector |
| 知识, 概念, 教程, 学习, 指南 | infographic | vector, notion |
| 技术, AI, 编程, 代码 | infographic | vector, blueprint |
| 步骤, 流程, 工作流 | flowchart | vector, notion |
| 框架, 模型, 架构, 原则 | framework | blueprint, vector |
| 对比, 优劣, 方案选择 | comparison | vector, notion |
| 故事, 情感, 经历, 个人 | scene | warm, watercolor |
| 历史, 时间线, 演进 | timeline | elegant, warm |
| 效率工具, SaaS, 软件 | infographic | notion, vector |
| 商业, 专业, 战略 | framework | elegant |
| 观点, 文化, 哲学, 影视 | scene | screen-print |
| 新闻, 杂志, 调查 | infographic | editorial |

## 五、色板

| Palette | 效果 | 适用 |
|---------|------|------|
| (默认) | 风格自带配色 | 通用 |
| `macaron` | 柔和粉彩(蓝/薄荷/薰衣草/桃) 暖奶油底 | 教育/知识/教程 |
| `warm` | 暖色大地调(橙/陶/金) 柔和桃底 | 品牌/产品/生活 |
| `neon` | 鲜艳霓虹(粉/青/黄) 深紫底 | 游戏/复古/流行 |

## 六、风格预设

| Preset | Type | Style | Palette | 适用 |
|--------|------|-------|---------|------|
| `tech-explainer` | infographic | blueprint | — | API文档/系统指标 |
| `system-design` | framework | blueprint | — | 架构图/系统设计 |
| `knowledge-base` | infographic | vector-illustration | — | 概念解释/教程 |
| `saas-guide` | infographic | notion | — | 产品指南/SaaS文档 |
| `tutorial` | flowchart | vector-illustration | — | 分步教程 |
| `process-flow` | flowchart | notion | — | 工作流文档 |
| `data-report` | infographic | editorial | — | 数据新闻/指标报告 |
| `versus` | comparison | vector-illustration | — | 技术对比/框架对比 |
| `business-compare` | comparison | elegant | — | 产品评估/策略选项 |
| `history` | timeline | elegant | — | 历史概述/里程碑 |
| `evolution` | timeline | warm | — | 成长叙事/演进历程 |
| `storytelling` | scene | warm | — | 个人随笔/成长故事 |
| `lifestyle` | scene | watercolor | — | 旅行/生活/创意 |
| `opinion-piece` | scene | screen-print | — | 观点/评论 |
| `cinematic` | scene | screen-print | — | 影视/戏剧叙事 |
| `edu-visual` | infographic | vector-illustration | macaron | 知识总结/教育文章 |
| `science-paper` | infographic | scientific | — | 研究/学术论文 |

### 内容类型 → 预设推荐

| 文章内容类型 | 首选预设 | 备选 |
|-------------|---------|------|
| 技术深度 | tech-explainer | system-design, architecture |
| 教程 | tutorial | process-flow, knowledge-base, edu-visual |
| 方法论/框架 | system-design | architecture, process-flow |
| 数据/指标 | data-report | versus, tech-explainer |
| 对比/评测 | versus | business-compare |
| 叙事/个人 | storytelling | lifestyle, evolution |
| 观点/评论 | opinion-piece | cinematic |
| 历史/时间线 | history | evolution |
| 学术/研究 | science-paper | tech-explainer, data-report |
| SaaS/产品 | saas-guide | knowledge-base, process-flow |
| 教育/知识 | edu-visual | knowledge-base, tutorial |

---

## 交互流程

### Step 1: 通读文章

读完文章全文，理解内容类型、核心论点和章节结构。

### Step 2: 分析并推荐方案

输出分析结果和配图推荐表：

```
【内容分析】
- 类型：技术教程 / 方法论 / 叙事 / 数据报告 / ...
- 目的：信息传达 / 可视化 / 情绪营造
- 核心论点：2-5个

【配图推荐】
| # | 段落 | Type | Style | Palette | 概念 |
|---|------|------|-------|---------|------|
| 1 | §一 标题 | comparison | vector-illustration | — | ... |
| 2 | §二 标题 | flowchart | blueprint | — | ... |
```

### Step 3: 确认方案

AskUserQuestion 确认（最多 4 问）：

| Q | 内容 |
|---|------|
| Q1 | 类型/预设（推荐 + 备选） |
| Q2 | 密度（per-section 推荐 / balanced / minimal） |
| Q3 | 风格（推荐 + 备选） |
| Q4 | 色板（默认 / macaron / warm / neon） |

### Step 4: 委托生图

将每张图的 prompt 交给 `gemini-web-image` skill 的浏览器流程生成。

```bash
# gemini-web-image 会：
# 1. 启动浏览器 → 2. 登录 Gemini → 3. 进入生图模式 → 
# 4. 输入 prompt → 5. 发送 → 6. 等待 → 7. 提取 blob → 8. 保存 PNG
```

### Step 5: 插入文章

在对应小节标题下插入：

```markdown
### 段落标题

![描述](images/article-slug/01-concept-name.png)

正文...
```

图片保存到文章同目录 `images/{article-slug}/` 下，Markdown 引用相对路径。

---

## 输出目录

```
docs/md/.../article.md
docs/md/.../images/article-slug/
├── 01-concept-name.png
├── 02-concept-name.png
└── ...
```

---

## Prompt 写作

### 信息图/图表类

```
A [type] showing [content]. [layout]. [style cues]. [color].
```

示例：
```
A comparison diagram with three columns showing nano vs mini vs 4o.
Each column has a colored bar for speed and cost.
Bold geometric shapes, flat modern vector art style.
Blue green orange palette, white background.
```

### 场景/概念类

```
A [adj] [subject] in [style], [lighting], [mood], [composition].
```

---

## 实际案例

### 智能客服建设指南（16号文）
- 类型：技术研究报告，15000字
- 方案：5 张信息图（timeline + framework + flowchart + comparison + framework）
- 风格：blueprint
- 结果：全部 1024x559 PNG

### 意图分类分析（14号文）- 待配图
- 类型：技术方法论
- 推荐：5 张，vector-illustration 风格
- comparison + framework + flowchart + comparison + flowchart
