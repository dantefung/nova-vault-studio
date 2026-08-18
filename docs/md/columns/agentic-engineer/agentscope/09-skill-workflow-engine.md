---
title: "把 Agent 的「经验」固化为可复用的流程：Skill 与 Workflow 引擎"
date: "2026-07-28"
source: "微信公众号：老梁agent"
---

# 把 Agent 的「经验」固化为可复用的流程：Skill 与 Workflow 引擎

> AgentScope 迁移系列第 09 篇。工业 AI Agent 项目从 MVP 到生产级的架构演进——Skill 模块化与 Workflow 流程化。

---

## 文章要点

- Skill 接口：`chat()` / `skillName()` / `description()`，Spring 自动发现
- SkillTemplate 基类：PromptCompiler 运行时动态编译 System Prompt
- Workflow YAML 配置：七节点六边串行链（查告警 → 查数据 → 搜知识库 → 诊断 → 创建工单 → 审批 → 通知）
- 四种节点类型：EXPERT_CALL / TOOL_CALL / APPROVAL / NOTIFY
- 与 Router/Supervisor 协作：WORKFLOW 意图关键词匹配，工作流优先跳过 LLM 任务规划
- 核心观点：**「Skill 把能力模块化，Workflow 把模块流程化。确定性流程走引擎，开放性问题走推理。」**

> 📎 完整原文见知识库：[wiki/sources/agentscope-skill-workflow-engine.md](../../../wiki/sources/agentscope-skill-workflow-engine.md)

---

[← 上一篇：HarnessAgent](./08-harnessagent.md) | [下一篇：实战复刻 WorkBuddy →](./10-workbuddy.md)