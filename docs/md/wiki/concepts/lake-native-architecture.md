---
title: "Lake-Native Architecture"
date: "2026-08-05"
source: "微信公众号 (运维有术)"
---

# Lake-Native Architecture

> Lake-native architecture（湖原生架构）是一种将数据库存储底座直接构建在数据湖（object storage）之上的架构模式，通过 manifest 列存格式将元数据与数据文件解耦，实现按需精准取列，替代传统的"云原生 + 存算分离"架构。

## Key Points

- 核心机制：将 segment 的元数据（manifest）和数据文件（column files）解耦，query 时按 manifest 精准取列
- 与云原生的区别：云原生解决"扩"的问题（无状态组件、对象存储做底、500+ 节点可扩），lake-native 解决"数据不复制"的问题
- 存储格式：基于 object storage 的 manifest 列存格式（如 Milvus 的 Storage V3 / Loon）
- 厂商口径 I/O 节省：Parquet 基础读每点 ~9.4 MB，Vortex + Loon 压到 ~0.07 MB（约 135 倍），但未找到第三方独立复现

## Details

### 与云原生的对比

| 维度 | 云原生 (2.x) | Lake-native (3.0) |
|------|-------------|-------------------|
| 核心目标 | 水平扩展，存算分离 | 数据不复制，直接在湖上检索 |
| 存储抽象 | 无状态组件 + 对象存储 | manifest 列存格式 |
| 边界 | 加数据需复制到 Milvus | 直接在 Iceberg/Parquet 上建索引 |
| 代表产品 | Milvus 2.x | Milvus 3.0 (Storage V3 / Loon) |

### 对工作流的影响

- 省去 ETL 流水线：数据在数据湖中，Milvus 直接建索引检索
- External Collection 支持 zero-copy 读取 Iceberg/Parquet 数据
- 安全治理边界变化：Milvus 直接读取客户表时，安全团队需关注"谁能看到什么"
- 生态兼容性：与 Snowflake/Databricks 等云数仓合作容易（接受标准列存），与其它 DB 供应商因 storage engine 差异合作困难

## Context

Lake-native 架构是 Milvus 3.0 的核心主线。Milvus 2.x 的云原生架构在 2.6 已摸到边界——再加数据就需要复制一份到 Milvus。3.0 不打算解决扩的问题，而是换了抽象，将存储底座换成 Storage V3 / Loon。

## Related Pages

- [[concepts/milvus-3.0]]
- [[concepts/vector-database]]

## Sources

- Article: Milvus 3.0 官宣开源：4 个真改工作流的能力，剩下 16 项要看场景再上 (运维有术, 2026-08-05) → `sources/milvus-3.0-open-source.md`