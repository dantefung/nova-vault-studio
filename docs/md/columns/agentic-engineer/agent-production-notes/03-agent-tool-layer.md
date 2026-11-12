---
title: '生产级 Agent 的工具层：从"函数裸调"到"受控执行单元"'
date: "2026-07-06"
source: "微信公众号：老梁agent"
---

# 生产级 Agent 的工具层：从「函数裸调」到「受控执行单元」

> 生产实战笔记系列第 03 篇。MVP 假设模型只调用一次，生产级假设模型可以调用任意多次——三层防护改造工具层。

---

## 核心问题

MVP 的 `@Tool` 方法直接执行数据库操作。如果 LLM 在 ReAct 循环中两次决策「需要创建工单」，数据库里就会出现两张完全独立的工单。换成退款、发券、扣库存，重复调用就是直接的经济损失。

## 三层防护

| 层 | 机制 | 解决的问题 |
|----|------|-----------|
| 第一层 | **ToolRegistry 副作用分类** | READ/WRITE 分类，读写工具差异化限流 |
| 第二层 | **ToolBudget 预算熔断** | 单次请求工具调用次数上限，超限立即熔断 |
| 第三层 | **ToolExecutor 强制幂等** | 用 execution_id 去重，同一次请求不会重复执行 |

## 审计日志

每一次工具调用都有迹可循：谁在什么时间调用了什么工具，参数是什么，结果是什么，耗时多少。

> 📎 完整原文见知识库：[wiki/sources/agent-tool-layer.md](../../../wiki/sources/agent-tool-layer.md)

---

[← 上一篇：体检清单](./02-agent-production-checklist.md) | [下一篇：Runtime 状态机 →](./04-agent-runtime-state-machine.md)