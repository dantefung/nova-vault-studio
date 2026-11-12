---
title: "Input Attribution"
date: "2026-10-15"
source: "wiki-ingest"
---

---
title: "输入归属（Input Attribution）"
date: "2026-10-15"
source: "wiki-ingest"
---

# 输入归属（Input Attribution）

> Agent 循环中一条新消息到达时，系统凭什么决定它属于"当前 step 的下一步"、"当前 turn 的下一步"还是"下一次 turn"。

## 核心规则

三条按循环位置互斥触发的裁决规则：

| 循环状态 | 规则 | 容器 |
|---------|------|------|
| 工具运行中（循环正忙） | 规则一：steering 队列 | 当前 turn 的下一步 |
| turn 刚收口（再入场窗口打开） | 规则二：follow-up 裁决 | 下一次 turn |
| Agent 空闲（无任何运行中工作） | 规则三：直接注入 | 当前新 turn |

## 三个候选容器

| 容器 | 边界 | 输入进去后 |
|------|------|-----------|
| 当前 step | 请求发出 → 工具结果归队 | 立即进当前上下文，模型下次输出就能用 |
| 当前 turn 的下一步 | step 收口 → turn 收口 | 排队，等下一次模型回访时注入 |
| 下一次 turn | turn 收口 → 下一轮开始 | 排队，等下一组输入启动 |

## 架构要点

- **状态建模 vs 事件建模**：pi 走状态建模（容器是循环内部的状态字段），DSH 走事件建模（容器是事件流上的位置）
- **归属在裁决那一刻确定**：同一个消息，裁决前归"下一次 turn"，裁决后归"当前新 turn"
- **裁决不重入**：follow-up 执行期间到达的消息不打断裁决，先进输入队列
- **单消费点**：无论消息来自哪条规则，都统一进输入队列由同一个出队点消费，避免竞态

## 四层模型对应

| 层 | 输入归宿 | 裁决者 |
|----|---------|--------|
| request | 注入当前请求 | 无（请求已发出，来不及裁决） |
| step | 注入当前 step 的下一步 | 规则一（steering 队列） |
| turn | 当前 turn 的下一步 / 下一次 turn | 规则一 + 规则二（follow-up） |
| activity | 空闲后新任务的输入 | 规则三（直接注入） |

## 产品接线差异

同样的三条规则，两种接线：

- **交互式聊天 Agent**：steering 返回"打断式"约束，follow-up 返回"不派"，消息直接成为新 turn
- **自主执行 Agent**：steering 返回"排队式"约束，follow-up 返回"派"，消息排进任务队列

「输入归属的裁决规则是共享的，裁决的参数是产品的」。

## Related Pages

- [[concepts/bot-vs-codex-context]]
- [[patterns/agent-router-table]]

## Sources

- 王江华《Pi 与 DSH 的输入归属》：mp.weixin.qq.com/s/IVyLRVEtb2JUNf2WTWbwSQ
