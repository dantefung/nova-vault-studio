---
name: article-illustrate
description: |
  为文章配图（概念艺术风格）。当用户说 "文章配图"、"给文章插图"、"文章配图"、"illustrate article" 时触发。
  自动分析文章结构 → 找最佳配图位置 → 用 Gemini 生成概念插图 → 插入 markdown。
  适合长文研究报告、技术文档等需要视觉层次的内容。
---

# 文章配图（概念艺术风格）

为文章生成概念艺术插图并插入文档。核心思路：用**纯视觉描述**生图（而非结构化图表指令），因为 Imagen 只擅长照片/艺术/抽象构图。

> **依赖**：`gemini-web-image` skill（项目级，提供浏览器操作 Gemini UI 生图能力）。

## 执行流程

### Step 1: 分析文章找配图位置

通读文章，找到以下类型的段落作为配图候选：

| 段落类型 | 配图类型 | 示例 prompt 模式 |
|---------|---------|-----------------|
| 历史时代 | 场景/时代感插图 | "A vintage telephone on a wooden desk, warm sepia lighting..." |
| 技术架构 | 抽象几何构图 | "Five stacked geometric layers in gradient blue tones, minimalist..." |
| 决策/选择 | 路标/分叉路口 | "A crossroads signpost with directional arrows, soft sky gradient..." |
| 未来/AI | 科技感肖像 | "A sleek white robot face with blue glow, deep navy background..." |
| 推演/剧本 | 自然隐喻/路径 | "Three diverging paths through sunlit landscape, cinematic..." |

**铁律**：不要生成结构化图表（timeline/diagram/table）。Imagen 做不了。

### Step 2: 确认配图方案

列出每张图的：
- 对应文章位置（小节标题）
- 配图概念
- 预计 prompt

跟用户确认数量和风格。

### Step 3: 生图

调用 `gemini-web-image` skill 逐张生成。每张约 40 秒。

```bash
# 调用方式：直接让 AI 走 gemini-web-image 的 7 步流程
# 每张图用不同的视觉 prompt
```

### Step 4: 插入文章

在对应小节标题下插入 `![描述](path/to/image.png)`：

```markdown
### 呼叫中心时代

![呼叫中心](images/article-slug/01-concept-name.png)

正文内容...
```

图片路径相对于文章文件所在目录。

## 提示词范式

**❌ 错误**（结构化图表指令，Imagen 拒生）：
```
Create a timeline diagram with 13 nodes labeled...
Use ZONES: title, timeline, labels...
COLORS: deep blue, gold circles...
```

**✅ 正确**（纯视觉描述，Imagen 能吃）：
```
A vintage photograph style image of an old telephone on a wooden desk,
warm sepia tones, soft window light, documentary photography aesthetic,
nostalgic atmosphere
```

**关键区别**：
- 不说 "Create a diagram/chart/infographic/timeline"
- 不说 "ZONES / LABELS / COLORS / STYLE" 这些结构化标签
- 像跟摄影师/画家说话一样描述画面
- 指定风格：photography, oil painting, abstract geometric, cinematic, corporate minimalist
- 指定氛围：warm, nostalgic, futuristic, hopeful, professional

## 输出目录

图片保存到文章同目录的 `images/{article-slug}/` 下：

```
docs/md/.../article.md
docs/md/.../images/article-slug/
├── 01-concept-name.png
├── 02-concept-name.png
└── ...
```

Markdown 引用路径：`images/article-slug/01-concept-name.png`

## 技术原理

1. Gemini Web API (`danger-gemini-web`) 的 `generate_content` 端点在当前模型上触发 Imagen 的几率 ~10%
2. 但 Gemini Web UI 的「制作图片」按钮走的是不同的服务端路径，稳定性接近 100%
3. 因此通过有头浏览器（gstack browse）直接操作 UI 是最可靠的生图方式
4. 生成后的图片以 `blob:` URL 存在 DOM `<img>` 中，通过 Canvas API 导出为 PNG

## 实际案例

`16-customer-service-building-guide.md`（15,000 字研究报告）：

| 位置 | 图片 | Prompt 模式 |
|------|------|------------|
| 呼叫中心时代 | 复古电话机 | vintage photography, warm sepia |
| 五层技术栈 | 层叠几何 | abstract geometric, corporate blueprint |
| 市场选择 | 三岔路口 | crossroads signpost, gradient sky |
| AI Agent 时代 | 机器人面孔 | sleek white robot, deep navy |
| 三剧本推演 | 三径分岔 | diverging paths, sunlit landscape |
