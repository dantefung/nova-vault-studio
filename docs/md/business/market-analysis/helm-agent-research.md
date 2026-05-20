---
title: "Helm — Always-On Coding Agent 竞品研究"
date: "2026-05-20"
source: "@Phodal 推荐 + 官网分析"
url: "https://helmagent.dev/"
---

# Helm — Always-On Coding Agent 竞品研究

> 一句话：Helm 是一个基于 Claude Agent SDK 的**常驻型编码代理运行时**，通过 Bun HTTP+SSE 守护进程让 Agent 在终端关闭后继续工作，搭配 Electron 桌面客户端和 CLI 双端操作。

---

## 核心定位

Helm 不是"又一个 AI 编程助手"，而是一个 **Agent Runtime**——它解决了当前 AI 编程工具的最大痛点：**终端一关，Agent 就死了**。

```
传统 Agent：终端进程 → 关终端 → Agent 停止
Helm Agent：CLI/桌面 → Daemon(127.0.0.1:42424) → 关终端 → Daemon 继续跑
```

---

## 架构

| 组件 | 技术 | 说明 |
|------|------|------|
| Daemon | Bun HTTP+SSE | 分离进程，lockfile + zombie detect，SIGTERM 安全退出 |
| CLI | npm 包 `helm-agent` | 终端操作入口 |
| Desktop | Electron + React 19 + Tailwind 4 | macOS 桌面应用 |
| Model | @anthropic-ai/claude-agent-sdk | Claude Agent SDK |
| 密钥 | OS Keychain (0600 fallback) | 密钥不过 HTTP |

---

## 六大命令

| 命令 | 功能 |
|------|------|
| `helm daemon start` | 启动守护进程 |
| `helm setup` | 交互式配置向导（provider → workspace → delivery） |
| `helm workspace chat` | 发起会话 |
| `helm issue add` | 添加任务到队列 |
| `helm cron add` | 定时任务 |
| `helm eval run` | 运行评估 |

---

## 关键差异化能力

### 1. 守护进程 — 断线继续跑
Daemon 存活周期独立于客户端。关终端、重启 App，Daemon 不受影响。重新连接后回放 buffer。

### 2. 任务队列 + 循环 + 定时
内置任务队列（triage/todo/in_progress/done），`loop` 模式自动连续处理任务（含 crash-resume），`cron` 定时触发。

### 3. 多工作区 + 多 Provider
每个 workspace 独立配置 provider、model、permission mode、SOUL.md 角色。支持 Anthropic SDK-default 和自定义 provider。

### 4. 四级权限模式
- `default` — 每次写入前询问
- `acceptEdits` — 自动批准文件编辑，其他仍询问
- `bypassPermissions` — 跳过所有确认
- `plan` — 只读，只输出方案不写代码

### 5. 交付通道
支持 Telegram、DingTalk（钉钉）、WeCom（企业微信）、Webhooks。

---

## 与我们产品的对比

| 维度 | Helm | Nova Vault Studio |
|------|------|-------------------|
| 定位 | Agent 运行时（基础设施层） | 内容站点 + Agent 工作台 |
| 常驻 | 原生守护进程 | 无 |
| 多 Agent | 多 session 并行 | Skill 调度 |
| 自动化 | cron + loop + queue | 无内置 |
| 桌面端 | Electron 原生 | 无 |
| 内容管理 | 无 | VitePress 文档站点 |
| 竞合关系 | 互补——Helm 做运行时，Nova 做内容 | — |

---

## Phodal 原话

> @Phodal: "有想打擂台的同类产品"

---

## 信息来源

- 官网：https://helmagent.dev/
- GitHub：https://github.com/helm-agent/helm-agent
- 技术栈：Bun + Electron + React 19 + Tailwind 4 + Claude Agent SDK
- 平台：macOS（桌面）/ Linux + Windows（CLI）
- Node ≥ 20
