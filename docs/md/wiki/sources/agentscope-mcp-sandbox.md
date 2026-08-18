---
title: "AgentScope 高级特性：MCP 协议集成与沙箱"
date: "2026-08-11"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/OFBXnXI4ityf7xuRZ_lhBQ"
---

# AgentScope 高级特性：MCP 协议集成与沙箱

> MCP（Model Context Protocol）是 AI Agent 领域的「USB 协议」——定义了 Agent 和外部工具之间的标准接口。AgentScope 原生集成 MCP，让 Agent 能通过配置文件发现和调用远程工具。

## 一、MCP 协议概述

### 1.1 问题：工具碎片化

每个 LLM 框架、每个工具提供方都有自己的工具定义方式：

| 框架 | 定义方式 |
|------|----------|
| LangChain | Tool → Python function |
| AgentScope | @Tool → Java method |
| AWS Bedrock | Tool → JSON schema |
| OpenAI | Function → JSON schema |

Agent 开发者如果要用不同来源的工具，就需要为每种来源写适配代码。

### 1.2 MCP 的解决方案

MCP 定义了一套标准协议，包含两个角色：

- **MCP Server**：提供工具的进程（暴露工具列表、参数 schema、执行接口）
- **MCP Client**：调用工具的一方（Agent 框架）

AgentScope 作为 MCP Client，通过声明式配置文件连接到 MCP Server，自动发现并注册远程工具——不需要写 Java 适配代码。

## 二、AgentScope 的 MCP 配置

### 2.1 创建 workspace 目录

```
src/main/resources/workspace/
├── tools.json   ← MCP Server 声明
├── AGENTS.md    ← Agent 描述（给 HarnessAgent 用）
└── MEMORY.md    ← Agent 记忆文件
```

### 2.2 tools.json：声明式 MCP Server 配置

```json
{
  "mcpServers": {
    "weather-server": {
      "type": "http",
      "url": "http://localhost:3100/mcp"
    },
    "database-server": {
      "type": "http",
      "url": "http://localhost:3200/mcp"
    }
  }
}
```

AgentScope 启动时自动执行以下流程：

1. 读取 `tools.json`
2. 连接每个 `mcpServers` 中的 URL
3. 调用 `tools/list` 获取每个 Server 的工具列表
4. 将远程工具注册到 Agent 的 Toolkit 中

Agent 和远程工具之间是**零代码集成**——不需要写任何 Java 代码来桥接。

### 2.3 AGENTS.md：Agent 自描述文件

```markdown
# 智能助手 Agent

通用智能助手，可以查询天气、执行计算、翻译文本。

## 可用工具
- getWeather: 查询城市天气
- calculate: 执行数学计算
- translate: 文本翻译
```

AGENTS.md 是给 HarnessAgent（AgentScope 的更高级封装）用的，描述 Agent 的能力边界。基础的 ReActAgent 不需要这个文件。

### 2.4 在 Spring Boot 中配置 workspace 路径

```yaml
# application.yml
agent:
  workspace: ./src/main/resources/workspace
```

```java
@Value("${agent.workspace}")
private String workspacePath;

// 如果使用 HarnessAgent
HarnessAgent agent = HarnessAgent.builder()
    .workspace(Path.of(workspacePath))
    .subagents(List.of(weatherExpert.getAgent()))
    .build();
```

### 2.5 MCP vs @Tool：什么时候用哪个

| 维度 | @Tool | MCP |
|------|-------|-----|
| 运行位置 | 本地 JVM 进程内 | 远程服务器 |
| 语言 | Java | 任意语言（Python/Go/JS/...）|
| 部署方式 | 和 Agent 一起打包 | 独立部署，独立扩缩容 |
| 配置方式 | Java 注解 | tools.json |
| 适用场景 | Agent 专属的轻量工具 | 共享的、多 Agent 共用的工具 |

> **经验法则**：工具是「Agent 自己的手」，用 @Tool；工具是「共享的基础设施」，用 MCP Server。

## 三、沙箱：工具调用的安全隔离

### 3.1 为什么需要沙箱

Agent 调用工具时，工具代码在 Agent 的进程中执行。如果工具调用是：

