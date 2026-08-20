---
title: "告别硬编码 System Prompt：Prompt 六层编译引擎设计与实现"
author: "老梁agent"
date: "2026年7月17日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/gAL6IULULWm8wB1O-WecNg"
---

# 告别硬编码 System Prompt：Prompt 六层编译引擎设计与实现

> MVP 的 System Prompt 是一块铁板：写死一段文字，永远不变。生产级的 System Prompt 是一套编译管线：六层独立组装，每一层都可替换、可热更、可观测。



MVP 的 System Prompt 是一块铁板：写死一段文字，永远不变。生产级的 System Prompt 是一套编译管线：六层独立组装，每一层都可替换、可热更、可观测。



## 一、一个 @SystemMessage 能有多大问题？



MVP 时期，Agent 的 System Prompt 长这样：



// DeviceAgent.java — MVP 版本interface IndustrialAssistant {    @SystemMessage("""        你是一个工业设备运维专家。        你可以使用以下工具：queryDeviceAlarms, queryDeviceHistory, generateDiagnosis, createWorkOrder        请先查数据，再诊断，最后决定是否创建工单。        """)    String chat(String message);}



看起来没问题——直到遇到这些情况：



1. 安全规则变了，需要加"禁止承诺赔付金额"——得改代码，重新部署。



2. 工具从 4 个变成 9 个，需要手动更新 System Prompt 里的工具列表——模型知道的工具永远和代码不同步。



3. 用户上次说了"3 号注塑机最近振动异常"，这句话应该作为上下文注入进去——但 @SystemMessage 是静态的，只能在 user message 里手动拼接，越拼越乱。



4. 想限制"写操作工具最多 1 次"——写在注释里？模型不一定会看。写在 System Prompt 里？过两天工具变了又忘了更新。



根本问题：System Prompt 是一个编译产物，不是一段文字。 MVP 的做法是把编译好的二进制硬编码在了源码里——任何输入变化都要重新"编译"（手动改字符串）。



## 二、六层编译模型：每一层只做一件事



把 System Prompt 拆成六层，每一层有独立的数据来源和编译逻辑：



关键设计决策：L1–L5 编译成系统消息，L6 编译成用户消息。 分离的原因很简单——系统消息是"稳定的运行环境"，用户消息是"每次都在变化的任务"。把它们混在一起，模型很难区分"规则"和"问题"。



对应到代码，PromptCompiler 只有两个公开方法：



// prompt/PromptCompiler.javapublic String compileSystem(RuntimeContext ctx) { ... }  // L1–L5 → system messagepublic String compileTask(String userMessage) { ... }    // L6 → user message



下面逐层看实现。



## 三、L1 角色定义：从硬编码到配置驱动



L1 最简单，但最容易被忽视。角色描述影响模型的全域行为——语气、知识边界、决策倾向。它的特点是不随请求变化，所以天然适合配置文件：



# application.ymlagent:  prompt:    role: "工业设备运维专家，服务于智能工厂的设备监控与故障诊断"



// prompt/PromptCompiler.java — L1 部分sb.append("【角色】\n").append(properties.getRole()).append("\n")  .append("你的知识有限，无法访问实时设备数据；"         + "涉及设备状态、告警、历史数据、故障原因时必须调用工具查询，"         + "不得凭猜测回答。\n\n");



注意第二句话——"知识有限、必须调用工具"——这不是角色描述的一部分，而是行为约束。它紧跟在角色后面，因为它是所有层级的"基调"：在我后面列出任何策略和工具之前，先把核心规则钉死。



## 四、L2 安全策略：规则可动态加载



L2 的 Policy 不是代码，是配置——所以可以热更。



