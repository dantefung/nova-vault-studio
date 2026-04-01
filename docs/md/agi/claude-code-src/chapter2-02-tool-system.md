Title: 工具系统 (Tool.ts + tools.ts) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html

Markdown Content:
工具系统是 Claude Code 的核心交互能力，定义了 AI 如何与外部世界交互。系统由两个关键文件构成：`Tool.ts`（接口定义，~792 行）和 `tools.ts`（注册与过滤，~388 行）。

## Tool.ts — 工具接口定义 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#tool-ts-%E2%80%94-%E5%B7%A5%E5%85%B7%E6%8E%A5%E5%8F%A3%E5%AE%9A%E4%B9%89)

### Tool 接口全貌 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#tool-%E6%8E%A5%E5%8F%A3%E5%85%A8%E8%B2%8C)

`Tool` 是一个泛型接口，拥有 **~55 个成员**，定义了工具的完整生命周期：

typescript

```
interface Tool<Input = unknown, Output = unknown> {
  // === 标识 ===
  readonly name: string           // 工具名称（如 "Read"、"Bash"）(L369)
  aliases?: string[]              // 名称别名 (L285)
  searchHint?: string             // 搜索提示 (L291)

  // === 描述 ===
  description(input: Input, options?: ToolDescriptionOptions): Promise<string>  // 动态描述 (L305)
  prompt(options?: ToolPromptOptions): Promise<string>  // 额外提示词 (L572)

  // === Schema ===
  readonly inputSchema: Input     // 输入 Schema (L315)
  readonly inputJSONSchema?: ToolInputJSONSchema  // JSON Schema (L318)
  outputSchema?: z.ZodType<unknown>  // 可选输出验证 (L322)
  inputsEquivalent?(a: Input, b: Input): boolean  // 输入等价检查 (L323)

  // === 执行 ===
  call(args: Input, context: ToolUseContext, canUseTool: CanUseToolFn, parentMessage: Message, onProgress?: ProgressCallback): Promise<ToolResult<Output>>  // 核心执行 (L297)
  validateInput?(input: Input, context: ToolPermissionContext): Promise<ValidationResult>  // 输入预验证 (L394)

  // === 权限 ===
  checkPermissions(input: Input, context: ToolPermissionContext): Promise<PermissionResult>  // 权限检查 (L401)
  getPath?(input: Input): string                  // 获取路径 (L408)
  preparePermissionMatcher?(input: Input): Promise<(pattern: string) => boolean>  // 权限匹配器 (L415)

  // === 安全属性 ===
  isReadOnly(input: Input): boolean               // 只读操作？(L327)
  isDestructive?(input?: Input): boolean           // 破坏性操作？(L329)
  isConcurrencySafe(input: Input): boolean         // 并发安全？(L325)
  isEnabled(): boolean                             // 动态启用/禁用 (L326)
  interruptBehavior?(): 'cancel' | 'block'         // 中断行为 (L335)
  isSearchOrReadCommand?(input: Input): { isSearch: boolean; isRead: boolean; isList?: boolean }  // (L341)
  isOpenWorld?(input: Input): boolean              // 开放世界 (L349)
  requiresUserInteraction?(): boolean              // 需要用户交互 (L350)
  isMcp?: boolean                                  // 是否MCP工具 (L351)
  isLsp?: boolean                                  // 是否LSP工具 (L352)
  readonly shouldDefer?: boolean                   // 应延迟加载 (L356)
  readonly alwaysLoad?: boolean                    // 始终加载 (L362)

  // === MCP/元数据 ===
  mcpInfo?: { serverName: string; toolName: string }  // MCP信息 (L366)
  maxResultSizeChars: number                        // 最大结果大小 (L375)
  readonly strict?: boolean                         // 严格模式 (L381)
  backfillObservableInput?(input: Input): void      // 回填输入 (L388)

  // === UI 渲染 ===
  userFacingName(input?: Input): string             // 用户可见名称 (L573)
  userFacingNameBackgroundColor?(input?: Input): keyof Theme | undefined  // 名称背景色 (L574)
  isTransparentWrapper?(): boolean                  // 透明包装 (L579)
  getToolUseSummary?(input?: Input): string | null  // 使用摘要 (L585)
  getActivityDescription?(input?: Input): string | null  // 活动描述 (L591)
  toAutoClassifierInput(input: Input): unknown      // 自动分类器输入 (L598)
  mapToolResultToToolResultBlockParam(content: Output, toolUseID: string): ToolResultBlockParam  // (L602)
  renderToolUseMessage(input: Input, options?: RenderOptions): React.ReactNode  // 工具调用渲染 (L636)
  renderToolResultMessage?(content: Output, progressMessages: ProgressMessage[], options?: RenderOptions): React.ReactNode  // 结果渲染 (L608)
  renderToolUseRejectedMessage?(input: Input, options?: RenderOptions): React.ReactNode  // 拒绝渲染 (L669)
  renderToolUseTag?(input: Input): React.ReactNode  // 标签渲染 (L649)
  renderToolUseProgressMessage?(progressMessages: ProgressMessage[], options?: RenderOptions): React.ReactNode  // 进度渲染 (L655)
  renderToolUseQueuedMessage?(): React.ReactNode    // 排队渲染 (L663)
  renderToolUseErrorMessage?(result: ToolResult, options?: RenderOptions): React.ReactNode  // 错误渲染 (L681)
  renderGroupedToolUse?(toolUses: ToolUse[], options?: RenderOptions): React.ReactNode | null  // 分组渲染 (L693)
  extractSearchText?(out: Output): string           // 提取搜索文本 (L628)
  isResultTruncated?(output: Output): boolean       // 结果是否截断 (L642)
}
  aliases?: string[]            // 名称别名
}
```

