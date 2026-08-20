---
title: "Agent 记忆的四层存储模型：从 20 条滑窗到长期可演进记忆"
author: "老梁agent"
date: "2026年7月14日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/UsPCiZDzfX_Yp3RR3CmFzg"
---

# Agent 记忆的四层存储模型：从 20 条滑窗到长期可演进记忆

> 大多数 Agent 的「记忆」只有一行代码：MessageWindowChatMemory.withMaxMessages(20)。它能跑，但它记不住昨天的事，记不住用户是谁，还会在长对话里悄悄把最关键的一句话挤出窗口。生产级的记忆，得分层。

大多数 Agent 的「记忆」只有一行代码：MessageWindowChatMemory.withMaxMessages(20)。它能跑，但它记不住昨天的事，记不住用户是谁，还会在长对话里悄悄把最关键的一句话挤出窗口。生产级的记忆，得分层。

## 一、先看 MVP 的记忆：一行代码的三宗罪

MVP 阶段，我们的 Agent 记忆就是 LangChain4j 的默认滑动窗口：

@BeanChatMemory chatMemory() {    return MessageWindowChatMemory.withMaxMessages(20);}

一个 Deque，塞满 20 条就把最老的挤出去。它在 Demo 里工作得很好，但生产环境里它有三宗罪：

1. 会遗忘关键信息：用户第 1 轮说「我是 CNC-001 的运维工程师张三」，聊到第 25 轮时，这句话早被挤出窗口了。模型开始把张三当陌生人。

2. 成本线性膨胀：20 条全量原文每轮都塞进 Prompt。对话越长，重复输入的 token 越多，钱烧得越快，而且没有任何压缩。

3. 进程一挂全丢：记忆在 JVM 堆内存里，重启即清零。用户下次来，Agent 完全不记得上次聊了什么。

根子上，滑动窗口把「记忆」简化成了「最近 N 条原文」。但真实的记忆是分层的——有几秒钟就忘的草稿纸，有几分钟的短期记忆，有沉淀下来的经验总结，还有一辈子记得的身份认知。生产级 Agent 得把这四层都实现出来。

## 二、四层记忆模型概览

对照人类记忆，我们把 Agent 记忆拆成四层，每层用不同的存储、不同的生命周期、不同的读写路径：

层级

名称

存储

生命周期

写入路径

类比

Working Memory

Redis (String)

TTL 10 分钟

同步

草稿纸

Conversation Memory

Redis Stream

最近 5 轮，滚动淘汰

同步

短期记忆

Summary Memory

PostgreSQL

永久

经验总结

Profile Memory

PostgreSQL

永久 + 置信度门槛

长期身份认知

关键的架构原则只有一句话：

读：合并 L4 画像 + L3 摘要 + L2 近况  →  一个上下文块写：主链路只同步写 L1/L2；L3/L4 全部甩到主链路之外

用户等的是回复，不是等写数据库、等小模型生成摘要。所以 L3、L4 绝不能阻塞主链路。下面逐层看代码。

## 三、L1 Working Memory：会自动过期的草稿纸

L1 存的是「任务中间态」——当前目标、部分结果、待执行的工具调用。它是易失的：任务做完或超时就该消失。用 Redis 的 TTL 天然实现自过期：

```java
@Componentpublic class WorkingMemory {    private final StringRedisTemplate redis;    private final ObjectMapper mapper;    private final Duration ttl;   // 来自配置：600s    private String key(String sessionId, String taskId) {        return "wm:" + sessionId + ":" + taskId;    }    /** 覆盖写任务状态，并刷新 TTL */    public void put(String sessionId, String taskId, Map&lt;String, Object&gt; state) {        redis.opsForValue().set(key(sessionId, taskId),                mapper.writeValueAsString(state), ttl);    }    public Map&lt;String, Object&gt; get(String sessionId, String taskId) {        String json = redis.opsForValue().get(key(sessionId, taskId));        return json == null ? Map.of() : mapper.readValue(json, Map.class);    }}

```
设计要点：key 带上 taskId，TTL 由配置控制。一个被用户中途放弃的任务（「查一下 CNC-001…算了」），10 分钟后自己蒸发，不留垃圾。不需要写任何清理逻辑，Redis 做了。

