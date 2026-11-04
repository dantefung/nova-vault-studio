---
title: "从零构建 Agent（二）：大模型交互"
date: "2026-11-04"
source: "微信公众号 / 从码农到工匠"
author: "从码农到工匠"
url: "https://mp.weixin.qq.com/s/6lGd8uea2fsqKzeR5QL_6Q"
---

# 从零构建 Agent（二）：大模型交互

> 本文是「从零构建 Agent」系列的第 2 篇：大模型交互。
> Agent 的第一步是与大语言模型建立高效交互。作者选择 **OpenAI Responses API** 作为统一接口标准，拆解其请求 / 响应结构与五种核心流式事件，并用六个可运行的 demo 覆盖服务端 Store、客户端上下文、流式输出、请求取消、结构化输出与并行 Function Calling。

<!-- more -->

本文是构建 Agent 的基础，对于致力于打造自己 Agent 的同学，一定要好好掌握。

对于 Agent 而言，迈出的第一步就是与**大语言模型建立高效交互**。从最初简单的「一问一答」（Request-Response），演进到如今复杂的「智能体循环」（Agentic Loop），这种交互机制已经发生了深刻的技术变革。如果没有一套统一的接口标准，仅为了让通用 Agent 对接市面上百花齐放的模型供应商（Provider），就足以让开发者陷入无休止的适配陷阱。

幸运的是，凭借强大的先发优势，**OpenAI 的 API 规范已然成为全行业事实上的「通用标准」**。主流的 MaaS（Model-as-a-Service）平台基本都兼容这套协议。这也意味着，只要 Agent 基于 OpenAI 规范设计，就能以极低的迁移成本无缝接入绝大多数主流大模型。

目前 OpenAI 的 API 规范主要经历了两次关键的范式演进：

- **Chat Completions API（文本对话范式）**：诞生于 2023 年。主要面向简单的文本对话场景，机制直观，虽已不再演进，但仍作为基础标准被广泛沿用。
- **Responses API（智能体循环范式）**：推出于 2025 年。这是专为 Reasoning 模型与 Agent 复杂工作流打造的通用 API。它在协议层面将「思考（Think）→ 工具调用（Action）→ 观察结果（Observe）→ 重新思考（Re-think）」这一完整闭环打包为结构化流程，即官方所定义的 **Agentic Loop**。

即便如此，OpenAI 的 API 也只是规范，不同模型厂商在实现上还是有差异，比如 DeepSeek 和 GLM 就存在不小的差异。但不管怎样，**使用 Responses API 已经是差异最小化的最优解**。

---

## 一、Responses API 解析

相比传统 Chat Completions API 的「无状态文本生成」，Responses API 在协议层面原生支持了**状态延续、工具循环与推理过程显性化**。

下面从请求结构（Request Payload）与响应结构（Response Payload）两个维度，全面解析这一 Agent 开发的核心接口。

### 1. 请求结构（Request Payload）

随着 Agent 业务逻辑的复杂化，发送给大模型的上下文不再仅仅是简单的对话列表，而是集成了**指令（system role）、历史指针、工具定义与推理控制**的复合体。一个简单请求示例如下：

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

其中 `model` 和 `input` 是必选项，其它都是可选项。`instructions` 相当于之前的 system role，`tools` 是可以使用的工具，`reasoning` 中的 `effort` 代表推理深度。

### 2. 响应结构（Response Payload）

Responses API 的响应设计是解耦 Agent 复杂状态的关键。它不再返回单一的 `choices[0].message`，而是将模型输出按照不同阶段（推理、工具调用、文本）进行了细化。**根据请求时是否开启 `stream` 参数，响应分为非流式与流式两种处理范式。**

#### 2.1 非流式响应（Non-streaming）

当请求参数 `stream: false`（默认）时，服务端会在整个 Agent 动作完成后，返回一个完整汇总的 JSON 对象。