```java
@Tool(name = "executeCommand", description = "执行系统命令")
public String executeCommand(String command) {
    Runtime.getRuntime().exec(command);  // 危险！
}
```

那么 LLM 的决策直接影响系统安全。传统做法是「信任工具代码」——但 LLM 可能被 prompt injection 诱导调用不该调的工具。

### 3.2 AgentScope 的沙箱方案

AgentScope 支持将工具调用隔离到 Docker 容器中：

```yaml
agent:
  sandbox:
    enabled: true
    type: docker
    image: "agentscope-sandbox:latest"
    timeout: 30s
    network: none      # 禁止网络访问
    readonly: true     # 只读文件系统
```

每个工具调用流程：

1. Agent 决定调用某工具
2. AgentScope 启动一个 Docker 容器（隔离环境）
3. 工具代码在容器中执行
4. 结果通过容器的 stdout 返回
5. 容器立即销毁
6. AgentScope 将结果传给 LLM

这样即使 LLM 被操纵执行了恶意操作，影响范围也被限制在临时容器内。

### 3.3 沙箱的适用场景

| 场景 | 需要沙箱？ |
|------|-----------|
| 内部系统、可信工具 | 不需要 |
| 用户自定义工具上传执行 | ✅ 必须 |
| 生产环境部署 | ✅ 建议 |
| 开发环境调试 | 不需要 |

## 四、会话持久化

### 4.1 无状态 vs 有状态

```java
// 无状态：每次调用 RuntimeContext.empty()
agent.call("我叫张三", RuntimeContext.empty()).block();
agent.call("我刚才说我叫什么？", RuntimeContext.empty()).block();
// 回复："抱歉，我不知道你叫什么"

// 有状态：共享 sessionId
RuntimeContext ctx = RuntimeContext.builder()
    .sessionId("user-123").build();
agent.call("我叫张三", ctx).block();
agent.call("我刚才说我叫什么？", ctx).block();
// 回复："你叫张三"
```

### 4.2 持久化到 Redis

默认的会话状态在 JVM 内存中，重启后丢失。AgentScope 支持 `AgentStateStore` 插件，将状态持久化到外部存储：

```java
@Bean
public AgentStateStore stateStore(RedisConnectionFactory factory) {
    return new RedisAgentStateStore(factory);
}
```

状态持久化后：

- 服务重启不丢失对话上下文
- 多实例部署共享会话（任何实例都能接续对话）
- 支持会话快照和回放

## 五、其他高级能力一览

### 5.1 中间件（Middleware）

```java
ReActAgent agent = ReActAgent.builder()
    .middlewares(List.of(
        new LoggingMiddleware(),        // 记录每次工具调用
        new RateLimitingMiddleware(),   // 限制调用频率
        new TimeoutMiddleware(30000)    // 30 秒超时
    ))
    .build();
```

中间件在 Agent 的每一步操作前后执行钩子逻辑，适合做日志、限流、超时控制、审计。

### 5.2 权限控制

```java
agent.setPermissionMode("user-123", "session-abc", PermissionMode.REQUIRE_CONFIRM);
```

设置后，Agent 每次调用工具前都会触发 `REQUIRE_USER_CONFIRM` 事件，必须用户确认才继续执行。

### 5.3 结构化输出

```java
record WeatherResult(String city, String weather, int temperature) {}

WeatherResult result = agent.call("北京天气", WeatherResult.class,
    RuntimeContext.empty()).block().getStructuredOutput();
```

AgentScope 支持让 LLM 返回 JSON 并自动反序列化为 Java Record。

## 六、总结

| 能力 | 作用 | 成熟度 |
|------|------|--------|
| MCP 零代码接入远程工具 | | 基础可用 |
| 工具调用沙箱安全隔离 | | 实验性 |
| Redis 状态存储 | | 可用 |
| 钩子链（日志/限流/超时） | | 可用 |
| 工具调用前的确认机制 | | 可用 |
| JSON → Java Record | | 可用 |

本系列从搭建第一个 Agent 开始，到工具系统、流式事件、多 Agent 协作，最后到 MCP 和沙箱——覆盖了 AgentScope Java 2.0 的核心能力。这些知识足够支撑从原型到生产的大部分场景。
