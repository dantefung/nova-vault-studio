# LlamaIndex

> 以"索引和检索"为核心优化的RAG专用框架，原名GPT Index，专注于为RAG场景提供极致效果。

## Core Capabilities

- **Indexes**：多种索引类型（VectorStoreIndex、SummaryIndex、TreeIndex、KeywordTableIndex、PropertyGraphIndex）
- **Query Engines**：查询引擎，支持自然语言查询和复杂检索策略
- **Data Connectors**：数据连接器，支持PDF、数据库、API等多种数据源
- **Router模块**：自动选择最优检索策略
- **LlamaCloud**：托管服务

## Technical Highlights

- 检索优化：提供多种高级索引策略
- 数据处理能力：强大的文档解析和节点解析功能
- 性能优化：检索速度比原生LangChain快约40%
- 支持20+向量存储（Pinecone、Qdrant、Chroma、Milvus、Weaviate等）

## Use Cases

- 专注RAG效果的智能客服
- 企业级知识库
- 文档问答系统

## Related Pages

- [[concepts/rag]]
- [[products/langchain]]
- [[patterns/rag-implementation]]

## Sources

- [[智能客服专栏] RAG实现详解](./02-rag-implementation.md)
- [[智能客服专栏] RAG实现详解v2](./08-rag-implementation-v2.md)
- [[智能客服专栏] RAG建设方案横纵分析报告](./17-rag-building-scheme-analysis.md)