---
title: "Multi-Agent Architecture（多Agent协作架构）"
date: "2026-06-11"
---

# Multi-Agent Architecture（多Agent协作架构）

> Anthropic 工程团队实践总结：10个多Agent项目里，9个走不出Demo阶段。问题不是模型不够强，是缺Agent之间的结构。

## Key Points

- **核心问题**：如果你试过让多个 AI Agent 一起干活——一个 Agent 在五个标签页里自言自语、两个 Agent 抢同一件事做、第三个跑完了没人知道、第四个每一步都在重新理解整个任务
- **三层九阶段框架**：把单个 Agent 做对 → 让 Agent 之间能协作 → 让整个系统可以上线跑

## 三层九阶段框架

```
第一层：把单个 Agent 做对
  STEP01 定义 Agent Loop
  STEP02 工程化上下文：写、选、压、隔
  STEP03 写对工具定义

第二层：让 Agent 之间能协作
  STEP04 用隔离上下文创建子 Agent
  STEP05 设计编排器：只规划、只委派、不执行
  STEP06 建一个共享任务列表

第三层：让整个系统可以上线跑
  STEP07 加记忆、加持久化、加沙箱
  STEP08 接上评估和轨迹检查
  STEP09 上线：权限和人工检查点
```

## 第一层：把单个 Agent 做对

### STEP01 定义 Agent Loop

Agent Loop 核心是在代码里写死循环结构：模型接收状态 → 选择动作 → 执行 → 得到结果 → 更新状态 → 继续循环。

三件很多人忽略的事：
- **审批闸门**：危险操作必须卡住
- **日志钩子**：每一步做了什么、为什么做，必须记录
- **明确的停止条件**：最大迭代次数（通常设30-50轮），一个跑飞的Agent比一个慢的Agent可怕得多

### STEP02 工程化上下文：写、选、压、隔

上下文管理四操作：
- **写**：每一步往上下文里加什么，要想清楚
- **选**：从记忆或文件里精准检索，不是一股脑全倒进去
- **压**：上下文快满时压缩成摘要，但关键决策不能丢
- **隔**：子 Agent 在独立上下文窗口跑，主线程不受污染

## Related Pages

- [concepts/harness-engineering](concepts/harness-engineering) — 驭化工程
- [patterns/engineering-taste](patterns/engineering-taste) — 工程品味
- [patterns/ai-agent-automation](patterns/ai-agent-automation) — AI Agent自动化模式

## Sources

- 微信公众号《从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作》(2026-06-11)