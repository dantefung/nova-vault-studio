# RAG（检索增强生成）

> 将外部知识检索与大语言模型生成能力结合的技术架构，解决纯参数化模型在知识时效性、事实准确性方面的固有缺陷。

## Key Points

- 核心流程：问题向量化 → 向量数据库检索 → 融合生成 → 返回答案
- 解决大模型"幻觉"问题，确保回答有文档依据
- 已成为企业构建智能应用的核心基础设施

## Details

### 技术演进

1. **传统RAG（2023）**：向量检索 + BM25，简单Chunk，局限在于跨文档推理差
2. **高级RAG（2024）**：Query重写、多路召回、Reranker精排、上下文压缩
3. **GraphRAG（2024）**：知识图谱作为结构化索引，实体-关系-社区三层检索
4. **Agentic RAG（2025）**：Agent自主决定检索策略，多知识库动态查询

### 核心组件

- **Embedding模型**：将文本转换为高维向量
- **向量数据库**：存储和检索向量（Milvus、Chroma、FAISS）
- **Chunk策略**：文本分块大小直接影响检索效果
- **检索策略**：多路召回（向量+BM25+知识图谱）+ Cross-Encoder精排
- **生成控制**：Prompt约束、参数调优、安全过滤

### 常见失败模式

1. **提示词注入**：恶意指令绕过系统限制
2. **上下文搜索失效**：多轮对话中代词指代不明
3. **跨文档推理失败**：复杂问题召回率不足60%
4. **窗口溢出**：对话历史超出Token限制

## Context

出现在智能客服专栏多篇文章中，是构建智能客服的核心技术底座。

## Related Pages

- [[concepts/graph-rag]]
- [[concepts/knowledge-graph]]
- [[products/langchain]]
- [[products/llamaindex]]
- [[patterns/rag-implementation]]
- [[patterns/intelligent-customer-service]]

## Sources

- [[智能客服专栏] RAG实现详解](./02-rag-implementation.md)
- [[智能客服专栏] RAG实现详解v2](./08-rag-implementation-v2.md)
- [[智能客服专栏] RAG建设方案横纵分析报告](./17-rag-building-scheme-analysis.md)