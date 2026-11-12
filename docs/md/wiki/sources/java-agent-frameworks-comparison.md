---
title: "Java AI Agent 框架横向对比：AgentScope vs LangChain4j vs LangGraph4j vs Spring AI Alibaba"
date: "2026-07-29"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/AhJPLG0lJzBcohbk6a5fcg"
---

# Java AI Agent 框架横向对比：AgentScope vs LangChain4j vs LangGraph4j vs Spring AI Alibaba

> 2025-2026 年，Java 生态的 AI Agent 框架从「能用」走到了「选型困难」。LangChain4j 先发优势明显，Spring AI Alibaba 背靠阿里云，LangGraph4j 带着图编排的概念入场，AgentScope 2.0 则在 2026 年 7 月正式 GA。四套框架，四种理念，这篇文章做一次系统性的横向对比。

## 一、为什么需要对比

Java 不是 AI Agent 的原生语言。Python 生态有 LangChain、LangGraph、AutoGen、CrewAI，选择多、迭代快。Java 这边，直到 2025 年 LangChain4j 进入 1.0，才算有了一个「能正经写 Agent 的框架」。

但 2026 年上半年，情况变了：

- AgentScope Java 2.0 正式 GA，阿里达摩院出品，MCP+A2A+沙箱全内置
- Spring AI Alibaba 借 Spring 生态之势，把 AI Agent 能力直接注入 Spring Boot
- LangGraph4j 把 LangGraph 的有状态图编排带到了 Java
- LangChain4j 1.16 持续迭代，工具链最成熟

四套框架的目标都是「在 Java 里写 Agent」，但设计理念差异巨大。这篇文章不写代码，只做架构层面的横向对比。

## 二、四套框架一览

| 维度 | LangChain4j | LangGraph4j | Spring AI Alibaba | AgentScope Java 2.0 |
|------|-------------|-------------|-------------------|---------------------|
| 出品方 | 社区驱动 | 社区驱动 | 阿里云 | 阿里达摩院 |
| 发布时间 | 2024 Q1 | 2025 Q2 | 2025 Q4 | 2026.7 GA |
| 核心组件 | AiServices + @Tool + ChatMemory | StateGraph + Node + ConditionalEdge | ChatClient + @Tool + Advisor | ReActAgent + HarnessAgent + Subagent |
| Agent 模式 | 单 Agent（ReAct） | 图编排（有状态） | 单 Agent（ReAct） | 9 种协作模式 |
| 多 Agent | Router（手写 switch） | StateGraph 节点间传递 | 无原生支持 | Supervisor + SubagentDeclaration + A2A |
| MCP 支持 | mcp-spring-boot-starter 适配 | 无原生支持 | 无原生支持 | 原生集成（tools.json 声明式）|
| 工具系统 | @Tool + @P 注解 | 自定义 ToolNode | @Tool 注解 | @Tool + @ToolParam + Toolkit |
| 记忆管理 | ChatMemory（窗口/Token） | 自管理 State | ChatMemory | Session 持久化 + 记忆压缩 |
| 沙箱隔离 | 无 | 无 | 无 | Docker/K8s 子进程隔离 |
| 事件流 | TokenStream | 无 | Flux | Flux + 28 种事件 |
| A2A 协议 | 无 | 无 | 无 | ✅ 原生支持 |
| 模型支持 | OpenAI/Azure/Ollama 等 10+ | 取决于底层 LLM | 通义千问（DashScope） | OpenAI 兼容 |
| 响应式 | 无 | 无 | ✅ Spring WebFlux | ✅ Project Reactor |
| 自研框架 | 无（开源社区版） | 低 | 高 | 低 |
| 自研框架 | 无 | 无 | 无 | ✅ Eval Probe 机制 |
```

| GitHub Stars | 8k+ | &lt;500 | 3k+ | 3k+（Python 版）|
```

| 发布频率 | 每月 1-2 次 | 不定期 | 跟随 Spring AI | 双周迭代 |

## 三、架构设计哲学

### 3.1 LangChain4j：工具链优先

LangChain4j 的核心理念是「把 LLM 调用的各种需求封装成 Java API」。它的 AiServices 是一个聪明的设计——用接口 + 注解的方式把 LLM 包装成普通的 Java Service：

- 定义接口 → 加 @SystemMessage → 注入 @Tool → 调用 chat() → 拿到结果
- 对 Spring Boot 开发者极友好，学习成本几乎为零
- 多 Agent 协作需要自己写逻辑（Router 本质是 switch，Supervisor 需要手写任务规划）

