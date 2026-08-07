---
title: "AgentScope 分层架构：无状态内核 + 组合式外壳"
date: "2026-08-07"
source: "公众号"
---

# AgentScope 分层架构：无状态内核 + 组合式外壳

> 冻结内核语义，用组合式外壳管理变化——企业级 Agent 平台的工程铁律。

## 核心定义

AgentScope Java 2.0 的分层架构哲学：把 Agent 平台切成三层——无状态 ReAct 推理内核（大脑）、委托内核叠加工程能力的外壳（身体）、18 类可插拔扩展（手脚）。核心是"变化点被控制在哪一层"。

## 关键洞察

1. **ReAct 内核是"单实例 × 多 session 并发"，不是无状态单例**——把可变状态按 (userId, sessionId) 分槽缓存，每次调用新建 CallExecution，通过 Reactor Context 传递，不靠锁、不靠同步，实现水平扩展。

2. **中间件是"洋葱 4 点 + 管道 1 点"，不是五阶段枚举**——4 个洋葱点（onAgent/onReasoning/onActing/onModelCall）带 next 函数 wrap 语义，1 个管道点（onSystemPrompt）顺序变换。比五阶段枚举灵活得多。

3. **call 和 stream 真正合一**——call() 只是 streamEvents() 的"取末尾结果"特例，一套内核维护两种模式。

4. **HarnessAgent 委托 ReActAgent，不是继承**——继承会让工程能力渗透进内核，组合才能独立替换和测试。

5. **GA 版本背着 112 处 @Deprecated**——暴露 1.x→2.0 迁移的五处双轨债，forRemoval 是承诺，承诺不兑现就是债的复利。

## 三条工程铁律

- ReAct 流程确定后不轻易改，变化发生在扩展层
- 新旧两套并存必须有明确删除版本号和时间限制
- 核验优于相信文档，API 文档从代码生成

## 相关概念

- [[Harness Engineering]] — 外壳是 Harness 层的核心子系统
- [[企业级 Agent 平台工程外壳]] — 本系列第三篇：workspace/沙箱/skill（同系列的工程外壳落地）
- [[Agent 中间件]] — 洋葱模型的中间件机制

## 原文

唐成的 AgentScope Java 2.0 源码拆解系列第一篇（分层架构）。[原文链接](https://mp.weixin.qq.com/s/xmW_z-OS35lYcvAby16i5g)