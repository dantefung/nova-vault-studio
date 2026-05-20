---
title: "AI 编程工具生态全景"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# AI 编程工具生态全景

> 2026 年 3 月，主流 Harness Engineering 工具的横向比较

---

## 核心工具比较

| 工具 | 来源 | 驭化层配置方式 | 特点 |
|------|------|--------------|------|
| **OpenAI Codex** | OpenAI | `AGENTS.md` + `skills/` | 内置完整驭化架构，App Server 统一接口 |
| **Claude Code** | Anthropic | `CLAUDE.md` + `.claude/` | 薄封装理念，Hooks 系统灵活 |
| **Cursor** | Anysphere | `.cursorrules` | IDE 集成，人机协作体验最佳 |
| **GitHub Copilot** | Microsoft | 工作区配置 | 企业集成，VS Code 深度整合 |

---

## OpenAI Codex

### 定位

OpenAI 官方推出的编程 Agent，也是 Harness Engineering 概念的原始实践平台。

### 驭化层配置

```
项目根目录/
├── AGENTS.md              ← 主导航（≤100 行）
├── skills/
│   ├── SKILL.md           ← 技能索引
│   └── [skill-name].md    ← 具体技能文档（每个 ≤60 行）
└── docs/                  ← 详细文档目录
```

### 关键特性

**App Server 架构**：
- 双向 JSON-RPC API，统一 Web/CLI/IDE 的通信
- 流式工具调用结果，实时反馈
- 基于 git worktree 的任务隔离沙箱

---

## Claude Code（Anthropic）

### 定位

Anthropic 推出的"对模型最薄的封装"，强调模型能力本身而非复杂的驭化层。

### 驭化层配置

```
项目根目录/
├── CLAUDE.md              ← 主配置（类似 AGENTS.md）
└── .claude/
    ├── hooks/
    │   ├── PostToolUse.sh
    │   └── PreCommit.sh
    └── skills/
        └── [skill].md
```

### 关键特性

**Hooks 系统**：事件驱动的自定义逻辑，PostToolUse、PreCommit、AfterCompaction 等。

**MCP（Model Context Protocol）**：标准化的工具扩展协议，可连接外部服务。

**自动上下文压缩**：对话历史过长时自动压缩，`AfterCompaction` hook 可在压缩后重新注入关键上下文。

---

## LangChain / LangGraph

### 定位

开源框架，提供构建 Agent 应用的基础设施，驭化层通过代码配置。

### 驭化层架构

```python
from langchain_core.middleware import (
    LocalContextMiddleware,    # 隔离的文件系统上下文
    LoopDetectionMiddleware,   # 检测和阻断无限循环
    ReasoningSandwich,         # 强制链式思考推理
    ToolCallValidator,         # 验证工具调用参数
    StateCheckpointer,         # 检查点式状态持久化
)
```

### 关键数据

LangChain Terminal Bench 2.0（2026年2月）：
- 基础配置：52.8% 成功率（Top 30 以外）
- 优化驭化层后：66.5% 成功率（Top 5）
- 提升：+13.7 个百分点，不换模型

---

## snarktank/ralph

### 定位

开源的自主 Agent 循环框架（GitHub 13,400+ Stars），高吞吐哲学的参考实现。

### 核心机制

```
PRD（prd.json）← 任务清单
      ↓
Ralph 启动循环
      ↓
读取 progress.txt + git 历史 → 理解当前状态
      ↓
执行下一个未完成任务
      ↓
运行验证（测试 + lint）
      ↓
更新 progress.txt
      ↓
重复，直到 PRD 全部完成
```

---

## 工具选型建议

### 如何选择

```
是否有强烈的工具偏好？
├── 偏好 OpenAI → Codex
├── 偏好 Anthropic → Claude Code
└── 不确定 → 先从 Claude Code 开始

项目规模？
├── 小型（1-3 人）→ Claude Code 或 Cursor
├── 中型（3-20 人）→ Codex 或 Claude Code + 自定义 Harness
└── 大型（20+ 人）→ LangChain/LangGraph

是否需要自主循环（无人值守）？
└── 是 → 参考 ralph 模式
```

### 通用建议

无论选择哪个工具：
1. 从最小化驭化层开始，观察真实失败再扩展
2. AGENTS.md 或 CLAUDE.md 保持 ≤ 100 行
3. 工具数量 ≤ 10 个（避免"愚蠢区"）
4. 建立测试套件作为 Agent 的自我验证机制
