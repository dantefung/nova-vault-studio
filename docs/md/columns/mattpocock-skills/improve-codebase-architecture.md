---
title: "improve-codebase-architecture 技能：架构深化发现"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# improve-codebase-architecture 技能：架构深化发现

## 定位

在代码库中发现**架构深化机会**，将浅层模块转换为深层模块，提高可测试性和 AI 可导航性。

## 核心思想

**浅层模块** vs **深层模块**：

- **浅层模块** — 只能通过调用者注入测试 Mock，耦合严重，难以独立验证
- **深层模块** — 有明确的输入输出，可从外部验证，无需 Mock 就能测试核心逻辑

## 发现线索

improve-codebase-architecture 关注以下信号：

- 模块需要大量 Mock 才能测试 → 依赖倒置没有做好
- 模块之间通过隐式全局状态通信 → 领域边界不清
- 改动一个模块需要同时改多个文件 → 缺乏最小接口原则
- 注释中出现「这里为什么这样写？」的问题 → 历史债务积累

## 深化路径

1. **识别浅层模块** — 通过测试覆盖率和 Mock 数量判断
2. **定义最小接口** — 提取模块的核心输入输出
3. **实施依赖倒置** — 让外层依赖内层，内层不依赖外层
4. **验证可测试性提升** — 目标：不依赖 Mock 就能写单元测试

## 与 grill-with-docs 的配合

grill-with-docs 负责**方案评审**，improve-codebase-architecture 负责**执行发现**，两者形成「评审-深化」闭环。

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[grill-with-docs](./grill-with-docs.md)、[diagnose](./diagnose.md)