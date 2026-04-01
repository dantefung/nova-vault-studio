Title: 其他工具 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html

Markdown Content:
## 其他工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#%E5%85%B6%E4%BB%96%E5%B7%A5%E5%85%B7)

本页涵盖未在其他章节详述的工具。

## AskUserQuestionTool — 向用户提问 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#askuserquestiontool-%E2%80%94-%E5%90%91%E7%94%A8%E6%88%B7%E6%8F%90%E9%97%AE)

当 AI 需要用户确认或额外信息时使用：

typescript

```
const inputSchema = z.strictObject({
  questions: z.array(z.object({
    question: z.string(),
    header: z.string(),  // 短标签（chip/tag）
    options: z.array(z.object({
      label: z.string(),
      description: z.string(),
      preview: z.string().optional(),
    })).min(2).max(4),
    multiSelect: z.boolean().default(false),
  })).min(1).max(4),
  answers: z.record(z.string(), z.string()).optional(),
  annotations: z.record(z.string(), z.object({
    preview: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
  metadata: z.object({
    source: z.string().optional(),
  }).optional(),
})

// 无权限要求，最安全的工具
// isReadOnly() = true, isDestructive() = false
```

## TodoWriteTool — 待办事项管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#todowritetool-%E2%80%94-%E5%BE%85%E5%8A%9E%E4%BA%8B%E9%A1%B9%E7%AE%A1%E7%90%86)

typescript

```
const TodoItemSchema = z.object({
  content: z.string().min(1),
  status: z.enum(['pending', 'in_progress', 'completed']),
  activeForm: z.string().min(1),
})

const inputSchema = z.strictObject({
  todos: z.array(TodoItemSchema).describe('更新后的待办列表'),
})

// 直接修改 AppState 中的 todos 列表
// StatusLine 显示待办进度
```

## NotebookEditTool — Jupyter Notebook 编辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#notebookedittool-%E2%80%94-jupyter-notebook-%E7%BC%96%E8%BE%91)

typescript

```
const inputSchema = z.strictObject({
  notebook_path: z.string(),
  cell_id: z.string().optional(),  // 要编辑的 cell ID
  new_source: z.string(),          // 新的 cell 内容
  cell_type: z.enum(['code', 'markdown']).optional(),
  edit_mode: z.enum(['replace', 'insert', 'delete']).optional(),
})

// Feature-gated: feature('NOTEBOOK') 等相关 flag
// 直接操作 .ipynb JSON 结构
```

## SleepTool — 延迟执行 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#sleeptool-%E2%80%94-%E5%BB%B6%E8%BF%9F%E6%89%A7%E8%A1%8C)

typescript

```
const inputSchema = z.object({
  duration_ms: z.number().describe('延迟毫秒数'),
  reason: z.string().optional(),
})

// Feature-gated: feature('PROACTIVE') || feature('KAIROS')
// 用于等待外部进程完成
```

## LSPTool — 语言服务器操作 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#lsptool-%E2%80%94-%E8%AF%AD%E8%A8%80%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%93%8D%E4%BD%9C)

typescript

```
const inputSchema = z.strictObject({
  operation: z.enum([
    'goToDefinition',       // 跳转到定义
    'findReferences',       // 查找引用
    'hover',                // 悬停信息
    'documentSymbol',       // 文档符号
    'workspaceSymbol',      // 工作区符号
    'goToImplementation',   // 跳转到实现
    'prepareCallHierarchy', // 调用层次
    'incomingCalls',        // 传入调用
    'outgoingCalls',        // 传出调用
  ]),
  filePath: z.string(),
  line: z.number().int().positive(),      // 1-based
  character: z.number().int().positive(),  // 1-based
})
```

## SyntheticOutputTool — 合成输出 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#syntheticoutputtool-%E2%80%94-%E5%90%88%E6%88%90%E8%BE%93%E5%87%BA)

用于内部 UI 渲染，不直接暴露给 AI：

typescript

```
// 生成不经过 AI 的工具结果
// 用于 Hook 摘要、系统消息等
```

## BriefTool — 简要模式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#brieftool-%E2%80%94-%E7%AE%80%E8%A6%81%E6%A8%A1%E5%BC%8F)

KAIROS feature-gated 的简要模式工具。

## ConfigTool — 配置操作 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#configtool-%E2%80%94-%E9%85%8D%E7%BD%AE%E6%93%8D%E4%BD%9C)

typescript

```
const inputSchema = z.strictObject({
  setting: z.string().describe('配置项 key，如 "theme", "model"'),
  value: z.union([z.string(), z.boolean(), z.number()]).optional()
    .describe('新值。省略则获取当前值'),
})
```

## RemoteTriggerTool — 远程触发 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#remotetriggertool-%E2%80%94-%E8%BF%9C%E7%A8%8B%E8%A7%A6%E5%8F%91)

在 Bridge 模式下触发远程操作：

typescript

```
const inputSchema = z.strictObject({
  action: z.enum(['list', 'get', 'create', 'update', 'run']),
  trigger_id: z.string().regex(/^[\w-]+$/).optional()
    .describe('get/update/run 时必填'),
  body: z.record(z.string(), z.unknown()).optional()
    .describe('create/update 时的 JSON body'),
})
```

## Worktree 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#worktree-%E5%B7%A5%E5%85%B7)

| 工具 | 用途 |
| --- | --- |
| **EnterWorktreeTool** | 创建或切换到 Git worktree，隔离文件系统 |
| **ExitWorktreeTool** | 退出 worktree，合并或放弃更改 |
| **EnterPlanModeTool** | 进入计划模式（只规划不执行） |
| **ExitPlanModeTool** | 退出计划模式 |

## Team 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html#team-%E5%B7%A5%E5%85%B7)

| 工具 | 用途 |
| --- | --- |
| **TeamCreateTool** | 创建新团队 |
| **TeamDeleteTool** | 删除团队 |
| **SendMessageTool** | 发送消息给队友 Agent |
| **ScheduleCronTool** | 创建定时任务 |
