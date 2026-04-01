Title: 设计系统 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/ui/design-system.html

Markdown Content:
## 设计系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/design-system.html#%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F)

Claude Code 的视觉设计系统包括主题、颜色和输出样式。

## 主题系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/design-system.html#%E4%B8%BB%E9%A2%98%E7%B3%BB%E7%BB%9F)

typescript

```
// 主题定义（src/utils/theme.ts）— 扁平结构，64 个 string 字段
type Theme = {
  // 基础 UI 色
  autoAccept: string
  bashBorder: string
  claude: string
  claudeShimmer: string
  permission: string
  permissionShimmer: string
  planMode: string
  ide: string
  promptBorder: string
  text: string
  inverseText: string
  inactive: string
  subtle: string
  suggestion: string
  remember: string
  background: string

  // 语义色
  success: string
  error: string
  warning: string
  merged: string

  // Diff 色
  diffAdded: string
  diffRemoved: string
  diffAddedDimmed: string
  diffRemovedDimmed: string
  diffAddedWord: string
  diffRemovedWord: string

  // Agent 色 (子代理专用)
  red_FOR_SUBAGENTS_ONLY: string
  blue_FOR_SUBAGENTS_ONLY: string
  // ... 共 8 种子代理颜色

  // TUI V2 色
  clawd_body: string
  userMessageBackground: string
  // ... 更多 UI 色

  // 彩虹色 (ultrathink 关键词高亮)
  rainbow_red: string
  // ... 共 7 色 + shimmer 变体
}
```

## 颜色差异引擎 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/design-system.html#%E9%A2%9C%E8%89%B2%E5%B7%AE%E5%BC%82%E5%BC%95%E6%93%8E)

typescript

```
// native-ts/color-diff/ — highlight.js 差异渲染的 TypeScript 移植
// 不包含独立的 nearestColor256 函数
// 终端颜色适配由 Ink 框架内部处理
```

## 输出样式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/design-system.html#%E8%BE%93%E5%87%BA%E6%A0%B7%E5%BC%8F)

typescript

```
// outputStyles/ — 输出格式化
// 输出样式定义在 src/constants/outputStyles.js 中
// 控制代码块、diff、消息等的渲染方式
```

## Markdown 渲染 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/design-system.html#markdown-%E6%B8%B2%E6%9F%93)

Markdown 渲染通过 `Markdown.tsx` 组件完成（`<Markdown text={content} />`），无独立的 `renderMarkdown` 函数。

## 终端适配 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/design-system.html#%E7%BB%88%E7%AB%AF%E9%80%82%E9%85%8D)

终端能力检测由 Ink 框架内部处理，无独立的 `TerminalCapabilities` 接口。颜色支持、Unicode 支持等通过环境变量和终端检测自动适配。
