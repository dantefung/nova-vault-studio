---
title: "AgentScope 事件系统与流式输出"
date: "2026-08-05"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/o1gsKbX2L59AnFGaCodnJQ"
---

# AgentScope 事件系统与流式输出

> `call()` 返回最终结果，`streamEvents()` 则把 Agent 的整个推理过程实时推送给前端。这篇文章深入 AgentScope 的事件体系，实现打字机效果、工具调用状态展示和思考过程可视化。

## 一、从 call() 到 streamEvents()

### 1.1 call() 的黑盒

```java
String result = agent.call("北京天气", RuntimeContext.empty())
    .block().getTextContent();
// 同步等待 3 秒 → 拿到最终文本
```

`call()` 只返回最终答案。Agent 内部发生了什么——调了哪个工具、思考了多久、经过了几轮 ReAct——全部是黑盒。

### 1.2 streamEvents() 的透明化

```java
Flux<AgentEvent> events = agent.streamEvents("北京天气", RuntimeContext.empty());
events.subscribe(event -> {
    System.out.println("[" + event.getType() + "] " + event);
});
```

输出：

```
[AGENT_START]       AgentStartEvent
[MODEL_CALL_START]  ModelCallStartEvent
[TEXT_BLOCK_START]  TextBlockStartEvent
[TEXT_BLOCK_DELTA]  我来
[TEXT_BLOCK_DELTA]  查询
[TEXT_BLOCK_DELTA]  一下
[TEXT_BLOCK_DELTA]  北京...
[TEXT_BLOCK_END]    TextBlockEndEvent
[MODEL_CALL_END]    ModelCallEndEvent
[TOOL_CALL_START]   调用 getWeather
[TOOL_RESULT_START] 工具结果返回中
[TOOL_RESULT_END]   工具结果获取完成
[MODEL_CALL_START]  第二轮 LLM 调用开始
[TEXT_BLOCK_DELTA]  北京今天...
[AGENT_RESULT]      最终结果
[AGENT_END]         AgentEndEvent
```

每一步操作都变成了事件。前端可以订阅这些事件，实时渲染不同的 UI。

## 二、28 种事件类型速览

AgentScope 定义了 28 种 `AgentEventType`，按用途分为 5 类。

### 2.1 生命周期事件

| 事件 | 含义 |
|------|------|
| AGENT_START | Agent 开始执行 |
| AGENT_END | Agent 执行结束 |
| AGENT_RESULT | Agent 最终结果 |

### 2.2 文本流事件（打字机效果）

| 事件 | 含义 |
|------|------|
| TEXT_BLOCK_START | 一段文本块开始 |
| TEXT_BLOCK_DELTA | 文本增量（前端逐字追加）|
| TEXT_BLOCK_END | 文本块结束 |

### 2.3 思考过程事件

| 事件 | 含义 |
|------|------|
| THINKING_BLOCK_START | LLM 开始内部思考 |
| THINKING_BLOCK_DELTA | 思考内容增量 |
| THINKING_BLOCK_END | 思考结束 |

### 2.4 工具调用事件

| 事件 | 含义 | 携带数据 |
|------|------|----------|
| TOOL_CALL_START | 开始调用工具 | 工具名 |
| TOOL_CALL_ARGUMENT_DELTA | 工具参数增量 | — |
| TOOL_CALL_ARGUMENT_END | 工具调用请求完成 | 完整参数 |
| TOOL_RESULT_START | 工具开始执行 | — |
| TOOL_RESULT_TEXT_DELTA | 工具结果文本增量 | — |
| TOOL_RESULT_DATA_DELTA | 工具结果数据增量 | — |
| TOOL_RESULT_END | 工具执行完毕 | 成功/失败 |

### 2.5 交互与异常事件

| 事件 | 含义 |
|------|------|
| REQUIRE_USER_CONFIRM | 需要用户确认 |
| USER_CONFIRM_RESULT | 用户确认结果 |
| EXTERNAL_ACTION_REQUIRED | 需要外部系统执行 |
| EXTERNAL_ACTION_RESULT | 外部执行结果 |
| EXCEED_MAX_ITERS | 超出最大迭代次数 |
| ALL_TOOLS_REJECTED | 所有工具被拒绝 |

### 2.6 StreamOptions：按需订阅事件

```java
StreamOptions options = StreamOptions.builder()
    .incremental(true)                    // 增量模式（打字机效果）
    .includeTextBlockDelta(true)          // 接收文本增量
    .includeToolCallEvents(true)          // 接收工具调用事件
    .includeThinkingEvents(false)         // 不接收思考过程
    .reasoningChunkControl(ReasoningChunkControl.builder()
        .includeReasoning(false)          // 不发送推理过程
        .includeSummary(true)             // 只发送推理摘要
        .build())
    .build();

Flux<AgentEvent> events = agent.streamEvents("北京天气",
    RuntimeContext.empty(), options);
```

| 参数 | 默认值 | 作用 |
|------|--------|------|
| incremental | true | 增量模式，false 则只在文本块结束时发送一次完整文本 |
| includeTextBlockDelta | true | 是否接收 TEXT_BLOCK_DELTA 事件 |
| includeToolCallEvents | true | 是否接收工具调用相关事件 |
| includeThinkingEvents | true | 是否接收思考过程事件 |
| reasoningChunkControl | — | 控制推理模型的 reasoning/summary 输出 |

