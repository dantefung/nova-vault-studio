---
title: "Open Multi-Agent — TypeScript 原生多 Agent 编排框架"
date: "2026-05-20"
source: "GitHub open-multi-agent"
url: "https://github.com/open-multi-agent/open-multi-agent"
---

# Open Multi-Agent — 多 Agent 编排框架

> From a goal to a task DAG, automatically. ⭐ 6.2k | 🍴 2.4k | MIT | 仅 3 个运行时依赖。

---

## 一句话

给一个目标，Coordinator Agent 自动拆解成任务 DAG，并行化独立任务，合成结果。TypeScript 原生，嵌入式。

```ts
const result = await orchestrator.runTeam(team, "Create a REST API for a todo list in /tmp/todo-api/")
console.log(result.success, result.totalTokenUsage.output_tokens)
```

---

## 三种运行模式

| 模式 | 方法 | 场景 |
|------|------|------|
| 单 Agent | `runAgent()` | 一个 Agent 一个 prompt |
| 自动编排团队 | `runTeam()` | 给目标，Coordinator 拆 DAG 执行 |
| 显式流水线 | `runTasks()` | 手动定义任务图 |

---

## 核心能力

| 能力 | 说明 |
|------|------|
| **Goal-driven Coordinator** | 一句话目标 → 自动任务 DAG → 并行执行 → 合成结果 |
| **10 Provider** | Anthropic, OpenAI, Azure, Bedrock, Gemini, Grok, DeepSeek, MiniMax, Qiniu, Copilot + OpenAI-compatible |
| **工具 + MCP** | 6 内置工具(bash/file_*/grep/glob) + `defineTool()` + Zod + MCP |
| **流式 + 结构化输出** | Token 级流式，Zod 验证最终答案，解析失败自动重试 |
| **可观测性** | `onProgress` 事件 + `onTrace` span + HTML Dashboard |
| **共享内存** | 默认 in-process KV，可换 Redis/Postgres/Engram |
| **生产控制** | maxTurns, contextStrategy, 任务重试+退避, loop检测, maxTokenBudget |

---

## 对比竞品

| 框架 | 思路 | 何时选 |
|------|------|--------|
| **LangGraph JS** | 图优先（手动声明 nodes/edges） | 固定拓扑 + 成熟 checkpoint |
| **Mastra** | Supervisor 手接线 | 工作流已知，要显式控制 |
| **CrewAI** | Python 多 Agent | Python 技术栈 |
| **Vercel AI SDK** | LLM 调用层 | 单 Agent / 前端 AI 功能 |
| **open-multi-agent** | **目标优先**（自动拆 DAG） | TypeScript 后端，给目标不写图 |

---

## 架构

```
OpenMultiAgent (Orchestrator)
  └─ Team (AgentConfig[] + MessageBus + TaskQueue + SharedMemory)
       ├─ AgentPool (Semaphore, runParallel)
       ├─ TaskQueue (依赖图、自动解阻塞、级联失败)
       └─ Agent → AgentRunner → ToolRegistry / LLMAdapter (10 providers)
```

---

## 关键数据

- 发布：2026-04-01，v1.4.1 (2026-05-18)
- 244 commits，25+ contributors
- 已知生产用户：temodar-agent（WordPress 安全分析）
- 集成：Engram (AI memory), AgentSonar (sidecar 检测)
