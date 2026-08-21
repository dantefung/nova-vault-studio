---
title: Hello Harness
date: "2026-08-19"
source: "微信公众号：一灰灰blog"
---

# Hello Harness

> 从 0 到 1 手写一个 AI Agent Harness——纯 TypeScript，不依赖任何框架。本系列通过「遗留问题 → 解决问题 → 得到收获」的递进式写作，逐步构建出完整的 Agent 运行时。

> 📦 项目地址：[github.com/liuyueyi/hello-harness](https://github.com/liuyueyi/hello-harness)

---

## 阅读路线

```
Stage 0  →  模型接口封装（说/写/流式）
Stage 1  →  Function Calling + Tool + Agent Loop
```

---

## 文章列表

| # | 文章 | 日期 | 主题 |
|---|------|------|------|
| 04 | [Model Provider 抽象：Agent 不应该知道 OpenAI / Anthropic / Gemini 的区别](./04-model-provider.md) | 08-18 | 第一次架构抽象，定义与 Provider 无关的 Model 接口 |
| 05 | [Function Calling：让模型第一次产生结构化动作 ToolCall](./05-function-calling.md) | 08-19 | 从「只会说」到「能动手」的关键一步 |
| 07 | [Tool Result：把工具结果喂回模型，形成完整循环](./07-tool-result.md) | 08-21 | 四种消息类型，提议→执行→回写→再问 |

> ⏳ 待补：01 项目初识 / 02 第一次模型调用 / 03 上下文管理 / 06 第一个 Tool

---

## 参考资料

- [hello-harness 官方仓库](https://github.com/liuyueyi/hello-harness)
- [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)