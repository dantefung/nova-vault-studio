---
name: gemini-web-image
description: |
  文章配图全流程技能。当用户说 "文章配图"、"给文章插图"、"用 gemini 生图"、"gemini 生成图片"、"Gemini 画图" 时触发。
  自动分析文章 → 推荐配图方案(类型×风格×色板) → 通过有头浏览器操作 Gemini UI 生成图片 → 插入文章。
  依赖 gstack browse 有头浏览器，已整合 baoyu-article-illustrator 的完整风格体系。
---

# Gemini Web 图片生成 & 文章配图

通过有头浏览器直接操作 gemini.google.com 的「制作图片」模式生成图片，
内置完整风格体系（类型×风格×色板三维选择）。

## 前置依赖

- gstack browse (`/home/fenghaolin/.claude/skills/gstack/browse/dist/browse`)
- Google 账号已登录
- bun, python3

## 三维度选择模型

| 维度 | 控制什么 | 可选值 |
|------|---------|--------|
| **Type** | 信息结构 | infographic, scene, flowchart, comparison, framework, timeline |
| **Style** | 渲染风格 | blueprint, vector-illustration, notion, elegant, warm, editorial, scientific... |
| **Palette** | 色彩方案(可选) | 默认(style自带), macaron, warm, neon |

### 类型

| Type | 适用场景 |
|------|---------|
| `infographic` | 数据、指标、技术概念 |
| `scene` | 叙事、情感、氛围 |
| `flowchart` | 流程、步骤、工作流 |
| `comparison` | 对比、方案选择、PK |
| `framework` | 模型、架构、原则 |
| `timeline` | 历史、演进、时间线 |

### 核心风格

| Style | 视觉效果 | 适用 |
|-------|---------|------|
| `blueprint` | 技术蓝图，蓝白配色，精密线条 | AI/系统设计/工程 |
| `vector-illustration` | 扁平矢量，粗几何形，鲜艳和谐 | 知识文章/教程/技术 |
| `notion` | 极简手绘线稿，柔和图标 | SaaS/产品/知识分享 |
| `elegant` | 精致高雅 | 商业/思想领导力 |
| `warm` | 温暖友好 | 个人成长/生活/教育 |
| `editorial` | 杂志级信息图，数据可视化强 | 数据新闻/报告 |
| `scientific` | 学术精密图表 | 研究/论文/生物化学 |
| `screen-print` | 海报风，半色调纹理，限色 | 观点/文化/影视 |

### 完整风格画廊

| Style | 描述 | 最佳场景 |
|-------|------|---------|
| `vector-illustration` | 扁平矢量，粗几何形 | 知识文章、教程、技术内容 |
| `notion` | 极简手绘线稿 | 知识分享、SaaS、效率工具 |
| `elegant` | 精致、高雅 | 商业、思想领导力 |
| `warm` | 友好、亲和 | 个人成长、生活、教育 |
| `minimal` | 超简洁、禅意 | 哲学、极简主义 |
| `blueprint` | 技术蓝图 | 架构、系统设计、工程 |
| `watercolor` | 柔和艺术水彩 | 生活、旅行、创意 |
| `editorial` | 杂志信息图 | 技术解说、新闻 |
| `scientific` | 学术精密图 | 生物、化学、研究 |
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
| `screen-print` | 海报艺术、半色调 | 观点、文化、影视 |
| `sketch-notes` | 柔和手绘笔记 | 教育、温馨笔记 |
| `vintage` | 羊皮纸历史 | 历史、传统 |

### Type × Style 兼容矩阵

| | vector | notion | warm | minimal | blueprint | watercolor | elegant | editorial | scientific | screen-print |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| infographic | ✓✓ | ✓✓ | ✓ | ✓✓ | ✓✓ | ✓ | ✓✓ | ✓✓ | ✓✓ | ✓ |
| scene | ✓ | ✓ | ✓✓ | ✓ | ✗ | ✓✓ | ✓ | ✓ | ✗ | ✓✓ |
| flowchart | ✓✓ | ✓✓ | ✓ | ✓ | ✓✓ | ✗ | ✓ | ✓✓ | ✓ | ✗ |
| comparison | ✓✓ | ✓✓ | ✓ | ✓✓ | ✓ | ✓ | ✓✓ | ✓✓ | ✓ | ✓ |
| framework | ✓✓ | ✓✓ | ✓ | ✓✓ | ✓✓ | ✗ | ✓✓ | ✓ | ✓✓ | ✓ |
| timeline | ✓ | ✓✓ | ✓ | ✓ | ✓ | ✓✓ | ✓✓ | ✓✓ | ✓ | ✓ |

