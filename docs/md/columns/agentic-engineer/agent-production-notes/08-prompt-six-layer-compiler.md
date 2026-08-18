---
title: "告别硬编码 System Prompt：Prompt 六层编译引擎设计与实现"
date: "2026-07-17"
source: "微信公众号：老梁agent"
---

# 告别硬编码 System Prompt：Prompt 六层编译引擎设计与实现

> 生产实战笔记系列第 08 篇。MVP 的 System Prompt 是一块铁板，生产级的 System Prompt 是一套编译管线——六层独立组装，每一层都可替换、可热更、可观测。

---

## 一个 @SystemMessage 能有多大问题？

硬编码的 System Prompt 改一个字就要改代码、编译、重启、发版。但生产环境中角色策略、安全规则、工具列表、记忆策略都在变，不可能每次都走发布流程。

## 六层编译模型

| 层 | 名称 | 数据来源 | 动态策略 |
|----|------|---------|---------|
| L1 | **角色定义** | 配置文件 | 按 Agent 类型切换 |
| L2 | **安全策略** | 规则引擎 | 动态加载，热更新 |
| L3 | **工具契约** | ToolRegistry 自动生成 | 注册即生效 |
| L4 | **记忆上下文** | MemoryManager 接入 | 按层取用 |
| L5 | **知识库检索** | RAG 钩子 | 按需注入 |
| L6 | **任务指令** | ReAct 工作流 + 输出格式 | 模板化 |

## 热更新

改 Policy 不需要重新部署。日志里直接看到六层产物，`prompt_hash` 随内容变化，可追溯每个请求用的是哪个版本的 Prompt。

> 📎 完整原文见知识库：[wiki/sources/prompt-six-layer-compiler.md](../../../wiki/sources/prompt-six-layer-compiler.md)

---

[← 上一篇：记忆模型](./07-agent-memory-four-tier.md) | [下一篇：调度并发 →](./09-agent-scheduling-concurrency.md)