```json
{
  "id": "resp_67c1d2e3f4",
  "object": "response",
  "status": "completed",
  "model": "gpt-5",
  "output": [
    {
      "type": "reasoning",
      "summary": "分析了用户需求，决定先调用搜索工具获取最新数据..."
    },
    {
      "type": "tool_call",
      "id": "call_998877",
      "name": "web_search",
      "args": { "query": "OpenAI Responses API 规范" }
    }
  ],
  "usage": {
    "input_tokens": 450,
    "output_tokens": 120,
    "reasoning_tokens": 80
  }
}
```

#### 2.2 流式响应（Streaming）

当请求参数设为 `stream: true` 时，服务端会基于 **Server-Sent Events (SSE)** 持续推送细粒度的事件流（Stream Events）。Agent 框架需要通过监听不同事件类型（Type）来驱动客户端的实时渲染与状态机变化。

核心的流式事件包括：

| 事件类型 | 含义 |
|---|---|
| `response.created` | 响应对象已建立，返回本次交互（turn）的 `response_id` |
| `response.reasoning_text.delta` | 流式推送模型的思维链（Thinking Process）增量文本，用于展示 Agent 的实时思考过程 |
| `response.output_text.delta` | 流式推送模型的最终回答文本增量，用于渲染用户可见的最终答复 |
| `response.function_call_arguments.delta` | 流式推送函数调用参数增量，用于 Agent 客户端实时捕获并预解析 Action 参数 |
| `response.completed` | 本次交互（turn）响应周期结束，一个 agent 任务可能涉及多次 turn |

实际上，在实战中基本上都会用流式响应（也就是逐个吐字的效果），这是用户体验的需要。所以 **Streaming 是理解的重点，也是处理 Agent Loop 中的关键环节**。

---

## 二、准备工作

在 `chapter1/.env` 中配置访问参数：

```bash
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

需要把 `OPENAI_BASE_URL` 指向兼容 Responses API 的 MaaS 服务。不同服务对模型、`store`、推理和工具调用的支持情况可能不同，**需要以服务商文档和实际测试为准**。

进入 `chapter1` 后执行以下命令：

```bash
npm install
npm start -- store
npm start -- store-client
npm start -- stream
npm start -- abort
npm start -- structured
npm start -- calling
```

---

## 三、Demo 总览

| Demo | 命令 | 重点 |
|---|---|---|
| 服务端 Store | `npm start -- store` | `store`、`previous_response_id` |
| 客户端上下文 | `npm start -- store-client` | 手动拼接历史消息 |
| 流式输出 | `npm start -- stream` | SSE 增量事件、token usage |
| 请求取消 | `npm start -- abort` | AbortController、SSE 中止 |
| 结构化输出 | `npm start -- structured` | JSON Schema、运行时校验 |
| 并行工具调用 | `npm start -- calling` | Function Calling、工具结果回传 |

### 1. 有状态 Store

Responses API 一大特色就是支持由服务端保存状态。请求中设置 `store: true` 后，服务端会保存本轮响应，并返回一个 response ID。下一轮请求通过 `previous_response_id` 引用上一轮响应，服务端就可以继续使用之前的上下文。

```js
// 第一轮Request
{
  "model": "glm-5.3",
  "input": "我有三只猫。kitty, tom, and jerry.",
  "store": true
}

// 第一轮 Response 的关键字段
{
  "id": "resp_20260913132836cc9a47c398b04d1c",
  "output_text": "..."
}

