---
title: "搭一个企业级 Agent 平台（五）：多 Agent 编排——spawn、超时晋升、跨副本路由"
date: "2026-08-03"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/umihKCJhFIIBdNnc2-JdMQ"
---

# 搭一个企业级 Agent 平台（五）：多 Agent 编排——spawn、超时晋升、跨副本路由

> 超时晋升不丢弃、事件转发一条流、跨副本三段式路由——多 Agent 编排的三条生产级铁律。

系列第五篇，钻进多 Agent 编排子系统。前面讲单个 agent 怎么想、怎么干、怎么管，这篇讲多个 agent 怎么协作。

## 一、spawn / send：把 agent 当函数调

多 agent 协作的基础原语是两个工具（在 `AgentSpawnTool` 里）：

- **spawn**：按配置生成一个子 agent 并让它干活。流程是 `createAgentIfPresent` + `invoke`。可以 `persistSession`（用确定式 hash 生成 key，下次复用同一个子 agent 的会话）。
- **send**：用 `agent_key` 或 `label` 找到已经 spawn 过的子 agent，再发消息给它（找不到会从 `SpawnRegistry` 恢复）。

> 说白了：spawn = new 一个子 agent 并跑，send = 给已有的子 agent 发消息。把 agent 当函数调，但这个"函数"有自己的会话和状态。

![spawn 流程](images/agentscope-multi-agent/001.png)

执行时有三种路径：`timeout=0` 走异步（注册成后台任务）、远程走 HTTP 同步、本地走带超时晋升的同步。

![三种执行路径](images/agentscope-multi-agent/002.png)

## 二、超时晋升：超时也不丢弃（最值得抄）

子 agent 跑久了会超时。普通做法是超时就 cancel 掉——用户白等一场。AgentScope 的做法很巧妙（`execWithTimeoutPromotion`）：

> **超时不取消**，而是用 CompletableFuture 桥接，把子 agent 收编成一个后台任务（AdoptedTaskRunSpec），结果异步算完后推回 inbox + 唤醒父 agent。

**超时 → 收编后台任务 → 完成后 inbox+唤醒 → 最终结果异步回来合并。**

为什么这个设计好？agent 任务往往耗时不可控（调外部 API、跑长脚本）。硬超时 kill 掉，用户前面等的全白费；收编成后台任务，用户该干啥干啥，结果好了再通知——这是生产环境里体验最好的超时策略。

> 抄什么：做多 agent 编排时，超时策略想清楚是"丢、重试、还是收编"。多数场景"收编为后台任务 + 异步唤醒"体验最好，别无脑 kill。

## 三、事件转发：子的实时进父的流

子 agent 跑的时候会产生一堆事件（流式文本、工具调用）。如果父 agent 的事件流里看不到，前端就显示成"父在干等"，体验割裂。

AgentScope 的做法（`execLocalSync`）：子 agent 的事件经 `AgentEventEmitter.FORWARDING_CONTEXT_KEY` 实时转发进父的事件流，并自动补发 `AgentStart/End`，给转发来的事件打上 source 路径标记（比如 `main/researcher`）。前端看到的是一条连贯的父子流，而不是父阻塞、子黑箱。

这和第四篇的"统一事件流"是一脉相承的——正因为事件流统一，子 agent 的事件才能无缝并入父流。

## 四、跨副本路由：子 agent 跨节点也能找到

生产环境是多副本的。父 agent 在节点 A spawn 了一个子 agent，子 agent 可能在节点 B 被调度执行。怎么找到它？

AgentScope 用**三段式路由**（`HarnessGateway` + `StoreBackedSubagentRegistry`）：

1. **先查本机**有没有这个 exposed subagent（live 缓存）
2. **miss 了查分布式存储**里的 `SubagentRecord`（持久化 registry）
3. 拿到记录后，在**本节点用 materialize 重新构建** agent 实例

没有分布式存储时，优雅退化为单进程（`InMemorySubagentRegistry`）。这套设计让 exposed subagent 跨副本可恢复——任何一个副本都能接手。

> 抄什么：跨副本路由用"live 缓存 + 持久化 registry + 本节点 materialize"三段式，无分布式存储时单进程退化。这是多副本 agent 平台的标配。

## 五、抄什么 + 避什么坑

### 值得抄
- 超时收编为后台任务 + 异步唤醒，不丢弃
- 子事件并入父流，前端一条连贯流
- live + registry + materialize 三段式路由

### 要避的坑
1. **MAX_SPAWN_DEPTH=3 是硬编码**防递归爆炸——建议做成可配置，不同场景深度需求不同
2. **spawn 有 5 种分支**（sync/async/remote/timeout-promotion/reuse），事件转发有 3 条路径。设计时尽早画清状态图，否则后期没人敢动
3. **RemoteSubagentStub.doCall 超时返回"不支持"文本**而不是抛异常——调用方（或 LLM）容易当成正常子 agent 结果。远程子 agent 的错误要显式抛，别用文本冒充结果

## 六、一句话带走

> 超时晋升不丢弃、事件转发一条流、跨副本三段式路由——多 agent 编排的三条生产级铁律。

**下一篇预告：** 扩展生态 + 避坑总结——Model/Sandbox SPI 怎么留口、双 BOM 治理、贯穿全系列的"7 条铁律 + 避坑清单"。