✓✓ = 强烈推荐 | ✓ = 兼容 | ✗ = 不推荐

### 内容信号 → 自动推荐

| 内容信号 | 类型 | 风格 |
|---------|------|------|
| API, 数据, 指标, 对比, 数字 | infographic | blueprint, vector-illustration |
| 知识, 概念, 教程, 学习, 指南 | infographic | vector-illustration, notion |
| 技术, AI, 编程, 代码 | infographic | vector-illustration, blueprint |
| 步骤, 流程, 工作流 | flowchart | vector-illustration, notion |
| 框架, 模型, 架构, 原则 | framework | blueprint, vector-illustration |
| 对比, 优劣, 方案选择 | comparison | vector-illustration, notion |
| 故事, 情感, 经历, 个人 | scene | warm, watercolor |
| 历史, 时间线, 演进 | timeline | elegant, warm |
| 效率工具, SaaS, 软件 | infographic | notion, vector-illustration |
| 商业, 专业, 战略 | framework | elegant |
| 观点, 文化, 哲学, 影视 | scene | screen-print |
| 生物, 化学, 医学 | infographic | scientific |
| 新闻, 杂志, 调查 | infographic | editorial |

### 色板

| Palette | 效果 | 适用 |
|---------|------|------|
| (默认) | 风格自带配色 | 通用 |
| `macaron` | 柔和粉彩(蓝/薄荷/薰衣草/桃) 暖奶油底 | 教育/知识/教程 |
| `warm` | 暖色大地调(橙/陶/金) 柔和桃底 | 品牌/产品/生活 |
| `neon` | 鲜艳霓虹(粉/青/黄) 深紫底 | 游戏/复古/流行 |

### 风格预设 (Preset)

| Preset | Type | Style | 适用 |
|--------|------|-------|------|
| `tech-explainer` | infographic | blueprint | API文档/系统指标 |
| `system-design` | framework | blueprint | 架构图/系统设计 |
| `knowledge-base` | infographic | vector-illustration | 概念解释/教程 |
| `saas-guide` | infographic | notion | 产品指南/SaaS |
| `tutorial` | flowchart | vector-illustration | 分步教程 |
| `process-flow` | flowchart | notion | 工作流文档 |
| `data-report` | infographic | editorial | 数据新闻/报告 |
| `versus` | comparison | vector-illustration | 技术对比 |
| `history` | timeline | elegant | 历史概述 |
| `edu-visual` | infographic + macaron | vector-illustration | 知识总结 |
| `opinion-piece` | scene | screen-print | 观点/评论 |

## 文章配图交互流程

### Step 1: 读文章 → Step 2: 分析 → Step 3: 确认 → Step 4: 生图 → Step 5: 插入

### Step 1: 通读文章

读完全文，理解内容类型、核心论点和结构。

### Step 2: 分析并推荐方案

输出分析结果：

```
【内容分析】
- 类型：技术教程 / 方法论 / 叙事 / 数据报告 / ...
- 目的：信息传达 / 可视化 / 情绪营造
- 核心论点：2-5个

【配图推荐】
| # | 段落 | Type | Style | 概念 |
|---|------|------|-------|------|
| 1 | §X 标题 | flowchart | blueprint | 流程描述... |
| 2 | §Y 标题 | comparison | vector-illustration | 对比描述... |
```

### Step 3: 确认方案

用 AskUserQuestion 确认，1 次最多 4 问：

| Q | 内容 |
|---|------|
| Q1 | 类型/预设 (推荐 + 备选) |
| Q2 | 密度 (per-section 推荐 / balanced / minimal) |
| Q3 | 风格 (推荐 + 备选) |
| Q4 | 色板 (默认 / macaron / warm / neon) |

### Step 4: 生图

调用浏览器流程逐张生成（见下文「浏览器操作」部分）。

### Step 5: 插入文章

```markdown
### 段落标题

![描述](images/article-slug/01-concept-name.png)

正文...
```

## 浏览器操作流程

### Step B1: 启动并登录

```bash
B="/home/fenghaolin/.claude/skills/gstack/browse/dist/browse"

# 清理旧进程
kill $(cat "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json" 2>/dev/null | grep -o '"pid":[0-9]*' | grep -o '[0-9]*') 2>/dev/null || true
sleep 1
rm -f "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json"

# 连接有头浏览器
$B connect

# 注入 Google cookies（从 danger-gemini 会话）
python3 -c "
import json, subprocess
with open('$HOME/.local/share/baoyu-skills/gemini-web/cookies.json') as f:
    data = json.load(f)
for name, value in data.get('cookieMap', {}).items():
    subprocess.run(['$B', 'cookie', f'{name}={value}'], capture_output=True, timeout=3)
"

# 导航到 Gemini
$B goto https://gemini.google.com
sleep 3
# 如果有 cookie 弹窗，点接受
$B snapshot -i | grep '全部接受' && $B js "Array.from(document.querySelectorAll('button')).find(function(b){return b.textContent.includes('全部接受')}).click();'ok'"
```

