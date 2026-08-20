---
title: '生产级 Agent 的工具层：从"函数裸调"到"受控执行单元"'
author: "老梁agent"
date: "2026年7月6日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/_n2qSClGLrI1BwJnS2KqDQ"
---

# 生产级 Agent 的工具层：从"函数裸调"到"受控执行单元"

> 模型是不可靠的。它会重复调用，会过度调用，会在 ReAct 循环里对同一个操作反复决策三次。工具层的任务就是把这些不可靠关进笼子里。

模型是不可靠的。它会重复调用，会过度调用，会在 ReAct 循环里对同一个操作反复决策三次。工具层的任务就是把这些不可靠关进笼子里。

## 一、先看一段危险的代码

这是 MVP 时期的

WorkOrderTool.createWorkOrder：

@Tool("创建维修工单...")public String createWorkOrder(        @P("设备ID") String deviceId,        @P("工单类型") String type,        @P("优先级") String priority,        @P("故障描述") String description) {    WorkOrder wo = new WorkOrder(deviceId, type, priority, description);    jdbc.update("INSERT INTO work_orders (...) VALUES (?,?,?,?,?)", ...);    return wo.toString();}

这段代码在功能上完全正确。单次调用，完美运行。

但如果 LLM 在一个 ReAct 循环中两次决策「需要创建工单」，它会调用这个方法两次，你的数据库里就会出现两张完全独立的工单。没有 execution_id 去重，没有「该操作已执行」的缓存返回，没有分布式锁。

如果是创建工单还算轻的——换成退款、发券、扣库存，重复调用就是直接的经济损失。

这就是 MVP 和生产级之间最核心的差距：MVP 假设模型只调用一次，生产级假设模型可以调用任意多次。

## 二、改造思路：三层防护

工具层的生产级改造，本质上就是给每一个工具调用加上三层防护：

## 三、第一层：副作用分类 — ToolRegistry

不是所有工具都是平等的。queryDeviceAlarms（查告警）和 createWorkOrder（创建工单）在 LLM 眼里没有区别，但在系统层面一个是读一个是写——读可以重试、可以并发、不加锁；写必须串行、必须加锁、必须支持回滚。

先定义元数据：

// tool/SideEffect.javapublic enum SideEffect { READ, WRITE }// tool/ToolMeta.javapublic record ToolMeta(    String name,    SideEffect sideEffect,    int maxCallsPerRequest,   // READ: 3, WRITE: 1    boolean requiresApproval,    int timeoutMs) {}

然后建一个注册中心，所有工具在这里声明自己的"身份"：


```java

// tool/ToolRegistry.java@Componentpublic class ToolRegistry {    private final Map&lt;String, ToolMeta&gt; registry = new LinkedHashMap&lt;&gt;();    @PostConstruct    void init() {        register("queryDeviceAlarms",     SideEffect.READ,  3, false, 5000);        register("queryDeviceHistory",    SideEffect.READ,  3, false, 5000);        register("searchKnowledgeBase",   SideEffect.READ,  3, false, 5000);        register("generateDiagnosis",     SideEffect.READ,  3, false, 5000);        register("createWorkOrder",       SideEffect.WRITE, 1, true,  10000);        register("startWorkOrder",        SideEffect.WRITE, 1, false, 10000);        register("completeWorkOrder",     SideEffect.WRITE, 1, false, 10000);    }}
```

```


```
这里的关键设计决策是：读工具最多 3 次，写工具最多 1 次。 这不是拍脑袋的数字。读工具多调一次没有副作用，给 LLM 留一些探索空间；写工具一次就够了——如果诊断需要创建两张工单，那是工作流该管的事，不是 LLM 该决定的事。

## 四、第二层：硬预算熔断 — ToolBudget

在 application.yml 中声明硬预算：

agent:  budget:    max-llm-calls: 5    max-read-tools-per-request: 3    max-write-tools-per-request: 1    total-latency-ms: 10000

对应的配置类：

```java

// tool/ToolBudget.java@Component@ConfigurationProperties(prefix = "agent.budget")public class ToolBudget {    private int maxLlmCalls = 5;    private int maxReadToolsPerRequest = 3;    private int maxWriteToolsPerRequest = 1;    private int totalLatencyMs = 10000;}
```


这四项约束构成了 Agent 的"安全笼"：

- maxLlmCalls=5：单次请求 LLM 最多推理 5 轮，防止 ReAct 无限循环

- maxReadToolsPerRequest=3：读工具最多 3 次，避免 LLM 反复查询消耗资源

- maxWriteToolsPerRequest=1：写操作绝对只执行一次，这是安全底线

- totalLatencyMs=10000：10 秒总超时，过了就掐断，不让用户无限等待

## 五、第三层：强制幂等 — ToolExecutor

这是整个工具层的核心。ToolExecutor 负责调度每一次工具调用，确保三件事：不会重复执行、不会超出预算、每次执行都有审计日志。


