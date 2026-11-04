---
title: "Responses API：Agentic Loop 的协议基座"
date: "2026-11-04"
source: "微信公众号 / 从码农到工匠"
url: "https://mp.weixin.qq.com/s/6lGd8uea2fsqKzeR5QL_6Q"
---

# Responses API：Agentic Loop 的协议基座

> OpenAI Responses API 把「思考 → 行动 → 观察 → 重新思考」的 Agentic Loop 打包进协议层，成为 Agent 与模型交互的事实标准接口；代价是各家 MaaS 实现仍有差异，需以实测为准。

## Key Points

- **Responses API 是差异最小化的最优解**：它把 Agentic Loop 闭环结构化进了协议，而 Chat Completions API 只提供无状态文本生成。
- **响应按阶段解耦**：`output` 数组按 `reasoning` / `tool_call` / `message` 分类型，不再是单一的 `choices[0].message`。
- **流式有五种核心事件**，必须分别处理，不能把增量一律当成最终答案。
- **上下文所有权是显式决策**：服务端 Store（`store` + `previous_response_id`）与客户端历史二选一或混用，取决于服务商支持度。
- **能力支持度必须实测**：DeepSeek 不支持有状态存储，GLM-5.3 支持；`strict: true` 在部分 MaaS 上直接报错。

## Details

### 两次范式演进

| API | 诞生 | 定位 | 现状 |
|---|---|---|---|
| **Chat Completions** | 2023 | 文本对话范式 | 机制直观，不再演进，但作为基础标准广泛沿用 |
| **Responses** | 2025 | 智能体循环范式 | 原生支持状态延续、工具循环、推理过程显性化 |

标准之所以重要：没有统一接口规范，仅为了让通用 Agent 对接百花齐放的 Provider，就足以陷入无休止的适配陷阱。OpenAI 凭先发优势成为事实标准，主流 MaaS 基本兼容。

### 请求结构

```json
{
  "model": "gpt-5",
  "instructions": "你是一个严谨的 Agent 架构师...",
  "input": "分析当前系统架构并调用工具生成报告",
  "previous_response_id": "resp_abc123",
  "tools": [{ "type": "web_search" }],
  "reasoning": { "effort": "high" },
  "store": true
}
```

`model` 与 `input` 必选，其余可选：`instructions` ≈ 旧 system role；`tools` 声明可用工具；`reasoning.effort` 表推理深度。

### 响应结构

非流式返回完整汇总对象，`output` 按阶段分层：

```json
{
  "id": "resp_67c1d2e3f4",
  "object": "response",
  "status": "completed",
  "model": "gpt-5",
  "output": [
    { "type": "reasoning", "summary": "分析了用户需求，决定先调用搜索工具获取最新数据..." },
    { "type": "tool_call", "id": "call_998877", "name": "web_search", "args": { "query": "OpenAI Responses API 规范" } }
  ],
  "usage": { "input_tokens": 450, "output_tokens": 120, "reasoning_tokens": 80 }
}
```

### 五种核心流式事件

| 事件类型 | 语义 |
|---|---|
| `response.created` | 响应对象已建立，返回本轮的 `response_id` |
| `response.reasoning_text.delta` | 思维链增量文本 |
| `response.output_text.delta` | 最终回答文本增量（final answer 走这里） |
| `response.function_call_arguments.delta` | 函数调用参数增量，供客户端实时预解析 Action |
| `response.completed` | 本轮响应周期结束；一个 agent 任务可能涉及多次 turn |

实战中基本都用流式（逐字吐字是体验刚需），所以 Streaming 是理解 Agent Loop 的关键。

### 五种能力组合

1. **多轮上下文**：服务端 Store 或客户端历史消息
2. **流式接收**：SSE 推送 reasoning / 回答文本 / 完成状态
3. **请求取消**：AbortController 传 signal，同时中止 HTTP 请求与 SSE 流
4. **结构化输出**：`text.format` 声明 JSON Schema，`strict: true` 强制遵守
5. **函数调用**：模型只产出函数名与参数，**真正执行的是客户端**

函数调用的完整闭环：

```
用户问题
  ↓
模型返回一个或多个 function_call
  ↓
客户端解析参数并执行本地函数
  ↓
客户端生成 function_call_output
  ↓
模型读取工具结果并生成最终回答
```

两个易错点：
- `parallel_tool_calls: true` 时模型可同轮返回多个调用，客户端并发执行后**按 `call_id` 对应回填**。
- 客户端维护上下文时**不能只发 `function_call_output`**——服务端可能没保存第一轮的工具调用，必须把原始 `function_call` 一起发回。

### 边界

- Schema 约束输出格式，**不替代业务层校验**，也不保证模型提供的信息真实正确。
- 服务端存上下文省了客户端拼历史，但引入服务端状态、保留时间、隐私与成本约束。
- 各家 MaaS 实现仍有差异（DeepSeek vs GLM），**能力支持度必须以服务商文档和实际测试为准**。

## Context

出自「从零构建 Agent」系列第二篇，是该系列第一件技术落地——系列后续的 Agent Loop、MCP、Skills、Session、SubAgent、Model 管理全部建立在这层接口之上。

其工程价值在后续篇章被反复兑现：第 3 篇直接用 Responses API 的结构化 `type` 替换掉手写 ReAct 提示词；第 10 篇的 Model 管理则是为了让路由层能按模型切换 Provider 而把客户端从单一实例解耦。

## Related Pages

- [[patterns/context-ownership-server-vs-client]] — 服务端 Store 与客户端历史的取舍
- [[patterns/agent-event-decoupling]] — SSE 事件如何加工成 Agent 侧事件
- [[patterns/agent-loop]] — 建立在 Responses API 之上的循环模式
- [[concepts/agent-tech-stack-selection]] — 选型阶段为什么定下 TypeScript
- [[concepts/loop-engineering]] — Agentic Loop 的方法论溯源
- [[sources/zeroagent-02-llm-interaction]] — 原始归档

## Sources

- 《从零构建 Agent（二）：大模型交互》，公众号「从码农到工匠」，2026-09-15：Responses API 请求/响应结构解析；六种常见用法 demo（store / store-client / stream / abort / structured / calling）；DeepSeek 与 GLM-5.3 在有状态存储上的能力差异
