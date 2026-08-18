---
title: "为什么我们要把 Agent 引擎从自研换成 AgentScope"
date: "2026-07-31"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/w-91CXF-3V68QV76cHjhuA"
---

# 为什么我们要把 Agent 引擎从自研换成 AgentScope

> 一个工业 AI Agent 项目，踩了足够多的坑，到了做架构决策的时候：是继续修修补补自己的 Agent 引擎，还是把通用能力交给一个成熟框架？这篇文章记录这个决策的完整逻辑——从问题识别到方案评估，再到最终选择。

一个工业 AI Agent 项目，踩了足够多的坑，到了做架构决策的时候：是继续修修补补自己的 Agent 引擎，还是把通用能力交给一个成熟框架？这篇文章记录这个决策的完整逻辑。

## 一、项目现状：自研引擎的边界在哪

先交代背景。这个项目是一个工业 AI Agent 系统，用 Java 技术栈，Spring Boot 3.3 + LangChain4j 1.16.3 + DeepSeek。目前已经完成的功能：

- **5 个领域专家 Agent**：告警处理、数据分析、故障诊断、知识检索、通用对话
- **路由分发**：LLM 意图分类 → switch 语句分发到对应的专家 Agent
- **多 Agent 协作**：Supervisor 模式，主管 Agent 做任务分解 + 子任务委派 + 审批门控
- **工业工具链**：设备数据查询（MQTT→TDengine）、工单 CRUD（H2）、向量检索（Milvus）
- **生产基础设施**：Prompt 六层编译、短期/长期记忆、异步调度、可观测性（Micrometer + TraceId）

这些功能在跑，但跑得不够好。

### 1.1 自研部分的实际规模

「自研 Agent 引擎」听起来很重，实际上代码量并不大：

| 自研模块 | 文件数 | 核心职责 |
|----------|--------|----------|
| 路由分发 | 2 个文件 | Intent 枚举 + LLM 分类 + switch 分发 |
| 任务规划 | 1 个文件 | 文本解析 → SubTask 列表 → 串行执行 |
| Workflow 引擎 | 3 个文件 | DAG 拓扑排序 → 节点执行 → 结果汇总 |
| Prompt 编译 | 4 个文件 | 6 层模板 → 动态组装 System Prompt |
| 工具执行层 | 3 个文件 | 工具注册 + 执行 + 预算控制 |
| Agent 运行时 | 1 个文件 | 状态机（IDLE→THINKING→ACTING→DONE）|
| 记忆四层 | 4 个文件 | 短期 PG + 长期 PG + 语义 Milvus + 上下文 ThreadLocal |

约 18 个核心文件，不到 3000 行代码。不多，但每一行都是自己造的轮子。


### 1.2 三个最痛的点

**痛点一：多 Agent 协作靠 if-else**

当前的 RouterAgent 本质是：

```java
switch(intent) {
  case ALARM_EXPERT:  -> alarmExpert.chat(msg);
  case DATA_EXPERT:   -> dataExpert.chat(msg);
  // ... 5 个 case
}
```

SupervisorAgent 的任务分解是字符串解析——LLM 返回一段文字描述子任务，用正则表达式提取任务名和分配对象。不可靠，不可测试，不可扩展。

**痛点二：LLM 调用和 Agent 行为耦合太紧**

当前 5 个专家 Agent 每个都是独立的 `AiServices.builder()` 实例，各自维护自己的 `@SystemMessage` 和 `@Tool` 注册。这种模式：

- 每新增一个专家就要新建一个类
- 工具和专家的绑定关系是编译时确定的
- 专家之间零共享——Prompt 模板、工具注册、记忆管理全部重复


## 二、评估标准：什么才是「好框架」

在评估候选方案之前，先定义清楚「我们需要框架做什么」和「我们不需要框架做什么」。

**框架应该替我们做的：**
- Agent 推理循环（Think→Act→Observe→Think）
- 多 Agent 协作编排（Supervisor 模式、Agent as Tool）
- MCP 工具集成（协议层面的工具发现和调用）
- 会话持久化和记忆管理
- 事件流（前端订阅 Agent 执行过程）

**框架不应该碰的：**
- 工业协议连接（MQTT、OPC-UA、Modbus）
- 时序数据库交互（TDengine）
- 向量检索管线（Milvus + BM25 + RRF + LLM Rerank）
- 设备模拟器（测试用）
- 工单业务逻辑

> 一句话：**框架负责「怎么让 Agent 跑起来」，我们负责「Agent 在工业场景里具体做什么」。**


## 三、为什么不是 LangGraph4j

LangGraph4j 看起来很美——有状态的图编排，节点和边定义协作流程。但深入评估后发现三个致命问题。

### 3.1 图编排的假设是「流程是确定的」

