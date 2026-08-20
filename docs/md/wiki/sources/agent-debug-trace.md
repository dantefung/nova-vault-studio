---
title: "为什么你的 Agent 答错问题你查不出来？"
author: "老梁agent"
date: "2026年7月10日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/7dJB3_zmBW5ntYEFuSMDYg"
---

# 为什么你的 Agent 答错问题你查不出来？

> 这不是一个技术选型问题，这是一个生存问题。没有推理链路追踪，你永远在用猜的。



这不是一个技术选型问题，这是一个生存问题。没有推理链路追踪，你永远在用猜的。



## 一个小故事



周二下午 3 点，客户总监在群里 @你："CNC-001 的 Agent 诊断结论完全错了，设备明明是正常的，它却生成了紧急工单。查一下怎么回事。"



你打开服务器，翻控制台日志。最近一小时有几万行，[Agent]、[Tool]、[SSE] 散落各处，没有任何关联标识。你不知道哪几行属于 CNC-001 那次请求，不知道 LLM 调了几次、每次传了什么 Prompt、工具返回了什么结果。



你花了 2 小时，最终猜测："可能是 RAG 召回了一条过期的维修记录，LLM 信了。"但你不确定。



这就是 MVP Agent 的日常排障体验。



## 为什么散装日志不够



MVP 的日志有四个致命缺陷：



1. 没有 Trace ID。



一个请求经过 Controller → Agent → LLM → Tool → DB，每一步的日志没有任何关联标识。你看到 5000 行日志，不知道哪 20 行属于同一次请求。Trace ID 是最低成本的关联机制——一个 UUID 贯穿全程。



2. 没有关键数据。



LLM 调用日志应该包含什么？prompt_hash（帮你判断 Prompt 内容是否变了）、input_tokens 和 output_tokens（帮你算成本）、latency_ms（帮你判断是不是 LLM 慢了）。



工具调用日志应该包含什么？入参（帮你复现）、返回值摘要（帮你判断结果是否异常）、耗时（帮你定位慢工具）。



MVP 日志里这些全没有。



3. 格式不可解析。



[Agent]、[Supervisor]、[SSE] 是人肉约定的前缀，机器无法解析。当天你只能靠肉眼 grep，无法接入 ELK 或 Loki 做结构化搜索。



4. 状态不可见。



Agent 在「正在等 LLM 返回」和「正在执行工具」之间切换时，MVP 日志完全不体现。你只能看到起点（请求进来）和终点（回复出去），中间发生了什么是一片黑。



## 三件事让你的 Agent "可解释"



### 第一件：每个请求带 Trace ID，返回给客户端



```java

@PostMapping("/chat")public ResponseEntity&lt;Map&lt;String, Object&gt;&gt; chat(@RequestBody Map&lt;String, String&gt; request) {    RuntimeContext ctx = runtime.createContext(sessionId, tenantId, userId);    String reply = deviceAgent.chat(ctx, message);    return ResponseEntity.ok(Map.of(        "reply", reply,        "traceId", ctx.getTraceId()   // ← 客户端收到这个    ));}
```




客户端报障时说「traceId 是 a1b2c3d4」，你 grep a1b2c3d4 直接拉出完整链路。



### 第二件：LLM 和工具调用全量记录



每次 LLM 调用都记录 prompt_hash、token 分布和延迟；每次工具调用都记录入参、出参摘要和状态。当 Agent 给出错误结论时，你能逐条回溯——是哪次 LLM 推理产生了幻觉，还是哪个工具返回了脏数据。



### 第三件：日志结构化



用 MDC 把 trace_id 注入上下文，用 JSON 格式输出。这在技术上几乎零成本——Logback 配置一行 %mdc{trace_id} 就搞定了。但排障效率提升是指数级的。



## 回到那个周二下午



假如你的 Agent 有全链路追踪，排障流程是：



$ grep "CNC-001" access.log | tail -1# → trace_id = a1b2c3d4e5f6$ grep "a1b2c3d4e5f6" agent.log# → state=MODEL_THINKING, llm_call, prompt_hash=d4e2f..., input=1234, latency=890ms# → tool_call, execution_id=e7b2a, tool=queryDeviceAlarms, params=CNC-001, status=OK# → tool_call, execution_id=3f1c8, tool=searchKnowledgeBase, params=振动异常, status=OK# → llm_call, prompt_hash=8c3a1..., input=2345, latency=1200ms#   ← 这一轮 LLM 的 prompt_hash 和第一轮不同？# → tool_call, execution_id=8a9d1, tool=createWorkOrder, params=CNC-001,维修,HIGH,...# → state=COMPLETED$ grep "8c3a1" llm_prompts.json  # prompt_hash 关联到完整 Prompt# → 发现 RAG 检索结果中包含一条 2023 年的过期维修记录# → LLM 基于这条过期数据做出了错误的诊断结论



5 分钟，定位到根因。 不是猜的，是通过日志回放完整推理链路得出的结论。



## 这不是可选项



很多团队把「可观测性」放在最后做——功能先上线，监控后面补。但 Agent 系统和其他系统不一样：LLM 是不确定的，工具调用是有副作用的，排障窗口是有限的。 没有全链路追踪，你上线后的每一天都在裸奔。



好消息是，这三个能力（Trace ID + 结构化日志 + 指标）的技术成本极低。MDC + Logback + Micrometer，三个都是 Spring Boot 生态开箱即用的东西。唯一需要投入的是意识——从写第一行 Agent 代码开始，就把 trace_id 放进上下文。



## 一句话总结



> 如果你的 Agent 答错了问题，你能在 5 分钟内通过日志回放定位根因吗？如果不能，你的 Agent 还没准备好上线。



如果你的 Agent 答错了问题，你能在 5 分钟内通过日志回放定位根因吗？如果不能，你的 Agent 还没准备好上线。



项目地址：github.com/LaoLiang-agent/industrial-agent-long



下一篇预告：「Agent 记忆的四层存储模型：从 20 条滑窗到长期可演进记忆」
