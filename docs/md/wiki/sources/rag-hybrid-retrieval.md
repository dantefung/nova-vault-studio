---
title: "从单一向量到多路召回：RAG 混合检索的工程实践"
author: "老梁agent"
date: "2026年7月27日 08:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/aIx_hPV1Teftup7E_pLoVg"
---

# 从单一向量到多路召回：RAG 混合检索的工程实践

> MVP 的 RAG 只有一行 embeddingStore.search(topK=3)。生产级 RAG 是七步管线：查询改写 → 稠密检索 → 稀疏检索 → RRF 融合 → LLM 重排序 → 租户过滤 → 返回结果。每一步都在解决一个具体问题。



MVP 的 RAG 只有一行 embeddingStore.search(topK=3)。生产级 RAG 是七步管线：查询改写 → 稠密检索 → 稀疏检索 → RRF 融合 → LLM 重排序 → 租户过滤 → 返回结果。每一步都在解决一个具体问题。



## 一、MVP 的 RAG 有什么问题？



MVP 版本的 KnowledgeBaseTool.searchKnowledgeBase() 总共 20 行：



```

public String searchKnowledgeBase(String query) {    Embedding queryEmbedding = embeddingModel.embed(query).content();    EmbeddingSearchResult&lt;TextSegment&gt; result = embeddingStore.search(            EmbeddingSearchRequest.builder()                    .queryEmbedding(queryEmbedding)                    .maxResults(3)                    .minScore(0.5)                    .build()    );    // ... JSON 格式化返回}
```




能跑，但只能跑在 Demo 里。四个硬伤：



问题



现象



后果



向量相似度兜底，关键词匹配靠运气



"轴承温度"和"主轴温升"在向量空间里很近，在现实中可能是两码事



所有数据一个 Collection，搜索不过滤 tenant_id



A 工厂的维修手册被 B 工厂搜到——合规事故



用户问"CNC-001 最近老报警，咋回事"，直接当检索 query



口语化、多义词、缩写，向量模型一脸懵



写死在代码里



想调召回宽度？改代码，重新部署



根本矛盾：检索质量的提升空间全部被架构限制锁死了。 不是没有更好的算法——BM25、RRF、Rerank 这些早有成熟实现，甚至在项目的 rag/advanced/ 目录下已经写好了，只是从未接入主链路。



## 二、七步管线：从查询到结果的完整路径



改造后的 searchKnowledgeBase() 不再是一行 search，而是七步的编排：



每一步都可以独立开关、可配置、可降级。接下来逐层拆解。



## 三、QueryRewrite：不是"搜索用户的问题"，而是"搜索答案的模样"



直接用口语化 query 做向量检索，效果很差。"设备老是报警"的向量和维修手册里"告警触发条件与处理流程"的向量，余弦相似度不会高。但后者的内容才是用户需要的。



HyDE（Hypothetical Document Embeddings）的核心思想：让 LLM 先"猜"一个答案，再用这个猜测的向量去检索。



// QueryRewriter.java — HyDE 策略public String hydeRewrite(String query) {    String prompt = """            你是一名工业设备专家。根据以下问题，写一段简短的假设性回答（2-3句话），            就像在阅读维修手册一样。使用专业技术术语。            问题：%s            假设性回答：""".formatted(query);    return chatModel.chat(prompt);  // 生成的"假答案"作为检索 query}



LLM 生成的假设答案会和真实文档共享词汇分布，向量检索的命中率大幅提升。



三种策略可配置：



rag:  rewrite-strategy: HYDE   # HYDE | MULTI_QUERY | NONE



- HYDE（默认）：生成假设答案，效果好，成本 1 次 LLM 调用



- MULTI_QUERY：从 3 个角度生成查询，召回更广但成本更高



- NONE：直接使用原始 query，零额外成本



如果 LLM 调用失败（超时、限流），自动降级为原始 query，不阻塞主链路。



## 四、双路召回：稠密 + 稀疏



### 4.1 稠密检索（Dense）：向量语义匹配



```

Embedding queryEmbedding = embeddingModel.embed(searchQuery).content();EmbeddingSearchResult&lt;TextSegment&gt; result = embeddingStore.search(        EmbeddingSearchRequest.builder()                .queryEmbedding(queryEmbedding)                .maxResults(10)     // 不再是 3，留给后续步骤裁剪                .minScore(0.3)      // 放低门槛，扩大召回                .filter(tenantFilter) // 租户过滤                .build());
```




