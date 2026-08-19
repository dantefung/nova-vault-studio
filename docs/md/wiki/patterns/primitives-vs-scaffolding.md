---
title: "原语优先 vs 脚手架完整：Agent 工具设计的两种极端"
date: "2026-08-18"
source: "基于微信公众号：苏三说技术 的 Wiki 推导"
url: ""
---

# 原语优先 vs 脚手架完整：Agent 工具设计的两种极端

> 当 Claude Code 用 14000 Token prompt + 10+ 内置工具时，Pi 用 200 Token prompt + 4 个原语工具（read/write/edit/bash）就能跑出同侪最佳成绩——这背后是 Agent 工具设计的两种截然不同的范式。

## Problem Context

Agent 框架都在解决同一个问题：让 LLM 能可靠地完成真实任务。但解决方式分裂为两种：
- **脚手架完整派**：内置子代理、计划模式、MCP、权限弹窗、TODO 管理——认为"工具越完整，模型越省心"
- **原语优先派**：只给最少工具（read/write/edit/bash + 系统提示词），认为"模型足够强，工具越少成本越低"

两种范式在 2026 年的代表：Claude Code / DSH（脚手架完整）vs Pi（原语优先）。

## Solution

### 原语优先（Pi 哲学）

- **核心**：4 个原语工具（read/write/edit/bash）+ 200 Token 系统提示词
- **设计原则**：bash 是最通用的工具接口；模型已被 RL 训练得足够好，不需要教它怎么当 Agent
- **结果**：缓存命中率 99.93%、DeepSeek V4 Flash 跑 Terminal-Bench-2.0 得 66.7%、$0.028/任务

### 脚手架完整（Claude Code / DSH 哲学）

- **核心**：10+ 内置工具（MCP、子代理、计划模式、权限弹窗、TODO 管理、可观测性）+ 14000 Token 系统提示词
- **设计原则**：明确指令 + 受控流程 = 可预测行为；适合企业级审计与合规
- **结果**：稳定、可解释、适合复杂业务；代价是 prompt 长、成本高、缓存命中率难突破

### 对比表

| 维度 | 原语优先（Pi） | 脚手架完整（Claude Code / DSH） |
|------|----------------|----------------------------------|
| 系统提示词 | 200 Token | 14000 Token |
| 内置工具数 | 4 个 | 10+ 个 |
| 缓存命中率 | 99.93% | 显著低于 Pi |
| 模型绑定 | 不绑定特定模型 | 通常锁定 OpenAI/Anthropic |
| 调试可解释性 | 弱（依赖模型推理） | 强（流程节点可观测） |
| 适配模型能力 | 需要强模型（推理自主） | 弱模型也能跑 |
| 适合场景 | 探索性编程任务 | 企业级落地、复杂业务 |

## Trade-offs

- **原语优先的成本优势**：缓存命中率 99.93% × 系统提示词仅 200 Token = 单任务成本 $0.028 vs 脚手架完整派的 5-10×。但这一优势在弱模型上不成立——弱模型没有"自主 Agent 推理"能力时，原语优先会彻底失效。
- **脚手架完整的工程优势**：所有流程被显式定义，团队新成员可以读 prompt + 工具 schema 理解系统行为；新人 onboarding 成本低。但脚手架本身需要维护——MCP 协议、计划模式、权限模型都在持续演化。
- **混合派的可能性**：未来可能出现"原语为底 + 必要脚手架为上层"的混合设计。例如 Pi 增加一条可选的子代理启动参数；DSH 把默认 prompt 从 14000 Token 压缩到 2000 Token。

## Related Pages

- [[summaries/why-people-use-pi]]
- [[summaries/dsh-tech-hype-or-not]]
- [[summaries/dsh-complete-guide]]
- [[summaries/dsh-vs-continuum-acp]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[patterns/plugin-first-agent-runtime]]
- [[patterns/dsh-four-modes]]
- [[patterns/graph-vs-agentic-java-frameworks]]
- [[concepts/harness-multiplier-effect]]
- [[concepts/agent-self-modification-closure]]

## Sources

- [[sources/why-people-use-pi]]：Pi 极简哲学与 Composio 8 Harness 横评
- [[sources/dsh-tech-hype-or-not]]：DSH 加法路线的代表