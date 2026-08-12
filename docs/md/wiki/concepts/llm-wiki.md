---
title: "LLM Wiki"
date: "2026-05-29"
source: "llm-wiki"
updated: "2026-08-12"
---

# LLM Wiki

## 概念定义

Vanenevar Bush 1945 年提出 Memex 概念：一种以人为中心、可联接的记忆扩展机器。LLM Wiki 将这一思想实现为：**由 LLM 维护的持久化、复利知识库**。

## 核心思想

传统知识库的问题：维护成本随内容增长而超线性增长，人类无法坚持更新交叉引用。LLM 不厌烦、不遗忘，一次 ingest 可触达 15 个文件。

## 三层架构

```
Raw Sources  →  Immutable source documents（文章、PDF、网页）
     ↓ Ingest
The Wiki     →  LLM-generated markdown files（实体页、摘要页、综合页）
     ↓ Query
The Schema   →  AGENTS.md / CLAUDE.md 约定，LLM 遵循的格式规范
```

## 目录结构

```
wiki/
├── index.md              # 内容目录
├── log.md               # 只追加记录
├── sources/             # 原始文档（不可变）
└── pages/
    ├── entities/        # 命名实体
    ├── concepts/        # 抽象概念
    ├── summaries/        # 来源摘要
    └── synthesis/        # 跨来源综合
```

## 工作流

**Ingest**：来源 → 摘要页 → 更新 index → 跨引用 → 追加 log
**Query**：index 定位 → 钻取页面 → 综合答案 → 有价值则写回 wiki
**Lint**：定期检查矛盾、过时断言、孤儿页面、缺失交叉引用

## 为什么有效

维护成本接近零——LLM 一次 ingest 可同时更新 10-15 个相关页面。

## 可执行治理规则

Hermes Agent 的 v2.1.0 实现补全了从理念到长期运行所需的约束：

- **先定向再操作**：每次会话先读 Schema、索引和最近日志；大型 Wiki 还要先全文搜索。
- **原文漂移检测**：来源正文保存 SHA-256，再次 ingest 时跳过未变化内容并标记变化。
- **页面创建阈值**：中心主题或两个以上来源共同出现才建页，路过式提及不建页。
- **显式处理不确定性**：用 `confidence`、`contested` 和 `contradictions` 记录证据强弱与冲突，不静默覆盖。
- **知识库 lint**：检查孤立页、坏链接、漏索引、过时信息、矛盾、低置信度、来源漂移、超长页面、标签失控和日志轮转。

这些规则解决的是知识库增长后的真实问题：没有准入阈值会产生重复页面，没有来源哈希无法发现原文变化，没有冲突标记会把不确定判断固化为事实。

## 相关页面

- [[concepts/ai-rd-automation-wiki-skill]] — LLM Wiki 在研发流程中的工程化应用
- [[concepts/harness-engineering]] — 通过规则、门禁和反馈约束 Agent
- [[sources/llm-wiki-product]] — LLM Wiki 的桌面产品化实现

## 来源

- [llm-wiki SKILL.md](../../.claude/skills/llm-wiki/SKILL.md)
- [Hermes Agent：Karpathy's LLM Wiki Skill](../sources/hermes-llm-wiki-skill.md)
- [Hermes Agent LLM Wiki Skill 摘要](../summaries/hermes-llm-wiki-skill.md)