### ToolUseContext — 工具执行上下文 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#toolusecontext-%E2%80%94-%E5%B7%A5%E5%85%B7%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87)

`ToolUseContext` 是传递给 `tool.call()` 的巨型上下文对象，包含约 40+ 成员：

typescript

```
interface ToolUseContext {
  // 选项配置
  options: {
    commands: Command[]               // 所有可用命令
    debug: boolean                    // 调试模式
    mainLoopModel: string             // 主循环模型
    tools: Tools                      // 所有可用工具
    verbose: boolean                  // 详细模式
    thinkingConfig: ThinkingConfig    // 思考配置
    mcpClients: MCPServerConnection[] // MCP 服务器连接
    mcpResources: Record<string, ServerResource[]> // MCP 资源
    isNonInteractiveSession: boolean  // 非交互式会话
    agentDefinitions: AgentDefinitionsResult  // Agent 定义
    maxBudgetUsd?: number             // 最大预算
    customSystemPrompt?: string       // 自定义系统提示
    appendSystemPrompt?: string       // 追加系统提示
    querySource?: QuerySource         // 查询来源
    refreshTools?: () => Tools        // 刷新工具
  }

  // 控制信号
  abortController: AbortController    // 取消控制器（非 AbortSignal）

  // 文件状态
  readFileState: FileStateCache       // 文件状态缓存（非 readFileTimestamps）

  // 状态管理
  getAppState(): AppState             // 读取全局状态（非 getState）
  setAppState(f: (prev: AppState) => AppState): void  // 更新全局状态（非 setState）
  setAppStateForTasks?: (f: (prev: AppState) => AppState) => void  // 任务状态更新

  // UI 相关
  setToolJSX?: SetToolJSXFn          // 设置工具 JSX
  addNotification?: (notif: Notification) => void  // 添加通知
  appendSystemMessage?: (msg: SystemMessage) => void  // 追加系统消息
  sendOSNotification?: (opts: NotificationOpts) => void  // 发送 OS 通知
  handleElicitation?: (serverName: string, params: ElicitParams, signal: AbortSignal) => Promise<ElicitResult>

  // 内存/技能追踪
  nestedMemoryAttachmentTriggers?: Set<string>
  loadedNestedMemoryPaths?: Set<string>
  dynamicSkillDirTriggers?: Set<string>
  discoveredSkillNames?: Set<string>
  userModified?: boolean

  // 进度追踪
  setInProgressToolUseIDs: (f: (prev: Set<string>) => Set<string>) => void
  setHasInterruptibleToolInProgress?: (v: boolean) => void
  setResponseLength: (f: (prev: number) => number) => void
  pushApiMetricsEntry?: (ttftMs: number) => void
  setStreamMode?: (mode: SpinnerMode) => void
  onCompactProgress?: (event: CompactProgressEvent) => void
  setSDKStatus?: (status: SDKStatus) => void
  openMessageSelector?: () => void

  // 文件/归属追踪
  updateFileHistoryState: (updater: FileHistoryUpdater) => void
  updateAttributionState: (updater: AttributionUpdater) => void

  // 会话/Agent 标识
  setConversationId?: (id: UUID) => void
  agentId?: AgentId
  agentType?: string
  messages: Message[]                 // 当前会话消息
  toolUseId?: string                  // 此次调用的唯一 ID

  // 高级配置
  requireCanUseTool?: boolean
  fileReadingLimits?: { maxTokens?: number; maxSizeBytes?: number }
  globLimits?: { maxResults?: number }
  toolDecisions?: Map<string, ToolDecision>
  queryTracking?: QueryChainTracking
  requestPrompt?: (sourceName: string, toolInputSummary?: string) => any
  criticalSystemReminder_EXPERIMENTAL?: string
  preserveToolUseResults?: boolean
  localDenialTracking?: DenialTrackingState
  contentReplacementState?: ContentReplacementState
  renderedSystemPrompt?: SystemPrompt
}
```

