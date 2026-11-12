---
title: "HarnessAgent：为 ReActAgent 装上操作系统——从 CPU 到操作系统，Harness 的四大子系统深度解析"
date: "2026-07-30"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/PQJD5cGydyOhgYHD88LJfA"
---

# HarnessAgent：为 ReActAgent 装上操作系统

> AgentScope 迁移系列第 11 篇。ReActAgent 是一颗纯粹的 CPU——只懂「取指→译码→执行」的无限循环。HarnessAgent 就是它的操作系统内核。

---

## 核心观点

> **ReActAgent 是 CPU，HarnessAgent 是操作系统。**

| 操作系统概念 | HarnessAgent 实现 | 解决的问题 |
|-------------|------------------|-----------|
| 进程管理（PCB） | Session + Redis | 多租户隔离、宕机恢复 |
| 文件系统（VFS） | Workspace + AGENTS.md | 长期记忆、持久化存储 |
| 内存管理（Swap） | Compaction + Memory | 防止 Token 溢出 |
| 安全隔离（Ring0/3） | Docker Sandbox + OSS | 安全执行、故障隔离 |
| 进程间通信（IPC） | Subagent 编排 | 任务分解、Agent 协作 |

## 四种部署场景

- **本地开发**：单机、无持久化、无隔离
- **SaaS 多租户**：Session 持久化 + 容器隔离
- **企业集群**：分布式存储 + 故障转移

> 📎 完整原文见知识库：[wiki/sources/agentscope-2.0-harnessagent-os-architecture.md](../../../wiki/sources/agentscope-2.0-harnessagent-os-architecture.md)

---