---
title: "从 ReAct 到 Ralph Loop：AI Agent 的持续迭代范式"
date: "2026-01-27"
source: "博客"
url: "https://www.cnblogs.com/alisystemsoftware/p/19540015"
---

# 从 ReAct 到 Ralph Loop：AI Agent 的持续迭代范式

> AI Agent 经常"半途而废"——因为它在主观认为"足够好"时就退出了。Ralph Loop 通过 Stop Hook + 明确完成条件，强制 Agent 持续迭代直到真正完成任务。

作者：丹坤（阿里云云原生）

<!-- more -->

## 痛点：AI 编程助手为何总是"半途而废"？

在使用 AI 编程工具时，开发者常遭遇以下困境：

- **过早退出**：AI 在它认为"足够好"时就停止，而非真正完成任务
- **单次提示脆弱**：复杂任务无法通过一次提示完成，需反复人工干预
- **重新提示成本高**：每次手动重新引导都在浪费开发者时间
- **上下文断裂**：会话重启后，之前的所有进展和上下文全部丢失

本质问题：**LLM 的自我评估机制不可靠**——它在主观认为"完成"时退出，而非达到客观可验证的标准。

## 解决思路：让 AI 持续工作直到真正完成

Claude Code 社区诞生了一种极简但有效的范式——**Ralph Loop（Ralph Wiggum Loop）**：

```bash
while :; do
  cat PROMPT.md | claude-code --continue
done
```

核心思想：**同一个提示反复输入，让 AI 在文件系统和 Git 历史中看到自己之前的工作成果**。这不是简单的"输出反馈为输入"，而是通过外部状态（代码、测试结果、提交记录）形成自我参照的迭代循环。其技术实现依赖于 Stop Hook 拦截机制。

## Ralph Loop 概述

### 什么是 Ralph Loop？

Ralph Loop 是一种**自主迭代循环机制**：

1. 你给出一个任务和完成条件
2. Agent 开始执行
3. 当模型在某次迭代中尝试结束时，Stop Hook 拦截退出动作，重新注入原始任务提示
4. 模型读取上一次迭代改动过的文件、测试结果和 git 历史，逐步修正输出直到达到完成条件或达到设定的迭代上限

简言之：
- 不是简单的一次性运行，而是**持续迭代直到完成任务**
- 循环使用**同一个 prompt**，但外部状态（代码、测试输出、文件等）在每次迭代后发生改变
- 需要明确的**完成条件**（如输出特定关键字、测试通过等）和合理的**最大迭代次数**作为安全控制

### Ralph 名称起源

- **Ralph Wiggum** 来自《辛普森一家》的角色，象征"反复迭代、不放弃"的精神
- 实际实现是一个简单的**循环控制机制**，并非模型自身拥有特殊认知
- 核心机制是 **Stop Hook**（详见 Stop-hook 拦截机制）在模型尝试退出时拦截，并重新注入 prompt
- 迭代不是无条件持续，而是**依赖于明确可验证的完成信号或最大迭代次数**
- **哲学根源**：Ralph 循环可以追溯到软件工程中的"Bash 循环"思维——不断向智能体提供任务，直到任务完成为止

## 核心原理

### 与传统智能体循环的对比

#### ReAct（Reason + Act）模式

ReAct 遵循"观察→推理→行动"的节奏，优势在于动态适应性。但当 LLM 在某一步产生幻觉，认为任务已经完成并选择退出，系统就会在未达到真实目标的情况下停止。

#### Plan-and-Execute（计划并执行）模式

将任务分解为静态的子任务序列。如果第三步执行失败，整个计划往往会崩溃，或需要复杂的重计划机制。

#### Ralph 循环的"外部化"范式

Ralph 循环打破了依赖 LLM 自我评估的局限性。当智能体试图退出当前会话时，系统通过 Stop Hook 截断退出信号。外部控制脚本扫描输出结果，如果未发现预定义的"完成承诺"（Completion Promise），系统将重新加载原始提示词并开启新一轮迭代。

这种模式是**强制性的**——它不依赖智能体的主观判断，而是依赖外部验证。

#### 对比总结

| 模式 | 特点 | 局限 |
|------|------|------|
| ReAct | 观察→推理→行动 | LLM 自我评估不可靠，容易过早退出 |
| Plan-and-Execute | 静态子任务序列 | 环境变化时适应力弱 |
| Ralph Loop | 外部强制迭代直到验证通过 | 需要明确可验证的完成条件 |

