Title: Agent 工具 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html

Markdown Content:
AgentTool 是 Claude Code 中 **最复杂的工具**，拥有 14 个辅助模块，能够启动独立的 AI 子代理执行复杂任务。

## 目录结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

```
src/tools/AgentTool/
├── AgentTool.tsx              # 主工具定义、call() 方法
├── prompt.ts                 # Agent 描述与提示词
├── UI.tsx                    # Agent 执行状态渲染
├── agentToolUtils.ts         # 工具过滤/解析/结果处理
├── runAgent.ts               # 代理执行核心（异步生成器）
├── constants.ts              # 常量（AGENT_TOOL_NAME 等）
├── forkSubagent.ts           # Fork 子代理逻辑
├── loadAgentsDir.ts          # AgentDefinition 类型、代理定义加载
├── agentColorManager.ts      # 代理颜色管理
├── agentDisplay.ts           # 代理显示
├── agentMemory.ts            # 代理记忆管理
├── agentMemorySnapshot.ts    # 记忆快照
├── builtInAgents.ts          # 内置代理注册
├── resumeAgent.ts            # 恢复代理
├── built-in/                 # 内置代理定义
│   ├── generalPurposeAgent.ts
│   ├── exploreAgent.ts
│   ├── planAgent.ts
│   ├── verificationAgent.ts
│   ├── claudeCodeGuideAgent.ts
│   └── statuslineSetup.ts
└── __tests__/
```

## 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html#%E8%BE%93%E5%85%A5-schema)

typescript

```
const baseInputSchema = z.object({
  description: z.string().describe('任务的 3-5 词描述'),
  prompt: z.string().describe('给子 Agent 的任务指令'),
  subagent_type: z.string().optional()
    .describe('专门代理类型'),
  model: z.enum(['sonnet', 'opus', 'haiku']).optional()
    .describe('模型覆盖'),
  run_in_background: z.boolean().optional()
    .describe('后台运行'),
})

// fullInputSchema 额外包含:
// name: z.string().optional() — 代理名称（用于 SendMessage 路由）
// team_name: z.string().optional() — 团队名称
// mode: permissionModeSchema().optional() — 权限模式
// isolation: z.enum(['worktree']).optional() 或 z.enum(['worktree', 'remote']).optional()
// cwd: z.string().optional() — 工作目录覆盖（仅 KAIROS 特性启用时）
```

## 执行流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html#%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B)

> **注意**: `call()` 方法是普通 `async` 函数，返回 `Promise<ToolResult>`，不是 AsyncGenerator。

typescript

```
async call({ prompt, subagent_type, description, model, run_in_background, name, team_name, mode, isolation, cwd },
           toolUseContext, canUseTool, assistantMessage, onProgress?) {

  // ======= 1. 团队/Swarm 路径 =======
  // 若有 team_name + name 且 isAgentSwarmsEnabled()，调用 spawnTeammate() 返回

  // ======= 2. 解析代理类型 =======
  // fork 路径（isForkSubagentEnabled() + 无 subagent_type）
  // 或查找 AgentDefinition（loadAgentsDir）

  // ======= 3. 检查 MCP 服务器可用性 =======
  // 验证 requiredMcpServers 已就绪

  // ======= 4. 解析模型 =======
  const agentModel = getAgentModel()

  // ======= 5. 隔离处理 =======
  // isolation: 'remote' → teleportToRemote()
  // isolation: 'worktree' → createAgentWorktree()

  // ======= 6. 构建系统提示和工具池 =======
  const tools = filterToolsForAgent(context.tools)  // agentToolUtils.ts
  const toolPool = assembleToolPool(tools)

  // ======= 7. 执行路径 =======

  // 异步路径（run_in_background = true）:
  // registerAsyncAgent() → void runAsyncAgentLifecycle(runAgent(...))
  // 立即返回 { status: 'async_launched', agentId, outputFile }

  // 同步路径:
  // registerAgentForeground() → runAgent() 获取异步迭代器
  // while(true) 循环 Promise.race(nextMessage, backgroundSignal)
  // 转发进度 → finalizeAgentTool() 返回结果

  // ======= 8. 生成摘要 =======
  // 使用 startAgentSummarization（from services/AgentSummary/agentSummary.js）
}
```

## 工具限制 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html#%E5%B7%A5%E5%85%B7%E9%99%90%E5%88%B6)

typescript

```
// agentToolUtils.ts
function filterToolsForAgent(
  parentTools: Tool[],
  agentDefinition?: AgentDefinition
): Tool[] {
  // 根据 agentDefinition 的配置过滤工具
  // 默认排除递归危险工具
}

function resolveAgentTools(
  tools: Tool[],
  agentDef: AgentDefinition
): Tool[] {
  // 解析代理定义中指定的工具列表
}
```

## 深度控制与成本预算 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html#%E6%B7%B1%E5%BA%A6%E6%8E%A7%E5%88%B6%E4%B8%8E%E6%88%90%E6%9C%AC%E9%A2%84%E7%AE%97)

typescript

```
// constants.ts
const AGENT_TOOL_NAME = 'Agent'
const LEGACY_AGENT_TOOL_NAME = 'Task'
const VERIFICATION_AGENT_TYPE = 'verification'
const ONE_SHOT_BUILTIN_AGENT_TYPES = [...]

// 深度和成本预算在 runAgent.ts 执行循环中内部管理
// 无独立的 getAgentDepth / computeChildBudget 函数
```

## Agent 类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html#agent-%E7%B1%BB%E5%9E%8B)

AgentTool 支持创建不同类型的子代理：

| 类型 | 用途 | 创建方式 |
| --- | --- | --- |
| **LocalAgent** | 本地子进程 Agent | 默认 |
| **RemoteAgent** | 远程执行 Agent | 远程模式 |
| **InProcessTeammate** | 同进程队友 | 协调器模式 |

## 权限 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html#%E6%9D%83%E9%99%90)

*   `isReadOnly()` = `false`（子 Agent 可能执行写操作）
*   `isDestructive()` = 取决于子 Agent 的工具集
*   `isConcurrencySafe()` = `false`
*   子 Agent 继承父级权限模式