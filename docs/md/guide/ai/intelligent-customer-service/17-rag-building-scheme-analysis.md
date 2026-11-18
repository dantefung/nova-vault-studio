---
title: "RAG 建设方案横纵分析报告"
date: "2026-05-14"
source: "原创"
url: ""
---

# RAG 建设方案横纵分析报告

> 研究时间：2026-05-14 | 所属领域：AI 应用架构 | 研究对象类型：技术方案

## 一句话定义

RAG（Retrieval-Augmented Generation，检索增强生成）是一种将外部知识检索与大语言模型生成能力结合的技术架构，它解决了纯参数化模型在知识时效性、事实准确性和成本可控性方面的固有缺陷，已成为企业构建智能应用的核心基础设施。

---

## 二、纵向分析：从诞生到当下

### 2.1 技术起源与学术奠基（2020 年）

RAG 概念的系统性提出始于 2020 年。Meta AI（原 Facebook AI Research）的 Patrick Lewis 团队发表了开创性论文《Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks》，首次将预训练的参数化语言模型与非参数化的外部记忆存储相结合。这一时期的 RAG 架构包含三个核心步骤：首先通过 DPR（Dense Passage Retriever）从 Wikipedia 等大规模文档集合中检索相关段落；然后将检索结果与原始查询拼接后输入序列到序列生成模型（BART）；最终由生成器产出融合了外部知识的回答。

这一阶段的 RAG 还存在明显的局限性——它采用的是“检索—拼接—生成”的流水线式架构，检索和生成是两个相对独立的模块，缺乏对检索质量的反馈机制。尽管如此，这种“以检索补知识”的思路，为后续 RAG 技术的发展奠定了基本范式。

### 2.2 框架层的崛起与竞争（2022-2023 年）

2022 年是 RAG 框架层产品爆发的一年。这一年，LangChain 和 LlamaIndex 两个最具影响力的开源框架几乎同时诞生，它们从不同的角度切入 RAG 应用开发市场。

LangChain 的创始人 Harrison Chase 当时在 Robust Intelligence 担任机器学习工程师。在一次公司 hackathon 中，他与同事开发了一个能够基于 Notion 和 Slack 数据进行问答的聊天机器人——这正是 RAG 的典型应用场景。在参加多个 AI meetup 的过程中，Chase 发现许多开发者都在重复构建相似的抽象层来连接语言模型与外部工具。他敏锐地意识到需要一个标准化的框架来简化这些常见模式的实现。2022 年 10 月 16 日，Chase 在 GitHub 上发布了 LangChain 的首个 commit，最初版本仅包含约 800 行 Python 代码。

LlamaIndex（原名 GPT Index）则由 Jerry Liu 于 2022 年 11 月创建。Liu 毕业于普林斯顿大学计算机科学专业，曾在 Quora 担任机器学习工程师，随后在 Uber 从事 AI 研究工作。在使用 GPT-3 构建应用的过程中，Liu 发现现有工具难以有效解决将私有数据与语言模型连接的挑战——GPT-3 的上下文窗口有限，无法一次性加载大量私有文档数据，而传统的微调方案又过于昂贵且不够灵活。他的初始方案是创建一个“索引”系统，能够将大量文档组织成可高效检索的结构，从而在有限的上下文窗口内为模型提供最相关的知识片段。

这两个框架的诞生代表了 RAG 开发范式的根本转变：从“从零构建”到“框架组装”。LangChain 以“链式编排”为核心抽象，强调工作流的灵活性；LlamaIndex 以“索引和检索”为核心优化，追求在 RAG 场景下的极致效果。这种分工——LangChain 偏向通用应用开发，LlamaIndex 偏向 RAG 效果优化——一直延续至今。

### 2.3 开源 RAG 产品的涌现（2024 年）

2024 年，开源 RAG 产品进入爆发期，多个面向端到端场景的产品相继问世。

RAGFlow 由 Infiniflow 团队开发，于 2024 年 4 月 1 日正式开源。该项目的设计理念强调“质量进，质量出”——通过深度文档理解模型确保数据入口的质量。其核心创新包括：引入针对非结构化数据的语义分块（Semantic Chunking）步骤，避免简易文本切分对文档布局信息的破坏；采用企业级搜索引擎提供混合搜索能力，结合 BM25 全文检索与向量语义检索。RAGFlow 的发展节奏极为紧凑，开源后不到三个月即获得 1 万 GitHub 星标。

