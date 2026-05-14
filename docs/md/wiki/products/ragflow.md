# RAGFlow

> 由Infiniflow开发的开源RAG引擎，强调"质量进，质量出"，通过深度文档理解确保数据入口质量。

## Core Capabilities

- **深度文档理解**：支持复杂格式（扫描件、表格、公式）的精细解析
- **混合检索**：融合向量、关键词、知识图谱多种检索方式
- **可视化工作流**：Agent Canvas，支持拖拽式编排
- **Infinity集成**：原生支持自研的Infinity向量数据库

## Technical Highlights

- 五层微服务架构：客户端层、API网关层、服务层、Worker层、存储层
- 语义分块（Semantic Chunking）：避免简易文本切分破坏文档布局信息
- 支持Elasticsearch/Infinity/OceanBase/OpenSearch作为文档存储
- 2.5万+ GitHub星标

## Use Cases

- 处理复杂文档的智能客服（如法律、金融、医疗）
- 企业级知识库
- 需要高精度的文档问答场景

## Related Pages

- [[concepts/rag]]
- [[products/qanything]]

## Sources

- [[智能客服专栏] RAG建设方案横纵分析报告](./17-rag-building-scheme-analysis.md)
- RAGFlow GitHub: https://github.com/infiniflow/ragflow