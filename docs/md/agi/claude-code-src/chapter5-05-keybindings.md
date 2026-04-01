---
title: "快捷键系统 | Claude Code 深度技术文档"
source: "https://plain-sun-1ffe.hunshcn429.workers.dev/ui/keybindings.html"
language: "zh-CN"
description: "Anthropic Claude Code v2.1.88 — 逐行逐目录的完整技术剖析"
word_count: 676
---

## 快捷键系统

`src/keybindings/` 包含 14 个文件，实现了完整的用户可配置快捷键系统。

## 架构概览

```
用户按键 (stdin)
  │
  ├── Ink useInput() → 解析为 (input, key)
  │
  ├── ChordInterceptor
  │   ├── 单键匹配 → resolveKey()
  │   └── 多键序列 → resolveKeyWithChordState()
  │       ├── chord_started → 等待下一键
  │       └── match → 执行 action
  │
  ├── Context 过滤
  │   └── activeContexts: ['Global', 'Chat', ...]
  │
  └── Handler 执行
      └── action → 注册的 handler 函数
```

## 上下文系统

18 个快捷键上下文：

```typescript
typescripttype KeybindingContextName =
  | 'Global'          // 全局（始终激活）
  | 'Chat'            // 聊天输入模式
  | 'Autocomplete'    // 自动补全打开时
  | 'Confirmation'    // 权限确认对话框
  | 'Help'            // 帮助界面
  | 'Transcript'      // 对话记录浏览
  | 'HistorySearch'   // 历史搜索
  | 'Task'            // 任务管理
  | 'ThemePicker'     // 主题选择
  | 'Settings'        // 设置界面
  | 'Tabs'            // 标签页导航
  | 'Attachments'     // 附件管理
  | 'Footer'          // 底部栏
  | 'MessageSelector' // 消息选择
  | 'DiffDialog'      // Diff 对话框
  | 'ModelPicker'     // 模型选择
  | 'Select'          // 通用选择
  | 'Plugin'          // 插件
```

## 默认快捷键

### Global 上下文

| 快捷键 | Action | 功能 |
| --- | --- | --- |
| `Ctrl+C` | `app:interrupt` | 中断（不可重绑定） |
| `Ctrl+D` | `app:exit` | 退出（不可重绑定） |
| `Ctrl+L` | `app:clear` | 清屏 |
| `Escape` | `app:escape` | 取消/返回 |

### Chat 上下文

| 快捷键 | Action | 功能 |
| --- | --- | --- |
| `Enter` | `chat:submit` | 提交消息 |
| `Up` | `history:previous` | 上一条历史 |
| `Down` | `history:next` | 下一条历史 |
| `Ctrl+R` | `historySearch:open` | 搜索历史 |
| `Ctrl+K` | `chat:clearInput` | 清空输入 |
| `Ctrl+Shift+B` | KAIROS 简要模式 | Feature-gated |
| `Ctrl+Shift+F` | 快速搜索 | Feature-gated |

### Confirmation 上下文

| 快捷键 | Action | 功能 |
| --- | --- | --- |
| `Y` | `confirm:allow` | 允许 |
| `N` | `confirm:deny` | 拒绝 |
| `A` | `confirm:alwaysAllow` | 始终允许 |
| `Escape` | `confirm:dismiss` | 关闭 |

## Chord 支持（多键序列）

支持类似 VS Code 的 chord 快捷键（如 Ctrl+K Ctrl+S）。多键序列用 `ParsedKeystroke[]` 表示。

`resolveKeyWithChordState()` 函数处理 chord 解析：

1. **首个按键** ：检查是否匹配 chord 前缀，如是则返回 `chord_started` ，否则尝试单键匹配
2. **后续按键** ：拼接已有序列，检查是否完全匹配，匹配则执行，否则取消

Chord 超时： `CHORD_TIMEOUT_MS = 1000` ，1000ms 未按后续键自动取消。

## 用户自定义

```json
json// ~/.claude/keybindings.json
{
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+enter": "chat:submit",
        "enter": null,              // 解绑 Enter 提交
        "ctrl+k ctrl+s": "settings:open"  // Chord 快捷键
      }
    }
  ]
}
```

### 验证系统

```typescript
typescript// validate.ts — 全面验证用户配置
type KeybindingWarningType =
  | 'parse_error'      // 按键语法错误
  | 'duplicate'        // 重复绑定
  | 'reserved'         // 绑定了保留快捷键
  | 'invalid_context'  // 无效上下文名
  | 'invalid_action'   // 无效动作名

// 不可重绑定的快捷键
const NON_REBINDABLE = ['ctrl+c', 'ctrl+d', 'ctrl+m']
```

### 热重载

```typescript
typescript// 文件变更监听 — 修改 keybindings.json 后立即生效
initializeKeybindingWatcher()  // 使用 chokidar 监听
// 写入稳定阈值: 500ms（等待编辑器保存完成）
```