QAnything 是网易有道团队开发的开源 RAG 引擎，于 2024 年 1 月正式发布。与其他 RAG 产品不同，QAnything 的研发并非始于明确的商业目标，而是源于团队在文档翻译领域的长期积累。2022 年，有道团队启动了一个文档翻译升级项目；2023 年 3 月项目上线后效果显著，此时正值 ChatGPT 技术兴起，团队敏锐地意识到可以将现有技术扩展至文档问答领域。QAnything 的技术特色包括自研的 BCEmbedding 中英双语语义嵌入模型，在 MTEB 语义表征评测和 LlamaIndex RAG 评测中均达到 SOTA 水平。

### 2.4 HKUDS 团队崛起：LightRAG 家族（2024-2025 年）

2024 年，一个来自香港大学（HKU）的研究团队——HKUDS（HKU Data Science Lab）——在 RAG 领域异军突起，推出了多个具有影响力的开源项目，形成了“LightRAG 家族”。

**LightRAG 的诞生**：2024 年 10 月，香港大学黄超团队发表了 LightRAG 论文（EMNLP 2025），提出将知识图谱结构融入文本索引的双层检索系统。LightRAG 的核心创新包括：1）图结构增强的实体和关系提取；2）低层级（实体节点）和高层级（社区摘要）的双层检索；3）增量更新算法支持动态知识库的高效扩展。相比微软 GraphRAG，LightRAG 在增量更新时无需重新生成整个社区摘要，显著降低了计算开销。

LightRAG 在 GitHub 上获得了惊人的增长：从 2024 年 10 月发布到 2025 年中期，已积累超过 34,000 颗星标，成为 GraphRAG 之后最受关注的开源 RAG 项目。其性能在多个基准测试中超越 NaiveRAG、RQ-RAG、HyDE 和 GraphRAG，特别是在法律领域（83.6%对比 16.4%）和农业领域（67.6%对比 32.4%）的优势尤为明显。

**MiniRAG（2025 年 1 月）**：针对小型语言模型（SLMs）的轻量级 RAG 框架。MiniRAG 的核心理念是“让 RAG 在小模型上也能工作”，它通过语义感知的异构图索引机制，将文本块和命名实体统一到一个结构中，减少对复杂语义理解的依赖。实验表明，MiniRAG 使用 SLMs 时能达到接近 LLM-based 方法的性能，同时仅需 25%的存储空间。该项目还发布了 LiHua-World 数据集，专门用于评估端侧设备上的 RAG 能力。

**RAG-Anything（2025 年 6 月）**：面向多模态文档的 All-in-One RAG 框架。现代文档越来越包含文本、图像、表格、公式、图表等多模态内容，传统纯文本 RAG 难以有效处理。RAG-Anything 在 LightRAG 基础上扩展，支持 PDF、Office 文档、图片等格式的统一处理，通过 VLM（视觉语言模型）增强查询理解，实现跨模态的知识图谱构建和检索。该项目在 GitHub 上迅速获得关注，发布仅数月即突破 10,000 颗星标。

**VideoRAG（2025 年 2 月）**：面向极长上下文视频的 RAG 系统，支持视频内容的语义检索和理解。

HKUDS 团队的战略布局清晰：从单模态文本 RAG（LightRAG）出发，逐步扩展到多模态（RAG-Anything）、轻量化（MiniRAG）、长视频（VideoRAG），形成了一个完整的 RAG 技术栈。这种“平台+垂直”的扩展策略，使他们在短时间内建立了强大的社区影响力。

### 2.5 技术范式的演进（2023-2025 年）

从技术演进的角度看，RAG 经历了几个重要的范式升级：

**Self-RAG（2023 年）**：由斯坦福大学和 IBM 研究院联合提出，训练语言模型自主判断何时需要检索、检索结果是否相关以及生成内容是否得到证据支持。这种自适应检索机制解决了传统 RAG 中“无差别检索”带来的效率问题。

**GraphRAG（2024 年）**：微软研究院于 2024 年 2 月发布，将知识图谱与 RAG 深度融合。通过从非结构化文档中自动提取实体和关系，构建结构化的知识图谱索引。GraphRAG 能够处理涉及复杂实体关系、语义推理和多步逻辑关联的查询，这是传统向量检索难以胜任的。

**LightRAG（2024 年）**：香港大学黄超团队推出（EMNLP 2025），在 GraphRAG 基础上引入双层检索（低层级实体+高层级社区）和增量更新算法，解决了 GraphRAG 在全量重建时的高计算开销问题。

