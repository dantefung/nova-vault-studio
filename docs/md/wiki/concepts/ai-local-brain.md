---
title: "AI本地知识基座"
date: "2026-06-01"
source: "微信公众号-精炼"
url: "https://mp.weixin.qq.com/s/m_y0k7Gm15vZn9EVHgyUEQ
---

# AI本地知识基座

> 一份本地知识库 + 一台常驻Mac + 三个入口 + N个Skill = AI长期能帮你

## 定义

**AI本地知识基座**：将个人全部数据（笔记、决策、反馈、记录）集中到一个本地知识库，让AI持续站在这些数据上工作，而非每次从零开始。

## 核心洞察（3条）

1. **数据所有权是杠杆**：只要数据还散在N个SaaS后台，AI接哪个都看不到全貌。只有收回本地，AI才能站在真实资料库上工作。
2. **执行环境决定AI存活时间**：Agent不是聊天框，需要常驻进程（定时任务、长轮询接消息、长任务）。算力和数据留在家里，外面设备只是窗口。
3. **同一结构，Skill × Knowledge Base × Agent**：任何单拎出来都不够——futu skill是查行情工具，vault是死档案，agent只是聊天机器人。只有三者同时成立，AI才真正变成"长期能帮你"的东西。

## 四层架构

| 层级 | 解决问题 | 做法 |
|------|----------|------|
| 数据底座 | AI看不到全部上下文 | 收回本地Obsidian vault |
| 执行环境 | Agent需常驻进程+本地IO | 家里Mac 24h跑Agent进程 |
| 触达入口 | 不同场景不同摩擦 | 微信/Codex Mobile/Obsidian Sync |
| 行动能力 | AI不只能读，还要能调用工具 | Skill接富途、API等外部服务 |

## 关键决策

### 为什么必须本地？

NAS不能开公网。云服务器能跑Agent，但解决不了"NAS上几个T的照片、视频、扫描件"的问题。数据传上云就违反了"all in one本地"的前提。

### 三个入口不是冗余，是分工

触达摩擦不同：微信0秒摩擦、Codex Mobile审批agent、Obsidian Sync写笔记主战场。只有三个入口同时覆盖"在家/在公司/在地铁/在咖啡馆/在被窝里"，才叫完整的触达链路。

### "完成"的定义

> 错误模型：写完 = 完成，再润色再等等
> 正确模型：发出去 = 完成，第一篇就是noise，反馈在数据里

这个洞察需要三个条件同时成立才能被agent发现：全量数据 × 跨时间维度 × agent主动分析。

## 交叉引用

- [[obsidian-vault]] — 本地知识库工具
- [[hermes-agent]] — 微信消息网关接入方案
- [[codex-mobile]] — OpenAI Codex远程控制移动端
- [[futu-skill]] — 富途OpenAPI Skill，接实时行情与持仓

## 来源

- 原文：[《让AI站在我全部数据上》](https://mp.weixin.qq.com/s/m_y0k7Gm15vZn9EVHgyUEQ) by kaitox（2026-06-01）
- 原始归档：sources/ai-local-brain.md
- 摘要：summaries/ai-local-brain.md