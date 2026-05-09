---
title: "熵管理（Entropy Management）"
date: "2026-05-09"
---

# 熵管理（Entropy Management）

> 驭化工程的第三大支柱，通过持续的自动化扫描和修复，对抗 AI 大规模生成代码时引入的系统性衰退。

## Key Points

- AI 会像素级地复制仓库中的所有模式，包括最不希望被复制的那些
- 五类代码熵：文档漂移、模式漂移、约束逃逸、注释腐烂、依赖漂移
- 解决方案：Drift Scanner（漂移扫描器）+ GC Agent（垃圾回收 Agent）
- 长期策略：将"黄金规则"逐步 lint 化

## Details

### 代码熵的五种表现

1. **文档漂移**：代码变了，但 AGENTS.md 没更新
2. **模式漂移**：坏模式在 Agent 生成的代码中传播
3. **约束逃逸**：架构约束在边缘情况下被绕过
4. **注释腐烂**：代码注释描述的是旧的行为
5. **依赖漂移**：旧的依赖仍被引用

### GC Agent 角色分工

```
生产 Agent → 审查 Agent → GC Agent
实现业务功能    审查生产代码    清理技术债务
开 PR          检测模式违规    修复文档漂移
```

### "黄金规则" Lint 化流程

发现模式问题 → 手动修复 → 写成 lint 规则 → 未来自动阻断

## Related Pages

- [concepts/harness-engineering](concepts/harness-engineering)
- [patterns/context-engineering](patterns/context-engineering)
- [patterns/architectural-constraints](patterns/architectural-constraints)

## Sources

- GitHub Conn-Ho/harness-engineering: docs/md/guide/ai/harness/concepts/03-entropy-management.md
