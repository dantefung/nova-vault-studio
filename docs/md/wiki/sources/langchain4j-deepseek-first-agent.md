---
title: "LangChain4j + DeepSeek：Java 开发者构建第一个 Agent 的完整指南"
author: "老梁agent"
date: "2026年6月4日 18:07"
source: "微信公众号"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483724&idx=1&sn=9b0c7ef0b13ede5a7999626e2f290c4d&chksm=f41d6bb1c36ae2a70aa58e27d5e8c99066d641b08d8bd827beb19790cb629c164b559418bed1#rd"
---

# LangChain4j + DeepSeek：Java 开发者构建第一个 Agent 的完整指南

> 不用 Python，不用 LangChain，用你最熟悉的 Spring Boot 和 Java 21，从零构建一个能自动调用工具的 AI Agent。



不用 Python，不用 LangChain，用你最熟悉的 Spring Boot 和 Java 21，从零构建一个能自动调用工具的 AI Agent。



## 为什么是 LangChain4j



提到 AI Agent 开发，Python + LangChain 几乎成了标准答案。但对于 Java 后端开发者来说，这条路有 3 个痛点：



1. 语言切换成本——团队要用两套技术栈，Agent 写 Python，后端写 Java



2. 集成摩擦——Agent 通过 REST/gRPC 调用后端服务，增加延迟和维护负担



3. 生态割裂——Spring Boot 的依赖注入、配置管理、监控在 Python 侧全部重来一遍



LangChain4j 解决了这个问题。它是 LangChain 的 Java 移植，但又不仅仅是移植——它充分利用了 Java 生态的优势：注解驱动的 Tool 声明、Spring Boot 自动配置、强类型的 AiServices 接口。



本文带你从零开始，用 LangChain4j + DeepSeek + Spring Boot 构建一个完整的工业设备诊断 Agent。



## 前置准备



依赖



版本



说明



JDK



21



推荐 Corretto 21



Spring Boot



3.3.0



工业级框架



LangChain4j



0.35.0



Java Agent 框架



DeepSeek API Key



-



注册即送额度



Docker



-



运行 EMQX 消息中间件（可选）



## Step 1：项目骨架



创建一个标准的 Spring Boot 项目，pom.xml 核心依赖：



&lt;parent&gt;    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;    &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;    &lt;version&gt;3.3.0&lt;/version&gt;&lt;/parent&gt;&lt;dependencies&gt;    &lt;dependency&gt;        &lt;groupId&gt;dev.langchain4j&lt;/groupId&gt;        &lt;artifactId&gt;langchain4j&lt;/artifactId&gt;        &lt;version&gt;0.35.0&lt;/version&gt;    &lt;/dependency&gt;    &lt;dependency&gt;        &lt;groupId&gt;dev.langchain4j&lt;/groupId&gt;        &lt;artifactId&gt;langchain4j-open-ai&lt;/artifactId&gt;        &lt;version&gt;0.35.0&lt;/version&gt;    &lt;/dependency&gt;    &lt;dependency&gt;        &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;        &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;    &lt;/dependency&gt;&lt;/dependencies&gt;



两个关键点：



- langchain4j 提供 Agent 核心能力：AiServices、@Tool 注解、ChatMemory



- langchain4j-open-ai 提供 OpenAI 兼容的 LLM 客户端——DeepSeek 的 API 是 OpenAI 格式的，所以直接用这个模块



## Step 2：配置 LLM 连接



application.yml：



langchain4j:  open-ai:    chat-model:      base-url: https://api.deepseek.com      api-key: ${DEEPSEEK_API_KEY:}      model-name: deepseek-chat      temperature: 0.3      max-tokens: 2048      log-requests: true      log-responses: true



几个值得解释的选择：



temperature=0.3 工业诊断场景需要确定性——你不能让 Agent 面对同一个设备告警，一次说"轴承磨损"一次说"可能是电源问题"。0.3 是在推理能力和确定性之间的平衡点。



max-tokens=2048 单次诊断回复加上上下文，2048 足够。多出来的 token 就是多出来的钱。



log-requests: true 这是调试 Agent 最关键的一行配置。打开之后你会在控制台看到完整的请求体（包括发给 LLM 的工具定义 JSON Schema）和响应体（包括 LLM 返回的 tool_calls）。



