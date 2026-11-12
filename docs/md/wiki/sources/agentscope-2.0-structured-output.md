---
title: "AgentScope Java 2.0 结构化输出实战：让 Agent 直接返回 Java 对象，告别字符串解析"
author: "一灰灰blog"
date: "2026年7月29日 18:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/92WrOmKjypAi4upDcTXy3g"
---

# AgentScope Java 2.0 结构化输出实战：让 Agent 直接返回 Java 对象，告别字符串解析

```

让 Agent 返回字符串然后自己用正则解析？2026 年了，咱们 Java 开发者不干这种事。5.AgentScope Java 2.0 结构化输出实战：让 Agent 直接返回 Java 对象前几篇文章我们完成了工具系统的学习——Agent 可以调用 @Tool 方法去查天气、算数学、读写文件。但有个问题不知道各位小伙伴注意到没有——工具调用的结果也好，Agent 的直接回答也好，返回的都是字符串。一般来讲，拿到字符串之后，咱们得手动解析：JSON 反序列化、正则提取、try-catch 容错…… 如果 Agent 需要对接后端的业务系统，这种字符串传参简直就是一场灾难。那么问题来了——能不能让 Agent 直接返回一个 Java 对象？ 比如我问 "上海的天气怎么样？"，Agent 直接返回一个 WeatherInfo 实例，而不是一段需要正则解析的文本？AgentScope Java 2.0 的结构化输出（Structured Output）就是干这个的。一、背景及目标1. 没有结构化输出时有多痛苦先看一个反面教材——不用结构化输出时，从 Agent 回答里提取信息的常见姿势：// Agent 返回了一段自然语言String answer = agent.call(List.of(new UserMessage("上海的天气？"))).block();// 然后你得这样解析 —— 感觉有点鬼畜String city = extractFromText(answer, "城市[：:]?(\\w+)");String temp = extractFromText(answer, "温度[：:]?(\\d+)");// 如果模型回答的格式变了，正则直接爆炸作为一个有追求、有理想新四好码农，这种每次都要手写正则解析的骚操作，怎么能忍！2. 结构化输出是什么结构化输出让 Agent 直接生成符合预定义 Schema 的类型化数据，把"自然语言 → 结构化数据"的转换交给框架完成。使用姿势极其简单：// 一步到位，直接拿到 Java 对象Msg msg = agent.call(List.of(new UserMessage("上海的天气？")),        WeatherInfo.class, RuntimeContext.empty()).block();WeatherInfo info = msg.getStructuredData(WeatherInfo.class);System.out.println(info.temperature); // 直接就是 double，不用解析一句话总结：定义好 POJO，告诉 Agent 你想要什么类型，它直接给你返回实例。二、核心使用姿势1. 定义 POJO先定义一个普通 Java 类，必须有无参构造函数：public class WeatherInfo {    public String city;          // 城市名称    public double temperature;   // 当前温度    public String unit;          // 温度单位：Celsius / Fahrenheit    public int humidity;         // 湿度百分比    public String description;   // 天气描述    // 必须提供无参构造函数    public WeatherInfo() {    }}重点关注：字段用 public 修饰，框架内部通过反射直接赋值必须提供无参构造函数，否则反序列化会报错字段名建议使用有意义的英文，框架会把字段名和 description 一起传给 LLM2. 发起结构化调用有了 POJO 之后，调用 agent.call() 的三参数重载：import io.agentscope.core.ReActAgent;import io.agentscope.core.agent.RuntimeContext;import io.agentscope.core.message.Msg;import io.agentscope.core.message.UserMessage;import java.util.List;// 创建 Agent（Toolkit 可省略，这里为演示完整场景）ReActAgent agent = ReActAgent.builder()        .name("weather-assistant")        .sysPrompt("你是一个天气助手，可以根据用户问题返回天气信息。")        .model(model)        .build();// 调用结构化输出 —— 指定目标类型Msg msg = agent.call(        List.of(new UserMessage("上海今天天气怎么样？")),        WeatherInfo.class,        RuntimeContext.empty())        .block();// 直接获取类型化数据WeatherInfo info = msg.getStructuredData(WeatherInfo.class);3. 测试验证输出结果如下：System.out.println("城市: " + info.city);System.out.println("温度: " + info.temperature);System.out.println("单位: " + info.unit);System.out.println("湿度: " + info.humidity + "%");System.out.println("描述: " + info.description);实测结果如下：城市: 上海温度: 26.0单位: Celsius湿度: 65%描述: 多云，微风全程不需要正则、不需要手写 JSON Schema、不需要手动反序列化——Agent 直接返回了一个标准的 Java 对象。就是这么贴心。三、Schema 定义进阶1. 支持的数据类型结构化输出支持以下 Java 类型映射：Java 类型说明String字符串Integer / int整数Double / double浮点数Boolean / boolean布尔值List&lt;T&gt;列表（泛型内可以是任意支持的类型）Map&lt;String, Object&gt;键值对嵌套 POJO任意深度的嵌套对象2. 嵌套对象真实业务中几乎没有单层的平铺数据结构，嵌套才是常态：public class OrderInfo {    public String orderId;    public String customerName;    public List&lt;Product&gt; products;    public Address shippingAddress;    public double totalAmount;    public OrderInfo() {    }}public class Product {    public String name;    public int quantity;    public double price;    public Product() {    }}public class Address {    public String province;    public String city;    public String detail;    public Address() {    }}使用姿势如下：Msg msg = agent.call(        List.of(new UserMessage("查询订单 AS2024001 的详细信息")),        OrderInfo.class,        RuntimeContext.empty())        .block();OrderInfo order = msg.getStructuredData(OrderInfo.class);System.out.println("客户: " + order.customerName);System.out.println("商品数: " + order.products.size());System.out.println("收货地址: " + order.shippingAddress.city);Agent 会自动根据字段名和类型信息推断每个字段的含义，生成完整的嵌套 JSON，框架递归反序列化。注意：嵌套类也必须提供无参构造函数。3. 使用 Jackson 注解如果字段名和业务术语不一致，或者需要自定义序列化行为，可以使用 Jackson 注解：import com.fasterxml.jackson.annotation.JsonProperty;import com.fasterxml.jackson.annotation.JsonIgnore;public class ProductInfo {    @JsonProperty("product_name")  // 自定义 JSON 字段名    public String productName;    @JsonProperty("unit_price")    public double price;    @JsonIgnore  // 忽略该字段，不参与序列化    public String internalCode;    public ProductInfo() {    }}说明：AgentScope 底层使用 Jackson 进行序列化/反序列化，所以 Jackson 家族的注解都可以直接用。四、结构化输出的两种路径AgentScope 内部实现了两条结构化输出路径，了解它们有助于理解不同模型下的行为差异。1. Native 路径——原生 JSON Schema对于支持 response_format + json_schema 的模型（如 OpenAI GPT-4o、GPT-4.1-mini 等），框架可以直接让模型输出符合 JSON Schema 的结果，一步到位：用户: 上海的天气？模型: {"city":"上海","temperature":26.0,"unit":"Celsius",...}       ↑ native json_schema 路径，模型直接输出合规 JSON// 对于原生支持的模型，框架自动走 Native 路径OpenAIChatModel model = OpenAIChatModel.builder()        .apiKey(System.getenv("OPENAI_API_KEY"))        .modelName("gpt-4.1-mini")        .build();2. Fallback 路径——合成工具调用对于不支持 json_schema 的模型（如 DashScope Qwen、DeepSeek、Anthropic Claude 等），框架自动切换到 Fallback 路径——注入一个名为 generate_response 的合成工具，让模型通过工具调用的方式返回结构化数据：用户: 上海的天气？模型: （调用 generate_response 工具，参数为 {"city":"上海",...}）框架: 截获工具调用 → 反序列化为 POJO对于 DashScope 用户请注意：DashScope 的思考模式（enableThinking(true)）下不支持结构化输出，框架会自动切换到 Fallback 路径。3. 自动降级当 Native 路径失败时（比如模型返回 400 错误），框架会自动降级到 Fallback 路径，整个过程对开发者完全透明：// 你不需要关心用的是 Native 还是 Fallback// 框架会自动选择最优路径，失败时自动降级WeatherInfo info = msg.getStructuredData(WeatherInfo.class);4. 显式配置 Native 路径如果确认使用的模型/端点支持 json_schema，可以显式开启 Native 路径：DashScopeChatModel model = DashScopeChatModel.builder()        .apiKey(System.getenv("DASHSCOPE_API_KEY"))        .modelName("qwen-plus")        .nativeStructuredOutput(true)  // 显式开启 native json_schema 路径        .build();各模型提供商默认行为：模型原生支持默认路径OpenAI GPT-4o / GPT-4.1-mini✅ 是NativeOpenAI 兼容（DeepSeek / Kimi）❌ 否FallbackDashScope Qwen❌ 否FallbackAnthropic Claude❌ 否FallbackGemini❌ 否Fallback五、结构化输出与工具调用共存1. 兼容性问题当 Agent 同时注册了工具（Tool）并请求结构化输出时，部分 OpenAI 兼容 API（如 Kimi、DeepSeek）会优先遵循 response_format 约束而跳过工具调用。这就尴尬了——Agent 既要调工具又要出结构化结果，结果冲突了。2. 解决方案设置 nativeStructuredOutputWithTools(false) 可以解决此问题：OpenAIChatModel model = OpenAIChatModel.builder()        .apiKey(System.getenv("OPENAI_API_KEY"))        .baseUrl("https://api.moonshot.cn/v1")        .modelName("moonshot-v1-8k")        .nativeStructuredOutputWithTools(false)  // 解决结构化输出与工具调用的冲突        .build();注意：对于 OpenAI 原生模型（GPT-4o 等）无需设置此参数，它们原生支持结构化输出与工具调用共存。DashScopeChatModel 同样支持此配置。3. 最佳实践如果你在开发中同时使用工具和结构化输出，推荐按以下步骤排查：如果 Agent 能正常调工具但结构化输出返回空 → 尝试 nativeStructuredOutputWithTools(false)如果结构化输出正常但工具不调用了 → 同上如果只用其中一种能力 → 无需关心这个参数六、V1 兼容模式如果你是 AgentScope 1.x 的老用户，可能对 StructuredOutputReminder 有印象。2.0 版本中这个配置依然保留：ReActAgent agent = ReActAgent.builder()        .name("agent")        .model(model)        .structuredOutputReminder(StructuredOutputReminder.TOOL_CHOICE)        .build();模式说明TOOL_CHOICE（默认）强制调用工具，一次 API 调用完成结构化输出PROMPT提示词引导，可能多次调用，兼容更老的模型说明：在 2.0 中推荐直接使用 agent.call(msgs, Class, context) 的三参数重载，框架自动选择最优路径。只有在需要兼容极端老模型时才需要显式配置 structuredOutputReminder。七、错误处理与注意事项1. 空值处理如果 Agent 无法从用户问题中提取某个字段的值，该字段会保留 Java 默认值（null、0、false 等）。建议在获取数据后进行校验：WeatherInfo info = msg.getStructuredData(WeatherInfo.class);if (info.city == null || info.city.isEmpty()) {    // 模型未能提取城市信息，做兜底处理    info.city = "unknown";}if (info.temperature == 0.0 &amp;&amp; "unknown".equals(info.city)) {    // 完全提取失败的情况    throw new RuntimeException("Agent 无法解析天气信息");}2. 无参构造函数这个必须再次强调——所有参与结构化输出的类都必须有无参构造函数，包括嵌套类。这是 Jackson 反序列化的硬性要求，少了就报错。3. 字段命名字段名最好使用有业务含义的英文，避免使用拼音或缩写。框架在生成 JSON Schema 时会把字段名作为 hint 传递给 LLM，好的命名能显著提升提取准确率。八、小结本文从实战角度梳理了 AgentScope Java 2.0 结构化输出的使用姿势，小结一下：agent.call(msgs, Class, context) 三参数重载直接返回类型安全的 Java 对象，告别字符串解析支持基础类型、集合、嵌套 POJO、Map 等丰富的 Schema 定义框架内部自动选择 Native（JSON Schema）或 Fallback（合成工具调用）两条路径，失败时自动降级字段名建议使用有业务含义的英文，所有参与序列化的类必须提供无参构造函数工具调用与结构化输出共存时需注意 nativeStructuredOutputWithTools(false) 配置九、其他0. 项目AgentScope Java 官方文档：https://java.agentscope.io/v2/zh/结构化输出文档：https://java.agentscope.io/v1/zh/docs/task/structured-output.htmlModel 文档（含结构化输出章节）：https://java.agentscope.io/v2/zh/docs/building-blocks/model.htmlGitHub 仓库：https://github.com/liuyueyi/spring-ai-demo/agent-scope1. 下篇预告本文是【AgentScope Java 新手村系列】的第五篇。回顾一下系列进度：✅ 第1篇：简介与环境搭建：从零搭环境，跑通第一个 Agent 对话✅ 第2篇：ReActAgent 核心拆解：理解"思考→行动→观察"的推理循环✅ 第3篇：你的第一个 Java Agent：Builder 模式全面解析 + 流式输出 + 思考模式✅ 第4篇：工具系统（Tools）实战：用 @Tool 注解将 Java 方法注册为 Agent 工具✅ 第5篇：结构化输出实战 —— 让 Agent 直接返回 Java 对象看到这里的小伙伴，结构化输出是不是比你想象中简单得多？三参数重载一行搞定，连 JSON 解析都省了。这一篇完成之后我们的新手教程就算完了，那么进阶的教程又有些啥呢？—— AgentScope2.0中带来的核心亮点 HarnessAgent，理解“文件即配置”的工程化理念。 这些问题我们下一篇再详细展开。尽信书则不如，以上内容，纯属一家之言，因个人能力有限，难免有疏漏和错误之处，如发现 bug 或者有更好的建议，欢迎批评指正，不吝感激。微信公众号: 一灰灰Blog —— 关注获取最新技术文章推送
```