两个关键变化：



- maxResults 从 3 提升到 10——不再是最终结果，而是候选池



- minScore 从 0.5 降到 0.3——放宽初筛门槛，后面的 Rerank 会精排



### 4.2 稀疏检索（Sparse）：BM25 关键词匹配



稠密检索擅长语义，但对精确术语匹配无能为力。"轴承型号 6205" 在向量空间里和 "6205 轴承" 很近，但和 "6205-2RS" 可能差很远——术语差一个字符就是两个世界。



BM25 天然适合术语匹配：



```

// Bm25Retriever.java — in-memory inverted indexpublic List&lt;ScoredDoc&gt; search(String query, int topK) {    String[] queryTerms = tokenize(query);    // IDF × TF × (K1+1) / (TF + K1×(1-B+B×len/avgLen))    for (String term : queryTerms) {        Map&lt;Integer, Double&gt; postings = invertedIndex.getOrDefault(term, Map.of());        double idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));        for (var entry : postings.entrySet()) {            scores.merge(entry.getKey(), idf * tfScore(entry.getValue(), len), Double::sum);        }    }    // ... sort by score desc, return topK}
```




```

BM25 索引在服务启动时自动构建，每次文档写入后自动重建。35 篇维修知识库，索引构建 &lt;1ms。
```




### 4.3 RRF 融合：让两路结果互相补位



稠密检索返回的 top 10 和 BM25 返回的 top 10 可能有 70% 不重叠。RRF（Reciprocal Rank Fusion）用排名融合替代分数融合——不关心向量相似度和 BM25 分数的绝对值，只关心"它在各自列表里排第几"。



```

// RrfFusion.javapublic List&lt;String&gt; fuse(List&lt;EmbeddingMatch&lt;TextSegment&gt;&gt; dense,                         List&lt;ScoredDoc&gt; sparse, int topK) {    Map&lt;String, Double&gt; scores = new LinkedHashMap&lt;&gt;();    // RRF 公式: score(d) = Σ 1/(K + rank)    for (int i = 0; i &lt; dense.size(); i++)        scores.merge(dense.get(i).embedded().text(), 1.0 / (60 + i + 1), Double::sum);    for (int i = 0; i &lt; sparse.size(); i++)        scores.merge(sparse.get(i).text(), 1.0 / (60 + i + 1), Double::sum);    return scores.entrySet().stream()            .sorted(Map.Entry.&lt;String, Double&gt;comparingByValue().reversed())            .limit(topK).map(Map.Entry::getKey).toList();}
```




K=60 是经典参数：平滑了排名差异，又保留了靠前结果的优势。双路都在前 3 的文档，融合后几乎必然排第一。



## 五、LLM Reranker：用模型做精排，不用加 GPU



业界常规做法是用 BGE-Reranker 这样的 Cross-Encoder 模型做精排，但它需要 GPU 推理服务——对于一个工业 Agent 项目来说太重了。



替代方案：用已有的 DeepSeek LLM 做相关性打分。 把 top 5 候选文档和原始 query 一起发给 LLM，让它给每个文档打 0-10 分。



```

// LlmReranker.javapublic List&lt;String&gt; rerank(String query, List&lt;String&gt; candidates, int topK) {    // 把 N 个候选打包成一个 LLM 请求    String prompt = """            Rate the relevance of each document to the query on 0-10.            Query: %s            [0] doc text...            [1] doc text...            Return ONLY a JSON array of scores, e.g. [8,3,6].""".formatted(query);    String scoresJson = chatModel.chat(prompt);    // 解析分数，按分数降序排列，返回 topK}
```




一次 LLM 调用完成所有候选打分，成本低。失败时降级为按 RRF 排名取前 N，不影响可用性。



通过配置可以关闭：



rag:  rerank:    enabled: false   # 关闭后直接取 RRF top 3



## 六、ThreadLocal 上下文传递：工具方法里怎么拿到租户 ID？



searchKnowledgeBase 是用 @Tool 注解的方法——它的签名由 LangChain4j 的函数调用协议决定，不能加参数。那租户 ID 怎么传进去？



标准解法：ThreadLocal。



