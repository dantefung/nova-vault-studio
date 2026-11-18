---
title: "LlamaIndex 检索框架"
---

# LlamaIndex

> 以“索引和检索”为核心优化的 RAG 专用框架，原名 GPT Index，专注于为 RAG 场景提供极致效果。

## Core Capabilities

- **Indexes**：多种索引类型（VectorStoreIndex、SummaryIndex、TreeIndex、KeywordTableIndex、PropertyGraphIndex）
- **Query Engines**：查询引擎，支持自然语言查询和复杂检索策略
- **Data Connectors**：数据连接器，支持 PDF、数据库、API 等多种数据源
- **Router 模块**：自动选择最优检索策略
- **LlamaCloud**：托管服务

## Technical Highlights

- 检索优化：提供多种高级索引策略
- 数据处理能力：强大的文档解析和节点解析功能
- 性能优化：检索速度比原生 LangChain 快约 40%
- 支持 20+向量存储（Pinecone、Qdrant、Chroma、Milvus、Weaviate 等）

## Use Cases

- 专注 RAG 效果的智能客服
- 企业级知识库
- 文档问答系统

## Related Pages

- [[concepts/rag]]
- [[products/langchain]]
- [[patterns/rag-implementation]]

## Sources

- [[智能客服专栏] RAG 实现详解](../../guide/ai/intelligent-customer-service/02-rag-implementation.md)
- [[智能客服专栏] RAG 实现详解 v2](../../guide/ai/intelligent-customer-service/08-rag-implementation-v2.md)
- [[智能客服专栏] RAG 建设方案横纵分析报告](../../guide/ai/intelligent-customer-service/17-rag-building-scheme-analysis.md)