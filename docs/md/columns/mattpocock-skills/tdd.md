---
title: "tdd 技能：测试驱动开发红绿重构循环"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# tdd 技能：测试驱动开发红绿重构循环

## 核心循环

```
红 → 绿 → 重构
```

**红** — 写一个 failing test，明确要什么  
**绿** — 用最小代码通过测试，不求完美  
**重构** — 在测试保护下改善代码结构

## 垂直切片原则

tdd 强调一次构建**一个垂直切片**的功能或修复一个 bug：

- **垂直切片** = 从 UI → 业务逻辑 → 数据层 完整经过
- 不是按层横向开发（先写完所有测试、再写所有实现）
- 每一步都是端到端可运行的

## 三定律

1. **不写实现代码，除非有 failing test**
2. **不写多余实现代码，刚刚好让 failing test 通过**
3. **不写多余重构，除非有 passing test 保护**

## 与 diagnose 的关系

diagnose 的 6 步循环中，**instrument** 阶段可能产出测试用例；tdd 生产的测试是 diagnose 的副产品，两者是互补关系。

## 常见陷阱

- **Mock 过度** — 测试依赖 Mock 而非真实模块，失去保护意义
- **测试粒度过粗** — 一个 test 测了半个系统，无法定位问题
- **跳过重构** — 只写绿，代码债务持续积累

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[diagnose](./diagnose.md)、[improve-codebase-architecture](./improve-codebase-architecture.md)