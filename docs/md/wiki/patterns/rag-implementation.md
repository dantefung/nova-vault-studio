---
title: "RAG检索增强实现"
---

# RAG 检索增强实现

> 从原理到最佳实践的完整 RAG 实现指南，涵盖文本分块、Embedding 模型、向量数据库、检索策略、生成控制等核心环节。

## Problem Context

需要构建基于知识库的智能问答系统，让 AI 回答有文档依据，避免“幻觉”。

## Solution

### 核心流程

1. **文本分块（Chunking）**
   - 递归文本分割器：按段落、句子、字符层次结构分割
   - 推荐参数：Chunk Size 1000-2000 字符，Overlap 100-300 字符
   - 进阶：BERTopic 主题聚类，语义完整度更高

2. **Embedding 模型**
   - Qwen3 Embedding：多语言检索表现优异
   - 存储和检索必须使用同一模型

3. **向量数据库**
   - 轻量：FAISS、Redis + RediSearch
   - 生产：Milvus、Chroma

4. **检索策略**
   - 多路召回：向量检索 + BM25 + 知识图谱
   - Cross-Encoder 精排：准确率提升 15%+

5. **生成控制**
   - Prompt 约束：禁止编造信息
   - 参数调优：Temperature 0.3-0.5
   - 安全过滤：内容审核、事实核查

## Trade-offs

- 分块策略影响检索效果，需实验调优
- 多路召回增加系统复杂度
- Reranker 增加延迟和成本

## Related Pages

- [[concepts/rag]]
- [[products/llamaindex]]
- [[patterns/intelligent-customer-service]]

## Sources

- [[智能客服专栏] RAG 实现详解](../../guide/ai/intelligent-customer-service/02-rag-implementation.md)
- [[智能客服专栏] RAG 实现详解 v2](../../guide/ai/intelligent-customer-service/08-rag-implementation-v2.md)