```java

// prompt/PolicyRegistry.java@Componentpublic class PolicyRegistry {    private final AgentPromptProperties properties;    private final List&lt;String&gt; policies = new CopyOnWriteArrayList&lt;&gt;();    public PolicyRegistry(AgentPromptProperties properties) {        this.properties = properties;        reload();    }    public List&lt;String&gt; policies() {        return List.copyOf(policies);    }    /** 从配置文件重新加载策略——不需要重启应用。 */    public void reload() {        policies.clear();        policies.addAll(properties.getPolicies());    }}
```




当前配置了四条策略：



agent.prompt.policies:  - "禁止承诺赔付金额、退款金额等财务决策"  - "READ 类工具单轮最多调用 3 次，WRITE 类工具最多调用 1 次"  - "不确定时必须如实说明，不得编造数据"  - "创建工单前必须确认是硬件故障"



编译到 System Prompt 后变成：



【安全策略】(必须严格遵守) - 禁止承诺赔付金额、退款金额等财务决策 - READ 类工具单轮最多调用 3 次，WRITE 类工具最多调用 1 次 - 不确定时必须如实说明，不得编造数据 - 创建工单前必须确认是硬件故障



这里有一个设计细节：L2 策略是对模型的"软约束"，不是代码层的"硬拦截"。 代码层的硬拦截由 ToolExecutor 负责（工具被调用时强行计数、超限拒绝）。L2 文本的作用是让模型在发出 tool call 之前就已经知道边界，从而减少无效调用。双层防护：Prompt 层做前置引导，代码层做后置兜底。



## 五、L3 工具契约：从 ToolRegistry 自动生成



这是最有价值的一层。MVP 时期，System Prompt 里手工写工具列表——加一个工具要改两处（Java 注解 + Prompt 字符串），删一个工具经常忘了删 Prompt 里的描述。



L3 从 ToolRegistry 自动生成，零维护成本：



// prompt/ToolContractGenerator.javapublic String generate() {    StringBuilder sb = new StringBuilder();    for (ToolMeta m : registry.allTools()) {        sb.append("- ").append(m.name())          .append("（").append(m.sideEffect() == SideEffect.WRITE ? "写操作" : "读操作")          .append("，单轮最多 ").append(m.maxCallsPerRequest()).append(" 次");        if (m.requiresApproval()) {            sb.append("，需人工审批");        }        sb.append("）\n");    }    return sb.toString();}



ToolRegistry 里注册了 9 个工具：



// tool/ToolRegistry.java@PostConstructvoid init() {    register("queryDeviceAlarms",     SideEffect.READ,  3, false, 5000);    register("queryDeviceHistory",    SideEffect.READ,  3, false, 5000);    register("queryRealtimeData",     SideEffect.READ,  3, false, 5000);    register("searchKnowledgeBase",   SideEffect.READ,  3, false, 5000);    register("generateDiagnosis",     SideEffect.READ,  3, false, 5000);    register("createWorkOrder",       SideEffect.WRITE, 1, true,  10000);  // ← 需人工审批    register("startWorkOrder",        SideEffect.WRITE, 1, false, 10000);    register("completeWorkOrder",     SideEffect.WRITE, 1, false, 10000);    register("getWorkOrder",          SideEffect.READ,  3, false, 5000);}



编译后变成：



【可用工具与调用约束】 - queryDeviceAlarms（读操作，单轮最多 3 次） - queryDeviceHistory（读操作，单轮最多 3 次） - searchKnowledgeBase（读操作，单轮最多 3 次） - generateDiagnosis（读操作，单轮最多 3 次） - createWorkOrder（写操作，单轮最多 1 次，需人工审批） - startWorkOrder（写操作，单轮最多 1 次） - completeWorkOrder（写操作，单轮最多 1 次） - getWorkOrder（读操作，单轮最多 3 次）



注意 L3 只传递"治理信封"（读写分类、次数限制、审批标记），不传递参数级 JSON Schema。 参数 Schema 由 LangChain4j 从 @Tool 注解自动提取，放在 function calling payload 里——那是另一条通道。L3 的职责是让模型在决定调用哪个工具之前，就知道这个工具的属性和边界。



