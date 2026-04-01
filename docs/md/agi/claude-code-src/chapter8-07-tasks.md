Title: 任务系统 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html

Markdown Content:
## 任务系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html#%E4%BB%BB%E5%8A%A1%E7%B3%BB%E7%BB%9F)

`src/tasks/` 管理后台任务的创建、调度和持久化。

## 任务类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html#%E4%BB%BB%E5%8A%A1%E7%B1%BB%E5%9E%8B)

typescript

```
// 7 种任务类型
type TaskType =
  | 'local_bash'           // 本地 Bash 任务
  | 'local_agent'          // 本地 Agent 任务
  | 'remote_agent'         // 远程 Agent 任务
  | 'in_process_teammate'  // 进程内队友
  | 'local_workflow'       // 本地工作流
  | 'monitor_mcp'          // 监控 MCP
  | 'dream'                // 后台思考
```

## 任务状态机 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html#%E4%BB%BB%E5%8A%A1%E7%8A%B6%E6%80%81%E6%9C%BA)

```
┌───────────┐
│  pending   │ ──创建──→ ┌──────────┐
└───────────┘           │ running   │
                        └────┬─────┘
                   ┌─────────┼─────────┐
                   ▼         ▼         ▼
            ┌──────────┐ ┌────────┐ ┌─────────┐
            │completed │ │ failed │ │  killed │
            └──────────┘ └────────┘ └─────────┘
```

## 任务基类 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html#%E4%BB%BB%E5%8A%A1%E5%9F%BA%E7%B1%BB)

typescript

```
interface TaskStateBase {
  id: string
  type: TaskType
  status: 'pending' | 'running' | 'completed' | 'failed' | 'killed'
  description: string
  toolUseId?: string
  startTime: number
  endTime?: number
  totalPausedMs?: number
  outputFile: string
  outputOffset: number
  notified: boolean
}
```

## 定时调度 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html#%E5%AE%9A%E6%97%B6%E8%B0%83%E5%BA%A6)

`useScheduledTasks.ts` 是一个 React Hook，在 `useEffect` 中管理定时任务的生命周期。

主要调度的任务：

*   **记忆提取**：定期检查并提取会话记忆（需启用自动记忆功能）
*   **自动压缩**：定期检查对话历史并在需要时执行压缩

组件卸载时自动清理所有定时器。

## 持久化 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html#%E6%8C%81%E4%B9%85%E5%8C%96)

任务状态持久化到 `~/.claude/tasks/`：

```
~/.claude/tasks/
├── compact-{timestamp}.json
├── extract_memories-{timestamp}.json
└── ...
```

## 与工具系统的交互 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html#%E4%B8%8E%E5%B7%A5%E5%85%B7%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%BA%A4%E4%BA%92)

任务系统通过 5 个任务工具暴露给 AI：

| 工具 | 功能 |
| --- | --- |
| `TaskCreate` | 创建新任务 |
| `TaskGet` | 读取任务状态 |
| `TaskUpdate` | 更新任务状态 |
| `TaskStop` | 停止任务 |
| `TaskList` | 列出所有任务 |

详见 [任务工具文档](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html)。
