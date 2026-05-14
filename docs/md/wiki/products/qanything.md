# QAnything

> 网易有道团队开发的开源RAG引擎，以"两阶段检索"为核心架构特色，强调Embedding + Rerank的组合优化。

## Core Capabilities

- **两阶段检索**：Embedding粗召回 + Rerank精排
- **BCEmbedding**：自研的双语跨语种Embedding模型，MTEB和LlamaIndex RAG评测SOTA
- **中文优化**：针对中英双语和跨语种场景优化
- **一键部署**：Docker Compose一键启动

## Technical Highlights

- 后端：Python + Sanic高性能异步Web框架
- 向量数据库：Milvus
- BCEmbedding模型：bce-embedding-base_v1 + bce-reranker-base_v1

## Use Cases

- 中文场景下的快速部署
- 中英双语、跨语种文档问答
- 需要快速验证PMF的智能客服原型

## Related Pages

- [[concepts/rag]]
- [[products/ragflow]]

## Sources

- [[智能客服专栏] RAG建设方案横纵分析报告](./17-rag-building-scheme-analysis.md)
- QAnything GitHub: https://github.com/netease-youdao/qanything