### ToolPermissionContext — 权限检查上下文 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#toolpermissioncontext-%E2%80%94-%E6%9D%83%E9%99%90%E6%A3%80%E6%9F%A5%E4%B8%8A%E4%B8%8B%E6%96%87)

typescript

```
type ToolPermissionContext = DeepImmutable<{
  mode: PermissionMode                                         // 权限模式
  additionalWorkingDirectories: Map<string, AdditionalWorkingDirectory>  // 附加工作目录（Map 非 string[]）
  alwaysAllowRules: ToolPermissionRulesBySource                // 始终允许规则（非 PermissionRule[]）
  alwaysDenyRules: ToolPermissionRulesBySource                 // 始终拒绝规则（非 PermissionRule[]）
  alwaysAskRules: ToolPermissionRulesBySource                  // 始终询问规则（非 PermissionRule[]）
  isBypassPermissionsModeAvailable: boolean                    // 是否可绕过权限
  isAutoModeAvailable?: boolean                                // 可选
  strippedDangerousRules?: ToolPermissionRulesBySource         // 可选，类型为 ToolPermissionRulesBySource
  shouldAvoidPermissionPrompts?: boolean                       // 可选
  awaitAutomatedChecksBeforeDialog?: boolean                   // 可选
  prePlanMode?: PermissionMode                                 // 可选，类型为 PermissionMode（非 boolean）
}>
```

### buildTool() 工厂函数 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#buildtool-%E5%B7%A5%E5%8E%82%E5%87%BD%E6%95%B0)

所有工具通过 `buildTool()` 工厂函数创建：

typescript

```
function buildTool<D extends AnyToolDef>(def: D): BuiltTool<D> {
  // 1. 接收 ToolDef 定义
  // 2. 设置默认 isEnabled、isConcurrencySafe、isReadOnly、isDestructive
  // 3. 设置默认 checkPermissions
  // 4. 设置默认 toAutoClassifierInput
  // 5. 设置默认 userFacingName
  // 6. 返回完整的 BuiltTool 实例
  return tool
}
```

## tools.ts — 工具注册表 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#tools-ts-%E2%80%94-%E5%B7%A5%E5%85%B7%E6%B3%A8%E5%86%8C%E8%A1%A8)

### 直接导入的 23 个核心工具 + 4 组附加工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#%E7%9B%B4%E6%8E%A5%E5%AF%BC%E5%85%A5%E7%9A%84-23-%E4%B8%AA%E6%A0%B8%E5%BF%83%E5%B7%A5%E5%85%B7-4-%E7%BB%84%E9%99%84%E5%8A%A0%E5%B7%A5%E5%85%B7)

