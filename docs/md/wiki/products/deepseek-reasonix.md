---
title: "DeepSeek-Reasonix"
date: "2026-05-29"
---

# DeepSeek-Reasonix

> DeepSeek 原生的终端 AI 编程代理，围绕前缀缓存稳定性设计，长会话 token 成本始终低位运行

**GitHub**: https://github.com/esengine/DeepSeek-Reasonix
**官网**: https://esengine.github.io/DeepSeek-Reasonix/

## Core Concept

**核心理念**：缓存稳定不是开关，而是循环要围绕设计的不变量。

Reasonix 只支持 DeepSeek，每一层都为 DeepSeek 字节稳定的前缀缓存机制调过。

## 三大支柱

1. **Pillar 1 — 缓存优先循环**：前缀缓存稳定性
2. **Pillar 2 — 工具调用修复**：Tool Call Repair
3. **Pillar 3 — 成本控制**：成本控制机制

## Quick Start

```bash
cd my-project
npx reasonix code   # 首次运行粘贴 DeepSeek API Key

# 其他命令
reasonix chat              # 纯聊天
reasonix run "task"        # 一次性任务
reasonix doctor            # 体检
reasonix update            # 升级
```

## 核心能力

- **code 模式**：文件系统工具 + SEARCH/REPLACE 审阅 + Shell 工具 + Plan 模式 + Memory
- **chat 模式**：纯对话，无磁盘权限的轻量壳
- **Skills**：Markdown 剧本，inline 或 subagent 模式
- **Memory**：`user` / `feedback` / `project` / `reference` 四类知识
- **Hooks**：生命周期事件触发的 shell 命令
- **MCP**：支持 stdio · SSE · Streamable HTTP
- **QQ 通道**：会话延伸到 QQ 上
- **权限**：按工作区的 shell 白名单

## 横向对比

|  | Reasonix | Claude Code | Cursor | Aider |
|---|---|---|---|---|
| 后端 | **DeepSeek** | Anthropic | OpenAI/Anthropic | 任意 |
| 协议 | **MIT** | 闭源 | 闭源 | Apache 2 |
| 单任务成本 | **低** | 高 | 订阅+用量 | 不一 |
| 前缀缓存 | **专门工程化** | 不适用 | 不适用 | 偶发命中 |
| 持久化会话 | 支持 | 部分 | 不适用 | — |

## 不做的事

- **多供应商灵活性**：故意只做 DeepSeek
- **IDE 集成**：终端优先
- **追最难的 reasoning 榜单**：DeepSeek 在编程任务上有竞争力，非 PhD 级证明
- **完全离线/永远免费**：需要 DeepSeek API Key

## Resources

- [GitHub](https://github.com/esengine/DeepSeek-Reasonix)
- [官网](https://esengine.github.io/DeepSeek-Reasonix/)
- [配置指南](https://esengine.github.io/DeepSeek-Reasonix/configuration.html?lang=zh)
- [Discord 社区](https://discord.gg/XF78rEME2D)