---
title: "Claude Code 深度技术文档"
site: "Hooks 系统"
source: "https://plain-sun-1ffe.hunshcn429.workers.dev/ui/hooks.html"
language: "zh-CN"
description: "Anthropic Claude Code v2.1.88 — 逐行逐目录的完整技术剖析"
word_count: 488
---

## Hooks 系统

`src/hooks/` 包含 **104 个 React Hooks 文件** ，是 Claude Code UI 逻辑的核心。

## Hooks 分类

### 状态管理 Hooks

| Hook | 功能 |
| --- | --- |
| `useAppState(selector)` | 从全局 Store 选择状态 |
| `useSetAppState()` | 更新全局状态 |
| — | 其他状态通过 `useAppState(s => s.xxx)` 获取 |

### 输入处理 Hooks

| Hook | 功能 |
| --- | --- |
| `useInput(handler)` | 键盘输入监听 |
| `useTextInput()` | 文本输入管理 |
| `useVimMode()` | Vim 模式集成 |
| `useSearchInput()` | 搜索输入 |

### UI 控制 Hooks

| Hook | 功能 |
| --- | --- |
| `useMoreRight()` | 右侧面板展示 |
| `useTerminalSize()` | 终端尺寸监听 |
| `useKeybinding()` | 快捷键绑定 |

### 数据获取 Hooks

| Hook | 功能 |
| --- | --- |
| `useSubmitMessage()` | 消息提交 |

### 系统 Hooks

| Hook | 功能 |
| --- | --- |
| `useNotification()` | 通知管理 |
| `useStats()` | 统计信息（水库采样） |
| `useFpsMetrics()` | 帧率监控 |
| `useVoice()` | 语音模式 |
| `useKeybinding()` | 快捷键绑定 |

## useAppState 详解

```typescript
typescript// 使用 useSyncExternalStore 实现高性能状态订阅
function useAppState<T>(selector: (state: AppState) => T): T {
  return useSyncExternalStore(
    store.subscribe,              // 订阅变化
    () => selector(store.getState()), // 获取当前值
    () => selector(store.getState()), // 服务端渲染回退
  )
}

// 用法 — 只在 selectedModel 变化时重渲染
const model = useAppState(s => s.mainLoopModel)
```

## useInput 详解

```typescript
typescript// Ink 的 useInput hook
function useInput(
  handler: (input: string, key: Key, event: InputEvent) => void,
  options?: { isActive?: boolean }
): void {
  // 1. 订阅 stdin
  // 2. 解析 ANSI 序列 → key 对象
  // 3. 调用 handler
}

interface Key {
  upArrow: boolean
  downArrow: boolean
  leftArrow: boolean
  rightArrow: boolean
  return: boolean
  escape: boolean
  ctrl: boolean
  shift: boolean
  tab: boolean
  backspace: boolean
  delete: boolean
  meta: boolean
  pageDown: boolean
  pageUp: boolean
  wheelUp: boolean
  wheelDown: boolean
  home: boolean
  end: boolean
  fn: boolean
  super: boolean
}
```

## useSubmitMessage 详解

`useSubmitMessage` 处理用户消息提交，主要流程：

1. 检查是否是斜杠命令
2. 构建用户消息（包含附件、上下文等）
3. 通过 QueryEngine 的 `submitMessage` 异步迭代器提交并处理流式事件

## 自定义 Hooks 模式

### Ref 缓存模式

通过 Ref 缓存避免闭包过时问题。实际实现类似于将回调函数存储在 ref 中，用 `useCallback` 包装以保持稳定引用。

### 订阅清理模式

```typescript
typescriptfunction useSubscription(subscribe: () => () => void) {
  useEffect(() => {
    const unsubscribe = subscribe()
    return unsubscribe  // 清理订阅
  }, [subscribe])
}
```