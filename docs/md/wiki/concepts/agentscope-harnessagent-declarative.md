---
title: "AgentScope HarnessAgent：声明式策略统一管理 Skill/MCP/@Tool/SubAgent"
date: "2026-08-08"
source: "唐成《从源码拆解 AgentScope Java 2.0 的 HarnessAgent》精读"
---

# AgentScope HarnessAgent：声明式策略统一管理 Skill/MCP/@Tool/SubAgent

## 一句话洞察

AgentScope Java 2.0 用一套"声明式策略 + 中间件治理"把 Skill、MCP、@Tool、SubAgent 四种异构资源驯服成一种。HarnessAgent 通过**组合/委托而非继承**，把裸的 ReActAgent 升级为生产级——核心推理逻辑一行不改，外面套上中间件、工具、权限和技能。

## 核心概念

### 声明式三段式架构

1. 无状态 ReAct 推理内核——只负责"想"
2. 组合式工程组装层——负责"干"
3. 按需插拔的能力包——负责"配"

统一装配入口在 `HarnessAgent.Builder.build()`。第一原则：**声明的归声明，装配的归装配**。

### 四种资源的统一抽象

| 资源 | 声明方式 | 注册方式 | 运行时 | 动态程度 |
|------|---------|---------|--------|---------|
| Skill | 目录文件 | build() 自动装配 | HarnessSkillMiddleware 按需注入 | 最彻底（自助+治理+多来源） |
| MCP | tools.json + 白名单 | 自动注册 | 权限六步评估管线 | 保守（编程式，无自助工具） |
| @Tool | 注解 + 反射 | 反射注册 | tool_calls 名字分发 | — |
| SubAgent | 程序化 frontmatter | AgentSpawnTool spawn | DynamicSubagentsMiddleware | 默认动态 |

**贯穿主线：声明式注册 + 统一工具抽象 + 权限/上下文中间件治理**——这就是企业级 Agent 与裸 ReAct 的分水岭。

## 关键机制

### Skill：目录优先、内容后取

`HarnessSkillMiddleware` 渲染 `available_skills` 块，每轮只注入"路径 + 摘要"，LLM 需要时再 `load_skill_through_path(SKILL.md)` 拉全文。把无关字节挡在 prompt 之外，控制上下文长度。

### Workspace：所有"文件化"资源

角色 = `AGENTS.md`、记忆 = `MEMORY.md`、技能 = 技能目录。由 `WorkspaceContextMiddleware` 每轮拼进 system prompt。可被 Git 管理，可热更新。

### MCP 权限六步评估管线

deny → ask → 工具自检 → allow → BYPASS → 默认。`PermissionMode` 有 `BYPASS` 与 `DONT_ASK` 两条快车道。**自动注册 != 自动放行**。

### @Tool 本质

注解声明、反射注册、JSON schema、名字分发。与 LangChain/LangGraph 的 ToolNode 字典分发底层共识一致。

### SubAgent 三点

防止无限套娃、LLM 读描述判断委派、spawn 超时收编为后台任务（工程兜底）。

### Middleware 生命周期

Filter 式设计，4 个环绕（洋葱）钩子 + 1 个管道钩子，类似 Spring `@Around`；call/stream 合一，用 accumulator 避免二次拼接。规则统一、可组合、可中断。

## 静态 vs 动态的权衡

动态能力分层：**SKill > SubAgent > MCP**。越危险的能力，越不轻易交给模型自助。

- Skill 动态最完整：`enableSkillManageTool()` 自助 CRUD + `enableSkillCurator()` 治理（SkillSecurityScanner 安全扫描 + SkillAuditLog 审计 + 晋升门）
- 已知边界：`load_skill_through_path` 只认 build() 时预注册的 skill-id，同会话新建 skill 加载不到（"自助创建"与"自助发现"的缝隙）
- MCP 最保守：MCP 服务端常带凭证/网络访问，留给宿主代码控制

## 与已有知识的关联

- 与 [[agentscope-layering]] 相关：本文是 AgentScope 源码系列的 HarnessAgent 深入篇，三层架构（ReAct 内核/工程层/能力包）的具体实现。
- 与 [[agentscope-skills]] 相关：Skills 的加载机制（HarnessSkillMiddleware、load_skill_through_path）正是上篇"动态链接器"的底层实现。
- 与 [[agentscope-managed-agents]] 相关：本文的静态声明 vs 动态下发，是 Managed Agents 平台层的资源治理基础。
- 与 [[agentscope-governance]] 相关：权限六步评估管线是治理子系统"权限六步管线"的延续。
- 与 [[harness-engineering]] 相关：Harness 中间件设计（Filter/洋葱钩子）是 harness 工程的核心范式。

## 一句话点评

本文最有价值的是把四种异构资源（Skill/MCP/@Tool/SubAgent）收敛为"统一工具抽象"，并给出"越危险的能力越不交给模型自助"的动态分层原则。这是判断一个 Agent 框架是否生产级的试金石——**自动注册不等于自动放行**。