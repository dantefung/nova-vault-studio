Title: Task 工具 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html

Markdown Content:
Task 工具家族（6 个工具）管理后台异步任务的完整生命周期。

> **注意**: 以下所有工具的 `call()` 方法均为普通 `async` 函数，返回 `Promise<ToolResult>`，不是 AsyncGenerator。

## 任务类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html#%E4%BB%BB%E5%8A%A1%E7%B1%BB%E5%9E%8B)

typescript

```
type TaskType =
  | 'local_bash'            // 本地 Shell 命令
  | 'local_agent'           // 本地子 Agent
  | 'remote_agent'          // 远程 Agent
  | 'in_process_teammate'   // 同进程队友
  | 'local_workflow'        // 本地工作流
  | 'monitor_mcp'           // MCP 监控
  | 'dream'                 // 离线知识整合
```

## TaskCreateTool [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html#taskcreatetool)

typescript

```
const inputSchema = z.object({
  description: z.string().describe('任务描述'),
  prompt: z.string().describe('任务指令'),
  type: z.enum(['shell', 'agent']).optional().describe('任务类型'),
})
```

执行时调用 `registerTask()` 创建任务，根据 `type` 参数映射为 `local_bash` 或 `local_agent` 类型，返回任务 ID。

## TaskGetTool / TaskListTool [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html#taskgettool-tasklisttool)

typescript

```
// TaskGetTool — 获取单个任务
const getInputSchema = z.object({
  task_id: z.string().describe('任务 ID'),
})

// TaskListTool — 列出所有任务
// 无输入参数，返回所有任务状态
```

## TaskUpdateTool / TaskStopTool [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html#taskupdatetool-taskstoptool)

typescript

```
// TaskUpdateTool — 更新任务描述或状态
const updateInputSchema = z.object({
  task_id: z.string(),
  description: z.string().optional(),
  status: z.enum(['paused', 'running']).optional(),
})

// TaskStopTool — 停止任务
const stopInputSchema = z.object({
  task_id: z.string(),
  reason: z.string().optional(),
})
```

## TaskOutputTool [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html#taskoutputtool)

typescript

```
const outputInputSchema = z.object({
  task_id: z.string(),
  lines: z.number().optional().describe('返回最后 N 行，默认 50'),
})
```

执行时根据任务 ID 获取任务实例，读取其输出文件的最后 N 行并返回。

## 任务状态机 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html#%E4%BB%BB%E5%8A%A1%E7%8A%B6%E6%80%81%E6%9C%BA)

```
创建 (pending) → 运行中 (running) → 完成 (completed)
                                   → 失败 (failed)
                                   → 已终止 (killed)
```

## TaskStateBase [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html#taskstatebase)

typescript

```
type TaskStateBase = {
  id: string
  type: TaskType
  status: TaskStatus  // 'pending' | 'running' | 'completed' | 'failed' | 'killed'
  description: string
  startTime: number
  endTime?: number
  totalPausedMs?: number
  outputFile: string
  outputOffset: number
  notified: boolean     // 是否已通知用户完成
  toolUseId?: string    // 创建此任务的 tool_use ID（可选）
}
```
