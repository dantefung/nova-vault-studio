---
title: "搭一个企业级 Agent 平台（六·收尾）：扩展生态，以及如果我来做 3.0 会怎么清债"
date: "2026-08-04"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/DMui2B5NU60B1uU0mp87xA"
---

# 搭一个企业级 Agent 平台（六·收尾）：扩展生态，以及如果我来做 3.0 会怎么清债

> 内核稳、扩展活、治理硬、双轨设杀死开关、文档与代码同源——剩下的，少踩坑。

系列收尾篇。开篇给过 7 条铁律，这里不重复——收尾篇做三件开篇和前五篇都没做的事：① 扩展生态怎么治理；② 如果我是 maintainer，3.0 怎么清掉那 5 处双轨债；③ 一份从零搭到上生产的决策地图。

<!-- more -->

## 一、扩展生态：加扩展零改内核，但发现机制要收口

一个平台不可能把所有模型、沙箱、存储都内置。关键是怎么让加扩展的人不动你的内核——AgentScope 的答案是 SPI。

### 扩展矩阵

| 扩展类 | 发现机制 | 实际清单 |
|--------|---------|---------|
| 模型（Model SPI） | Java ServiceLoader | 5 个独立 provider jar：OpenAI/Anthropic/Gemini/DashScope/Ollama；DeepSeek/GLM/MiniMax 走 OpenAI compat 层 |
| 沙箱（Sandbox SPI） | 手动 Builder | docker（内置）+ kubernetes/daytona/e2b/agentrun（平行） |
| 存储（Store SPI） | 手动 Builder | redis（Redisson+Jedis 双实现）/mysql/postgresql/oss/cos |
| 协议（Transport） | Spring @AutoConfiguration | A2A（agent 间）/AG-UI（前端）/chat-completions（OpenAI 兼容） |
| 渠道（Channel） | 手动 Builder | 钉钉/飞书/企微/GitHub/GitLab |

> 确定会变的东西（模型、存储、沙箱）留 SPI 扩展口；不会变的（ReAct 调度）焊死。扩展点的本质是对变化的分类，不是越多越好。

### 反面教材：三套发现机制并存，没有注册表

同一个框架里：
- **ModelProvider、A2A Transport**→ ServiceLoader 发现
- **11 个 starter + Agent Protocol** → 自动装配
- **存储后端、沙箱、Channel** → 直接 `new/.builder()`

**三套并存，没有统一的 ExtensionPoint 注册表。** 一个新人想接个存储后端，得先翻半天代码才知道该走 SPI、AutoConfig 还是 Builder。

**收口方案（AgentScope 没做、你该做的）：**
- Spring 生态下用 `@AutoConfiguration` 最自然，starter 一引即生效
- ServiceLoader 只做 core 级依赖（如 ModelProvider）
- 别把 Builder 作为"扩展发现"机制暴露给用户
- 建一个 `ExtensionRegistry`（SPI + AutoConfig 都向它登记），让用户一处看清"平台有哪些扩展点、各自走哪条道"

> 别等到三套并存再治理——那时候已经动不了了。

### Credential：半成品，别急着抄

5 个主流 provider 有真实 Credential 类（OpenAI/Anthropic/Gemini/DashScope/Ollama），另有 DeepSeek/Kimi/XAI 3 个还停在 core 里当占位 stub。基类 `CredentialBase.java:59` 的 `listModels()` 直接抛 `UnsupportedOperationException`。

> 你做平台，凭证层先做成配置（一个 application.yml 读 key），别上来就抽象 CredentialProvider 接口——AgentScope 抽了，但没填完。

### 双 BOM：版本治理做对了

`agentscope-dependencies-bom` 管外部第三方依赖、`agentscope-bom` 管平台自身 ~50 个 artifact，两个都用 `${revision}` + flatten-plugin 统一版本。关注点分离——升 Jackson 不用动平台模块表。**平台模块超过 10 个就上双 BOM。**

## 二、如果我来做 3.0：5 处双轨债的清理方案

core 模块 112 处 @Deprecated，其中 80 处标了 forRemoval（全仓库 163 处）。forRemoval=true 是一句承诺——"我会删掉它"。GA 了，承诺没兑现。

### 债 1：Hook vs Middleware——主循环还在双触发

旧 Hook 和新 Middleware 在 ReAct 主循环同一阶段双触发。卡点：`Hook.java:168` 的 `tools()` 还承载工具注册。

**3.0 方案（3 个 minor）：** M1 把 `tools()` 迁到独立 ToolRegistry → M2 主循环删 hookDispatcher.fire* → M3 删 Hook/HookEvent/LegacyHookDispatcher。

### 债 2：Memory vs AgentState——8 个类全 forRemoval，但都还在

