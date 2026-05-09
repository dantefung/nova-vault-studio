---
title: "上下文工程（Context Engineering）"
date: "2026-05-09"
---

# 上下文工程（Context Engineering）

> 驭化工程的第一大支柱，系统性设计和管理 AI Agent 在执行任务时能够访问的信息集合。

## Key Points

- 核心原则：如果它不在仓库里，对 Agent 来说它就不存在
- AGENTS.md 是地图，不是百科全书——不超过 100 行
- 上下文窗口是 RAM，不是硬盘——按需加载，非全量注入
- 代码即上下文：类型即文档、错误消息即指导、命名即文档

## Details

### 渐进式披露架构

```
AGENTS.md（≤100 行，目录索引）
├── docs/architecture/      ← 架构决策与系统设计
├── docs/api/               ← API 合约与接口规范
├── docs/decisions/         ← 架构决策记录（ADR）
├── docs/patterns/          ← 代码模式与最佳实践
└── docs/glossary.md        ← 项目专用术语表
```

### 动态上下文注入

- 代码库状态（git 状态、最近修改文件、测试状态）
- 可观测性数据（错误日志、性能指标）
- CI/CD 状态

### 常见误区

- 更多文档 ≠ 更好性能（ETH Zurich 研究：人工 AGENTS.md 仅 4% 提升）
- 不要把所有决策都写进系统提示
- 上下文是活的基础设施，需要持续维护

## Related Pages

- [[concepts/harness-engineering]]
- [[patterns/architectural-constraints]]
- [[products/claude-code]]
- [[products/openai-codex]]

## Sources

- GitHub Conn-Ho/harness-engineering: docs/md/guide/ai/harness/concepts/01-context-engineering.md
