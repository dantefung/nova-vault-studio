---
title: "Haosen：视频字幕不想手敲？这 5 个工具，按用途选"
date: "2026-10-29"
source: "X/Twitter"
author: "Haosen (@Haosen9527)"
url: "https://x.com/Haosen9527/status/2115294927617941861"
coverImage: "../images/haosen-5-video-subtitle-tools/001.jpg"
---

# Haosen：视频字幕不想手敲？这 5 个工具，按用途选

> 按任务类型拆分的 5 个开源字幕工具：Subtitle Edit（语音转写 + 校对）、video-subtitle-remover（AI 修补硬字幕）、video-subtitle-extractor（本地 OCR 提取画面文字）、译幕 Zimoo（字幕文件翻译）、auto-subtitle（Whisper + ffmpeg 命令行批量）。附按素材类型选路线的决策表与「先定剪辑再改字幕」的顺序纪律。

<!-- more -->

口播录完了，字幕还得改错字、拆长句，再拖着时间轴对一遍。反复处理这些活，可以先让工具生成初稿，把时间留给校对。

这份清单覆盖字幕编辑、语音识别、画面文字提取、硬字幕去除和翻译。五个项目的用途不同，先看自己缺哪一步，不必全部装上。

1. Subtitle Edit，先生成，再把字幕改准

地址（[https://github.com/SubtitleEdit/subtitleedit](https://github.com/SubtitleEdit/subtitleedit)）。

它能修改字幕文字、调整时间、转换格式，也能配合语音识别引擎从音频生成字幕。普通创作者想少碰命令行，可以先从这个图形界面工具试起。

入门时，到发布页选择适合自己系统的版本（[https://github.com/SubtitleEdit/subtitleedit/releases](https://github.com/SubtitleEdit/subtitleedit/releases)）。

打开视频，进入“Video → Speech to text”，选择可用引擎、模型和音频语言，再转写。识别后重点检查人名、数字和断句，最后保存为 SRT。首次使用本地引擎通常要下载引擎与模型文件。

2. video-subtitle-remover，处理已经压进画面的字幕

地址（[https://github.com/YaoFANGUK/video-subtitle-remover](https://github.com/YaoFANGUK/video-subtitle-remover)）。

有些字幕已经和画面合在一起，播放器里关不掉。这个工具会识别字幕区域，再用 AI 修补被文字覆盖的位置，适合给自己的旧视频更换字幕。

它提供本地运行路线，无需申请第三方处理 API，但仍要花本机算力和处理时间。复杂背景与快速运动区域要看实际效果，保持分辨率也不等于能恢复被遮住的原始细节。

下载入口（[https://github.com/YaoFANGUK/video-subtitle-remover/releases](https://github.com/YaoFANGUK/video-subtitle-remover/releases)）。按操作系统与硬件选择包，先拿短片段检查字幕区域，再处理长视频。

3. video-subtitle-extractor，把画面里的字幕变成 SRT

地址（[https://github.com/YaoFANGUK/video-subtitle-extractor](https://github.com/YaoFANGUK/video-subtitle-extractor)）。

手里只有视频，没有字幕文件时，可以让它识别画面上已有的文字，导出 SRT 或 TXT，再继续校对、翻译或整理内容。

它采用本地 OCR，也就是读取画面里的字。视频没有可见字幕时，应当走语音转写路线。

下载入口（[https://github.com/YaoFANGUK/video-subtitle-extractor/releases](https://github.com/YaoFANGUK/video-subtitle-extractor/releases)）。打开视频、调整字幕区域，再运行提取。文字太小、遮挡、花字和复杂背景都值得抽查，别把识别结果直接当定稿。

4. Translate-Subtitle-File，已有字幕再做翻译

地址（[https://github.com/1c7/Translate-Subtitle-File](https://github.com/1c7/Translate-Subtitle-File)）。

项目当前叫“译幕（Zimoo）”，支持 SRT、ASS、VTT 字幕文件，可按配置输出译文或双语字幕。

使用时先准备字幕文件，再配置服务商与 API，选择源语言、目标语言和输出方式。机器翻译完成后，仍要核对术语、人物称呼和上下文，尤其是前后几句连起来才完整的意思。

它有网页与桌面入口（[https://zimoo.app](https://zimoo.app/)）。软件使用条件和翻译服务费用要分别确认，不能把 GitHub 上有项目理解成翻译全程免费。

5. auto-subtitle，适合命令行与重复处理

地址（[https://github.com/m1guelpf/auto-subtitle](https://github.com/m1guelpf/auto-subtitle)）。

它通过 Whisper 识别视频里的语音，再用 ffmpeg 把字幕烧进视频，也支持只输出 SRT，方便先校对再合成。

需要准备 Python、ffmpeg 和相应模型。安装完成后，中文视频可以先用下面的命令只生成字幕文件。

auto_subtitle “video.mp4” --language zh --task transcribe --model small --srt_only True -o “subtitles”

把 video.mp4 换成视频路径，生成后用 Subtitle Edit 打开字幕校对。中文识别不要选名称以 .en 结尾的英语专用模型；这里的 translate 任务则是翻成英语，不能当成任意语言互译开关。

按手里的素材选路线

- 自己录的口播还没字幕，可以直接试 Subtitle Edit 的语音转写；熟悉命令行时，也可用 auto-subtitle 先出 SRT，再校对。
- 视频里已经有硬字幕，缺少可编辑文件，用 extractor 提取；想换掉旧字时，再按需要用 remover 处理画面。
- 已经有 SRT、ASS 或 VTT，需要另一种语言，用译幕翻译后再复核。

修改字幕前先把视频剪辑定下来。后续再删一段、变一次速，字幕时间也要跟着调整。保留一份可编辑字幕文件，确认文字和时序以后，再决定是否烧进成片。

## 相关页面

- [[patterns/story-studio-video-pipeline]]
- [[sources/leaf-sanren-seecut-video-pipeline]]
- [[patterns/pre-publish-compliance-check]]
