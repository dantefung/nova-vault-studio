---
title: "GSD Core 专栏：Spec-Driven 与上下文工程架构"
date: "2026-09-16"
source: "open-gsd/gsd-core"
url: "https://github.com/open-gsd/gsd-core"
---

# GSD Core 专栏：Spec-Driven 与上下文工程架构

> **Git. Ship. Done.**
> GSD Core 是基于元提示词（Meta-prompting）、上下文工程（Context Engineering）与规范驱动开发（Spec-driven Development）构建的高效 AI Agent 架构体系。

<!-- more -->

## 为什么需要 GSD Core？

大多数 AI 编程实践在小规模原型上运行良好，但一旦项目代码量超过几千行、迭代超过两个版本，系统就会迅速崩溃：

1. **上下文腐化（Context Rot）**：随着会话历史拉长，注意力稀释，模型开始漏看约束、产生幻觉并推翻之前的架构决策。
2. **缺乏状态持久化**：会话关闭或窗口压缩后，设计意图全部丢失，人类被迫反复交代项目背景。
3. **缺乏确定性验证**：AI 汇报「已修复/已完成」，但缺少机器客观证据（Failing-direction 与 Nyquist 采样），隐性 Bug 悄悄进入生产环境。

GSD Core 针对这些痛点给出了清晰的解法：**主控会话保持极简（Lean Session），脏活交给拥有干净 200k 窗口的专业子代理（Fresh-Context Subagents），状态与规范沉淀在文件系统中。**

---

## 专栏架构导读

本专栏围绕 `open-gsd/gsd-core`（v1.7.0）的内核设计哲学与核心机制展开，由浅入深拆解这一工程范式：

| 章节 | 核心内容 |
|------|---------|
| [01. 核心架构与上下文防腐工程](./01-gsd-core-philosophy-and-architecture.md) | 深入理解 Context Rot 物理极限，主控瘦身与专业子代理（Subagent）隔离模型 |
| [02. 五步生命周期状态机闭环](./02-gsd-core-the-phase-loop.md) | `Discuss → (UI) → Plan → Execute → Verify → Ship` 阶段状态机运转与防呆机制 |
| [03. 独立子代理与波次并发调度](./03-gsd-core-subagent-and-execution-waves.md) | 34 个专业 Agent 角色分工、Dependency DAG 波次调度与 Worktree 隔离机制 |
| [04. 机器可执行规范与硬核验证门禁](./04-gsd-core-state-and-spec-driven-contracts.md) | `STATE.md`、`CONTEXT.md` 协议规范，Failing Direction、Nyquist 审计与门禁 |
| [05. 72 技能全景分类矩阵与实战速查图谱](./05-gsd-core-72-skills-matrix-and-capability-atlas.md) | 6 大能力域 72 个 `/gsd-*` 技能全量参数、输入输出、触发条件与联动全景 |

---

## 核心设计原则

- **好品味优先于复杂补丁**：通过文件系统结构（`.planning/`）代替沉重的外部数据库和长服务进程，零依赖跨平台运行。
- **Never Break Userspace**：状态转换严格遵循幂等性，任何状态变更都有清晰的历史痕迹与回滚路径（`/gsd-undo`）。
- **客观证据高于模型自评**：验证阶段只相信命令退出码与断言证据，绝不信任大模型自身「我觉得没问题」的主观结论。