```

// RagContextHolder.javapublic class RagContextHolder {    private static final ThreadLocal&lt;String&gt; tenantIdHolder = new ThreadLocal&lt;&gt;();    public static void set(String tenantId, String userId) { ... }    public static String getTenantId() { return tenantIdHolder.get(); }    public static void clear() { tenantIdHolder.remove(); }}
```




在 Agent 入口处设置：



```

// DeviceAgent.javapublic String chat(RuntimeContext ctx, String userMessage) {    RagContextHolder.set(ctx.getTenantId(), ctx.getUserId());    try {        return runtime.execute(ctx, () -&gt; {            String reply = buildAssistant(ctx).chat(promptCompiler.compileTask(userMessage));            // ... LLM 内部调用 @Tool → searchKnowledgeBase → RagContextHolder.getTenantId()            return reply;        });    } finally {        RagContextHolder.clear();    }}
```




整个调用链——DeviceAgent → AiServices → LLM function calling → searchKnowledgeBase——全程同一个线程，ThreadLocal 自然可达。finally 块里的 clear() 保证不泄漏。



为什么不直接给 searchKnowledgeBase 加参数？ 因为 LangChain4j 会根据 @Tool 方法签名生成 function calling schema 发给 LLM。加了 RuntimeContext 参数，LLM 就会看到它，尝试传值——但 LLM 根本不知道该传什么。ThreadLocal 是唯一对 LLM 透明的上下文传递方式。



## 七、元数据驱动：不只在 Milvus 里存文本



MVP 版本写入 Milvus 时只存了一个 metadata {"id": "0"}——连哪家工厂的文档都不知道。生产级需要三个维度的元数据：



// DocumentIngestionService.javaDocument doc = Document.from(entry,    Metadata.metadata("id", String.valueOf(i))        .put("tenant_id", "tenant-A")        // 租户隔离        .put("effective_time", String.valueOf(now))   // 生效时间        .put("expire_time", String.valueOf(now + 365天)) // 过期时间);



在搜索时通过 LangChain4j 的 MetadataFilterBuilder 做过滤：



Filter tenantFilter = MetadataFilterBuilder        .metadataKey("tenant_id").isEqualTo(RagContextHolder.getTenantId());



LangChain4j 的 MilvusMetadataFilterMapper 会自动把这个 Filter 对象翻译成 Milvus 表达式：



metadata["tenant_id"] == "tenant-A"



不需要改 Milvus Collection Schema。 JSON 元数据字段已经是 Milvus 内置支持的，MetadataFilterBuilder 做的事只是生成正确的过滤表达式。零迁移成本。



## 八、怎么度量"变好了"？



RagEvaluator 新增了 NDCG（Normalized Discounted Cumulative Gain）指标：



```

// 二元相关性：命中=1，未命中=0double sum = 0;for (QueryResult r : results) {    if (hit &amp;&amp; rank &gt; 0 &amp;&amp; rank &lt;= k) {        sum += 1.0 / (Math.log(rank + 1) / Math.log(2)); // DCG@k    }}double ndcg = sum / (results.size() * idealDcg);  // NDCG@10
```




指标



含义



为什么加



Hit Rate



top-K 里有没有命中



基础召回能力



MRR



第一个命中的排名的倒数



排序质量



考虑命中位置和相关性等级的累积增益



综合排序质量



NDCG 比 Hit Rate 更敏感——同样是命中，排第 1 和排第 10 的 NDCG 贡献差一个对数级。这个差异在 Hit Rate 里完全看不出来。



## 九、可降级、可配置、可观测



整条管线的每一步都设计为可独立关闭——不是"全有或全无"：



步骤



关闭方式



影响



QueryRewrite



用原始 query，零额外 LLM 成本



Rerank



直接取 RRF 融合后的 top 3



租户过滤



RagContextHolder 为 null 时不加 filter



兼容无租户场景



每一步失败都有降级策略：



- HyDE LLM 调用失败 → 降级为原始 query



- Rerank 解析失败 → 降级为按 RRF 排名取 top 3



- BM25 索引重建失败 → 用上次的索引，不阻塞写入



> RAG 不是"把文档塞进向量库然后 search"。它是一条检索管线，每一步都在填补向量模型做不到的事情——关键词匹配、租户隔离、语义改写、相关度精排。少一步，召回率就差一截。



项目地址：https://github.com/LaoLiang-agent/industrial-agent-long
