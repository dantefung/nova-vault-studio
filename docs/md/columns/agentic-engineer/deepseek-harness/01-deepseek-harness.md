---
title: "Agent = Model + Harness：DeepSeek 把模型的「壳」开源了"
date: "2026-08-14"
source: "微信公众号：林大友"
url: "https://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=&idx=&sn="
---

# Agent = Model + Harness：DeepSeek 把模型的「壳」开源了

> DeepSeek Harness 专栏第 01 篇。核心公式：`Agent = Model + Harness`——模型是灵魂，Harness 负责给 Agent 理解环境、使用工具、在真实场景里持续干活的能力。

---

## 核心公式

> **Agent = Model + Harness**

模型是灵魂，Harness 负责给 Agent 理解环境、使用工具、在真实场景里持续干活的能力。

![DeepSeek Harness 主视觉](../../../wiki/images/deepseek-harness/001.png)

## 模型是脑子，Harness 是手脚

一个模型再聪明，它也只是一颗脑子。它不会自己打开文件、不会自己敲命令、不会自己上网查资料。这些「手脚」，就是 Harness 给的。

![模型是脑子，harness 是手脚](../../../wiki/images/deepseek-harness/002.png)

## 「一切皆插件」

模型、工具、技能、会话、沙箱、存储——所有 Agent 能力，都由插件组合而成，想换哪个换哪个。它不是「我帮你配好一套手脚」，而是「手脚的规格我定好了，你来拼」。

## 两个容易被忽略的细节

- **极简模式**：只保留 shell + 文件编辑两个工具，在最小化环境下做模型基准测试
- **会话可追溯**：append-only 日志，每次模型的输入输出都有据可查

> 📎 完整原文见知识库：[wiki/sources/deepseek-harness.md](../../../wiki/sources/deepseek-harness.md)

---

[← 专栏首页](./index.md) | [下一篇：Runtime 架构 →](./02-agent-runtime-architecture.md)