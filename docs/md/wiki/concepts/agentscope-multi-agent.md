---
title: "多 Agent 编排：spawn、超时晋升、跨副本路由"
date: "2026-08-07"
source: "公众号"
---

# 多 Agent 编排：spawn、超时晋升、跨副本路由

> 超时晋升不丢弃、事件转发一条流、跨副本三段式路由——多 Agent 编排的三条生产级铁律。

## 核心定义

多 Agent 编排子系统负责让多个 agent 协作，核心原语是 spawn（new 子 agent 并跑）和 send（给已有子 agent 发消息），关键机制包括超时晋升、事件转发、跨副本路由。

## 关键洞察

1. **spawn/send 把 agent 当函数调**——但这个"函数"有自己的会话和状态，可 persistSession 复用。

2. **超时晋升是最值得抄的设计**——超时不取消，收编为后台任务（AdoptedTaskRunSpec），异步算完推回 inbox + 唤醒父 agent。多数场景"收编 + 异步唤醒"体验最好，别无脑 kill。

3. **子事件并入父流**——通过 FORWARDING_CONTEXT_KEY 实时转发，自动补发 AgentStart/End，打 source 路径标记。前端看到一条连贯的父子流。

4. **跨副本三段式路由**——live 缓存 + 持久化 registry + 本节点 materialize，无分布式存储时单进程退化。

## 三个坑（别踩）

- MAX_SPAWN_DEPTH=3 硬编码防递归爆炸，建议可配置
- spawn 有 5 种分支、事件转发 3 条路径，要画清状态图
- RemoteSubagentStub 超时返回文本而非抛异常，错误要显式抛

## 相关概念

- [[AgentScope 分层架构]] — 本系列第一篇：无状态内核 + 组合式外壳
- [[企业级 Agent 平台工程外壳]] — 本系列第三篇：workspace/沙箱/skill
- [[Agent 平台治理]] — 本系列第四篇：权限/停机/事件流
- [[Harness Engineering]] — 多 Agent 编排是 Harness 层的能力

## 原文

唐成的 AgentScope Java 2.0 源码拆解系列第五篇（多 Agent 编排）。[原文链接](https://mp.weixin.qq.com/s/umihKCJhFIIBdNnc2-JdMQ)