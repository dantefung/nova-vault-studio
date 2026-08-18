---
title: "Agent 系统的 SideCar 模式：主链路之外的异步能力"
author: "老梁agent"
date: "2026年7月22日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/FpizMCG5i1hAoyQ_9Jk1kA"
---

# Agent 系统的 SideCar 模式：主链路之外的异步能力

> 一个 Agent 请求的生命周期里，只有 LLM 推理和工具执行是用户真正在等的。剩下的——记成本、写日志、推指标、存审计——全都是"顺便做的事"。把这些事从主链路剥离出去，就是 SideCar 模式。



一个 Agent 请求的生命周期里，只有 LLM 推理和工具执行是用户真正在等的。剩下的——记成本、写日志、推指标、存审计——全都是"顺便做的事"。把这些事从主链路剥离出去，就是 SideCar 模式。



## 一、什么该在主链路，什么不该



Agent 处理一次请求时，执行路径可以分成两类操作：



类型



操作



用户需要等吗？



LLM 推理



是



工具调用



是



Prompt 编译



是（毫秒级）



非关键



Token 成本记录



否



非关键



对话记忆写入



否



非关键



审计日志落库



否



非关键



指标上报



否



关键路径决定响应时间，非关键操作只影响系统的完整性和可观测性。 把两者混在一起，等于让用户为系统内部的事务买单。



SideCar 模式的本质：关键路径做完立刻返回，非关键操作"挂"在请求后面异步完成。 就像 F1 进站——换轮胎（关键路径）做完立刻出发，数据采集、故障诊断（非关键）在车出去之后再处理。



## 二、代码里的"搭便车"现象



常见写法——所有操作堆在同一个方法里，顺序执行：



public String chat(RuntimeContext ctx, String userMessage) {    String reply = llm.chat(userMessage);    costTracker.recordRequest(userMessage, reply);  // 记成本    auditLog.save(entry);                            // 写审计    metrics.report(state, elapsedMs);                // 推指标    memory.recordTurn(ctx, userMessage, reply);      // 写记忆    return reply;  // 此时已经过了 4 次 IO + 1 次 LLM 调用}



用户看到回复的时间 = LLM 推理 + 成本记录 + 审计写入 + 指标上报 + 记忆存储。后四项跟用户完全无关，但每一项都在增加时延。



## 三、SideCar 怎么工作



改造后的代码：



public String chat(RuntimeContext ctx, String userMessage) {    String reply = llm.chat(userMessage);    sideCar.recordCost(userMessage, reply);    // @Async → 直接返回    sideCar.persistAudit(entry);               // @Async → 直接返回    sideCar.reportMetrics(state, elapsedMs);   // @Async → 直接返回    sideCar.recordTurn(ctx, userMessage, reply); // @Async → 直接返回    return reply;  // LLM 推理结束后立刻返回}



四个 sideCar.xxx() 调用是瞬间返回的——它们只是把任务丢进线程池队列，实际执行在后台线程。用户感知的时延从 LLM+4次IO 压缩到只剩 LLM。



SideCar 内部使用专用线程池，和主线程完全隔离：



// sidecarExecutor: 常驻 2 线程，最大 4，队列 100@Async("sidecarExecutor")public void persistAudit(ExecutionAuditLog entry) {    pg.update("INSERT INTO tool_audit_logs (...) VALUES (...) ON CONFLICT DO NOTHING",               entry.executionId(), ...);}



## 四、SideCar 的四个职责



在这个 Agent 系统中，SideCar 承担四个明确的异步职责：



成本记录 — 每次 LLM 调用后统计 input/output token 数和费用。对用户透明，但对运营至关重要。



记忆写入 — 对话结束后把用户消息和 Agent 回复写入 L1（Working Memory）和 L2（Conversation Memory），摘要生成和画像更新也走异步。



审计落库 — 每次工具调用的入参、返回、耗时、状态写入 PostgreSQL 的 tool_audit_logs 表。重启不丢失，出问题时能通过 executionId 回溯。



指标上报 — 请求耗时、成功/失败状态、熔断次数等推送到 Micrometer，接入 Prometheus + Grafana 监控。



## 五、SideCar 和主链路的容错关系



关键问题：如果 SideCar 里的异步任务失败了怎么办？



答案：不影响主链路。 每个异步方法内部都有 try-catch，失败只记 warn 日志，不回滚主链路的响应。



@Async("sidecarExecutor")public void persistAudit(ExecutionAuditLog entry) {    try {        pg.update("INSERT INTO tool_audit_logs ...", ...);    } catch (Exception e) {        log.warn("[AsyncSideCar] audit persistence failed for {}: {}",                   entry.executionId(), e.getMessage());    }}



原则：用户的回复比审计日志重要。 审计日志丢了可以补（有内存缓存 + 日志文件），但用户多等一秒就会离开。



这也意味着 SideCar 适合"最终一致性"的场景——成本统计差几条不会死，审计日志可以延迟几秒入库，指标偶尔漏报不影响告警。需要强一致性的操作（比如创建工单、修改设备状态）不能进 SideCar，必须在主链路的事务里完成。



## 六、什么时候不该用 SideCar



SideCar 不是万能药。这些操作不应该进 SideCar：



- 涉及资金、权限、状态变更的操作 — 退款、审批、设备关停，必须同步执行并返回明确结果



- 影响 LLM 后续推理的数据 — 工具调用结果、RAG 检索结果，这些是 LLM 推理的输入，必须同步



- 需要立即反馈给用户的结果 — 工单创建成功与否、诊断结论，用户要看到结果



简单判断标准：操作结果是否需要立刻出现在回复里？需要就同步，不需要就异步。



> SideCar 不是让系统更快——LLM 推理时间不变。它是让系统不浪费用户的时间在用户不关心的事情上。



项目地址：https://github.com/LaoLiang-agent/industrial-agent-long
