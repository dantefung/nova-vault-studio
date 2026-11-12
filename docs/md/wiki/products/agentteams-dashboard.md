---
title: "AgentTeams Dashboard"
date: "2026-10-19"
source: "微信公众号与开源项目"
url: "https://github.com/agentteams-group/agentteams-dashboard"
---

# AgentTeams Dashboard

> 面向多 Agent 团队的开源控制面，统一管理组织权限、项目任务、能力资产、运行时和外部编码 CLI 执行记录。

## Core Capabilities

- **组织管理**：管理 Human 用户、Team Leader、Worker、团队关系和访问权限。
- **项目管理**：Project/Task 两级看板，展示依赖、阻塞、状态历史、结果和产物。
- **能力资产**：集中管理 Skill、MCP 服务、模型与网关路由，支持团队分发和技能热加载。
- **运行时控制**：查看和调整 Worker 会话、执行循环、频道、模型、工具与升级状态。
- **编码工具治理**：管理 Qwen Code、OpenCode、Qoder 等 CLI 的安装、授权、执行参数、日志和受阻记录。
- **审计与人工介入**：权限变化、项目暂停恢复、任务改派和执行过程均有结构化记录。

## Product Model

AgentTeams 的协作界面分成两个互补表面：

- **Matrix 是对话面**：人类与 Agent 讨论、派发和协作。
- **Dashboard 是控制面**：查看资源、状态、依赖、配置和执行证据。

这种分层避免让聊天记录承担全部项目状态，也让人工审批和治理拥有确定的结构化入口。

## Four Management Planes

| 管理面 | 核心对象 | 解决的问题 |
|--------|----------|------------|
| 组织面 | User、Team、Leader、Worker、Permission | 谁能访问和管理什么 |
| 工作面 | Project、Task、Dependency、Timeline | 团队正在做什么、哪里阻塞 |
| 资产面 | Skill、MCP、Model、Gateway | Agent 能调用什么能力 |
| 运行面 | Runtime、Session、Coding CLI、Execution | Agent 实际如何运行、执行了什么 |

## Version Snapshot

- AgentTeams：v1.2.5
- Dashboard：v1.3.1
- 主要 Worker：QwenPaw；同时保留 OpenClaw、Hermes 等路径
- 实验性 Worker：DeepSeek Harness
- Coding CLI：Qwen Code、OpenCode、Qoder

版本持续迭代，以上是 2026-10-19 归档文章对应的快照。

## Use Cases

- 管理由多个不同运行时 Agent 组成的团队。
- 让产品、研发或运营人员通过项目看板介入 Agent 工作。
- 将 Skill 和 MCP 从个人配置升级为团队资产。
- 追踪外部编码 CLI 的执行日志与结果。
- 对 Agent 权限、任务状态和运行时升级建立审计记录。

## Boundaries

- Dashboard 是管理控制面，不替代 Matrix 等协作对话通道。
- 多运行时支持程度取决于具体 Worker 实现。
- DeepSeek Harness 在该版本中仍属于实验性 Worker。
- 文章是功能介绍，不包含规模化生产负载、故障率或安全评测数据。

## Related Pages

- [[concepts/agentscope-managed-agents]]
- [[concepts/agentscope-multi-agent]]
- [[concepts/agentscope-skills]]
- [[concepts/agentscope-governance]]
- [[products/deepseek-harness]]

## Sources

- [[sources/agentteams-dashboard]]
- [AgentTeams](https://github.com/agentscope-ai/AgentTeams)
- [AgentTeams Dashboard](https://github.com/agentteams-group/agentteams-dashboard)