// 第二轮Request
{
  "model": "glm-5.3",
  "previous_response_id": "resp_20260913132836cc9a47c398b04d1c",
  "input": "它们分别叫什么名字？"
}
// 通过previous_response_id，模型服务能记住kitty, tom, and jerry是猫的名字
```

这里第二轮不需要再次发送第一轮的完整消息。模型服务会根据 `previous_response_id` 找到上一轮响应，因此能够理解「它们」指的是 kitty、tom 和 jerry。

需要注意：

- `previous_response_id` 依赖服务端确实保存了上一轮响应，因此通常需要使用 `store: true`。
- 服务商可能不支持有状态存储。实际测试中，**DeepSeek 不支持该方式，而 GLM-5.3 支持**。
- 服务端保存上下文可以减少客户端拼接历史的工作，但会产生服务端状态、保留时间、隐私和成本方面的约束。

对应代码是 `chapter1/src/store-demo.ts`，运行 `npm start -- store`。

### 2. 客户端维护上下文

如果服务商不支持 `store`，或者希望完全控制会话历史，可以在客户端保存消息，并在每次请求时把历史消息重新放入 `input`。这种方式不使用 `previous_response_id`，也不依赖服务端保存响应。

第一轮请求：

```js
{
  "model": "gpt-4o-mini",
  "input": [
    { "role": "user", "content": "我有三只猫。kitty, tom, and jerry." }
  ],
  "store": false
}
```

收到第一轮响应后，客户端把 assistant 的回答加入历史，再加入第二个 user 消息：

```js
history.push({ role: "assistant", content: resp1.output_text });
history.push({ role: "user", content: "它们分别叫什么名字？" });
```

第二轮把整个历史发送给模型：

```js
{
  "model": "gpt-4o-mini",
  "input": [
    { "role": "user", "content": "我有三只猫。kitty, tom, and jerry." },
    { "role": "assistant", "content": "哇，三只猫！🐱🐱🐱 名字取得真有意思.."  // 第一轮模型的回答
    },
    { "role": "user", "content": "它们分别叫什么名字？" }
  ],
  "store": false
}
```

客户端维护的优点是行为明确、可迁移、容易实现本地持久化，也不依赖服务端的会话存储。缺点是历史越长，请求中的 input token 越多；客户端还需要自行处理历史裁剪、摘要、持久化和敏感信息保护。

对应代码是 `src/store-client-demo.ts`，运行 `npm start -- store-client`。

> `store` 和客户端历史并不是只能二选一。实际项目可以使用 `store: false` 并由客户端管理主历史，也可以在需要服务端连续响应时使用 `previous_response_id`。关键区别是**上下文的所有权**：前者由客户端负责，后者由服务端负责。

### 3. 流式 Streaming

默认情况下，模型响应通常在完整生成后返回。设置 `stream: true` 后，Responses API 会通过 SSE 逐个发送事件，客户端可以在模型生成过程中立即显示内容。

```js
const stream = await client.responses.create({
  model,
  input: "What is 17 * 24? Explain your reasoning step by step.",
  reasoning: { effort: "high" },
  stream: true,
});
for await (const event of stream) {
  switch (event.type) {
    case "response.reasoning_text.delta":
      process.stdout.write(event.delta);
      break;
    case "response.output_text.delta":
      process.stdout.write(event.delta);
      break;
    case "response.completed":
      console.log(event.response.usage);
      break;
  }
}
```

流式输出的关键点是：**不要把所有事件都当成最终答案**。reasoning、output text、工具调用和完成状态属于不同事件类型，应该分别处理。`chapter1/src/stream-demo.ts` 演示了如何区分 reasoning、output 和 usage。

对应代码是 `src/stream-demo.ts`，运行 `npm start -- stream`。

### 4. AbortController

长时间运行的请求需要支持主动取消。AbortController 可以把 AbortSignal 传给 Responses API，**取消正在进行的 HTTP 请求和 SSE 流**，而不仅仅是停止读取已经返回的数据。

```js
const controller = new AbortController();
const stream = await client.responses.create(
  {
    model,
    input: "写一篇较长的文章，介绍人工智能的发展历史、当前应用和未来挑战。",
    stream: true,
  },
  { signal: controller.signal },
);
setTimeout(() => controller.abort(), 1500);
for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta);
  }
}
```

取消通常发生在三种场景：用户按下取消按钮、CLI 收到 Ctrl+C，或者应用达到超时时间。调用 `abort()` 后，正在进行的请求会抛出异常；应用应通过 `controller.signal.aborted` 区分「主动取消」和网络错误、API 错误。

对应代码是 `src/abort-controller-demo.ts`，运行 `npm start -- abort`。

### 5. Structured Outputs

Structured Outputs 用 JSON Schema 约束模型输出，使模型返回可以直接被程序解析的结构化 JSON，而不是需要从自然语言中猜测字段。它适合订单抽取、分类、信息抽取和后续 API 编排。

请求通过 `text.format` 声明 schema：

```json
{
  "model": "gpt-4o-mini",
  "input": "从这段文本提取订单信息：订单 A-1001 已支付，金额为 99.5 元。",
  "text": {
    "format": {
      "type": "json_schema",
      "name": "order_info",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "order_id": { "type": "string" },
          "status": { "type": "string", "enum": ["paid", "pending", "cancelled"] },
          "amount": { "type": "number" },
          "currency": { "type": "string" }
        },
        "required": ["order_id", "status", "amount", "currency"],
        "additionalProperties": false
      }
    }
  }
}
```

模型返回的 `output_text` 应该是 JSON 字符串：

```json
{
  "order_id": "A-1001",
  "status": "paid",
  "amount": 99.5,
  "currency": "CNY"
}
```

客户端仍然应该对结果进行 `JSON.parse` 和业务校验。Schema 约束输出格式，但不能替代业务层校验，也不能保证模型提供的信息本身真实正确。`strict: true` 会要求输出遵守 schema；模型或 MaaS 服务不支持该参数时，请求可能返回错误。

对应代码是 `src/structured-output-demo.ts`，运行 `npm start -- structured`。

### 6. 并行 Function Calling

Function Calling 允许模型根据用户问题请求调用本地函数。**模型只负责产生结构化的函数名和参数，真正执行函数的是客户端应用。**

第一轮请求需要声明工具，并允许并行调用：

```json
{
  "model": "gpt-4o-mini",
  "input": "What's the weather like in New York and Tokyo right now?",
  "tools": [
    {
      "type": "function",
      "name": "get_weather",
      "description": "Get the current weather for a given city",
      "parameters": {
        "type": "object",
        "properties": {
          "city": { "type": "string" }
        },
        "required": ["city"],
        "additionalProperties": false
      },
      "strict": true
    }
  ],
  "parallel_tool_calls": true
}
```

模型可能返回两个 function_call：

```js
get_weather({"city":"New York"})
get_weather({"city":"Tokyo"})
```

客户端收到调用后执行本地函数，并为每个调用生成对应的 `function_call_output`：

```js
const toolOutputs = toolCalls.map((call) => ({
  type: "function_call_output" as const,
  call_id: call.call_id,
  output: mockGetWeather(args.city),
}));
```

然后把原始 `function_call` 和工具结果一起发回模型。客户端维护上下文时，**不能只发送 `function_call_output`**，因为服务端可能没有保存第一轮的工具调用。

完整流程是：

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

`parallel_tool_calls: true` 表示模型可以在同一轮返回多个工具调用。客户端可以并发执行它们，再按照 `call_id` 把每个结果准确对应回去。**工具结果不是模型生成的，而是客户端执行工具后生成的观察结果。**

对应代码是 `src/function-calling-demo.ts`，运行 `npm start -- calling`。

---

## 四、总结

Responses API 不只是一个文本生成接口，还提供了完整的模型交互能力：

- 使用**服务端 Store** 或**客户端历史消息**管理多轮上下文；
- 使用 **SSE 流式**接收 reasoning、回答文本和完成状态；
- 使用 **AbortController** 取消长时间运行的请求；
- 使用 **JSON Schema** 约束模型输出，得到可直接解析的结构化数据；
- 使用 **Function Calling** 让模型请求工具，由客户端执行工具并把结果反馈给模型。

利用这些能力组合，就可以构建一个完整的 Agent 流程：客户端保存或引用上下文，流式接收模型决策，调用工具，取消请求，最终使用结构化输出或普通文本返回结果。然而这些只是基础能力，可以作为进一步实现 **ReAct Agent、上下文管理、Sub Agent、重试和可观测性**等的起点。

---

## 相关链接

- 系列前篇：[从零构建 Agent（一）：技术选型](/md/wiki/sources/zeroagent-01-tech-stack)
- 系列已有：[从零构建 Agent（十二）：长期 Memory 管理](/md/wiki/sources/zeroagent-12-longterm-memory-management)
- Demo 源码：[significantfrank/ZeroAgent](https://github.com/significantfrank/ZeroAgent)
- 交叉参考：[Agent Loop](/md/wiki/patterns/agent-loop)、[Harness Engineering](/md/wiki/concepts/harness-engineering)
