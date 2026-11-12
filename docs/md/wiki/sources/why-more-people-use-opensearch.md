---
title: "为什么越来越多人用OpenSearch？"
date: "2026-09-03"
author: "微信公众号"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/70tSzSKeFBxqqD5DG7q_5g"
---

# 为什么越来越多人用OpenSearch？

## 前言

前几天在跟一位球友聊他们公司搜索引擎做的技术选型。

我问他：“你们有没有考虑过 OpenSearch？”

他愣了一下：“OpenSearch 不就是 AWS fork 出来的那个分支吗？功能跟得上吗？”

这个反应其实很普遍。很多人对 OpenSearch 的印象还停留在“2021 年 AWS 从 Elasticsearch 7.10.2 fork 出来的分支”。

但如果你还这么想，那就真的落后了。

OpenSearch 早已不是那个“Elasticsearch 的替代品”，而是一个独立的、由 Linux 基金会托管的、Apache 2.0 协议的开源搜索与分析平台。

累计下载量已经突破 20 亿次，活跃贡献者超过 3000 人，参与贡献的组织超过 400 家。

今天这篇文章，我就把 OpenSearch 为什么越来越多人用的原因，从底层架构原理到实际应用，从头到尾给你拆解一遍。希望对你会有所帮助。

---

## 一、OpenSearch 是怎么来的？

故事要从 2021 年 1 月说起。

Elastic（Elasticsearch 背后的公司）宣布将 Elasticsearch 和 Kibana 的许可证从 Apache 2.0 改为 **SSPL + Elastic License v2** 双重授权。

SSPL 的核心条款是：**如果你把软件作为服务对外提供，必须把整个管理栈的源码都开源。**

AWS 的回应很直接：fork 了 Elasticsearch 7.10.2（最后一个 Apache 2.0 版本），改名叫 OpenSearch。

2021 年 7 月，OpenSearch 1.0 正式发布。

真正的转折发生在 2024 年 9 月。AWS 把 OpenSearch 的治理权完全移交给了 Linux 基金会，成立了 OpenSearch 软件基金会。创始成员包括 AWS、SAP、Uber、Aiven、Canonical 等。

从这一刻起，OpenSearch 和 Elasticsearch 彻底走上了两条不同的路。

2024 年 8 月，Elastic 在原有 SSPL 和 Elastic License 2.0 的基础上，又加了 AGPLv3 作为第三个选项。AGPLv3 虽然被 OSI 认可为开源许可证，但它有一个著名的“网络使用即分发”条款——你用这个软件提供网络服务，也必须开源你的代码。

---

## 二、一张图看懂 OpenSearch 的架构

要理解 OpenSearch 为什么能扛住大规模数据，得先搞清楚它的底层架构。

### 2.1 五层抽象

![五层抽象](../images/why-more-people-use-opensearch/001.webp)

OpenSearch Core 的架构由五个核心概念构成：集群（Cluster）、节点（Node）、索引（Index）、分片（Shard）和文档（Document）。

节点类型决定了集群的职责分工：
- **数据节点**：存储索引数据，处理数据摄取、搜索和聚合
- **主节点**：负责集群层面的管理操作
- **协调节点**：接收客户端请求，路由到数据节点

### 2.2 倒排索引：搜索的核心数据结构

OpenSearch 的搜索能力建立在 Apache Lucene 之上。

Lucene 最核心的数据结构是倒排索引（Inverted Index）。倒排索引的逻辑很简单：不是“文档→关键词”，而是“关键词→文档”。它维护一个从每个词到包含该词的文档列表的映射。

用户搜索“OpenSearch”时，系统直接查倒排索引，瞬间定位到包含这个词的所有文档。

![倒排索引](../images/why-more-people-use-opensearch/002.webp)

---

## 三、Segment Replication：段复制

OpenSearch 2.7 引入了一个改变游戏规则的特性——Segment Replication（段复制）。

传统方式叫文档复制：主分片收到文档后，每个副本分片都要重新执行一次完整的索引操作。写入压力随副本数线性增长。

段复制的做法完全不同：只有主分片执行索引操作，生成 Lucene 段文件后，直接复制给所有副本。副本不需要重新索引，只需下载段文件并加载即可。

![段复制 1](../images/why-more-people-use-opensearch/003.webp)

![段复制 2](../images/why-more-people-use-opensearch/004.webp)

