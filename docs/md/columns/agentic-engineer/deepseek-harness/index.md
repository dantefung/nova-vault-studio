---
title: DeepSeek Harness 专栏
date: "2026-08-19"
source: "微信公众号"
---

# DeepSeek Harness 专栏

> DeepSeek 开源的 Agent 框架——「Agent = Model + Harness」。一切皆插件，能力按需装配、用完即焚。

> 本专栏收录 8 篇文章，从整体架构到插件机制，从运行时设计到 Agent 蒸馏，从与 Cordis/Pi 的横向对比到 Codex 竞品开源，再到自进化 Agent 的哲学思考，完整覆盖 Harness 生态竞争格局。

---

## 阅读路线

```
概念层    →  Agent = Model + Harness（整体架构）
运行时层  →  Agent Runtime 架构  +  插件运行机制
能力层    →  Agent 为自己构建工具
数据层    →  Agent 蒸馏数据工厂
对比层    →  DSH vs Pi：两种 Agent 架构设计哲学
```

---

## 文章列表

| # | 文章 | 日期 | 主题 |
|---|------|------|------|
| 01 | [Agent = Model + Harness：DeepSeek 把模型的「壳」开源了](./01-deepseek-harness.md) | 08-14 | 整体架构与核心理念 |
| 02 | [从 DeepSeek Harness 的架构，看 Agent Runtime 该怎么设计](./02-agent-runtime-architecture.md) | 08-13 | Session Log / Seam / Agent Loop |
| 03 | [深入解析 DeepSeek Harness 插件运行机制](./03-plugin-architecture.md) | 08-14 | Cordis 插件生态与核心能力 |
| 04 | [让 Agent 为自己构建工具](./04-agent-build-tools.md) | 08-19 | 现场装配：脚本 vs 插件 + 五条最佳实践 |
| 05 | [DeepSeek Harness 做 Agent 蒸馏：天然蒸馏数据工厂](./05-agent-distillation.md) | 08-14 | 事件流 → 蒸馏数据 |
| 06 | [Cordis 到底解决了什么：DSH 与 Pi 的两种答案](./06-cordis-dsh-vs-pi.md) | 08-15 | 横向对比两种 Agent 架构 |
| 07 | [OpenAI 全面开源 Codex Harness——「把 AI 装进专业界面，不是让用户适应聊天框」](./07-codex-harness-open-source.md) | 08-21 | 竞品开源，ARC-AGI-3 得分 13.3%→38.3%，Token 降 6 倍 |
| 08 | [DeepSeek Harness 是自进化 Agent 的基石——从 To Developer 到 To Agent](./08-self-evolving-foundation.md) | 08-20 | DSH vs Anthropic 两种 Harness 哲学，meta harness 与自进化愿景 |

---

## 参考资料

- [DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/DeepSeek-Harness)
- [Cordis](https://github.com/deepseek-ai/cordis)