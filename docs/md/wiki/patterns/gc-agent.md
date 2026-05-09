---
title: "GC Agent（垃圾回收 Agent）"
date: "2026-05-09"
---

# GC Agent（垃圾回收 Agent）

> 专门运行的 Agent，执行代码库清理、文档修复、技术债务管理。

## Key Points

- 角色分工：生产 Agent → 审查 Agent → GC Agent
- 每周定期运行
- 输出：每个发现的问题开一个专注的小 PR 修复
- 单个 PR 不超过 3 个文件的改动

## Details

### 工作内容

1. **文档一致性**：扫描描述与代码不符的文档
2. **模式扫描**：搜索 deprecated 注释、TODO 年龄检查
3. **依赖健康**：检查已删除模块的引用、未使用的依赖
4. **质量指标**：计算架构合规率，更新质量分数

## Related Pages

- [[patterns/entropy-management]]
- [[patterns/drift-scanner]]
- [[concepts/harness-engineering]]

## Sources

- docs/md/guide/ai/harness/concepts/03-entropy-management.md
