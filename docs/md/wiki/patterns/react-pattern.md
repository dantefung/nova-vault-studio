---
title: "ReAct（推理与行动）"
date: "2026-05-09"
---

# ReAct（推理与行动）

> 结合推理(Reasoning)和行动(Acting)的 Agent 循环模式。

## Key Points

- 核心循环：思考 → 行动 → 观察 → 再思考
- 让 LLM 不仅能推理，还能调用外部工具获取信息
- 是现代 AI Agent 的基础架构模式
- 平衡了 CoT 的推理能力和工具使用能力

## Details

ReAct 模式让模型在推理过程中可以调用搜索引擎、API、数据库等外部工具，根据工具返回的结果继续推理，形成 Think-Act-Observe 循环。

## Related Pages

- [patterns/chain-of-thought](patterns/chain-of-thought)
- [concepts/prompt-engineering](concepts/prompt-engineering)
- [concepts/agentic-architectures](concepts/agentic-architectures)

## Sources

- docs/md/guide/ai/prompt-engineering/03-02-patterns/03-02-react.md
