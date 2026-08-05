---
title: "Milvus 3.0"
date: "2026-08-05"
source: "微信公众号 (运维有术)"
---

# Milvus 3.0

> Milvus 3.0 是向量数据库 Milvus 的 GA 版本，核心架构从"云原生 + 存算分离"迁移到"lake-native（湖原生）"，底层用 Storage V3 / Loon manifest 列存格式替换了 2.x 的存储抽象。

## Key Points

- 2026 年 7 月 29 日 GA，主线是架构替换而非功能堆叠——"complete what the beta started"
- 底层 Storage V3 / Loon：将 segment 元数据（manifest）和数据文件（column files）解耦，query 时按 manifest 精准取列，厂商口径 135 倍 I/O 节省
- 4 个改变工作流的能力：Online Schema 演进、External Collection、TEXT 字段 + Sparse Index 重构、Woodpecker 默认 WAL
- 3 个上线前门槛：Storage V3 默认 disabled 且开启后不可回滚 2.6；新 index 需手动调高 version；Woodpecker standalone + local storage 有两个未确认修复的 bug
- 3.1 路线图承诺 CDC-fresh external indexes、Paimon/Delta Lake 支持、UDFs

## Details

### 架构主线：云原生 → lake-native

Milvus 2.x 的核心卖点是云原生 + 存算分离，但边界在 2.6 已摸到。3.0 将存储底座换成 Storage V3 / Loon：基于 object storage 的 manifest 列存格式，把 segment 的元数据（manifest）和数据文件（column files）解耦。厂商口径：Parquet 基础读每点 ~9.4 MB，Vortex + Loon 压到 ~0.07 MB（约 135 倍 I/O 节省），但未找到第三方独立复现。

### 4 个改变工作流的能力

1. **Online Schema 演进**：add/drop collection field 只改 manifest，不重写 data files。Inner backfill（函数计算字段）已 GA；External backfill（换 embedding 模型）是 3.1 的事
2. **External Collection**：直接在 Milvus 检索 Iceberg/Parquet 数据，zero-copy 无需 ETL。但 read-only，写入和 CDC 同步在 3.1
3. **TEXT 字段 + Sparse Index 重构**：TEXT 字段升为一等公民，RAG 场景向量和源文本同 store 一次 IO。Sparse Index 引入 SINDI、Block-Max WAND、MaxScore 三个算法
4. **Woodpecker 默认 WAL**：替代 Pulsar/Kafka，少一个 ZooKeeper/BookKeeper 组件栈

### 落地门槛

- Storage V3 需手动开启（common.storage.useLoonFFI），开启后不可回滚 2.6
- 新 sparse algorithms 需手动调高 dataCoord.targetVecIndexVersion=10 和 dataCoord.targetScalarIndexVersion=4
- Woodpecker standalone + local storage 有两个已知 bug（Issue#46067 和 Discussion#45494）

## Context

本文来自"运维有术"公众号，是对 Milvus 3.0.0 GA 的深度技术解读，基于官方 release notes、本地源码和 LF AI & Data 博客交叉整理。作者强调此次发布"关键不是功能数量，而是把 beta 挖的坑填上"。

## Related Pages

- [[concepts/lake-native-architecture]]
- [[concepts/vector-database]]

## Sources

- Article: Milvus 3.0 官宣开源：4 个真改工作流的能力，剩下 16 项要看场景再上 (运维有术, 2026-08-05) → `sources/milvus-3.0-open-source.md`