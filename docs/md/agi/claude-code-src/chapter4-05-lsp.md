Title: LSP 语言服务器 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/services/lsp.html

Markdown Content:
Claude Code 集成了 Language Server Protocol (LSP) 客户端，提供代码智能分析能力。

## LSP 集成架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/lsp.html#lsp-%E9%9B%86%E6%88%90%E6%9E%B6%E6%9E%84)

```
Claude Code
  │
  ├── LSPClient (type，通过 createLSPClient() 工厂函数创建)
  │   └── sendRequest(method, params) → 通用 LSP 请求
  │
  └── LSPTool (暴露给 AI)
      └── 允许 AI 查询代码诊断信息
```

## LSPTool 集成 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/lsp.html#lsptool-%E9%9B%86%E6%88%90)

typescript

```
const inputSchema = z.object({
  operation: z.enum([
    'diagnostics', 'goToDefinition', 'findReferences', 'hover',
    'documentSymbol', 'workspaceSymbol', 'goToImplementation',
    'prepareCallHierarchy',
    // ... 共 9 个 operations
  ]),
  file_path: z.string(),
  line: z.number().optional(),
  column: z.number().optional(),
})
```

`call()` 方法根据 `operation` 参数映射到对应的 LSP method（如 `textDocument/diagnostic`、`textDocument/definition` 等），通过 `LSPClient.sendRequest()` 发送请求并格式化结果。

## 诊断信息格式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/lsp.html#%E8%AF%8A%E6%96%AD%E4%BF%A1%E6%81%AF%E6%A0%BC%E5%BC%8F)

typescript

```
interface Diagnostic {
  range: {
    start: { line: number; character: number }
    end: { line: number; character: number }
  }
  severity: 1 | 2 | 3 | 4  // Error, Warning, Information, Hint
  code?: string | number
  source?: string
  message: string
}
```
