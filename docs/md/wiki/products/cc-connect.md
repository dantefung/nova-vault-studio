---
title: "cc-connect"
date: "2026-05-09"
---

# cc-connect

> 将本地 AI 编程助手桥接到消息平台的开源工具（Go 语言），支持 10+ AI Agent 和 11 个聊天平台，大多数无需公网 IP。

## Core Capabilities

- 11 个消息平台：飞书、钉钉、Slack、Telegram、Discord、微博、LINE、企业微信、个人微信、QQ、QQ Bot
- 10+ AI Agent：Claude Code、Codex、Cursor Agent、Gemini CLI、Qoder、OpenCode、iFlow、Kimi CLI、Pi、ACP/Devin
- 单进程多项目：每个项目绑定独立的 agent + 平台组合
- 流式输出、语音/图片、定时任务、Provider 切换、会话管理
- Web 管理面板（5 种语言）
- OS 用户隔离（`run_as_user`）

## Technical Highlights

- Go 二进制，npm/Homebrew/二进制三种分发方式
- TOML 配置，支持 `${VAR_NAME}` 环境变量替换
- 全局 Provider 定义 + 项目级 `provider_refs` 引用
- 显示模式：full / compact / quiet
- 生命周期事件钩子（message/session/cron/permission/error）

## Use Cases

- 团队协作：多人通过聊天平台查看 AI 编程过程
- 远程控制：手机端切换模型、目录、权限模式
- 定时任务：`/cron add 0 6 * * * 总结 GitHub trending`
- 附件回传：Agent 生成的截图、PDF 自动发回聊天

## Related Pages

- [products/claude-code](claude-code.md)
- [products/openai-codex](openai-codex.md)

## Sources

- docs/md/guide/ai/claude-code/cc-connect-多项目配置指南.md
- https://github.com/chenhg5/cc-connect