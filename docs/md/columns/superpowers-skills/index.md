---
title: "Superpowers 技能专栏"
date: "2026-06-04"
source: "obra/superpowers"
url: "https://github.com/obra/superpowers"
---

# Superpowers 技能专栏

> obra/superpowers 是 Claude Code 的"软件工程纪律"技能集——14 个核心技能覆盖"理解需求 → 写代码 → 评审 → 上线"完整生命周期。

<!-- more -->

## 简介

superpowers 由 obra (Jesse Vincent) 维护，定位是"软件工程最佳实践的强制执行层"。每个 skill 都有"硬规则"——不是"建议使用"，而是"必须遵循"。

**核心思想**：把"什么算 good code"、"怎么 debug"、"怎么 review" 这些隐性知识编码成可强制执行的 skill。

## 14 个核心技能

### 🚀 启动层

- [brainstorming](./brainstorming) — 任何创意工作前的强制探索（**HARD-GATE**：未经设计批准不能写代码）
- [writing-plans](./writing-plans) — 写实现计划
- [using-git-worktrees](./using-git-worktrees) — 隔离工作区

### 🤖 元能力

- [using-superpowers](./using-superpowers) — 必须先调用的入口技能
- [dispatching-parallel-agents](./dispatching-parallel-agents) — 2+ 独立任务时并行
- [subagent-driven-development](./subagent-driven-development) — 执行带 review 的实现计划
- [writing-skills](./writing-skills) — 创建新技能

### 💻 工程核心

- [test-driven-development](./test-driven-development) — TDD 强约束
- [systematic-debugging](./systematic-debugging) — 系统化调试（iron law: 无根因不修复）
- [executing-plans](./executing-plans) — 跨会话执行计划
- [verification-before-completion](./verification-before-completion) — 声称完成前必须验证
- [requesting-code-review](./requesting-code-review) — 主动请求审查
- [receiving-code-review](./receiving-code-review) — 接收审查时验证建议

### 🔚 收尾

- [finishing-a-development-branch](./finishing-a-development-branch) — 完成后集成决策

## 适用场景

- 想要"工程纪律"而不是"自由发挥"的 AI 编程
- 多人协作时保证 review/QA 不被跳过
- 调试 bug 时强制走"找根因"而不是"乱试"
- 任何"重要代码"——值得用 superpowers 约束

## 关键设计原则

1. **HARD-GATE 优先于软建议**：brainstorming 的"未批准不能写代码"是硬规则
2. **Iron Law**：systematic-debugging 的"无根因不修复"
3. **强制顺序**：using-superpowers 强制先调用
4. **铁律不可妥协**：所有 skill 都有"违反 = 失败"的硬约束

## 与其他 skill 集的关系

| Skill 集 | 定位 | 风格 |
|----------|------|------|
| superpowers | 工程纪律强制执行 | 硬规则 |
| mattpocock/skills | TypeScript + AI 编程 | 工程技能 |
| gstack | AI 编程 + 浏览器自动化 | 综合工具 |
| gsd | spec-driven 项目管理 | 流程编排 |

## 关联专栏

- [agentic-engineer](../agentic-engineer/) — Agent 工程架构
- [mattpocock-skills](../mattpocock-skills/) — Matt Pocock skills
- [gstack-skills](../gstack-skills/) — Garry Tan gstack
- [get-shit-done-skills](../get-shit-done-skills/) — gsd
