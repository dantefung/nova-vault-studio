---
title: "我用 Codex 跑视频字幕的大致流程"
source: "微信公众号-狂奔滴小马"
url: "https://mp.weixin.qq.com/s/Xe06pFpo9h6uXUsUotk4FQ"
---

# 我用 Codex 跑视频字幕的大致流程

核心链路：**音频 -> SRT -> 修字幕 -> ASS -> 烧录到视频 -> 抽帧检查**

## 安装前提

依赖两样：FFmpeg + whisper.cpp（本地语音识别，不传云端）

- whisper.cpp 模型：ggml-small.bin（中文口播、教程录屏够用）
- 专有名词多的内容交给大模型做第二轮字幕修复

## 生成 SRT 字幕

```bash
whisper-cli -m ./ggml-small.bin -f speech.mp3 -l zh -ng -osrt -of speech
```

SRT 只解决"听出来什么"和"什么时候显示"，不负责样式。

## 修复字幕文本

大模型只做三件事：
- 只修复错别字、标点和专有名词
- 不改变句子原意
- 不合并或拆分字幕条目，不修改时间戳

## 控制字幕长度

- 中文 12-20 字
- 显示时间不低于 0.8 秒，不超过 5 秒
- 长句按标点、语义停顿拆开

## 转 ASS 并套样式

白字半透明黑底，底部居中，按视频真实分辨率设置字号和边距。

## 烧录字幕

```bash
ffmpeg -i input.mp4 -vf "ass=subtitle.ass" output.mp4
```

烧完抽一帧检查效果：
```bash
ffmpeg -y -ss 00:00:03 -i output.mp4 -frames:v 1 subtitle_check.jpg
```

## 顺手生成封面

从字幕提取关键词，大模型生成封面文案：
```
Codex 自动加字幕
语音识别、ASS 样式、FFmpeg 烧录
```

封面图转视频，拼接到正文开头。

## Codex 的角色

Codex 不是剪辑软件，而是把本地工具串起来的**工程助手**：

| 工具 | 职责 |
|------|------|
| whisper.cpp | 语音识别 |
| 大模型 | 修错字、提关键词、生成封面文案 |
| 脚本 | SRT、ASS、时间线和样式参数 |
| FFmpeg | 合成音视频、烧录字幕、抽帧检查、拼接封面 |
| 人 | 最后判断效果 |

优势：可重复、可检查、可替换。后续可整理成 Codex skill。