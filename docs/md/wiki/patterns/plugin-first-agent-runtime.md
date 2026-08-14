---
title: "插件优先的 Agent Runtime"
date: "2026-08-14"
source: "基于 DeepSeek Harness 原创材料的 Wiki 推导"
url: ""
---

# 插件优先的 Agent Runtime

> 用极简稳定内核连接标准化插件，让模型、工具、Skill、状态、沙箱、控制流和 UI 可以独立替换与组合。

## Problem Context

把所有能力固化进一个超级 Agent，会让模型、工具、工作流和界面彼此耦合。任何一层发生变化，都可能迫使整个 Agent 产品重构，用户积累也会被锁在单一产品中。

## Solution

以下是 Wiki 从原文「一切皆插件」主张中推导出的模式实现，不代表 DeepSeek Harness v0.1 已完整实现这些机制：

1. 保持运行时核心极简，将核心职责收敛到插件生命周期、接口连接和必要的协调。
2. 把模型、工具、Skill、会话、沙箱、文件系统、循环、编排和 UI 设计为插件。
3. 为插件定义稳定接口，使模块能够替换，而不要求其他模块理解其内部实现。
4. 让最终 Agent 由任务需求驱动组装，而不是由一个固定产品预先决定全部能力。
5. 把可复用资产沉淀在组件层：插件、Skills、Workflow、数据和业务逻辑。

## foobar2000 类比

foobar2000 的价值不在默认功能丰富，而在「核心极简、能力外置」。解码器、歌词、音效、媒体库和界面由插件扩展，因此每个用户最终得到的播放器都不同。插件优先 Agent Runtime 采用同样逻辑：底盘相同，具体 Agent 由组件组合决定。

## Trade-offs

以下为一般插件系统可能面对的工程代价，仍需结合具体实现验证：

- **接口治理**：真正可替换要求稳定协议，而不仅是把代码拆成目录。
- **兼容性成本**：插件版本、依赖和生命周期可能形成新的复杂度。
- **安全边界**：工具、沙箱和文件系统插件必须有统一权限模型。
- **可观测性**：模块自由组合后，故障定位比单体 Agent 更困难。
- **生态冷启动**：没有足够插件时，极简核心会显得功能贫乏。

## Related Pages

- [[products/deepseek-harness]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[concepts/harness-engineering]]
- [[concepts/agentscope-harnessagent-declarative]]
- [[concepts/agentscope-skills]]
- [[summaries/indie-hub-codex-eat-pc]]

## Sources

- [[sources/deepseek-harness-plugin-first-agent-runtime]]：提出「一切皆插件」及 foobar2000 类比