## 六、L4 记忆上下文：MemoryManager 接入



这是六层编译管线和四层记忆模型的交汇点。上一篇文章详细讲了四层记忆的存储，这里聚焦编译侧——记忆如何被"读回来"并注入到 Prompt 中。



// L4 Memory Context — PromptCompiler.compileSystem() 中的调用String memoryBlock = memory.buildContextBlock(ctx);if (!memoryBlock.isBlank()) {    sb.append("【已知上下文】(供参考，勿复述)\n").append(memoryBlock).append('\n');}



MemoryManager.buildContextBlock(ctx) 合并 L4 + L3 + L2 的记忆，生成一个紧凑的文本块：



【已知上下文】(供参考，勿复述)[用户画像] 负责3号注塑机产线；偏好中文术语[近期摘要] 用户目标：排查3号注塑机振动异常；已确认事实：模具温度偏低；待处理：等待振动传感器波形分析[最近对话] 用户：3号注塑机最近振动很大 → Agent：需要查看温度数据...



"供参考，勿复述"——这六个字是经过验证才加上的关键指令。早期版本不加这句话，模型会把记忆内容逐条复读一遍，浪费 Token 还让用户困惑。加上后，模型只在使用到相关记忆时才间接引用。



## 七、L5 知识库检索：RAG 的钩子



L5 目前是一个空槽位：



```

// L5 Knowledge Context (RAG) — hook, empty until RAGif (knowledge != null &amp;&amp; !knowledge.isBlank()) {    sb.append("【知识库检索】\n").append(knowledge).append('\n');}
```




compileSystem(ctx) 默认传空字符串，所以 L5 区块不会出现在编译产物中。当 RAG 层接入后，调用 compileSystem(ctx, ragResults) 即可注入混合检索结果。六层编译的灵活性正在于此：加一层不影响其他五层。



## 八、L6 任务指令：ReAct 工作流 + 输出格式



L6 是唯一每次请求都不同的层——它包含用户的实际问题。但它不只是拼一个用户消息，而是附带了一整套思考路径指令：



// prompt/PromptCompiler.java — compileTask()public String compileTask(String userMessage) {    return """            思考路径（ReAct），每步先思考再行动：            1. 数据采集：先用 queryDeviceAlarms 和 queryDeviceHistory 获取实时数据            2. 知识检索：如有异常，用 searchKnowledgeBase 检索相关维修知识和历史案例            3. 诊断分析：用 generateDiagnosis 分析根因            4. 工单决策：确认是硬件故障需要人工介入时，用 createWorkOrder 创建工单；               设备正常无告警则不要创建            5. 最终输出：按「设备状态 → 异常发现 → 诊断结论 → 维修建议 → 工单信息」结构呈现            回复规范：            - 用结构化方式呈现结果（表格优先于纯文本）            - 涉及安全风险时明确标注优先级（HIGH/MEDIUM/LOW）            - 不确定时如实说明，不要编造数据            ---            用户问题：%s""".formatted(userMessage);}



L6 做了三件事：



1. 工作流编排：告诉模型先做什么、后做什么——相当于源代码里的"调用顺序注释"



2. 输出格式约束：指定输出结构、表格优先、风险标注——这决定了用户看到的结果是否可读



3. 用户问题：把真实问题放在最后——前面的全部是指令，最后才是数据



为什么工作流要写在 L6 而不是 L1？因为角色定义是稳定的，而工作流可能随场景变化。同一个 Agent，查设备状态和批量巡检的工作流不同——L6 是跟用户消息一起变的，天然适合放这里。



## 九、接入 DeviceAgent：删除 @SystemMessage



有了 PromptCompiler，DeviceAgent 的改造非常简洁。核心变化只有两处：



改造前：



