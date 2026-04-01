Title: 搜索工具 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html

Markdown Content:
## 搜索工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E6%90%9C%E7%B4%A2%E5%B7%A5%E5%85%B7)

搜索工具家族包含 GlobTool（路径搜索）、GrepTool（内容搜索）和 ToolSearchTool（工具搜索），全部为只读操作。

> **注意**: 以下所有工具的 `call()` 方法均为普通 `async` 函数，返回 `Promise<ToolResult>`，不是 AsyncGenerator。代码示例中的 `yield toolResult(...)` 为伪代码表示返回结果。

## GlobTool — 文件路径搜索 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#globtool-%E2%80%94-%E6%96%87%E4%BB%B6%E8%B7%AF%E5%BE%84%E6%90%9C%E7%B4%A2)

### 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E8%BE%93%E5%85%A5-schema)

typescript

```
const inputSchema = z.strictObject({
  pattern: z.string().describe('Glob 模式（如 "**/*.ts"）'),
  path: z.string().optional().describe('搜索起始目录，默认为工作目录'),
})
```

### 执行逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E6%89%A7%E8%A1%8C%E9%80%BB%E8%BE%91)

1.   解析输入的 `pattern` 和 `path`，默认以工作目录为起点
2.   通过 `getFileReadIgnorePatterns(toolPermissionContext)` 获取忽略模式（基于 deny read 规则动态生成）
3.   调用 `glob()` 函数，内部使用 ripgrep `--files --glob` 模式列举文件
4.   结果限制为 100 个文件，超出时标记 truncated

### 忽略模式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E5%BF%BD%E7%95%A5%E6%A8%A1%E5%BC%8F)

typescript

```
// 不是硬编码常量，而是由权限系统动态生成
const ignorePatterns = getFileReadIgnorePatterns(toolPermissionContext)
// 返回 Map<string | null, string[]>  — 基于 deny read 规则
const normalized = normalizePatternsToPath(ignorePatterns, searchPath)
```

## GrepTool — 文件内容搜索 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#greptool-%E2%80%94-%E6%96%87%E4%BB%B6%E5%86%85%E5%AE%B9%E6%90%9C%E7%B4%A2)

### 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E8%BE%93%E5%85%A5-schema-1)

typescript

```
const inputSchema = z.strictObject({
  pattern: z.string().describe('搜索的正则表达式模式'),
  path: z.string().optional().describe('搜索起始目录'),
  glob: z.string().optional().describe('文件过滤模式 (rg --glob)，如 "*.ts"'),
  output_mode: z.enum(['content', 'files_with_matches', 'count']).optional(),
  '-B': z.number().optional(),   // 匹配前的上下文行数
  '-A': z.number().optional(),   // 匹配后的上下文行数
  '-C': z.number().optional(),   // context 别名
  context: z.number().optional(), // 匹配前后的上下文行数
  '-n': z.boolean().optional(),  // 显示行号，默认 true
  '-i': z.boolean().optional(),  // 忽略大小写
  type: z.string().optional(),   // 文件类型 (rg --type)，如 js, py
  head_limit: z.number().optional(), // 限制输出行数，默认 250
  offset: z.number().optional(),     // 跳过前 N 行/条目
  multiline: z.boolean().optional(), // 多行模式 (rg -U)
})
```

### 执行逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E6%89%A7%E8%A1%8C%E9%80%BB%E8%BE%91-1)

1.   解析输入的 `pattern`、`path`、`glob` 等参数
2.   根据输入参数构建 ripgrep (`rg`) 命令参数
3.   调用 `ripGrep()`（来自 `utils/ripgrep.ts`）执行搜索
4.   返回格式化结果

### 输出格式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E8%BE%93%E5%87%BA%E6%A0%BC%E5%BC%8F)

```
src/tools/BashTool/index.ts
  42: const DANGEROUS_PATTERNS = [
  43:   { pattern: /rm\s+(-rf?|--recursive)/, reason: '递归删除' },
  44:   { pattern: /sudo\s/, reason: '提权操作' },

src/tools/BashTool/helpers.ts
  15: function checkDangerousPatterns(command: string) {
  16:   for (const { pattern, reason } of DANGEROUS_PATTERNS) {
```

## ToolSearchTool — 工具搜索 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#toolsearchtool-%E2%80%94-%E5%B7%A5%E5%85%B7%E6%90%9C%E7%B4%A2)

### 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E8%BE%93%E5%85%A5-schema-2)

typescript

```
const inputSchema = z.object({
  query: z.string().describe('搜索查询词。使用 "select:<tool_name>" 直接选择，或关键词搜索'),
  max_results: z.number().optional().default(5)
    .describe('返回结果数量，默认 5'),
})
```

### 执行逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E6%89%A7%E8%A1%8C%E9%80%BB%E8%BE%91-2)

使用关键词评分和正则匹配搜索可用工具。支持 `select:<name>` 直接选择模式。无独立的 `fuzzyMatch` 函数。

## 搜索性能优化 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html#%E6%90%9C%E7%B4%A2%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)

| 优化 | 工具 | 效果 |
| --- | --- | --- |
| **ripgrep (rg)** | GrepTool | 比 grep 快 10-100x，支持 PCRE2 |
| **结果上限** | 全部 | 防止超长输出 |
| **忽略列表** | GlobTool | 跳过 node_modules 等大目录 |
| **文件大小限制** | GrepTool | 跳过大于 1MB 的文件 |
| **并发安全** | 全部 | `isConcurrencySafe()=true`，可并行搜索 |