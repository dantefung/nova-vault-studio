---
title: "一泽Eze：Grok Bot 10条经验与multi-bots工作流设计"
date: "2026-10-13"
source: "X/Twitter"
url: "https://x.com/eze_is_1/status/2109850538045264151"
---

# 一泽 Eze：Grok Bot 10 条经验与 multi-bots 工作流设计

> Grok Bot、X、Cursor 订阅大一统了，用上的朋友会越来越多。整理了 10 条大概率用得上的经验。

## 核心要点

1. **长期反复的非 Coding 任务用 Bot，Coding 继续用 Codex/CC/Cursor**。Bot 是 Bots 类 Agent，Codex 是会话型 Agent
2. **上下文机制**：Bots 之间能私下长对话转接信息，但一个 bot 看不到另一个聊天记录。共用上下文有“共用记忆”、"Skill"、“连接器”
3. **不要上来就把 Bot 拆得太细**。先建一个社媒 Bot 包一整块活，出现内部分化或上下文污染再细分
4. **设计重叠任务**：各 Bot 只管自己那摊事，碰哪些账号、能做什么都清楚。优化冗余工作流就是减少工具调用次数
5. **已跑通的自动化流程交给 CLI Agent 执行**，Bot 只负责派活和验收
6. **Wake on Done Skill**：解决命令行 Agent 跑完不通知的问题，让长任务无人值守
7. **Web Access Skill**（9K Star）：让 Bot 直接操作本机浏览器，复用登录态
8. **App Nap 问题**：Mac 息屏后 Grok Bot APP 会暂停，需手动关闭 App Nap 或用 pmset 定时唤醒
9. **数据看板放 Notion**：Notion 自带完整前端块结构，Database 每条数据都能承载完整页面，Notion MCP 读写很快
10. **实际案例**：收件箱 Bot、产品反馈 Bot、订阅管理 Bot、商务财务 Bot

## 推荐工具

- Wake on Done Skill：[github.com/eze-is/eze-grokbot](https://github.com/eze-is/eze-grokbot)
- Web Access Skill：[github.com/eze-is/web-access](https://github.com/eze-is/web-access)