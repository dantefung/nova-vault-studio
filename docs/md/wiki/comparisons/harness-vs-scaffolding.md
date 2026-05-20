---
title: "Harness vs Scaffolding（驭化层 vs 脚手架）"
date: "2026-05-09"
---

# Harness vs Scaffolding（驭化层 vs 脚手架）

> 脚手架是构建阶段的准备层，Harness 是运行时的持久编排层。

## Comparison

| 维度 | Scaffolding（脚手架） | Harness（驭化层） |
|------|----------------------|-------------------|
| 时机 | 第一个 Prompt 发送之前 | Agent 运行的整个生命周期 |
| 内容 | 模型选择、系统提示、工具定义 | 工具执行、上下文管理、状态持久化 |
| 类比 | 建筑施工中的临时支撑 | 建筑的永久结构 |
| 演进 | 随任务理解加深而调整 | 随生产经验积累而强化 |

## Strengths of Each

**脚手架**：简单、易理解、快速迭代
**驭化层**：可靠、可扩展、生产级保障

## Selection Guide

- 开发初期：重点投入脚手架（系统提示、工具选择）
- 准备生产：重点投入驭化层（安全边界、错误恢复、状态管理）
- 实践建议：从薄 Harness 开始，观察真实失败，按需加厚

## Related Pages

- [concepts/harness-engineering](concepts/harness-engineering)
- [patterns/context-engineering](patterns/context-engineering)
- [products/openai-codex](products/openai-codex)
- [products/claude-code](products/claude-code)

## Sources

- GitHub Conn-Ho/harness-engineering: docs/md/columns/harness-engineering/concepts/06-harness-vs-scaffolding.md
