---
title: "DSH 四种工作模式：插件清单驱动的 Agent 能力切换"
date: "2026-08-18"
source: "基于微信公众号：轩辕之风 的 Wiki 推导"
url: ""
---

# DSH 四种工作模式：插件清单驱动的 Agent 能力切换

> DeepSeek Harness 的「四种模式」不是四套程序，而是同一 Harness 内加载的四份不同插件清单（preset）。

## Problem Context

初看 DeepSeek Harness 文档时，读者常被「标准/PTC/极简/创造」四种模式搞混，以为要在四套 Agent 实现中做选型。但实际上这种理解会让 API 抽象错位，导致用户难以推断「切换模式」究竟改变了什么——是换了模型？换了工具？还是换了 Agent Loop？

## Solution

DSH 把 Agent 的所有可变部分（系统提示词、工具列表、插件清单）抽象为一份 preset 配置：

1. **标准模式**：完整能力 preset——文件编辑、Shell、网页搜索、Skills、计划、目标、子 Agent、工作流全部加载，最长的系统提示词 + 一整套工具列表。
2. **PTC 模式（Programmatic Tool Calling）**：保留标准模式能力，但只暴露 `run_code` 一个工具；Agent 在标准模式里是「组合工具调用」，在 PTC 模式里是「写程序调度工具调用」。
3. **极简模式**：一句系统提示词 + Bash + str_replace_editor 两个工具，没有 Skills/子 Agent/工作流/上下文压缩；用于观察模型在最少 Harness 干预下的真实表现。
4. **创造模式**：除使用现有工具外，还能查看 Harness 内有哪些插件、把插件重新组合创建新 preset；preset 一旦创建就会出现在新会话的模式列表里。

## 与「换模型」的对比

很多 AI Agent 产品支持切换底层模型（GPT/Claude/DeepSeek），但那是 Provider 层的变化。模式切换是更高层的抽象——它改变的是 Agent 的「能力边界」而非「能力来源」：

| 切换维度 | 切换什么 | 类比 |
|----------|----------|------|
| 模型（Provider） | 大脑的推理引擎 | 换 CPU |
| 工具（Tools） | 双手的可用器具 | 换工具箱 |
| **模式（Preset）** | **Agent 的人格 + 工具清单 + 行为约束** | **换职业（厨师/木匠/画家）** |

## Trade-offs

以下为 DSH 四模式设计可能面对的工程代价，仍需结合实际使用验证：

- **PTC 不是稳赚不赔**：程序执行失败时模型反复改代码，调用次数反而可能比标准模式多；适合工具 B→C→D 这种长链任务，不适合需要频繁人类判断的探索性任务。
- **极简模式不可作主力**：缺少上下文压缩与重试机制，长任务会失控；定位是「模型评测工具」而非「生产工作流」。
- **创造模式的 preset 治理难题**：Agent 自己创建的 preset 谁来 review？谁来限权？需要一套 preset 注册与权限机制才能避免能力漂移。
- **模式边界本身是隐式契约**：四模式具体差异写在系统提示词而非独立模块里，行为变化与文档表述可能脱节。

## Related Pages

- [[summaries/dsh-tech-hype-or-not]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[patterns/plugin-first-agent-runtime]]
- [[concepts/harness-engineering]]
- [[concepts/deepseek-harness-agent-formula]]
- [[products/deepseek-harness]]

## Sources

- [[sources/dsh-tech-hype-or-not]]：实测 DSH 四种模式的工程视角对比