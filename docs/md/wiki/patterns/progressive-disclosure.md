---
title: "渐进式披露（Progressive Disclosure）"
date: "2026-05-09"
---

# 渐进式披露（Progressive Disclosure）

> 上下文工程的核心架构模式，从外到内逐渐细化的信息层级结构。

## Key Points

- AGENTS.md 是地图，不是百科全书
- 按需加载，非全量注入
- 上下文窗口是 RAM，不是硬盘
- 层级结构：索引 → 详细文档 → 参考资料

## Details

### 层级结构

```
AGENTS.md（≤100 行，目录索引）
├── docs/architecture/      ← 架构决策与系统设计
├── docs/api/               ← API 合约与接口规范
├── docs/decisions/         ← 架构决策记录（ADR）
├── docs/patterns/          ← 代码模式与最佳实践
└── docs/glossary.md        ← 项目专用术语表
```

### 设计原则

- 每一层只包含当前层级需要的信息
- 通过链接指向更详细的文档
- 避免信息过载，保持高信噪比

## Related Pages

- [patterns/context-engineering](patterns/context-engineering)
- [concepts/harness-engineering](concepts/harness-engineering)

## Sources

- docs/md/columns/harness-engineering/concepts/01-context-engineering.md
