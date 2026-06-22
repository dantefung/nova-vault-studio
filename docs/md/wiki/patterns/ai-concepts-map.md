---
title: "AI Concepts Relationship Map"
date: "2026-06-16"
source: "一篇文章讲清楚AI基础概念：LLM、token、Prompt、Agent、Skill、RAG、Harness"
url: "https://mp.weixin.qq.com/s/96bg1YgNQZsR8Q9cMdEMiw"
---

# AI Concepts Relationship Map

AI 基础概念关系图谱，从底层到应用层。

## 概念层次

| 层级 | 概念 | 说明 |
|------|------|------|
| 底层 | LLM | 大语言模型，AI 的"大脑"，负责思考 |
| 底层 | GPU | 图形处理单元，提供计算能力 |
| 底层 | 神经网络 | AI 底层技术，复杂数学函数 |
| 底层 | 机器学习 | 调整神经网络参数的技术 |
| 底层 | Token | 模型眼中的语言基本单位 |
| 应用层 | Prompt | 提示词，指挥 AI 干活的指令 |
| 应用层 | Prompt Engineering | 提示词工程，如何写好指令 |
| 应用层 | Context | 上下文，影响当前对话的全部背景 |
| 应用层 | Context Window | 上下文窗口，AI 单次任务的最大容量 |
| 应用层 | AI Agent | 智能体 = LLM(大脑) + Harness + Tools(手脚) |
| 应用层 | Tool | 工具，给 AI 用的软件 |
| 应用层 | Skill | 技能，AI 的"操作手册"SOP |
| 应用层 | RAG | 检索增强生成，解决知识冻结问题 |
| 应用层 | Harness | 驾驭工程，让 AI 不跑偏 |
| 现象 | Hallucination | 幻觉，AI 一本正经的胡说八道 |

## 核心公式

```
Agent = Model(LLM) + Harness
```

模型负责思考，Harness（提示词、上下文、工具、记忆、配置等）负责确保稳定可靠完成任务。

## 概念关系

- **LLM** 是底层大脑
- **Prompt/Context** 是输入
- **AI Agent** = LLM + Harness + Tools
- **Skill** = 操作手册 + Tools + 资源，打包给 Agent 调用
- **RAG** 解决 LLM 知识冻结问题
- **Harness** 包含 Prompt、Context、Tools、Memory、配置文件等

## 来源

作者 Harry，著有《人工智能故事书》
