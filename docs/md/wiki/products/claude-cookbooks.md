---
title: "Claude Cookbooks（Anthropic官方使用菜谱集）"
date: "2026-06-11"
---

# Claude Cookbooks（Anthropic官方使用菜谱集）

> A collection of notebooks/recipes showcasing some fun and effective ways of using Claude. 44.9k Stars，Anthropic 官方出品。

## Key Points

- **产品定位**：Claude Cookbooks 是 Anthropic 官方的 Claude 使用菜谱集，提供可直接拷贝集成的代码示例和指南
- **代码形式**：以 **Jupyter Notebook** 为主，概念可迁移到任何支持 Claude API 的语言
- **官方维护**：有活跃贡献流程

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

### Advanced Techniques（高级技巧）

- **Sub-agents**：Haiku 作为 Opus 的子 Agent
- **PDF Upload**：解析并以文本传给 Claude
- **Automated Evaluations**：用 Claude 做 Prompt 评估
- **JSON Mode**：确保稳定 JSON 输出
- **Prompt Caching**：高效 Prompt 缓存

## 目录结构

```
claude-cookbooks/
├── capabilities/         # 核心能力示例
├── tool_use/           # 工具使用
├── third_party/        # 第三方集成
├── multimodal/         # 多模态（图像处理）
├── coding/            # 编码相关
├── extended_thinking/ # 扩展思考
├── finetuning/        # 微调
├── patterns/agents/   # Agent 设计模式
└── skills/            # Agent Skills 相关
```

## 数据

- **44.9k Stars** · **5.2k Forks** · **561 Watchers**
- **581 Commits**
- 94.9% Jupyter Notebook · 4.6% Python

## Related Pages

- [patterns/prompt-engineering](patterns/prompt-engineering) — Prompt 工程模式
- [products/codex-skills](products/codex-skills) — Codex Skills精选列表

## Sources

- GitHub anthropics/claude-cookbooks (2026-06-04)