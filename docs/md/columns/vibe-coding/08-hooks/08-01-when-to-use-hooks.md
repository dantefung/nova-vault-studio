---
title: "什么时候该用 Hooks"
date: "2026-05-22"
---

# 什么时候该用 Hooks

> 判断标准：凡是需要反复提醒 Claude 的事，都应该考虑从 prompt 里拿出来，交给 Hook。

## Prompt 适合表达意图，Hook 适合固化规则

越是稳定、重复、容易忘的流程，越应该交给环境默认执行。

## 什么时候用 Hooks

### 1. 每次改完代码都要格式化

```json
{
  "event": "after_write",
  "actions": ["format"]
}
```

### 2. 每次提交前都要跑 lint / test

```json
{
  "event": "before_commit",
  "actions": ["lint", "test"]
}
```

### 3. 禁止修改某些目录或配置文件

```json
{
  "event": "before_write",
  "condition": "path.includes('.env')",
  "actions": ["block", "confirm"]
}
```

### 4. 生成代码后自动检查类型错误

```json
{
  "event": "after_write",
  "actions": ["typecheck"]
}
```

### 5. 操作高风险文件前先拦截确认

```json
{
  "event": "before_write",
  "condition": "isHighRisk(path)",
  "actions": ["confirm"]
}
```

### 6. 会话开始时自动注入项目上下文

```json
{
  "event": "session_start",
  "actions": ["inject_context"]
}
```

### 7. 任务结束时自动记录变更摘要

```json
{
  "event": "task_end",
  "actions": ["log_summary"]
}
```

## 总结

| 场景 | 用 Prompt 还是 Hook |
|------|---------------------|
| 一次性需求 | Prompt |
| 稳定重复流程 | Hook |
| 容易忘的规则 | Hook |
| 表达意图/目标 | Prompt |
| 固化操作流程 | Hook |

**核心原则**：Prompt 告诉 Claude "想要什么"，Hook 告诉 Claude "必须这样做"。