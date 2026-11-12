---
title: "Aliez Ren（@aliez_ren）：几个月高强度 AI 编程真实心法——Claude Code + Herdr + Fable 架构实践"
date: "2026-11-03"
source: "X/Twitter"
author: "Aliez Ren (@aliez_ren)"
url: "https://x.com/aliez_ren/status/2117254596007747976"
---

# Aliez Ren（@aliez_ren）：几个月高强度 AI 编程真实心法——Claude Code + Herdr + Fable 架构实践

> 实战开发者分享 Claude Code 高阶工程心法：用 Herdr 管理会话、架构设计交给 Fable、实现交给 Opus，长上下文切换先 /compact；摒弃冗余 workflow 与记忆，依托 flake.nix 锁定环境并设立严苛 CLAUDE.md 约束（注释只准带文档链接且≤100 字，架构变动必先询问）。

<!-- more -->

最近几个月我是这样用 AI 写代码的：

- 基本只用 Claude Code，配合 Herdr 管理多个 session
- 架构相关的改动用 Fable，架构无关的用 Opus。有时中途发现需要切换模型，如果此时上下文已经很长，就先 /compact 再切换，否则直接用 /model 切换到另一个
- 不用 workflow、mcp、skill、memory。在架构搭好，需要横向扩展实现的时候才用 loop
- 不看代码，只看 AI 的回复，看不懂的时候就让 AI 细说
- 每隔几天问一下 Fable：“现在的架构是否有不合理的地方”
- 使用 flake.nix 管理项目环境，githook 里加上 lint fmt 等等
- 在 CLAUDE.md 里这样写：
1. 注释仅允许一种形式：第三方文档链接 + 可选的一句简短说明，除去链接外不得超过 100 个字符
2. 实施影响到架构的改动前必须先询问
3. 不要修改此文件
4. （项目需要的特殊约束）
   - 在 ~/.claude/settings.json 里这样配置：
   {
   “permissions”: {
   “defaultMode”: “bypassPermissions”
   },
   “env”: {
   “CLAUDE_CODE_SUBAGENT_MODEL”: “claude-opus-5-5”,
   “CLAUDE_CODE_SHELL”: “bash”
   },
   “model”: “claude-fable-5-1”,
   “effortLevel”: “high”
   }

## 相关页面

- [[concepts/vibe-coding]]
- [[concepts/claude-skills]]
- [[concepts/agent-skill]]