> 让 Agent 返回字符串然后自己用正则解析？2026 年了，咱们 Java 开发者不干这种事。



让 Agent 返回字符串然后自己用正则解析？2026 年了，咱们 Java 开发者不干这种事。



# 5.AgentScope Java 2.0 结构化输出实战：让 Agent 直接返回 Java 对象



前几篇文章我们完成了工具系统的学习——Agent 可以调用 @Tool 方法去查天气、算数学、读写文件。但有个问题不知道各位小伙伴注意到没有——工具调用的结果也好，Agent 的直接回答也好，返回的都是字符串。



一般来讲，拿到字符串之后，咱们得手动解析：JSON 反序列化、正则提取、try-catch 容错…… 如果 Agent 需要对接后端的业务系统，这种字符串传参简直就是一场灾难。



那么问题来了——能不能让 Agent 直接返回一个 Java 对象？ 比如我问 "上海的天气怎么样？"，Agent 直接返回一个 WeatherInfo 实例，而不是一段需要正则解析的文本？



AgentScope Java 2.0 的结构化输出（Structured Output）就是干这个的。



## 一、背景及目标



### 1. 没有结构化输出时有多痛苦



先看一个反面教材——不用结构化输出时，从 Agent 回答里提取信息的常见姿势：



作为一个有追求、有理想新四好码农，这种每次都要手写正则解析的骚操作，怎么能忍！



