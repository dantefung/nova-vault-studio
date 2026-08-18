---
title: "你的 Agent 离生产级还有多远？一份开箱即用的体检清单"
author: "老梁agent"
date: "2026年7月3日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/H91owxyBWZEAek-8Ov2eaQ"
---

# 你的 Agent 离生产级还有多远？一份开箱即用的体检清单

> 上一篇文章定义了生产级 Agent 的 6 大核心能力。这篇文章换个角度——直接把 MVP 的代码摊开，逐条对照病灶给证据，然后给出可执行的三期改造路线图。



上一篇文章定义了生产级 Agent 的 6 大核心能力。这篇文章换个角度——直接把 MVP 的代码摊开，逐条对照病灶给证据，然后给出可执行的三期改造路线图。



提示：不熟悉industrial-agent-long项目的同学建议先从这个专栏开始看工业AI Agent实战派



## 一、别急着加功能，先做体检



industrial-agent-long 是一个工业设备智能运维 Agent。它的能力清单拉出来不寒碜：



- 单 Agent + 多 Tool 的 ReAct 推理链路



- Milvus 向量知识库 + RAG 检索



- TDEngine 时序数据查询与分析



- 多 Agent 路由（Router → 专家分发）



- Supervisor 任务编排 + 人工审批闸门



- MCP 标准化工具协议



- 边缘推理 + 云端兜底



- 三层安全护栏 + CircuitBreaker



功能堆得不少，但如果你把它部署到生产环境，下面这 5 个问题会一个一个找上门来。



## 二、5 大病灶：对着代码给证据



### 病灶 1：上下文失控



病灶代码：AgentConfig.java



@Beanpublic ChatMemory chatMemory() {    return MessageWindowChatMemory.withMaxMessages(20);}



MessageWindowChatMemory.withMaxMessages(20) 是最简单的滑动窗口——保留最近 20 条消息，超出直接丢弃。这意味着：



- 第 21 条消息到来时，最早的上下文被静默丢弃。用户在第 3 轮说的设备型号，到了第 22 轮就没了。



- 没有摘要压缩。如果 20 条里有 15 条是工具返回的大段 JSON（比如一次 TDEngine 查询返回 200 行数据），Prompt 已经撑爆了，但 LLM 照单全收。



- 没有分层。用户画像、当前任务状态、短期对话、长期偏好全混在一个池子里，LLM 自己都分不清哪些是需要优先关注的。



严重度：⚠️ 中。 短期表现是漏掉关键信息导致答非所问；长期影响是无法积累用户知识，每轮对话都是「新用户」。



### 病灶 2：工具裸奔



这是生产事故的第一高发区。三个角度——



角度一：无幂等保护。



看 WorkOrderTool.java 的 createWorkOrder 方法：



@Tool("创建维修工单...")public String createWorkOrder(        @P("设备ID") String deviceId,        @P("工单类型") String type,        @P("优先级") String priority,        @P("故障描述") String description) {    WorkOrder wo = new WorkOrder(deviceId, type, priority, description);    jdbc.update("INSERT INTO work_orders (...) VALUES (?,?,?,?,?)", ...);    return wo.toString();}



每次调用都生成新 ID → 新 INSERT。如果 LLM 在 ReAct 循环中对同一个故障重复决策「创建工单」，你会得到两张完全独立的工单。没有 execution_id 去重，没有「该操作已执行，当前状态为 xxx」的缓存返回。



如果是创建工单还算轻的——换成退款、发券、扣库存，重复调用直接造成经济损失。



角度二：无副作用分类。



看 DeviceAgent.java 的 Agent 组装：



private IndustrialAssistant buildAssistant() {    return AiServices.builder(IndustrialAssistant.class)            .chatModel(chatModel)            .chatMemory(chatMemory)            .tools(alarmTool, dataTool, diagnosisTool, knowledgeBaseTool, workOrderTool)            .build();}



所有工具一股脑注册给 LLM，没有任何区分——queryDeviceAlarms（读）和 createWorkOrder（写）在 LLM 眼里是平等的。LLM 不知道哪些操作有副作用、哪些可以重试、哪些必须加锁。



