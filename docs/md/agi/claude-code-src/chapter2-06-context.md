Title: 上下文系统 (context.ts + context/) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html

Markdown Content:
上下文系统负责构建 AI 查询的 **系统提示词** 和 **用户上下文**，包括 Git 状态、CLAUDE.md 记忆文件、当前日期等。

## context.ts — 上下文构建入口 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#context-ts-%E2%80%94-%E4%B8%8A%E4%B8%8B%E6%96%87%E6%9E%84%E5%BB%BA%E5%85%A5%E5%8F%A3)

### getSystemContext() — 系统上下文 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#getsystemcontext-%E2%80%94-%E7%B3%BB%E7%BB%9F%E4%B8%8A%E4%B8%8B%E6%96%87)

typescript

```
// 返回 Promise<{ [k: string]: string }>，非 Promise<string>
export const getSystemContext = memoize(
  async (): Promise<{ [k: string]: string }> => {
    // 通过 getGitStatus() 获取 Git 信息（内部并行调用 getBranch/getDefaultBranch 等）
    const gitStatus = await getGitStatus()

    return {
      ...(gitStatus && { gitStatus }),
      // 可能包含 cacheBreaker（仅 ant 内部使用）
    }
  },
)
```

### getUserContext() — 用户上下文 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#getusercontext-%E2%80%94-%E7%94%A8%E6%88%B7%E4%B8%8A%E4%B8%8B%E6%96%87)

typescript

```
// 返回 Promise<{ [k: string]: string }>，非 Promise<string>
export const getUserContext = memoize(
  async (): Promise<{ [k: string]: string }> => {
    // 读取 CLAUDE.md 记忆文件（使用 getClaudeMds + getMemoryFiles，非 readClaudeMdFiles）
    const claudeMd = getClaudeMds(filterInjectedMemoryFiles(await getMemoryFiles()))
    setCachedClaudeMdContent(claudeMd || null)

    return {
      ...(claudeMd && { claudeMd }),
    }
  },
)
```

### CLAUDE.md 记忆文件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#claude-md-%E8%AE%B0%E5%BF%86%E6%96%87%E4%BB%B6)

Claude Code 自动发现和读取 CLAUDE.md 文件：

```
搜索路径（优先级从低到高）:
  ~/.claude/CLAUDE.md          — 全局记忆
  <project>/CLAUDE.md          — 项目根记忆
  <project>/.claude/CLAUDE.md  — 项目配置记忆
  <cwd>/CLAUDE.md              — 当前目录记忆

记忆内容会被注入到 AI 的上下文中，
帮助 AI 理解项目特定的约定和偏好。
```

## context/ — React 上下文目录 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#context-%E2%80%94-react-%E4%B8%8A%E4%B8%8B%E6%96%87%E7%9B%AE%E5%BD%95)

`src/context/` 目录包含 9 个 React Context Provider，管理 UI 层的不同方面：

### fpsMetrics.tsx — FPS 指标 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#fpsmetrics-tsx-%E2%80%94-fps-%E6%8C%87%E6%A0%87)

typescript

```
const FpsMetricsProvider = ({ children }) => {
  // 追踪终端渲染帧率
  // 帧间隔 = 16ms (60fps 目标)
  // 提供 useFpsMetrics() hook
}
```

### mailbox.tsx — Actor 消息传递 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#mailbox-tsx-%E2%80%94-actor-%E6%B6%88%E6%81%AF%E4%BC%A0%E9%80%92)

typescript

```
// Mailbox 是从 utils/mailbox.ts 导入的具体 class（非泛型接口）
// 消息类型固定为 Message
class Mailbox {
  send(msg: Message): void
  receive(fn?: (msg: Message) => boolean): Promise<Message>  // 返回 Promise，非 AsyncGenerator
}

// MailboxProvider 包装 React Context
export function MailboxProvider({ children }: Props) { ... }
```

### notifications.tsx — 通知系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#notifications-tsx-%E2%80%94-%E9%80%9A%E7%9F%A5%E7%B3%BB%E7%BB%9F)

typescript

```
// 联合类型: TextNotification | JSXNotification
type Notification = {
  key: string               // 非 id
  text: string              // TextNotification 中用 text（非 message）
  // 或 jsx: ReactNode      // JSXNotification 中用 jsx
  priority: 'low' | 'medium' | 'high' | 'immediate'
  timeoutMs?: number        // 非 timeout
  fold?: (accumulator: Notification, incoming: Notification) => Notification
  invalidates?: string[]    // 移除其他通知
}

function useNotifications() {
  return {
    addNotification(notification: Notification): void,    // 非 add
    removeNotification(key: string): void,                // 非 remove
  }
}
```

**优先级行为:**

*   `'low'` / `'medium'` — 排队显示
*   `'high'` — 优先显示
*   `'immediate'` — 立即抢占当前显示

### stats.tsx — 统计存储 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#stats-tsx-%E2%80%94-%E7%BB%9F%E8%AE%A1%E5%AD%98%E5%82%A8)

typescript

```
// StatsStore 是 type（非 class），通过 createStatsStore() 工厂函数创建
type StatsStore = {
  increment(name: string, value?: number): void  // 计数器
  set(name: string, value: number): void         // 设置值
  observe(name: string, value: number): void     // 观测值
  add(name: string, value: string): void         // 累加
}

function createStatsStore(): StatsStore
```

### voice.tsx — 语音状态 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#voice-tsx-%E2%80%94-%E8%AF%AD%E9%9F%B3%E7%8A%B6%E6%80%81)

typescript

```
// VoiceState 是包含多个字段的对象类型（非简单字符串联合）
type VoiceState = {
  voiceState: 'idle' | 'recording' | 'processing'
  voiceError: string | null
  voiceInterimTranscript: string
  voiceAudioLevels: number[]
  voiceWarmingUp: boolean
}

// useVoiceState 需要 selector 参数（非无参调用）
function useVoiceState<T>(selector: (state: VoiceState) => T): T
function useSetVoiceState(): (updater: (prev: VoiceState) => VoiceState) => void
function useGetVoiceState(): () => VoiceState  // 非响应式读取（回调内使用）
```

### 其他 Context [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#%E5%85%B6%E4%BB%96-context)

| Provider | 文件 | 用途 |
| --- | --- | --- |
| `ModalContext` | `modalContext.tsx` | 模态窗口尺寸感知 |
| `OverlayContext` | `overlayContext.tsx` | 弹出层追踪 |
| `PromptOverlayContext` | `promptOverlayContext.tsx` | 提示覆盖层 |
| `QueuedMessageContext` | `QueuedMessageContext.tsx` | 排队消息管理 |

## 上下文分析 (utils/contextAnalysis.ts) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#%E4%B8%8A%E4%B8%8B%E6%96%87%E5%88%86%E6%9E%90-utils-contextanalysis-ts)

typescript

```
// 函数名为 analyzeContext（非 analyzeContextUsage）
async function analyzeContext(messages: Message[]): TokenStats
```

## 上下文缓存策略 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html#%E4%B8%8A%E4%B8%8B%E6%96%87%E7%BC%93%E5%AD%98%E7%AD%96%E7%95%A5)

```
系统上下文 (Git 信息):
  ├── 首次请求时计算
  ├── 缓存整个会话
  └── clearConversation() 时清除

用户上下文 (CLAUDE.md):
  ├── 首次请求时读取
  ├── 文件变更时触发缓存破坏
  └── 使用文件 mtime 检测变更

内存目录上下文:
  ├── 按需读取
  ├── truncateEntrypointContent() 截断
  └── MAX_ENTRYPOINT_LINES = 200
```