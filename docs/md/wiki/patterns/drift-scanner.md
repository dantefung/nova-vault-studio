---
title: "Drift Scanner（漂移扫描器）"
date: "2026-05-09"
---

# Drift Scanner（漂移扫描器）

> 每天运行的自动化扫描任务，检测各类漂移并自动开启修复 PR。

## Key Points

- 检测文档漂移、架构违规、模式不一致
- 工作日每天自动运行
- 自动创建修复 PR
- 是熵管理的核心工具

## Details

### 扫描维度

- 文档一致性：代码与文档是否匹配
- 架构违规：是否违反依赖方向等约束
- 模式一致性：代码风格是否统一

### 实现方式

通过 GitHub Actions 定时任务，在工作日每天上午 9 点运行扫描，发现问题自动创建修复 PR。

## Related Pages

- [[patterns/entropy-management]]
- [[concepts/harness-engineering]]

## Sources

- docs/md/guide/ai/harness/concepts/03-entropy-management.md