### Stop-hook 拦截机制

Ralph 循环的技术优雅之处在于它如何利用现有的开发工具链（Bash、Git、Linter、Test Runner）构建闭环反馈系统。

通过 `hooks/stop-hook.sh` 脚本，开发者可以捕获智能体的退出意图。如果智能体没有输出用户指定的承诺标识（如 `COMPLETE`），停止钩子会阻止正常会话结束，强迫 LLM 面对"只要没有达到客观成功标准，就无法下班"的事实。

### 状态持久化与记忆管理

#### 解决上下文腐烂问题

常规智能体的核心痛点是"上下文腐烂（Context Rot）"——随着对话轮次增加，LLM 对早期指令的注意力和精确度会线性下降。Ralph 循环通过"刷新上下文"解决这个问题：

- 每一轮循环可以看作是一个全新的会话，Agent 不再从臃肿的历史记录中读取状态
- Agent 直接通过文件读取工具扫描当前的项目结构和日志文件
- 状态管理从 LLM 的内存（Token 序列）转移到硬盘（文件系统）
- Git 历史记录是累积的，Agent 可以通过 `git log` 查看之前的尝试路径，避免重复同样的错误

#### 核心持久化组件

| 文件 | 用途 |
|------|------|
| `progress.txt` | 追加式日志，记录每轮迭代的尝试、遇到的坑和已确认的模式 |
| `prd.json` | 结构化的任务清单，每完成一个子项标记 `passes: true` |
| Git 提交记录 | 每一步成功后提交，提供版本回滚和变更差分 |

##### 典型文件结构

```
scripts/ralph/
├── ralph.sh
├── prompt.md
├── prd.json
└── progress.txt
```

##### ralph.sh（主循环脚本）

```bash
#!/bin/bash
set -e
MAX_ITERATIONS=${1:-10}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🚀 Starting Ralph"
for i in $(seq 1 $MAX_ITERATIONS); do
  echo "═══ Iteration $i ═══"
  OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" \
    | amp --dangerously-allow-all 2>&1 \
    | tee /dev/stderr) || true
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo "✅ Done!"
    exit 0
  fi
  sleep 2
done
echo "⚠️ Max iterations reached"
exit 1
```

##### prompt.md（每次迭代的说明）

```markdown
# Ralph Agent Instructions
## Your Task
1. Read `scripts/ralph/prd.json`
2. Read `scripts/ralph/progress.txt` (check Codebase Patterns first)
3. Check you're on the correct branch
4. Pick highest priority story where `passes: false`
5. Implement that ONE story
6. Run typecheck and tests
7. Update AGENTS.md files with learnings
8. Commit: `feat: [ID] - [Title]`
9. Update prd.json: `passes: true`
10. Append learnings to progress.txt
## Stop Condition
If ALL stories pass, reply:
<promise>COMPLETE</promise>
Otherwise end normally.
```

##### prd.json（任务状态）

```json
{
  "branchName": "ralph/feature",
  "userStories": [
    {
      "id": "US-001",
      "title": "Add login form",
      "acceptanceCriteria": ["Email/password fields", "Validates email format", "typecheck passes"],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

##### progress.txt（进度日志）

```
# Ralph Progress Log
Started: 2024-01-15
## Codebase Patterns
- Migrations: IF NOT EXISTS
- Types: Export from actions.ts
## Key Files
- db/schema.ts
- app/auth/actions.ts
---
## 2024-01-15 - US-001
- What was implemented: Added login form with email/password fields
- Files changed: app/auth/login.tsx, app/auth/actions.ts
- Learnings:
  - Patterns discovered: Use IF NOT EXISTS for migrations
  - Gotchas encountered: Need to handle email validation on both client and server
```

#### 上下文工程的对比分析

常规智能体通常采用总结（Summarization）或截断（Truncation）来管理上下文。即使最好的掩码策略也无法处理跨越数十轮、数千行代码改动的任务。

Ralph 循环绕过了这一难题——它不试图"总结"过去，而是通过提示词引导 Agent 进行"自我重新加载"。每一轮迭代的提示词始终包含对核心目标的清晰描述，而具体的执行细节留给 Agent 去实时探索环境。这种"即时上下文"加载方式，使得 Ralph 能够处理规模远超其单次窗口容量的工程项目。

## 框架和工具实现

### Claude Code 插件

```bash
# 安装插件
/plugin install ralph-wiggum@claude-plugins-official
# 运行循环
/ralph-loop "为当前项目添加单元测试，Completion criteria: Tests passing (coverage > 80%), Output <promise>COMPLETE</promise>" \
  --completion-promise "COMPLETE" \
  --max-iterations 50
