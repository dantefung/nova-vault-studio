Title: Web 工具 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html

Markdown Content:
Web 工具提供网络访问能力：WebFetchTool（获取网页内容）和 WebSearchTool（网络搜索）。

> **注意**: 以下所有工具的 `call()` 方法均为普通 `async` 函数，返回 `Promise<ToolResult>`，不是 AsyncGenerator。

## WebFetchTool — 网页获取 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html#webfetchtool-%E2%80%94-%E7%BD%91%E9%A1%B5%E8%8E%B7%E5%8F%96)

### 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html#%E8%BE%93%E5%85%A5-schema)

typescript

```
const inputSchema = z.object({
  url: z.string().url().describe('要获取的 URL'),
  prompt: z.string().optional().describe('内容提取的指导提示'),
})
```

### 执行逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html#%E6%89%A7%E8%A1%8C%E9%80%BB%E8%BE%91)

1.   **URL 验证**：检查 URL 长度、禁止包含用户名/密码、hostname 格式验证
2.   **获取内容**：调用 `getURLMarkdownContent(url, abortController)`
    *   `http:` 自动升级为 `https:`
    *   `checkDomainBlocklist()` 检查域名黑名单
    *   `getWithPermittedRedirects()` 发起 HTTP 请求
    *   支持 LRU 缓存

3.   **内容转换**：HTML 使用 turndown 库转换为 Markdown
4.   **内容提取**：如有 `prompt` 参数，通过 `applyPromptToMarkdown()` 用 Haiku 模型提取关键信息

### URL 安全验证 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html#url-%E5%AE%89%E5%85%A8%E9%AA%8C%E8%AF%81)

`validateURL` 函数执行以下检查：

*   URL 长度限制
*   禁止包含用户名/密码
*   hostname 必须至少有两个部分
*   注意：无独立的私有 IP 检测

## WebSearchTool — 网络搜索 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html#websearchtool-%E2%80%94-%E7%BD%91%E7%BB%9C%E6%90%9C%E7%B4%A2)

### 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html#%E8%BE%93%E5%85%A5-schema-1)

typescript

```
const inputSchema = z.object({
  query: z.string().describe('搜索查询词'),
  count: z.number().optional().describe('返回结果数量，默认 5'),
})
```

### 执行逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html#%E6%89%A7%E8%A1%8C%E9%80%BB%E8%BE%91-1)

WebSearchTool 不直接调用搜索 API，而是通过 Claude 模型的服务端工具执行搜索：

1.   构建搜索工具 schema（`web_search_20250305`，含 `allowed_domains`/`blocked_domains`，`max_uses: 8`）
2.   调用 `queryModelWithStreaming()`，将搜索工具作为 `extraToolSchemas` 传入
3.   流式处理事件：`server_tool_use` 追踪工具调用，`web_search_tool_result` 报告搜索结果数量，`assistant` 收集 content blocks
4.   通过 `makeOutputFromSearchResponse()` 解析并格式化结果

### 权限 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html#%E6%9D%83%E9%99%90)

两个 Web 工具都需要网络访问权限：

| 属性 | WebFetchTool | WebSearchTool |
| --- | --- | --- |
| `isReadOnly()` | `true` | `true` |
| `isDestructive()` | `false` | `false` |
| `isConcurrencySafe()` | `true` | `true` |
| 权限规则 | `WebFetch(url_pattern)` | `WebSearch` |