```java

// tool/ToolExecutor.java@Componentpublic class ToolExecutor {    // 内存幂等存储（生产环境换 Redis）    private final Map&lt;String, String&gt; idempotencyStore = new ConcurrentHashMap&lt;&gt;();    // 生成唯一执行 ID    public String generateExecutionId(String sessionId, String toolName, String params) {        String raw = sessionId + ":" + toolName + ":" + params;        // SHA-256 取前 16 位        ...        return hex.substring(0, 16);    }    // 预算校验    public ToolMeta validate(String toolName, int readCount, int writeCount) {        ToolMeta meta = registry.get(toolName).orElseThrow(...);        if (meta.sideEffect() == WRITE &amp;&amp; writeCount &gt;= budget.getMaxWriteToolsPerRequest()) {            throw new ToolException("Write budget exceeded");        }        if (meta.sideEffect() == READ &amp;&amp; readCount &gt;= budget.getMaxReadToolsPerRequest()) {            throw new ToolException("Read budget exceeded");        }        return meta;    }    // 审计记录    public void audit(String executionId, String toolName, ...) {        ExecutionAuditLog entry = new ExecutionAuditLog(            executionId, toolName, sideEffect, params, result, status, durationMs, Instant.now());        auditLogs.add(entry);    }}
```

```


```
有了 ToolExecutor，WorkOrderTool.createWorkOrder 的改造就很直观了：

@Tool("创建维修工单...")public String createWorkOrder(...) {    // 1. 生成幂等 ID    String executionId = toolExecutor.generateExecutionId(            "session", "createWorkOrder", deviceId + type + priority + description);    // 2. 如果已经执行过，直接返回缓存结果    if (toolExecutor.isIdempotent(executionId)) {        String cached = toolExecutor.getCachedResult(executionId);        toolExecutor.audit(executionId, "createWorkOrder", WRITE,                params, cached, "DUPLICATE", duration);        return cached;   // ← 绝不执行第二次 INSERT    }    // 3. 首次执行，正常写入    WorkOrder wo = new WorkOrder(deviceId, type, priority, description);    jdbc.update("INSERT ...", ...);    // 4. 缓存结果 + 写审计日志    toolExecutor.cacheResult(executionId, result);    toolExecutor.audit(executionId, "createWorkOrder", WRITE,            params, result, "OK", duration);    return result;}

现在，无论 LLM 如何重复调用，系统行为是确定的：

- 第一次调用 createWorkOrder：正常执行 INSERT，缓存结果

- 第二次调用（相同参数）：execution_id 命中缓存 → 返回「已执行」，绝不开第二次 INSERT

## 六、审计日志：每一次调用都有迹可循

ExecutionAuditLog 记录了每次工具调用的完整信息：

public record ExecutionAuditLog(    String executionId,    String toolName,    SideEffect sideEffect,    String params,    String result,    String status, // OK / DUPLICATE / ERROR    long durationMs,    Instant timestamp) {}

生产环境中这些记录会异步写入数据库（P1 的 AsyncSideCar 会做），但在 P0 阶段，内存存储足以在出问题时回溯整条工具调用链。

出问题时能看到什么？一个请求的所有工具调用记录：

executionId=e7b2a..., tool=queryDeviceAlarms, status=OK, duration=12msexecutionId=3f1c8..., tool=queryDeviceHistory, status=OK, duration=45msexecutionId=8a9d1..., tool=searchKnowledgeBase, status=OK, duration=23msexecutionId=4e5f7..., tool=createWorkOrder, status=OK, duration=8msexecutionId=4e5f7..., tool=createWorkOrder, status=DUPLICATE, duration=0ms  ← 被拦住了

最后一条重复调用的工单创建被幂等检查拦截，没有产生第二条 INSERT。

## 七、P0 的边界：什么做了，什么没做

P0 工具层改造达到的效果：

能力

状态

工具按副作用分类（READ/WRITE）

✅

硬预算熔断（LLM 调用次数 + 工具类型次数 + 总超时）

✅

强制幂等（execution_id 去重）

✅

审计日志（每次调用留痕）

✅

分布式锁（WRITE 工具 Redis SETNX）

⏳ P1

Saga 补偿（写操作失败自动回滚）

⏳ P1

幂等存储持久化（当前内存，换 Redis）

⏳ P1

P0 的策略是先兜底，再完善。内存幂等存储对于单实例足够，分布式锁和 Saga 补偿在 P1 多实例部署时再做。

## 八、一句话总结

> 把工具调用从「LLM 说调就调的裸方法」升级为「有身份、有预算、有去重、有审计的受控执行单元」——这不是让 Agent 更聪明，而是让它更安全。

把工具调用从「LLM 说调就调的裸方法」升级为「有身份、有预算、有去重、有审计的受控执行单元」——这不是让 Agent 更聪明，而是让它更安全。

项目地址：github.com/LaoLiang-agent/industrial-agent-long

下一篇预告：「Agent Runtime 状态机：让 AI 推理每一步都可暂停、可回放、可审计」
