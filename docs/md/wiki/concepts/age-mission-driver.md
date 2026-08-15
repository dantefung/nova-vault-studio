---
title: "AGE（Attractor-Guided Engineering）与 Mission Driver 体系"
date: "2026-08-15"
---

# AGE 与 Mission Driver 体系：吸引子引导工程

> 当 AI 7×24 小时自主运行，系统必须戒断对人即时解释的依赖。AGE（Attractor-Guided Engineering）通过外化方向、权威、证明和轨迹记忆，让项目本身成为一个持续演化的主体——而不是依赖某个 Agent 记住项目。

<!-- more -->

## 核心概念

| 概念 | 定义 |
|------|------|
| **状态空间** | 系统演化过程所有可能出现的结构 |
| **吸引子（Attractor）** | 系统长期应稳定趋向的结构 |
| **轨迹（Trajectory）** | 系统实际上怎样走到了现在 |
| **控制（Control）** | 测量与纠偏机制如何把轨迹拉回吸引子附近 |

## AGE 与相关概念的层级关系

```
Loop Engineering        →  执行结构（"怎么循环"）
Harness                  →  模型之外的一切（指令/传感器/护栏/验证/反馈）
AGE                      →  方向（吸引子）+ 收敛标准 + 认知恢复
Mission Driver           →  AGE 框架下的执行器（按 roadmap 编排 Plan 生命周期）
```

## 三个时间维度的机制

### 运行之前：docs 体系建立

- **规范性文档**（architecture / design 等 Owner Docs）：定义期望吸引子与权威归属，不带日期、原地更新
- **时效性文档**（plans / logs / audits / analysis）：描述某个时间窗口内实际发生了什么，带日期、只在有效窗口内可信
- **Precedence**：冲突裁决依据，而非按更新时间或取用便利性

### 运行之中：状态显性化

- roadmap / plan / audits 文件就是 AI 的认知
- 人工介入是异步的：直接改 roadmap 或增删 plan，下一轮循环自动拾取
- logs 同步记录关键决策与验证结果

### 运行之后：经验反哺

- 人工纠正的模式沉淀为 skill
- 审计遗漏的维度补入审计提示词
- 重复失败提升为 lessons

## 四个可观察的机制设计

1. **状态显性化**：文件显性化 AI 的内部运行状态与认知
2. **不停循环的介入**：不暂停 loop 也能修改计划，下一轮自动拾取
3. **轨迹的充分统计量**：logs 记录核心轨迹，新主体可快速恢复演化认知
4. **审计反哺**：审计历史反向抽取 skill，改进后续工作

## 三层"AI 全自动"

| 层次 | 状态 | 说明 |
|------|------|------|
| **执行自动化** | 已实现 | 给定 Plan，AI 自主修改代码、测试、验证 |
| **编排自动化** | 已实现 | 给定 Roadmap 和 Attractor，自主起草/审查/执行/关闭 Plan |
| **方向自治** | 需人类治理 | 澄清模糊目标、提出新结构语言、处理利益冲突 |

## 核心命题

> 不是让某个 Agent 记住项目，而是让项目本身不再遗忘自己。

> 曾经的问题：如何让 Agent 更稳定地长期工作。
> 真实的问题：如何让项目本身——文档、代码以及运行其上的 Mission Driver 等工具——构成一个持续演化的主体。

## 关键区分

| 对比 | 普通 Loop Engineering | AGE + Mission Driver |
|------|----------------------|---------------------|
| 状态位置 | 引擎内部/黑箱 | 仓库文件中 |
| 介入方式 | 停止循环改 prompt | 异步改文件，下一轮自动拾取 |
| 方向来源 | 每次任务/外部输入 | 外化的期望吸引子（Owner Docs） |
| 信息寿命 | 单次任务，会话结束即失效 | 跨任务、跨会话持续有效 |
| 失败处理 | 异常→中断 | 预期输入→重试/降级/隔离 |
| 知识沉淀 | 无 | skill / lessons / audits 反向反哺 |

## 实践案例：nop-app-erp

- 22 天（06-22 → 07-13）、187 份 Plan 全部双审计通过
- 人工介入从早期高频衰减至 07-14 后为零
- 沉淀 19 个可复用 skill + docs-for-ai 补充 + lessons
- A/B/C 类介入频次与 AI 自主度在 06-29 ~ 07-01 交叉

## 参考来源

- [Mission Driver 补充说明](../sources/mission-driver-supplement.md) — 可逆计算，微信公众号
- [Mission Driver 原文](../sources/mission-driver.md)

## 相关概念

- [实用循环工程](./deepseek-harness-agent-formula.md) — Addy Osmani
- [AgentScope HarnessAgent](./agentscope-harnessagent-declarative.md)
- [Agent 平台架构](./agent-token-architecture.md)