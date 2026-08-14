---
title: "DeepSeek Harness：插件化 Agent 底盘"
date: "2026-08-14"
source: "用户原创"
url: ""
---

# DeepSeek Harness：插件化 Agent 底盘

## 核心结论

DeepSeek Harness v0.1 的重点不是提供一个功能齐全的超级 Agent，而是提供一套可组装的 Agent 底盘。模型、工具、Skill、会话、沙箱、文件系统、循环、编排和 UI 都被视为可替换插件。

## 关键洞察

1. **一切皆插件**：Agent 的主要能力不再固化在单一产品里，而是通过标准化模块组合出来。
2. **底盘优先于成品**：Harness 解决的是模块连接、替换和编排问题，而不是堆叠最多的内置功能。
3. **foobar2000 类比**：核心保持极简，解码器、歌词、音效、媒体库和界面依靠插件扩展；不同用户最终拥有不同的播放器实例。
4. **选择单位发生变化**：问题从「选择哪个 Agent」变成「组合哪些模型、工具、Skill 和工作流」。
5. **长期资产转移**：模型和 Agent 产品会更换，真正能持续积累的是插件、Skills、Workflow、数据和业务逻辑组成的个人组件库。

## 值得保留的判断

Agent 生态正在从制造独立 Agent 产品，转向建设 Agent 操作系统和可组合运行时。未来的竞争优势可能不属于某个固定 Agent，而属于使用者围绕 Agent 建成的组件体系。

## 疑点与边界

- 「一切皆插件」能否成立，取决于插件接口是否稳定，而不只是代码能否被替换。
- 高度可组合会把复杂度从核心转移到版本兼容、权限、安全和调试上。
- v0.1 属于开发者预览版，架构哲学是否能转化为成熟生态仍需观察。

## Related Pages

- [[products/deepseek-harness]]
- [[patterns/plugin-first-agent-runtime]]
- [[concepts/harness-engineering]]
- [[summaries/indie-hub-codex-eat-pc]]

## Sources

- [[sources/deepseek-harness-plugin-first-agent-runtime]]
