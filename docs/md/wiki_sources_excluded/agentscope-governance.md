---
title: "搭一个企业级 Agent 平台（四）：治理——权限、停机、事件流怎么上生产"
date: "2026-08-02"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/G7dh6PQvOyTHUQaQNXmeYg"
---

# 搭一个企业级 Agent 平台（四）：治理——权限、停机、事件流怎么上生产

> 内核管"想"、外壳管"干"，治理管"管住"——这是自研平台最容易漏、又最决定能不能上生产的部分。

系列第四篇，钻进治理子系统。

## 一、权限六步管线：工具调用前的准入

agent 要调工具（读文件、跑命令、调 API），但不能想调就调——删库、执行危险命令、越权访问，都得拦住。

![权限六步管线](images/agentscope-governance/001.png)

AgentScope 的做法是一条固定顺序的六步评估管线（`permission/PermissionEngine.java`）：

1. **deny 规则** → 直接 DENY（最高优先）
2. **ask 规则** → ASK（附 suggestedRules）
3. **工具自检** → toolCheckPermissions（bypass 模式也拦不住）
4. **allow 规则** → ALLOW
5. **BYPASS 兜底** → ALLOW（仅 BYPASS 模式）
6. **默认** → ASK（DONT_ASK 模式则 DENY）

配套两个建模：
- 结果：ALLOW / DENY / ASK / PASSTHROUGH（PASSTHROUGH = 工具让权给引擎）
- 模式：DEFAULT / ACCEPT_EDITS / EXPLORE / BYPASS / DONT_ASK

### 两个亮点值得抄

- **把 ASK 自动降级为 DENY**，专为无人值守/批处理——夜里跑批，没人能确认，与其卡死不如拒绝
- **ASK + HITL 暂停-确认链**：评估结果是 ASK 时，agent 发 REQUIRE_USER_CONFIRM 事件暂停，等用户确认（USER_CONFIRM_RESULT）再放行或拒绝

### 与中间件正交

权限管"可见的工具能不能调"（单次调用准入），中间件管"哪些工具可见、什么 prompt"（生命周期横切）。两者边界清晰，不互相耦合——做平台时别把权限塞进中间件，做成独立引擎。

> 抄什么：权限做成独立引擎 + 固定六步顺序（可测、可审），ASK + HITL 是生产必备，DONT_ASK 给无人值守。

## 二、优雅停机：长任务不丢

这是多数自研平台的盲区，但用户体感极强：发版/重启时，agent 正在跑一个长任务，直接 kill 就把用户晾了。

![优雅停机](images/agentscope-governance/002.png)

AgentScope 的解法（`shutdown/GracefulShutdownManager.java`）三条原则：

1. **先存后断。** 收到 SIGTERM，遍历活跃请求，先 saveState() 把已生成内容落盘，再 interruptForShutdown() 打断。顺序不能反——反了就丢内容。
2. **只在阶段边界切。** 中断检查在 onReasoning/onActing 的 .doOnComplete() 里，只在 ReAct 一个完整阶段结束后才切，不会在模型流到一半时砍掉，不浪费已消耗的 token。
3. **按 requestId 跟踪。** 一个 agent 实例可并发服务多个请求，停机时按 requestId 精准命中（不是按 agentId 一刀切）。

配套三态机 RUNNING → SHUTTING_DOWN → TERMINATED，1 秒粒度 monitor，超时才强制 interrupt。

整条链路：AgentScopeJvmShutdownHook（注册 SIGTERM）→ performGracefulShutdown → 等 active 处理完 → HttpTransportFactory.shutdown。

> 抄什么：优雅停机是 v1 骨架，不是上线后补的补丁。"先存后断 + 阶段边界切 + 按 requestId" 三条直接照搬，你的用户在发版时就感觉不到中断。

## 三、统一事件流：一套订阅喂前端 / HITL / 审计

agent 跑起来会产生大量动作（LLM 调用、流式文本、工具执行、错误、用户确认）。如果前端渲染、HITL、审计各搞一套，维护到后期必然乱。

AgentScope 用一条统一事件流解决（`event/AgentEvent.java`）：**31 种 typed event**（AgentEventType），覆盖 Agent 生命周期、LLM 调用、流式内容块（text/thinking/data）、工具调用、HITL、Subagent。

### 三个设计值得抄

1. **携带最终 Msg**，让流式订阅者直接从事件流取结果，不用再单独订阅一个 `Mono<Msg>`。这就是为什么 call() 和 streamEvents() 能共用一个内核。
2. **CustomEvent（逃生舱）**：业务层用来通知前端状态变化（state_updated 等），不污染 core 的事件枚举。未知 name 前端静默跳过。
3. **团队消息、后台工具结果、用户打断等"一次性、不流式"的提示块**，和流式 text/thinking 区分开。

向后兼容也扎实：`@JsonAlias` 双保险处理旧 JSON 字段名，前端不会因为事件枚举演进而炸。

> 抄什么：一开始就统一事件流，前端实时渲染、HITL 暂停、审计回放各取所需。用 CustomEvent 给业务层留逃生舱，别让业务状态污染核心枚举。

## 四、抄什么 + 避什么坑

### 值得抄
1. 权限独立引擎 + 六步 + HITL + DONT_ASK
2. 优雅停机：先存后断 + 阶段边界切，v1 就做
3. 统一事件流 + CustomEvent 逃生舱

### 要避的坑
1. **别把权限塞进中间件。** 权限做成独立引擎、与中间件正交——职责混了，权限规则和横切逻辑互相耦合，越改越乱
2. **停机别按 agentId 跟踪。** 一个 agent 并发多请求，按 agentId 一刀切会误伤或漏杀；按 requestId 精准命中
3. **事件枚举无脑膨胀。** 每加一个状态就加一个枚举值，核心枚举很快失控。业务状态走 CustomEvent，核心枚举只放真正通用的

## 五、一句话带走

> 权限做成独立六步引擎、停机先存后断、事件流统一一套——这三样是 agent 平台"能上生产"的及格线，v1 就得有。

**下一篇预告：** 多 Agent 编排——agent_spawn/send 怎么实现、"超时晋升"聪明设计、跨副本路由三段式。