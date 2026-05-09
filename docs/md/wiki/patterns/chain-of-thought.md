---
title: "Chain of Thought（思维链）"
date: "2026-05-09"
---

# Chain of Thought（思维链）

> 通过引导 LLM 逐步推理来提升复杂任务的准确性的提示词模式。

## Key Points

- 核心思想：让模型展示推理过程，而非直接给出答案
- 通过 "Let's think step by step" 等触发词激活
- 显著提升数学、逻辑推理、复杂问题求解的准确率
- 是 ReAct、Tree of Thoughts 等高级模式的基础

## Details

CoT 通过在提示中要求模型逐步推理，将复杂问题分解为可管理的子步骤。这种方法利用了 LLM 在生成中间推理步骤时的自我纠正能力。

## Related Pages

- [concepts/prompt-engineering](concepts/prompt-engineering)
- [patterns/react-pattern](patterns/react-pattern)
- [patterns/tree-of-thoughts](patterns/tree-of-thoughts)

## Sources

- docs/md/guide/ai/prompt-engineering/03-02-patterns/03-01-chain-of-thought.md
