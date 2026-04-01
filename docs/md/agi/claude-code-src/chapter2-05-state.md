Title: ) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html

Markdown Content:
## 状态管理 (state/) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86-state)

Claude Code 使用自定义的类 Zustand 状态管理系统，位于 `src/state/` 目录（6 个文件），核心是一个 **闭包式 Store** 配合 `DeepImmutable<T>` 包装的 80+ 字段 AppState。

## 目录结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

```
src/state/
├── store.ts              # 通用 Store 实现（闭包式）
├── AppState.tsx           # AppState 类型 + React Provider + Hooks
├── AppStateStore.ts       # AppState 具体字段定义（50+ 字段）
├── onChangeAppState.ts    # 状态变更监听 → 持久化同步
├── selectors.ts           # 常用选择器
└── teammateViewHelpers.ts # 队友视图辅助函数
```

## store.ts — 通用 Store 实现 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#store-ts-%E2%80%94-%E9%80%9A%E7%94%A8-store-%E5%AE%9E%E7%8E%B0)

typescript

```
// 类 Zustand 的闭包式 Store（无外部依赖）
function createStore<T>(initialState: T, onChange?: OnChange<T>): Store<T> {
  let state: T = initialState
  const listeners = new Set<() => void>()  // Listener 是 () => void

  return {
    getState(): T {                       // 返回 T（非 DeepImmutable<T>）
      return state
    },

    setState(updater: (prev: T) => T) {   // 返回完整 T（非 Partial<T>）
      const prev = state
      const next = updater(prev)
      if (Object.is(next, prev)) return   // Object.is 相等检查
      state = next
      onChange?.({ newState: next, oldState: prev })
      for (const listener of listeners) listener()  // listener 无参调用
    },

    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
```

### DeepImmutable 类型包装 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#deepimmutable-%E7%B1%BB%E5%9E%8B%E5%8C%85%E8%A3%85)

typescript

```
// 递归只读包装，防止意外修改
type DeepImmutable<T> =
  T extends Map<infer K, infer V> ? ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> :
  T extends Set<infer V> ? ReadonlySet<DeepImmutable<V>> :
  T extends object ? { readonly [K in keyof T]: DeepImmutable<T[K]> } :
  T
```

## AppStateStore.ts — 80+ 字段定义 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#appstatestore-ts-%E2%80%94-80-%E5%AD%97%E6%AE%B5%E5%AE%9A%E4%B9%89)

AppState 包含完整的应用运行时状态：

### 核心状态字段 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#%E6%A0%B8%E5%BF%83%E7%8A%B6%E6%80%81%E5%AD%97%E6%AE%B5)

typescript

```
interface AppState {
  // === 设置与配置 ===
  settings: Settings                 // 用户设置（getInitialSettings()）
  verbose: boolean                   // 详细模式
  mainLoopModel: string | null       // 主循环模型（别名/全名/null）
  mainLoopModelForSession: string | null  // 会话级模型覆盖
  effortValue?: EffortValue          // 推理努力级别
  fastMode: boolean                  // 快速模式
  authVersion: number                // 认证版本
  initialMessage: string | null      // 初始消息

  // === UI 状态 ===
  statusLineText?: string            // 状态栏文本
  expandedView: 'none' | string      // 展开视图
  isBriefOnly: boolean               // 简洁模式
  showTeammateMessagePreview: boolean // 队友消息预览
  selectedIPAgentIndex: number        // 选中IP Agent索引
  coordinatorTaskIndex: number        // 协调器任务索引
  viewSelectionMode: 'none' | string  // 视图选择模式
  footerSelection: unknown            // 页脚选择
  activeOverlays: Set<string>         // 活跃覆盖层

  // === 远程/Bridge 状态 ===
  kairosEnabled: boolean              // Kairos 启用
  remoteSessionUrl?: string           // 远程会话 URL
  remoteConnectionStatus: string      // 远程连接状态
  remoteBackgroundTaskCount: number   // 远程后台任务数
  showRemoteCallout: boolean          // 显示远程提示
  replBridgeEnabled: boolean          // Bridge 启用
  replBridgeExplicit: boolean         // Bridge 显式启用
  replBridgeOutboundOnly: boolean     // 仅出站
  replBridgeConnected: boolean        // Bridge 连接状态
  replBridgeSessionActive: boolean    // Bridge 会话活跃
  replBridgeReconnecting: boolean     // 重连中
  replBridgeConnectUrl?: string       // 连接 URL
  replBridgeSessionUrl?: string       // 会话 URL
  replBridgeEnvironmentId?: string    // 环境 ID
  replBridgeSessionId?: string        // 会话 ID
  replBridgeError?: string            // 错误信息
  replBridgeInitialName?: string      // 初始名称

  // === 工具与权限 ===
  toolPermissionContext: ToolPermissionContext  // 工具权限上下文
  agent: string | undefined               // 当前 Agent（string 非 AgentInfo）
  agentDefinitions: AgentDefinitionsResult  // Agent 定义

  // === 任务与 Agent ===
  tasks: Record<string, TaskState>    // 任务映射
  agentNameRegistry: Map<string, AgentId>  // Agent 名称注册表（Map<string, AgentId> 非 Map<string, string>）

  // === 文件追踪 ===
  fileHistory: FileHistoryState       // 文件历史
  attribution: AttributionState       // 归属状态

  // === MCP ===
  mcp: {
    clients: MCPClient[]
    tools: Tool[]
    commands: Command[]
    resources: Record<string, ServerResource[]>
    pluginReconnectKey: number
  }

  // === 插件 ===
  plugins: {
    enabled: Plugin[]
    disabled: Plugin[]
    commands: Command[]
    errors: PluginError[]
    installationStatus: InstallationStatus
    needsRefresh: boolean
  }

  // === 待办与通知 ===
  todos: { [agentId: string]: TodoList }  // 非 Record<string, Todo>
  notifications: { current: Notification | null; queue: Notification[] }
  elicitation: { queue: ElicitationItem[] }
  remoteAgentTaskSuggestions: string[]

  // === 思考与推测 ===
  thinkingEnabled: boolean
  promptSuggestionEnabled: boolean
  promptSuggestion: PromptSuggestionState
  speculation: SpeculationState       // 推测状态（非 speculationState）
  speculationSessionTimeSavedMs: number

  // === Hooks/收件箱/sandbox ===
  sessionHooks: Map<string, HookState>
  inbox: { messages: InboxMessage[] }
  workerSandboxPermissions: { queue: SandboxPermission[]; selectedIndex: number }
  pendingWorkerRequest: unknown
  pendingSandboxRequest: unknown
  skillImprovement: { suggestion: SkillSuggestion | null }
}
```

