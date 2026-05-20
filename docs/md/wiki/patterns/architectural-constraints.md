---
title: "架构约束（Architectural Constraints）"
date: "2026-05-09"
---

# 架构约束（Architectural Constraints）

> 驭化工程的第二大支柱，通过机械化手段强制执行代码规范，而非仅靠文档说明。

## Key Points

- 自定义 linter 及其带有指导性的错误消息
- 结构测试验证依赖方向
- CI 流水线阻断架构违规
- 人类品味一次性编码，持续机械化执行

## Details

### 核心思路

当 Agent 出错时，不要手动修复——要追问：它缺少什么工具？什么约束应该被机械化执行？

### 实践方法

1. 将代码 Review 中发现的模式问题转化为 lint 规则
2. 用结构测试验证模块依赖方向
3. CI 流水线中加入架构合规检查
4. 错误消息要告诉 Agent 如何修复，而非仅报告错误

## Related Pages

- [concepts/harness-engineering](concepts/harness-engineering)
- [patterns/context-engineering](patterns/context-engineering)
- [patterns/entropy-management](patterns/entropy-management)

## Sources

- GitHub Conn-Ho/harness-engineering: docs/md/columns/harness-engineering/concepts/02-architectural-constraints.md
