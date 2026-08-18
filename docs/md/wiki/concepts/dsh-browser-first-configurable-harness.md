---
title: "浏览器优先的完全可配置 Harness：DSH 与闭源 Agent CLI 的工程差异"
date: "2026-08-15"
source: "基于 X (Twitter)：@phosphenq 的 Wiki 推导"
url: ""
---

# 浏览器优先的完全可配置 Harness：DSH 与闭源 Agent CLI 的工程差异

> DSH 用浏览器而非终端作主战场、用 config 文件替代代码补丁、用 profile 抽象能力组合、用 trajectory 视图暴露完整执行真相——这是它与 Claude Code/Codex 这类闭源 Agent CLI 的核心工程差异。

## Problem Context

开发者接触 DeepSeek Harness 时常带着 Claude Code/Codex 的心智模型——以为是终端工具，结果发现它实际是浏览器应用。也常误以为 DSH 与闭源 Agent 产品是同质化竞品，结果发现它的能力边界（config 替代补丁、profile 组合、Trajectory 视图暴露）远远超出"另一个 Agent CLI"的范畴。

这种认知错位会让用户在第一次安装时就遇到概念障碍，也会在评估 DSH 适配自己项目时低估它的工程价值。

## Solution

DSH 通过四个核心抽象解决"Agent 工程系统如何被观察、被配置、被组合、被评估"：

1. **浏览器优先的 host**：终端只负责启动 server，UI 在浏览器；这是为了把 sidebar、设置、plugin 列表、Trajectory 视图等大量交互空间让给真正的可视化前端。
2. **config 文件替代代码补丁**：默认 133 个插件一份 config 就能关闭任意一项，包括 sidebar 和 agent loop 本身；这让 DSH 成为一套"运行时 = 配置树"而非"运行时 = 黑盒二进制"的可改造系统。
3. **profile 抽象能力组合**：每个 profile 是一份被命名的插件清单 + 权限边界（如 minimal/standard/code/cordis）；切换 profile 就是给 Agent 换职业（程序员/分析员/写作者），而不是改实现。
4. **Trajectory 视图暴露执行真相**：UI 中直接暴露模型请求、tool schema、token 用量、缓存命中、Agent 运行轨迹；这把"调试 Agent"从"靠日志猜"变成"看完整重放"。

## 与 Claude Code/Codex 的差异

| 维度 | Claude Code / Codex | DeepSeek Harness |
|------|---------------------|------------------|
| 主战场 | 终端 | 浏览器（终端只启动 server） |
| 可配置深度 | 扩展点（hook、MCP、subagent） | config 文件能关闭任意插件，含 sidebar 和 agent loop 本身 |
| 能力组合 | 命令/profile 选择 | profile = 命名插件清单 + 权限边界 |
| 执行可观察性 | 日志/调试输出 | Trajectory 视图 + append-only session log |
| 插件数量 | 数十个内置 hook/MCP | 默认安装 133 个插件 |
| 协议开放性 | 闭源产品 + 扩展点 | MIT 全源码，Cordis 形式模型 + MCP + ACP + Hook Bridge + SDK |
| 发行透明度 | 闭源 | 公开仓库 12,293 提交，开发在私有组织仓库进行 |

## profile 抽象的力量

profile 让 Agent 的"能力外观"可以彻底改变：

- **minimal**：最简能力集，只保留 Bash + str_replace_editor 工具
- **standard**：标准编码 agent 能力
- **code**：Code Mode 模式，模型写程序批量调用 SDK 而非逐次 tool call
- **cordis**：暴露 Agent 自修改运行时所需的 cordis_* 工具集（默认 opt-in）

切换 profile 无需重启 web server；模型改动在下一次请求即生效。

## Trajectory 视图的工程价值

普通 Agent 产品调试只能靠文本日志。DSH 的 Trajectory 视图：

- **每一次模型请求**清晰展示 system prompt 拼接、tool schema 列表、请求体完整内容
- **每一次工具调用**展示参数、返回值、耗时
- **Token 用量与缓存命中率**按 turn/step 累计展示
- **append-only session log**保证回放时不会丢失中间状态

这种级别的暴露对 Agent 研究者和复杂场景调试有实质价值。

## Trade-offs

- **概念负担更重**：profile/bundle/patch/capability seam 四层概念要先理解才能有效改它；不适合只想"开箱即用"的开发者。
- **学习曲线 vs 闭环收益**：浏览器优先带来更好的 UI 体验和可观察性，但失去终端直接交互的便利。
- **预发布阶段不稳定**：v0.1.0-rc.5 仍可能破坏性变更，配置文件需要随版本升级。
- **安全默认较松**：读/网络/进程可见性默认不限，临时 Plugin 信任等级等同于 Bash；生产部署需要额外权限收紧。

## Related Pages

- [[summaries/dsh-complete-guide]]
- [[summaries/dsh-tech-hype-or-not]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[summaries/dsh-vs-continuum-acp]]
- [[patterns/plugin-first-agent-runtime]]
- [[patterns/dsh-four-modes]]
- [[concepts/harness-engineering]]
- [[concepts/deepseek-harness-agent-formula]]
- [[concepts/agent-self-modification-closure]]

## Sources

- [[sources/dsh-complete-guide]]：从运行实例写就的 DSH 全套使用手册