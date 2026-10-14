---
title: "一泽Eze：Grok Bot 10条经验与multi-bots工作流设计"
date: "2026-10-13"
source: "X/Twitter"
url: "https://x.com/eze_is_1/status/2109850538045264151"
---

# 一泽Eze：Grok Bot 10条经验与multi-bots工作流设计

> Grok Bot、X、Cursor订阅大一统了，用上的朋友会越来越多。整理了10条大概率用得上的经验。

## 核心要点

1. **长期反复的非Coding任务用Bot，Coding继续用Codex/CC/Cursor**。Bot是Bots类Agent，Codex是会话型Agent
2. **上下文机制**：Bots之间能私下长对话转接信息，但一个bot看不到另一个聊天记录。共用上下文有"共用记忆"、"Skill"、"连接器"
3. **不要上来就把Bot拆得太细**。先建一个社媒Bot包一整块活，出现内部分化或上下文污染再细分
4. **设计重叠任务**：各Bot只管自己那摊事，碰哪些账号、能做什么都清楚。优化冗余工作流就是减少工具调用次数
5. **已跑通的自动化流程交给CLI Agent执行**，Bot只负责派活和验收
6. **Wake on Done Skill**：解决命令行Agent跑完不通知的问题，让长任务无人值守
7. **Web Access Skill**（9K Star）：让Bot直接操作本机浏览器，复用登录态
8. **App Nap问题**：Mac息屏后Grok Bot APP会暂停，需手动关闭App Nap或用pmset定时唤醒
9. **数据看板放Notion**：Notion自带完整前端块结构，Database每条数据都能承载完整页面，Notion MCP读写很快
10. **实际案例**：收件箱Bot、产品反馈Bot、订阅管理Bot、商务财务Bot

## 推荐工具

- Wake on Done Skill：[github.com/eze-is/eze-grokbot](https://github.com/eze-is/eze-grokbot)
- Web Access Skill：[github.com/eze-is/web-access](https://github.com/eze-is/web-access)