### 2. 结构化输出是什么



结构化输出让 Agent 直接生成符合预定义 Schema 的类型化数据，把"自然语言 → 结构化数据"的转换交给框架完成。使用姿势极其简单：



一句话总结：定义好 POJO，告诉 Agent 你想要什么类型，它直接给你返回实例。



## 二、核心使用姿势



### 1. 定义 POJO



先定义一个普通 Java 类，必须有无参构造函数：



重点关注：



字段用 public 修饰，框架内部通过反射直接赋值



必须提供无参构造函数，否则反序列化会报错



字段名建议使用有意义的英文，框架会把字段名和 description 一起传给 LLM



### 2. 发起结构化调用



有了 POJO 之后，调用 agent.call() 的三参数重载：



### 3. 测试验证



输出结果如下：



实测结果如下：



全程不需要正则、不需要手写 JSON Schema、不需要手动反序列化——Agent 直接返回了一个标准的 Java 对象。就是这么贴心。



## 三、Schema 定义进阶



### 1. 支持的数据类型



结构化输出支持以下 Java 类型映射：



Java 类型



说明



字符串



/ int



整数



/ double



浮点数



/ boolean



布尔值



列表（泛型内可以是任意支持的类型）



键值对



嵌套 POJO



任意深度的嵌套对象