### Step B2: 进入生图模式

```bash
# 点击「制作图片」按钮
$B js "Array.from(document.querySelectorAll('button')).find(function(b){return b.textContent.includes('制作图片')}).click();'imgmode'"
sleep 2
# 验证：应看到 textbox
$B snapshot -i | grep '为 Gemini 输入提示'
```

### Step B3: 输入并发送

```bash
# 聚焦 textbox 并打字
$B js "document.querySelector('[aria-label*=\"为 Gemini 输入提示\"]').focus();'ok'"
sleep 1
$B type "你的图片 prompt ..."

# 按 Enter 发送
$B press Enter
```

### Step B4: 等待并提取

```bash
sleep 50  # 等待生图

# 检查是否生图成功
$B snapshot -i | grep 'AI 生成'

# 提取最后一张 blob 图片
$B js "
(function() {
  var imgs = Array.from(document.querySelectorAll('img')).filter(function(i){
    return i.naturalWidth>100 && i.src.startsWith('blob:');
  });
  var last = imgs[imgs.length-1];
  var c = document.createElement('canvas');
  c.width = last.naturalWidth; c.height = last.naturalHeight;
  c.getContext('2d').drawImage(last, 0, 0);
  return JSON.stringify({w:last.naturalWidth, h:last.naturalHeight, data:c.toDataURL('image/png')});
})()
" | python3 -c "
import json,sys,base64
d=json.loads(sys.stdin.read().strip())
b64=d['data'].split(',',1)[1]
with open('output.png','wb') as f: f.write(base64.b64decode(b64))
print(f'Saved ({d[\"w\"]}x{d[\"h\"]})')
"
```

### Step B5: 清理

```bash
$B disconnect
```

## Prompt 写作

### 结构化 Prompt 模板（信息图/图表用）

```
A [type] showing [content]. [layout description]. [style cues]. [color scheme].
```

示例：
```
A comparison diagram with three columns showing nano vs mini vs 4o.
Each column has a colored bar for speed and cost.
Bold geometric shapes, flat modern vector art style.
Blue green orange palette, white background.
```

### 视觉风格 Prompt 模板（场景/概念用）

```
A [adjective] [subject] in [style], [lighting], [mood], [composition details].
```

## 注意事项

- **「制作图片」按钮**：在 Gemini 主页（非对话内）出现。点击后应进入生图模式（textbox 出现）
- **生图模式指示器**：如果看到「取消选择"制作图片"」按钮 = 确认在生图模式
- **每次文本回复后模式重置**：需要重新点击「制作图片」进入生图
- **Cookie 有效期**：danger-gemini 的 cookie 可能过期，需要时运行 `bun <danger-gemini>/main.ts --login` 刷新
- **图片格式**：blob URL → Canvas → PNG，通常 1024x559

## 故障排查

| 问题 | 解决方案 |
|------|---------|
| 浏览器连不上 | `$B connect` 重新连接 |
| 未登录 | 检查 cookie 注入，必要时 `bun ... --login` 重新认证 |
| ref 过期 | `$B snapshot -i` 获取最新 ref |
| 生图模式不激活 | 切换到 Gemini 主页 → 点「发起新对话」→ 点「制作图片」 |
| 图片一直不生成 | 等 60 秒，检查是否有「答得好」按钮 |
| 提取的图片重复 | 只提取最后一个 blob（`imgs[imgs.length-1]`） |
| 文字渲染不准 | Gemini 中文文本能力有限，label 尽量用英文或简短 |

## 实际案例

### 案例 1: 智能客服建设指南（信息图）
- 5 张信息图：timeline, framework, flowchart, comparison, framework
- 风格：blueprint
- 生成时间：~5 分钟

### 案例 2: 概念艺术配图（已废弃，改用信息图）
- 5 张概念图：摄影/抽象/路标/机器人/风景
- 风格：visual description
- 结论：信息图方案更优

### 案例 3: 意图分类分析（待配图）
- 5 张：comparison, framework, flowchart, comparison, flowchart
- 风格：vector-illustration
- 类型匹配：技术文章 → infographic/flowchart/comparison + vector-illustration
