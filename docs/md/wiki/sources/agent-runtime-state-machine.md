---
title: "Agent Runtime 状态机：让 AI 推理每一步都可暂停、可回放、可审计"
author: "老梁agent"
date: "2026年7月7日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/i2cpReiKqu4JKlTj43wPMA"
---

# Agent Runtime 状态机：让 AI 推理每一步都可暂停、可回放、可审计

> MVP 的 Agent 是一条直线：请求进来 → LLM 推理 → 返回。生产级的 Agent 是一个状态机：每一步都是离散的、可观测的、可中断的。



MVP 的 Agent 是一条直线：请求进来 → LLM 推理 → 返回。生产级的 Agent 是一个状态机：每一步都是离散的、可观测的、可中断的。



## 一、从"一条直线"到"一个状态机"



MVP 时期的 DeviceAgent.chat() 就是这样一条直线：



public String chat(String userMessage) {    log.info("[Agent] User message: {}", userMessage);    String reply = buildAssistant().chat(userMessage);  // ← 一个黑盒调用    costTracker.recordRequest(userMessage, reply);    return reply;}



这一行 buildAssistant().chat(userMessage) 里发生了什么？你可能调用了 LLM 3 轮、执行了 5 个工具、其中一次工具调用超时后 LLM 编造了数据——但你对这些一无所知。



生产级不是让你看到更多的细节，而是让你控制整个过程。这就是 Runtime 状态机的价值。



## 二、8 个状态的显式状态机



把 Agent 的一次推理拆成 8 个离散状态：



每一个状态下，你都知道：



- 系统正在做什么（在等 LLM 还是在等工具）



- 已经消耗了多少时间（还有多少时间可用）



- 已经调用了几次 LLM 和工具（还剩多少次预算）



- 下一步应该做什么（是继续推理还是熔断）



## 三、RuntimeContext：单次请求的"护照"



状态机的核心不是状态枚举，而是携带状态的上下文对象。



// runtime/RuntimeContext.javapublic class RuntimeContext {    private final String traceId;          // 全链路追踪 ID    private final String sessionId;        // 会话 ID    private final String tenantId;         // 租户 ID（多租户隔离）    private final String userId;           // 用户 ID    private final long startedAtMs;        // 请求开始时间    private final long deadlineMs;         // 超时熔断线    private final List&lt;ToolCallRecord&gt; toolCallHistory; // 已调工具记录    private AgentState currentState;       // 当前状态    private String executionPlan;          // 当前执行计划}



RuntimeContext 就是单次请求的"护照"——它跟着请求走完整个生命周期，每一个状态节点都可以在上面盖章（记录信息），每一个检查点都可以查它的签证是否过期（超时检测）。



为什么不用 ThreadLocal？因为 ThreadLocal 在异步场景下会丢失上下文。RuntimeContext 作为显式对象传递，在同步和异步场景下都有效。



## 四、AgentRuntime 状态机引擎



// runtime/AgentRuntime.java@Componentpublic class AgentRuntime {    public &lt;T&gt; T execute(RuntimeContext ctx, Supplier&lt;T&gt; action) {        // 1. 熔断检查        if (!circuitBreaker.isAllowed()) {            ctx.transition(FAILED);            throw new RuntimeExceededException("Circuit breaker open");        }        // 2. 状态流转        ctx.transition(SESSION_READY);        tracer.stateTransition(ctx, RECEIVED, SESSION_READY);        ctx.transition(CONTEXT_READY);        tracer.stateTransition(ctx, SESSION_READY, CONTEXT_READY);        // 3. 超时预检        if (ctx.isExpired()) {            ctx.transition(FAILED);            throw new RuntimeExceededException("Deadline exceeded");        }        try {            ctx.transition(MODEL_THINKING);            T result = action.get();   // ← 实际的 LLM + 工具调用在这里            ctx.transition(POST_PROCESSING);            ctx.transition(COMPLETED);            metrics.recordRequest(COMPLETED, ctx.elapsedMs());            return result;        } catch (ToolException e) {            ctx.transition(FAILED);            circuitBreaker.recordFailure();            throw e;        } catch (Exception e) {            ctx.transition(FAILED);            circuitBreaker.recordFailure();            throw new RuntimeException("Agent execution failed", e);        }    }}



这个引擎做了几件 MVP 代码没做的事：



- 每一次状态变更都被追踪，不是事后翻日志，而是实时的结构化事件



- 超时和熔断是硬约束，不是 warning 日志，而是直接抛异常终止执行



- 成功和失败都被统计，Micrometer 指标实时可观测



## 五、DeviceAgent 的改造：从裸调到大管家的转变



改造后的 DeviceAgent：



// 改造前public String chat(String userMessage) {    return buildAssistant().chat(userMessage);}// 改造后public String chat(RuntimeContext ctx, String userMessage) {    return runtime.execute(ctx, () -&gt; {        String reply = buildAssistant().chat(userMessage);        costTracker.recordRequest(userMessage, reply);        return reply;    });}



变化只有一行包装 runtime.execute(ctx, () -&gt; {...})，但这一行带来的能力是：



- 这个请求有了 trace_id



- 这个请求被状态机追踪



- 这个请求有 10 秒超时保护



- 这个请求的每一步都被结构化日志记录



## 六、Controller 的配合：给每个请求发"护照"



// AgentController.java@PostMapping("/chat")public ResponseEntity&lt;Map&lt;String, Object&gt;&gt; chat(@RequestBody Map&lt;String, String&gt; request) {    String message = request.getOrDefault("message", "");    // 为每次请求创建独立的上下文    RuntimeContext ctx = runtime.createContext(            request.getOrDefault("sessionId", "default"),            request.getOrDefault("tenantId", "default"),            request.getOrDefault("userId", "anonymous"));    String reply = deviceAgent.chat(ctx, message);    // 返回 traceId 给客户端，方便排查    Map&lt;String, Object&gt; response = new LinkedHashMap&lt;&gt;();    response.put("reply", reply);    response.put("traceId", ctx.getTraceId());    // ← 客户端可以拿这个 ID 报障    response.put("elapsedMs", ctx.elapsedMs());   // ← 客户端感知延迟    return ResponseEntity.ok(response);}



现在每次请求返回的 JSON 都带上 traceId，用户投诉时可以直接说「traceId 是 a1b2c3d4」，你就能在日志中完整回放这次请求。



## 七、与 CircuitBreaker 的集成



AgentRuntime 在 execute 入口处和异常处理中都集成了 CircuitBreaker：



- 连续 3 次 FAILED → CircuitBreaker 跳闸（OPEN）



- OPEN 状态下所有新请求直接拒绝，不消耗 LLM 资源



- 一段时间后半开（HALF_OPEN），允许探测请求通过



- 探测成功 → 恢复（CLOSED）



这意味着：当底层 LLM API 出问题（超时、500、限流），系统不会傻傻地不断重试直到耗尽线程池，而是快速失败、保护上游。



## 八、P0 Runtime 的边界



能力



状态



8 状态显式状态机



✅



RuntimeContext 统一上下文



✅



硬超时熔断（deadlineMs）



✅



与 CircuitBreaker 集成



✅



暂停/恢复（AWAITING_APPROVAL）



⏳ P1



断点续传（从任意状态恢复）



⏳ P1



异步执行（非阻塞状态机）



⏳ P1



P0 的策略是先让状态机跑起来——有状态追踪、有超时保护、有熔断集成、有可观测事件。暂停和恢复在 P1 配合 Memory 层和人工审批一起做。



## 九、一句话总结



> 把「一个黑盒方法调用」升级为「一个有 8 个离散状态、每一步都被追踪、有不合理就主动掐断的确定性调度器」——状态机是生产级 Agent 的中枢神经系统。



把「一个黑盒方法调用」升级为「一个有 8 个离散状态、每一步都被追踪、有不合理就主动掐断的确定性调度器」——状态机是生产级 Agent 的中枢神经系统。



项目地址：github.com/LaoLiang-agent/industrial-agent-long



下一篇预告：「Agent 可观测性实战：全链路追踪 + JSON 结构化日志」