对于简单的前端场景（只需要打字机效果），通常只需要 TEXT_BLOCK_DELTA 和 AGENT_RESULT 两类事件。

## 三、事件类的继承结构

所有事件都继承自 `AgentEvent`：

```java
public abstract class AgentEvent {
    public abstract AgentEventType getType();  // 事件类型
    public String getId();                     // 事件 ID
    public String getCreatedAt();              // 创建时间
    public String getSource();                 // 事件来源
    public Map<String, Object> getMetadata();  // 自定义元数据
}
```

每个具体事件类有自己的 getter：

```java
// TextBlockDeltaEvent — 打字机效果的核心
TextBlockDeltaEvent textEvent = (TextBlockDeltaEvent) event;
String delta = textEvent.getDelta();
String blockId = textEvent.getBlockId();

// ToolCallStartEvent — 工具调用开始
ToolCallStartEvent toolEvent = (ToolCallStartEvent) event;
String toolName = toolEvent.getToolCallName();
String toolCallId = toolEvent.getToolCallId();

// AgentResultEvent — 最终结果
AgentResultEvent resultEvent = (AgentResultEvent) event;
Msg result = resultEvent.getResult();
String text = result.getTextContent();
```

## 四、实战：SSE 流式端点

### 4.1 Controller 层桥接 Flux 和 SSE

```java
@RestController
@RequestMapping("/api")
public class StreamController {
    private final WeatherAgent weatherAgent;

    @PostMapping(value = "/chat/stream",
                 produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter chatStream(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "");
        SseEmitter emitter = new SseEmitter(120_000L);

        weatherAgent.streamChat(message).subscribe(
            event -> emitter.send(SseEmitter.event()
                .name(event.getType().name())
                .data(eventToJson(event))),
            error -> emitter.completeWithError(error),
            () -> emitter.complete()
        );
        return emitter;
    }
}
```

### 4.2 前端消费（JavaScript）

```javascript
const eventSource = new EventSource('/api/chat/stream');
let replyText = '';

eventSource.addEventListener('TEXT_BLOCK_DELTA', (e) => {
    const data = JSON.parse(e.data);
    replyText += data.text;
    document.getElementById('reply').innerText = replyText;
});

eventSource.addEventListener('TOOL_CALL_START', (e) => {
    const data = JSON.parse(e.data);
    const badge = document.createElement('div');
    badge.className = 'tool-calling';
    badge.innerHTML = '调用工具: ' + data.tool;
    document.getElementById('reply').appendChild(badge);
});

eventSource.addEventListener('THINKING_BLOCK_DELTA', (e) => {
    const data = JSON.parse(e.data);
    document.getElementById('thinking').innerText += data.text;
});

eventSource.addEventListener('REQUIRE_USER_CONFIRM', () => {
    showConfirmDialog();
});

eventSource.addEventListener('AGENT_END', () => {
    eventSource.close();
});
```

### 4.3 效果

| 事件类型 | 前端渲染 |
|----------|----------|
| TEXT_BLOCK_DELTA | 逐字打字效果，追加到对话气泡 |
| TOOL_CALL_START | 插入「工具调用中」加载状态条 |
| TOOL_RESULT_END | 替换加载状态为工具返回结果 |
| THINKING_BLOCK_DELTA | 折叠面板中显示思考过程 |
| REQUIRE_USER_CONFIRM | 弹出确认对话框 |

## 五、事件系统的设计价值

### 5.1 不只是「流式」

LangChain4j 的 TokenStream 只有文本 token 一种事件，前端只能做打字机效果。AgentScope 的 28 种事件让前端能做：

- **思考过程可视化**：展示 Agent「怎么想的」，提升用户信任
- **工具调用进度条**：知道 Agent 在做什么、做到哪了
- **中间状态处理**：审批弹窗、人工介入、执行确认

### 5.2 解耦 Agent 行为和 UI 渲染

Agent 只负责发送事件，不关心前端怎么渲染。同一套事件流可以驱动不同的 UI：

- Web 浏览器：打字机 + 工具调用面板 + 思考折叠区
- 命令行：彩色日志输出
- 移动端：推送通知 + 简化的文本流

### 5.3 可观察性

事件流天然是可观察的——每个事件都可以被记录、统计、告警：

```java
events.subscribe(event -> {
    metrics.increment(event.getType().name());
    log.debug("[AgentEvent] {}", event.getType());
    traceCollector.record(event);
});
```

## 六、总结

| 调用方式 | 返回 | 适用场景 |
|----------|------|----------|
| call() | Mono（最终结果） | 后端 API，只需最终结果 |
| streamEvents() | Flux（事件流） | 前端实时交互，需要过程展示 |

`streamEvents()` 不是 `call()` 的「流式增强版」，而是一种完全不同的 Agent 交互范式——从「告诉用户结果」变成「让用户看到 Agent 怎么得出结论」。对于运维、诊断、审批等需要用户信任 Agent 决策的场景，事件流是关键能力。
