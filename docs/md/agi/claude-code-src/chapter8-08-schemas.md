Title: Schema 定义 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html

Markdown Content:
`src/schemas/` 包含核心的 Zod 验证模式，确保配置文件的类型安全。

## Hooks Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#hooks-schema)

typescript

```
// schemas/hooks.ts
// 4 种 Hook 类型（Zod 判别联合）

// 1. Bash 命令 Hook
const BashCommandHookSchema = z.object({
  type: z.literal('command'),
  command: z.string(),            // Shell 命令
  if: IfConditionSchema.optional(),  // 匹配条件
  shell: z.string().optional(),   // 指定 Shell
  timeout: z.number().optional(), // 超时（ms）
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),   // 仅执行一次
  async: z.boolean().optional(),  // 异步执行
  asyncRewake: z.boolean().optional(), // 异步完成后唤醒
})

// 2. Prompt Hook（模型调用）
const PromptHookSchema = z.object({
  type: z.literal('prompt'),
  prompt: z.string(),             // 含 $ARGUMENTS 占位符
  if: IfConditionSchema.optional(),
  timeout: z.number().optional(),
  model: z.string().optional(),   // 使用的模型
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
})

// 3. HTTP Hook
const HttpHookSchema = z.object({
  type: z.literal('http'),
  url: z.string().url(),          // 目标 URL
  if: IfConditionSchema.optional(),
  timeout: z.number().optional(),
  headers: z.record(z.string()).optional(),  // 含环境变量插值
  allowedEnvVars: z.array(z.string()).optional(),
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
})

// 4. Agent Hook（子 Agent 调用）
const AgentHookSchema = z.object({
  type: z.literal('agent'),
  prompt: z.string(),
  if: IfConditionSchema.optional(),
  timeout: z.number().optional(),
  model: z.string().optional(),
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
})

// Hook 匹配器
const HookMatcherSchema = z.object({
  matcher: z.string(),            // 规则匹配语法
  hooks: z.array(HookUnionSchema),
})

// Hooks 设置（按事件分组）
const HooksSchema = z.record(
  z.nativeEnum(HookEvent),
  z.array(HookMatcherSchema)
).partial()
```

### Hook 事件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#hook-%E4%BA%8B%E4%BB%B6)

typescript

```
// 注意：实际不是 enum，而是 const array + z.enum
const HOOK_EVENTS = [
  'PreToolUse',         // 工具执行前
  'PostToolUse',        // 工具执行后
  'PostToolUseFailure', // 工具执行失败后
  'Notification',       // 通知事件
  'UserPromptSubmit',   // 用户提交提示
  'SessionStart',       // 会话开始
  'SessionEnd',         // 会话结束
  'Stop',               // Agent 停止
  'StopFailure',        // Agent 停止失败
  'SubagentStart',      // 子 Agent 开始
  'SubagentStop',       // 子 Agent 停止
  'PreCompact',         // 压缩前
  'PostCompact',        // 压缩后
  'PermissionRequest',  // 权限请求
  'PermissionDenied',   // 权限拒绝
  'Setup',              // 设置
  'TeammateIdle',       // 队友空闲
  'TaskCreated',        // 任务创建
  'TaskCompleted',      // 任务完成
  'Elicitation',        // 引发
  'ElicitationResult',  // 引发结果
  'ConfigChange',       // 配置变更
  'WorktreeCreate',     // Worktree 创建
  'WorktreeRemove',     // Worktree 移除
  'InstructionsLoaded', // 指令加载
  'CwdChanged',         // 工作目录变更
  'FileChanged',        // 文件变更
] as const

// Hooks 逻辑使用 z.enum(HOOK_EVENTS)
// HooksSchema 实际用 z.partialRecord 而非 z.record().partial()
const HooksSchema = z.partialRecord(
  z.enum(HOOK_EVENTS),
  z.array(HookMatcherSchema())
)
```

### If 条件 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#if-%E6%9D%A1%E4%BB%B6-schema)

typescript

```
const IfConditionSchema = z.string()
// 权限规则语法，用于过滤 Hook 触发
// 例如: "tool:BashTool AND command:npm*"
```

## Settings Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#settings-schema)

typescript

```
// settings/types.ts — Zod Schema
const SettingsSchema = z.object({
  // 权限
  permissions: PermissionsSchema.optional(),

  // Hooks
  hooks: HooksSchema.optional(),

  // MCP 服务器
  mcpServers: z.record(MCPServerConfigSchema).optional(),
  allowedMcpServers: z.array(z.string()).optional(),
  deniedMcpServers: z.array(z.string()).optional(),

  // 模型
  model: z.string().optional(),
  smallModel: z.string().optional(),

  // 环境变量
  env: z.record(z.string()).optional(),

  // 特性开关
  features: z.record(z.boolean()).optional(),

  // 更多...
}).passthrough()  // 保留未知字段

// 权限 Schema
const PermissionsSchema = z.object({
  allow: z.array(PermissionRuleSchema).optional(),
  deny: z.array(PermissionRuleSchema).optional(),
  ask: z.array(PermissionRuleSchema).optional(),
  defaultMode: z.enum(PERMISSION_MODES).optional(),
  additionalDirectories: z.array(z.string()).optional(),
})
```

## Schema 设计原则 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#schema-%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99)

### 1. 向后兼容 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#_1-%E5%90%91%E5%90%8E%E5%85%BC%E5%AE%B9)

typescript

```
// .passthrough() 保留未知字段
// 新增字段必须是 optional
// 不允许删除或重命名字段
const schema = z.object({
  existingField: z.string(),
  newField: z.string().optional(),  // 新增时必须 optional
}).passthrough()
```

### 2. 特性门控扩展 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#_2-%E7%89%B9%E6%80%A7%E9%97%A8%E6%8E%A7%E6%89%A9%E5%B1%95)

typescript

```
// 条件性 Schema 合并
const expandedSchema = feature('VOICE_MODE')
  ? schema.extend({
      voiceSettings: VoiceSettingsSchema.optional(),
    })
  : schema
```

### 3. 安全验证 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#_3-%E5%AE%89%E5%85%A8%E9%AA%8C%E8%AF%81)

typescript

```
// 环境变量插值限制（HTTP Hooks）
allowedEnvVars: z.array(z.string())
// 仅允许白名单中的环境变量用于 header 插值

// URL 验证
url: z.string().url()
// 必须是合法 URL
```

## 推导类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html#%E6%8E%A8%E5%AF%BC%E7%B1%BB%E5%9E%8B)

typescript

```
// Schema 推导出 TypeScript 类型
type HookCommand = z.infer<typeof BashCommandHookSchema>
type BashCommandHook = z.infer<typeof BashCommandHookSchema>
type PromptHook = z.infer<typeof PromptHookSchema>
type AgentHook = z.infer<typeof AgentHookSchema>
type HttpHook = z.infer<typeof HttpHookSchema>
type HookMatcher = z.infer<typeof HookMatcherSchema>
type HooksSettings = z.infer<typeof HooksSchema>
```