typescript

```
// tools.ts 直接导入（23个始终可用）
import { AgentTool } from './tools/AgentTool'
import { SkillTool } from './tools/SkillTool'
import { BashTool } from './tools/BashTool'
import { FileEditTool } from './tools/FileEditTool'
import { FileReadTool } from './tools/FileReadTool'
import { FileWriteTool } from './tools/FileWriteTool'
import { GlobTool } from './tools/GlobTool'
import { NotebookEditTool } from './tools/NotebookEditTool'
import { WebFetchTool } from './tools/WebFetchTool'
import { TaskStopTool } from './tools/TaskStopTool'
import { BriefTool } from './tools/BriefTool'
import { TaskOutputTool } from './tools/TaskOutputTool'
import { WebSearchTool } from './tools/WebSearchTool'
import { TodoWriteTool } from './tools/TodoWriteTool'
import { ExitPlanModeV2Tool } from './tools/ExitPlanModeTool'
import { GrepTool } from './tools/GrepTool'
import { TungstenTool } from './tools/TungstenTool'
import { AskUserQuestionTool } from './tools/AskUserQuestionTool'
import { LSPTool } from './tools/LSPTool'
import { ListMcpResourcesTool } from './tools/ListMcpResourcesTool'
import { ReadMcpResourceTool } from './tools/ReadMcpResourceTool'
import { ToolSearchTool } from './tools/ToolSearchTool'
import { TestingPermissionTool } from './tools/testing'

// 懒加载导入（3个，通过 getter 函数）
const getTeamCreateTool = () =>
  require('./tools/TeamCreateTool/TeamCreateTool.js').TeamCreateTool
const getTeamDeleteTool = () =>
  require('./tools/TeamDeleteTool/TeamDeleteTool.js').TeamDeleteTool
const getSendMessageTool = () =>
  require('./tools/SendMessageTool/SendMessageTool.js').SendMessageTool

// Plan/Worktree 工具（4个）
import { EnterPlanModeTool } from './tools/EnterPlanModeTool'
import { EnterWorktreeTool } from './tools/EnterWorktreeTool'
import { ExitWorktreeTool } from './tools/ExitWorktreeTool'
import { ConfigTool } from './tools/ConfigTool'

// Task 工具（4个）
import { TaskCreateTool } from './tools/TaskCreateTool'
import { TaskGetTool } from './tools/TaskGetTool'
import { TaskUpdateTool } from './tools/TaskUpdateTool'
import { TaskListTool } from './tools/TaskListTool'
```

### Feature-Gated 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#feature-gated-%E5%B7%A5%E5%85%B7)

typescript

```
// 条件导入（运行时门控）
// Ant 内部用户专属
if (process.env.USER_TYPE === 'ant') {
  tools.push(REPLTool)
  tools.push(SuggestBackgroundPRTool)
}

// 功能特性门控
if (feature('PROACTIVE') || feature('KAIROS')) {
  tools.push(SleepTool)
}
if (feature('AGENT_TRIGGERS')) {
  tools.push(CronCreateTool, CronDeleteTool, CronListTool)
}
if (feature('AGENT_TRIGGERS_REMOTE')) {
  tools.push(RemoteTriggerTool)
}
if (feature('MONITOR_TOOL')) {
  tools.push(MonitorTool)
}
if (feature('KAIROS')) {
  tools.push(SendUserFileTool)
}
if (feature('KAIROS') || feature('KAIROS_PUSH_NOTIFICATION')) {
  tools.push(PushNotificationTool)
}
if (feature('KAIROS_GITHUB_WEBHOOKS')) {
  tools.push(SubscribePRTool)
}
if (feature('OVERFLOW_TEST_TOOL')) {
  tools.push(OverflowTestTool)
}
if (feature('CONTEXT_COLLAPSE')) {
  tools.push(CtxInspectTool)
}
if (feature('TERMINAL_PANEL')) {
  tools.push(TerminalCaptureTool)
}
if (feature('WEB_BROWSER_TOOL')) {
  tools.push(WebBrowserTool)
}
if (feature('HISTORY_SNIP')) {
  tools.push(SnipTool)
}
if (feature('UDS_INBOX')) {
  tools.push(ListPeersTool)
}
if (feature('WORKFLOW_SCRIPTS')) {
  tools.push(WorkflowTool)
}
if (isPowerShellToolEnabled()) {
  tools.push(PowerShellTool)
}
if (process.env.CLAUDE_CODE_VERIFY_PLAN === 'true') {
  tools.push(VerifyPlanExecutionTool)
}
```

