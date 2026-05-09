---
title: "OpenClaw"
date: "2026-05-09"
---

# OpenClaw

> 开源的 AI 私人助手框架，跑在用户自己的电脑上，支持多平台接入和多 Agent 协作。

## Core Capabilities

- 多平台消息接入（WhatsApp、Telegram、Discord 等）
- 技能系统：教 AI 完成特定任务
- 记忆系统：跨会话记住用户偏好
- 多 Agent 协作：创建专业分工的 AI 团队
- 安全沙箱：限制 AI 执行危险操作

## Technical Highlights

- **Gateway**：核心服务进程，负责消息调度
- **Agent**：独立的 AI 助手实例
- **Skill**：Markdown 指令文件，教 AI 完成任务
- **Memory**：本地 Markdown 文件存储的跨会话记忆
- **DM Pairing**：安全配对机制

## Use Cases

- 个人 AI 助手
- 团队协作
- 自动化任务
- 多渠道消息管理

## Related Pages

- [[concepts/prompt-engineering]]
- [[products/claude-code]]

## Sources

- docs/md/guide/openclaw/00-阅读指南.md
- docs/md/guide/openclaw/01-OpenClaw项目介绍.md
