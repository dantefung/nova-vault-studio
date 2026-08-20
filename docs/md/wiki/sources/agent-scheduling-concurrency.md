---
title: "Agent 调度与并发：读写分离、SSE 早返回与异步 SideCar"
author: "老梁agent"
date: "2026年7月20日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/uPyDEQFQE3lIIVtoRG47ZA"
---

# Agent 调度与并发：读写分离、SSE 早返回与异步 SideCar

> Agent 的响应时间就是用户的等待时间。代码里多写的每一行同步操作，都在占用这个时间——用户不在乎审计日志写没写完，用户只在乎"回复多快返回"。



Agent 的响应时间就是用户的等待时间。代码里多写的每一行同步操作，都在占用这个时间——用户不在乎审计日志写没写完，用户只在乎"回复多快返回"。



# 一、热路径上的"搭便车"代码



看一下 Prompt 六层编译改造后的DeviceAgent.chat()：



```

// DeviceAgent.javapublic String chat(RuntimeContext ctx, String userMessage) {    return runtime.execute(ctx, () -&gt; {        String reply = buildAssistant(ctx).chat(promptCompiler.compileTask(userMessage));        costTracker.recordRequest(userMessage, reply);   // ← 记录 Token 成本        memory.recordTurn(ctx, userMessage, reply);       // ← 写 L1/L2 记忆        return reply;    });}
```




三段代码只有一段是用户真正在等的——buildAssistant(ctx).chat(...)。剩下两行都是非关键工作：记成本和写记忆。但它们是同步执行的，用户多等几十毫秒却完全无感知。



这只是冰山一角。整个 Agent 生命周期中，大量操作都在"搭便车"：



操作



用户是否需要等待



现有位置



LLM 推理



主线程



工具调用



主线程



Token 成本记录



否



主线程



记忆记录



L1/L2 同步，其他已异步



混跑



审计日志落库



否



只在内存



指标上报



否



AgentRuntime finally 块



这次改造的目标就是把"搭便车的"赶下车——主链路只跑 LLM 推理 + 工具执行，其他全部异步剥离。



# 二、BudgetManager：把预算变成控制面



之前的ToolBudget只是配置项（yml 里的数字），ToolExecutor.validate()只做校验。真正的"调度"能力是缺失的——不知道当前调用到第几次了、还剩多少预算、截止时间到了没有。



BudgetManager填补了这个空白：



```java

// schedule/BudgetManager.java@Componentpublic class BudgetManager {    /** LLM 调用前检查预算，超限直接抛异常。 */    public void checkLlmBudget(RuntimeContext ctx) {        int count = ctx.getLlmCallCount();        int max = budget.getMaxLlmCalls();        if (count &gt;= max) {            throw new BudgetExceededException("LLM budget: " + count + "/" + max);        }    }    /** LLM 调用后计数。 */    public void recordLlmCall(RuntimeContext ctx) { ctx.incrementLlmCalls(); }    /** 检查截止时间。 */    public void checkDeadline(RuntimeContext ctx) {        if (ctx.isExpired()) {            throw new BudgetExceededException("Deadline: " + ctx.elapsedMs() + "ms");        }    }}
```




它不只是校验——它追踪每一次消耗。LLM 每调用一次 +1，读工具每执行一次 +1，写工具每执行一次 +1。这些计数器不是全局变量，而是挂在RuntimeContext上，跟着单次请求走完整个生命周期。



RuntimeContext新增的三个计数器：



// runtime/RuntimeContext.java — 新增字段private int llmCallCount;private int readToolCount;private int writeToolCount;public void incrementLlmCalls()  { this.llmCallCount++; }public void incrementReadTools() { this.readToolCount++; }public void incrementWriteTools(){ this.writeToolCount++; }



# 三、读工具并行：等 3 次不如等 1 次



当 SupervisorAgent 需要同时查告警、查历史、查知识库时，顺序执行意味着：



queryDeviceAlarms  (800ms)  → queryDeviceHistory (600ms)    → searchKnowledgeBase (500ms)      总计：1900ms



这三个彼此没有依赖，完全可以并行：



