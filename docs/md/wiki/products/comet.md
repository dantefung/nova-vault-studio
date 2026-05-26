---
title: "comet"
date: "2026-05-24"
---

# Comet

> 基于 OpenSpec + Superpowers 的自动化 Spec Skills，创意/需求到稳健归档 Spec，一条命令搞定

**快速安装**：`npm install -g @rpamis/comet`

## Core Concept

Comet 不是替代 OpenSpec 和 Superpowers，而是合并两者强项：
- **OpenSpec**：归档能力
- **Superpowers**：TDD 驱动执行能力

## 5 阶段自动流转

1. **需求捕获** — 从创意/需求出发
2. **Spec 归档** — 自动生成规范化 Spec
3. **测试驱动** — TDD 执行
4. **实现验证** — 状态机强制验证条件
5. **归档输出** — 长期稳健的 Spec 文档

## Key Features

- **支持 28+ AI Coding 平台**
- **嵌套 Skill 触发**：真正触发 Skill（CC 上有 Skill 触发打印），而非"看起来像触发了 Skill"
- **多阶段自动流转**：除必要用户选择项外，核心流程自动进行 Skill 触发
- **状态机机制**：每个流程强制验证条件

## Quick Start

```bash
npm install -g @rpamis/comet
cd your-project
comet init
```

## What Comet Teaches

1. **如何稳定触发嵌套 Skill** — 不是靠文档描述让 Agent"看起来像触发了 Skill"，而是真正触发（核心特征：CC 上有 Skill 触发的打印）
2. **如何让组合 Skill 多阶段自动流转** — 不是靠人工介入，核心流程能自动进行 Skill 触发
3. **如何使用状态机机制** — 让 Skill 每个流程强制验证条件

## Resources

- [GitHub](https://github.com/rpamis/comet)