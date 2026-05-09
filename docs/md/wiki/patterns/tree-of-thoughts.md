---
title: "Tree of Thoughts（思维树）"
date: "2026-05-09"
---

# Tree of Thoughts（思维树）

> 将推理过程组织为树结构，支持多路径探索和剪枝的高级推理模式。

## Key Points

- 将推理过程从线性链扩展为树结构
- 支持多条推理路径并行探索
- 通过评估函数进行路径剪枝
- 适合需要回溯和多方案比较的复杂问题

## Details

ToT 允许模型在推理过程中生成多个可能的"思维"分支，评估每个分支的前景，保留有希望的路径，剪枝无望的路径。比 CoT 更强大但计算成本更高。

## Related Pages

- [[patterns/chain-of-thought]]
- [[concepts/prompt-engineering]]
- [[concepts/agentic-architectures]]

## Sources

- docs/md/guide/ai/prompt-engineering/03-02-patterns/03-03-tree-of-thoughts.md