### 安全存储 API Key



不要直接把 key 写在 application.yml 里。用 application-local.yml（加入 .gitignore）：



langchain4j:  open-ai:    chat-model:      api-key: sk-your-real-key



主配置文件里用 ${DEEPSEEK_API_KEY:} 读环境变量，local 文件覆盖。这样 git push 不会泄露。



### Java 配置类



@Configurationpublic class AgentConfig {    @Value("${langchain4j.open-ai.chat-model.base-url}")    private String baseUrl;    @Value("${langchain4j.open-ai.chat-model.api-key}")    private String apiKey;    @Value("${langchain4j.open-ai.chat-model.model-name}")    private String modelName;    @Value("${langchain4j.open-ai.chat-model.temperature}")    private Double temperature;    @Value("${langchain4j.open-ai.chat-model.max-tokens}")    private Integer maxTokens;    @Value("${langchain4j.open-ai.chat-model.log-requests}")    private Boolean logRequests;    @Value("${langchain4j.open-ai.chat-model.log-responses}")    private Boolean logResponses;    @Bean    public OpenAiChatModel chatModel() {        return OpenAiChatModel.builder()                .baseUrl(baseUrl)                .apiKey(apiKey)                .modelName(modelName)                .temperature(temperature)                .maxTokens(maxTokens)                .logRequests(logRequests)                .logResponses(logResponses)                .timeout(Duration.ofSeconds(60))                .build();    }    @Bean    public ChatMemory chatMemory() {        return MessageWindowChatMemory.withMaxMessages(20);    }}



两个 Bean：



Bean



作用



`OpenAiChatModel`



LLM 客户端，指向 DeepSeek API



`ChatMemory`



对话记忆，保留最近 20 轮消息



> 注意：手动构建 OpenAiChatModel Bean 时，log-requests 和 log-responses 不会自动从 yml 读取。必须显式 @Value 注入后 .logRequests(logRequests) 传给 builder。只写 yml 不写 builder 调用是不生效的——这是本人在排查日志缺失时踩的坑。



：手动构建 OpenAiChatModel Bean 时，log-requests 和 log-responses 不会自动从 yml 读取。必须显式 @Value 注入后 .logRequests(logRequests) 传给 builder。只写 yml 不写 builder 调用是不生效的——这是本人在排查日志缺失时踩的坑。



MessageWindowChatMemory.withMaxMessages(20) 的含义：Agent 会记住最近 20 条消息（用户消息 + AI 回复 + 工具调用结果），超出窗口的自动丢弃。20 是一个经验值——足够覆盖一次完整的诊断对话（"查告警 → 查数据 → 诊断 → 出建议"），又不会让 token 消耗失控。



## Step 3：写第一个 @Tool



Tool 是 Agent 的"手"。LLM 只能思考和生成文本，但有了 Tool，它就能查询数据库、调用 API、操作设备。



LangChain4j 的 Tool 声明极其简洁——在方法上加 @Tool 注解，注解里的字符串就是给 LLM 看的工具描述：



