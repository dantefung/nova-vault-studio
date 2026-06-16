---
title: "Agent Loop Pattern"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Agent Loop Pattern

Agent Loop 核心是在代码里写死循环结构：模型接收状态 → 选择动作 → 执行 → 得到结果 → 更新状态 → 继续循环。

## 三件很多人忽略的事

1. **审批闸门**：危险操作必须卡住
2. **日志钩子**：每一步做了什么、为什么做，必须记录
3. **明确的停止条件**：最大迭代次数（通常设 30-50 轮），一个跑飞的 Agent 比一个慢的 Agent 可怕得多

## 反模式

"请逐步思考"不是 Agent Loop——它没有写死在代码里的循环结构。

## 相关

- [[orchestrator-pattern]] — 编排器
- [[typed-tool-schema]] — 工具定义
