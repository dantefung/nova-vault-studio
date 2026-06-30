---
title: "Prompt-as-Code"
date: "2026-06-30"
source: "sources/gpt-image2-prompts"
---

# Prompt-as-Code

> 将提示词从自然语言散文转变为结构化、可组合、可自动化的代码式组件（JSON/YAML），让 AI Agent 能够确定性地产出提示词，实现零幻觉、一次成型的批量生图工作流。

## 核心洞察

传统的提示词库是「一堆精致的标本」——几百个像散文一样的句子，人看没问题，但 Agent 无法稳定解析和复用。

Prompt-as-Code 的解决思路：把提示词当作代码来写。

## 三组件架构

- **原子化 Schema 注入**：将视觉要素（主体、光影、材质、排版）全部降维为 JSON/YAML 结构化组件。Agent 闭着眼都能稳定解析，零幻觉
- **零配置工作流**：抹平使用门槛，随时无缝接入大模型数据管线
- **多维决策矩阵**：针对 GPT-Image 2 强大的文本排版能力，引入精确的空间坐标系约束，干掉传统 NLP 控制不了画面排版的技术盲区

## 应用场景

- Agent 自动出图（Codex + GPT-Image 2 工作流）
- 批量生成公众号封面图
- 批量材料设计（海报、信息图、产品图）

## 相关页面

- [[prompt-engineering|Prompt Engineering]]
- [[gpt-image2-prompts|sources 原文]]

## 来源

- 苍何. [《我逆向了 329 条 GPT-Image2 提示词模板，全部开源！》](../sources/gpt-image2-prompts.md). 2026-06-30. X/Twitter.
- 开源仓库: https://github.com/freestylefly/awesome-gpt-image-2