角度三：无调用次数限制。



DiagnosisTool 的 generateDiagnosis 没有调用上限——LLM 可以在一个循环里反复修改参数调用它 10 次，系统不会阻止也不会报警。



严重度：🔴 致命。 工具层不改，上线就是定时炸弹。



### 病灶 3：RAG 检索「过敏」



病灶代码：KnowledgeBaseTool.java



public String searchKnowledgeBase(String query) {    Embedding queryEmbedding = embeddingModel.embed(query).content();    EmbeddingSearchResult&lt;TextSegment&gt; result = embeddingStore.search(            EmbeddingSearchRequest.builder()                    .queryEmbedding(queryEmbedding)                    .maxResults(3)                    .minScore(0.5)                    .build()    );    // 直接返回结果，无任何过滤}



问题清单：



- 只有向量检索，没有 BM25 稀疏召回。 对于精确的设备型号（如「CNC-5X-880」）、故障代码（如「ERR_OVERHEAT_42」）这类关键词查询，向量相似度可能完全跑偏——因为 embedding 模型没见过这些专有名词。



- 没有租户过滤。 在多租户场景下，A 工厂的设备故障知识可能因向量相似被返回给 B 工厂的 Agent——这是数据泄露级别的风险。



- 没有时效性检查。 2023 年的旧版维修手册和最新版本被同等对待，LLM 无法区分时效性。



- 没有 Query Rewriting。 用户说「那个便宜点的方案」，这个模糊查询直接进入向量检索——搜出什么全看运气。



> 项目里其实已经有了 Bm25Retriever、RrfFusion、QueryRewriter 的独立实现，但它们从未被集成到 KnowledgeBaseTool 的主检索链路中。



项目里其实已经有了 Bm25Retriever、RrfFusion、QueryRewriter 的独立实现，但它们从未被集成到 KnowledgeBaseTool 的主检索链路中。



严重度：⚠️ 中。 单租户演示足够，多租户生产环境存在数据安全风险。



### 病灶 4：单点阻塞



病灶代码：SupervisorAgent.java



for (SubTask task : tasks) {    if (approvalGate.requiresApproval(task)) {        // ...申请审批    } else {        String reply = dispatch(task);  // ← 同步等待每个专家 Agent 返回        results.add(new SubTaskResult(task, reply));    }}



SupervisorAgent 把所有子任务放在 for 循环里串行执行。如果任务规划产生 4 个子任务（查告警 → 查数据 → 查知识库 → 诊断），即使前 3 个是互不依赖的 READ 操作，也必须排队等待。



每次 dispatch 内部又是一次 LLM 调用 + 工具调用，整个链路走下来可能是 4 × (LLM 延迟 + Tool 延迟)。在并发场景下，100 台设备同时告警 → 100 个线程全部卡在 LLM 等待 → Tomcat 连接池耗尽 → 所有请求 503。



严重度：⚠️ 中。 低并发感知不到，生产环境就是雪崩。



### 病灶 5：黑盒推理



病灶代码： 全局。日志散落在各处 log.info()：



// AgentController.javalog.info("[SSE] Stream completed, total tokens used: {}", response.tokenUsage());// DeviceAgent.javalog.info("[Agent] User message: {}", userMessage);// SupervisorAgent.javalog.info("[Supervisor] Executed {} tasks ({}ms)", tasks.size(), elapsed);



问题：



- 没有统一的 Trace ID。 一个请求经过 Controller → Agent → LLM → Tool → DB，每步的日志无法关联。



- 格式不一致。[Agent]、[Supervisor]、[SSE]——都是人肉约定，机器不可解析，无法接入日志聚合系统。



- 缺少关键数据。 LLM 调用没有记录 prompt_hash、token 分布、延迟；工具调用没有记录入参、出参、耗时。



- 没有 OTel 集成。 无法在 Grafana 里可视化回放完整推理链路。



当用户投诉「Agent 给的诊断结论是错的」，你只能翻控制台的散装日志——如果还没被滚动覆盖的话。



严重度：🔴 致命。 没有可观测性，前面 4 个病灶的排查成本成倍放大。而且这个问题让所有生产环境的基础运维能力（报警、排障、容量规划）全部失效。



## 三、诊断总表



#



病灶



关键代码位置



严重度



1



上下文失控



— MessageWindowChatMemory(20)



⚠️ 中



2



工具裸奔



无幂等 + DeviceAgent.java 无副作用分类



🔴 致命



3



RAG 过敏



纯向量 Top-K / 无租户过滤



⚠️ 中



4



单点阻塞



for 循环串行



⚠️ 中



5



黑盒推理



全局 log.info 散落 / 无 Trace ID



🔴 致命



5/5 全中，2 个致命、3 个中度。



## 四、三期改造方案



按风险等级分三期执行。每一期改造完，系统都是一个可独立验证、可独立合入的完整版本——不是半成品。



### P0（第一批）：不改会出事故



对应病灶 #2 和 #5，这是上线前的硬门槛。



改造项



核心动作



解决的问题



新建 ToolExecutor（幂等 execution_id + READ/WRITE 副作用分类 + 硬预算熔断）+ ToolRegistry + ExecutionAuditLog；改造 WorkOrderTool 加分布式锁和去重



模型重复调用彻底无害化



新建 AgentRuntime（8 个离散状态）+ RuntimeContext（统一请求上下文，携带 token 预算、工具调用历史、超时线）



每一步可暂停/恢复/审计，所有改造有了统一骨架



新建 AgentTracer（OpenTelemetry 集成）+ StructuredLogger（JSON 格式）；状态机每个节点埋点；LLM 和工具调用全量结构化记录



出问题 5 分钟定位，不再靠猜



P0 完成后：系统有了中枢（Runtime）、免疫系统（Tool 防护）、神经系统（可观测）。即使其他层暂时没改，至少不会造成数据事故，出了问题能快速定位。



### P1（第二批）：影响体验和成本



对应病灶 #1 和 #4，以及架构增强。



改造项



核心动作



解决的问题



L1 工作记忆 (Redis, TTL 10min) + L2 会话记忆 (Redis Stream, 最近 3-5 轮) + L3 摘要记忆 (PG, 异步小模型生成) + L4 画像记忆 (PG, 置信度 &gt; 0.9 写入)



告别滑窗丢弃，长期积累用户知识



：Role → Policy → Tool Contract → Memory → Knowledge → Task；Policy 动态加载，支持热更新



安全规则编译成硬约束，不发版改行为



（读工具并行 + 写工具串行事务 + 全链路超时熔断）+ AsyncSideCar（日志/审计/摘要异步剥离）



读写分离并发，主链路永不阻塞



P1 完成后：上下文管理从「一个滑窗」进化到四层分级存储；Prompt 从硬编码字符串变成可编排的编译管线；并发从串行阻塞变成读写分离。



### P2（第三批）：锦上添花



对应病灶 #3，以及架构高层抽象。



改造项



核心动作



解决的问题



整合已有的 BM25/RRF/QueryRewriter 到 KnowledgeBaseTool；Milvus Schema 扩展 tenant_id + expire_time；租户过滤下推到查询层



检索质量 + 多租户安全 + 时效治理



（固定场景 + 专属 Prompt + 工具子集）+ WorkflowEngine（确定性 DAG，模型只提取参数，流程硬编码执行）



资金/审批等关键流程不被模型绕过



P2 完成后：RAG 从「向量搜一下」变成完整的混合检索管线；涉及资金的操作走确定性 DAG，不给模型自由发挥的空间。



## 五、改造节奏一览



## 六、最后



这篇文章不是否定 MVP 的价值。正相反——没有 MVP，你根本不知道生产级要改什么。MVP 的价值就是帮你快速踩坑，把「理论上的风险」变成「代码里的证据」。



现在坑已经摆在这了。下一篇文章开始填第一个坑——工具层的生产级改造。



项目地址：github.com/LaoLiang-agent/industrial-agent-long
