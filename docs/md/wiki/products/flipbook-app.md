---
title: "Flipbook Canvas（交互式知识图谱）"
date: "2026-06-11"
---

# Flipbook Canvas（交互式知识图谱）

> Click-to-explore knowledge picture-book. 长按图片任意位置，系统自动识别内容，联网搜索相关资料，生成全新详细图解，层层递进。

## Key Points

- **核心创新**：把每张图变成可玩的知识表面，点击生成子节点，无限探索
- **多模态 Pipeline**：Text/LLM规划 + 图像生成 + 网络搜索 + OCR + TTS
- **无限知识树**：每次点击生成子节点，整棵树持久化、可分享、可回放
- **技术栈**：Express + SSE 后端，Vite + React + TypeScript 前端，SQLite

## 核心功能

- **点击探索**：长按（1秒）图片任意位置，模型识别内容，决定是否联网搜索，生成带标注的子图
- **百科风格输出**：每个节点含 150-220 字符 caption + 20-40 个图内标签，全部 OCR 可框选复制
- **空间 + 语义去重**：同一区域再次点击直接跳转，不重复生成
- **实时生成可见**：点击瞬间节点就保存并可分享

## 多模态 Pipeline

| 模态 | 功能 | 可插拔 |
|------|------|--------|
| Text / JSON LLM | 规划器、点击标签推断、是否搜索判断 | ✅ 任何 chat-completion 模型 |
| 图像生成 | 结构化提示词 → 2752×1536 带标注图解 | OpenAI / Nano Banana / Seedream / Codebuddy |
| 网络搜索 | 重述查询 → top-N 结果 → 规划器上下文 | 任何搜索后端 |
| OCR（Apple Vision） | 识别图内文字 → 可选择文本层 | 本地，无需 API Key |
| TTS（Edge 神经语音） | 节点标题+caption 合成语音 | Microsoft Edge 在线语音，无需 API Key |

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

## 数据

- **142 Stars** · **7 Forks** · **102 Commits**
- JavaScript 55.3% · TypeScript 32.6% · CSS 7.6%

## Related Pages

- [products/index](products/index) — AI 产品索引

## Sources

- GitHub imcuttle/flipbook-app (2026-06-04)