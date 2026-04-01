---
title: "Claude Code 深度技术文档"
site: "组件库"
source: "https://plain-sun-1ffe.hunshcn429.workers.dev/ui/components.html"
language: "zh-CN"
description: "Anthropic Claude Code v2.1.88 — 逐行逐目录的完整技术剖析"
word_count: 527
---

## 组件库

`src/components/` 包含 **389 个文件** ，构成 Claude Code 的完整终端 UI。

## 核心组件分类

### 消息渲染组件

| 组件 | 功能 |
| --- | --- |
| `MessageView` | 消息容器（路由到具体类型） |
| `UserMessage` | 用户消息渲染 |
| `AssistantMessage` | AI 响应渲染（流式） |
| `SystemMessage` | 系统消息渲染 |
| `ToolUseMessage` | 工具调用渲染 |
| `ToolResultMessage` | 工具结果渲染 |
| `StreamingText` | 流式文本渲染 |
| `MarkdownRenderer` | Markdown 渲染 |
| `CodeBlock` | 代码块（语法高亮） |

### 输入组件

| 组件 | 功能 |
| --- | --- |
| `TextInput` | 多行文本编辑器 |
| `Prompt` | 完整提示输入框 |
| `PromptInput` | 提示输入核心 |
| `AutocompleteMenu` | 自动补全菜单 |
| `SuggestionOverlay` | 建议浮层 |
| `SlashCommandMenu` | 斜杠命令菜单 |
| `FileAttachment` | 文件附件 |
| `ImageAttachment` | 图片附件 |

### 布局组件

| 组件 | 功能 |
| --- | --- |
| `FullscreenLayout` | 全屏三段布局（header/body/footer） |
| `StatusLine` | 底部状态栏 |
| `Footer` | 底部工具栏 |
| `Tabs` | 标签页 |
| `ScrollView` | 可滚动视图 |

### 对话框组件

| 组件 | 功能 |
| --- | --- |
| `PermissionDialog` | 权限确认对话框 |
| `ConfirmDialog` | 通用确认对话框 |
| `DiffDialog` | Diff 查看对话框 |
| `ExportDialog` | 导出对话框 |
| `ModelPicker` | 模型选择器 |
| `Settings` | 设置界面 |
| `HelpV2` | 帮助界面 |

### 数据展示组件

| 组件 | 功能 |
| --- | --- |
| `StructuredDiff` | 结构化差异显示 |
| `ColorDiff` | 着色差异显示 |
| `Table` | 表格渲染 |
| `ProgressBar` | 进度条 |
| `Spinner` | 加载指示器 |
| `Badge` | 标签 |
| `Notification` | 通知弹出 |

## PermissionDialog 深入

```typescript
typescript// 权限确认对话框 — UI 中最关键的交互组件
type Props = {
  title: string
  subtitle?: string
  color?: keyof Theme
  titleColor?: string
  innerPaddingX?: number
  workerBadge?: string
  titleRight?: ReactNode
  children: ReactNode
}

// 显示内容
// ┌─────────────────────────────────────────┐
// │ Claude wants to run:                     │
// │                                          │
// │   BashTool                               │
// │   rm -rf node_modules && npm install     │
// │                                          │
// │ [y] Allow  [n] Deny  [a] Always Allow    │
// └─────────────────────────────────────────┘
```

## StatusLine 深入

```typescript
typescript// 底部状态栏 — 持续显示关键信息
// 使用 StatusLineCommandInput 类型（from types/statusLine.ts）
// 显示模型、成本、token、代理状态、待办进度等信息

// ─── claude-sonnet-4-20250514 ── $0.42 ── 12.3K tokens ── Editing tests... ───
```

## 组件树示例

```
<App>
  <KeybindingProvider>
    <AppStateProvider>
      <ModalProvider>
          <REPL>
            <FullscreenLayout>
              <StatusLine />           {/* 顶部状态 */}
              <ScrollView>
                <Static items={messages}>
                  {msg => <MessageView message={msg} />}
                </Static>
                <StreamingMessage />   {/* 当前流式响应 */}
              </ScrollView>
              <PermissionDialog />     {/* 条件渲染 */}
              <Prompt>
                <TextInput />
                <AutocompleteMenu />
              </Prompt>
              <Footer />              {/* 底部快捷键提示 */}
            </FullscreenLayout>
          </REPL>
    </AppStateProvider>
  </KeybindingProvider>
</App>
```