```

// DeviceAgent.java — MVP 版本interface IndustrialAssistant {    @SystemMessage("你是一个工业设备运维专家...")  // ← 硬编码    String chat(String message);}public String chat(RuntimeContext ctx, String userMessage) {    return runtime.execute(ctx, () -&gt; {        String reply = buildAssistant(ctx).chat(userMessage);        ...    });}
```




改造后：



```

// DeviceAgent.java — 生产版本interface IndustrialAssistant {    // @SystemMessage 已删除——由 systemMessageProvider 动态提供    String chat(String message);}private IndustrialAssistant buildAssistant(RuntimeContext ctx) {    return AiServices.builder(IndustrialAssistant.class)            .chatModel(chatModel)            .chatMemory(chatMemory)            .systemMessageProvider(id -&gt; promptCompiler.compileSystem(ctx))  // ← 动态编译            .tools(...)            .build();}public String chat(RuntimeContext ctx, String userMessage) {    return runtime.execute(ctx, () -&gt; {        String reply = buildAssistant(ctx)                .chat(promptCompiler.compileTask(userMessage));  // ← L6 包装用户消息        ...    });}
```




systemMessageProvider 是 LangChain4j 的扩展点——它接受一个 Function，每次调用时动态生成系统消息。这里的 id 参数是 chatMemoryId，我们不需要它，直接用 ctx 编译即可。



两个入口——chat() 和 diagnose()——都完成了迁移：



- chat() 使用 buildAssistant(ctx) + compileTask(userMessage)



```

- diagnose() 内部重新构建 Assistant，同样使用 systemMessageProvider(id -&gt; promptCompiler.compileSystem(ctx))
```




## 十、热更：改 Policy 不需要重新部署



Policy 从配置文件读取，配合 Spring 的 @ConfigurationProperties，修改 application.yml 后只需调用 PolicyRegistry.reload() 即可生效。通过一个管理端点暴露这个能力：



```java

// 伪代码——未来可加的 admin endpoint@PostMapping("/admin/policy/reload")public Map&lt;String, Object&gt; reloadPolicies() {    policyRegistry.reload();    return Map.of("policies", policyRegistry.policies());}
```




新增一个安全策略？改一行 YAML，调一次 reload，无需重启、无需重新编译。



## 十一、验证：在日志里直接看到六层产物



application.yml 中开启 langchain4j.open-ai.chat-model.log-requests: true，每次发往 DeepSeek 的完整 System Message 都会打印在日志中。可以直接确认六层结构是否完整。



curl -X POST http://localhost:8080/api/agent/chat \  -H 'Content-Type: application/json' \  -d '{"sessionId":"test-1","message":"3号注塑机现在什么状态？"}'



日志中应看到：



【角色】工业设备运维专家...你的知识有限，无法访问实时设备数据...【安全策略】(必须严格遵守)- 禁止承诺赔付金额...- READ 类工具单轮最多调用 3 次...【可用工具与调用约束】- queryDeviceAlarms（读操作，单轮最多 3 次）...【已知上下文】(供参考，勿复述)...



## 十二、能力与边界



已实现



待实现



L1 Role 配置驱动



L5 RAG 检索结果注入



L2 Policy 热更



Policy admin endpoint（需要时再加）



L3 Tool Contract 自动生成



工具参数级 JSON Schema 渲染（LangChain4j 已处理）



L4 Memory Context 注入



—



L6 ReAct 工作流包装



多工作流模板（不同场景不同 L6）



chat() + diagnose() 双入口迁移



Router/Supervisor Agent 迁移



> Prompt 的六层不是"把一段文字拆成六段"——每一层有独立的数据源、独立的编译逻辑、独立的热更策略。加一层不碰其他层，改 Policy 不需要改代码，换 RAG 引擎不影响 L1–L4。



项目地址：github.com/LaoLiang-agent/industrial-agent-long



下一篇预告：「Agent 的预算管理器：给 LLM 推理装上熔断器和限流器」
