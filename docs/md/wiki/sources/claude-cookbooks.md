---
title: "Claude Cookbooks — Anthropic 官方 Claude 使用菜谱集"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/anthropics/claude-cookbooks"
---

# Claude Cookbooks — Anthropic 官方 Claude 使用菜谱集

> A collection of notebooks/recipes showcasing some fun and effective ways of using Claude. 44.9k Stars，Anthropic 官方出品。

<!-- more -->

## 产品定位

Claude Cookbooks 是 Anthropic 官方的 Claude 使用菜谱集，提供可直接拷贝集成的代码示例和指南，帮助开发者用好 Claude。代码以 **Jupyter Notebook** 为主，概念可迁移到任何支持 Claude API 的语言。

## 内容分类

### Capabilities（核心能力）

| 示例 | 说明 |
|------|------|
| Classification | 文本和数据分类 |
| Retrieval Augmented Generation | 结合外部知识增强回答 |
| Summarization | 文本摘要技术 |

### Tool Use and Integration（工具集成）

- `customer_service_agent.ipynb` — 客服 Agent
- `calculator_tool.ipynb` — 计算器集成
- `how_to_make_sql_queries.ipynb` — SQL 查询

### Third-Party Integrations（第三方集成）

- Pinecone RAG（向量数据库）
- Wikipedia 搜索
- 网页读取（Haiku）
- Voyage AI Embeddings

### Multimodal（多模态）

- 图像处理：Getting started、Best practices、Charts/Graphs 解读、表单转录
- Claude + Stable Diffusion 图像生成

### Advanced Techniques（高级技巧）

- **Sub-agents**：Haiku 作为 Opus 的子 Agent
- **PDF Upload**：解析并以文本传给 Claude
- **Automated Evaluations**：用 Claude 做 Prompt 评估
- **JSON Mode**：确保稳定 JSON 输出
- **Moderation Filter**：内容审核过滤
- **Prompt Caching**：高效 Prompt 缓存

## 数据

- **44.9k Stars** · **5.2k Forks** · **561 Watchers**
- **581 Commits**
- **94.9% Jupyter Notebook** · 4.6% Python
- 官方维护，有活跃贡献流程

## 目录结构

```
claude-cookbooks/
├── capabilities/         # 核心能力示例
├── tool_use/           # 工具使用
├── third_party/        # 第三方集成（Pinecone, Voyage AI, Wikipedia）
├── multimodal/         # 多模态（图像处理）
├── coding/            # 编码相关
├── extended_thinking/ # 扩展思考
├── finetuning/        # 微调
├── managed_agents/     # Managed Agents
├── observability/     # 可观测性
├── patterns/agents/   # Agent 设计模式
├── skills/            # Agent Skills 相关
├── scripts/           # 辅助脚本
└── tests/             # 测试
```

## 快速入口

- [Anthropic 开发者文档](https://docs.claude.com/claude/docs/guide-to-anthropics-prompt-engineering-resources)
- [Anthropic Discord](https://www.anthropic.com/discord)
- [Claude API 基础课程](https://github.com/anthropic/courses/tree/master/anthropic_api_fundamentals)