LangGraph4j 的核心理念是：定义好节点（Node）和边（Edge），图引擎自动执行。这意味着协作拓扑是编译时确定的。

但工业 Agent 的场景是这样的：
- 「CNC-001 振动异常」→ 需要告警查询 + 数据趋势 + 振动分析 + 诊断
- 「CNC-002 刀具寿命到期」→ 只需要数据查询 + 工单创建

不同问题需要不同的专家组合，LLM 应该自主决定「下一步找谁」。编译时定义的拓扑结构绑死了这种灵活性。

### 3.2 Java 版成熟度不足

LangGraph4j 跟随 Python LangGraph，但贡献者少、版本号还在 0.x、社区讨论几乎为零。一个 Java 后端项目引入一个成熟度不确定的依赖，风险太高。

### 3.3 只有图编排，没有 Agent 运行时

LangGraph4j 解决的是「流程编排」，但不是「Agent 框架」。它没有 MCP 集成、没有工具系统、没有记忆管理、没有沙箱。用了它，这些能力还得自己补——换了一个更复杂的轮子，但该造的东西一个没少。


## 四、为什么不是 Spring AI Alibaba

Spring AI Alibaba 对 Spring Boot 项目的吸引力是天然的——同一个生态，同样的编程模型，Starter 一键集成。但评估下来，它的定位和 AgentScope 不在同一个赛道。

### 4.1 它更看重定义清晰、可控的流程

Spring AI Alibaba 解决的痛点是「在 Spring Boot 里快速调用通义千问」。它提供 ChatClient、@Tool、Advisor，但这些都是围绕单次 LLM 调用的便利性设计的。

Agent 系统需要的不是这些——它是推理循环（ReAct）、多 Agent 协作（Supervisor/Subagent）、工具协议集成（MCP）、事件流（Flux）。

### 4.2 深度绑定阿里云

`spring-ai-alibaba-starter` 默认连接 DashScope，虽然可以通过 OpenAI 兼容接口用其他模型，但框架的设计假设就是阿里云全家桶。这不符合工业场景的模型灵活性要求——私有化部署可能需要本地模型、边缘推理、多模型路由。

### 4.3 没有多 Agent 故事

截至 2026 年 7 月，Spring AI Alibaba 的 Roadmap 里没有多 Agent 协作、没有 MCP 支持、没有 A2A。它做的是「给 Spring 开发者一个 AI 入口」，而不是「构建可协作的 Agent 系统」。

> **注意**：v1.1.2.0 开始 SAA 以组件的方式支持 Supervisor、A2A 等，并且 v1.1.2.2 开始官方深度融合 AgentScope，两个框架实现优势互补。


## 五、选 AgentScope 的五个理由

### 5.1 Java 原生，不引入 Python

这是硬性约束。项目是 Java 21 + Spring Boot 3.3，团队是 Java 后端开发者，不引入 Python 是底线。AgentScope 是纯 Java 实现，GroupId `io.agentscope`，Maven Central 直接拉取：

```xml
<dependency>
  <groupId>io.agentscope</groupId>
  <artifactId>agentscope-harness</artifactId>
  <version>2.0.0</version>
</dependency>
```


不需要 Python 环境，不需要跨语言 RPC，不需要维护两套构建系统。

### 5.2 Agent 运行时 + MCP + A2A + 沙箱，四个刚需全内置

AgentScope 的 HarnessAgent 不是一个「封装 LLM 调用的库」，而是一个完整的 Agent 运行时：

- **工作区**：每个 Agent 有自己的 `workspace/` 目录，里面有 `AGENTS.md`（行为定义）、`MEMORY.md`（长期记忆）、`tools.json`（MCP 配置）
- **MCP 原生集成**：`tools.json` 声明 MCP Server，AgentScope 自动发现、连接、注册工具
- **A2A 协议**：不同工厂、不同系统、不同 Agent 之间通过 A2A 互操作
- **沙箱隔离**：工具调用在 Docker 子进程中执行，Agent 的行为不会影响宿主系统


这四个能力换任何一个框架都要自己造。AgentScope 直接可用。

### 5.3 Supervisor 模式 + SubagentDeclaration，让 LLM 自己决定协作路线

当前自研引擎最大的痛点——路由的 switch 分发和 Supervisor 的任务分解——在 AgentScope 里变成了原生能力：

**Supervisor 模式（Agent as Tool）**：把子 Agent 注册为 Tool，LLM 根据用户消息自主选择调用哪个子 Agent。不再需要 Intent 枚举、IntentClassifier、switch 语句。

**SubagentDeclaration**：声明子 Agent 的能力描述和工具集，LLM 通过 `agent_spawn` 工具动态创建子 Agent 实例。不再需要手写任务分解逻辑。

