---
title: "design-an-interface 技能：多设计变体生成（已弃用）"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# design-an-interface 技能：多设计变体生成（已弃用）

> ⚠️ 此技能已弃用，不再维护。

## 原定位

使用**并行子代理**为模块生成多种截然不同的接口设计。

## 弃用原因

- 并行子代理的协调成本高于产出价值
- 设计变体的质量难以量化评估
- 实际场景中，设计变体通常由 human designer 而非 agent 生成

## 替代方案

- 使用 **grill-with-docs** 评审单一设计
- 使用 **prototype** 构建实际可交互的变体
- 人工 designer 提供设计变体，agent 只负责评审

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[prototype](./prototype.md)、[grill-with-docs](./grill-with-docs.md)