---
title: "AI 全自动生成图书号短视频：Codex + HyperFrames + VoxCPM 全流程拆解"
date: "2026-07-02"
source: "X @Bytec99 (Bytec)"
url: "https://x.com/Bytec99/status/2075372048994672994"
---

# AI 全自动生成图书号短视频

> Bytec 基于 @369Serena 的流程做的图书号短视频自动化方案，把 5 个开源工具串成 12 步流水线，中间只保留 2 个确认点（文案 + 图片）。

## 一句话总结

让 AI 自己选书 → 抓书评 → 写旁白 → 出图 → 配音 → 转字幕 → 加 BGM → 用代码合成视频，只需要给一本书名（或让 AI 推荐），就能全自动跑出一条图书号短视频。

## 链路核心：在 Serena 流程上的改造

Bytec 是在 [@369Serena 老师](https://x.com/369Serena) 的流程基础上做的改造，核心差异：

| 节点 | Serena 原版 | Bytec 改造版 |
|------|-----------|------------|
| 资料来源 | 自己找书评 | **微信读书 Skill** 自动抓热门划线 + 书评 |
| 配音 | 云端 TTS API | **VoxCPM** 本地声音克隆（无需 API） |
| 字幕 | 手工估算时间点 | **faster-whisper** 取真实字幕时间轴（音画同步） |
| 视频合成 | 传统剪辑工程 | **Codex + HyperFrames** 用代码生成（更适合 Agent） |

## 6 个核心工具

| 工具 | 作用 | 备注 |
|------|------|------|
| **HyperFrames** | HTML/CSS/JS 做视频合成 | Agent 友好，背景图/字幕/音频/转场都写在代码里 |
| **微信读书 Skill** | 查书籍信息 + 热门划线 + 书评 | 装在 Codex 内 |
| **VoxCPM** | 本地 TTS + 声音克隆 | 免 API，OpenBMB 开源 |
| **faster-whisper** | 音频转字幕时间戳 | 仅取时间，文字用确认过的旁白稿 |
| **FFmpeg** | 声音后期 + BGM ducking + 格式转换 | 处理响度、压缩、回声、闪避 |
| **yt-dlp** | 公开视频/音频素材下载 | 备用素材源 |

## 12 步流水线

```
输入书名 ──→ 微信读书 Skill 查资料
            ↓
         选 30 秒传播角度
            ↓
         生成 30s 中文旁白 ──→ ⚠️ **确认 1：文案**
            ↓
         3-4 张统一风格背景图 ──→ ⚠️ **确认 2：图片**
            ↓
         VoxCPM 一次生成完整旁白音频
            ↓
         faster-whisper 取真实时间轴
            ↓
         FFmpeg：BGM ducking + 后期
            ↓
         HyperFrames 用代码合成预览
            ↓
         🔍 跑 lint/inspect/validate
            ↓
         渲染 MP4
```

## 4 个关键经验（踩坑心得）

### 1. 图片不放文字

> 一定要提示 Codex 不要把文字做进图片里。中文字 AI 容易画错。**图片只负责氛围，书名/作者/字幕用 HTML/CSS 叠加**。

### 2. 旁白要一次生成，不要拼接

分段生成会导致音色、情绪、节奏不一致。

```bash
# VoxCPM 当前稳定参数
--cfg-value 2.0
--inference-timesteps 10
# 快速测试可降到
--inference-timesteps 8
```

### 3. 字幕对齐：时间用 whisper，文字用旁白稿

faster-whisper 识别书名/人名/专有名词容易错。**只用它的真实时间点，文字用确认过的最终旁白稿**。这样既音画对齐又不被识别错误带偏。

### 4. BGM ducking 用 sidechaincompress

不是简单铺一层音乐，而是：旁白说话时自动压低，旁白停顿时稍回来。

```bash
sidechaincompress=threshold=0.012:ratio=8:attack=45:release=650:makeup=1.4
```

BGM 前奏太长可以从中间开始截（`-ss 19`），30 秒视频拖不起长前奏。

## FFmpeg 后期处理全套参数

```bash
volume=-2dB,
highpass=f=70,                    # 去掉低频浑浊
lowpass=f=13500,                  # 避免声音太刺
acompressor=threshold=-20dB:ratio=2.2:attack=18:release=180:makeup=1.5,  # 让旁白更稳
aecho=0.7:0.14:34:0.06,          # 加一点点空间感
loudnorm=I=-16:TP=-1.5:LRA=8,    # 响度标准化到短视频水平
aresample=48000
```

## faster-whisper 参数

```bash
--language zh
--compute-type int8
```

## HyperFrames 提交前自检

```bash
npx hyperframes lint
npx hyperframes inspect
npx hyperframes validate
```

检查项：报错、布局溢出、字幕遮挡、文本对比度、音频轨道衔接。

## 为什么这条链路很重要

> 等链路真正跑顺之后，文案和图片确认也可以省略，变成每天自动跑几条候选视频。**最后人只负责挑选、微调和发布。**

AI 做自媒体最有意思的地方：**不是只生成一次内容，而是把一个内容品类，做成一条可以持续复用的生产流程**。

## 旁白写作 3 个禁忌

- 少用「不是……而是……」结构
- 少用强行排比
- 别一上来就说「这本书告诉我们」

## 相关资源

- [Bytec 改造的原作 @369Serena](https://x.com/369Serena) — 流程原作者
- [HyperFrames](https://github.com/) — HTML/CSS/JS 视频合成
- [VoxCPM](https://github.com/OpenBMB/VoxCPM) — 本地声音克隆 TTS
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) — 高效音频转写
- [FFmpeg](https://github.com/FFmpeg/FFmpeg) — 音频处理瑞士军刀
- [相关 Skill 整理](/md/wiki/sources/codex-video-production-skills) — Codex 视频制作 6 个 GitHub Skills

---

*—— 来源：X @Bytec99（Bytec），222 行原文，本摘要保留完整 12 步流水线 + 5 张关键截图，全图已归档至同目录 images。*
