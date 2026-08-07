---
title: "一份不靠你亲自上阵的循环工程实践指南"
date: "2026-08-06"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/tOIeqYWVp9bfjHm-tGlyQA"
---

# 一份不靠你亲自上阵的循环工程实践指南

> 循环工程的核心：杠杆点已经从编写单个提示词，转移到设计管理智能体的编排系统上。

现在有很多人在讨论"设计循环"，而不是不断提示你的编码智能体。如果你花时间研究循环到底是什么，你会发现 **loop-engineering 框架**里有一份最清晰的技术拆解。

![循环工程封面](images/loop-engineering-practice-guide/001.jpeg)

## 什么是循环工程

循环工程，是用**自主控制系统取代手动提示**的实践。你不再反复提示智能体执行微任务，而是设计一个系统，让它能够**发现工作、执行工作，并随时间推移验证进展**。

其核心理念是：杠杆点已经从编写单个提示词，转移到设计管理智能体的编排系统上。这解决了三个具体问题：

- **意图债务**（Intent Debt）：指令会随着时间推移而衰减
- **理解债务**（Comprehension Debt）：每个任务都要重新让智能体理解上下文
- **认知投降**（Cognitive Surrender）：在没有结构化验证的情况下盲目接受智能体输出

## 入门

在运行自主智能体之前，你需要评估代码仓库的"理解债务"。该框架通过 `npx` 提供了三个 CLI 工具，用于管理循环生命周期。

任何项目的推荐切入点，都是先从 **L1（仅报告）级别的 Daily Triage** 开始。在这种模式下，循环会识别问题并更新状态，但不会修改任何代码。你运行初始化器后，工具会创建一个 `STATE.md` 文件作为循环的持久主干；然后用类似 `/loop 1d Run loop-triage. Update STATE.md. No auto-fix in week one` 的命令建立节奏。

## 核心概念和术语

循环是一个**递归的目标执行周期**。不同于聊天会话——由人类给出提示并获得响应——循环会自己发现工作、执行工作、验证结果，并跨会话持久化记忆。

### 递归目标周期：六个步骤

1. **Schedule**（调度）：心跳触发运行
2. **Triage**（分诊）：专门技能扫描新工作
3. **State Sync**（状态同步）：读取并更新 STATE.md
4. **Execute**（执行）：在隔离的 worktree 中执行操作
5. **Verify**（验证）：由独立的 Checker 智能体验证 Maker 智能体的工作
6. **Gate**（关卡）：高风险操作暂停并等待人类批准

### 就绪度的四个等级

![循环就绪度四等级](images/loop-engineering-practice-guide/002.jpeg)

### 关键术语

- **意图债务**（Intent Debt）：项目约定与智能体默认冷启动行为之间的差距
- **理解债务**（Comprehension Debt）：随着循环生成的 PR 不断堆积，你逐渐失去对自己代码库的理解
- **认知投降**（Cognitive Surrender）：在缺乏工程判断的情况下放任循环运行
- **编排税**（Orchestration Tax）：管理并行智能体带来的机械性开销
- **Maker/Checker 拆分**（Maker/Checker Split）：编写代码的智能体绝不能是批准代码的那个智能体

## 六个原语

每个循环都由六个基础构件组成：

| 原语 | 说明 |
|------|------|
| 调度（Scheduling） | 通过 `/loop`、cron 或 GitHub Actions 触发发现与分诊周期 |
| Worktree | `git worktree` 为安全的并行工作提供隔离环境 |
| 技能（Skills） | SKILL.md 文件封装智能体所需的意图与逻辑 |
| 连接器（Connectors） | 面向 GitHub、Slack 或 Linear 的 MCP 接口 |
| 子智能体（Sub-agents） | Maker/Checker 拆分将实现与验证分离 |
| 状态（State） | STATE.md 和 loop-run-log.md 在上下文窗口之外提供持久记忆 |

## 模式注册表

注册表包含**七个核心的、可用于生产环境的模式**，每个模式都有明确的目标、节奏和风险级别：

![七种核心模式](images/loop-engineering-practice-guide/003.jpeg)