```

### LangChain / DeepAgents

```bash
uv run deepagents --ralph "Build a Python programming course" --ralph-iterations 5
```

### AI SDK (JavaScript)

社区实现了 `ralph-loop-agent`，允许更精细的开发控制：

```typescript
import { RalphLoopAgent, iterationCountIs } from 'ralph-loop-agent';

const migrationAgent = new RalphLoopAgent({
  model: 'anthropic/claude-opus-4.5',
  instructions: `You are migrating a codebase from Jest to Vitest.
    Completion criteria:
    - All test files use vitest imports
    - vitest.config.ts exists
    - All tests pass when running 'pnpm test'`,
  tools: { readFile, writeFile, execute },
  stopWhen: iterationCountIs(50),
  verifyCompletion: async () => {
    const checks = await Promise.all([
      fileExists('vitest.config.ts'),
      !await fileExists('jest.config.js'),
      noFilesMatch('**/*.test.ts', /from ['"]@jest/),
      fileContains('package.json', '"vitest"'),
    ]);
    return {
      complete: checks.every(Boolean),
      reason: checks.every(Boolean) ? 'Migration complete' : 'Structural checks failed'
    };
  },
  onIterationStart: ({ iteration }) => console.log(`Starting iteration ${iteration}`),
  onIterationEnd: ({ iteration, duration }) => console.log(`Iteration ${iteration} completed in ${duration}ms`),
});
```

关键特性：
1. 模型与任务说明（包含明确的完成条件）
2. `stopWhen` 和 `verifyCompletion` 定制循环退出逻辑
3. 事件钩子用于日志和监控

## Ralph Loop 最佳实践

### 技巧 1：理解 Ralph 是一个循环

AI 编程经历了几个阶段：

- **Vibe 编程**：让 AI 写代码而不真正检查，速度快但质量差
- **规划模式**：要求 AI 在编码前先规划，提高质量但仍受限于单个上下文窗口
- **多阶段计划**：将大型功能分解为多个阶段，每个阶段在单独的上下文窗口中处理，但需要持续人工参与
- **Ralph**：简化了这一切——在循环中运行相同的提示，而非为每个阶段编写新提示

关键改进：**代理选择任务，而不是你**。

### 技巧 2：从 HITL 开始，然后转向 AFK

- **HITL（Human-in-the-Loop）**：你观察它做的一切，在需要时介入——适合学习 Ralph 工作方式
- **AFK（Away From Keyboard）**：设置完成后离开，完成后回来审查——适合提示稳定后的规模化使用

### 技巧 3：定义范围

任务越模糊，风险越大。Ralph 可能永远循环，找到无尽的改进；或者走捷径，在你认为工作完成之前就宣布胜利。

**必须定义明确可机器验证的完成条件。**

推荐格式：结构化 `prd.json`

```json
{
  "branchName": "ralph/feature",
  "userStories": [
    {
      "id": "US-001",
      "title": "新聊天按钮创建新对话",
      "acceptanceCriteria": [
        "点击'新聊天'按钮",
        "验证创建了新对话",
        "检查聊天区域显示欢迎状态"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

### 技巧 4：跟踪进度

通过维护 `progress.txt` 和 `prd.json`：
1. 读取 `progress.txt` 了解已完成的工作和学到的代码库模式
2. 读取 `prd.json` 了解待办任务和优先级
3. 追加本次迭代的进度和学到的模式
4. 更新 `prd.json` 中已完成任务的 `passes` 状态

### 技巧 5：使用反馈循环

在你的 Ralph 提示中，明确要求运行这些反馈循环：

```
在每次迭代中：
1. 实现功能
2. 运行类型检查：`tsc --noEmit`
3. 运行测试：`npm test`
4. 运行 Linter：`npm run lint`
5. 只有在所有检查通过后才提交
```

### 技巧 6：小步迭代

每次迭代应该：
- 完成一个功能
- 运行反馈循环
- 提交代码

避免让 Ralph 一次处理多个功能——这会导致混乱的提交、难以追踪进度、更高的失败风险。

### 技巧 7：优先处理高风险任务

优先级顺序：
1. 架构决策和核心抽象（错了会影响整个项目）
2. 模块之间的集成点（失败风险最高）
3. 未知的未知和探索性工作（需要快速失败）
4. 标准功能和实现（风险较低）
5. 抛光、清理和快速胜利（最低风险）

将 AFK Ralph 保留到基础稳固时。

### 技巧 8：明确定义软件质量

不同仓库有不同的质量标准（原型代码 vs 生产代码）。你需要明确告诉 Agent。

**代码库模式比指令更有影响力**——当两者冲突时，代码库的影响力更大。

解决方案：
1. 在 Ralph 运行前清理代码库：移除低质量模式
2. 使用反馈循环强制执行标准：Linting、类型检查、测试
3. 在 AGENTS.md 中明确质量标准

### 技巧 9：使用 Docker 沙箱

AFK Ralph 需要编辑文件、运行命令和提交代码的权限。Docker 沙箱是最简单的解决方案：

```bash
docker sandbox run claude
```

在容器内运行 Claude Code，你的当前目录被挂载，但无法触及主目录、SSH 密钥或系统文件。

### 技巧 10：控制成本

典型成本范围（以 Claude 3.5 Sonnet 为例）：

| 任务规模 | 迭代次数 | 成本估算 |
|----------|----------|----------|
| 小任务 | 5-10 次 | $5-15 |
| 中等任务 | 20-30 次 | $15-50 |
| 大型任务 | 30-50 次 | $50-150 |

成本控制策略：
1. 从 HITL 开始学习和优化提示
2. 设置严格限制：`--max-iterations`
3. 选择成本效益最优的任务：机械化重构、测试迁移
4. 投资回报视角：如果 Ralph 能在几小时内完成原本需要几天的工作，即使花费 $50-150 也值得

### 技巧 11：让它成为你自己的

Ralph 只是一个循环，无限可配置：

- **交换任务源**：不一定要用本地 `prd.json`，可以从 GitHub Issues、Linear 等地方拉取
- **更改输出**：每次迭代可以创建分支并打开 PR，而非直接提交到 main
- **替代循环类型**：
  - 测试覆盖率循环：将 Ralph 指向覆盖率指标
  - 重复代码循环：连接 jscpd 查找重复代码
  - Linting 循环：一个一个修复 Linting 错误
  - 熵循环：扫描代码异味并清理

## 实践建议

### 明确完成标准

**明确可机器验证的完成条件**是 Ralph Loop 成功的关键。

完成条件示例：
- 所有测试通过
- 构建无错误
- Lint 结果清洁
- 明确输出标记（如 `COMPLETE`）
- 测试覆盖率 > 80%
- 所有类型检查通过

避免模糊标准：例如"让它好看一点"会导致循环无法正确退出或产生无意义输出。

### 安全机制和资源控制

```bash
# 始终设置最大迭代次数
/ralph-loop "Task description" --max-iterations 30 --completion-promise "DONE"
```

建议的迭代次数：
- 小任务：5-10 次
- 中等任务：20-30 次
- 大型任务：30-50 次

### 场景适用性

**✅ 适合场景：**
- TDD 开发：写测试 → 跑失败 → 改代码 → 重复直到全绿
- Greenfield 项目：定义好需求，过夜执行
- 有自动验证的任务：测试、Lint、类型检查能告诉它对不对
- 代码重构：机械化重构、大规模测试迁移
- 测试迁移：从 Jest 到 Vitest 等框架迁移

**❌ 不适合场景：**
- 需要主观判断或人类设计抉择
- 没有明确成功标准的任务
- 整体策略规划和长期决策（常规 Agent Loop 更适合）
- 成本敏感场景

## 结论

Ralph Loop 是一种**以持续迭代修正为中心的 agent 运行范式**，通过 Stop Hook 和明确完成条件使代理不再轻易退出。它与一般意义上的 agent loop 并不冲突，而是在**特定类型任务（可验证目标条件）下的一种强化迭代模式**。适当理解二者的适用边界，能帮助开发者在构建自动化代理流水线时更合理选择架构和控制策略。

## 参考资料

- [https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum)
- [https://github.com/muratcankoylan/ralph-wiggum-marketer/](https://github.com/muratcankoylan/ralph-wiggum-marketer/)
- [https://github.com/frankbria/ralph-claude-code](https://github.com/frankbria/ralph-claude-code)
- [https://github.com/anthropics/claude-code/blob/main/plugins/ralph-wiggum/README.md](https://github.com/anthropics/claude-code/blob/main/plugins/ralph-wiggum/README.md)