## 四、L2 Conversation Memory：一个有上限的 Redis Stream

L2 是「最近几轮原始对话」，用于即时上下文。这里我们没有用 List 手动裁剪，而是用 Redis Stream + MAXLEN，让淘汰交给 Redis：

```java
@Componentpublic class ConversationMemory {    private final StringRedisTemplate redis;    private final int maxEntries;   // 来自配置：5    public void append(String sessionId, String role, String content) {        Map&lt;String, String&gt; fields = new LinkedHashMap&lt;&gt;();        fields.put("role", role);        fields.put("content", content);        fields.put("timestamp", String.valueOf(System.currentTimeMillis()));        MapRecord&lt;String, String, String&gt; record =                StreamRecords.mapBacked(fields).withStreamKey(key(sessionId));        redis.opsForStream().add(record);        redis.opsForStream().trim(key(sessionId), maxEntries);  // ← 保持定长    }    public List&lt;ConversationTurn&gt; recent(String sessionId) {        List&lt;MapRecord&lt;String, Object, Object&gt;&gt; records =                redis.opsForStream().range(key(sessionId), Range.unbounded());        // 按时间序还原为 ConversationTurn 列表        ...    }}

```
为什么是 Stream 而不是 List？定长裁剪不是理由——List 的 LTRIM 同样原子。真正的三个理由是：

1. 结构化多字段存储。Stream 每条记录天然是一个 field-value map，一条对话就是 {role, content, timestamp} 三个字段并存。换成 List 只能存一个字符串，要么自己拼 JSON 再解析，要么定分隔符——Stream 省掉了这层手动序列化。

2. 自带单调递增 ID + 原生时间序。每条记录有 &lt;毫秒&gt;-&lt;序号&gt; 的唯一 ID，天然按时间有序，还能用 XRANGE 按时间窗口查（如「最近 10 分钟的对话」），而不只是「最近 N 条」；List 只有位置下标，做不到按时间范围检索。

3. 支持 Consumer Group，为异步 SideCar 埋伏笔。后续计划中的异步 SideCar（日志/审计/摘要/画像全走异步）就基于 Redis Stream：同一条 conv:{session}，主链路读最近几轮，SideCar 用 XREADGROUP 消费对话事件去驱动 L3 摘要生成。List 没有消费组语义，做不了「一份数据、多方消费、各自记录消费位点」。

滚出窗口的老对话不是消失了——它们的信息已经被 L3 摘要沉淀了下来（下一节）。

注意这里所有操作都包在 try-catch 里、失败只 warn 不抛：记忆层挂了，不能把用户的正常对话也带崩。 这是贯穿四层的一条底线。

## 五、L3 Summary Memory：异步小模型摘要，主链路零阻塞

这是四层里最有价值、也最容易做错的一层。滑动窗口丢掉的信息，靠 L3 来沉淀——每轮结束后，调一个小模型把对话压缩成结构化 JSON 存进 PostgreSQL：

```java
@Componentpublic class SummaryMemory {    // 结构化摘要的四个字段，而不是一段自由文本    @Async    public void generateAndStore(String sessionId, int turnNumber,                                 List&lt;ConversationTurn&gt; turns) {        try {            String transcript = turns.stream()                    .map(t -&gt; t.role() + ": " + t.content())                    .collect(Collectors.joining("\n"));            String prompt = """                    你是对话摘要器。请把下面的多轮对话压缩为结构化 JSON，仅输出 JSON。                    字段：user_goal（用户目标）、confirmed_facts（已确认事实）、                    pending_actions（待办动作）、constraints（约束/限制）。                    对话：                    %s                    """.formatted(transcript);            String raw = chatModel.chat(prompt);            JsonNode node = mapper.readTree(extractJson(raw));            store(new ConversationSummary(sessionId, turnNumber,                    node.path("user_goal").asText(""),                    node.path("confirmed_facts").asText(""),                    node.path("pending_actions").asText(""),                    node.path("constraints").asText("")));        } catch (Exception e) {            // 摘要失败绝不能影响用户请求，吞掉只记日志            log.warn("[L3] summary generation failed: {}", e.getMessage());        }    }}

```
两个关键设计：

