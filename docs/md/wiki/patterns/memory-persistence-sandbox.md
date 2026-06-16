---
title: "Memory, Persistence, and Sandbox"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Memory, Persistence, and Sandbox

第三层：让整个系统可以上线跑。

## 三件套

### 记忆

结构化存储，主动往里写事实、决策、约定。

### 持久化

每一步执行前后动作和结果落盘，崩溃后从轨迹恢复。

### 沙箱

Agent 跑在容器或受限子进程里，只访问被明确授权的东西。

## 相关

- [[orchestrator-pattern]] — 编排器
- [[evaluation-pipeline]] — 评估流水线
