---
title: "从单一向量到多路召回：RAG 混合检索的工程实践"
date: "2026-07-27"
source: "微信公众号：老梁agent"
---

# 从单一向量到多路召回：RAG 混合检索的工程实践

> 生产实战笔记系列第 11 篇。MVP 的 RAG 只有一行 `embeddingStore.search(topK=3)`，生产级 RAG 是七步管线，每一步都在解决一个具体问题。

---

## MVP 的四个硬伤

| 问题 | 现象 | 后果 |
|------|------|------|
| 单一向量 | 语义匹配靠运气，"轴承温度"和"主轴温升"分不清 | 召回不准 |
| 多租户不过滤 | 所有数据一个 Collection，不过滤 tenant_id | A 工厂数据被 B 工厂搜到 |
| 查询不改写 | "CNC-001 最近老报警，咋回事"直接当检索 query | 口语化/多义词召回失败 |
| 参数写死 | topK/minScore 写死在代码里 | 改配置需重新部署 |

## 七步管线

1. **QueryRewrite** — 不是搜索用户的问题，而是搜索答案的模样
2. **Dense 检索** — 向量语义匹配
3. **Sparse 检索** — BM25 关键词匹配
4. **RRF 融合** — 让两路结果互相补位
5. **LLM Reranker** — 用模型做精排，不用加 GPU
6. **ThreadLocal 租户过滤** — 工具方法里传递租户 ID
7. **元数据驱动** — Milvus 里不只存文本，还存元数据

> 📎 完整原文见知识库：[wiki/sources/rag-hybrid-retrieval.md](../../../wiki/sources/rag-hybrid-retrieval.md)

---

[← 上一篇：SideCar 模式](./10-agent-sidecar-pattern.md) | [→ 专栏首页](./index.md)