**CID-GraphRAG（2025 年）**：意图驱动的图检索增强，专门解决多轮客服对话中上下文连贯性问题。通过双层意图图谱和“意图匹配+语义相似度”双路径检索，在 73 次评估中大幅领先传统方案。

**Agentic RAG（2024-2025 年）**：将 RAG 能力与智能体框架深度结合，使系统能够规划、执行多步检索、使用外部工具并反思检索结果。这种范式的核心特征包括动态决策能力、多轮交互能力、工具集成能力和错误恢复能力。

**多模态 RAG（2025 年）**：RAG-Anything 等技术方案将 RAG 扩展到图像、表格、公式、视频等多模态内容处理，标志着 RAG 从纯文本向全模态演进。

### 2.6 云平台 RAG 服务的成熟（2024-2025 年）

国内云平台在 2024-2025 年相继推出企业级 RAG 服务：

百度千帆大模型平台通过知识库模块提供完整 RAG 能力，差异化优势在于与百度搜索的深度整合，能够直接调用百度搜索的实时索引，在时效性要求高的场景具有明显优势。

阿里百炼（Model Studio）将 RAG 能力集成在平台中，支持多种向量模型和排序模型，其特色在于与阿里云 OpenSearch 和淘宝、1688 等业务沉淀的商品知识图谱的协同。

腾讯云通过智能体开发平台和知识引擎原子能力提供 RAG 服务，强调组件化服务设计，将 RAG 链路中的各个能力解耦为独立 API，企业开发者可根据需求灵活组装定制化的 RAG 链路。

---

## 三、横向分析：竞争图谱

### 3.1 框架层产品对比

#### LangChain：通用编排的集大成者

LangChain 采用以“链式编排”为核心的系统架构，其技术栈如下：

```mermaid
graph TB
    subgraph Client Layer
        A[Python App] --> B[LangChain Core]
        C[JavaScript App] --> D[LangChain.js]
    end
    
    subgraph Core Components
        B --> E[Model I/O]
        B --> F[Chains]
        B --> G[Agents]
        B --> H[Memory]
        B --> I[Retrieval]
        B --> J[Tools]
    end
    
    subgraph External Integrations
        E --> K[OpenAI/Anthropic/Google]
        I --> L[Chroma/Pinecone/FAISS]
        J --> M[100+ Tools]
    end
    
    subgraph Observability
        N[LangSmith] --> O[Testing/Evaluation/Monitoring]
    end
    
    B --> N
```

**核心优势**：
- 编排灵活性：以 Chain 为核心抽象，适合复杂的多步骤工作流
- 工具生态丰富：支持 100+工具集成，涵盖搜索、数据库、API 等
- 企业级特性：LangSmith 提供完整的可观测性和调试能力
- 多模态支持：支持文本、图像、视频等多种数据类型的处理

**局限性**：
- 学习曲线较陡，调试复杂工作流具有挑战性
- 在纯 RAG 场景下可能存在过度设计的问题
- 文档更新有时滞后于代码变更

#### LlamaIndex：检索效果的极致追求

LlamaIndex 采用 Index-centric 架构设计，专门针对 RAG 场景优化：

```mermaid
graph TB
    subgraph Data Input
        A[PDF/Database/API] --> B[Data Connectors]
    end
    
    subgraph Processing
        B --> C[Documents & Nodes]
        C --> D[Indexes]
        D --> E[VectorStoreIndex/SummaryIndex/TreeIndex/KeywordTableIndex/PropertyGraphIndex]
    end
    
    subgraph Query
        F[Query Engines] --> G[Router]
        G --> D
        D --> H[Response Synthesis]
    end
    
    subgraph Storage
        E --> I[Pinecone/Qdrant/Chroma/Milvus/Weaviate]
    end
    
    subgraph Cloud
        J[LlamaCloud] --> K[Managed Service]
    end
```

**核心优势**：
- 检索优化：提供多种高级索引策略，如层次索引、知识图谱索引、混合检索等
- 数据处理能力：强大的文档解析和节点解析功能，支持元数据过滤
- Router 模块：支持自动选择最优检索策略
- 性能优化：在基准测试中，检索速度比原生 LangChain 快约 40%

**局限性**：
- 工具集成和复杂工作流编排方面相对 LangChain 较弱
- 在需要复杂 agent 编排时可能需要结合 LangChain 使用

#### RAGFlow：企业级深度文档理解

RAGFlow 采用五层微服务架构，强调深度文档理解能力：

