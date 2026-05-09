---
title: "Harness Engineering（驭化工程）"
date: "2026-05-09"
---

# Harness Engineering（驭化工程）

> 为 AI 编程 Agent 设计可靠运行环境的工程学科，不优化模型本身，而是系统性设计围绕模型的约束、上下文、工具与反馈机制。

## Key Points

- 核心公式：AI 编程 Agent = AI 模型(s) + 驭化层（Harness），驭化层是 Agent 系统的操作系统
- 三大支柱：上下文工程、架构约束、熵管理
- 核心洞察：Agent 的可靠性瓶颈不是模型，是环境——同模型不同驭化，性能差异可达 36 个百分点
- 工程师角色转变：从亲手写代码到设计让 Agent 能写好代码的环境

## Details

### 历史背景

2023-2024 年为 Copilot 式行级自动补全阶段；2025 年下半年开始大规模实验自治 Agent。转折点数据：OpenAI 3 人 × 5 月 = 100 万行代码，Stripe 每周 1300+ PR 全自动合并。

### 核心操作原则

1. 把 Agent 失败视为系统设计问题
2. 环境设计优于提示词调整
3. 渐进式披露，而非全量注入
4. 人类品味一次性编码，持续机械化执行
5. 验证循环替代人工 QA

### 重要警告

驭化工程不等于写更多 prompt、装更多 MCP 服务器、创建更详细的 AGENTS.md。过多工具会让 Agent 进入"愚蠢区"。

## Context

来源于 Conn-Ho/harness-engineering 仓库，是对 OpenAI、Stripe、LangChain 等团队实践的系统性总结。

## Related Pages

- [[patterns/context-engineering]]
- [[patterns/architectural-constraints]]
- [[patterns/entropy-management]]
- [[comparisons/harness-vs-scaffolding]]
- [[comparisons/ai-coding-tools]]

## Sources

- GitHub Conn-Ho/harness-engineering: docs/md/guide/ai/harness/concepts/00-overview.md
