---
title: "Orchestrator Pattern"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Orchestrator Pattern

编排器是整棵 Agent 树最上面的节点。它只做三件事：**规划、委派、汇总**。

## 关键原则

编排器一旦自己干活，就会把上下文污染掉，再也看不清全局。

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

## 相关

- [[agent-loop]] — Agent Loop
- [[isolated-sub-agent]] — 子 Agent 隔离
- [[shared-task-list]] — 共享任务列表
