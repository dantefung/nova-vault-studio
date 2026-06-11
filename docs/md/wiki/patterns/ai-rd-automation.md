---
title: "AI研发自动化（Wiki知识库+技能包）"
date: "2026-06-11"
---

# AI研发自动化（Wiki知识库+技能包）

> 阿里哥伦实战：把 AI 研发自动化拆成 LLM-Wiki 知识库（持续生长型）+ 领域专家 SKILL 包（写方案/写代码/评审/测试/答疑/排障），最终用户只给 PRD，剩下全交给 agent。

## Key Points

- **两条腿走路**：LLM-Wiki 知识库（持续生长型）+ 领域专家 SKILL 包
- **最终目标**：全自动研发流程——用户提供 PRD，剩下工作全交给 agent
- **团队视角**：成员共享，多 agent 平台可用

## LLM-Wiki 知识库

### KB 架构（三层）

| 层 | 内容 | 规则 |
|----|------|------|
| L1: Sources | 文档/图片/代码 | LLM 只读不写，真相之源 |
| L2: Wiki | markdown 文件集合（实体/概念/综述/对比页） | LLM 全权拥有，人只读不写 |
| L3: Schema | 目录约定、摄入流程、查询/巡检流程 | 写给 LLM 的"工作规范" |

### 核心操作

- **Ingest（摄入）**：丢一份新数据源 → LLM 读 → 与你讨论要点 → 写摘要页 → 逐一更新被影响的实体页/概念页 → 更新 index → 追加 log
- **Query（查询）**：基于 wiki 答题，好答案要写回 wiki
- **Lint（巡检）**：定期让 LLM 自检——找矛盾、找过时、找孤页

### LLM-Wiki vs RAG

| 维度 | 传统 RAG | LLM-Wiki |
|------|----------|----------|
| 知识形态 | chunks + 向量索引 | 结构化、互链的人类可读 markdown 页面 |
| 核心动作 | Retrieve → Generate | Ingest → Read |
| 知识增长 | 线性 | **复利式** |
| 答案质量 | 随用增长不变 | 持续变好 |

**关键洞察**：Wiki 是一个持续编译、持续保鲜的产物（compounding artifact），不是查询时才生成的临时答案。

## Skill 包设计

每个 Skill 都是一个 SKILL.md 文件，描述"在什么场景、用什么方法、调什么工具、输出什么产物"。

## Related Pages

- [concepts/llm-wiki](concepts/llm-wiki) — LLM Wiki 知识库模式
- [patterns/ai-knowledge-workflow](patterns/ai-knowledge-workflow) — AI知识管理工作流

## Sources

- 微信公众号《AI研发自动化：Wiki知识库+技能包》(2026-06-04)