`memory/` 包 8 个类全部 @Deprecated(forRemoval=true)，但全部还在，包括 LongTermMemory。卡点：跨会话记忆没有框架级替代。

**3.0 方案：** M1 给 AgentState 加 user_profile slot + onStatePersist 中间件 → M2 迁移使用者 → M3 删 8 个类。

### 债 3：v1 Event vs v2 AgentEvent——包名只差一级

旧 `io.agentscope.core.agent.Event` 和新 `io.agentscope.core.event.AgentEvent`，import 极易选错。旧 Event.java 没标 forRemoval——maintainer 自己都没下定决心删。

**3.0 方案：** 补 forRemoval=true，给一个 minor 迁移期，然后删。

### 债 4：两套多模态块——legacy 连标都没标

legacy 的 ImageBlock/AudioBlock/VideoBlock 和前向统一的 DataBlock 并存。legacy 三个块连 @Deprecated 都没标——是 5 处债里最"地下"的一处。

**3.0 方案：** 先补 @Deprecated(forRemoval)，formatter 统一只认 DataBlock，下个版本删。

### 债 5：两套 subagent-as-tool——core 那套连 deprecated 都没标

core 的 SubAgentTool（消费 v1 Event）和 harness 的 AgentSpawnTool（消费 v2）职责重叠，没标 @Deprecated——和债 4 一样是"隐形债"。

**3.0 方案：** 标 @Deprecated(forRemoval) + 文档引导迁到 agent_spawn。

> 5 处债的共同病根：forRemoval 是承诺，承诺不兑现就是债的复利。最危险的不是标了没删，而是根本没标——这些是 maintainer 都还没意识到的隐形债。

**给做平台的人最硬的一课：** 立一个"deprecation 兑现里程碑"——每个 forRemoval 绑定一个目标版本，到了就删；同时跑一遍全仓，把隐形债挖出来标上。

## 三、上生产决策地图：从零搭到能上线的可勾选清单

### P0 · v1 必做（缺一项就不能上线）
- [ ] 无状态内核：ReAct 循环焊死，工程能力全推到中间件
- [ ] 单实例 × 多 session 并发：per-session scope + Reactor Context 传值
- [ ] AgentState 快照 + 分布式 Store：会话状态全外置
- [ ] 中间件洋葱：日志/审计/限流/skill 全走 Filter 式（4 环绕钩子 + 1 管道钩子）
- [ ] 权限六步引擎 + HITL：独立于中间件，DONT_ASK 给无人值守
- [ ] 统一事件流：一套订阅喂前端/HITL/审计，CustomEvent 留业务逃生舱
- [ ] 优雅停机：先存后断 + 阶段边界切 + 按 requestId 跟踪

### P1 · 上生产前必补（框架不替你兜底，自己写）
- [ ] 沙箱命令级安全：黑名单 / CPU·内存·网络限额
- [ ] 跨副本 CAS 锁：workspace 用 BaseStore.putIfVersion 乐观锁
- [ ] 沙箱状态持久化 + resume：acquire 4 级优先级
- [ ] call/stream 共用一个内核
- [ ] 运维治理面 + 长上下文压缩

### P2 · 看场景
- [ ] 多 Agent 编排：超时晋升 + 事件实时转发 + 跨副本三段式路由
- [ ] 协议化对外：A2A / AG-UI / chat-completions

### P3 · 别急（agent 没跑顺就别开）
- [ ] skill 自学习闭环——先手动管 skill，有 usage 数据了再开

### 选型决策树
- **单机 MVP** → 砍掉 DistributedStore / subagent / skill 自学习，用最简内核
- **多副本生产** → Store + CAS + 优雅停机 + 权限"四件套"必须全上
- **高并发** → 别抄全栈反应式，改用阻塞式 + 线程池，省下巨量调试成本
- **渠道集成** → Channel 扩展（钉钉/飞书/企微/GitHub/GitLab）直接用，别自己写
- **跨会话记忆** → 别等框架，自己用 AgentStateStore + onStatePersist 中间件做

## 四、结语：一个诚实的样本

AgentScope Java 2.0 不是完美样本——它 GA 了还背着 core 112 处 @Deprecated（80 处 forRemoval）、全仓库 163 处，5 处双轨债里有 3 处连 @Deprecated 都没标干净。但它最大的价值正在于此：**它把成功的经验和踩过的坑，都诚实地留在了代码里。**

> 一个成熟的团队，不在于踩了多少坑，而在于踩坑后能不能定下一个"deprecation 兑现里程碑"、把 forRemoval 的承诺真的兑现。

**回扣开篇那 7 条铁律，一句话收口：** 内核稳、扩展活、治理硬、双轨设杀死开关、文档与代码同源——剩下的，少踩坑。

系列完结。愿你的平台，也是这样一个诚实的样本。