> LangChain4j 做得好的是「让一个 Agent 跑起来」，做得不够的是「让多个 Agent 协作起来」。

### 3.2 LangGraph4j：图编排优先

LangGraph4j 移植自 Python LangGraph，核心是有状态的图执行引擎。每个节点是一个处理步骤，边定义了节点间的流转逻辑，State 在整个图中共享和传递。

- 适合流程确定性强的场景（比如先 A → 再 B → 条件判断 → C 或 D）
- 不适合 LLM 自主决策的场景（Agent 应该自己决定下一步做什么，而不是被图定义好了）
- Java 版的成熟度明显低于 Python 版，社区贡献者少

> LangGraph4j 做得好的是「定义流程」，做得不够的是「让 Agent 自己思考」。

### 3.3 Spring AI Alibaba：生态绑定优先

Spring AI Alibaba 的卖点是「在 Spring Boot 里写 AI Agent，和写普通 Service 一样」。它深度绑定阿里云 DashScope（通义千问），提供 Spring Boot Starter 一键集成。

- 对 Spring 技术栈团队友好，几分钟就能从零搭起一个 AI Agent
- 但框架本身不是 Agent 框架——它更像「通义千问的 Spring SDK + 一些 Agent 工具」
- 没有多 Agent 协作，没有 MCP 支持，没有沙箱，Agent 能力依赖阿里云 SaaS

> Spring AI Alibaba 做得好的是「快速集成通义千问」，做得不够的是「构建真正的 Agent 系统」。

### 3.4 AgentScope Java 2.0：Agent 原生优先

AgentScope 的设计哲学是「Agent 是一等公民，框架负责 Agent 需要的一切」。它不是 LLM 调用库的封装，而是一套完整的 Agent 运行时：

- **ReActAgent** 是基础单元，内置 Think→Act→Observe 推理循环
- **HarnessAgent** 是生产级包装，在 ReActAgent 上加工作区、会话持久化、记忆压缩、子 Agent 编排、沙箱
- **Supervisor 模式**把子 Agent 注册为 Tool，LLM 自主决定路由——不需要手写 switch
- **SubagentDeclaration** 声明子 Agent，LLM 通过 `agent_spawn` 工具动态创建
- **MCP 原生集成**，在 `tools.json` 里声明 MCP Server，框架自动发现

> AgentScope 做得好的是「让 Agent 具备完整的自主行为能力」，做得不够的是社区刚起步、文档还在完善。

## 四、核心维度深度对比

### 4.1 Agent 抽象层级

```
底层（LLM 调用）
├── Spring AI Alibaba: ChatClient
├── LangChain4j: ChatLanguageModel → AiServices
├── LangGraph4j: StateGraph (图执行引擎)
└── AgentScope: ChatModel → ReActAgent → HarnessAgent
    ↑ 最高层抽象
```

AgentScope 的抽象层级最高。HarnessAgent 不是一个「封装了 LLM 调用的工具」，而是一个完整的 Agent 运行时——它有自己的工作区目录，有自己的 AGENTS.md 和 MEMORY.md，有自己的工具注册表，有自己的子 Agent 池，有自己的 MCP 连接器。

### 4.2 多 Agent 协作

这是四个框架差异最大的地方。

- **LangChain4j**：没有原生的多 Agent 协作。要协作就得自己写——Router 用 Intent 分类 + switch，Supervisor 手写任务分解逻辑。灵活但工作量大，而且容易写出不可维护的分发代码。
- **LangGraph4j**：用 StateGraph 实现多节点协作。缺点是图的拓扑结构是编译时确定的，Agent 不能在运行时动态决定「下一个该叫谁」。
- **Spring AI Alibaba**：目前没有多 Agent 故事。
- **AgentScope**：Supervisor 模式 + SubagentDeclaration 双轨制。Supervisor 模式适合「一个主管分配任务给专家」的场景——把子 Agent 注册为 Tool，LLM 自主路由。SubagentDeclaration 适合「需要动态创建子 Agent」的场景——LLM 通过 `agent_spawn` 工具创建新 Agent 实例。两者都不要求编译时确定协作拓扑，Agent 在运行时自主决策。

### 4.3 MCP（Model Context Protocol）支持

MCP 在 2026 年已经成为 AI Agent 工具集成的协议标准。框架对 MCP 的支持程度，直接决定了它能接入多少外部工具和数据源。

