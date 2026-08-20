---
title: "Agent 可观测性实战：全链路追踪 + JSON 结构化日志"
author: "老梁agent"
date: "2026年7月8日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/1X6mAaa66yV4Sb_iitRH8Q"
---

# Agent 可观测性实战：全链路追踪 + JSON 结构化日志

> 没有可观测性的 Agent 系统，每次出问题都是一场猜谜游戏。这篇文章给 Agent 装上神经系统。



没有可观测性的 Agent 系统，每次出问题都是一场猜谜游戏。这篇文章给 Agent 装上神经系统。



## 一、MVP 的日志：能跑通，但排不了障



MVP 时期你的日志长这样：



[Agent] User message: CNC-001 振动异常[DiagnosisTool] Generating diagnosis for alarm: 振动异常[SSE] Stream completed, total tokens used: 2341[Agent] User message: CNC-002 温度过高



看着挺热闹，但当你真的需要回答问题时：



- 「CNC-001 这次请求调用了几次 LLM？每次的 Prompt 是什么？消耗了多少 Token？」



- 「createWorkOrder 被调用时传了什么参数？返回值是什么？」



- 「这条日志和上一条日志是同一个请求还是两个不同的请求？」



上面那段日志一个都回答不了。因为没有 Trace ID，没有结构化字段，没有关键数据记录。



## 二、可观测性的三根支柱



生产级 Agent 的可观测性由三样东西构成：



三者各司其职：



- 结构化日志让你在出问题时搜索和分析



- 全链路追踪让同一个请求的所有日志关联在一起



- 指标监控让你看到趋势和异常模式



## 三、结构化日志：从"人肉约定"到"JSON 事件"



MVP 的日志是人肉约定——[Agent]、[Supervisor]、[SSE] 都是随手写的前缀，没有统一规范。



改造后，每条日志都是一个结构化的 JSON 事件：



{  "ts": "2026-06-30T10:32:15.234Z",  "trace_id": "a1b2c3d4e5f6",  "session_id": "sess-001",  "tenant_id": "factory-a",  "event": "tool_call",  "execution_id": "e7b2a1c3...",  "tool_name": "createWorkOrder",  "params": "CNC-001,维修,HIGH,轴承磨损",  "result_preview": "{\"workOrderId\":\"WO-20260630-001\"...}",  "status": "OK",  "duration_ms": 42}



实现上不需要引入新的日志框架。SLF4J + MDC 就是天然的 trace_id 传播机制：



// observability/StructuredLogger.java@Componentpublic class StructuredLogger {    public void attachTrace(RuntimeContext ctx) {        MDC.put("trace_id", ctx.getTraceId());        MDC.put("session_id", ctx.getSessionId());        MDC.put("tenant_id", ctx.getTenantId());    }    public void toolCall(RuntimeContext ctx, String executionId,                         String toolName, String params,                         String resultPreview, String status, long durationMs) {        attachTrace(ctx);        log.info("tool_call execution_id={} tool_name={} params={} " +                 "result_preview={} status={} duration_ms={}",                 executionId, toolName, params, resultPreview, status, durationMs);    }    public void llmCall(RuntimeContext ctx, String promptHash,                        int inputTokens, int outputTokens,                        long latencyMs, String model) {        attachTrace(ctx);        log.info("llm_call prompt_hash={} input_tokens={} " +                 "output_tokens={} latency_ms={} model={}",                 promptHash, inputTokens, outputTokens, latencyMs, model);    }}



关键是 MDC.put("trace_id", ...)——所有后续日志自动带上 trace_id，不需要在每个 log.info 里手动传。



## 四、状态机的每个节点都在"发声"



AgentRuntime 的 execute() 方法在每次状态变更时都调用 tracer：



```

// AgentRuntime.javapublic &lt;T&gt; T execute(RuntimeContext ctx, Supplier&lt;T&gt; action) {    tracer.attachTrace(ctx);    // 状态迁移 → 日志事件    ctx.transition(SESSION_READY);    tracer.stateTransition(ctx, RECEIVED, SESSION_READY);    ctx.transition(CONTEXT_READY);    tracer.stateTransition(ctx, SESSION_READY, CONTEXT_READY);    // LLM 调用 → 日志事件    ctx.transition(MODEL_THINKING);    tracer.stateTransition(ctx, CONTEXT_READY, MODEL_THINKING);    // ... 执行 ...    // 请求完成 → 日志事件    tracer.requestCompleted(ctx, resultPreview);    return result;}
```




