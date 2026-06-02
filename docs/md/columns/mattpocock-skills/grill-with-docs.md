---
title: "grill-with-docs 技能：架构质询与会话"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# grill-with-docs 技能：架构质询与会话

## 定位

grill-with-docs 是一个**质询会话**技能，在你提出计划后激活。它用现有的领域模型挑战你的计划，锐化术语，并实时更新 `CONTEXT.md` 和 ADR。

## 核心机制

1. **挑战你的计划** — 找出计划中依赖默认假设而非领域知识支撑的部分
2. **锐化术语** — 确保 plan 中的每个概念都有精确定义
3. **更新文档** — 实时同步 `CONTEXT.md`（领域语言）和 `docs/adr/`（架构决策记录）

## 适用时机

- 制定技术方案之前
- 重构前评审
- 新模块设计review
- 任何涉及架构决策的讨论

## 与 diagnose 的区别

| 维度 | diagnose | grill-with-docs |
|------|----------|-----------------|
| 时机 | Bug 调试 | 方案制定 |
| 目标 | 找根因 | 验证方案合理性 |
| 输出 | 修复 | CONTEXT.md + ADR |

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[diagnose](./diagnose.md)、[improve-codebase-architecture](./improve-codebase-architecture.md)