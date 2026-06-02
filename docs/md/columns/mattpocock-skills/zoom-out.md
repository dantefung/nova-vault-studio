---
title: "zoom-out 技能：放大视角获取全局上下文"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# zoom-out 技能：放大视角获取全局上下文

## 定位

当你对某个代码段不熟悉时，告诉 agent **放大**，它会给出更广泛的上下文或高级视角。

## 典型触发语

```
"zoom out"
"I don't understand this code"
"give me the big picture"
"what's the architecture here"
```

## zoom-out 提供的上下文

1. **模块在系统中的位置** — 它依赖谁，谁依赖它
2. **设计意图** — 为什么这样设计，而不是那样设计
3. **与领域模型的关系** — 这个模块对应领域语言中的哪个概念
4. **历史上下文** — 最近改动、相关的 ADR 或 CONTEXT.md 条目

## 与 grill-with-docs 的区别

| 维度 | zoom-out | grill-with-docs |
|------|----------|-----------------|
| 方向 | 向外看系统 | 向内挑战方案 |
| 输出 | 上下文 | 已验证的方案 |
| 时机 | 不熟悉时 | 熟悉但不确信时 |

## 使用场景

- Review 不熟悉的模块
- 设计评审前快速了解上下文
- Handoff 文档时快速建立共享上下文

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[grill-with-docs](./grill-with-docs.md)、[improve-codebase-architecture](./improve-codebase-architecture.md)