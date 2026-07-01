---
title: "Codex 视频制作：6 个必装 GitHub Skills"
date: "2026-06-30"
source: "整理"
---

# 装完 Codex 不知道干什么？当然是做视频搞钱！

> 给 Codex 装上这 6 个 GitHub Skills，直接让它参与整条视频制作流程。

<!-- more -->

## Skills 清单

### 1. HyperFrames — 一句话生成动效视频

告诉 Codex 视频主题，它可以用 HTML/CSS/动画制作产品介绍、动态海报、知识视频和 PPT 风格视频，最后渲染为 MP4。

适合把文章、推文、产品介绍快速改成视频。

**GitHub**：https://github.com/heygen-com/hyperframes

### 2. video-use — 让 Codex 帮你剪视频

把拍摄素材交给 Agent，它可以协助删除停顿、错误片段和口头禅，继续处理字幕、音频、调色与画面动效。

适合经常制作口播、教程和采访视频的人。

**GitHub**：https://github.com/browser-use/video-use

### 3. Remotion Skills — 用代码批量制作视频

Remotion 官方提供的 Agent Skills。让 Codex 用 React 编写视频，统一控制画面、字幕、动画和时间轴。

特别适合批量制作排行榜、数据周报、产品更新和固定栏目视频。

**GitHub**：https://github.com/remotion-dev/skills

### 4. Generative Media Skills — AI 视频生成工具箱

覆盖图片、视频和音频生成，可以调用 AI 模型制作产品广告、UGC 视频、音乐视频和社交媒体短片。

部分功能需配置 MuAPI 并产生生成费用。

**GitHub**：https://github.com/SamurAIGPT/Generative-Media-Skills

### 5. videocut-skills — 中文视频剪辑 Agent

面向中文创作者的视频剪辑 Skills，让 Agent 理解剪辑需求，协助处理素材、字幕和短视频制作流程。

中文用户想用 Claude Code 或其他 Agent 剪视频，可以重点研究。

**GitHub**：https://github.com/Ceeon/videocut-skills

### 6. seedance2-skill — 帮即梦写专业视频提示词

告诉 Codex 一个视频创意，它会帮你设计逐秒分镜、人物动作、运镜、对白、音效，以及素材引用方式。

生成的提示词可以直接交给即梦 Seedance 2.0 制作核心镜头。

**GitHub**：https://github.com/dexhunter/seedance2-skill

## 推荐搭配方案

| 视频类型 | Skills 组合 |
|----------|------------|
| 文章/推文转视频 | HyperFrames |
| 真人口播/采访剪辑 | video-use + HyperFrames |
| 批量制作固定栏目 | Remotion Skills + HyperFrames |
| AI 短剧/广告视频 | seedance2-skill + 即梦 + video-use |
| 大量测试 AI 视频玩法 | Generative Media Skills |

## Codex 视频工作流

用这些 Skills 串成自己的视频工作流后，只需要告诉 Codex：

> 把这篇推文做成一条 45 秒竖版视频，前三秒抓住注意力，添加中文配音和动态字幕，完成后检查画面与音量。

剩下的脚本、分镜、提示词、剪辑和包装，都可以交给 Codex 一步步完成。
