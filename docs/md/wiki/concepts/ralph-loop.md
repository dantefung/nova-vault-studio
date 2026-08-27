---
title: "Ralph Loop"
date: "2026-08-27"
source: "博客 - 阿里云云原生"
url: "https://www.cnblogs.com/alisystemsoftware/p/19540015"
---

# Ralph Loop

## 一句话定义

Ralph Loop 是一种以**持续迭代修正**为中心的 AI Agent 运行范式，通过 Stop Hook 拦截 + 明确完成条件（Completion Promise），强制 Agent 不断重试直到任务真正达到可验证的完成标准。

## 核心机制

### Stop Hook 拦截

当 Agent 在某次迭代中尝试退出（认为任务完成）时，系统通过特定的退出码截断退出信号，并重新注入原始任务提示，形成自我参照的反馈循环。

### 完成条件（Completion Promise）

必须定义**可机器验证**的完成标准，例如：
- 所有测试通过
- 输出特定关键字 `<promise>COMPLETE</promise>`
- 构建无错误、Lint 清洁
- 测试覆盖率 > 80%

### 最大迭代次数（安全阀）

```bash
/ralph-loop "任务描述" --max-iterations 30 --completion-promise "COMPLETE"
```

## 为什么需要 Ralph Loop

| 痛点 | 说明 |
|------|------|
| **过早退出** | LLM 在主观认为"足够好"时就停止，而非达到客观标准 |
| **单次提示脆弱** | 复杂任务无法通过一次提示完成，需反复人工干预 |
| **上下文腐烂** | 对话轮次增加后，LLM 对早期指令的注意力线性下降 |
| **重新提示成本高** | 每次手动重新引导都在浪费开发者时间 |

## 与传统模式的对比

| 模式 | 循环方式 | 退出条件 | 局限 |
|------|----------|----------|------|
| **ReAct** | 会话内感知→推理→行动 | LLM 自我评估 | 自我评估不可靠，容易过早退出 |
| **Plan-and-Execute** | 静态子任务序列 | 按预定计划执行 | 环境变化时适应力弱，需重计划 |
| **Ralph Loop** | 跨会话外部循环 | 机器可验证的完成条件 | 需要明确完成条件，不适合主观任务 |

## 最佳实践

### 1. 从 HITL 转向 AFK

- **HITL（Human-in-the-Loop）**：观察并介入，适合学习优化提示
- **AFK（Away From Keyboard）**：设置完成后离开，适合提示稳定后的规模化使用

### 2. 结构化任务定义（prd.json）

```json
{
  "branchName": "ralph/feature",
  "userStories": [
    {
      "id": "US-001",
      "title": "新聊天按钮创建新对话",
      "acceptanceCriteria": ["点击按钮", "验证创建新对话", "检查欢迎状态"],
      "priority": 1,
      "passes": false
    }
  ]
}
```

### 3. 状态持久化三件套

| 文件 | 用途 |
|------|------|
| `progress.txt` | 追加式日志，记录每轮尝试、坑和代码库模式 |
| `prd.json` | 结构化任务清单，标记 `passes: true` |
| Git 提交记录 | 每步成功后提交，提供变更差分 |

### 4. 反馈循环

每次迭代强制运行：
```bash
tsc --noEmit && npm test && npm run lint
```

### 5. 成本控制

| 任务规模 | 迭代次数 | 成本估算（Claude 3.5 Sonnet） |
|----------|----------|-------------------------------|
| 小任务 | 5-10 次 | $5-15 |
| 中等任务 | 20-30 次 | $15-50 |
| 大型任务 | 30-50 次 | $50-150 |

### 6. Docker 沙箱保护

```bash
docker sandbox run claude
```
防止 AFK 模式下失控 Agent 访问系统敏感文件。

## 适用场景

**✅ 适合：**
- TDD 开发（写测试 → 跑失败 → 改代码 → 重复）
- Greenfield 项目（定义需求，过夜执行）
- 有自动验证的任务（测试/Lint/类型检查可验证）
- 代码重构（机械化重构、大规模测试迁移）
- 测试框架迁移（如 Jest → Vitest）

**❌ 不适合：**
- 需要主观判断或人类设计抉择
- 没有明确成功标准的任务
- 整体策略规划和长期决策
- 成本极度敏感场景

## 实现方式

### Claude Code 插件
```bash
/plugin install ralph-wiggum@claude-plugins-official
/ralph-loop "任务" --max-iterations 50 --completion-promise "COMPLETE"
```

### AI SDK (JavaScript)
```typescript
const agent = new RalphLoopAgent({
  model: 'anthropic/claude-opus-4.5',
  instructions: '...',
  tools: { readFile, writeFile, execute },
  stopWhen: iterationCountIs(50),
  verifyCompletion: async () => ({ complete: true/false, reason: '...' })
});
```

### LangChain / DeepAgents
```bash
uv run deepagents --ralph "Build a Python programming course" --ralph-iterations 5
```

## 交叉引用

- [Loop Engineering](./loop-engineering.md) — 定时循环调度机制，与 Ralph Loop 的区别在于调度频率 vs 完成条件
- [loop-engineering-thoughts](./loop-engineering-thoughts.md) — Loop Engineering 的深度思考，涵盖控制论映射与五代演进
- [agentic-engineer](/md/columns/agentic-engineer/) — AI Agent 工程专栏
