---
title: "crypto小纯：Beacon 开源——让 coding agent 记住你怎么改 bug"
date: "2026-10-26"
source: "X/Twitter"
author: "crypto小纯（qtrader量化开发） (@guxiaochun888)"
url: "https://x.com/guxiaochun888/status/2114527816209543465"
---

# Beacon 开源：让 coding agent 记住你怎么改 bug

> Asymptote Labs 开源 Beacon——跨 Harness 的 coding agent 记忆层。会话被蒸馏成可复用 skills，跨 20+ 工具（Claude Code / Cursor / Codex 等）自动复用。获 $5.5M 种子轮，产品本身免费开源（MIT 许可，Go 语言实现）。

<!-- more -->

## 核心能力

- **记忆蒸馏**：将 coding agent 的调试习惯和修复过程蒸馏为可复用的 skills
- **跨 Harness 复用**：同一套 skills 在 Claude Code、Cursor、Codex 及另外 20+ 工具间无缝共享
- **不再重复 briefing**：换了工具不再每次重新解释 bug 修改历史

## 项目信息

| 项目 | 详情 |
|------|------|
| GitHub | [Asymptote-Labs/agent-beacon](https://github.com/Asymptote-Labs/agent-beacon) |
| Stars | ~2.9k（截至 2026-10-27） |
| 语言 | Go |
| 许可证 | MIT |
| 融资 | $5.5M 种子轮 |
| 定价 | 产品本身免费开源 |
| 最近提交 | 2026-10-27 |

## 使用方式

```bash
# clone 项目
git clone https://github.com/Asymptote-Labs/agent-beacon

# 装进你现在的 agent 流程
# （具体安装指引见仓库 README）
```

## 适用场景

- 多工具协作的开发者（同时在 Claude Code / Cursor / Codex 等不同 agent 间切换）
- 同一项目长期维护，希望跨会话保持上下文连续性的团队
- 调试习惯和修复方案需要沉淀为组织资产的工程团队

## 边界与判断

- 本文仅为项目介绍，未进行实际安装和性能验证
- Agent 记忆层的实际效果取决于 skill 蒸馏质量和 Harness 兼容性
- 20+ Harness 支持覆盖面仍需在实际项目中验证

## 相关页面

- [[concepts/agent-token-architecture]] — Token 与上下文窗口的工程映射。
- [[patterns/agent-skill-design-patterns]] — Agent Skill 设计模式。
- [[concepts/harness-engineering]] — Harness 工程化的一般原理。

---

*原文为 X 短帖，无配图。项目信息经 GitHub API 核验。*
