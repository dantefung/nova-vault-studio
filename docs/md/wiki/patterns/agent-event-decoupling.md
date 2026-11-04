---
title: "模型事件与 Agent 事件解耦"
date: "2026-11-04"
source: "微信公众号 / 从码农到工匠"
url: "https://mp.weixin.qq.com/s/9YvqRcC-miUnx7DL8cBW5w"
---

# 模型事件与 Agent 事件解耦

> 把模型侧的 SSE 事件流加工成 Agent 侧的语义事件，使渲染层、插件层与调试工具都不必理解模型协议的细节。

## Problem Context

Agent 运行时直接把 SSE 事件透传给 UI，会带来三个问题：

1. **协议细节泄漏到上层**——UI 需要知道 `response.reasoning_text.delta` 才能画思维链，一旦 Provider 换了协议就要改 UI。
2. **无法表达非模型事件**——`step_start`、`tool_result`、`run_end`、`error` 都不是 SSE 事件，但 Agent Loop 天然会产生它们。
3. **无法做统一观测**——没有一层稳定的事件语义，Trace 与调试工具就得直接面对协议版本。

## Solution

在模型协议之上加一层 **Agent Event** 抽象，把「协议事件」翻译成「运行时语义」，并把 Loop 自身产生的事件补进同一个事件流。

### 映射关系

| SSE Event（模型侧） | AgentEvent（Agent 侧） | 说明 |
|---|---|---|
| `response.reasoning_text.delta` | `reasoning_delta` | 推理文本增量，透传 delta |
| `response.output_text.delta` | `content_delta` | 最终回答文本增量，透传 delta |
| `response.output_item.done` | `tool_call`（间接） | 从 `event.item` 中识别 `function_call` 类型 |
| `response.completed` | `token_usage` | 从 `event.response.usage` 中提取 Token 用量 |
| —（无对应 SSE 事件） | `step_start` | Loop 自身产生，标记每步开始 |
| —（无对应 SSE 事件） | `step_end` | Loop 自身产生，标记每步结束 |
| —（无对应 SSE 事件） | `tool_result` | Loop 执行工具后产生，非模型事件 |
| —（无对应 SSE 事件） | `run_end` | Loop 自身产生，标记整个循环结束 |
| —（无对应 SSE 事件） | `error` | 网络异常、maxSteps 超限等 |

**下半张表是这层抽象真正的价值**：Loop 自身产生的事件与模型事件被合并进同一条流，渲染与观测因此只需要认一种事件。

### 渲染侧的最小实现

原文的 `render()` 代码块如下（**注意：原文公众号里这段代码本身是残缺的**——多处模板字符串缺失开头的 `$` 与结尾反引号，且 `case ContentDelta` 后多出一个 `}` 提前闭合了 switch；归档保留原样以便核对）：

```ts
function render(event: AgentEvent): void {
  switch (event.type) {
    case AgentEventType.StepStart:
      console.log(`\n[step {event.delta}\x1b[0m`);
      break;
    case AgentEventType.ContentDelta:
      process.stdout.write(`\x1b[34m{event.inputTokens}, output {event.totalTokens}`);
      break;
    }
    case AgentEventType.ToolCall:
      console.log(`\n[tool_call] {event.call.arguments})`);
      break;
    case AgentEventType.ToolResult:
      console.log(`\n[tool_result] {event.step} done: {event.steps} step(s)]`);
      break;
    case AgentEventType.Error:
      console.error(`\n[error] ${event.message}`);
      break;
  }
}
```

可从上下文确证的语义：`StepStart` 打印步号；`ContentDelta` 直接 `write` 输出增量文本（并附带 token 用量）；`ToolCall` 打印工具调用参数；`ToolResult` 打印工具执行结果；`Error` 打印错误信息。

**渲染层只认 `AgentEventType`，不认任何 `response.*` 字符串**——这就是解耦的落点。

### 视觉区分的两个细节

- `reasoning_delta` 用 `\x1b[90m...\x1b[0m`（ANSI 灰色）渲染，让**推理文本和最终回答在视觉上分开**——用户该看到的是答案，思维链只作为过程痕迹。
- `content_delta` 直接 `write` **不换行**，实现逐字输出的「打字机效果」。

## Trade-offs

- **多一层映射就多一层维护**：Provider 协议演进时要更新映射表，而不是直接改渲染代码。代价换来的是协议与 UI 的彻底隔离。
- **事件类型必须覆盖完整**：漏掉某个 `response.*` 分支会让该类增量静默丢失。这类 Bug 只在运行时暴露，测试成本高。

## Related Pages

- [[concepts/responses-api-agent-loop]] — 底层协议的能力与事件清单
- [[patterns/agent-loop]] — 产生这些事件的上层循环
- [[patterns/plugin-first-agent-runtime]] — 事件层是插件能挂载观测点的前提
- [[concepts/agent-tech-stack-selection]] — 可观测性的三个必须结构化通道
- [[sources/zeroagent-03-agent-loop]] — 原始归档

## Sources

- 《从零构建 Agent（三）：Agent Loop 与 ReAct》，公众号「从码农到工匠」，2026-10-10：2.3 节 Agent Event 与 SSE 的映射表；render 实现与 ANSI 视觉区分说明