```mermaid
graph TB
    subgraph Client Layer
        A[React Web UI] --> B[Python SDK]
    end
    
    subgraph API Gateway
        B --> C[Python Server - Quart]
        B --> D[Go Server]
    end
    
    subgraph Services
        E[DocumentService] --> F[DialogService]
        E --> G[KnowledgebaseService]
        E --> H[AgentService]
    end
    
    subgraph Workers
        I[Task Executor] --> J[Document Parsing]
        I --> K[Embedding Generation]
    end
    
    subgraph Storage
        J --> L[MySQL/PostgreSQL]
        K --> M[Elasticsearch/Infinity/OceanBase]
        I --> N[MinIO - S3]
        I --> O[Redis Streams]
    end
    
    subgraph Core Technologies
        P[Deep Document Understanding] --> Q[OCR/Layout Analysis/Table Recognition]
        P --> R[Semantic Chunking]
        S[Hybrid Retrieval] --> T[Vector + BM25 + Knowledge Graph]
    end
```

**核心优势**：
- 深度文档理解：支持复杂格式（扫描件、表格、公式）的精细解析
- 混合检索：融合向量、关键词、知识图谱多种检索方式
- Infinity 集成：原生支持 Infiniflow 自研的 Infinity 向量数据库
- 可视化工作流：提供 Agent Canvas，支持拖拽式编排

**局限性**：
- 部署复杂度较高
- GPU 资源消耗大
- 解析速度相对较慢

#### QAnything：中文场景的务实选择

QAnything 采用“两阶段检索”架构，强调 Embedding + Rerank 的组合优化：

```mermaid
graph TB
    subgraph Input
        A[Documents] --> B[Document Parser - PyMuPDF]
    end
    
    subgraph Retrieval Stage 1
        B --> C[Embedding Model]
        C --> D[bce-embedding-base_v1]
        D --> E[Milvus - Vector DB]
    end
    
    subgraph Retrieval Stage 2
        E --> F[Rerank Model]
        F --> G[bce-reranker-base_v1]
        G --> H[Final Results]
    end
    
    subgraph Web Service
        I[Sanic Async Web] --> J[High Performance API]
    end
    
    subgraph Storage
        C --> K[MySQL - Metadata]
    end
    
    subgraph BCEmbedding Features
        L[Bilingual] --> D
        M[Cross-lingual] --> D
        N[SOTA on MTEB] --> D
    end
```

**核心优势**：
- 两阶段检索：强调 Rerank 环节的重要性，默认检索 100 个文档后进行精排过滤
- 中文优化：针对中英双语和跨语种场景优化
- 一键部署：Docker Compose 一键启动

**局限性**：
- 项目自 2024 年 5 月后未再有重大功能更新
- 前端无法二次开发
- 扩展性有限

#### LightRAG：图增强的轻量级 RAG

LightRAG 采用图结构增强的双层检索架构：

```mermaid
graph TB
    subgraph Indexing Phase
        A[Documents] --> B[LLM Entity Extraction]
        B --> C[Entity & Relation Graph]
        C --> D[Key-Value Index]
        C --> E[Vector Index]
    end
    
    subgraph Query Phase
        F[User Query] --> G[Keyword Extraction]
        G --> H[Low-Level Retrieval]
        G --> I[High-Level Retrieval]
        H --> J[Entity Nodes]
        I --> K[Community Summary]
        J --> L[Chunk Retrieval]
        K --> L
        L --> M[Context Integration]
        M --> N[LLM Generation]
    end
    
    subgraph Incremental Update
        O[New Documents] --> P[Delta Graph]
        C --> Q[Merge with Original Graph]
    end
```

**核心优势**：
- 双层检索：低层级（实体节点）和高层级（社区摘要）协同
- 增量更新：无需重新生成整个知识图谱，显著降低计算开销
- 性能领先：在多个基准测试中超越 GraphRAG、NaiveRAG 等
- 灵活的存储后端：支持 JSON 文件、PostgreSQL、MongoDB、Neo4j 等

**局限性**：
- 对 LLM 能力要求较高，需要 LLM 执行实体-关系提取
- 不建议使用推理模型进行文档处理
- 大规模数据处理时存在性能瓶颈（50K+文档场景）

#### MiniRAG：面向小模型的轻量级 RAG

MiniRAG 专为资源受限场景设计，使用小型语言模型也能实现良好性能：