queryDeviceAlarms  ──┐queryDeviceHistory ──┤ → 并发执行 → 最长 800mssearchKnowledgeBase ─┘



BudgetManager用ExecutorService+CompletableFuture实现：



```

// schedule/BudgetManager.javaprivate final ExecutorService readExecutor =    Executors.newFixedThreadPool(4, r -&gt; new Thread(r, "tool-read-"));public List&lt;ToolResult&gt; executeReadsInParallel(List&lt;ToolTask&gt; tasks) {    List&lt;CompletableFuture&lt;ToolResult&gt;&gt; futures = tasks.stream()            .map(t -&gt; CompletableFuture.supplyAsync(() -&gt; executeOne(t), readExecutor))            .toList();    List&lt;ToolResult&gt; results = new ArrayList&lt;&gt;();    for (CompletableFuture&lt;ToolResult&gt; f : futures) {        try {            results.add(f.get(10, TimeUnit.SECONDS));  // 单个超时 10s        } catch (TimeoutException e) {            results.add(ToolResult.timeout(...));       // 超时优雅降级        }    }    return results;}
```




每个读工具有 10 秒超时，单个超时不会拖垮整体。超时的工具返回timeout标记，不影响其他工具的结果。



# 四、写工具串行 + Redis 分布式锁



读可以乱序并发，写不行。两个写操作如果并发出现在同一个请求中，必须串行——第二个要能读到第一个的副作用。



BudgetManager提供了 Redis 锁：



/** 获取写锁，防并发写入冲突。 */public boolean acquireWriteLock(String sessionId, int timeoutSeconds) {    String key = "lock:write:" + sessionId;    Boolean ok = redis.opsForValue()            .setIfAbsent(key, "locked", Duration.ofSeconds(timeoutSeconds));    return Boolean.TRUE.equals(ok);}public void releaseWriteLock(String sessionId) {    redis.delete("lock:write:" + sessionId);}



这不是数据库事务级别的锁——PostgreSQL 的写操作本身已经有事务保护。lock:write:{sessionId}是应用层的排斥锁，防止两个 WRITE 工具被并发发起，确保顺序执行。



配合checkWriteBudget（单轮最多 1 次写操作），双重保护：预算层限制写次数，锁层保证串行执行。



# 五、AsyncSideCar：把"搭便车的"赶下车



主链路只保留 LLM 推理 + 工具执行。其他全部进AsyncSideCar：



// schedule/AsyncSideCar.java@Slf4j@Componentpublic class AsyncSideCar {    @Async("sidecarExecutor")    public void recordCost(String userMessage, String reply) {        costTracker.recordRequest(userMessage, reply);    }    @Async("sidecarExecutor")    public void recordTurn(RuntimeContext ctx, String userMessage, String reply) {        memory.recordTurn(ctx, userMessage, reply);    }    @Async("sidecarExecutor")    public void reportMetrics(AgentState state, long elapsedMs) {        metrics.recordRequest(state, elapsedMs);    }    @Async("sidecarExecutor")    public void persistAudit(ExecutionAuditLog entry) {        pg.update("INSERT INTO tool_audit_logs (...) VALUES (...) ON CONFLICT DO NOTHING",                   entry.executionId(), ...);    }}



注意@Async("sidecarExecutor")——用的是专用线程池，不是 Spring 默认的SimpleAsyncTaskExecutor（默认每次都新建线程，不可控）：



// config/AsyncConfig.java@Bean("sidecarExecutor")public Executor sidecarExecutor() {    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();    executor.setCorePoolSize(2);    executor.setMaxPoolSize(4);    executor.setQueueCapacity(100);    executor.setThreadNamePrefix("sidecar-");    executor.setWaitForTasksToCompleteOnShutdown(true);    return executor;}



2 个常驻线程，最多扩容到 4 个，队列 100——足够旁路任务使用，同时不会因异步任务堆积耗尽内存。



审计日志也从内存迁移到 PostgreSQL。AsyncSideCar.initTable()自动创建tool_audit_logs表，每次工具调用通过persistAudit()异步落库。重启不再丢审计记录。



# 六、SSE 早返回：首 Token 延迟优化



