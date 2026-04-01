Title: Ink 渲染引擎 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/ui/ink-framework.html

Markdown Content:
Claude Code 使用 **自定义 fork 的 Ink** 作为终端 UI 渲染引擎，包含 ~96 个文件。

## Ink Fork 架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/ink-framework.html#ink-fork-%E6%9E%B6%E6%9E%84)

```
src/ink/
├── ink.ts                    # Ink 入口（render/measureElement 等）
├── reconciler.ts             # React Reconciler（DOM 操作适配）
├── renderer.ts               # 终端渲染器
├── output.ts                 # ANSI 输出生成
├── dom.ts                    # 虚拟 DOM 节点
├── instances.ts              # 组件实例管理
├── components/
│   ├── Box.tsx               # Flexbox 容器
│   ├── Text.tsx              # 文本渲染
│   ├── Spacer.tsx            # 弹性空间
│   ├── StdinContext.ts       # 标准输入上下文
│   ├── ScrollBox.tsx         # 可滚动容器
│   ├── RawAnsi.tsx           # 原始 ANSI 输出
│   ├── Link.tsx              # 链接组件
│   └── ...                   # 共 18 个组件文件
├── hooks/
│   ├── useInput.ts           # 键盘输入处理
│   ├── useStdin.ts           # stdin 访问
│   ├── useStdout.ts          # stdout 访问
│   ├── useFocus.ts           # 焦点管理
│   └── useFocusManager.ts   # 焦点管理器
└── styles.ts                 # 样式处理
```

## Yoga Layout 集成 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/ink-framework.html#yoga-layout-%E9%9B%86%E6%88%90)

`native-ts/yoga-layout/` 包含 Yoga N-API 绑定（Facebook 的 Flexbox 布局引擎，C++ → N-API → TypeScript）。

布局计算流程：

1.   根据 DOMNode 树创建 Yoga 节点树
2.   设置样式属性（flexDirection、alignItems、justifyContent、padding、margin 等）
3.   Yoga 计算布局
4.   提取每个节点的 `{ x, y, width, height }` 布局结果

## 渲染管道详解 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/ink-framework.html#%E6%B8%B2%E6%9F%93%E7%AE%A1%E9%81%93%E8%AF%A6%E8%A7%A3)

```
1. React render() → React Reconciler
   ↓
2. Reconciler → 创建/更新 DOMNode 树
   ↓
3. DOMNode 树 → Yoga 布局计算
   ↓
4. 布局结果 → Output 生成器
   ↓
5. Output → ANSI 转义序列
   ↓
6. ANSI → stdout.write()
```

### React Reconciler [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/ink-framework.html#react-reconciler)

`reconciler.ts` 实现了 React 18 Reconciler 适配，将 React 组件树映射到 DOMNode 虚拟 DOM。

主要功能：

*   **创建节点**：创建 `DOMNode`（含 `type`、`props`、`children`、`yogaNode`）
*   **创建文本节点**：创建 `TextNode`（`{ type: '#text', value }`）
*   **子节点管理**：追加/插入/移除子节点，同步更新 Yoga 布局树
*   **属性更新**：更新节点属性并重新应用样式

共约 30 个 Reconciler 方法实现。

### Box 组件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/ink-framework.html#box-%E7%BB%84%E4%BB%B6)

typescript

```
// 核心 Flexbox 容器
// 类型名为 Props（非 BoxProps）
type Props = Except<Styles, 'textWrap'> & {
  // Flexbox
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  flexGrow?: number
  flexShrink?: number
  flexBasis?: number | string
  flexWrap?: 'wrap' | 'nowrap'

  // Spacing
  padding?: number
  paddingX?: number
  paddingY?: number
  margin?: number
  marginX?: number
  marginY?: number

  // Sizing
  width?: number | string
  height?: number | string
  minWidth?: number
  minHeight?: number
  maxWidth?: number

  // Border
  borderStyle?: 'single' | 'double' | 'round' | 'bold' | 'classic'
  borderColor?: string
  borderTop?: boolean
  borderBottom?: boolean
  borderLeft?: boolean
  borderRight?: boolean

  // Visual
  overflowX?: 'visible' | 'hidden'
  overflowY?: 'visible' | 'hidden'
  display?: 'flex' | 'none'
}
```

### Text 组件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/ink-framework.html#text-%E7%BB%84%E4%BB%B6)

typescript

```
// 类型名为 Props（非 TextProps）
// bold 和 dim 互斥
type WeightProps =
  | { bold?: never; dim?: never }
  | { bold: boolean; dim?: never }
  | { dim: boolean; bold?: never }

type Props = {
  color?: string           // ANSI 颜色
  backgroundColor?: string
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  inverse?: boolean
  wrap?: 'wrap' | 'truncate' | 'truncate-start' | 'truncate-middle' | 'truncate-end'
} & WeightProps
```

```
> **注意**: 原版 Ink 的 `Static` 和 `Transform` 组件在此 fork 中**不存在**。

## 自定义 Ink 扩展

相比原版 Ink，自定义 fork 新增：

| 特性 | 说明 |
|------|------|
| **FullscreenLayout** | 全屏布局管理 |
| **VirtualList** | 虚拟滚动列表 |
| **Raw Input** | 原始键盘输入处理 |
| **Resize 监听** | 终端大小变化响应 |
| **性能优化** | 批量渲染、脏区域追踪 |
```