选择哪种模式取决于你的痛点：**CI 变红**对应 CI Sweeper，**PR 停滞**对应 PR Babysitter，**早晨一片混乱**对应 Daily Triage。运行多个模式时，协调规则也很重要——例如，CI Sweeper 负责失败的检查，因此 PR Babysitter 不会在同一小时内重复修复同一个分支。

## 入门模板和示例

该仓库为不同就绪等级提供了可复制即运行的脚手架：

- **Minimal Loop Starters（L1）**：专注于 Daily Triage，为 Grok、Claude、Codex 和 Opencode 提供了版本，每种工具都有对应的目录结构
- **L2 Assisted Patterns**：包括 PR Babysitter、CI Sweeper、Dependency Sweeper、Post-Merge Cleanup 和 Changelog Drafter——都配有多工具技能，以及用于跟踪尝试和失败的明确状态 schema

推荐工作流：用 `loop-init` 初始化，用 `loop-audit` 审计，然后参考 patterns 目录理解目标和风险。

## CLI 工具

完整的 CLI 套件引导工程师贯穿整个循环生命周期：

- **loop-audit**：计算 0-100 的循环就绪度分数，检测 15 个以上信号，分数低于 40 时返回 CI 退出码，作为质量门禁
- **loop-init**：生成脚手架样板
- **loop-cost**：估算每日和每月 token 成本
- **loop-sync**：检测预期配置与实际状态之间的漂移
- **loop-context**：有状态的记忆管理器和断路器，在停滞或预算限制达到时触发中断

还有两个高级工具：**goal-audit** 用于 `/goal` 工作流就绪度检查；**loop-mcp-server** 将循环模式暴露为可查询的 MCP 资源。

## 安全、运维与可观测性

### 安全性

通过路径拒绝列表、受限连接器权限范围以及机器可读约束来保障。循环**绝不能自动编辑敏感文件**，例如 `.env`、`auth/**` 或 `payments/**`。默认的自动合并策略是**无自动合并**——只有文档错别字这类琐碎且在允许列表中的路径，才允许自动合并。

### 可观测性依赖三个原语

- 通过 `loop-budget.md` 实现 **Token 预算管理**
- 通过运行日志将每次执行追加到 `loop-run-log.md`
- 通过 `loop-pause-all` 这类标签提供可立即暂停的 **Kill Switch**

### 十一个具名故障模式（按严重程度编目）

最常见的包括：

- **无限修复循环**（Infinite Fix Loop）：由弱验证器导致，通过 3 次尝试上限缓解
- **状态腐化**（State Rot）：由缺少修剪步骤导致，通过分诊纪律缓解
- **Token 燃烧**（Token Burn）：由低于一分钟的节奏导致，通过每日上限缓解
- **越界**（Over-Reach）：由缺少路径限制导致，通过路径拒绝列表缓解

## CI/CD 与发布基础设施

该仓库通过 GitHub Actions 在三个方面自动维护自身：

1. **自主运维**（Autonomous Operations）：一个维护仓库自身状态的 Daily Triage 循环
2. **质量门禁**（Quality Gates）：在每个 PR 上进行自动审计和模式验证
3. **发布流水线**（Release Pipelines）：为 CLI 工具集自动发布 NPM 包

该仓库以 L1 自动报告循环的形式运行自己的 Daily Triage 模式，并记录 30 天的活动历史。质量门禁要求参考仓库的最低就绪度分数为 58，starter 的最低分数为 38。该基础设施发布五个公开 npm 包：loop-audit、loop-init、loop-cost、loop-sync 和 loop-context，每个都使用基于 OIDC 的 **Trusted Publishing** 保证发布真实性。

## 生产故事与社区

`stories` 目录记录了真实部署案例，遵循标准化格式：**Setup**（设置）、**What Worked**（有效之处）、**What Broke**（出问题的地方）、**Metrics**（指标）和 **Lesson**（经验）。

关键经验：贡献主要集中在扩展模式注册表，以及分享新的生产故事上，并且有一条明确规则——**每个故事都必须至少包含一次失败或意外**——这是工程参考资料，不是炒作合集。