---
title: "AI 时代的软件基本功——Uncle Bob 访谈核心提炼"
date: "2026-08-21"
source: "foolgry.top（基于 Matt Pocock 对 Uncle Bob 的访谈）"
url: "https://md.foolgry.top/s/b6316d63"
---

# AI 时代的软件基本功

> 基于 Matt Pocock 对 Robert C. Martin（Uncle Bob）的访谈「LIVE: Uncle Bob on Software Fundamentals in the Age of AI」

## 一句话主线

**AI 改变的是实现劳动的成本与速度，而不是软件复杂性本身。** Agent 负责编码，人类负责搭建「确定性工具 + 清晰架构 + 可执行验收」的质量围栏。

## 核心洞察

1. **脏代码会让 Agent 也 thrashing**：脏代码累积 → 模块边界模糊 → 上下文负担上升 → 改动副作用增加 → 反复修复 thrashing → 速度可靠性双降
2. **确定性工具 > 长提示（Steering）**：长提示规则会受「lost in the middle」影响；质量要求应放到提示之外，以 CRAP、mutation testing、类型检查、架构 checker 等确定性 gate 执行
3. **质量控制是一个「受约束的 Agent Loop」**：Agent 产出 → 工具发现缺口 → Agent 修复 → 再验证 → 通过后交接。阈值：Agent 端到端速度 / 人工端到端速度 > 1
4. **Multi-Agent 的核心收益是上下文卫生**：Specifier → Coder → Cleaner → Hardener → QA 五阶段流水线，每阶段干净上下文启动，可验证交接
5. **模块化为 Agent 降低理解复杂度**：架构意图写成可执行依赖规格，由 checker 验证违规 → dependency inversion / interface 拆分
6. **「价值不变，纪律可变」**：不要将人类纪律（如 TDD 的 Red–Green 节奏）强加给 Agent，但要把人类价值（可理解性、可靠性、测试保障）嵌入 Agent
7. **小 Story > Plan-maxing**：Agent 降低变更成本后，最优流程是高频小步试验 + 即时反馈 + 架构重组，而非超长前期规格
8. **战术编码→战略编程**：Agent 擅长战术层，人类需迁移到战略性组织复杂度；初级工程师仍需亲历代码以识别 Agent 的挣扎

## Agent 时代软件工程五层模型

| 层级 | 核心问题 | 主要产物 | 人类责任 |
|------|----------|----------|----------|
| 价值层 | 什么质量不可妥协？ | 可靠性、可理解性、低耦合 | 决定价值与边界 |
| 架构层 | 系统如何组织复杂性？ | 模块边界、接口、依赖规则 | 制定能让 Agent 理解的结构 |
| 规格层 | 当前迭代要实现什么？ | 小 Story、Gherkin、QA procedure | 提供足够但不过度的意图 |
| 执行层 | 谁以何种上下文做哪段工作？ | Coder/Cleaner/Hardener/QA Agent | 切分任务、控制上下文 |
| 验证层 | 如何判断结果可交付？ | 测试/CRAP/mutation testing/架构 checker | 翻译为确定性、不可绕过的 gate |

## 关键引用

> "It is probably a mistake to impose a human discipline on an agent. It is not a mistake to impose human values on the agent." — Uncle Bob
>
> "They are fast with code. I am slow with code. So I'm going to let them have the code and I'm going to deal with the stuff around that to make sure it's all okay." — Uncle Bob