---
title: "深入解析 DeepSeek Harness 插件运行机制"
date: "2026-08-14"
source: "微信公众号"
---

# 深入解析 DeepSeek Harness 插件运行机制

> DeepSeek Harness 专栏第 03 篇。从平台架构到 Cordis 插件引擎，从 Agent Loop 到核心能力生态——完整拆解 DSH 的插件体系。

---

## 平台架构：从配置层到运行时能力树

DSH 平台由配置层（Profile / Bundle / Patch）、插件加载层（Loader）、运行时能力树（Context / Fiber / Service）三层构成。

## Cordis 插件运行机制

Cordis 是 DSH 的插件引擎，负责插件的注册、生命周期管理、依赖解析与事件分发。

## Agent Loop 如何驱动一次完整运行

Agent Loop 将 turn / step 两级生命周期与插件能力绑定：模型请求 → 工具调用 → 结果注入 → 继续推理，循环直到任务完成。

## 核心能力如何构成插件生态

工具注册、会话管理、Provider 切换、压缩策略——每一项核心能力都是可替换的插件，共同构成可灵活组合的 Agent 能力树。

> 📎 完整原文见知识库：[wiki/sources/deepseek-harness-plugin-architecture-deep-dive.md](../../../wiki/sources/deepseek-harness-plugin-architecture-deep-dive.md)

---

[← 上一篇：Runtime 架构](./02-agent-runtime-architecture.md) | [下一篇：Agent 构建工具 →](./04-agent-build-tools.md)