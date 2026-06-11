---
title: "TurboVec（向量检索库）"
date: "2026-06-11"
---

# TurboVec（向量检索库）

> A vector index built on TurboQuant, written in Rust with Python bindings. 10M documents in 31GB RAM → 4GB. Faster than FAISS.

## Key Points

- **核心痛点解决**：RAG 系统本地部署时内存瓶颈，TurboQuant 通过底层数据压缩技术大幅降低高维向量存储与 RAM 占用
- **压缩效果**：1000万文档语料 FP32 需要 31GB RAM → turbovec 仅需 4GB（16x 压缩）
- **性能**：比 FAISS IndexPQFastScan 快 12-20%

## 工作原理（6步）

1. **Normalize** — 去掉向量长度，存为单独 float
2. **Random rotation** — 乘同一随机正交矩阵，使每坐标独立服从已知分布
3. **Per-coordinate calibration (TQ+)** — 首步 add 时拟合两个标量（shift + scale）
4. **Lloyd-Max scalar quantization** — 预计算最优分桶（2-bit=4桶，4-bit=16桶）
5. **Bit-pack** — 1536 维向量：6144 bytes → 384 bytes（2-bit）
6. **Length-renormalized scoring** — 修正量化导致的内积低估

## Python 示例

```python
from turbovec import TurboQuantIndex
index = TurboQuantIndex(dim=1536, bit_width=4)
index.add(vectors)
scores, indices = index.search(query, k=10)
index.write("my_index.tq")
```

## 框架集成

- LangChain（`pip install turbovec[langchain]`）
- LlamaIndex（`pip install turbovec[llama-index]`）
- Haystack
- Agno

## 数据

- **9.9k Stars** · **849 Forks** · **148 Commits**
- MIT License
- 基于 Google Research [TurboQuant](https://arxiv.org/abs/2504.19874)（ICLR 2026）

## Sources

- GitHub RyanCodrai/turbovec (2026-06-09)