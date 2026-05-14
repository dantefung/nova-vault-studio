# GraphRAG（图增强RAG）

> 将知识图谱与RAG深度融合，通过从非结构化文档中提取实体和关系，构建结构化知识图谱索引的技术方案。

## Key Points

- 解决传统向量检索无法理解"关系"的问题
- 支持Local（局部精准）和Global（全局推理）两种检索模式
- 微软研究院2024年发布，随后LightRAG等开源项目跟进

## Details

### 核心原理

用户提问 → 在图谱中定位关键实体 → 通过关系路径找到相关边 → 扩展到相关社区获取全局上下文 → 将图谱检索结果+文档片段一起送入LLM生成

### 腾讯优图异构图谱方案

创新点：
- 三种节点类型：实体/关系节点、属性节点、社区节点
- 构图成本比微软GraphRAG低50%+
- 回答准确率比微软GraphRAG(Global)提升200%+
- 图谱Schema感知Query理解，支持复杂多跳推理

### 技术演进

1. **微软GraphRAG（2024.2）**：开创性方案，但全量重建成本高
2. **LightRAG（2024.10）**：香港大学黄超团队，双层检索+增量更新
3. **CID-GraphRAG（2025）**：意图驱动图检索，双路径检索融合

## Context

是RAG技术从"找得到"到"理解关系"的关键升级，适用于需要跨文档推理的复杂场景。

## Related Pages

- [[concepts/rag]]
- [[concepts/light-rag]]
- [[patterns/rag-implementation]]

## Sources

- [[智能客服专栏] RAG实现详解v2](./08-rag-implementation-v2.md)
- [[智能客服专栏] 知识图谱构建方案v2](./09-knowledge-graph-v2.md)
- [[智能客服专栏] RAG建设方案横纵分析报告](./17-rag-building-scheme-analysis.md)