段复制带来的收益：
- **索引吞吐量提升**：副本不再重复执行索引操作
- **CPU 资源大幅节省**：每个副本从“执行索引”变成“下载文件”
- **网络带宽换计算资源**：更多的网络传输，换取更少的 CPU 消耗

---

## 四、读写分离

OpenSearch 3.0 引入了更彻底的架构变革——读写分离。

### 4.1 三种分片角色

OpenSearch 3.0 引入了三种分片角色：

| 角色 | 功能 | 特点 |
| :--- | :--- | :--- |
| Primary | 处理索引写入 | 唯一的写入入口 |
| Write Replica | 冗余备份 | Primary 故障时可提升为 Primary |
| Search Replica | 专门服务搜索 | 不可提升为 Primary |

Search Replica 只负责搜索，不参与索引。更关键的是，它只能被分配到带有 search 角色的节点上，实现硬件层面的物理隔离。

### 4.2 完整的读写分离架构

启用远程存储后，完整的读写分离流程如下：
1. Primary 将段文件和事务日志写入远程存储
2. Write Replica 从远程存储拉取段文件
3. Search Replica 持续轮询远程存储，发现新段立即加载

![读写分离架构](../images/why-more-people-use-opensearch/005.webp)

读写分离的核心价值：

| 维度 | 传统模式 | 读写分离模式 |
| :--- | :--- | :--- |
| 写入负载 | Primary + Replica 都处理 | 仅 Primary 处理 |
| 搜索负载 | Primary + Replica 都处理 | Search Replica 专责 |
| 资源隔离 | 混合，相互影响 | 硬件级物理隔离 |
| 扩展方式 | 整体扩展 | 按需独立扩展 |

---

## 五、9.5 倍性能飞跃

2025 年 5 月，OpenSearch 3.0 正式发布。这是三年来的第一个主要版本。

### 5.1 核心升级

**底层引擎升级：**
- 升级到 Apache Lucene 10，引入 SIMD 向量化和改进的 I/O 模式
- 升级到 JVM 21，引入现代 Java 特性和更好的性能

**架构革新：**
- **原生 gRPC 支持**：基于 HTTP/2 的多路复用
- **读写分离**：索引和搜索工作负载独立配置
- **GPU 加速向量索引**：索引构建速度提升 9.3 倍

### 5.2 性能数据

| 对比基准 | 性能提升 |
| :--- | :--- |
| 相比 OpenSearch 1.3 | 搜索查询性能提升 9.5 倍 |
| 相比 OpenSearch 2.19 | 高影响操作平均提升 20% |
| 向量搜索 | 性能提升 2.5 倍 |
| 范围查询 | 性能提升 25% |

这一提升主要得益于 Lucene 10 在向量字段索引、稀疏数据处理与压缩机制方面的优化。

---

## 六、向量搜索

2025 年的搜索已经不只是关键词匹配了。

OpenSearch 在向量搜索上的布局，是它能在 AI 时代站稳脚跟的关键。

### 6.1 k-NN 向量搜索

OpenSearch 的核心向量搜索能力是 k-NN（k-Nearest Neighbors）。

它支持三种方法：
- **近似 k-NN（ANN）**：牺牲少量精度换取大幅性能提升，默认推荐
- **精确搜索**：暴力全量比对，适合小数据集
- **Painless 扩展**：距离函数作为 Painless 脚本扩展，支持复杂组合

OpenSearch 支持 Faiss、NMSLIB、Lucene 三种引擎。

### 6.2 混合搜索：关键词 + 向量

OpenSearch 的差异化优势是混合搜索（Hybrid Search）——关键词搜索（BM25）+ 语义搜索（向量）同时进行。

BM25 返回的分数是无界的，k-NN 返回 `[0,1]` 区间，需要归一化后才能组合。

![混合搜索](../images/why-more-people-use-opensearch/006.webp)

混合搜索在需要同时兼顾关键词匹配和语义理解的复杂查询中特别有效——BM25 捕捉精确关键词匹配，k-NN 捕捉语义相似性，两者互补。

---

## 七、向量性能再进化

2026 年 8 月发布的 3.8 版本，重点优化了向量工作负载。

### 7.1 Base64 向量编码

768 维 float 向量在 JSON 中约 16KB，Base64 编码后仅 **4KB，网络传输减少 74%**。

实测收益：
- 批量摄取吞吐量提升 4.16 倍
- 中位延迟降低 83%

