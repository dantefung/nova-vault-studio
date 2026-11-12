---
title: "AgentScope Skills 技能系统：Agent 的「上下文链接器」——如何像管理动态链接库一样管理 Agent 能力"
date: "2026-08-07"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/52ChzP-VtuEEd12PO93ISg"
---

# AgentScope Skills：像管理动态链接库一样管理 Agent 能力

> AgentScope 迁移系列第 17 篇。Skills 系统让 Agent 能力按需加载、用完卸载，就像操作系统的动态链接库——不需要时不占 Token，需要时秒级注入。

---

## 核心机制

| 概念 | 类比 | 作用 |
|------|------|------|
| Skill 文件 | 动态链接库 (.so) | 定义 Agent 的某项专项能力 |
| Skill 注册 | `dlopen()` | 将 Skill 注入 Agent 上下文 |
| Skill 卸载 | `dlclose()` | 任务完成后释放上下文 |
| Skill 组合 | 链接多个库 | 多项能力协作完成复杂任务 |

## 与传统提示词的区别

- **传统方式**：所有能力写死在 System Prompt，一次性加载，Token 消耗高
- **Skills 方式**：按需加载，用完即卸载，Token 高效

> 📎 完整原文见知识库：[wiki/sources/agentscope-2.0-skills.md](../../../wiki/sources/agentscope-2.0-skills.md)

---

[← 上一