DeviceAgent.chatStream()的 SSE 流式输出在之前已经实现。这次改造不做代码改动——LangChain4j 的TokenStream本身就是流式，一旦 LLM 开始生成，每个 Token 立刻通过 SSE 推送。



关键在于首 Token 之前做了什么。当前改造确保首 Token 之前的"准备工作"被压缩到最少——只有 Runtime 初始化 + Prompt 编译（毫秒级），其他都是异步的。



// chatStream() 的执行路径（当前版本）public TokenStream chatStream(RuntimeContext ctx, String userMessage) {    ctx.transition(SESSION_READY);               // 状态变更（纳秒级）    ctx.transition(CONTEXT_READY);               // 状态变更（纳秒级）    // systemMessageProvider 在 AiServices 内部调用 compileSystem()    // 用户消息通过 compileTask() 包装    TokenStream stream = buildAssistant(ctx)            .chatStream(promptCompiler.compileTask(userMessage));    // token 一来就推送，不加任何中间处理    return stream;}



# 七、AgentRuntime 集成



BudgetManager 接入 AgentRuntime 后，每次 LLM 调用的控制流：



// AgentRuntime.execute() — 当前版本budgetManager.checkLlmBudget(ctx);           // ← 新增：LLM 次数检查ctx.transition(MODEL_THINKING);T result = action.get();                      // LLM 推理 + 工具执行budgetManager.recordLlmCall(ctx);            // ← 新增：计数ctx.transition(POST_PROCESSING);// 异常新增一支 BudgetExceededException 捕获catch (BudgetManager.BudgetExceededException e) {    ctx.transition(FAILED);    circuitBreaker.recordFailure();    throw e;}



checkLlmBudget→ 推理 →recordLlmCall，三步把每一次 LLM 调用都置于预算控制之下。第五次调用超过max-llm-calls=5时直接抛BudgetExceededException——模型不会看到第六次推理，也不会为无限循环的 agent 买单。



# 八、DeviceAgent 改造前后对比



改造前：



```

public String chat(RuntimeContext ctx, String userMessage) {    return runtime.execute(ctx, () -&gt; {        String reply = buildAssistant(ctx).chat(promptCompiler.compileTask(userMessage));        costTracker.recordRequest(userMessage, reply);   // 同步        memory.recordTurn(ctx, userMessage, reply);       // 同步        return reply;    });}
```




改造后：



```java

public String chat(RuntimeContext ctx, String userMessage) {    return runtime.execute(ctx, () -&gt; {        String reply = buildAssistant(ctx).chat(promptCompiler.compileTask(userMessage));        sideCar.recordCost(userMessage, reply);           // @Async → 不等待        sideCar.recordTurn(ctx, userMessage, reply);       // @Async → 不等待        return reply;  // 立刻返回，旁路任务在后台线程运行    });}
```




costTracker字段已从 DeviceAgent 中移除——主链路不需要知道成本怎么记的，只需要知道sideCar.recordCost()之后就能拿到 reply。



# 九、能力与边界



已实现



说明



LLM 调用预算追踪



RuntimeContext.llmCallCount，每轮 +1



读工具并行执行



ExecutorService 4 线程 + CompletableFuture



写工具串行锁



Redis SETNX + checkWriteBudget



截止时间检查



BudgetManager.checkDeadline



异步成本记录



AsyncSideCar.recordCost



异步记忆记录



AsyncSideCar.recordTurn



异步指标上报



AsyncSideCar.reportMetrics



审计日志持久化



AsyncSideCar.persistAudit → PostgreSQL



SSE 流式输出



已有，首 Token 前开销已压缩到最少



待实现



说明



SupervisorAgent 接入 BudgetManager



多 Agent 场景的并行读调度



工具级超时熔断



单个工具执行超时需要独立 CircuitBreaker



读线程池动态扩缩



当前固定 4 线程，高峰期可能需要扩容



> Agent 的响应时间等于 LLM 推理时间 + 工具执行时间 + 搭便车时间。把搭便车的赶下车，响应就快了。



项目地址：https://github.com/LaoLiang-agent/industrial-agent-long



下一篇预告：「Agent 系统的 SideCar 模式：主链路之外的异步能力」