@Componentpublic class DeviceAlarmTool {    @Tool("查询指定设备的当前告警信息。输入设备ID，返回该设备的所有活跃告警。")    public String queryDeviceAlarms(String deviceId) {        // 这里查询 TDEngine / InfluxDB / 告警平台        // 返回 JSON 格式的告警列表    }}



@Tool 描述是 Agent 的大脑提示。 LLM 会根据这个描述，在对话中自动判断"用户这句话需要调用这个工具吗"。你不需要写意图识别、if-else 路由、参数抽取——LLM 自己搞定。



### Tool 设计的核心原则



1. 描述要具体。 不是"查询信息"，而是"查询指定设备的当前告警信息。输入设备ID，返回该设备的所有活跃告警。"LLM 需要足够的上下文来判断什么时候该用这个工具。



2. 入参用简单类型。 String、int、double 是最安全的。LLM 是从自然语言中提取参数值的，简单的参数类型让提取更准确。



3. 返回 JSON 字符串。 LLM 最擅长处理 JSON。返回结构化的 JSON 让它能提取关键字段做下一步推理。



4. 方法名即语义。queryDeviceAlarms 比 getInfo 好 10 倍。LLM 会使用方法名（和 @Tool 描述）来判断工具的用途。



## Step 4：组装 Agent



这是 LangChain4j 最精彩的部分——AiServices.builder()：



@Service@RequiredArgsConstructorpublic class DeviceAgent {    private final OpenAiChatModel chatModel;    private final ChatMemory chatMemory;    private final DeviceAlarmTool alarmTool;    private final DeviceDataTool dataTool;    private final DiagnosisTool diagnosisTool;    public String chat(String userMessage) {        IndustrialAssistant assistant = AiServices.builder(IndustrialAssistant.class)                .chatLanguageModel(chatModel)                .chatMemory(chatMemory)                .tools(alarmTool, dataTool, diagnosisTool)                .build();        return assistant.chat(userMessage);    }    interface IndustrialAssistant {        String chat(String message);    }}



发生了什么？



1. AiServices.builder(IndustrialAssistant.class)：传入一个接口，框架用动态代理自动生成实现类。



2. .tools(alarmTool, dataTool, diagnosisTool)：注册 3 个工具，框架会自动提取 @Tool 注解的描述，转成 OpenAI Function Calling 的 JSON Schema。



3. .build()：生成代理实例。



你调 assistant.chat(userMessage) 时，底层执行流程是：



用户消息    ↓ChatMemory（加载历史对话）    ↓OpenAI Chat API（消息 + 工具定义 JSON Schema）    ↓LLM 判断：需要调用工具吗？    ├── 不需要 → 直接返回回复    └── 需要 → 返回 tool_call {name, arguments}            ↓        框架自动调用对应 Java 方法            ↓        工具结果发回 LLM            ↓        LLM 根据结果生成最终回复



整个过程对开发者透明。 你不需要写一行 JSON 解析、工具路由、结果拼接的逻辑。



## Step 5：暴露 REST API



@RestController@RequestMapping("/api/agent")public class AgentController {    private final DeviceAgent agent;    public AgentController(DeviceAgent agent) {        this.agent = agent;    }    @PostMapping("/chat")    public ResponseEntity&lt;Map&lt;String, String&gt;&gt; chat(@RequestBody ChatRequest request) {        String reply = agent.chat(request.message());        return ResponseEntity.ok(Map.of("reply", reply));    }    public record ChatRequest(String message) {}}



## Step 6：测试



启动应用：



# 先启动 MQTT（可选，Agent 不依赖它也能跑）docker compose up -d# 设置 API Keyexport DEEPSEEK_API_KEY=sk-your-key# 启动./mvnw spring-boot:run



单工具调用——Agent 自动识别意图：



curl -X POST http://localhost:8080/api/agent/chat \  -H "Content-Type: application/json" \  -d '{"message": "CNC-001 现在有什么告警？"}'



LLM 自动判断"用户想查告警" → 调用 queryDeviceAlarms("CNC-001") → 返回结构化结果。



多工具串联——一句话触发三个工具：



curl -X POST http://localhost:8080/api/agent/chat \  -H "Content-Type: application/json" \  -d '{"message": "CNC-001 刚报了振动异常告警，查一下最近数据，帮我诊断。"}'



Agent 的执行链路：



1. LLM 理解意图 → 需要告警 + 数据2. 调用 queryDeviceAlarms("CNC-001")   → 告警信息3. 调用 queryDeviceHistory("CNC-001")  → 遥测数据4. LLM 分析结果 → 振动超标，需要诊断5. 调用 generateDiagnosis("振动异常", "vibration=4.8")6. LLM 整合 → 完整诊断报告



这才是 AI Agent 的本质：不是预设的工作流 DAG，而是 LLM 的动态推理——它自己决定先做什么、后做什么、什么时候信息够了。



## Step 7：调试



Agent 调试最大的痛点是"黑盒"——你调 chat()，得到一个回复，但 LLM 中间调用了哪些工具、传了什么参数、返回了什么结果，全看不见。



### 开启日志



需要两步配合：



1. 开启 LangChain4j 的请求/响应拦截：



# application.ymllangchain4j:  open-ai:    chat-model:      log-requests: true      log-responses: true



并确保 AgentConfig 中显式传给了 builder（见前面 Step 2 的代码）。



2. 开启 openai4j 客户端的 DEBUG 日志：



# application.ymllogging:  level:    dev.ai4j.openai4j: DEBUG



> LangChain4j 底层使用 dev.ai4j.openai4j 这个 HTTP 客户端与 DeepSeek 通信，实际的日志输出是 OkHttp 拦截器发出的，logger 名是 dev.ai4j.openai4j.RequestLoggingInterceptor。如果你只配了 logging.level.dev.langchain4j: DEBUG，是看不到这些日志的——包名不同。



LangChain4j 底层使用 dev.ai4j.openai4j 这个 HTTP 客户端与 DeepSeek 通信，实际的日志输出是 OkHttp 拦截器发出的，logger 名是 dev.ai4j.openai4j.RequestLoggingInterceptor。如果你只配了 logging.level.dev.langchain4j: DEBUG，是看不到这些日志的——包名不同。



### 实际日志输出



启动后会看到类似这样的日志（body 是单行 JSON，非格式化）：



DEBUG dev.ai4j.openai4j.RequestLoggingInterceptor - Request:- method: POST- url: https://api.deepseek.com/v1/chat/completions- headers: [Content-Type: application/json, Authorization: Bearer sk-...xx]- body: {"model":"deepseek-chat","messages":[{"role":"user","content":"CNC-001 有什么告警？"}],"tools":[{"type":"function","function":{"name":"queryDeviceAlarms","description":"查询指定设备的当前告警信息...","parameters":{"type":"object","properties":{"deviceId":{"type":"string"}}}}}],"temperature":0.3,"max_tokens":2048}DEBUG dev.ai4j.openai4j.ResponseLoggingInterceptor - Response:- status code: 200- headers: [Content-Type: application/json, ...]- body: {"id":"chatcmpl-xxx","choices":[{"message":{"tool_calls":[{"function":{"name":"queryDeviceAlarms","arguments":"{\"deviceId\":\"CNC-001\"}"}}]}}]}



一眼能看到：LLM 收到了哪些工具描述、选择了哪个工具、传了什么参数。单行 JSON 不太好看，但调试效率已经提升了 10 倍。如果需要格式化查看，可以把 body 复制到任意 JSON 格式化工具中。



## 常见踩坑



### 1. 401 鉴权失败



DeepSeek API 是 OpenAI 兼容的，但 api-key 不能为空或占位符。确认 DEEPSEEK_API_KEY 环境变量已设置，或 application-local.yml 中有正确值。



### 2. Tool 不被调用



检查 @Tool 注解的 import——必须是 dev.langchain4j.agent.tool.Tool，不是其他包的同名注解。另外，描述不能太笼统，LLM 需要足够的语义信息来判断"什么时候该用这个工具"。



### 3. Memory 丢失



MessageWindowChatMemory 是在 JVM 内存里的，服务重启就丢。如果需要在重启后保持对话记忆，换成持久化的实现（如 Redis 或数据库），或使用 ChatMemoryStore 接口自定义存储。



### 4. 开了 log-requests 但看不到日志



yml 里配了 log-requests: true，也传给了 builder，但控制台一条日志都没有？



根因：实际的日志输出由底层 HTTP 客户端 dev.ai4j.openai4j 的 OkHttp 拦截器产生，而不是 dev.langchain4j 包。日志级别是 DEBUG。



修复：



logging:  level:    dev.ai4j.openai4j: DEBUG



### 5. 每次 chat() 都 new 一个 AiServices



注意代码里每次 chat() 都调了 AiServices.builder().build()，生成一个新代理。这是有意为之——Memory 是单例 Bean（同一个实例被所有请求共享），所以对话历史不会丢。每次 rebuild 的开销极小（只是动态代理创建），可以接受。如果要极致性能，可以把 IndustrialAssistant 也做成 Bean，只在构造时 build 一次。



## 下一步



这篇指南覆盖了一个可运行的 Agent 从零到一的全部步骤。但这只是一个起点——模拟数据、单 Agent、无 RAG、无评估。



接下来的文章会逐步深入：



- Agent 工具设计的 5 个原则——如何写出好的 @Tool



- 排查 Function Calling 的 4 个常见坑——工具没被调用？参数不对？



- ChatMemory 三种策略对比——什么时候用哪种



代码仓库：github.com/LaoLiang-agent/industrial-agent-long
