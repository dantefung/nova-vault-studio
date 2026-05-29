---
title: "LLM Wiki"
date: "2026-05-29"
source: "llm-wiki"
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

## 来源

- [llm-wiki SKILL.md](/.claude/skills/llm-wiki/SKILL.md)