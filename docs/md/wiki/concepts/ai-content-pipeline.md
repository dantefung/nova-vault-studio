---
title: "AI 内容工厂流水线（Content Production Pipeline）"
date: "2026-07-02"
source: "整理自 sources/ai-book-short-video-pipeline.md"
url: "https://x.com/Bytec99/status/2075372048994672994"
---

# AI 内容工厂流水线（Content Production Pipeline）

> 把内容生产从「一次性生成」变成「可复用的工程化流水线」——人负责挑选微调，AI 负责跑完全流程。

## 一句话定义

把多个开源工具（资料、文本、图像、音频、视频、字幕）通过 Agent 编排成一条确定性的 12 步流水线，输入一个变量（书名/选题），输出一个成品（短视频/图文/文章），中间只保留极少数确认点。

## 典型案例：图书号短视频 12 步

完整案例见 [[sources/ai-book-short-video-pipeline]]。

```
输入书名 → 资料抓取 → 角度选择 → 旁白生成 (⏸ 确认 1)
         → 背景图生成 (⏸ 确认 2) → 配音 → 字幕对齐 → 后期
         → 视频合成 → 检查 → 渲染 MP4
```

## 4 个核心设计原则

### 1. 分阶段确认（关键心法）

Bytec 的链路里**只保留 2 个确认点**：
- **文案确认**：旁白稿、时长、传播角度、资料来源
- **图片确认**：3-4 张统一风格背景图

其余环节（配音、字幕、BGM、合成、渲染）**全部自动化**。

> 等链路真正跑顺后，确认点也能省略 → 自动每天跑几条候选 → 人只负责挑选微调。

### 2. 用代码做视频（Agent 友好）

不用传统剪辑工程（PR、Final Cut），而是用 **HTML/CSS/JS** 写视频：

| 元素 | 实现方式 |
|------|---------|
| 背景图 | HTML 元素 |
| 字幕 | HTML/CSS 叠加 |
| 转场 | CSS 动画 |
| 音频 | 标签轨道 |
| 渲染 | HyperFrames CLI |

**好处**：Agent 可以直接读写代码，不需要操作 GUI 剪辑软件。

### 3. 音频三件套：TTS × 后期 × ducking

**完整链路**：

```
VoxCPM 生成旁白 → faster-whisper 取时间轴
        ↓
FFmpeg 声音后期：highpass + lowpass + compressor + aecho + loudnorm
        ↓
FFmpeg BGM ducking：sidechaincompress（旁说话 → BGM 自动压低）
```

**核心坑**：

- **不要分段生成**：分段拼接会出现音色、情绪、节奏不一致
- **字幕只用时间，文字用旁白稿**：faster-whisper 识别书名/人名会错
- **BGM 闪避参数**：用 sidechaincompress，不是简单铺音乐

### 4. 自检三步走

导出 MP4 前跑：

```bash
npx hyperframes lint       # 检查错误
npx hyperframes inspect    # 检查布局溢出
npx hyperframes validate   # 检查字幕/对比度/音频轨道
```

## 与传统内容生产的差异

| 维度 | 传统 | AI 流水线 |
|------|------|----------|
| 产出 | 一次性 | 持续复用 |
| 工具协作 | 人工剪贴 | 工具串联 |
| Agent 友好 | ❌ GUI | ✅ 代码/CLI |
| 边际成本 | 线性 | 接近零 |
| 人的角色 | 制作人 | 选品/微调 |

## 适用场景特征

✅ **适合做流水线的内容品类**：

- 图书号、好物号、知识号（结构化选题）
- 30 秒短视频（时长固定）
- 视觉风格统一（3-4 张图，色调一致）
- 信息密度可标准化

❌ **不适合**：

- 强创意/强个人风格（Vlog、个人 IP）
- 视觉多变、节奏自由（电影解说、纪录片）
- 强情绪表达（情感号、剧情号）

## 工具栈速查

| 环节 | 工具 | 备注 |
|------|------|------|
| 资料 | 微信读书 Skill / web fetch | 结构化抓取 |
| 文本 | Codex/Claude/GPT | 选角度 + 旁白 |
| 图像 | 即梦/Midjourney/GPT-Image | **不放文字** |
| 配音 | **VoxCPM** / GPT-SoVITS / CosyVoice | 本地克隆免 API |
| 字幕 | **faster-whisper** | 只取时间轴 |
| 后期 | **FFmpeg** | ducking + loudness |
| 合成 | **HyperFrames** / Remotion | 代码做视频 |

## 相关资源

- [[sources/ai-book-short-video-pipeline]] — 完整 12 步案例（Bytec @Bytec99）
- [[sources/codex-video-production-skills]] — Codex 视频制作 6 个 GitHub Skills
- [[sources/codex-app-beginner-tutorial]] — Codex App 入门（理解 Agent 工作台）
- [[concept-content-factory]] — 主题级内容工厂（同一思想，更大范围）