### 2. 嵌套对象



真实业务中几乎没有单层的平铺数据结构，嵌套才是常态：



使用姿势如下：



Agent 会自动根据字段名和类型信息推断每个字段的含义，生成完整的嵌套 JSON，框架递归反序列化。注意：嵌套类也必须提供无参构造函数。



### 3. 使用 Jackson 注解



如果字段名和业务术语不一致，或者需要自定义序列化行为，可以使用 Jackson 注解：



说明：AgentScope 底层使用 Jackson 进行序列化/反序列化，所以 Jackson 家族的注解都可以直接用。



## 四、结构化输出的两种路径



AgentScope 内部实现了两条结构化输出路径，了解它们有助于理解不同模型下的行为差异。



### 1. Native 路径——原生 JSON Schema



对于支持 response_format + json_schema 的模型（如 OpenAI GPT-4o、GPT-4.1-mini 等），框架可以直接让模型输出符合 JSON Schema 的结果，一步到位：



### 2. Fallback 路径——合成工具调用



对于不支持 json_schema 的模型（如 DashScope Qwen、DeepSeek、Anthropic Claude 等），框架自动切换到 Fallback 路径——注入一个名为 generate_response 的合成工具，让模型通过工具调用的方式返回结构化数据：



对于 DashScope 用户请注意：DashScope 的思考模式（enableThinking(true)）下不支持结构化输出，框架会自动切换到 Fallback 路径。



