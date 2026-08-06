---
title: "Medical Knowledge Graph QA (医疗知识图谱问答)"
date: "2026-08-06"
source: "GitHub"
---

# Medical Knowledge Graph QA (医疗知识图谱问答)

> 基于 Neo4j 图数据库的医疗知识图谱智能问答系统，以疾病为中心构建 4.4 万实体、30 万关系的医药知识图谱，通过实体识别 + 意图分类 + Cypher 查询实现 18 类医疗问答。

## 核心架构

### 知识图谱构建
垂直医药网站 → XPath 结构化解析 → JSON 格式化 → Neo4j 图数据库入库

### 问答流程
1. 输入问题 → 2. 命名实体识别 + 意图分类 → 3. 生成 Cypher 查询 → 4. Neo4j 执行 → 5. 结果翻译为自然语言

## 关键设计

- **7 类实体**：Disease / Symptom / Drug / Check / Department / Food / Producer
- **11 类关系**：has_symptom / acompany_with / recommand_drug / need_check / do_eat / no_eat 等
- **18 类意图**：覆盖症状查询、病因、治疗、用药、检查、饮食、预防、并发症等

## 相关页面

- [[concepts/knowledge-graph]] — 知识图谱基础概念
- [[concepts/graph-rag]] — 图增强检索
- [[concepts/neo4j]] — Neo4j 图数据库（如已存在）
- [[concepts/llm-wiki]] — LLM Wiki 知识库模式