```mermaid
graph TB
    subgraph Heterogeneous Graph Indexing
        A[Documents] --> B[Text Chunks]
        A --> C[Named Entities]
        B --> D[Unified Graph Structure]
        C --> D
    end
    
    subgraph Lightweight Retrieval
        E[Query] --> F[Topology Search]
        F --> G[Graph-based Relevance Scoring]
        D --> G
        G --> H[Top-K Chunks]
    end
    
    subgraph Storage Comparison
        I[MiniRAG] --> J[25% Storage]
        I --> K[SLM Compatible]
    end
```

**核心优势**：
- 存储效率：仅需传统方案 25%的存储空间
- SLM 兼容：使用小型语言模型也能达到接近 LLM 的性能
- 鲁棒性：从 LLM 切换到 SLM 时，准确率下降仅 0.8%-20%
- 异构图索引：统一文本块和命名实体的索引结构

**局限性**：
- 性能仍略低于基于 LLM 的方案
- 社区规模和生态相对较小
- 主要面向端侧/边缘设备场景

### 3.2 云平台 RAG 服务对比

| 维度 | 百度千帆 | 阿里百炼 | 腾讯云 |
|------|---------|---------|--------|
| **核心能力** | 知识库+RAG+AppBuilder | 知识库+排序+向量模型 | ES 向量检索+混元大模型 |
| **向量存储** | VDB 百亿级 | ADB-PG 分析型 | ES 内置 KNN |
| **检索策略** | 混合检索+知识图谱 | 混合检索+重排序 | RRF 融合 |
| **差异化** | 百度搜索实时索引 | 通义系列模型集成 | 一站式+Serverless |
| **优势场景** | 需要搜索能力的场景 | 阿里云生态企业 | 已有腾讯技术栈的企业 |

### 3.3 选型决策矩阵

| 应用场景 | 推荐方案 | 核心理由 |
|---------|---------|---------|
| 构建复杂 AI 应用 | LangChain | 编排能力强，工具生态丰富 |
| 专注 RAG 效果 | LlamaIndex | 检索优化好，API 设计清晰 |
| 处理复杂文档 | RAGFlow | 文档理解深，支持多种格式 |
| 中文场景快速部署 | QAnything | 中文优化好，一键启动 |
| 企业级云端方案 | 百度/阿里 | 完整工具链，运维省心 |
| 已有搜索架构 | 腾讯云 ES | 平滑过渡，成本低 |
| 图增强+高性能 | LightRAG | 双层检索，增量更新，支持多存储后端 |
| 多模态文档 | RAG-Anything | 统一处理 PDF/图片/表格/公式 |
| 端侧/轻量化部署 | MiniRAG | 25%存储，兼容小模型 |

---

## 四、横纵交汇洞察

### 4.1 历史如何塑造了当下的竞争位置

回顾 RAG 技术的发展历程，几个关键的历史节点塑造了今天的竞争格局：

**2022 年的框架之争**决定了今天的市场分层。LangChain 和 LlamaIndex 的同时诞生并非巧合——它们分别代表了两种互补的思路：LangChain 从“应用编排”切入，强调通用性；LlamaIndex 从“检索效果”切入，强调专业化。这种分工在今天依然有效：需要复杂工作流的企业选择 LangChain，需要极致 RAG 效果的企业选择 LlamaIndex。

**2024 年的产品分化**标志着 RAG 从工具向平台的演进。RAGFlow、QAnything 等端到端产品的出现，代表 RAG 从“框架+自行组装”的开发模式向“开箱即用”的产品模式转变。这种转变的背景是企业级需求的增长——越来越多的企业需要的是解决方案而非开发框架。

**2024-2025 年的云平台入场**改变了竞争维度。百度、阿里、腾讯的 RAG 服务不再是简单的功能提供，而是与各自生态深度绑定。百度搜索+千帆、阿里云+百炼、腾讯 ES+混元——这种生态协同能力是开源产品难以匹敌的。

### 4.2 竞品的纵向对比与路径差异

不同产品的今天，根源在于它们走过了不同的历史路径：

**LangChain 的路径**：从个人 side project 到行业标准平台。创始人 Harrison Chase 在 Robust Intelligence 的 hackathon 项目是起点，2023 年 ChatGPT 的发布是催化剂，Sequoia 的投资是加速器。LangChain 的成功在于它始终保持了“通用性”这个核心定位，即使后来推出 LangGraph 也是为了更好地服务复杂应用场景，而非偏离到某个垂直领域。

**LlamaIndex 的路径**：从索引工具到 RAG 专业平台。Jerry Liu 在 Uber 的工作经历让他深刻理解“数据与模型连接”的痛点，这个痛点驱动了 LlamaIndex 的核心设计——一切围绕索引和检索展开。这种“专业化”路径让 LlamaIndex 在 RAG 效果上领先，但也限制了它在非 RAG 场景的渗透。

