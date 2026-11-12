---
title: "bot-vs-codex-context"
date: "2026-10-14"
source: "wiki-ingest"
---

# Bot vs Codex 上下文机制

> Grok Bot 的 Bots 类 Agent 与 Codex/Claude Code 的会话型 Agent 在上下文组织上有根本差异，理解这个差异是搭 multi-bots 工作流的前提。

## 核心区别

| 维度 | Bots（Grok Bot） | Codex / CC / Cursor |
|------|-----------------|---------------------|
| 定位 | 长期反复执行的非 Coding 任务 | Coding 和一次性复杂任务 |
| 上下文组织 | 记忆区 + Skill + 连接器（跨 bot 共享） | 每次会话独立上下文 |
| 记忆持久性 | 共用记忆、专属记忆可跨会话留存 | 同一项目多会话时容易混乱 |
| 协作方式 | bot 之间可私下长对话、转接信息与事务 | 无跨会话协作机制 |

## Bots 上下文三层结构

**共用层**（所有 bot 可见）：
- 共用记忆
- Skill
- 连接器（Connectors）
- 云电脑文件系统（所有 bot 运行在同一台云电脑上）

**专属层**（单个 bot 持有）：
- Bot 专属指令
- 单 bot 专属记忆
- Bot 专属例程（自动化任务提示）

## 设计原则

1. **不要上来就把 Bot 拆得太细**。先建一个 Bot 包一整块活，出现以下征兆再细分：
   - 内部形成了更稳定的差异化工作流（不同渠道有独特 Agent 流程）
   - 上下文污染严重（不同渠道文风互相干扰）
2. **跨 bot 通信效率很高**：Bot A 可以直接把信息转接给 Bot B，不需要主 bot 中转
3. **需要一直记得的内容**：直接说"请记到共用记忆区 / bot 内专属记忆区"，或落到云电脑文档/Skill 里

## Related Pages

- [[concepts/shared-weekly-pool]]
- [[patterns/orchestrator-pattern]]

## Sources

- 一泽Eze《Grok Bot 10条经验与multi-bots工作流设计》：x.com/eze_is_1/status/2109850538045264151
