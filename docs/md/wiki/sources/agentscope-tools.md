---
title: "AgentScope 工具系统：@Tool、@ToolParam 与 Toolkit"
date: "2026-08-04"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/7oNscscR2LUUFPkVTajQVg"
---

# AgentScope 工具系统：@Tool、@ToolParam 与 Toolkit

> 没有工具的 Agent 只是一个聊天机器人。装上工具后，Agent 才能真正「做事情」——查数据库、调 API、写文件。AgentScope 的工具系统通过 @Tool 注解 + Toolkit 注册，让 LLM 自主决定何时调用哪个工具。

## 一、为什么 Agent 需要工具

LLM 本身是一个「思考引擎」，它不能：

- 查询实时数据（数据库、API）
- 执行系统操作（创建文件、发送消息）
- 获取外部信息（今天的天气、最新新闻）

工具填补了这个空白。AgentScope 的 ReAct 循环中，「Action」步骤就是调用工具：

```
用户："深圳今天天气怎么样？"
    ↓
Thought: 需要调用天气 API 查询深圳天气
Action: 调用 getWeather("深圳")       ← 工具调用
    ↓
Observation: {"city":"深圳","weather":"晴","temp":28}
    ↓
Thought: 工具返回了数据，整理成回答
Final Answer: "深圳今天晴天，28°C"
```

## 二、用 @Tool 注解定义工具

### 2.1 基本用法

```java
@Component
public class WeatherTool {

    @Tool(name = "getWeather",
          description = "查询指定城市当天的天气。输入城市名，返回天气JSON。")
    public String getWeather(
            @ToolParam(name = "city", description = "城市名，如北京、上海、深圳")
            String city) {
        return """
            {"city": "%s", "weather": "晴", "temperature": 28,
             "humidity": 65, "wind": "东北风3级"}
            """.formatted(city);
    }
}
```

### 2.2 @Tool 注解的两个字段

| 字段 | 必填 | 作用 |
|------|------|------|
| name | ✅ | 工具名，LLM 通过这个名字决定调用哪个工具 |
| description | ✅ | 工具描述，LLM 据此判断何时调用 |

name 和 description 会进入 LLM 的 function calling schema。description 写得越清晰，LLM 就越能准确决定何时调用这个工具。

### 2.3 @ToolParam：参数描述

```java
@ToolParam(name = "city", description = "城市名，如北京、上海、深圳")
String city
```

每个工具参数需要声明 name 和 description。LLM 会根据 description 理解参数的含义并填充正确的值。

### 2.4 工具方法规范

- 返回类型必须是 **String**：AgentScope 的 function calling 只支持 String 返回
- 参数类型：基本类型（String、int、double 等），复杂对象需要序列化
- 访问修饰符：**public**
- 不能是 **static**：AgentScope 需要反射调用实例方法

## 三、Toolkit：工具注册

```java
@Component
public class WeatherAgent {
    private final ReActAgent agent;

    public WeatherAgent(Model model, WeatherTool weatherTool) {
        Toolkit toolkit = new Toolkit();
        toolkit.registerTool(weatherTool);

        this.agent = ReActAgent.builder()
            .name("weather-agent")
            .sysPrompt("""
                你是一个天气预报助手。使用 getWeather 工具查询城市天气。
                如果用户没有指定城市，主动询问。
                回复时包含温度和天气状况，给出穿衣建议。
                """)
            .model(model)
            .toolkit(toolkit)
            .build();
    }
}
```

### 3.1 工具调用流程

1. LLM 分析用户消息 → 决定调用 getWeather
2. LLM 生成 function call → `{"name":"getWeather","arguments":{"city":"北京"}}`
3. AgentScope 框架接收 function call → 通过反射调用 `getWeather("北京")`
4. 工具方法执行 → 返回 String
5. AgentScope 将返回的 String 包装为 ToolResult → 发给 LLM
6. LLM 根据 ToolResult 继续推理...（可能继续调工具，也可能给出最终答案）

框架作为「中间人」，让 LLM 和工具代码解耦。

### 3.2 工具调用权限控制

```java
agent.setPermissionMode("user-123", "session-abc", PermissionMode.REQUIRE_CONFIRM);
```

五种权限模式：

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| DEFAULT | 工具直接执行，不询问 | 只读工具、内部查询 |
| ACCEPT_EDITS | 允许 LLM 编辑已有内容 | 文档编辑、代码修改 |
| EXPLORE | 允许浏览但不能修改 | 文件系统浏览 |
| REQUIRE_CONFIRM | 每次工具调用前弹出确认 | 写操作、发送消息、删除数据 |
| DENY | 完全禁止工具调用 | 纯问答模式 |

设置 REQUIRE_CONFIRM 后，Agent 每次调用工具前都会触发 REQUIRE_USER_CONFIRM 事件。前端可以据此弹出确认对话框，用户批准后工具才真正执行。

这层权限控制和沙箱隔离互补——沙箱限制工具执行的环境，权限控制限制工具是否能被调用。

## 四、工具设计原则

### 4.1 description 决定用法

```java
// ❌ 不好的描述
@Tool(name = "f", description = "一个函数")
public String f(String x) { ... }

// ✅ 好的描述
@Tool(name = "getWeather",
      description = "查询指定城市当天的天气信息。输入城市名（如北京），返回温度、天气状况、湿度。当用户询问天气时使用此工具。")
public String getWeather(@ToolParam(name = "city",
    description = "城市名称，如北京、上海、深圳") String city) { ... }
```

LLM 基于 description 做调用决策，描述不清晰会导致「该调用时不调用」或「不该调用时乱调用」。

### 4.2 工具粒度：一个工具做一件事

```
✅ getWeather(city)       — 查询天气
✅ getForecast(city, days) — 查询多日预报
❌ handleWeatherRequest(city) — 根据天气做事（粒度太粗，LLM 难以理解）
```

### 4.3 返回结构化数据

工具方法返回 JSON 格式的 String（不要返回自然语言），让 LLM 能准确提取字段：

```
✅ {"city":"北京","weather":"晴","temp":28}
❌ "北京今天是晴天，温度28度，湿度65%"
```

## 五、总结

| 步骤 | 操作 |
|------|------|
| 1. 定义工具 | 创建类 + `@Tool(name, description)` + `@ToolParam(name, description)` |
| 2. 注册工具 | `Toolkit().registerTool(bean)` |
| 3. 绑定 Agent | `ReActAgent.builder().toolkit(toolkit).build()` |
| 4. 描述决策 | LLM 根据 description 判断何时调用，根据 name 指定工具 |

工具系统是 AgentScope 从「聊天机器人」升级为「能自主完成任务的工作代理」的关键一步。
