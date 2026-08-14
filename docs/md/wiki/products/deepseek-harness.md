---
title: "DeepSeek Harness"
date: "2026-08-14"
source: "用户原创整理"
url: ""
---

# DeepSeek Harness

> 基于 Cordis 元框架构建、以「一切皆插件」为核心哲学的可组装 AI Agent 底盘。

## Core Capabilities

- **模型插件化**：允许替换 DeepSeek、Claude 等模型提供方。
- **能力插件化**：工具和 Skill 以外置模块接入，按任务组装能力。
- **运行环境插件化**：会话、沙箱和文件系统不与核心绑定。
- **控制流插件化**：循环和编排逻辑可以替换，不强制单一 Agent 工作方式。
- **界面插件化**：UI 也属于可替换外壳，而不是运行时核心。

## Technical Highlights

根据原文，Harness 的技术方向是把 Agent 拆成标准化、可替换、可组合的模块，并将变化频繁的模型、工具和工作流留在插件层。这与 foobar2000 的设计类似：播放器核心极简，具体能力由用户安装的组件决定。

## Use Cases

- 需要在多个模型之间切换，但不想重写 Agent 系统。
- 需要按业务任务组合不同工具、Skill 和工作流。
- 希望沉淀独立于某个 Agent 产品的组件库。
- 研究或搭建可扩展的 Agent Runtime、Agent OS 底盘。

## 待验证的工程边界

原文将它定位为 Agent 底盘，而不是「开箱即用、什么都有」的超级 Agent。根据一般插件系统经验，高度插件化可能把复杂度转移到接口治理、依赖兼容、权限控制和调试环节；这些是 Wiki 的工程推论，不代表 v0.1 已经出现或解决了这些问题。作为开发者预览版，其生态成熟度仍需后续验证。

## Related Pages

- [[patterns/plugin-first-agent-runtime]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[concepts/harness-engineering]]
- [[concepts/agentscope-harnessagent-declarative]]
- [[summaries/indie-hub-codex-eat-pc]]

## Sources

- [[sources/deepseek-harness-plugin-first-agent-runtime]]：插件化哲学与 foobar2000 类比