### assembleToolPool() — 工具池构建 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#assembletoolpool-%E2%80%94-%E5%B7%A5%E5%85%B7%E6%B1%A0%E6%9E%84%E5%BB%BA)

typescript

```
function assembleToolPool(
  permissionContext: ToolPermissionContext,
  mcpTools: Tools
): Tools {
  // 1. 获取所有内置工具（通过 getTools，非 getBuiltinTools）
  const builtInTools = getTools(permissionContext)

  // 2. 过滤 MCP 工具的 deny 规则
  const allowedMcpTools = filterToolsByDenyRules(mcpTools, permissionContext)

  // 3. 使用 uniqBy 去重（按 name），内置工具优先（首次出现保留）
  const byName = (a: Tool, b: Tool) => a.name.localeCompare(b.name)
  return uniqBy(
    [...builtInTools].sort(byName).concat(allowedMcpTools.sort(byName)),
    'name',
  )
}
```

### getMergedTools() — 工具合并 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#getmergedtools-%E2%80%94-%E5%B7%A5%E5%85%B7%E5%90%88%E5%B9%B6)

typescript

```
function getMergedTools(
  permissionContext: ToolPermissionContext,
  mcpTools: Tools
): Tools {
  // 合并内置工具与 MCP 工具，不做去重
  const builtInTools = getTools(permissionContext)  // 非 getBuiltinTools
  return [...builtInTools, ...mcpTools]
}
```

## 工具分类总览 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#%E5%B7%A5%E5%85%B7%E5%88%86%E7%B1%BB%E6%80%BB%E8%A7%88)

### 按安全性分类 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#%E6%8C%89%E5%AE%89%E5%85%A8%E6%80%A7%E5%88%86%E7%B1%BB)

| 类别 | 工具 | 特点 |
| --- | --- | --- |
| **只读** | FileReadTool, GlobTool, GrepTool, ToolSearchTool, WebSearchTool | `isReadOnly()=true`, 无需权限 |
| **写入** | FileWriteTool, FileEditTool, TodoWriteTool | `isDestructive()=true`, 需要权限 |
| **执行** | BashTool, PowerShellTool, REPLTool | 最高风险，50+ 安全检查 |
| **网络** | WebFetchTool, MCPTool, McpAuthTool | 外部通信，需授权 |
| **AI** | AgentTool, SkillTool | 递归 AI 调用 |

### 按并发安全性分类 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#%E6%8C%89%E5%B9%B6%E5%8F%91%E5%AE%89%E5%85%A8%E6%80%A7%E5%88%86%E7%B1%BB)

| 并发安全 | 工具 |
| --- | --- |
| **安全** | FileReadTool, GlobTool, GrepTool, WebSearchTool, ToolSearchTool |
| **不安全** | FileWriteTool, FileEditTool, BashTool (文件系统竞争) |
| **条件安全** | AgentTool (取决于子任务工具) |

## 工具执行流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html#%E5%B7%A5%E5%85%B7%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B)

```
API 返回 tool_use content block
    ↓
StreamingToolExecutor.execute()
    ↓
1. tool.validateInput(input)        — 输入验证
    ↓
2. tool.checkPermissions(context)   — 权限检查
    ↓ (如果需要授权)
   PermissionRequest UI → 用户确认
    ↓ (已授权 / 自动批准)
3. tool.call(args, context, canUseTool, parentMessage)  — 执行工具
    ↓
4. 返回 Promise<ToolResult<Output>>  — 工具结果
    ↓
5. tool_result 注入消息队列          — 下一轮循环
```