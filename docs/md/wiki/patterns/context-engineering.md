---
title: "Context Engineering"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Context Engineering

上下文管理四操作：**写、选、压、隔**。

## 四操作

### 写

每一步往上下文里加什么，要想清楚。不是一股脑全倒进去。

### 选

从记忆或文件里精准检索，不是一股脑全倒进去。

### 压

上下文快满时压缩成摘要，但关键决策不能丢。

### 隔

子 Agent 在独立上下文窗口跑，主线程不受污染。

## 关键：隔离子 Agent 上下文

主 Agent 委派任务给子 Agent，子 Agent 拿到干净窗口，只装任务和必要文件，完成后返回摘要——不是返回完整对话记录。

## 相关

- [[isolated-sub-agent]] — 子 Agent 隔离
- [[orchestrator-pattern]] — 编排器
