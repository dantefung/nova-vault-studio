Title: 历史记录 (history.ts) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/history.html

Markdown Content:
`history.ts` (~476 行) 实现会话历史的持久化存储与检索，使用 **异步生成器** 模式高效读取大量历史记录。

## 数据结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/history.html#%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)

typescript

```
// 序列化到磁盘的历史条目
type LogEntry = {
  display: string                    // 非 displayText
  pastedContents: Record<number, StoredPastedContent>  // 复数，Record 类型
  timestamp: number
  project: string                    // 必需（非可选）
  sessionId?: string                 // 可选（非必需）
}

// 读取后的历史条目（来自 src/utils/config.ts）
interface HistoryEntry {
  display: string                    // 非 displayText
  pastedContents: Record<number, PastedContent>  // 不继承 LogEntry
}

// 粘贴内容存储类型（单一对象，非联合类型）
type StoredPastedContent = {
  id: number
  type: 'text' | 'image'
  content?: string                   // 内联内容（小内容）
  contentHash?: string               // 哈希引用（大内容）
  mediaType?: string
  filename?: string
}
```

## 核心 API [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/history.html#%E6%A0%B8%E5%BF%83-api)

### getHistory() — 异步生成器读取 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/history.html#gethistory-%E2%80%94-%E5%BC%82%E6%AD%A5%E7%94%9F%E6%88%90%E5%99%A8%E8%AF%BB%E5%8F%96)

typescript

```
// 无 project 参数（项目过滤在内部通过 getProjectRoot() 实现）
async function* getHistory(): AsyncGenerator<HistoryEntry> {
  const currentProject = getProjectRoot()
  const currentSession = getSessionId()

  for await (const entry of makeLogEntryReader()) {
    if (entry.project !== currentProject) continue
    // 当前会话条目优先输出，其他会话条目延后
    yield await logEntryToHistoryEntry(entry)
  }
}
```

### addToHistory() — 写入历史 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/history.html#addtohistory-%E2%80%94-%E5%86%99%E5%85%A5%E5%8E%86%E5%8F%B2)

typescript

```
// 同步函数（非 async），参数为 HistoryEntry | string（非 LogEntry）
function addToHistory(command: HistoryEntry | string): void {
  // 跳过 Tungsten 会话
  if (isEnvTruthy(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY)) return

  // 内部异步刷新到磁盘
}

// 其他写入函数:
// addToPromptHistory(entry: HistoryEntry) — 写入提示历史（处理粘贴内容哈希）
// immediateFlushHistory() — 立即刷新历史
```

### 去重与显示 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/history.html#%E5%8E%BB%E9%87%8D%E4%B8%8E%E6%98%BE%E7%A4%BA)

历史记录按显示文本去重，确保用户看到的历史列表无重复项。去重逻辑嵌入在历史加载流程内部。

## 存储位置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/history.html#%E5%AD%98%E5%82%A8%E4%BD%8D%E7%BD%AE)

```
~/.claude/
├── history.jsonl      # 单个 JSONL 文件（非按月份分目录）
└── paste-store/       # 大粘贴内容存储
    ├── abc123.txt     # 按哈希命名
    └── ...
```