1. @Async：这个方法挂在 Spring 的异步线程池上（需要 @EnableAsync）。主链路把回复吐给用户后就返回了，摘要生成在后台慢慢跑，用户完全无感。

2. 结构化而非自由文本。摘要不是「他们聊了 CNC-001 的振动问题」这种一段话，而是拆成 {user_goal, confirmed_facts, pending_actions, constraints} 四个字段。因为下一轮要把它注回 Prompt，结构化的字段模型读起来更准，也方便直接查库看「这个会话的待办动作是什么」。

存储表结构很直白，按 session_id + turn_number 建索引，读的时候只取最新一条：

CREATE TABLE conversation_summaries (    id BIGSERIAL PRIMARY KEY,    session_id VARCHAR(128), turn_number INT,    user_goal TEXT, confirmed_facts TEXT,    pending_actions TEXT, constraints TEXT,    created_at TIMESTAMP DEFAULT now());

## 六、L4 Profile Memory：带置信度门槛的长期画像

L4 是最长命的一层——用户和设备的长期事实：「张三负责 CNC-001」「该用户偏好中文回复」。这类记忆一旦写错，会持续污染后续所有对话。所以 L4 的核心不是怎么写，而是什么才配写进来：

@Componentpublic class ProfileMemory {    private final double threshold;   // 来自配置：0.9    public boolean write(ProfileEntry e) {        // 置信度门槛：低于阈值直接拒绝        if (e.confidence() &lt; threshold) {            log.info("[L4] rejected {}={} (confidence {} &lt; {})",                    e.attribute(), e.value(), e.confidence(), threshold);            return false;        }        jdbc.update("""                INSERT INTO profiles                    (subject_type, subject_id, attribute, value, confidence, source_evidence)                VALUES (?, ?, ?, ?, ?, ?)                ON CONFLICT (subject_type, subject_id, attribute)                DO UPDATE SET value = EXCLUDED.value,                              confidence = EXCLUDED.confidence,                              source_evidence = EXCLUDED.source_evidence,                              updated_at = now()                """, ...);        return true;    }}

三道防污染的闸门：

- 置信度门槛（&gt;0.9）：只有用户明确声明（置信度 1.0）或系统高置信度推断才写入。「用户可能喜欢顺丰」这种猜测（置信度 0.7）直接被拒。

- source_evidence（来源证据）：每条画像都记下「为什么这么认为」，出问题时可追溯。

- UNIQUE + UPSERT：(subject_type, subject_id, attribute) 唯一约束，同一属性只保留最新值，靠 ON CONFLICT 去重更新，不会堆积一堆矛盾的旧记录。

## 七、MemoryManager：读时合并，写时分离

四层各司其职，MemoryManager 负责把它们编排成两条清晰的路径。

读路径——把 L4 + L3 + L2 合并成一个上下文块，供 Prompt 注入：

```java
public String buildContextBlock(RuntimeContext ctx) {    StringBuilder sb = new StringBuilder();    // L4：用户画像    List&lt;ProfileEntry&gt; facts = profile.forSubject("user", ctx.getUserId());    if (!facts.isEmpty()) {        sb.append("【用户画像】\n");        facts.forEach(e -&gt; sb.append("- ").append(e.attribute())                             .append(": ").append(e.value()).append('\n'));    }    // L3：历史摘要（结构化四字段）    summary.latest(ctx.getSessionId()).ifPresent(s -&gt; {        sb.append("【历史摘要】\n");        if (!s.userGoal().isBlank()) sb.append("- 用户目标: ").append(s.userGoal()).append('\n');        // ... confirmedFacts / pendingActions / constraints    });    // L2：最近对话原文    conversation.recent(ctx.getSessionId()).forEach(t -&gt;            sb.append(t.role()).append(": ").append(t.content()).append('\n'));    return sb.toString();}

```
写路径——主链路只同步写 L2，L3 甩给异步：

public void recordTurn(RuntimeContext ctx, String userMessage, String assistantReply) {    String sessionId = ctx.getSessionId();    conversation.append(sessionId, "user", userMessage);        // L2 同步    conversation.append(sessionId, "assistant", assistantReply); // L2 同步    int nextTurn = summary.latest(sessionId).map(s -&gt; s.turnNumber() + 1).orElse(1);    summary.generateAndStore(sessionId, nextTurn,               // L3 异步，不阻塞            conversation.recent(sessionId));}

接到 DeviceAgent 里，就是在调模型前把上下文块拼进去、调完后记一轮：

public String chat(RuntimeContext ctx, String userMessage) {    String contextBlock = memory.buildContextBlock(ctx);    String augmented = contextBlock.isBlank() ? userMessage            : "已知上下文（供参考，勿复述）：\n" + contextBlock + "\n---\n用户问题：" + userMessage;    String reply = buildAssistant().chat(augmented);    memory.recordTurn(ctx, userMessage, reply);   // 写路径    return reply;}

## 八、端到端验证：它真的记住了吗

启动 Redis + PostgreSQL，跑一段两轮对话：

- 第 1 轮：用户说「我负责 CNC-001」→ 回复正常，L2 落 2 条，L3 异步生成摘要。

- 第 2 轮：用户问「我负责哪台设备？」→ Agent 正确答出 CNC-001。

滑动窗口做不到的跨轮召回，四层记忆做到了。查一下记忆快照：

L2 (Redis Stream)：4 条对话原文，定长滚动L3 (PostgreSQL)：{user_goal:"查询负责设备状态", confirmed_facts:"用户负责 CNC-001", ...}L4 (置信度门槛)：写 confidence=0.7 → rejected；写 confidence=0.95 → 落库成功

L4 的门槛测试尤其关键——同一条画像，置信度 0.7 被拒、0.95 被写入并持久化。防污染闸门按预期工作。

## 九、这一层的边界：做了什么，没做什么

能力

状态

L1 Working（Redis TTL 自过期）

✅

L2 Conversation（Redis Stream 定长）

✅

L3 Summary（PG + 异步小模型结构化摘要）

✅

L4 Profile（PG + 置信度门槛 + 来源证据）

✅

读合并 / 写分离编排

✅

L4 画像的自动抽取（当前靠 API 手动写入）

⏳ 后续

摘要生成走消息队列（当前 @Async 线程池）

⏳ 调度并发

记忆注入正式并入 Prompt 六层编译

⏳ Prompt 层

现在 L4 画像还需要显式调 /memory/profile 写入；让模型自动从对话里抽取「谁负责哪台设备」并带置信度落库，是下一步的事。而把 @Async 换成真正的消息队列 SideCar，会在「调度并发」那一篇里做。

## 十、一句话总结

> 把记忆从「最近 20 条原文」升级为「草稿纸 + 短期 + 经验 + 身份」四层存储——不是让 Agent 记得更多，而是让它记得对的、忘得起、且永不因为记忆拖慢一次回复。

把记忆从「最近 20 条原文」升级为「草稿纸 + 短期 + 经验 + 身份」四层存储——不是让 Agent 记得更多，而是让它记得对的、忘得起、且永不因为记忆拖慢一次回复。

项目地址：github.com/LaoLiang-agent/industrial-agent-long

下一篇预告：「告别硬编码 System Prompt：Prompt 六层编译引擎设计与实现」
