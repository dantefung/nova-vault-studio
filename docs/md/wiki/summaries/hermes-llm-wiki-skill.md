---
title: "Hermes Agent LLM Wiki Skill（摘要）"
date: "2026-08-12"
source: "Hermes Agent 文档"
url: "https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/research/research-llm-wiki"
---

# Hermes Agent LLM Wiki Skill

> LLM Wiki 不是“用 AI 搜文档”，而是让 Agent 按固定协议持续维护一组可追溯、可审计、互相链接的 Markdown 文件。

<!-- more -->

## 一句话结论

Hermes 的实现把 Karpathy 的 LLM Wiki 从理念补全为运行规程：**先读 Schema、索引和日志完成定向，再执行 Ingest/Query/Lint，并用哈希、阈值、置信度和冲突标记控制知识质量。**

## 三层数据结构

| 层 | 所有者 | 作用 |
|----|--------|------|
| Raw Sources | 人类提供，Agent 只读 | 保存文章、论文、转录和资源，SHA-256 检测漂移 |
| Wiki Pages | Agent 维护 | 实体、概念、对比和有价值的查询结果 |
| Schema | 人与 Agent 共同约定 | 规定目录、frontmatter、标签、建页阈值和更新策略 |

核心数据流是：

```text
原始来源 → 检查已有知识 → 新建或更新页面 → 建立双向联系 → 更新索引和日志
```

## 最重要的五条规则

1. **每次先定向**：先读 `SCHEMA.md`、`index.md` 和最近日志，100 页以上还要全文搜索。
2. **原文可校验**：原始正文保存 SHA-256，再次抓取时识别未变化内容和来源漂移。
3. **建页有门槛**：中心主题或两个以上来源共同出现才建页；路过式名词不建页。
4. **矛盾不覆盖**：并列记录冲突观点，通过日期、来源、置信度和 `contradictions` 暴露不确定性。
5. **导航必须同步**：每次操作都更新 `index.md` 和只追加的 `log.md`。

## 三种核心操作

### Ingest：把来源编译进知识网络

先保存不可变原文，再搜索已有页面。满足阈值的概念才新建，否则更新已有页面。每个新页面至少链接两个相关页面，多来源综合要标注出处，弱证据要降低置信度。

### Query：优先复用已编译知识

查询从索引和全文搜索开始，再读取相关页面综合答案。只有以后还值得复用、重新推导成本高的答案才写回 Wiki，普通问答不落盘。

### Lint：主动发现知识腐烂

官方流程共 13 步：检查孤立页、坏链接、漏索引、frontmatter、过期信息、矛盾、低置信度、来源漂移、超长页、标签失控和日志膨胀，再按严重程度报告并追加 lint 日志。

## 与传统 RAG 的区别

| 维度 | 传统 RAG | LLM Wiki |
|------|----------|----------|
| 处理时机 | 每次查询临时检索和拼接 | 入库时编译并持续更新 |
| 关系 | 查询时临时推断 | 交叉引用持久保存 |
| 矛盾 | 容易在回答中被掩盖 | 显式记录并进入 lint |
| 维护 | 文档增长后靠人整理 | Agent 按 Schema 维护 |
| 产物 | 一次性答案 | 可复用的 Markdown 知识网络 |

## 对本仓库的启发

当前 Wiki 已具备来源、摘要、概念、索引和日志，但 Hermes 方案指出四个可继续加强的质量机制：

- 给来源正文增加哈希，识别网页后续变化。
- 给新概念设明确建页阈值，减少同义重复页。
- 给单一来源或快速变化结论增加置信度。
- 将孤立页、坏链接、漏索引和来源漂移纳入统一 lint。

这些是治理增强，不要求立刻重构现有目录。直接大改数百个页面只会制造迁移风险，先在新入库内容上采用更合理。

## 相关页面

- [[concepts/llm-wiki]] — 本仓库的 LLM Wiki 核心概念页
- [[concepts/ai-rd-automation-wiki-skill]] — LLM Wiki 在研发自动化中的落地
- [[concepts/harness-engineering]] — 用规则、门禁和验证约束 Agent

## 来源

- [Hermes Agent：Karpathy's LLM Wiki Skill](../sources/hermes-llm-wiki-skill.md)
