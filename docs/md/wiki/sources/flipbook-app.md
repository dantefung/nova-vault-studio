---
title: "Flipbook Canvas — 点击式探索的 AI 生成知识树（142 Stars）"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/imcuttle/flipbook-app"
---

# Flipbook Canvas — 点击式探索的 AI 生成知识树（142 Stars）

> Click-to-explore knowledge picture-book. 长按图片任意位置，系统自动识别内容，联网搜索相关资料，生成全新详细图解，层层递进。每张图都带百科风格文字标注和说明，图上文字可直接框选复制。

<!-- more -->

## 核心创新

传统"AI 生图"只停在单张图片。Flipbook Canvas 把每张图变成**可玩的知识表面**：长按任意位置 → 模型推断点击内容 → 判断是否需要联网搜索 → 生成带标注的子图。

**层层递进，无限探索。**

## 核心功能

- **点击探索**：长按（1秒）图片任意位置，模型识别内容，决定是否联网搜索，生成子节点
- **百科风格输出**：每个节点含 150-220 字符 caption + 20-40 个图内标签（地名/日期/数字），全部 OCR 可框选复制
- **无限知识树**：每次点击生成子节点，整棵树持久化、可分享、可回放
- **实时生成可见**：点击瞬间节点就保存并可分享，标题/caption/提示词逐字打字效果流出
- **空间 + 语义去重**：同一区域再次点击直接跳转，不重复生成

## 多模态 Pipeline

| 模态 | 功能 | 可插拔 |
|------|------|--------|
| **Text / JSON LLM** | 规划器、点击标签推断、是否搜索判断 | ✅ 任何 chat-completion 模型 |
| **图像生成** | 结构化提示词 → 2752×1536 带标注图解 | OpenAI / Nano Banana / Seedream / Codebuddy |
| **网络搜索** | 重述查询 → top-N 结果 → 规划器上下文 | 任何搜索后端 |
| **OCR（Apple Vision）** | 识别图内文字 → 可选择文本层 | 本地，无需 API Key |
| **TTS（Edge 神经语音）** | 节点标题+caption 合成语音，每个 flipbook 可选角色语音 | Microsoft Edge 在线语音，无需 API Key |

## 技术架构

```
server/          # Express + SSE 后端
  └── src/
      ├── generation/   # Pipeline：generateRoot + expandFromClick
      │   ├── planner.js      # 规划器
      │   ├── clickLabel.js  # 点击标签推断
      │   ├── decideSearch.js # decide-then-search 判断门
      │   ├── webSearch.js   # 搜索子进程
      │   ├── image.js       # provider-chain 编排器
      │   └── providers/     # codebuddy/openai/nanobanana/seeddance/svg
      ├── export/        # 静态网站导出
      └── db/           # SQLite（Sequelize）元数据索引

web/            # Vite + React + TypeScript 前端
```

## 存储

- **文件系统**（大文件真相源）：`server/data/canvases/<id>/`
- **SQLite**：Canvas / Node / Hotspot / ShareLink / Sources 表，驱动画廊、空间去重、分享查找、来源悬停面板

## 导出能力

- **本地 zip 导出**：完整静态网站（含所有数据和图片内联）
- **本地静态服务**：`npm run serve-preview -- <canvasId>`
- **发布到 GitHub Pages**：一个或多个 canvas → 路由画廊
- 导出镜像实时只读预览：图片热点+标签+可选择 OCR 文本+caption+面包屑+目录+来源，**语音叙事也打包进离线静态网站**

## 实时协作

- **分享链接**：`POST /api/canvas/:id/share` → 只读预览 URL
- **SSE 实时推送**：观看者可以看到生成过程实时流入
- **全屏投射**：浏览器全屏 + 可隐藏面包屑/标题/提示

## 技术栈

- Express + SSE 后端
- Vite + React + TypeScript 前端
- SQLite（Sequelize）
- Node.js / Apple Vision OCR / Microsoft Edge TTS

## 数据

- **142 Stars** · **7 Forks** · **102 Commits**
- JavaScript 55.3% · TypeScript 32.6% · CSS 7.6%