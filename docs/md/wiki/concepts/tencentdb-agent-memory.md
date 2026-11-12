---
title: "TencentDB Agent Memory：团队级 Agent 记忆中枢"
date: "2026-08-07"
source: "公众号"
---

# TencentDB Agent Memory：团队级 Agent 记忆中枢

> Agent 不再是一个个"一次性工具"——通过四类可复用资产（Chat Memory / Skill / Wiki / CodeGraph）+ Memory Hub 治理，让上一位 Agent 的学习成本被下一位继承。

## 核心定义

**TencentDB Agent Memory** 是腾讯开源的团队级 Agent 记忆与知识管理框架（MIT License，v2.0.0）。它把 Agent 工作中产生的内容整理为四类结构化资产，通过 Memory Hub 管理权限、版本和装配语义，让多 Agent 团队实现经验的继承与复用。

## 关键洞察

1. **Agent Memory 的核心矛盾不是"记不记得住"，而是"经验能不能被团队继承"**。跨会话记忆只是基础，真正减少返工的是跑通过的经验、读过的文档和理解过的代码。

2. **四层记忆架构（L0-L3）解决两个极端**：全量历史塞上下文（Token 膨胀）和不可追溯的总结（细节丢失）。保留了一条从高层判断回到原始证据的路径。

3. **Skill 才是复利的关键**：Chat Memory 是"记住发生过什么"，Skill 是"下次应该怎么做"。Skill 有版本、边界、步骤和验证规则，从"口口相传"走向"有版本、有边界、可验证的操作手册"。

4. **Memory Hub 解决的不是搜索，而是治理**：private/team/restricted/agent 四级可见性 + Agent Loadout，让共享记忆不等于共享全部信息。

## 四类资产对比

| 资产 | 解决的问题 | 代表场景 |
|------|-----------|---------|
| Chat Memory | 解释过的背景被重复解释 | 技术栈偏好、项目约束、决策历史 |
| Skill | 跑通过的经验下次从头摸索 | 排障流程、发布检查、安全 Review |
| Wiki | 读过的文档下次重新扫描 | 产品文档、设计方案、运维手册 |
| CodeGraph | 理解过的代码调用关系丢失 | 影响分析、调用链追溯、符号索引 |

## 记忆分层架构

- **L0 Conversation**：原始对话，回查原话与来源
- **L1 Atom**：事实、偏好、约束，精确召回
- **L2 Scenario**：围绕项目/场景的知识块，快速恢复上下文
- **L3 Core/Persona**：长期画像与稳定模式

召回策略：优先 L2/L3，需核对事实时通过 BM25 + 向量检索 + RRF 回到 L1/L0。

## 组件架构

| 组件 | 职责 |
|------|------|
| Memory Core | 记忆读写、鉴权、Skill/RAG 数据面 |
| Memory Hub | 团队资产管理面板 + Knowledge Service |
| Memory Proxy | 接收 Anthropic/OpenAI 协议，注入记忆/上下文 |

## 相关概念

- [[Agent 的本质：用 Token 换架构]] — Agent 控制流迁移的核心
- [[AI Coding 方法论：从自然语言编程到代码搬运工]] — Agent 编程方法论
- MCP 协议 — 工具调用标准化协议
- [[Harness Engineering]] — Agent 的工程化运行时环境

## 原文

TJ 撰写，介绍腾讯 TencentDB Agent Memory v2.0.0 的设计理念和架构。[原文链接](https://mp.weixin.qq.com/s/4qhafDFTzuPgXTIMHTUKRA)