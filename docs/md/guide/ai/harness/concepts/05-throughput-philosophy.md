---
title: "高吞吐合并哲学（Throughput Philosophy）"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# 05 — 高吞吐合并哲学（Throughput Philosophy）

## 核心转变

当 AI Agent 能够以每天数十个 PR 的速度生成代码时，传统的"精心制作、深思熟虑的 PR"模式不再适用。

**旧哲学**：每个 PR 是精心打磨的作品，经历 1-2 周，包含大量相关改动。

**新哲学**：PR 是快速流动的小单元，每个完成一件事，快速合并，允许偶尔出错。

> "当 AI 失败时，纠错的成本远低于等待完美的成本。"
> — OpenAI Harness Engineering 博客

---

## 为什么高吞吐改变了一切

### 传统 PR 模式的隐含假设

传统的慢速 PR 流程假设：
1. 代码编写成本很高（人工时间）→ 必须谨慎
2. 每次 Review 投入大量人力 → 宁可 PR 大一点，减少评审次数
3. 返工代价高 → 尽量第一次做对

### AI Agent 时代的新现实

1. 代码生成成本极低 → 可以快速迭代
2. Agent 可以自我验证 → Review 聚焦在架构而非细节
3. 返工由 Agent 完成，成本低 → 允许更快速的反馈循环

### 数据对比

| 维度 | 传统模式 | Agent 驱动模式 |
|------|---------|--------------|
| PR 平均大小 | 数百行改动 | 数十行改动 |
| PR 周期 | 1-5 天 | 数小时 |
| 每人每天 PR | 0.3-1 个 | 3-10 个 |
| Review 重点 | 实现细节 | 架构符合性 |
| 合并策略 | 等待完美 | 快速合并，快速修复 |

---

## Stripe Minions 的实践

Stripe 的 Minions 系统是高吞吐合并哲学的最佳案例：

```
工程师在 Slack 发送任务描述
        ↓
Minions Agent 接收任务，开始编码
        ↓
Agent 运行测试、类型检查、lint
        ↓
Agent 自动开 PR
        ↓
工程师 Review（关注意图符合性，非代码细节）
        ↓
合并（通常 < 1 小时）
```

**结果**：每周 1300+ PR，工程师从"写代码"转变为"审查意图"。

---

## PR 的新形态

### 原子 PR 原则

每个 PR 只做一件事，并且完全完成这件事：

```
✅ 好的 PR 范围：
- "添加用户邮件验证功能"
- "修复购物车数量更新的边缘情况"
- "将 user-service 迁移到新的数据库连接池"

❌ 差的 PR 范围：
- "一堆杂项改动"
- "重构 + 修 bug + 新功能"
```

### PR 标题即规范

好的 PR 标题是一条单一的、可验证的陈述：
- `feat: Add rate limiting to /api/auth endpoints`
- `fix: Prevent duplicate order submission on double-click`
- `refactor: Extract UserValidator to separate class`

---

## Ralph 模式（snarktank/ralph）

Ralph 是将高吞吐哲学推向极限的开源框架（GitHub 13,400+ Stars）：

### 核心机制

```
PRD（产品需求文档）定义所有任务
        ↓
Ralph 启动自主循环
        ↓
每次迭代 = 全新的 AI 实例（干净的上下文）
        ↓
通过 git 历史 + progress.txt + prd.json 维持记忆
        ↓
完成 PRD 所有任务为止
```

### 关键设计

- **每次迭代干净上下文**：避免长对话导致的"上下文污染"
- **外部化记忆**：用文件系统代替对话历史作为记忆载体
- **自动验证**：每次迭代结束时运行测试套件
- **阻塞时上报**：遇到无法解决的问题时创建 issue，而不是陷入死循环

---

## "反压"（Backpressure）概念

Geoffrey Huntley 提出的 Ralph 模式核心概念：

**传统问题**：人工审查跟不上 Agent 生成速度，积压大量等待合并的 PR。

**反压机制**：
```
Agent 生成速度 → 审查队列 → 合并速度
                    ↑
              如果队列过长
              自动降速 Agent 生成
              （关注清理积压）
```

**实践**：设定"最大在途 PR 数"，超过阈值时 Agent 优先关注修复现有 PR 的问题，而不是开新 PR。

---

## 反模式：盲目追求吞吐量

高吞吐不等于无节制：

- **无 Review 合并**：即使 Auditor Agent 审查，高风险改动（数据库 schema、安全相关）仍需人工确认
- **不清理技术债**：快速合并不等于忽视代码质量，需要配合熵管理
- **在途 PR 无上限**：过多在途 PR 会让代码库陷入不稳定状态

---

## 下一步

- 了解 Harness 和脚手架的关键区别：→ `06-harness-vs-scaffolding.md`
- 了解如何防止质量衰退：→ `03-entropy-management.md`