**RAGFlow 的路径**：从深度文档理解到企业级 RAG 平台。Infiniflow 团队的核心竞争力在于文档解析能力，这是他们在做搜索时代积累的技术。正是这种技术积淀，让 RAGFlow 在处理复杂文档（如扫描件、表格、公式）时具有明显优势。

### 4.3 未来推演

基于纵向趋势和横向竞争格局，给出三个剧本：

**最可能的剧本（60%概率）**：RAG 市场走向分化与整合。开源框架层产品（LangChain、LlamaIndex）持续迭代但增速放缓；垂直领域的端到端产品（如 RAGFlow）获得企业市场；云平台 RAG 服务成为中小企业首选。市场将呈现“开源做底层、云端做上层、垂直做场景”的格局。

**最危险的剧本（20%概率）**：RAG 被新的技术范式颠覆。如果长上下文窗口技术继续发展，理论上可以“一次性加载整个知识库”，那么 RAG 的“分块检索”模式将受到根本性挑战。不过，这种替代更多会在特定场景发生，而非完全取代。

**最乐观的剧本（20%概率）**：RAG 成为 AI Agent 的核心基础设施。随着 Agentic RAG 的成熟，RAG 不再只是“问答”的底层技术，而是 Agent 的“记忆系统”和“知识大脑”。每个 Agent 都需要 RAG 能力来访问企业知识库，这将催生一个远超当前规模的市场。

### 4.4 给智能客服建设的启示

回到智能客服这个具体场景，RAG 建设应该如何选择？

**短期（1-6 个月）**：如果目标是快速上线、验证 PMF，选择端到端产品。RAGFlow 适合对文档处理质量要求高的场景（如法律、金融）；QAnything 适合中文场景下的快速部署。

**中期（6-12 个月）**：如果需要构建差异化竞争力，选择开源框架+自研。LangChain/LlamaIndex 提供了足够的灵活性，可以根据业务特点定制检索策略、对话流程、效果评估。

**长期（12 个月以上）**：如果要构建完整的企业智能化平台，需要考虑与云平台的生态协同。百度千帆、阿里百炼的一站式能力更适合这个阶段。

无论选择哪条路径，有一个趋势是确定的：RAG 不是一次性的“配置”，而是持续迭代的“能力”。从索引优化到检索调优，从效果评估到用户体验——这是一场没有终点的持续改进。

---

## 五、信息来源

1. Lewis, P., et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks". arXiv:2005.11401
2. LangChain Official Documentation. https://python.langchain.com/
3. LlamaIndex Official Documentation. https://docs.llamaindex.ai/
4. RAGFlow GitHub Repository. https://github.com/infiniflow/ragflow
5. QAnything GitHub Repository. https://github.com/netease-youdao/qanything
6. 百度千帆大模型平台文档. https://cloud.baidu.com/product/wenxinworkshop
7. 阿里百炼平台文档. https://www.alibabacloud.com/product/model-studio
8. Self-RAG Paper. https://arxiv.org/abs:2310.11511
9. GraphRAG Microsoft Research. https://github.com/microsoft/graphrag
10. 斯坦福 RAG 综述论文. https://arxiv.org/abs:2407.00619
11. LightRAG GitHub Repository. https://github.com/HKUDS/LightRAG
12. LightRAG Paper (EMNLP 2025). https://arxiv.org/abs/2410.05779
13. MiniRAG GitHub Repository. https://github.com/HKUDS/MiniRAG
14. MiniRAG Paper. https://arxiv.org/abs/2501.06713
15. RAG-Anything GitHub Repository. https://github.com/HKUDS/RAG-Anything
16. RAG-Anything Technical Report. https://arxiv.org/abs/2510.12323
17. 腾讯优图 RAG 技术架构与创新实践. https://www.53ai.com/news/RAG/2025090859432
18. CID-GraphRAG 意图驱动图检索. https://www.53ai.com/news/RAG/2025092492875.html

---

## 方法论说明

本报告采用横纵分析法（Horizontal-Vertical Analysis）进行深度研究。该方法由数字生命卡兹克（Khazix）提出，融合了语言学中的历时-共时分析（Saussure）、社会科学中的纵向-横截面研究设计、商学院案例研究法、以及竞争战略分析的核心思想。核心原则：纵向追时间深度，横向追同期广度，最终交汇出判断。