---
title: "AgentScope 核心概念与 ReActAgent 深度解析"
date: "2026-08-03"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/RqcfGg93uBOI0ag_ViK7rA"
---

# AgentScope 核心概念与 ReActAgent 深度解析

> 搭建好 AgentScope 项目后，ReActAgent.builder() 的每个配置项背后是什么原理？call() 和 streamEvents() 的适用场景有何不同？AgentScope 的会话记忆管理机制是怎样的？本文从核心概念到构建器参数，逐一展开。

## 一、核心概念速览

| 概念 | 是什么 | 类比 |
|------|--------|------|
| Model | LLM 的抽象接口 | 发动机 |
| ReActAgent | 执行 ReAct 推理循环的 Agent | 驾驶员 |
| Tool | Agent 可以调用的工具 | 方向盘、油门 |
| Toolkit | 工具集合，注册给 Agent | 驾驶座操作面板 |
| sysPrompt | 系统提示词，定义 Agent 角色和行为边界 | 导航路线 |
| Msg | 消息对象，Agent 间通信载体 | 驾驶员说的话 |
| RuntimeContext | 会话上下文，通过 sessionId 管理状态 | 行车记录仪 |
| AgentEvent | Agent 执行过程中发出的 28 种事件 | 仪表盘指示灯 |

每个概念在 AgentScope 中都是接口而非具体实现，这意味着你可以替换任何一层而不影响其他部分——换模型只改 Model bean，换工具只改 Toolkit 注册，换记忆策略只改 AgentStateStore 实现。

## 二、ReAct 循环：Agent 的推理引擎

### 2.1 ReAct 是什么

ReAct（Reasoning + Acting）是 AgentScope Agent 的运行时核心，它不是「接收问题→返回答案」的简单管道，而是一个思考-行动-观察的循环：

```
用户输入
    ↓
┌─────────────────────────────┐
│  Thought: 分析当前状态        │ ← LLM 根据 sysPrompt + 历史决定下一步
│  Action:  调用工具 或 回复     │ ← 框架执行工具，或直接返回文本
│  Observation: 工具返回结果    │ ← 框架将结果反馈给 LLM
│  → 回到 Thought，继续循环     │ ← 直到 LLM 决定给出最终答案
└─────────────────────────────┘
    ↓
最终输出
```

### 2.2 一个完整的 ReAct 示例

用户问「明天北京天气怎么样？」，Agent 有天气工具时：

**第一轮：**
- Thought: 用户需要明天北京的天气，我手头有 getWeather 工具可以查
- Action: 调用 `getWeather(city="北京", date="明天")`
- Observation: `{"city":"北京","weather":"晴","temp_min":15,"temp_max":25}`

**第二轮：**
- Thought: 工具返回了北京明天的天气数据，晴天、15-25°C，直接告诉用户
- Action: 返回文本「明天北京晴，气温 15-25°C，适合出行」

如果 Agent 没有天气工具：
- Thought: 用户问天气但我没有天气查询工具，不能瞎编
- Action: 返回文本「抱歉，我目前没有天气查询工具，无法帮您查询」

### 2.3 ReAct 循环的关键特性

- **LLM 自主决策**：每一步做什么，是调工具还是回复用户，完全由 LLM 根据 sysPrompt 和当前上下文自行判断。开发者不写 if-else，只提供工具描述和行为约束。
- **多步推理**：复杂问题可能需要多轮循环。比如「北京气温和华氏 100 度差多少」——LLM 会先调 `getWeather("北京")` 拿到 28°C，再调 `calculate("100-28")` 算差值，两轮工具调用在同一个循环中自然完成。
- **可中断性**：每轮循环结束后，框架检查是否达到 maxIters 上限、是否被 interrupt() 中断、是否所有工具被权限拒绝，任一条件满足则终止循环。

## 三、ReActAgent 构建器全解

