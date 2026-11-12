---
title: "AgentScope Java 2.0 工作区 Workspace ——「大脑外化」：将 Agent 的人格与记忆变成文件"
date: "2026-07-31"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/HcQncfxJQzlN7IO8qpU7iA"
---

# AgentScope Workspace：将 Agent 人格与记忆变成文件

> AgentScope 迁移系列第 16 篇。Workspace 是 Agent 的「外脑」——`AGENTS.md` 定义人格、`MEMORY.md` 沉淀长期事实，改文件即升级 Agent，无需改代码。

---

## 核心文件

| 文件 | 作用 | 类比 |
|------|------|------|
| `AGENTS.md` | Agent 人格设定与行为准则 | `/etc/profile` |
| `MEMORY.md` | 长期记忆，自动维护 | 大脑皮层 |
| `SKILL.md` | 技能定义 | 技能证书 |
| `memory/` | 记忆碎片 | 海马体 |
| `skills/` | 技能库 | 工具箱 |

## 「改文件即升级 Agent」

不需要修改任何 Java 代码，只需编辑 Workspace 下的 Markdown 文件，Agent 下次启动时自动加载新的人格设定、记忆和技能。

> 📎 完整原文见知识库：[wiki/sources/agentscope-2.0-workspace.md](../../../wiki/sources/agentscope-2.0-workspace.md)

---

[← 上一