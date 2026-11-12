---
title: "为什么越来越多人用 Pi：原语优先的极简 Agent 哲学"
date: "2026-08-18"
source: "微信公众号：苏三说技术"
url: "https://mp.weixin.qq.com/s/7CjJmhKltIb7deyPsOMrVg"
---

# 为什么越来越多人用 Pi：原语优先的极简 Agent 哲学

## 核心结论

Pi 由 libGDX 创始人 Mario Zechner 开源，GitHub 8.6万 Star，被称为"目前唯一能真正平替 Claude Code 的 Agent 架构"。它的核心反直觉在于：其他 Agent 框架拼命堆功能（子代理/计划模式/MCP/权限弹窗/TODO 管理），Pi 反而刻意删除这些功能，只留下 4 个原语级工具（read/write/edit/bash）和 200 Token 的系统提示词。这种"做减法"的哲学带来了极致的缓存命中率（99.93%）和低成本，让 DeepSeek V4 Flash 接入 Pi 后跑真实任务只需 $0.028。

## 关键洞察

1. **极简设计 ≠ 功能缺失**：Pi 不支持 MCP、内置子代理、计划模式、权限弹窗、TODO 管理，也不绑定特定模型——但它有 4 个原语级工具（read/write/edit/bash），覆盖了"读、改、写、执行命令"的最底层需求。当今前沿模型已被 RL 训练得足够好，能理解 Agent 该怎么做；不需要 10000 Token 的长篇大论来教它。
2. **200 Token vs 14000 Token 的杠杆**：Pi 的系统提示词 + 工具定义加起来不到 1000 Token，Claude Code 单系统提示词就 14000 Token。这直接放大缓存命中率——缓存不命中率 Pi 只有 0.07%。
3. **缓存命中率即成本**：Composio 团队横评 8 款主流 Agent Harness，把 DeepSeek V4 Flash 接入跑真实任务。Pi Agent 跑 Terminal-Bench-2.0 得分 66.7%，平均成本 $0.028/任务，缓存命中率 99.93%——三项指标综合远超同侪。
4. **架构本质是 while 循环**：Pi 没有花哨的事件系统、Cordis 插件、上下文工程、轨迹回放——核心就是一个"调用 LLM → 给它配 4 个工具 → 看返回结果决定是否继续"的循环。这种可理解的简单性让调试、扩展、性能预测都变得可控。
5. **Mario Zechner 的判断**：libGDX 创始人（Java/Android 游戏框架的创造者）亲口说"bash 本身就是最通用的工具接口。你不需要教模型怎么做，只需要告诉它有什么工具可用"——这是 Pi 设计的总纲。
6. **Pi 与 DSH 的两条路线**：DSH（DeepSeek Harness）做加法（一切皆插件、可配置运行时、Trajectory 暴露）；Pi 做减法（4 原语 + while 循环 + 模型自决）。两者代表 Agent 工具设计的两个极端。

## 值得保留的判断

- **原语哲学对前沿模型更友好**：模型能力足够强时，"提供最少工具 + 让模型自决"比"提供完整脚手架 + 限制模型行为"更节省成本、更灵活。
- **缓存命中率与系统提示词大小强相关**：这是被低估的杠杆——一个看似"代码风格"的取舍（简洁 vs 详尽 prompt）实际决定数倍成本差距。
- **简单可解释 ≠ 能力弱**：Pi 不是"功能残缺版 Claude Code"，而是"在足够强的模型面前脚手架可以被削减"的实证。

## 疑点与边界

- **Pi 不绑定模型**：脱离代码层面看，"不绑定模型"的好处是灵活性，代价是不同模型在 Pi 上的体验差异巨大（强模型才能"理解 Agent 该怎么做"）。
- **极简的代价**：没有子代理意味着长任务没有天然分叉机制；没有计划模式意味着"任务分解"全靠模型一次性规划；没有权限弹窗意味着安全完全依赖 bash 沙箱与用户环境。这对模型能力与运行环境提出了更高要求。
- **生产稳定性证据有限**：99.93% 缓存命中率、$0.028/任务来自 Composio 单一测试团队的横评；不同任务类型、不同模型、不同上下文长度下的稳定性待公开。

## Related Pages

- [[products/deepseek-harness]]
- [[summaries/dsh-tech-hype-or-not]]
- [[summaries/dsh-complete-guide]]
- [[summaries/dsh-vs-continuum-acp]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[patterns/plugin-first-agent-runtime]]
- [[patterns/dsh-four-modes]]
- [[concepts/harness-engineering]]
- [[concepts/harness-multiplier-effect]]
- [[concepts/agent-self-modification-closure]]

## Sources

- [[sources/why-people-use-pi]]