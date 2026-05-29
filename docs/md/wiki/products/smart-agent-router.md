---
title: "smart-agent-router"
date: "2026-05-29"
---

# Smart Agent Router

> 轻量级 Agent 路由器，根据任务复杂度自动决定是否使用子 Agent 及如何分配身份

**GitHub**: https://github.com/kaijie0074-art/smart-agent-router

## Core Concept

**核心理念**：不是每个任务都需要子 Agent。

- **S 级任务**：主 Agent 直接处理，无需子 Agent
- **M 级任务**：1-2 个子 Agent（如 codebase-researcher）
- **L 级任务**：2-3 个子 Agent 并行（如 researcher + frontend + backend）
- **XL 级任务**：先 plan/review，再执行

## 路由决策流程

1. **判别任务难易程度**：S/M/L/XL
2. **决定是否使用子 Agent**：只有需要并行或上下文隔离时才使用
3. **分配子 Agent 身份**：researcher / frontend / backend / reviewer 等
4. **开始执行**

## Quick Start

```bash
npx smart-agent-router init          # 安装路由规则和子 Agent 模板
npx smart-agent-router doctor        # 检查项目是否就绪
npx smart-agent-router demo          # 演示路由分类（不修改文件）
```

## 安装文件

```
your-project/
├── CLAUDE.md                  # 路由规则块
└── .claude/
    ├── agent-router.yaml     # 结构化路由配置
    └── agents/
        ├── codebase-researcher.md
        ├── frontend-agent.md
        ├── backend-agent.md
        ├── ai-pipeline-agent.md
        ├── reviewer-agent.md
        └── docs-agent.md
```

## Modes

| Mode | 最大子 Agent 数 | 安装内容 |
|------|---------------|---------|
| `minimal` | 2 | researcher + reviewer |
| `recommended`（默认）| 3 | 6 个核心 agents |
| `aggressive` | 4 | 全部 9 个 agents |
| `speed-first` | 6 | 全部 9 个 agents + 速度优先覆盖 |

## Presets

| Preset | 适用场景 |
|--------|---------|
| `default` | 通用项目 |
| `web-app` | 前端+后端 Web 应用 |
| `ai-app` | LLM/AI 流水线产品 |
| `wechat-miniapp` | 微信小程序 |
| `docs-only` | 文档仓库 |
| `solo-founder` | 一人公司端到端交付 |

## 与 Claude Code 配合

安装后在 Claude Code 中粘贴：

```
请先读取 CLAUDE.md 和 .claude/agent-router.yaml。
根据任务复杂度选择最少但足够的子 Agent。
不要默认启动所有 Agent。
现在任务是：……
```

## 哲学

- 子 Agent 不是越多的好
- 简单任务应该保持简单
- 子 Agent 用于上下文隔离、并行探索和风险降低，而非装饰
- 主 Agent 保留最终决策权
- Token 消费应该是 intentional 的

## Resources

- [GitHub](https://github.com/kaijie0074-art/smart-agent-router)