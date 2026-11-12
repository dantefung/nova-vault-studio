---
title: "DeepSeek Harness 是自进化 Agent 的基石——从 To Developer 到 To Agent"
date: "2026-08-20"
source: "微信公众号：Cage、Daniel"
url: "https://mp.weixin.qq.com/s/g6wTg7SVXbHrjdX4aEJQxg"
---

# DeepSeek Harness 是自进化 Agent 的基石

> DSH 发布的是可以热重载的 Harness，设计成适合 coding agent 自己去修改、进化的形态。没有去和 Claude Code/Codex/WorkBuddy 竞争产品，而是延续了一以贯之的思路：**开源、Infra 化**。

---

## 三层架构理解

| 层级 | 内容 | 说明 |
|------|------|------|
| **第一层** | 可直接使用的 coding agent | 本地 Web UI 入口，与 DS 模型适配度极高 |
| **第二层** | everything-is-a-plugin 构造框架 | 核心能力（含 agent loop）全部可自定义 |
| **第三层** | Cordis meta-framework | 热重载、自由组合、彻底遗忘与删除 |

## DSH vs Anthropic：两种不同的 Harness 哲学

| 维度 | Anthropic / OpenAI | DeepSeek |
|------|-------------------|----------|
| **研究问题** | Harness 本身的能力——已有 SOTA 模型如何设计 harness 架构表现最好 | Harness 的可塑性——harness 是流动的，如何最有效修改/替换/撤销组件 |
| **目标** | 在当前范式下做出最好的 agent 产品 | 押注下一个范式，将替换/组合/撤销 component 作为首要假设 |
| **商业模式** | 端到端垂直整合产品，增加 API 用户粘性 | 完全开放给开发者 |
| **形态** | 产品化 | Infra 化 |

> Anthropic 是在把 harness 做成最好的 Agent 产品；DeepSeek 是在研究 **meta harness**。

## Cordis：统一的插件机制

> Cordis 不好直接类比 MCP/Skills。它更像是 Claude Code 的 hooks、MCP、subagents 和内部核心 loop 全部统一成一种插件机制。

- 解决**动态组合问题**：组件在依赖出现/消失时重组
- 卸载时撤回由 context 管理的副作用
- 注重可组合性和生态扩展性，让 DSH 有点像**早期的 Unix**，拥有类似 OS 的高潜力上限

## Creator 模式

- 四个模式中最值得关注的
- 形式像**交互式 Agent Foundry**：允许开发者指导 agent 检查当前 runtime 试验插件，并创作新的 Agent preset
- 虽不是自进化系统，但可以收集 agent 用来学习自进化的数据
- 可能成为插件生态的创作入口

## 长期愿景：To Developer → To Agent

> DSH 把 harness 做成了对 agent 可以修改、热重载的对象，不是为了服务现在的 coding agent 需求，而是服务未来下一代的自进化和持续学习框架。

> 想象下一代 agent 在 long horizon task 中，一边执行任务，一边更换支撑自身运行的部件——**就像一艘持续航行的忒修斯之船**。

## 离真正的 Self-Evolve Harness 还有多远

**难点 1：保持系统自身的稳定性**

**难点 2：持续可靠的 eval**

**需要的完整 Learning Loop**：
1. Learning Loop 来学习并提出修改
2. Eval 评估修改的有效性

> 当前是 Harness-level RSI（可替换基础设施）的第一步：自身拆成可定位、可替换的组件。

---

## 核心结论

- DSH 已提供 agent runtime self-modification 的底座
- 缺 Learning Loop + Eval 才能形成完整闭环
- Anthropic/OpenAI 研究 Harness 能力；DeepSeek 研究 Harness 可塑性（meta harness）
- 未来 agent 可能在 long horizon 中持续更换自身运行部件（忒修斯之船）

> 📎 完整原文见知识库：[wiki/sources/dsh-self-evolving-foundation.md](../../../wiki/sources/dsh-self-evolving-foundation.md)

---


[← 上一篇：07、OpenAI开源Codex Harness](./07-codex-harness-open-source.md) | [→ 专栏首页](./index.md)