### 3. 自动降级



当 Native 路径失败时（比如模型返回 400 错误），框架会自动降级到 Fallback 路径，整个过程对开发者完全透明：



### 4. 显式配置 Native 路径



如果确认使用的模型/端点支持 json_schema，可以显式开启 Native 路径：



各模型提供商默认行为：



模型



原生支持



默认路径



OpenAI GPT-4o / GPT-4.1-mini



✅ 是



Native



OpenAI 兼容（DeepSeek / Kimi）



❌ 否



Fallback



DashScope Qwen



❌ 否



Fallback



Anthropic Claude



❌ 否



Fallback



Gemini



❌ 否



Fallback



## 五、结构化输出与工具调用共存



### 1. 兼容性问题



当 Agent 同时注册了工具（Tool）并请求结构化输出时，部分 OpenAI 兼容 API（如 Kimi、DeepSeek）会优先遵循 response_format 约束而跳过工具调用。这就尴尬了——Agent 既要调工具又要出结构化结果，结果冲突了。



### 2. 解决方案



设置 nativeStructuredOutputWithTools(false) 可以解决此问题：



注意：对于 OpenAI 原生模型（GPT-4o 等）无需设置此参数，它们原生支持结构化输出与工具调用共存。DashScopeChatModel 同样支持此配置。



