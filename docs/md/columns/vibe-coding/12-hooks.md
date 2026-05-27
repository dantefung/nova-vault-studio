---
title: "Hooks 自动化与 12 原则"
date: "2026-05-27"
source: "整合自 08-01-when-to-use-hooks.md + 08-02-hooks-automation-workflow.md + 08-03-vibe-coding-12-principles.md"
url: "/columns/vibe-coding/12-hooks"
---

# Hooks 自动化与 12 原则

> 本篇整合自三篇原始文档：
> - [references/08-hooks/08-01-when-to-use-hooks.md](references/08-hooks/08-01-when-to-use-hooks.md)
> - [references/08-hooks/08-02-hooks-automation-workflow.md](references/08-hooks/08-02-hooks-automation-workflow.md)
> - [references/08-hooks/08-03-vibe-coding-12-principles.md](references/08-hooks/08-03-vibe-coding-12-principles.md)

---

## 一、什么时候该用 Hooks

> 判断标准：凡是需要反复提醒 AI 的事，都应该考虑从 prompt 里拿出来，交给 Hook。

### Prompt 适合表达意图，Hook 适合固化规则

越是稳定、重复、容易忘的流程，越应该交给环境默认执行。

### 典型使用场景

| 场景 | 用 Prompt 还是 Hook |
|------|---------------------|
| 每次改完代码都要格式化 | Hook |
| 每次提交前都要跑 lint / test | Hook |
| 禁止修改某些目录或配置文件 | Hook |
| 生成代码后自动检查类型错误 | Hook |
| 操作高风险文件前先拦截确认 | Hook |
| 会话开始时自动注入项目上下文 | Hook |
| 任务结束时自动记录变更摘要 | Hook |
| 一次性需求 | Prompt |
| 表达意图/目标 | Prompt |

**核心原则**：Prompt 告诉 AI "想要什么"，Hook 告诉 AI "必须这样做"。

---

## 二、用 Hooks 打造自动化工作流

### 什么是 Hook

Hook 是在 Claude 生命周期的固定节点自动执行的 shell 命令。不需要你给 Claude 下任何指令，Hook 就已经跑完了。

**Hook 把行为从 Claude 的判断里抽出来，放到你的项目规则里。代码质量、通知、安全检查——这些最要紧的事应该放在 Hook 里，不是 prompt 里。**

### 5 个核心 Hook 事件

| 事件 | 触发时机 | 用途 |
|------|----------|------|
| **PostToolUse** | Claude 用完工具后触发 | 自动格式化、跑 linter、记变更日志 |
| **PreToolUse** | Claude 调工具之前触发 | 保护敏感文件（.env、package-lock.json）、阻止危险命令 |
| **Notification** | Claude 需要你关注时触发 | 弹桌面通知，不用盯着终端 |
| **Stop** | Claude 回复结束时触发 | 跑测试、跑 CI、自动提交——Claude 说"搞完了"之后自动执行 |
| **SessionStart** | 会话启动或恢复时触发 | 压缩（compaction）之后重新灌上下文 |

建议从这三个开始：

1. **PostToolUse** — 自动格式化
2. **PreToolUse** — 拦截危险命令
3. **Stop** — 桌面通知

覆盖最广，上手最容易。

### Hook 的三种类型

**1. Command Hook（`"type": "command"`）**

标准的 shell 命令 Hook。

```json
{
  "type": "command",
  "command": "npx prettier --write $CLAUDE_FILE_PATH"
}
```

**2. Prompt Hook（`"type": "prompt"`）**

把 Hook 的输入丢给 Claude 模型（默认用 Haiku）做判断，返回是/否。适合需要模型理解的场景。

```json
{
  "type": "prompt",
  "prompt": "Check if all tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains to be done\"}."
}
```

比写正则强。

**3. Agent Hook（`"type": "agent"`）**

起一个子代理，能读文件、搜代码、跑工具，最多 50 轮。适合需要对照实际代码状态做判断的情况——比如 Claude 停之前确认测试确实过了。

**4. HTTP Hook（`"type": "http"`）**

把事件数据 POST 到 URL，不跑 shell。适合团队审计日志、共享通知服务、webhook 集成。

### Hook 配置位置

| 位置 | 范围 |
|------|------|
| `~/.claude/settings.json` | 所有项目（全局） |
| `.claude/settings.json` | 当前项目（提交到仓库，团队共享） |
| `.claude/settings.local.json` | 当前项目，不提交 |

### 基础配置结构

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolName|OtherTool",
        "hooks": [
          {
            "type": "command",
            "command": "your shell command here"
          }
        ]
      }
    ]
  }
}
```

### 实用配置示例

**自动格式化（PostToolUse）**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

**拦截危险命令（PreToolUse）**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo '$CLAUDE_TOOL_INPUT' | grep -q 'rm -rf /'; then echo 'BLOCKED'; exit 1; fi"
          }
        ]
      }
    ]
  }
}
```

**自动提交（Stop）**

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "git add -A && git commit -m 'chore: auto-commit on session end' || true"
          }
        ]
      }
    ]
  }
}
```

---

## 三、Vibe Coding 12 原则

> 掌握 Vibe Coding 12 原则，从会用 Agent 到做出 Agent PoC。

### 四阶段学习路径

```
准备 (Prepare) → 执行 (Execute) → 协作 (Collaborate) → 迭代 (Iterate)
```

### 阶段 1：准备 (Prepare)

- **单一真源** (Single Source of Truth) — 一个地方存储所有信息
- **提示词先行** (Prompt First) — 先想清楚怎么和 AI 说
- **上下文洁净** (Context Hygiene) — 给 AI 的信息要干净、准确

为高效的 AI 协作奠定坚实基础。

### 阶段 2：执行 (Execute)

- **人在回路** (Human-in-the-Loop) — AI 做事，人监督
- **分块工作** (Chunked Work) — 把大任务切成小块
- **并行流程** (Parallel Flow) — 能同时做的事不串行

实施系统化的开发过程。

### 阶段 3：协作 (Collaborate)

- **认知负荷预算** (Cognitive Load Budget) — 不要一次给太多信息
- **心流保护** (Flow Protection) — 保持专注，不被打断
- **可复现会话** (Reproducible Sessions) — 会话可以随时继续

优化团队协作模式。

### 阶段 4：迭代 (Iterate)

- **休息与反思** (Rest & Reflection) — 定期停下来想想
- **技能对等** (Skill Parity) — 你的技能和 AI 的技能要匹配
- **好奇心文化** (Culture of Curiosity) — 保持学习的热情

鼓励持续改进与学习。

---

## 资源

- 官网：https://12factor.me/zh
- Agent Way：https://agentway.dev/zh