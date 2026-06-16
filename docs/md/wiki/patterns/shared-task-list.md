---
title: "Shared Task List"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Shared Task List

没有共享状态，"团队"就是一堆人各干各的。

## 共享任务列表三要素

1. **明确的分配人** → 两个 Agent 永远不会抢同一个任务
2. **明确的依赖关系** → 前置任务没完成，后面的不会启动
3. **明确的状态字段** → 编排器不用读对话记录就能知道进度

## 相关

- [[orchestrator-pattern]] — 编排器
- [[isolated-sub-agent]] — 子 Agent 隔离
