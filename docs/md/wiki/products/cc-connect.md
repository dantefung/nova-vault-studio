---
title: "cc-connect"
date: "2026-05-09"
---

# cc-connect

> 连接 AI 编程助手与消息平台的开源工具，桥接 Claude Code、Codex、Cursor 等至飞书、钉钉、Slack 等。

## Core Capabilities

- 多平台消息桥接：飞书、钉钉、Slack、Telegram、Discord
- 支持多种 AI 编码工具：Claude Code、OpenAI Codex、Cursor、Gemini CLI
- 实时同步 AI 输出到协作平台
- 支持接收人工审核指令并回传至 AI 助手

## Technical Highlights

- 标准化消息传递协议
- 消息路由、会话管理、指令转发
- 架构：AI Coding Agent ↔ cc-connect ↔ 消息平台

## Use Cases

- 团队协作：多人同时查看 AI 编程过程
- 远程审核：通过手机消息平台审核 AI 代码
- 通知推送：AI 完成任务后自动通知

## Related Pages

- [[products/claude-code]]
- [[products/openai-codex]]

## Sources

- docs/md/guide/ai/claude-code/cc-connect-多项目配置指南.md