> 从「写代码决定 Agent 怎么协作」变成「描述 Agent 能做什么，让 LLM 自己决定怎么协作」——**这是本质的架构升维**。


### 5.4 事件系统让可观测性从「日志 grep」变成「事件消费」

AgentScope 的整个执行过程以 Flux 的形式暴露：

```
THINKING → TOOL_CALLING → TOOL_CALL_RESULT → THINKING → FINAL_ANSWER
```


前端可以直接订阅这个事件流，展示 Agent 的完整思考过程。后端可以在事件流上接入 Metrics、审计、成本分析——不需要在代码里到处埋点，消费事件流即可。

### 5.5 阿里达摩院维护，有组织支撑

AgentScope 背后是阿里达摩院的团队，不是一两个开发者的业余项目。Python 版有 3000+ GitHub stars，Java 版 2026 年 7 月 GA，有钉钉群技术支持、有 GitHub Issues 跟踪、有版本 Roadmap。

> 对于生产系统来说，「框架还有人维护」比「框架功能强大」更重要。


## 六、迁移策略：底层保留，上层替换

选型只是第一步。真正关键的是怎么换。

### 6.1 替换范围：只换 Agent 编排层

| 保留（不迁移） | 替换（用 AgentScope 重写） |
|----------------|--------------------------|
| 设备模拟器 | Skill 接口 → `@Tool` + Toolkit |
| MQTT→TDengine 桥接 | Prompt 编译 → Middleware |
| TDengine 时序查询 | Workflow 引擎 → Supervisor/Subagent |
| 工单工具（业务逻辑） | RouterAgent → Agent as Tool |
| 设备告警工具（业务逻辑） | SupervisorAgent → HarnessAgent |
| 设备数据工具（业务逻辑） | Intent 分类 → LLM 自主路由 |
| 诊断工具（业务逻辑） | 工具执行层 → Toolkit 注册 |
| Milvus 向量库 + RAG 7 步管线 | Agent 运行时 → ReAct 循环 |
| 记忆四层（长期部分） | MCP 客户端 → 原生 MCP 集成 |
| 可观测性（Micrometer） | 调度并发 → 响应式模型（Mono/Flux）|
| 边缘路由（ModelRouter） | |
| 评估框架（eval/） | |
| Guardrail（输入/输出守卫） | |

底层工业基础设施全部保留，只把 Agent 编排相关的自研代码替换为 AgentScope 的原生能力。

### 6.2 渐进式迁移

分 6 个阶段推进：

1. **环境准备**：加依赖、写 AgentScopeConfig
2. **单 Agent 验证**：先迁移一个最简单的专家，跑通端到端链路
3. **工具迁移**：5 个工具类的注解和注册方式切到 AgentScope
4. **多 Agent 协作**：Router 和 Supervisor 用 AgentScope 原生模式重写
5. **清理验证**：删除被替代的 ~18 个文件，回归测试
6. **高级能力接入**：MCP 集成、SSE 事件流、沙箱

每个阶段都有可运行的产物，每个阶段都可以独立验证。发现风险随时回退——LangChain4j 的调用链还在，AgentScope 先并存再替换。

### 6.3 可回退：换 API 只改封装层

AgentScope 2.0 是 2026 年 7 月才 GA 的新框架，API 稳定性确实有风险。应对方式是薄封装层隔离：

- Controller 不直接依赖 AgentScope API，而是依赖内部定义的 `AgentPort` 接口
- `AgentPort` 的两个实现：`AgentScopeAgent`（新）和 `LangChain4jAgent`（旧）
- 通过 Spring Profile `agentscope` 切换实现

这样即使 AgentScope API 变动，也只影响封装层的代码。最坏情况下，一行配置切回 LangChain4j 自研引擎。


## 七、什么时候不该选 AgentScope

这篇文章不是 AgentScope 的广告。以下情况不要选 AgentScope：

- **系统只有单 Agent 对话**：LangChain4j 更成熟，学习成本更低
- **深度绑定阿里云 DashScope**：Spring AI Alibaba 的集成体验更好
- **流程是确定性的图编排**：LangGraph 的 StateGraph 更适合（但 Python 版，不是 Java 版）
- **不想引入响应式编程**：AgentScope 基于 Project Reactor（Mono/Flux），如果团队对 reactive 不熟，初期有学习成本

> AgentScope 的正确打开方式是：**系统有多 Agent 协作需求，需要 MCP 集成和沙箱隔离，并且团队有 Java 响应式编程基础。**

## 八、后续

选择 AgentScope 不是终点，而是新架构的起点。

下一篇文章开始进入代码：第一阶段，单 Agent 迁移验证。

项目地址：github.com/LaoLiang-agent/industrial-agent-long