| 框架 | MCP 支持 | 方式 |
|------|----------|------|
| LangChain4j | 间接 | 通过社区 mcp-spring-boot-starter 适配 |
| LangGraph4j | 无 | — |
| Spring AI Alibaba | 无 | — |
| **AgentScope** | **原生** | **声明式配置，框架自动发现和连接** |

AgentScope 的 MCP 集成是「声明即用」级别的——在 `tools.json` 里写一个 JSON 对象，指定 transport 类型（stdio/SSE/WebSocket），框架启动时自动连接 MCP Server 并注册所有 Tool。

### 4.4 工具系统

| 框架 | 工具系统特点 |
|------|-------------|
| LangChain4j | @Tool 注解 + @P 参数，最简洁；缺点是没有工具注册中心，工具散落在 Bean 里不可审计 |
| LangGraph4j | ToolNode 特殊图节点，编译时绑定，LLM 不能在运行时动态选择工具 |
| Spring AI Alibaba | @Tool 注解，工具即 Bean，耦合在 Spring 配置层 |
| **AgentScope** | **@Tool + @ToolParam + Toolkit 显式注册 + MCP 自动注册 + 按名称/能力/标签查找** |

关键：**显式注册 > 隐式注入**。对于需要审计、需要权限控制、需要多 Agent 共享工具的工业场景，工具注册表是一个基础能力，不是可选的增强。

### 4.5 生产就绪度

| 能力 | LangChain4j | LangGraph4j | Spring AI Alibaba | AgentScope |
|------|-------------|-------------|-------------------|------------|
| 会话持久化 | 无（需自建） | State 序列化 | 无 | ✅ AgentStateStore（Redis/MySQL/PG） |
| 记忆压缩 | 无 | 无 | 无 | ✅ 内置上下文压缩 |
| 沙箱隔离 | 无 | 无 | 无 | ✅ Docker/K8s |
| 事件流 | TokenStream | 无 | Flux | ✅ Flux + 28 种事件 |
| 工作区管理 | 无 | 无 | 无 | ✅ workspace + AGENTS.md + MEMORY.md |
| Trace ID 传播 | 无 | 无 | 无 | ✅ RuntimeContext 贯穿 |

AgentScope 在生产就绪度上明显领先。

### 4.6 A2A（Agent-to-Agent）协议

A2A 是 Google 在 2025 年提出的 Agent 间通信协议标准。核心场景是：不同框架、不同系统、不同组织的 Agent 之间能互操作。

| 框架 | A2A 支持 | 说明 |
|------|----------|------|
| LangChain4j | 无 | 需自行实现 Agent 间通信 |
| LangGraph4j | 无 | StateGraph 内部节点间传递，不是跨系统协议 |
| Spring AI Alibaba | 无 | — |
| **AgentScope** | **内置 A2A Server + Client 实现** | 可跨进程、跨服务器通信 |

工业场景的典型例子：维护 Agent 发现设备故障后，通知巡检 Agent 调整路线；能源 Agent 检测到异常能耗后，通知诊断 Agent 分析原因。AgentScope 的 A2A 实现让这些 Agent 可以跨进程通信，而且协议标准化——不绑定 AgentScope 自身。

### 4.7 模型提供商支持

| 框架 | 模型支持 |
|------|----------|
| LangChain4j | 最开放，10+ 提供商（OpenAI/Azure/Ollama/Vertex/HuggingFace/Anthropic 等）|
| LangGraph4j | 取决于底层 LLM，通常复用 LangChain4j 适配层 |
| Spring AI Alibaba | 深度绑定 DashScope（通义千问），适配其他模型成本高 |
| AgentScope | OpenAI 兼容接口，内置 OpenAIChatModel + DashScopeChatModel，支持 DeepSeek/千问/GLM/Moonshot/本地 vLLM |

工业场景硬需求：私有化部署时使用本地模型。AgentScope 的模型适配层对此天然支持——本地部署一个 vLLM 实例，配置 OpenAI 兼容 endpoint 即可。

### 4.8 错误处理与韧性

| 框架 | 错误处理 |
|------|----------|
| LangChain4j | 基础 RetryPolicy，仅限 LLM 调用层面 |
| Spring AI Alibaba | 依赖 Spring @Retryable / @CircuitBreaker |
| **AgentScope** | **FallbackModel 自动切换备用模型 + Token 窗口管理 + 工具调用超时 + ReAct 循环保护** |

