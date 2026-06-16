---
title: "FaaS Analogy for Agent Skills"
date: "2026-06-12"
source: "Agent skill 迭代式编写实战"
url: "https://mp.weixin.qq.com/s/59Z2eVOg914_bpRD6-WsYg"
---

# FaaS Analogy for Agent Skills

以 web 概念类比，skill 体系如 FaaS，专用 Agent 框架如 IaaS/SaaS。

## 映射关系

| Web 概念 | Agent Skill 体系 | 专用 Agent 框架 |
|----------|------------------|-----------------|
| IaaS/SaaS | 基于 langChain 等框架开发 | ReAct / LangGraph |
| FaaS | Agent Skill | 专用 Agent |

## Skill = FaaS

agent 工具作为基座已经提供了：
- skill 的发现与加载
- 基于 bash 的文本操作
- 脚本执行能力

skill 专注业务流程抽象就够了。

## 专用 Agent = IaaS/SaaS

需要：
- 自建 workflow
- 管理上下文
- 实现 tools
- 接入 MCP

## 何时选 Skill vs 专用 Agent

### Skill（FaaS）适合

- 零基础设施依赖
- 低部署成本
- 专业流程场景
- 确定性要求不那么高

### 专用 Agent（IaaS/SaaS）适合

- 需要更高准确性 / SLA
- 复杂有状态事务
- 长连接、高频低延迟
- 流程确定性要求 100%

## 本质

Skill 体系的本质：用文件系统结构 + 文本决策树，替代运行时服务（向量库、图引擎、路由服务），以零基础设施依赖换取极简部署。
