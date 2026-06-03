---
title: "OMC 实战：19 个 Agent 打造更智能、更可靠、更高效的 Claude Code 工作流"
author: "术哥 · 运维有术"
date: "2026-05-21"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/BE4dJP-0sn5FsF_MYIE-Fw"
---

# OMC 实战：19 个 Agent 打造更智能的 Claude Code 工作流

> oh-my-claudecode (OMC) 通过 Hooks → Skills → Agents → State 四层架构，把 Claude Code 从手动指挥一个 Agent 升级为自动协调 19 个专业 Agent。

![OMC 核心架构概览](images/omc-19-agents-architecture/01.png)

---

## 1. Claude Code 底层机制

![Claude Code 四层架构](images/omc-19-agents-architecture/02.png)

Claude Code 采用工具增强的 Agent 架构：**思考 → 调用工具 → 处理结果 → 继续思考**。

四层系统：用户界面层 → Claude Code Core（会话/权限/上下文） → Agent Loop（多轮推理） → LLM + 工具系统。

关键限制：Agent Teams 的派生是**手动的**——你得自己管理子 Agent 的模型、职责、上下文、状态追踪、错误恢复。

### Hooks：零上下文成本的自动化

Hooks 在 Agent 循环外运行，不占用上下文窗口。11 个生命周期事件覆盖 SessionStart → PreToolUse/PostToolUse → Stop → SessionEnd。

OMC 的 20 个 Hook 脚本拦截这些事件实现智能路由：

| Hook | 触发事件 | 职责 |
|------|---------|------|
| keyword-detector | UserPromptSubmit | 检测魔法关键词 → 激活 Skill |
| persistent-mode | Stop | ralph/ultrawork 阻止提前停止 |
| pre-compact | PreCompact | 上下文压缩前保存到 notepad |
| subagent-tracker | SubagentStart/Stop | 追踪 Agent 状态 |

---

## 2. OMC 架构设计

![OMC 四大系统互联流程](images/omc-19-agents-architecture/03.png)

四层管线：**用户输入 → Hooks（事件检测）→ Skills（行为注入）→ Agents（任务执行）→ State（进度追踪）**

### 19 个 Agent 分四个泳道

| 泳道 | Agent | 职责 | 模型 |
|------|-------|------|------|
| Build/Analysis | explore | 代码库发现、文件映射 | Haiku |
| | analyst | 需求分析、隐藏约束 | Opus |
| | planner | 任务排序、执行计划 | Opus |
| | architect | 系统设计、接口定义 | Opus |
| | debugger | 根因分析、编译错误 | Sonnet |
| | executor | 代码实现、重构 | Sonnet |
| | verifier | 完成验证、测试充分性 | Sonnet |
| | tracer | 因果追踪、竞争假设 | Sonnet |
| Review | security-reviewer | 安全漏洞、信任边界 | Sonnet |
| | code-reviewer | 综合代码审查、API 契约 | Opus |
| Domain | test-engineer, designer, writer, git-master 等 | 各领域专业任务 | 按职责 |
| Coordination | critic | 计划差距分析、多角度审查 | Opus |

**critic 的设计很关键**——执行前专门挑毛病，planner 出方案，critic 找漏洞，迭代直到方案健壮。

### 模型路由

| 层级 | 模型 | 场景 | 成本 |
|------|------|------|------|
| LOW | claude-haiku-4-5 | 快速查找、简单任务 | 低 |
| MEDIUM | claude-sonnet-4-6 | 代码实现、调试、测试 | 中 |
| HIGH | claude-opus-4-7 | 架构设计、战略分析 | 高 |

节省 30-50% token。

### State 系统

```
.omc/
├── state/          # 按模式的状态文件
├── notepad.md      # 抗压缩的记忆便笺
├── project-memory.json  # 跨会话项目知识
├── plans/          # 执行计划
└── notepads/{plan}/ # learnings + decisions + issues
```

notepad.md 抗上下文压缩——压缩前 pre-compact Hook 保存，新会话自动恢复。

### Agent 协作链路

```
explore → analyst → planner → critic → executor → verifier
(发现)    (分析)     (排序)     (审查)    (实现)      (确认)
```

---

## 3. 三种执行模式

![三种核心执行模式对比](images/omc-19-agents-architecture/04.png)

| 模式 | 场景 | 特点 | 触发 |
|------|------|------|------|
| **Autopilot** | 端到端功能开发 | 全自主五阶段，配置少 | `autopilot:` 前缀 |
| **Ultrawork** | 批量修复、并行重构 | 最大并行度，多 Agent 同时工作 | `ultrawork` 关键词 |
| **Ralph** | 必须完整完成的任务 | 循环直到验证通过 | `ralph:` 前缀 |
| **Team** | 多模块协作、复杂 Bug | 五阶段流水线，共享任务列表 | `/team N:agent` |
| **CCG** | 混合后端 + UI | Codex + Gemini + Claude 三模型协作 | `ccg:` 前缀 |

### 效率对比

| 维度 | 单 Agent | OMC |
|------|---------|-----|
| 50 个类型错误 | 逐个文件排队，50 轮 | Ultrawork 并行，同时开工 |
| 上下文管理 | 手动传递 | notepad 自动抗压缩 |
| 模型选择 | 全用同一个 | 按任务复杂度自动路由 |

---

## 4. 使用建议

- **日常开发** → `autopilot` 上手
- **批量修复** → `ultrawork`
- **复杂多模块** → `team`
- **严格标准** → `ralph`
- **预算有限** → `OMC_MODEL_HIGH=sonnet` 降级

---

## 5. 总结

OMC 的核心不是在 Claude Code 上加功能，而是在 Hooks 机制上搭建了完整的 Agent 编排层。适合已经用 Claude Code、有多 Agent 协作实际需求的开发者。任务简单的话可能偏重，多文件重构、批量修复、端到端自动化的场景下优势明显。
