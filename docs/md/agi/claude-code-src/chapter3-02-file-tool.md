Title: 文件操作工具 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html

Markdown Content:
## 文件操作工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C%E5%B7%A5%E5%85%B7)

文件操作是 Claude Code 最基础的能力，由三个工具组成：FileReadTool（读取）、FileEditTool（编辑）、FileWriteTool（写入）。

> **注意**: 以下所有工具的 `call()` 方法均为普通 `async` 函数，返回 `Promise<ToolResult>`，不是 AsyncGenerator。代码示例中的 `yield toolResult(...)` 为伪代码表示返回结果。

## FileReadTool — 文件读取 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#filereadtool-%E2%80%94-%E6%96%87%E4%BB%B6%E8%AF%BB%E5%8F%96)

### 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E8%BE%93%E5%85%A5-schema)

typescript

```
const inputSchema = z.object({
  file_path: z.string().describe('要读取的文件的绝对路径'),
  offset: z.number().optional().describe('起始行号（1-indexed）'),
  limit: z.number().optional().describe('读取的最大行数'),
})
```

### 执行逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E6%89%A7%E8%A1%8C%E9%80%BB%E8%BE%91)

FileReadTool 的 `call()` 方法执行流程：

1.   路径解析（`safeResolvePath`）
2.   二进制检测（基于文件扩展名）
3.   文件大小检查（超过阈值提示使用 offset/limit）
4.   读取文件内容
5.   记录时间戳（用于后续编辑冲突检测）
6.   添加行号并返回

### 权限 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E6%9D%83%E9%99%90)

*   `isReadOnly()` = `true`
*   `isConcurrencySafe()` = `true`
*   无需权限确认

## FileEditTool — 精确编辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#fileedittool-%E2%80%94-%E7%B2%BE%E7%A1%AE%E7%BC%96%E8%BE%91)

FileEditTool 使用 **查找-替换** 模式进行精确编辑。

### 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E8%BE%93%E5%85%A5-schema-1)

typescript

```
const inputSchema = z.strictObject({
  file_path: z.string().describe('要编辑的文件绝对路径'),
  old_string: z.string().describe('要替换的精确文本'),
  new_string: z.string().describe('替换后的新文本'),
  replace_all: z.boolean().default(false).optional()
    .describe('是否替换所有匹配。默认 false'),
})
```

### 执行逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E6%89%A7%E8%A1%8C%E9%80%BB%E8%BE%91-1)

FileEditTool 的 `call()` 方法执行流程：

1.   路径解析
2.   读取当前文件内容
3.   冲突检测——检查文件是否在上次读取后被外部修改
4.   查找匹配并执行替换
5.   写入文件
6.   更新时间戳
7.   生成 diff 并返回

### 权限 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E6%9D%83%E9%99%90-1)

*   `isReadOnly()` = `false`
*   `isDestructive()` = `true`
*   `isConcurrencySafe()` = `false` (文件系统竞争)
*   需要权限确认: `FileEdit(path_pattern)`

### UI 渲染 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#ui-%E6%B8%B2%E6%9F%93)

typescript

```
// FileEditToolDiff.tsx — 差异显示组件
type Props = {
  file_path: string
  edits: FileEdit[]  // from src/tools/FileEditTool/types.ts
}

type FileEdit = {
  old_string: string
  new_string: string
  replace_all: boolean
}

function FileEditToolDiff({ file_path, edits }: Props) {
  return (
    <StructuredDiff
      edits={edits}
      filePath={file_path}
      showLineNumbers
    />
  )
}
```

## FileWriteTool — 文件写入 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#filewritetool-%E2%80%94-%E6%96%87%E4%BB%B6%E5%86%99%E5%85%A5)

### 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E8%BE%93%E5%85%A5-schema-2)

typescript

```
const inputSchema = z.object({
  file_path: z.string().describe('要创建或覆写的文件绝对路径'),
  content: z.string().describe('文件的完整内容'),
})
```

### 执行逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E6%89%A7%E8%A1%8C%E9%80%BB%E8%BE%91-2)

FileWriteTool 的 `call()` 方法执行流程：

1.   路径解析
2.   内容大小检查
3.   确保目录存在
4.   写入文件
5.   更新时间戳

### 权限 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E6%9D%83%E9%99%90-2)

*   `isReadOnly()` = `false`
*   `isDestructive()` = `true`
*   需要权限确认: `FileWrite(path_pattern)`
*   新文件创建 vs 覆写有不同提示文本

## 文件操作安全机制 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C%E5%AE%89%E5%85%A8%E6%9C%BA%E5%88%B6)

### 路径安全验证 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E8%B7%AF%E5%BE%84%E5%AE%89%E5%85%A8%E9%AA%8C%E8%AF%81)

路径安全检查通过 `safeResolvePath` 等内部函数实现，主要规则：

1.   必须是绝对路径
2.   禁止路径遍历（`..`）
3.   必须在允许目录内（工作目录 + additionalDirectories）

### 读后写冲突检测 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html#%E8%AF%BB%E5%90%8E%E5%86%99%E5%86%B2%E7%AA%81%E6%A3%80%E6%B5%8B)

```
t=0:  FileRead("/src/app.ts")     → readFileTimestamps["/src/app.ts"] = t0
t=1:  用户在外部编辑 /src/app.ts   → mtime = t1
t=2:  FileEdit("/src/app.ts")     → 检测 mtime(t1) > lastRead(t0) → 拒绝！
                                    → "File has been modified since last read"
```