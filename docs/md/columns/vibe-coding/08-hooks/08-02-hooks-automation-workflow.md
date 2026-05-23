---
title: "从0开始：用Hooks打造自动化Claude Code工作流"
date: "2026-05-23"
source: "Vince 聊开发"
url: "https://x.com/i/status/2054457804057100405"
---

# 从 0 开始：用 Hooks 打造自动化 Claude Code 工作流

> 你让 Claude Code 写功能、补测试、格式化文件，最后顺手提交。它功能写了，测试也补了大半，格式化跑了两个文件，但偏偏漏了一个。然后它很自然地告诉你："搞完了。"

但这些问题，其实不该靠你事后检查。在 Claude Code 里，它们都可以配置成自动流程。

这就是 **Hook 存在的理由**。

## 什么是 Hook

Hook 是在 Claude 生命周期的固定节点自动执行的 shell 命令。不需要你给 Claude 下任何指令，Hook 就已经跑完了。

**Hook 把行为从 Claude 的判断里抽出来，放到你的项目规则里。代码质量、通知、安全检查。这些最要紧的事应该放在 Hook 里，不是 prompt 里。**

## 5 个核心 Hook 事件

| 事件 | 触发时机 | 用途 |
|------|----------|------|
| **PostToolUse** | Claude 用完工具后触发 | 自动格式化、跑 linter、记变更日志 |
| **PreToolUse** | Claude 调工具之前触发 | 保护敏感文件（.env、package-lock.json）、阻止危险命令 |
| **Notification** | Claude 需要你关注时触发 | 弹桌面通知，不用盯着终端 |
| **Stop** | Claude 回复结束时触发 | 跑测试、跑 CI、自动提交——Claude 说"搞完了"之后自动执行 |
| **SessionStart** | 会话启动或恢复时触发 | 压缩（compaction）之后重新灌上下文 |

### 建议：从这三个开始

1. **PostToolUse** — 自动格式化
2. **PreToolUse** — 拦截危险命令
3. **Stop** — 桌面通知

覆盖最广，上手最容易。

## Hook 的三种类型

除了标准的 shell 命令 Hook（`"type": "command"`），还有三种：

### 1. Prompt Hook（`"type": "prompt"`）

把 Hook 的输入丢给 Claude 模型（默认用 Haiku）做判断，返回是/否。适合需要模型理解的场景。

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if all tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains to be done\"}."
          }
        ]
      }
    ]
  }
}
```

比写正则强。

### 2. Agent Hook（`"type": "agent"`）

起一个子代理，能读文件、搜代码、跑工具，最多 50 轮。适合需要对照实际代码状态做判断的情况——比如 Claude 停之前确认测试确实过了。

### 3. HTTP Hook（`"type": "http"`）

把事件数据 POST 到 URL，不跑 shell。适合团队审计日志、共享通知服务、webhook 集成。

## Hook 配置位置

Hook 配置放在三个位置之一：

| 位置 | 范围 |
|------|------|
| `~/.claude/settings.json` | 所有项目 |
| `.claude/settings.json` | 当前项目（提交到仓库，团队共享） |
| `.claude/settings.local.json` | 当前项目，不提交 |

## 基础配置结构

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

## 实际应用示例

### 自动格式化（PostToolUse）

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

### 拦截危险命令（PreToolUse）

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

### 自动提交（Stop）

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

> 来源：[@Vince 聊开发](https://x.com/vincemask)