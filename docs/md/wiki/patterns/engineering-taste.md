---
title: "Engineering Taste（工程品味）"
date: "2026-06-11"
---

# Engineering Taste（工程品味）

> Behavioral guidelines for AI coding agents inspired by Linus Torvalds' engineering taste: simple data structures, backward compatibility, pragmatic implementation, ruthless complexity reduction, and maintainable production-grade code.

## Key Points

- **核心问题**：LLM coding agent 常犯的毛病——为"假想的未来需求"过度工程化、重构无关代码却忽略兼容性风险
- **四大原则**：Good Taste + Never Break Userspace + Pragmatism + Simplicity Obsession
- **输出模式**：Spec Judgment + Plan Judgment + Implementation Guidance + Refactoring Guidance + TDD Guidance + Code Review Output

## 四大原则

### 1. Good Taste（好品味）

> Eliminate edge cases by improving data structures. Good code makes the common operation obvious and unconditional.

用改进数据结构来消除边界情况。好代码让常见操作明显且无条件。

### 2. Never Break Userspace（永不破坏用户空间）

> Existing behavior is a contract. A change that breaks users is a bug, no matter how theoretically correct it looks.

已有行为是一份契约。破坏用户的变更是一个 bug，不管它理论上看起来多正确。

### 3. Pragmatism（实用主义）

> Solve real problems. Reject complexity justified only by future flexibility, elegance, or abstract purity.

解决真实问题。只因未来灵活性、优雅或抽象纯洁性而引入的复杂度，一律拒绝。

### 4. Simplicity Obsession（极度求简）

> Keep functions short, ownership clear, and nesting shallow. Complexity is the root of most bugs.

函数要短，所有权要清晰，嵌套要浅。复杂度是大多数 bug 的根源。

## 输出模式

| 模式 | 用途 |
|------|------|
| **Spec Judgment** | 检查 spec 是否命名了真实数据、行为、非目标和兼容性风险 |
| **Plan Judgment** | 检查 plan 是否围绕数据结构、行为、测试和迁移排序 |
| **Implementation Guidance** | 定义数据结构、不变量、直线代码路径、测试和兼容性契约 |
| **Refactoring Guidance** | 决定重构是否真正消除了复杂度而没有改变行为 |
| **TDD Guidance** | 保持测试聚焦于真实行为和回归风险，而非实现细节 |
| **Code Review Output** | 打品味分，标出致命问题，提出最小可维护修复 |

## 安装

```bash
# Claude Code Plugin（推荐）
/plugin marketplace add bingshuoguo/linus-torvalds-skills
/plugin install linus-torvalds-skills@linus-torvalds-skills
/reload-plugins

# Cursor（自动应用）
复制 .cursor/rules/linus-guidelines.mdc 到项目

# 项目级指令
复制 linus-guidelines.md 到项目 CLAUDE.md / AGENTS.md
```

## 数据

- **5 Stars** · **0 Forks** · **3 Commits**
- MIT License

## Related Pages

- [concepts/harness-engineering](concepts/harness-engineering) — 驭化工程
- [patterns/context-engineering](patterns/context-engineering) — 上下文工程

## Sources

- GitHub bingshuoguo/linus-torvalds-skills (2026-06-08)