### 7.2 径向搜索优化

在 1000 万向量数据集上：
- 径向搜索吞吐量提升 2.1 倍
- 平均召回率从 0.85 提升至 0.97

---

## 八、社区生态

OpenSearch 已经不是当年的“小项目”了。

| 指标 | 数据 |
| :--- | :--- |
| 累计下载量 | 20 亿+ |
| Linux 基金会托管后增长 | 7 亿 → 14 亿 → 20 亿 |
| 活跃贡献者 | 3000+ |
| 贡献组织 | 400+ |
| 公共仓库 | 140+ |

OpenSearch 已经形成了一个完整的生态：
- **OpenSearch Dashboards**：数据可视化工具
- **Data Prepper**：数据摄取管道
- **Piped Processing Language（PPL）**：日志分析专用查询语言
- **MCP 服务器**：与 AI Agent 无缝集成

---

## 九、OpenSearch vs Elasticsearch 差异

| 对比维度 | OpenSearch | Elasticsearch |
| :--- | :--- | :--- |
| 许可证 | Apache 2.0 | AGPLv3 / ELv2 / SSPL 三重授权 |
| 治理机构 | Linux 基金会 | Elastic N.V. |
| 安全功能 | 全部免费 | 基础免费，高级付费 |
| 向量搜索 | 三种引擎（Faiss/NMSLIB/Lucene） | 原生支持 |
| GPU 加速 | ✅ 索引加速 9.3 倍 | 有限支持 |
| gRPC 协议 | ✅ 原生支持 | ❌ |
| 混合搜索 | ✅ 原生支持 | ✅ |
| 读写分离 | ✅ 3.0 原生支持 | ❌ |
| MCP 协议 | ✅ 3.0 原生支持 | ❌ |
| 云服务 | Amazon OpenSearch Service 等 | Elastic Cloud |

2026 年的核心差异可以概括为三句话：
1. OpenSearch 给的是“**全栈免费**”——安全、告警、ML、SQL 全部内置免费
2. OpenSearch 给的是“**架构确定性**”——Apache 2.0 许可证永远不会变
3. OpenSearch 给的是“**治理中立**”——Linux 基金会托管，不会被任何公司绑架

---

## 十、适用场景

| 场景 | 推荐选择 | 理由 |
| :--- | :--- | :--- |
| 对开源许可证敏感的企业 | ✅ OpenSearch | Apache 2.0 完全开源，不会被突然变更 |
| 日志分析 / 可观测性 | ✅ OpenSearch | 全栈功能免费，PPL 日志分析强大 |
| SIEM / 安全分析 | ✅ OpenSearch | 安全分析、告警、异常检测全部免费 |
| RAG / 向量检索 | ✅ OpenSearch | 混合搜索+向量检索，GigaOm 领导者 |
| AWS 云原生应用 | ✅ OpenSearch | Amazon OpenSearch Service 原生集成 |
| 搜索相关性是核心竞争力 | ⚠️ Elasticsearch | 搜索创新迭代更快 |
| 已深度绑定 Kibana 生态 | ⚠️ Elasticsearch | OpenSearch Dashboards 有学习成本 |
| 已有 ES 商业订阅 | ⚠️ Elasticsearch | 继续用即可 |

---

## 十一、写在最后

回到最初的问题：为什么越来越多人用 OpenSearch？

答案不复杂——因为它在架构层面给了 Elasticsearch 给不了的东西：**确定性和自由度**。

- 许可证确定，Apache 2.0 永远不变。
- 治理中立，Linux 基金会托管。
- 架构先进，读写分离、段复制、gRPC、GPU 加速向量索引——这些都是 OpenSearch 3.0 时代独有的能力。

更重要的是，OpenSearch 早已不是 2021 年那个“Elasticsearch 的 fork”了。3.0 版本带来的是一次架构级的跃迁。

Lucene 10 + JVM 21 + gRPC + 读写分离 + GPU 加速——这些不是“追赶”，而是“重新定义”。

技术选型没有绝对的对错。想清楚你最在意什么——是许可自由度、架构确定性，还是功能迭代速度——答案自然就清晰了。

**开源地址：**
- OpenSearch 官网：[https://opensearch.org](https://opensearch.org)
- GitHub：[https://github.com/opensearch-project/OpenSearch](https://github.com/opensearch-project/OpenSearch)
- 官方文档：[https://docs.opensearch.org](https://docs.opensearch.org)
