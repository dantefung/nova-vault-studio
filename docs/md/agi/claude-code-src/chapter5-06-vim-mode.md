---
title: "Claude Code 深度技术文档"
site: "Vim 模式"
source: "https://plain-sun-1ffe.hunshcn429.workers.dev/ui/vim-mode.html"
language: "zh-CN"
description: "Anthropic Claude Code v2.1.88 — 逐行逐目录的完整技术剖析"
word_count: 847
---

## Vim 模式

`src/vim/` 实现了完整的 Vim Normal 模式状态机，包含 5 个文件。

## 架构

Vim 模式是一个纯函数状态机，不依赖 React 或外部副作用：

```
INSERT 模式（默认）
  ↓ Escape
NORMAL 模式
  ├── 状态: idle → count → operator → ...
  ├── 按键 → transition() → 新状态 + 副作用
  └── 副作用 → OperatorContext 回调
```

## VimState 类型

```typescript
typescripttype VimState =
  | { mode: 'INSERT'; insertedText: string }
  | { mode: 'NORMAL'; command: CommandState }

// CommandState — 12 种状态
type CommandState =
  | { type: 'idle' }
  | { type: 'count'; digits: string }
  | { type: 'operator'; op: Operator; count: number }
  | { type: 'operatorCount'; op: Operator; count: number; digits: string }
  | { type: 'operatorFind'; op: Operator; count: number; find: FindType }
  | { type: 'operatorTextObj'; op: Operator; count: number; scope: TextObjScope }
  | { type: 'find'; find: FindType; count: number }
  | { type: 'g'; count: number }
  | { type: 'operatorG'; op: Operator; count: number }
  | { type: 'replace'; count: number }
  | { type: 'indent'; dir: '>' | '<'; count: number }
```

## 状态转换图

```
idle ──数字──→ count ──操作符──→ operatorCount
  │                                   │
  ├──操作符──→ operator ──────────────┤
  │              │                     │
  │              ├──fFtT──→ operatorFind ──字符──→ 执行
  │              ├──ia──→ operatorTextObj ──对象──→ 执行
  │              ├──g──→ operatorG ──g──→ 执行(gg)
  │              └──动作──→ 执行
  │
  ├──fFtT──→ find ──字符──→ 执行
  ├──g──→ g ──g──→ 执行(gg)
  ├──r──→ replace ──字符──→ 执行
  └──><──→ indent ──><──→ 执行(>>或<<)
```

## 操作符 (Operators)

```typescript
typescripttype Operator = 'delete' | 'change' | 'yank'

// d — 删除
// c — 修改（删除并进入 INSERT）
// y — 复制

// 操作符 + 动作 = 操作
// dw — 删除一个词
// c$ — 修改到行尾
// yy — 复制整行
```

## 动作 (Motions)

```typescript
typescriptconst SIMPLE_MOTIONS = new Set([
  'h',   // 左
  'l',   // 右
  'j',   // 下一行
  'k',   // 上一行
  'w',   // 下一个词开头
  'b',   // 上一个词开头
  'e',   // 当前词末尾
  'W',   // 下一个 WORD
  'B',   // 上一个 WORD
  'E',   // 当前 WORD 末尾
  '0',   // 行首
  '^',   // 非空白行首
  '$',   // 行尾
])

// 动作分类
// 包含性 (inclusive): e, E, $ — 包含目标字符
// 行模式 (linewise): j, k, G, gg — 操作整行
```

## 文本对象 (Text Objects)

```typescript
typescript// 16 种文本对象
const TEXT_OBJ_TYPES = new Set(['w', 'W', '"', "'", '\`', '(', ')', 'b', '[', ']', '{', '}', 'B', '<', '>'])

// i = inner (内部), a = around (包含边界)
// diw — 删除内部词
// da" — 删除包含引号的文本
// ci( — 修改括号内的内容

function findTextObject(
  text: string,
  offset: number,
  objectType: string,
  isInner: boolean
): TextObjectRange | null {
  switch (objectType) {
    case 'w': return findWordObject(text, offset, isInner, isVimWordChar)
    case 'W': return findWordObject(text, offset, isInner, isWORDChar)
    case '"': case "'": case '\`':
      return findQuoteObject(text, offset, objectType, isInner)
    default:
      return findBracketObject(text, offset, PAIRS[objectType], isInner)
  }
}
```

## Dot Repeat（. 命令）

```typescript
typescript// 记录最后一次修改操作，用 . 重复
type RecordedChange =
  | { type: 'insert'; text: string }
  | { type: 'operator'; op: Operator; motion: string; count: number }
  | { type: 'operatorTextObj'; op: Operator; objType: string; scope: TextObjScope; count: number }
  | { type: 'operatorFind'; op: Operator; find: FindType; char: string; count: number }
  | { type: 'replace'; char: string; count: number }
  | { type: 'x'; count: number }
  | { type: 'toggleCase'; count: number }
  | { type: 'indent'; dir: '>' | '<'; count: number }
  | { type: 'openLine'; direction: 'above' | 'below' }
  | { type: 'join'; count: number }

// PersistentState（跨命令持久）
interface PersistentState {
  lastChange: RecordedChange | null   // . 重复用
  lastFind: { type: FindType; char: string } | null  // ; , 重复用
  register: string           // 寄存器内容
  registerIsLinewise: boolean // 寄存器是否为行模式
}
```

## Grapheme 安全

```typescript
typescript// 使用 Intl.Segmenter 处理 Unicode（emoji、CJK 等）
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })

// "Hello 🌍" → ['H', 'e', 'l', 'l', 'o', ' ', '🌍']
// 而非 ['H', 'e', 'l', 'l', 'o', ' ', '\uD83C', '\uDF0D']
```