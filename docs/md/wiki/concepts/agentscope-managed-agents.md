---
title: "AgentScope 2.0 Managed Agents：企业级 Agent 运行时底座"
date: "2026-08-08"
source: "刘军《专为 Managed Agents 而生的 Harness 底座：AgentScope 2.0》精读"
---

# AgentScope 2.0 Managed Agents：企业级 Agent 运行时底座

## 一句话洞察

Managed Agents 把 Agent 的 Harness 责任从业务开发者转移到平台——开发只需定义 Skills、Tools、Subagents 和权限策略，而压缩时机、会话恢复、工具结果淘汰等交给统一 Harness 持续演进。核心架构是 **Brain（推理编排）+ Hands（工具执行）分离**，AgentScope 2.0 的 HarnessAgent 提供内核，平台补上多租户、版本、审计等 SaaS 治理。

## 核心概念

### Brain vs Hands 分离

| 组件 | 职责 | 位置 |
|------|------|------|
| **Brain** | 推理编排、状态恢复、上下文管理 | Managed 集群 |
| **Hands** | 接触文件、网络、业务系统（工具执行） | Cloud Sandbox 或客户 VPC |

模型决定"要调用什么"≠ 模型进程必须"亲自执行什么"。工具调用被表示为稳定 schema + tool_use_id + 结果事件后，Hands 可迁移到不同信任边界，不改变 Brain 的推理循环。安全团队可以分别回答：模型能看到哪些上下文？工具能访问哪些网络/文件？结果中哪些可回传 Brain？

### Anthropic 三层递进方案

| 层 | 产品 | 状态归属 |
|----|------|---------|
| CLI | Claude Code | 本地工作区、终端、会话 |
| SDK | Claude Agent SDK | Session/事件流/工具交互 API 化，租户/资源隔离由接入方负责 |
| **Managed Agents** | 托管平台 | Agent/Environment/Session/执行面成为托管资源，平台处理版本、权限、运行时治理 |

## 关键机制

### 三种 Worker 执行模式

| 模式 | Brain 位置 | Hands 位置 | 适用场景 |
|------|-----------|-----------|---------|
| **Local** | Managed 集群 | 集群宿主机 | 开发联调、可信内网 |
| **Cloud Sandbox** | Managed 集群 | FC Sandbox / E2B 沙箱 | 隔离执行环境，平台控制沙箱生命周期 |
| **Self-hosted** | Managed 集群 | 客户 VPC 内 Worker | 企业资源留客户边界内，客户 Worker 主动出站 poll |

Local 模式：文件系统、shell 都在托管集群宿主机命名空间内，适合开发联调。
Cloud Sandbox：Brain 通过 E2B 协议申请沙箱容器，创建→执行→回收/持久化三步，`isolationScope=SESSION` 隔离不同 Session。
Self-hosted：Brain 收到 `tool_use` 后挂起，通过 work queue + Worker 协议回传结果。Work 状态机：queued → starting → active → stopping → stopped。

### 控制面、数据面、Worker 三层职责

**控制面**：管"定义与权限"。管理 Agent 定义及版本，Model/Skills/MCP/Tools/Environment 等资源按"定义、引用、挂载"三种关系组织。承担变更治理（版本、key rotate、archive、权限审计）。

**数据面**：管"跑起来并记下来"。承载模型调用、ReAct loop、Harness hooks、turn 租约、Session 状态机、事件持久化、SSE 推送、interrupt/HITL。由对等 SaaS 副本组成，通过 RuntimeContext（userId+sessionId）定位会话状态。

数据面托管四类状态生命周期：
1. 短期 brain state（AgentStateStore，可恢复的推理上下文）
2. 中期 session 事件（append-only 事件日志，审计证据）
3. 长期文件/workspace（FileSystem 后端，工具副作用结果）
4. 持久记忆（Memory Store，跨 session 的长期记忆）

**Worker**：管"在谁的机器上动手"。全托管：Brain 主动创建沙箱、执行、回收。Self-hosted：客户 Worker 主动 poll，执行工具并回传。

### AgentScope 2.0 的核心贡献

- HarnessAgent 在 ReActAgent 之上通过 Hook 装配工程默认项（压缩、持久化、Skills、Subagents）
- 统一文件系统抽象（AbstractFileSystem）：本地、远程 KV、云沙箱走同一套工具语义
- 逻辑工作区与物理执行面分离，Agent 定义不改就能切换隔离策略
- HarnessAgent 与 Session 生命周期分离：节点挂掉丢弃 Java 对象，对话与记忆从共享状态恢复

## 与已有知识的关联

- 与 [[agentscope-skills]] 相关：Skills 是 AgentScope 2.0 的确定性协处理器，本文是 Managed Agents 平台层架构。
- 与 [[agentscope-layering]] 相关：HarnessAgent 三层架构在 Managed Agents 中的产品化升级。
- 与 [[agentscope-governance]] 相关：Managed Agents 将治理（权限、审计、版本）提升为平台层能力。
- 与 [[harness-engineering]] 相关：Harness 从工程实践升级为平台底座，Brain/Hands 分离是核心模式。
- 与 [[agentscope-enterprise-platform]] 相关：Agent Builder → Managed Agents 的产品化升级路径。
- 与 [[claude-skills]] 相关：Claude Managed Agents 是本文的参照系，三层递进方案（CLI→SDK→Managed）直接对应 Anthropic 产品线。

## 一句话点评

本文最核心的洞见是 **Brain/Hands 分离**——它解决了企业采纳 Agent 时最头疼的安全问题：模型可以访问知识库和工具，但工具执行可以放在客户 VPC 里。AgentScope 2.0 通过 HarnessAgent + AbstractFileSystem 让这种分离对 Agent 业务定义透明，是 Managed Agents 落地的关键工程保障。