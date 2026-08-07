---
title: "企业级 Agent 平台工程外壳：workspace、沙箱、skill"
date: "2026-08-07"
source: "公众号"
---

# 企业级 Agent 平台工程外壳：workspace、沙箱、skill

> AgentScope Java 2.0 的工程外壳设计——workspace 文件化、沙箱 SPI 化、skill 自学习闭环。

## 核心定义

工程外壳是 Harness 层中不参与推理、只负责工程能力的子系统，包括 workspace（角色/记忆/技能的文件系统化管理）、沙箱（隔离执行环境）、skill 管理（技能的创建、晋升、淘汰）。核心思路：让 agent 能安全、有记忆地"干活"。

## 关键洞察

1. **workspace 文件化是 context engineering 的落地**——角色（AGENTS.md）、记忆（MEMORY.md）、技能（skills/）全部做成文件系统，LLM 可读可写，改人设改个 markdown 文件就行，不比硬编码在代码里灵活得多。

2. **沙箱 SPI + 状态持久化解决"跨副本干活现场不丢"**——acquire 4 级优先级（注入 Sandbox → 注入 State → 持久化恢复 → 全新创建）让沙箱状态可跨副本 resume，滚动发布不丢现场。

3. **stop() ≠ shutdown() 是易混淆的关键设计**——stop 持久化快照不销毁后端，shutdown 真正释放资源。搞混了要么状态丢要么资源泄漏。

4. **skill 自学习闭环很超前但 v1 别急**——前提是 agent 稳定、usage 数据足够，否则容易攒出一堆垃圾 skill。

## 工程坑点（AgentScope 的债，自己补）

- **SandboxExecutionGuard 名不副实**：只是并发槽位锁，没有命令黑名单/资源限额/网络出口控制
- **workspace 锁 in-process 不跨副本**：多副本部署需要后端 CAS 乐观锁
- **docker 沙箱 fork docker CLI**：高并发下有进程 fork 开销和 stdout 截断风险

## 相关概念

- [[Harness Engineering]] — 工程外壳是 Harness 层的核心子系统
- [[AgentScope 分层架构]] — 同系列第一篇：无状态内核 + 组合式外壳哲学
- [[Context Engineering]] — workspace 文件化是 context engineering 的具体实践
- [[Agent Skill]] — skill 自学习闭环与 Agent 技能管理

## 原文

唐成的 AgentScope Java 2.0 源码拆解系列第三篇。[原文链接](https://mp.weixin.qq.com/s/3_sbEcVe0Qv6CW4onvJFnQ)