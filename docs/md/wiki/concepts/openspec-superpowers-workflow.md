---
title: "OpenSpec + Superpowers 工作流"
date: "2026-06-29"
source: "原创整理"
---

# OpenSpec + Superpowers 工作流

## 一句话定义

将 **OpenSpec**（规格与记忆） + **Superpowers**（设计与执行）串联成完整闭环的 AI 辅助开发流程——AI 不再只是「写代码」，而是「按规格交付」。

## 角色分工

| 工具 | 职责 | 类比 |
|------|------|------|
| **OpenSpec** | 管规格、管记忆 | 项目级「需求文档 + 知识库」 |
| **Superpowers** | 管设计、管执行 | 项目级「开发流程 + 质量门控」 |

两者各司其职，互不重叠。

## 完整流程

```
① 提案（OpenSpec）
   /opsx:propose → 生成 proposal.md + specs/ + tasks/
   ↓
② 审查（人工）
   确认 proposal.md 需求和方向
   ↓
③ 设计（Superpowers）
   brainstorming 深入细节 → writing-plans 拆分原子任务
   ↓
④ 构建（Superpowers）
   TDD 先写测试再写代码
   子代理读取 specs/ 获取上下文
   ↓
⑤ 交付（Superpowers）
   返回完成的功能（verification 跑过才算完）
   ↓
⑥ 归档（OpenSpec）
   /opsx:archive → 归档变更 → 更新 specs/ → 项目知识库同步
```

## 每一步详解

### ① 提案（OpenSpec）

用 `/opsx:propose` 命令触发，自动生成：
- `proposal.md` — 变更提案
- `specs/` — 规格目录
- `tasks/` — 任务分解

### ② 审查（人工）

**人类 checkpoint**——确认 `proposal.md` 的需求和方向是否正确。这一步是「人机对齐」的关键节点。

### ③ 设计（Superpowers）

- `brainstorming` 深入细节——把模糊需求问清楚
- `writing-plans` 拆分原子任务——每个任务可以独立完成

### ④ 构建（Superpowers）

- **TDD 优先**：先写测试，再写代码
- **子代理读取 specs/**——每个子代理都基于统一的规格上下文执行任务，避免「重复摸索」

### ⑤ 交付（Superpowers）

- 返回完成的功能
- **verification 跑过才算完**——质量有保障

### ⑥ 归档（OpenSpec）

- 用 `/opsx:archive` 把变更归档
- `specs/` 同步更新——项目知识库跟着进化

## 核心价值

| 痛点 | 解法 |
|------|------|
| **AI 缺记忆** | OpenSpec 把每次变更沉淀成规格文档，下次 AI 直接读 specs/，不重复摸索 |
| **AI 缺纪律** | Superpowers 用 brainstorming 深入细节 + TDD 保证代码质量 + verification 验收 |
| **子代理上下文不一致** | 统一从 specs/ 读，所有子代理基于同一份事实 |
| **交付质量参差** | verification 跑过才算完，没有「差不多就行」 |

> **这套流程解决了 AI 开发最大的两个痛点：缺记忆 + 缺纪律。**

## 适用场景

- ✅ **中大型功能开发**——需要清晰规格 + 质量门控
- ✅ **多 Agent 协作**——子代理需要统一上下文
- ✅ **需要长期维护的项目**——知识需要沉淀成规格
- ❌ **一次性脚本/小修小补**——overkill
- ❌ **纯探索性 prototype**——还在摸方向时不需要 specs/

## 关联阅读

- [[harness-engineering]] — 上下文工程与架构约束
- [[loop-engineering]] — 自动化循环调度
- [[llm-wiki]] — 知识库模式
- [[vibe-coding]] — Vibe Coding 方法论
- [[ai-rd-automation-wiki-skill]] — AI 研发自动化
- [[task-decomposition-thinking-loop]] — 任务分解思维
- [[agentic-architectures]] — Agent 架构设计
- [[multi-agent]] — 多 Agent 协作

## 来源

- **内部分享** — 2026-06-29 公司内推的工作流总结