AgentScope 的关键在于错误信息会反馈给 LLM——Agent 不是简单地抛异常，而是把「工具调用失败了，原因是 X」作为上下文，让 LLM 自主决定换一个工具、重试、还是告诉用户当前无法完成。

### 4.9 可测试性与评估

| 框架 | 测试支持 |
|------|----------|
| LangChain4j | 无内建，需 mock LLM 返回 |
| LangGraph4j | 图结构可独立测试节点，但无法测试 LLM 决策质量 |
| **AgentScope** | **Eval Probe 机制：离线评估 + 在线监控，评估维度包括工具选择正确率、回复相关性、任务完成度、步数效率** |

对于工业场景至关重要——Agent 控制的是真实设备，错误的工具调用可能导致产线停机。

### 4.10 部署模式与运维

| 场景 | LangChain4j | Spring AI Alibaba | AgentScope |
|------|-------------|-------------------|------------|
| 本地开发 | ✅ | ✅ | ✅ |
| 公有云 | ✅ | ✅ | ✅ |
| 容器化部署 | ✅ | ✅ | ✅（内置沙箱 Docker/K8s） |
| 私有化部署 | ✅ | ✅ | ✅ |
| 本地模型 | ✅（Ollama/vLLM） | ❌（依赖 DashScope） | ✅（OpenAI 兼容） |
| 分布式 Agent | 需自建 | 需自建 | ✅（A2A + MCP Server 分布式） |

AgentScope 的隐藏优势：workspace 目录是一个自描述的 Agent 包。目录里的 AGENTS.md 定义了 Agent 的行为，tools.json 声明了 MCP 连接，MEMORY.md 保存了长期记忆。这个目录可以打包、复制、版本管理——就像 Docker Compose 文件一样，下载一个 workspace 目录就能在另一个环境启动一个行为完全相同的 Agent。

### 4.11 社区与生态

| 框架 | 社区情况 |
|------|----------|
| LangChain4j | 8k+ Stars，每月 1-2 次发布，20+ 集成模块，Discord 活跃，中文博客丰富 |
| LangGraph4j | `<500` Stars，贡献者个位数，Python 版 10k+ Stars 但 Java 版几乎无人关注 |
| Spring AI Alibaba | 3k+ Stars，issue 回复慢，定位模糊（Agent 框架还是阿里云 AI SDK？） |
| AgentScope | Python 版 3k+ Stars，达摩院维护，钉钉群技术支持，Issue 响应快，Java 版 2026.7 GA 处于冷启动 |

核心不确定性：阿里达摩院对 Java 版的长期投入力度。目前来看，双周迭代、钉钉群活跃、GitHub Issue 专人跟进——信号是积极的。

## 五、选型决策树

```
场景判断：
├── "快速接入 LLM，Agent 能力够用就行"
│   └── → LangChain4j（学习成本最低，生态最熟）
├── "深度绑定阿里云，Spring Boot 原生体验"
│   └── → Spring AI Alibaba（但 Agent 能力弱）
├── "流程固定，需要精确控制的图编排"
│   └── → LangGraph4j（但 Java 版成熟度不够）
└── "构建生产级多 Agent 系统，需要 MCP+沙箱+A2A"
    └── → AgentScope Java 2.0（社区新但架构完整）
```

没有「最好」的框架，只有最匹配当前阶段的框架。

## 六、总结

| 框架 | 一句话 | 最适合 |
|------|--------|--------|
| LangChain4j | 「把 LLM 变成 Java Service」 | 单 Agent，快速集成 |
| LangGraph4j | 「有状态的图编排引擎」 | 确定性流程 |
| Spring AI Alibaba | 「通义千问的 Spring SDK」 | 阿里云生态团队 |
| AgentScope 2.0 | 「完整的 Agent 运行时」 | 生产级多 Agent 系统 |

LangChain4j 让 Agent「能跑」，AgentScope 让 Agent「能自主」。两者不是替代关系，而是不同的阶段选择——LangChain4j 负责 LLM 调用的便利性，AgentScope 负责 Agent 行为的可控性。

这个项目的路径正是从前者走向后者：先用 LangChain4j 快速验证，再用 AgentScope 替换 Agent 编排层，释放精力到工业垂直能力上。

---

> **编者注**：本文发表于 2026-07-29，其中对 Spring AI Alibaba 的描述（「无多 Agent 故事」「无 MCP 支持」）在 v1.1.2.0 后已不成立。参见同系列《为什么我们要把 Agent 引擎从自研换成 AgentScope》的补充说明。
