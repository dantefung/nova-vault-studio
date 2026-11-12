---
title: "纳米AI（@antiAIvo）：学 DeepSeek Harness 之前，我先手写了一个迷你版 Cordis"
date: "2026-11-06"
source: "X/Twitter"
author: "纳米AI (@antiAIvo)"
url: "https://x.com/antiAIvo/status/2118152779101614220"
---

# 纳米 AI（@antiAIvo）：学 DeepSeek Harness 之前，我先手写了一个迷你版 Cordis

> 读懂 Agent Harness 框架胶水的「先造最小可用轮子」学习法：DSH 把 LLM 调用、工具、记忆、主循环全做成可替换插件，底层框架是 Cordis，直接读源码满屏 ctx/plugin/inject/dispose 难以区分业务逻辑与框架胶水。给出四步递进式脚手架——20 行代码写出最小 Context 与 plugin、加事件实现插件间无依赖通信、加卸载让插件拔除时自动清理注册物、加服务注入实现依赖未就绪即等待，写完即可看懂 DSH 大部分框架用法。

<!-- more -->

学 DeepSeek Harness 之前，我先干了件看起来很绕的事：

先手写一个迷你版的 Cordis

原因其实很简单

DSH 的核心设计是把 agent 运行时的每一部分都做成可替换的插件

LLM 调用、工具、记忆、主循环，全都挂在同一个插件框架上

这个框架就是 Cordis

如果不懂 Cordis，直接读 DSH 源码

满屏都是 ctx、plugin、inject、dispose

分不清哪部分是 agent 逻辑，哪部分是框架胶水

所以我的路线是：

第一步，20 行代码写出最小的 Context 和 plugin

第二步，加事件，让插件之间不认识也能通信

第三步，加卸载，插件拔掉时它注册的东西自动清理

第四步，加服务注入，依赖没就绪就等着

写到这里，DSH 里大部分框架用法就能看懂了

## 相关页面

- [[sources/deepseek-harness-plugin-first-agent-runtime]]
- [[sources/deepseek-harness-agent-runtime-architecture]]
- [[concepts/deepseek-harness-agent-formula]]
- [[concepts/harness-engineering]]