```java
ReActAgent agent = ReActAgent.builder()
    .name("my-agent")                          // 必填
    .sysPrompt("你是一个...")                   // 必填
    .model(model)                              // 必填
    .toolkit(toolkit)                          // 可选
    .maxIters(10)                              // 可选，默认 10
    .generateOptions(GenerateOptions.builder()
        .temperature(0.7)
        .maxTokens(2048)
        .topP(0.9)
        .build())
    .middlewares(List.of(...))                 // 可选
    .build();
```

### 3.1 name：Agent 的身份标识

name 是 Agent 在系统中的唯一标识，影响三个层面：

- **日志追踪**：框架在日志中标注 `[weather-assistant] Processing: ...`，方便定位问题
- **多 Agent 协作**：SubAgent 通过 name 注册到 Supervisor 的 Toolkit，LLM 靠名字区分调用哪个专家
- **状态管理**：AgentState 以 `name + sessionId` 为 key 存储和恢复

命名建议：大写 + 下划线（WEATHER_EXPERT），与 SubAgent 的 toolName 保持一致。

### 3.2 sysPrompt：Agent 的「大脑操作系统」

sysPrompt 承载四个层次的信息：

1. **角色定义**：告诉 Agent「你是谁」——天气助手、代码审查员、客服机器人。角色越具体，回复越精准
2. **工具说明**：列出可用工具及用途。注意：如果用了 Toolkit 注册，框架会自动追加工具 schema，sysPrompt 中不需要重复描述工具参数，只需说明「用什么工具做什么事」
3. **行为约束**：回复格式、语言风格、边界条件（「如果用户问非天气问题，礼貌拒绝」）
4. **流程引导**：对于复杂任务，描述推荐的执行步骤

sysPrompt 的质量直接影响 Agent 的工具选择准确率和回复质量，值得反复打磨。

### 3.3 model：注入 LLM

AgentScope 通过 Model 接口抽象 LLM 调用。Agent 代码依赖的是接口而非具体实现，切换模型提供商（DeepSeek → 千问 → OpenAI）只需改配置类的 Bean，Agent 代码零改动。

### 3.4 maxIters：防止无限循环

ReAct 循环中，Agent 可能陷入「调工具→不满意→再调→还不满意」的死循环。maxIters 设置硬上限，达到后框架返回 EXCEED_MAX_ITERS 事件并终止当前请求。

建议值：简单查询 3-5 轮，复杂诊断 10-15 轮。

### 3.5 generateOptions：生成参数详解

| 参数 | 说明 |
|------|------|
| temperature | 0-2，越低越确定（适合事实性问答），越高越有创造性。工具调用类 Agent 设 0.1-0.3，对话类设 0.6-0.8 |
| topP | 核采样，与 temperature 互补。一般只调其中一个 |
| maxTokens | 单次 LLM 响应的最大 token 数，非整个对话。Agent 场景建议 1024-4096 |
| stop | 停止词列表。Agent 场景更多依赖工具调用的结构化输出来控制流程 |

### 3.6 ReactConfig：控制 ReAct 循环行为

- **maxIters**：最大迭代次数，等同于 builder 中的 maxIters()
- **stopOnReject**：工具被权限检查拒绝时是否立即终止。默认 false（LLM 可以换一个工具继续尝试）；设为 true 适合安全敏感场景

### 3.7 结构化输出

```java
record WeatherResult(String city, String weather, int temperature) {}

WeatherResult result = agent.call("北京天气", WeatherResult.class,
    RuntimeContext.empty()).block().getStructuredOutput();
```

框架在发给 LLM 的请求中追加 JSON 格式指令，开发者拿到的直接是强类型 Java Record。注意：结构化输出只在 LLM 不调工具直接回复时生效。

### 3.8 interrupt()：中断正在执行的 Agent

| 来源 | 含义 | 典型场景 |
|------|------|----------|
| 用户主动取消 | 前端点击「停止生成」 | — |
| 工具执行层触发 | 工具调用超时、沙箱异常 | — |
| 系统层触发 | 资源限制、服务关闭信号 | — |

中断后 streamEvents() 的 Flux 立即终止，call() 返回的 Mono 以错误信号结束。

## 四、call() vs streamEvents()：两种调用模式

### 4.1 Msg 对象的多模态内容

