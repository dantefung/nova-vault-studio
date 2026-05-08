---
title: "Google ADK Agent 设计模式 5 种"
date: "2026-05-09"
source: "Google Cloud / ADK"
url: "https://cloud.google.com/architecture/choose-design-pattern-agentic-ai-system"
---

# Google ADK Agent 设计模式 5 种

Google Agent Development Kit（ADK）总结了构建 Agentic AI 系统的 5 种核心设计模式，适用于单 Agent 到多 Agent 系统的架构选型。

> 来源：[Choose a design pattern for your agentic AI system](https://cloud.google.com/architecture/choose-design-pattern-agentic-ai-system) | [Developer's guide to multi-agent patterns in ADK](https://developers.googleblog.com/en/developers-guide-to-multi-agent-patterns-in-adk/)

---

## 1. Sequential Pipeline（顺序流水线）

**别名**：Assembly Line（装配线）

按预定义线性顺序执行一系列专门 Agent，上一个 Agent 的输出直接作为下一个 Agent 的输入。编排器基于预定义逻辑运行，无需 AI 模型参与编排决策。

```
A → B → C → D
```

**适用场景**：确定性工作流、文档处理链路、内容多阶段加工。

**特点**：简单可预测，易调试；适合步骤明确、顺序固定的场景。

---

## 2. Parallel Fan-Out/Gather（并行发散-聚合）

**别名**：Octopus（章鱼）

同时触发多个专门 Agent 并行执行，然后将各 Agent 的结果汇总/合成。适用于需要从多个维度分析或同时处理多个独立子任务。

```
        → Agent A ─┐
Coordinator → Agent B → 结果合并
        → Agent C ─┘
```

**适用场景**：多角度研究、多源信息聚合、批量内容生成后合并。

**特点**：高并发吞吐，侧重并行探索后聚合结果。

---

## 3. Coordinator/Dispatcher（协调-调度模式）

**别名**：Concierge（礼宾台）

一个中央调度 Agent 动态决定将任务分发给哪个专门 Agent。调度逻辑由 LLM 驱动，根据上下文自主选择下一步调用哪个子 Agent。

```
User → Coordinator（LLM 驱动）→ 按需调用子 Agent
```

**适用场景**：复杂多领域任务、需要动态判断调用哪个工具/专家的场景。

**特点**：高度动态灵活，但调度 Agent 成为单点复杂度。

---

## 4. Hierarchical Decomposition（层级分解）

**别名**：Russian Doll（俄罗斯套娃）

将复杂任务层层分解为子任务，每层由专门的 Agent 或 Agent 组处理。类似组织架构，上级管理下级的工作分配和结果汇总。

```
主 Agent
  ├── 子 Agent 群 A
  │     ├── 子 Agent A1
  │     └── 子 Agent A2
  └── 子 Agent 群 B
        ├── 子 Agent B1
        └── 子 Agent B2
```

**适用场景**：大型复杂项目、需要严格层级责任分工的企业级应用。

**特点**：强结构、可治理，适合大型团队分工协作。

---

## 5. Generator & Critic（生成-评审模式）

**别名**：Editor's Desk（编辑台）

一个 Agent 负责生成内容，另一个 Agent 负责评审/批判。评审结果反馈给生成器，循环迭代直到质量达标。

```
生成器 → 评审器 → 反馈 → 生成器（循环）
         ↓
       通过？
```

**适用场景**：代码审查、文案精修、质量敏感的内容生成。

**特点**：强制质量门禁，通过迭代循环逼近目标质量。

---

## 模式对比

| 模式 | 灵活性 | 复杂度 | 适用场景 |
|------|--------|--------|----------|
| Sequential Pipeline | 低 | 低 | 确定性链式任务 |
| Parallel Fan-Out/Gather | 中 | 中 | 并行探索+汇总 |
| Coordinator/Dispatcher | 高 | 中高 | 动态多领域任务 |
| Hierarchical Decomposition | 中 | 高 | 大型复杂项目 |
| Generator & Critic | 高 | 中 | 质量门禁场景 |

---

## 与 SKILL.md 编写模式的区别

| 维度 | SKILL.md 五种模式（Tool Wrapper、Generator、Reviewer、Inversion、Pipeline） | ADK 五种 Agent 编排模式 |
|------|---|---|
| 关注点 | Skill 内部内容的组织方式 | Agent 之间的协作架构 |
| 层次 | 指令/提示词设计层面 | 系统架构层面 |
| 应用 | 写好一个 Skill 的内容 | 设计多 Agent 系统结构 |

两者可以组合使用：例如一个 Pipeline 模式的 Skill 可以内部使用 Reviewer 模式来质量检查。

---

## 参考链接

- [Choose a design pattern for your agentic AI system](https://cloud.google.com/architecture/choose-design-pattern-agentic-ai-system) — Google Cloud Architecture Center
- [Developer's guide to multi-agent patterns in ADK](https://developers.googleblog.com/en/developers-guide-to-multi-agent-patterns-in-adk/) — Google Developers Blog
- [Agentic Design Patterns（Springer, 21 patterns）](https://link.springer.com/content/pdf/10.1007/978-3-032-01402-3.pdf) — Antonio Gullí