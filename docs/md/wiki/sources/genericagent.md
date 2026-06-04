---
title: "GenericAgent — 从 3K 行种子代码自我进化的 AI Agent 框架"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/lsdefine/GenericAgent"
---

# GenericAgent — 从 3K 行种子代码自我进化的 AI Agent 框架

> Self-evolving agent: grows skill tree from 3.3K-line seed, achieving full system control with 6x less token consumption. 12.5k Stars，极致精简 + 自我进化。

<!-- more -->

## 核心定位

**设计哲学：不要预设技能，靠进化获得能力。**

每解决一个新任务，GenericAgent 将执行路径自动固化为 Skill，存入分层记忆系统。使用时间越长，技能树越丰富，形成完全属于用户的个性化 Agent。

> 自举实证：作者全程未打开过一次终端，所有 commit、Skill 安装均由 Agent 自主完成。

## 架构三要素

### 分层记忆系统（5 层）

| 层级 | 名称 | 说明 |
|------|------|------|
| L0 | Meta Rules | 基础行为规则和系统约束 |
| L1 | Insight Index | 极简索引，快速路由与召回 |
| L2 | Global Facts | 长期积累的稳定知识 |
| L3 | Task Skills / SOPs | 可复用任务流程 |
| L4 | Session Archive | 已完成任务提炼的归档 |

### 9 个原子工具

`code_run`（执行代码）、`file_read`、`file_write`、`file_patch`、`web_scan`、`web_execute_js`（控制浏览器）、`ask_user`（人机确认）、`update_working_checkpoint`、`start_long_term_update`

### ~100 行 Agent Loop

核心执行循环仅约百行代码（`agent_loop.py`），感知 → 推理 → 执行 → 写记忆 → 循环。

## 核心能力

- **真实浏览器注入**：保留登录态，覆盖浏览器/终端/文件系统/键鼠/屏幕视觉/ADB
- **极致省 Token**：上下文 <30K，是其他 Agent（200K-1M）的零头，6 倍 token 节省
- **多 IM 前端**：Telegram / 微信 / QQ / 飞书 / 企业微信 / 钉钉
- **多前端**：桌面 App / Terminal UI / Streamlit UI
- **多模型兼容**：Claude / Gemini / Kimi / MiniMax

## 自我进化机制

```
[新任务] → [自主摸索：装依赖/写脚本/调试验证] → [固化为 Skill 写入记忆层] → [下次同类任务直接调用]
```

## 数据

- **12.5k Stars** · **1.4k Forks**
- **800 Commits**
- **Python 89.8%** · JavaScript 6.6%
- [arXiv 技术报告](https://arxiv.org/abs/2604.17091)

## 与同类对比

| | GenericAgent | OpenClaw | Claude Code |
|--|-------------|----------|-------------|
| 代码量 | ~3K 行 | ~530K 行 | 已开源体量大 |
| 浏览器 | 真实浏览器保留登录态 | 沙箱/无头 | MCP 插件 |
| 进化 | 自主生长 Skill | 插件生态 | 会话间无状态 |
| Token 消耗 | <30K | 200K-1M | 较大 |