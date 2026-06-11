---
title: "LLM Wiki Product（知识管理产品化实现）"
date: "2026-06-11"
---

# LLM Wiki Product（知识管理产品化实现）

> LLM Wiki 是将 Karpathy 的个人知识库方法论工程化最完整的开源实现，一款跨平台桌面应用，把文档变成自动维护、互相链接的知识库。

## Key Points

- **核心定位**：不是 AI 帮你搜知识，而是 AI 帮你维护知识
- **核心思路**：传统 RAG每次 query都要从零检索；而 LLM Wiki 的思路是：LLM 增量构建并持久维护一个 Wiki，知识和答案编译一次、持续更新

## 核心功能

### 1. 两步 Chain-of-Thought 入库

- **第一步（分析）**：LLM 读源文档 → 结构化分析（关键实体、与现有 Wiki 的连接、与现有知识的矛盾）
- **第二步（生成）**：基于分析结果生成 Wiki 页面、交叉引用、更新 index.md

### 2. 知识图谱（4 信号相关性模型）

| 信号 | 权重 | 说明 |
|------|------|------|
| 直接链接 | ×3.0 | 通过 `[[wikilinks]]` 链接的页面 |
| 来源重叠 | ×4.0 | 共享同一原始源文件的页面 |
| Adamic-Adar | ×1.5 | 共享共同邻居（按邻居度数加权） |
| 类型亲和 | ×1.0 | 同类型页面加分（entity↔entity） |

### 3. Louvain 社区发现

自动发现知识集群，用内聚度评分（intra-edge density）：低于 0.15 的集群被标记为"知识缺口"。

### 4. 知识缺口自动标出

- **孤立页面**（连接度 ≤ 1）
- **稀疏社区**（内聚度 < 0.15，≥ 3 页）
- **桥接节点**（连接 3+ 个集群）

点一下就能触发 Deep Research 自动补全。

### 5. Deep Research

当 LLM 发现知识缺口时，通过网络搜索 + LLM 综合研究写成 Wiki 研究页面，自动入库提取实体/概念。

## 数据

- **10.3k Stars** · **1.3k Forks** · **v0.4.19**

## Related Pages

- [concepts/llm-wiki](concepts/llm-wiki) — LLM Wiki 知识库模式
- [patterns/ai-knowledge-workflow](patterns/ai-knowledge-workflow) — AI知识管理工作流

## Sources

- X/Twitter (2026-06-04)