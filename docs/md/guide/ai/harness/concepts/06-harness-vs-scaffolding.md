---
title: "Harness vs 脚手架（Scaffolding）"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# 06 — Harness vs 脚手架（Scaffolding）

## 为什么需要区分这两个概念

"Harness（驭化层）"和"脚手架（Scaffolding）"在 AI Agent 语境下经常被混用，但 arXiv 论文 2603.05344 对它们做出了精确区分——这个区分对实践有重要指导意义。

---

## 核心定义

### 脚手架（Scaffolding）

**构建阶段的准备层**——在第一个 Prompt 被发送之前存在的一切。

包括：
- 模型选择和配置
- 初始系统提示的构建
- 工具定义（可用工具的列表和描述）
- 初始上下文的组装（相关文件、规范文档）
- Agent 工作流的整体编排逻辑

**类比**：建筑施工中的脚手架——在建筑完成后可以拆除的临时支撑结构。

### Harness（驭化层）

**运行时的持久编排层**——在 Agent 运行的整个生命周期中持续存在。

包括：
- 工具调用的实际执行
- 上下文窗口的动态管理
- 跨对话的状态持久化
- 安全边界的执行（沙箱、权限控制）
- 错误恢复和重试逻辑
- 子 Agent 的生命周期管理
- 人工干预点（Human-in-the-loop）

**类比**：建筑的永久结构——它是最终产品的一部分，持续运行。

---

## 在代码层面的区分

### 属于脚手架的代码

```python
# scaffolding.py — 构建 Agent 运行环境

def build_agent_context(task: Task, codebase: Codebase) -> AgentContext:
    """构建 Agent 执行任务所需的初始上下文"""
    relevant_files = codebase.find_relevant_files(task.description)
    system_prompt = PromptBuilder()...
    tools = [ReadFileTool(), WriteFileTool(), RunCommandTool(...)]
    return AgentContext(system_prompt=system_prompt, tools=tools)
```

### 属于 Harness 的代码

```python
# harness.py — Agent 运行时的编排层

class AgentHarness:
    def execute_tool_call(self, tool_name: str, args: dict) -> ToolResult:
        # 安全检查：防止越权操作
        if not self.security_policy.allows(tool_name, args):
            return ToolResult.denied(...)

        # 执行工具
        try:
            result = self.tools[tool_name].execute(args)
            self.audit_log.record(tool_name, args, result)
            return result
        except Exception as e:
            return ToolResult.error(message=str(e), suggestion=...)
```

---

## 为什么这个区分重要

### 在设计层面

| 决策 | 属于脚手架 | 属于 Harness |
|------|----------|------------|
| "选哪个模型" | ✅ | |
| "系统提示写什么" | ✅ | |
| "允许 Agent 使用哪些工具" | ✅ | |
| "如何执行文件写入操作" | | ✅ |
| "上下文窗口满了怎么办" | | ✅ |
| "工具调用失败如何重试" | | ✅ |
| "是否需要人工确认" | | ✅ |

### 在演进层面

**脚手架演进**：随着对任务的理解加深，调整系统提示、工具集合、上下文构建策略。

**Harness 演进**：随着生产经验积累，强化安全边界、优化状态管理、改善错误恢复机制。

---

## 主流工具的 Harness 实现

### OpenAI Codex

```
Codex Harness 架构：
├── App Server（双向 JSON-RPC API）
├── 沙箱执行环境（基于 git worktree 的任务隔离）
├── 状态管理（跨对话任务进度追踪）
└── Human-in-the-loop（敏感操作的确认流程）
```

### Claude Code（Anthropic）

```
Claude Code Harness 架构：
├── CLAUDE.md（上下文工程层）
├── .claude/hooks/（事件驱动的自定义逻辑）
├── .claude/skills/（可复用工作流）
├── MCP 服务器（工具扩展）
└── 自动压缩（上下文窗口管理）
```

### LangChain / LangGraph

```
LangChain Harness 中间件栈：
├── LocalContext（隔离的文件系统上下文）
├── LoopDetection（防止无限循环）
├── ReasoningSandwich（强制 COT 推理）
├── ToolCallValidator（工具调用验证）
└── StateCheckpointer（检查点式状态持久化）
```

---

## "薄 Harness" vs "厚 Harness" 的争论

业界对 Harness 应该多厚存在争论：

**Anthropic 立场（薄 Harness）**：
> "Claude Code 是对模型最薄的封装。我们的工作是让模型本身更强，而不是用复杂的 Harness 掩盖模型的不足。"

**OpenAI/LangChain 立场（厚 Harness）**：
> "相同模型，不同 Harness，性能差异超过 36 个百分点。Harness 不是补丁，是基础设施。"

**实践建议**：从薄 Harness 开始，观察真实失败，按需加厚。不要为假想的问题预防性地构建复杂 Harness。

---

## 下一步

- 开始实施：→ `../practice/4-week-roadmap.md`
- 查看完整工具生态：→ `../../ecosystem-tools-comparison.md`
- 深入了解这场争论：→ `../../debate-big-model-vs-harness.md`