一个完整的请求链路产生的日志序列：



trace=a1b2 state=RECEIVED→SESSION_READY elapsed=0mstrace=a1b2 state=SESSION_READY→CONTEXT_READY elapsed=1mstrace=a1b2 state=CONTEXT_READY→MODEL_THINKING elapsed=2mstrace=a1b2 llm_call prompt_hash=d4e2f input=1234 output=567 latency=890ms model=deepseek-chattrace=a1b2 tool_call execution_id=e7b2a tool=queryDeviceAlarms params=CNC-001 status=OK duration=12mstrace=a1b2 llm_call prompt_hash=8c3a1 input=2345 output=345 latency=1200ms model=deepseek-chattrace=a1b2 tool_call execution_id=3f1c8 tool=createWorkOrder params=CNC-001,... status=OK duration=8mstrace=a1b2 state=MODEL_THINKING→POST_PROCESSING elapsed=2156mstrace=a1b2 state=POST_PROCESSING→COMPLETED elapsed=2158mstrace=a1b2 request_completed state=COMPLETED elapsed_ms=2158 result_preview="设备状态..."



所有日志共享同一个 trace=a1b2，你用 grep trace=a1b2 就能拉出这次请求的完整故事。



## 五、Micrometer 指标：看趋势，不看单点



日志帮你定位具体问题，指标帮你发现模式和趋势：



// observability/AgentMetrics.java@Componentpublic class AgentMetrics {    private final Counter requestCounter;      // agent.requests.total    private final Counter toolCallCounter;     // agent.tool.calls.total    private final Counter llmCallCounter;      // agent.llm.calls.total    private final Counter failureCounter;      // agent.requests.failed    private final Timer requestTimer;          // agent.request.duration    public void recordRequest(AgentState finalState, long elapsedMs) {        requestCounter.increment();        requestTimer.record(elapsedMs, MILLISECONDS);        if (finalState == FAILED) failureCounter.increment();    }}



这些指标通过 /actuator/prometheus 暴露，Grafana 可以直接拉取：



agent_requests_total                                    42agent_requests_failed                                    3agent_tool_calls_total                                 187agent_llm_calls_total                                   89agent_request_duration_seconds_sum                    120.5agent_request_duration_seconds_count                    42



配合 Grafana Dashboard，你可以看到：



- 失败率是否在上升（可能是 LLM API 不稳定的前兆）



- P99 延迟是否在恶化（可能是某个工具查询变慢了）



- Token 消耗趋势（成本预估）



## 六、prompt_hash：一个被低估的可观测利器



每次 LLM 调用都记录 prompt_hash：



tracer.llmCall(ctx, sha256(prompt).substring(0, 8), inputTokens, outputTokens, latencyMs, model);



这个 8 位哈希的价值在于：



- 相同 prompt_hash 的调用应该命中 LLM 缓存（后续可以加入 prompt caching）



- prompt_hash 变化可以关联到 Agent 行为变化——如果某次部署后 prompt_hash 变了但行为异常，你能快速定位到是 Prompt 变更引入的



- 成本分析：在 LLM 日志中按 prompt_hash 分组，看哪些 Prompt 模板消耗了最多的 Token



## 七、P0 可观测性的边界



能力



状态



MDC trace_id 全链路传播



✅



JSON 结构化日志（状态变迁/LLM/工具）



✅



Micrometer Prometheus 指标



✅



Otel Agent 自动检测



⏳ P1



Grafana Dashboard 模板



⏳ P1



分布式链路追踪（Gateway → Runtime → LLM → DB）



⏳ P1



P0 的策略是先把日志和指标做对——日志可搜索、指标可聚合。OTel 分布式追踪在 P1 引入，需要 Java Agent 或 SDK 集成。



## 八、一句话总结



> 可观测性不是事后补救，而是从设计第一天就注入到每个状态节点的神经系统。Trace ID + 结构化日志 + Micrometer 指标，三者组合让你在接到用户投诉时能说：「给我 5 分钟，我给你完整回放。」



可观测性不是事后补救，而是从设计第一天就注入到每个状态节点的神经系统。Trace ID + 结构化日志 + Micrometer 指标，三者组合让你在接到用户投诉时能说：「给我 5 分钟，我给你完整回放。」



项目地址：github.com/LaoLiang-agent/industrial-agent-long



下一篇预告：「为什么你的 Agent 答错问题你查不出来？推理链路追踪的价值」