### 3. 最佳实践



如果你在开发中同时使用工具和结构化输出，推荐按以下步骤排查：



如果 Agent 能正常调工具但结构化输出返回空 → 尝试 nativeStructuredOutputWithTools(false)



如果结构化输出正常但工具不调用了 → 同上



如果只用其中一种能力 → 无需关心这个参数



## 六、V1 兼容模式



如果你是 AgentScope 1.x 的老用户，可能对 StructuredOutputReminder 有印象。2.0 版本中这个配置依然保留：



模式



说明



（默认）



强制调用工具，一次 API 调用完成结构化输出



提示词引导，可能多次调用，兼容更老的模型



说明：在 2.0 中推荐直接使用 agent.call(msgs, Class, context) 的三参数重载，框架自动选择最优路径。只有在需要兼容极端老模型时才需要显式配置 structuredOutputReminder。



## 七、错误处理与注意事项



### 1. 空值处理



如果 Agent 无法从用户问题中提取某个字段的值，该字段会保留 Java 默认值（null、0、false 等）。建议在获取数据后进行校验：



### 2. 无参构造函数



这个必须再次强调——所有参与结构化输出的类都必须有无参构造函数，包括嵌套类。这是 Jackson 反序列化的硬性要求，少了就报错。



### 3. 字段命名



字段名最好使用有业务含义的英文，避免使用拼音或缩写。框架在生成 JSON Schema 时会把字段名作为 hint 传递给 LLM，好的命名能显著提升提取准确率。



## 八、小结



本文从实战角度梳理了 AgentScope Java 2.0 结构化输出的使用姿势，小结一下：



agent.call(msgs, Class, context) 三参数重载直接返回类型安全的 Java 对象，告别字符串解析



支持基础类型、集合、嵌套 POJO、Map 等丰富的 Schema 定义



框架内部自动选择 Native（JSON Schema）或 Fallback（合成工具调用）两条路径，失败时自动降级



字段名建议使用有业务含义的英文，所有参与序列化的类必须提供无参构造函数



工具调用与结构化输出共存时需注意 nativeStructuredOutputWithTools(false) 配置



## 九、其他



### 0. 项目



AgentScope Java 官方文档：https://java.agentscope.io/v2/zh/



结构化输出文档：https://java.agentscope.io/v1/zh/docs/task/structured-output.html



Model 文档（含结构化输出章节）：https://java.agentscope.io/v2/zh/docs/building-blocks/model.html



GitHub 仓库：https://github.com/liuyueyi/spring-ai-demo/agent-scope



### 1. 下篇预告



本文是【AgentScope Java 新手村系列】的第五篇。回顾一下系列进度：



✅ 第1篇：简介与环境搭建：从零搭环境，跑通第一个 Agent 对话



✅ 第2篇：ReActAgent 核心拆解：理解"思考→行动→观察"的推理循环



✅ 第3篇：你的第一个 Java Agent：Builder 模式全面解析 + 流式输出 + 思考模式



✅ 第4篇：工具系统（Tools）实战：用 @Tool 注解将 Java 方法注册为 Agent 工具



✅ 第5篇：结构化输出实战 —— 让 Agent 直接返回 Java 对象



看到这里的小伙伴，结构化输出是不是比你想象中简单得多？三参数重载一行搞定，连 JSON 解析都省了。这一篇完成之后我们的新手教程就算完了，那么进阶的教程又有些啥呢？—— AgentScope2.0中带来的核心亮点 HarnessAgent，理解“文件即配置”的工程化理念。 这些问题我们下一篇再详细展开。



尽信书则不如，以上内容，纯属一家之言，因个人能力有限，难免有疏漏和错误之处，如发现 bug 或者有更好的建议，欢迎批评指正，不吝感激。



> 微信公众号: 一灰灰Blog —— 关注获取最新技术文章推送



微信公众号: 一灰灰Blog —— 关注获取最新技术文章推送
