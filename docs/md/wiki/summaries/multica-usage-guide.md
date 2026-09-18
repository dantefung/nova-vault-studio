---
title: "Multica 实战使用手册精读摘要"
date: "2026-09-16"
source: "君哥的学习笔记"
url: "https://www.it235.com/ai/multiagent/mutlica_usage.html"
---

# Multica 实战使用手册精读摘要

## 核心结论

Multica 将产研团队的日常迭代通过标准化模型进行多智能体编排：从「工作空间（业务隔离）」、「项目（迭代）」、「Issue（任务粒度）」、「运行时（底层干活 CLI）」到「智能体（逻辑层）」与「Squad 突击小队路由」，构筑起能够减少人工干预、自我验收并持续成长的企业级 Agent 研发闭环。

## 7 大核心概念扫盲

1. **工作空间（Workspace）**：对应业务线或业务域（如教学、结算、CRM）。硬性隔离 Token 消耗、任务列表与智能体配置。
2. **项目（Project）**：对应敏捷迭代，每个项目是一批 Issue 的聚合。
3. **Issue（任务卡片）**：研发的基本单元，支持父子级联。子 Issue 完成后自动回传并唤醒父任务继续推进；支持在评论区通过 `@` 触发特定 Agent 或人员。
4. **运行时（Runtime）**：底层干活的物理 CLI（Claude Code、Codex、Cursor 等），由本地 Daemon 托管。
5. **智能体（Agent）**：配置了专属 System Prompt、挂载了特定 Skill 和 MCP 的逻辑角色。多个 Agent 可以复用同一个底层 Runtime。
6. **Squad（突击小队路由）**：规模化协同的核心。用户无需直接指定具体个人，而是 `@FrontendTeam`，由 Leader Agent 内部协商分发。
7. **Skills / MCP**：可在工作空间内跨项目复用的工程技能与数据工具。

## 企业接入两大流派

- **流派 1：全新单开一桌**：完全放弃旧看板，全员（人+Agent）直接在 Multica 看板上接发任务，协同体验最纯粹。
- **流派 2：渐进式嫁接结合**：主系统依然使用 Jira / 禅道，通过 Webhook 将特定编码子任务自动化同步到 Multica，由 Agent 跑完后以 PR 形式交回。

## Related Pages

- [[sources/multica-usage-guide]]
- [[sources/multica-self-hosted-deployment]]
- [[sources/multica-agent-project-manager]]
- [[sources/multica-managed-agents-practice]]
