---
title: "Google ADK Agent 设计模式"
date: "2026-05-09"
---

# Google ADK Agent 设计模式

> Google Agent Development Kit 的五种架构级编排模式。

## Key Points

- **Sequential**：顺序执行，前一步输出作为后一步输入
- **Parallel**：并行执行独立任务，合并结果
- **Coordinator**：中央协调器分发任务给子 Agent
- **Hierarchical**：层级结构，逐级委托
- **Generator-Critic**：生成-评估循环，迭代改进

## Details

### Sequential（顺序模式）

任务按步骤顺序执行，每步输出传递给下一步。适合有明确前后依赖的流程。

### Parallel（并行模式）

独立任务并行执行，最后合并结果。适合可分解的独立子任务。

### Coordinator（协调模式）

中央协调器分析任务，分发给对应的子 Agent 处理。适合需要路由判断的场景。

### Hierarchical（层级模式）

树形层级结构，逐级委托任务。适合大型复杂任务的分解。

### Generator-Critic（生成-评估模式）

生成器产出内容，评估器反馈改进意见，循环迭代直到达标。适合需要高质量输出的场景。

## Related Pages

- [[patterns/agent-skill-design-patterns]]
- [[concepts/agentic-architectures]]

## Sources

- docs/md/guide/ai/skills/06-Google-ADK-Agent-设计模式.md