### SpeculationState — 推测执行状态机 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#speculationstate-%E2%80%94-%E6%8E%A8%E6%B5%8B%E6%89%A7%E8%A1%8C%E7%8A%B6%E6%80%81%E6%9C%BA)

typescript

```
type SpeculationState =
  | { status: 'idle' }                            // 空闲（判别字段是 status 非 type）
  | {
      status: 'active'                             // 推测执行中
      id: string
      abort: () => void                            // 取消函数（非 AbortController）
      startTime: number
      messagesRef: { current: Message[] }          // 消息引用
      writtenPathsRef: { current: Set<string> }    // 写入路径
      boundary: CompletionBoundary | null          // 推测边界（非 number）
      suggestionLength: number
      toolUseCount: number
      isPipelined: boolean
      contextRef: { current: REPLHookContext }
      pipelinedSuggestion?: { text: string; promptId: string; generationRequestId: string | null } | null
    }
```

推测执行的工作流：

```
用户输入 → idle
        ↓
PromptSuggestion 服务预测下一轮输入 → active
        ├── 预执行 AI 查询
        ├── 如果用户确认预测 → 使用预执行结果
        └── 如果用户输入不同 → abort + 丢弃 → idle
```

## AppState.tsx — React 集成 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#appstate-tsx-%E2%80%94-react-%E9%9B%86%E6%88%90)

### Provider 组件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#provider-%E7%BB%84%E4%BB%B6)

typescript

```
// Context 名称是 AppStoreContext（非 AppStateContext）
// initialState 类型是 AppState | undefined（非 Partial<AppState>）
function AppStateProvider({
  initialState,
  onChangeAppState,
  children,
}: {
  initialState?: AppState
  onChangeAppState?: OnChange<AppState>
  children: React.ReactNode
}) {
  const [store] = useState(() => createAppStateStore(initialState, onChangeAppState))
  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  )
}
```

### useAppState Hook [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#useappstate-hook)

typescript

```
// 选择性订阅 — 仅在选中字段变化时重渲染
// selector 参数类型是 (state: AppState) => T（非 DeepImmutable<AppState>）
function useAppState<T>(selector: (state: AppState) => T): T {
  const store = useContext(AppStoreContext)
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
  )
}
```

### useSetAppState Hook [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#usesetappstate-hook)

typescript

```
function useSetAppState() {
  const store = useContext(AppStoreContext)
  return store.setState
}
```

## onChangeAppState.ts — 持久化同步 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#onchangeappstate-ts-%E2%80%94-%E6%8C%81%E4%B9%85%E5%8C%96%E5%90%8C%E6%AD%A5)

typescript

```
// 参数是解构对象（非两个独立参数）
function onChangeAppState({ newState, oldState }: { newState: AppState; oldState: AppState }) {
  // 1. 同步权限模式到 CCR/SDK
  // 2. 持久化设置变更
  // 3. 其他状态变更响应逻辑
}
```

## selectors.ts — 选择器 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#selectors-ts-%E2%80%94-%E9%80%89%E6%8B%A9%E5%99%A8)

注意

`selectors.ts` 实际只导出两个函数，不包含 `selectModel`、`selectSettings` 等预定义选择器。

typescript

```
// 实际导出的选择器
export function getViewedTeammateTask(appState: Pick<AppState, 'viewingAgentTaskId' | 'tasks'>): InProcessTeammateTaskState | undefined
export function getActiveAgentForInput(appState: AppState): ActiveAgentForInput

type ActiveAgentForInput =
  | { type: 'leader' }
  | { type: 'viewed'; task: InProcessTeammateTaskState }
  | { type: 'named_agent'; task: LocalAgentTaskState }
```

## 性能优化策略 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%AD%96%E7%95%A5)

1.   **选择性订阅**: `useAppState(selector)` 通过 `useSyncExternalStore` 实现细粒度重渲染
2.   **DeepImmutable**: 编译时防止意外修改，无运行时开销
3.   **批量更新**: `setState` 使用 `Object.assign` 合并部分更新
4.   **Ref 缓存**: 稳定回调中通过 `ref.current` 读取最新状态（避免回调重建）
5.   **低延迟通知**: 同步通知订阅者（绕过 React Context 延迟）