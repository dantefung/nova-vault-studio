Title: 核心 TypeScript 类型 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html

Markdown Content:
## 应用状态 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#%E5%BA%94%E7%94%A8%E7%8A%B6%E6%80%81)

定义在 `src/state/AppStateStore.ts` 中，使用 `DeepImmutable<{...}>` 包装。

AppState 包含几十个字段，主要分类：

*   **设置**: `settings`, `verbose`
*   **模型**: `mainLoopModel`, `mainLoopModelForSession`
*   **UI**: `statusLineText`, `thinkingEnabled`
*   **工具与权限**: `toolPermissionContext`, `agent`, `kairosEnabled`
*   **MCP**: `mcp: { clients, tools, commands, resources }`
*   **插件**: `plugins: LoadedPlugin[]`

详见 [状态管理](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html) 文档。

typescript

```
// src/state/store.ts — 真实代码
export type Store<T> = {
  getState: () => T
  setState: (updater: (prev: T) => T) => void
  subscribe: (listener: () => void) => () => void
}

type DeepImmutable<T> = T extends object
  ? { readonly [K in keyof T]: DeepImmutable<T[K]> }
  : T

type ImmutableAppState = DeepImmutable<AppState>
```

## 消息类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#%E6%B6%88%E6%81%AF%E7%B1%BB%E5%9E%8B)

消息使用 Anthropic SDK 类型，项目中没有自定义的 `UserMessage`、`AssistantMessage`、`SystemMessage` 接口。消息内容通过 SDK 的 `ContentBlock` 联合类型表示（包括 `TextBlock`、`ToolUseBlock`、`ToolResultBlock`、`ImageBlock`、`ThinkingBlock` 等）。

## 工具类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#%E5%B7%A5%E5%85%B7%E7%B1%BB%E5%9E%8B)

typescript

```
interface Tool {
  // 身份
  name: string
  description: string
  inputSchema: ZodSchema       // 非 schema
  inputJSONSchema?: JSONSchema // 可选

  // 执行（实际是 call，非 execute）
  call(args: unknown, context: ToolUseContext, canUseTool: Function,
       parentMessage: Message, onProgress?: Function): Promise<ToolResult>

  // 权限（isReadOnly 存在，needsPermission 不在 Tool 接口上）
  isReadOnly(): boolean
  getPermissionDescription(input: unknown): string

  // 过滤
  isEnabled?(context: ToolUseContext): boolean

  // ~40 个成员总计
}

// 实际类型名: ToolUseContext（非 ToolContext）
interface ToolUseContext {
  // 字段与文档不同，包含:
  input: unknown
  toolUseId: string
  // ... 更多字段
}

interface ToolResult {
  content: string | ContentBlock[]
  isError?: boolean
  metadata?: Record<string, unknown>
}

// 注意: 源码中没有 ToolTag 类型
// 工具过滤通过命令白名单（REMOTE_SAFE_COMMANDS 等）实现
```

## 权限类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#%E6%9D%83%E9%99%90%E7%B1%BB%E5%9E%8B)

typescript

```
// src/types/permissions.ts — 真实代码
type ExternalPermissionMode =
  | 'acceptEdits'
  | 'bypassPermissions'
  | 'default'
  | 'dontAsk'
  | 'plan'

type InternalPermissionMode = ExternalPermissionMode | 'auto' | 'bubble'

// PermissionDecision 是泛型类型
type PermissionDecision<Input extends { [key: string]: unknown }> =
  | PermissionAllowDecision<Input>
  | PermissionAskDecision<Input>
  | PermissionDenyDecision

// PermissionRule 存在，但字段与此前文档不同
type PermissionRule = {
  source: PermissionRuleSource
  ruleBehavior: PermissionBehavior
  ruleValue: PermissionRuleValue
}

type PermissionRuleValue = {
  toolName: string
  ruleContent?: string
}
```

## 命令类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#%E5%91%BD%E4%BB%A4%E7%B1%BB%E5%9E%8B)

typescript

```
// Command 是联合类型，非单一 interface
type Command = CommandBase & (PromptCommand | LocalCommand | LocalJSXCommand)

interface CommandBase {
  name: string
  description: string
  aliases?: string[]
  isEnabled?: (context: CommandContext) => boolean
  argumentHint?: string       // 非 argDescription
  userInvocable?: boolean     // 非 userFacing
}

// PromptCommand: 有 getPromptForCommand
// LocalCommand: 有 call() 方法
// LocalJSXCommand: 有 callJSX() 方法
```

## Bridge 类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#bridge-%E7%B1%BB%E5%9E%8B)

typescript

```
// src/bridge/types.ts — 真实代码（部分字段）
type BridgeConfig = {
  dir: string
  machineName: string
  branch: string
  gitRepoUrl: string | null
  maxSessions: number
  spawnMode: SpawnMode
  verbose: boolean
  sandbox: boolean
  bridgeId: string
  workerType: string
  environmentId: string
  // ... 更多字段（20+）
}
```

`WorkResponse`、`ReplBridgeHandle`、`ReplBridgeTransport` 等类型定义在 `src/bridge/` 目录的各文件中，详见 [Bridge 文档](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/)。

## Store 类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#store-%E7%B1%BB%E5%9E%8B)

typescript

```
// src/state/store.ts — 真实代码
type Store<T> = {
  getState: () => T
  setState: (updater: (prev: T) => T) => void
  subscribe: (listener: () => void) => () => void
}
```

## QueryEngine 类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#queryengine-%E7%B1%BB%E5%9E%8B)

QueryEngine 相关的 `QueryOptions`、`StreamEvent`、`TokenUsage` 等类型不作为独立导出存在。查询通过 `QueryEngine.ts` 中的内部流程处理，详见 [查询引擎](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html) 文档。

## Hook 类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#hook-%E7%B1%BB%E5%9E%8B)

typescript

```
// 详见 Schema 文档
// 实际有 28 个值（非 6 个）
type HookEvent =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'PostToolUseFailure'
  | 'Notification'
  | 'UserPromptSubmit'
  | 'SessionStart'
  | 'SessionEnd'
  | 'Stop'
  | 'StopFailure'
  | 'SubagentStart'
  | 'SubagentStop'
  | 'PreCompact'
  | 'PostCompact'
  | 'PermissionRequest'
  | 'PermissionDenied'
  | 'Setup'
  | 'TeammateIdle'
  | 'TaskCreated'
  | 'TaskCompleted'
  | 'Elicitation'
  | 'ElicitationResult'
  | 'ConfigChange'
  | 'WorktreeCreate'
  | 'WorktreeRemove'
  | 'InstructionsLoaded'
  | 'CwdChanged'
  | 'FileChanged'
  // ... 可能更多

type HookType = 'command' | 'prompt' | 'http' | 'agent'
```

`HookType` 在源码中不存在为独立类型。Hook 配置在 schema 中定义，详见 [Schema 文档](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html)。

## AI Provider 类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/types.html#ai-provider-%E7%B1%BB%E5%9E%8B)

源码中没有 `AIProvider` 和 `ProviderConfig` 类型定义。Provider 通过环境变量（`ANTHROPIC_API_KEY`、`AWS_ACCESS_KEY_ID`、`GOOGLE_APPLICATION_CREDENTIALS`）和配置自动解析，支持的后端包括 Anthropic Direct API、AWS Bedrock 和 Google Vertex AI。