call() 返回的 Msg 不仅是文本，还包含：

- `getTextContent()`：纯文本回复
- `getImages()`：图片列表（多模态模型）
- `getToolCalls()`：LLM 请求的工具调用
- `getToolResults()`：工具调用的结果

这意味着即使使用 call()，事后也能通过 Msg 对象还原 Agent 的执行过程——只是不是实时的。

### 4.2 场景选择

| 场景 | call() | streamEvents() |
|------|--------|---------------|
| 后端 API 同步返回 | ✅ | — |
| 前端打字机效果 | — | ✅ |
| 展示工具调用过程 | — | ✅ |
| WebFlux 响应式 | ✅ | ✅ |
| 需要中间状态处理（审批/确认） | — | ✅ |

核心判断标准：**调用方是否需要感知 Agent 的中间过程。** 不需要就用 call()，需要就用 streamEvents()。

## 五、记忆管理：AgentScope 的「会话即记忆」模型

AgentScope 的记忆管理和 LangChain4j 的 ChatMemory 有本质区别：不是让开发者手动选择记忆策略（窗口/Token/摘要），而是框架自动管理对话历史和状态，开发者只需要传 sessionId。

### 5.1 基本用法：同一个 sessionId = 共享记忆

```java
RuntimeContext ctx = RuntimeContext.builder()
    .sessionId("user-123-session-456")
    .userId("user-123")
    .build();

agent.call("我叫张三，负责 CNC-001 设备", ctx).block();
agent.call("我刚才说我叫什么？", ctx).block();
// → "你叫张三"
agent.call("CNC-001 最近有什么告警吗？", ctx).block();
// Agent 知道在问 CNC-001
```

### 5.2 AgentState：框架自动管理的完整状态

| 字段 | 管理方式 | 作用 |
|------|----------|------|
| 对话历史 | 框架自动追加 | 完整对话历史，LLM 每次调用时自动加载 |
| 摘要 | 框架自动压缩 | 长对话时自动生成摘要，避免超出 token 限制 |
| 迭代计数 | 框架自动递增 | ReAct 循环计数，触发 maxIters 限制 |
| 工具状态 | 框架自动记录 | 工具调用的中间状态 |

### 5.3 AgentStateStore：持久化到外部存储

注入 AgentStateStore 的 Redis 实现后：

- 服务重启不丢对话：同一 sessionId 自动恢复历史
- 多实例共享会话：任何实例都能接续对话
- 会话快照和回放：完整状态可用于调试和审计

### 5.4 与 LangChain4j ChatMemory 的对比

| 维度 | LangChain4j | AgentScope |
|------|-------------|------------|
| 策略选择 | 开发者选：MessageWindowChatMemory(20) 或 TokenWindowChatMemory(2000) | 框架自动管理，内置摘要压缩 |
| 状态内容 | 仅消息列表 | 消息列表 + 摘要 + 执行状态 + 权限上下文 |
| 持久化 | 无内建，需自行实现 | 接口 + Redis 开箱即用 |
| sessionId | 显式传入 | 全自动 |
| 信息丢失风险 | 手动选窗口大小，可能丢关键信息 | 自动摘要压缩，保留关键信息 |

核心区别：LangChain4j 需要开发者主动选择记住多少，AgentScope 让框架自动决定怎么记。LangChain4j 把记忆视为「给 LLM 的输入素材」，AgentScope 把记忆视为「Agent 运行时的有机组成部分」。

## 六、总结

| 构建器参数 | 必填 | 作用 |
|------------|------|------|
| name | ✅ | Agent 标识 |
| sysPrompt | ✅ | 系统提示词 |
| model | ✅ | LLM 模型 |
| toolkit | ❌ | 工具集合 |
| maxIters | ❌ | ReAct 循环上限 |
| generateOptions | ❌ | temperature/topP/maxTokens/stop |
| middlewares | ❌ | 中间件链 |

掌握了 ReActAgent 的构建和调用，下一步就是给它装上工具——让 Agent 能真正「做事情」，而不仅仅是「回答问题」。
