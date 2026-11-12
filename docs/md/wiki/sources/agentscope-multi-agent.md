---
title: "AgentScope 多 Agent 协作：SubAgent 与 Supervisor 模式"
date: "2026-08-06"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/xIHmzWKE24Fjea0xtuBF8g"
---

# AgentScope 多 Agent 协作：SubAgent 与 Supervisor 模式

> 单个 Agent 能力有限——一次只能做一件事，工具集越复杂越容易乱。AgentScope 的多 Agent 协作方案通过「Agent 即工具」让 Supervisor Agent 把其他 Agent 当作工具来调用，每件事都有专门的 Agent 负责。

## 一、为什么需要多 Agent

### 1.1 单 Agent 的局限

假设有一个「全能助手」Agent，它需要处理天气查询、数学计算、翻译和代码审查。把所有工具都注册到一个 Agent 身上：

```java
Toolkit toolkit = new Toolkit();
toolkit.registerTool(weatherTool);
toolkit.registerTool(calculatorTool);
toolkit.registerTool(translatorTool);
toolkit.registerTool(codeReviewTool);
```

问题：

- **工具描述互相干扰**：LLM 面对 10+ 个工具时容易「选择困难」
- **sysPrompt 过长**：每种任务的规则都塞进一个 sysPrompt，上下文爆炸
- **无法组合**：不能先翻译再审查，因为 Agent 每次只能做一个任务

### 1.2 多 Agent 的分工方案

```
用户："翻译这段代码的注释，然后审查翻译后的代码质量"
    ↓
SupervisorAgent
├── Step1: 调用 TranslatorAgent  → 翻译注释
├── Step2: 调用 CodeReviewAgent  → 审查代码
└── Step3: 汇总结果返回用户
```

每个 Agent 只做一件事，有自己的 sysPrompt 和工具集，Supervisor 负责协调。

## 二、SubAgent：Agent 作为工具

### 2.1 核心概念

AgentScope 的设计哲学之一：**Agent 可以是另一个 Agent 的工具。**

```java
Toolkit toolkit = new Toolkit();
toolkit.registration().subAgent(
    weatherAgent::getAgent,
    SubAgentConfig.builder()
        .toolName("weather_expert")
        .description("天气查询专家。查询各城市天气信息。")
        .build()
).apply();
```

### 2.2 创建 Supervisor Agent

```java
@Component
public class SupervisorAgent {
    private final ReActAgent supervisor;

    public SupervisorAgent(Model model,
                          WeatherExpert weatherExpert,
                          CalculatorExpert calculatorExpert,
                          TranslatorExpert translatorExpert) {
        Toolkit toolkit = new Toolkit();

        toolkit.registration().subAgent(
            weatherExpert::getAgent,
            SubAgentConfig.builder()
                .toolName("weather_expert")
                .description("天气查询专家。当用户询问天气时调用。")
                .build()
        ).apply();

        toolkit.registration().subAgent(
            calculatorExpert::getAgent,
            SubAgentConfig.builder()
                .toolName("calculator_expert")
                .description("数学计算专家。当用户需要计算时调用。")
                .build()
        ).apply();

        toolkit.registration().subAgent(
            translatorExpert::getAgent,
            SubAgentConfig.builder()
                .toolName("translator_expert")
                .description("翻译专家。当用户需要翻译文本时调用。")
                .build()
        ).apply();

        this.supervisor = ReActAgent.builder()
            .name("supervisor")
            .sysPrompt("""
                你是一个超级助手，协调多个专家完成任务：
                - weather_expert：天气查询
                - calculator_expert：数学计算
                - translator_expert：文本翻译

                根据用户问题选择合适的专家。如果问题涉及多个专家
                （如"北京气温和100°F差多少"），按顺序调用需要的专家。
                """)
            .model(model)
            .toolkit(toolkit)
            .build();
    }
}
```

### 2.3 SubAgentConfig 详解

| 字段 | 作用 |
|------|------|
| toolName | Supervisor 的 LLM 看到的工具名 |
| description | 何时调用这个专家的判断依据 |

LLM 不在 SubAgent 之间做复杂推理——它只决定「调哪个专家」，然后把结果汇总。每个专家的推理在自己的 ReAct 循环中完成。

## 三、Supervisor vs Router：两种协作模式

### 3.1 Router 模式（一对一分发）

```
用户 → Supervisor → 选中一个专家 → 返回结果
```

适用场景：用户问题明确属于某个领域（天气、计算、翻译）。

```java
.sysPrompt("""
    根据用户问题选择专家：
    - 天气 → weather_expert
    - 计算 → calculator_expert
    - 翻译 → translator_expert

    选择一个专家，将其返回结果直接呈现给用户。
    """)
```

### 3.2 Supervisor 模式（多步协作）

```
用户 → Supervisor → 专家A → 汇总 → 专家B → 汇总 → 返回综合报告
```

适用场景：用户问题需要多领域协作（先翻译再审查、先查天气再计算）。

```java
.sysPrompt("""
    你是任务协调器，按以下步骤处理用户请求：
    1. 分析问题需要哪些专家
    2. 依次调用所需的专家
    3. 每个专家完成后，汇总其核心发现
    4. 所有步骤完成后，生成综合报告
    """)
```

### 3.3 选择标准

| 维度 | Router | Supervisor |
|------|--------|-----------|
| 调用次数 | 1 次 | N 次 |
| 适用场景 | 单一领域问题 | 跨领域综合问题 |
| 复杂度 | 低 | 中等 |
| 可维护性 | 高（专家细分） | 依赖 Supervisor 的调度质量 |

## 四、Agent 作为工具的设计哲学

### 4.1 与传统微服务的对比

传统架构中，多个微服务由代码编排：

```java
String weather = weatherService.get("北京");
String temp = extractTemp(weather);
String result = calculatorService.calculate(temp + "-100");
return translatorService.translate(result, "en");
```

AgentScope 中的编排方式是：

```java
// Supervisor 的 LLM 自主决定：先调 weather_expert，再调 calculator_expert
```

区别在于：**流程控制从「代码定义」变成了「LLM 理解 sysPrompt 后自主规划」**。

### 4.2 什么时候用 SubAgent，什么时候用 @Tool

| 场景 | 用 @Tool | 用 SubAgent |
|------|----------|------------|
| 确定性操作（查数据库、调 API） | ✅ | ❌ |
| 需要 LLM 推理判断 | ❌ | ✅ |
| 返回结构化数据 | ✅ | ❌ |
| 需要多轮交互（对话式） | ❌ | ✅ |
| 简单的计算/转换 | ✅ | ❌ |
| 复杂的分析/诊断 | ❌ | ✅ |

> **经验法则**：如果「调用 API 就能得到正确答案」，用 @Tool；如果「需要 LLM 自己判断和推理」，用 SubAgent。

## 五、总结

多 Agent 协作的核心模式：

```
每个专家 = 独立的 ReActAgent（有自己的 name + sysPrompt + toolkit）
    ↓
Supervisor = ReActAgent + Toolkit（注册所有专家的 SubAgent）
    ↓
用户 → Supervisor → LLM 根据 sysPrompt 自主选择专家 → 汇总结果
```

关键收益：

- **关注点分离**：每个 Agent 的 sysPrompt 和 toolkit 互不干扰
- **LLM 自主路由**：不需要 Java switch/if-else，不需要枚举和分类器
- **可扩展**：新增一个专家只需加一个 SubAgent 声明，不改 Supervisor 代码
