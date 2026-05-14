# LightRAG（轻量级图增强RAG）

> 香港大学黄超团队（EMNLP 2025）推出的图结构增强RAG系统，通过双层检索和增量更新算法解决传统GraphRAG的高计算开销问题。

## Key Points

- 双层检索：低层级（实体节点）和高层级（社区摘要）协同
- 增量更新：无需重新生成整个知识图谱，显著降低计算开销
- 34K+ GitHub星标，性能在多个基准测试中超越GraphRAG、NaiveRAG等

## Details

### 核心创新

1. **图结构增强的实体和关系提取**：利用LLM从文档中提取实体和关系，构建知识图谱
2. **双层检索系统**：
   - Low-Level：检索实体节点和相邻关系
   - High-Level：检索社区汇总，获取全局信息
3. **增量更新算法**：新文档仅需处理新增的实体和关系，与原图合并即可

### 性能对比

| 领域 | NaiveRAG | LightRAG |
|------|----------|----------|
| Agriculture | 32.4% | 67.6% |
| CS | 38.8% | 61.2% |
| Legal | 16.4% | 83.6% |
| Mix | 38.8% | 61.2% |

### 技术栈

- 支持多种存储后端：JSON文件、PostgreSQL、MongoDB、Neo4j
- 支持多种LLM：OpenAI、Anthropic、Ollama等
- Reranker支持：显著提升混合查询性能

## Context

2024年发布，是当前最活跃的开源GraphRAG项目之一，适合需要图增强但担心计算成本的场景。

## Related Pages

- [[concepts/graph-rag]]
- [[concepts/rag]]
- [[products/minirag]]
- [[products/rag-anything]]

## Sources

- [[智能客服专栏] RAG建设方案横纵分析报告](./17-rag-building-scheme-analysis.md)
- LightRAG GitHub: https://github.com/HKUDS/LightRAG