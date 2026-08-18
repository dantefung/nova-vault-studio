---
title: "Agent = Model + Harness 公式"
date: "2026-08-14"
---

# Agent = Model + Harness 公式

> DeepSeek 开源 DeepSeek Harness（`dsh`），提出 Agent = Model + Harness 公式：模型是灵魂，Harness 是手脚。真正拉开 AI 体验差距的，可能不在模型本身，而在模型的"壳"——也就是 Harness 层。

<!-- more -->

## 核心定义

| 组成部分 | 角色 | 功能 |
|----------|------|------|
| **Model** | 灵魂 / 脑子 | 提供智能和推理能力 |
| **Harness** | 手脚 / 壳 | 让 Agent 理解环境、使用工具、在真实场景里持续干活 |

> **Agent = Model + Harness**

## 关键洞察

### 1. Harness 决定体验

同样是"很聪明"的模型，套上不同的 Harness，干活的体验可能完全不一样。模型没变，变的是 Harness。

### 2. 一切皆插件

DeepSeek Harness 把 Agent 能力全部拆成插件：模型、工具、技能、会话、沙箱、存储……"手脚的规格我定好了，你来拼"。不用改源码，在配置层就能选择、替换、扩展任意能力。

### 3. 极简模式——测试模型真实能力

只保留 shell + 文件编辑两个工具，做最小化基准测试。剥掉工具干扰后测出来的才是模型的真实能力，体现了对"公平"的在意和对自己模型能力的自信。

### 4. 可追溯会话——Agent 的行车记录仪

模型看到的、调用的、上下文注入的，全部写入会话日志，可恢复、分叉、回放。解决 Agent 调试的核心痛点。

### 5. 生态战略——定地基，圈生态

DeepSeek 开源 Harness 是在给"Agent 基础设施"定标准。模型会迭代、会换，但"这套插槽规格"一旦成为默认地基，生态就围着它转。

## 作者金句

> 发动机的马力很重要。但底盘调得好不好，可能才是那辆车好不好开的答案。

> 下次再看到"XX 模型更聪明了"的新闻，可以问一句：它能干活了吗？

## 与 Claude Code / Codex 的关系

林大友在文中对比了 Claude Code 和 Codex 的体验差异——同样是"聪明"的模型，在不同的工具壳下表现完全不同。DeepSeek Harness 的开源，为这种"壳"的体验比较提供了更多变量。

## 参考来源

- [Agent = Model + Harness：DeepSeek 把模型的「壳」开源了](../sources/deepseek-harness.md) — 林大友，微信公众号

## 相关概念

- [Pi AI 编程 Agent](../sources/pi-ai-coding-agent-popularity.md) — 另一个轻量级 Agent 框架
- 数据治理五大概念
- Harness 工程