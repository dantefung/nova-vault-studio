Title: MCP 协议服务 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/services/mcp-service.html

Markdown Content:
Claude Code 实现了完整的 MCP (Model Context Protocol) 客户端，管理与外部 MCP 服务器的连接、工具发现和资源访问。

## MCP 客户端架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/mcp-service.html#mcp-%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%9E%B6%E6%9E%84)

```
通过配置发现的 MCP 服务器（无单例 MCPManager）
  ├── MCPServerConnection[filesystem]  → stdio 连接 → npx @modelcontextprotocol/server-filesystem
  ├── MCPServerConnection[github]      → stdio 连接 → npx @modelcontextprotocol/server-github
  ├── MCPServerConnection[postgres]    → SSE 连接  → https://postgres-mcp.example.com
  └── MCPServerConnection[custom]      → stdio 连接 → ./custom-mcp-server
```

## 配置发现 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/mcp-service.html#%E9%85%8D%E7%BD%AE%E5%8F%91%E7%8E%B0)

MCP 服务器配置从 **多层** 来源合并（优先级从低到高）：

1.   **用户级配置** (`~/.claude/settings.json` 中的 `mcpServers`)
2.   **项目级配置** (`.claude/settings.json` 中的 `mcpServers`)
3.   **企业托管配置** (远程托管设置中的 `mcpServers`)
4.   **环境变量** (`CLAUDE_MCP_SERVERS` JSON)
5.   **CLI 参数** (命令行指定的 MCP 服务器)

合并策略：后来者覆盖同名服务器。配置加载通过内部设置加载机制实现，非单独的 `loadSettings('global')` 函数。

## MCPServerConnection 生命周期 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/mcp-service.html#mcpserverconnection-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

typescript

```
// 实际是 type，非 class——通过配置创建
type MCPServerConnection = {
  name: string
  transport: 'stdio' | 'sse'
  status: 'connecting' | 'connected' | 'disconnected' | 'error'

  // 连接流程示意（简化）:
  // 1. 启动进程或建立 SSE 连接
  //    stdio: spawn(command, args, { env })
  //    sse: 使用 SDK 的 SSEClientTransport（非自定义 SSEClient）
  //
  // 2. 初始化握手
  //    sendRequest('initialize', { protocolVersion, capabilities })
  //
  // 3. 发现工具
  //    sendRequest('tools/list')
  //
  // 4. 发现资源
  //    sendRequest('resources/list')
}
```

## 工具注册 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/mcp-service.html#%E5%B7%A5%E5%85%B7%E6%B3%A8%E5%86%8C)

MCP 工具通过配置自动注册，每个 MCP 工具使用 `buildTool()` 构建。命名规则：`mcp__<serverName>__<toolName>`。

JSON Schema 与 Zod 之间的转换通过内部机制处理，工具调用通过 MCP SDK 的连接方法执行，结果中的不同类型（text、image 等）分别处理。

## MCP OAuth 认证 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/mcp-service.html#mcp-oauth-%E8%AE%A4%E8%AF%81)

`src/services/mcpAuth/` 目录包含 MCP 服务器的 OAuth 2.0 认证流程实现。流程为：获取认证 URL、打开浏览器、等待回调、交换 token、存储 token。

## 健康检查 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/mcp-service.html#%E5%81%A5%E5%BA%B7%E6%A3%80%E6%9F%A5)

MCP 连接状态通过 `MCPServerConnection` 的 `status` 字段跟踪（`'connecting' | 'connected' | 'disconnected' | 'error'`）。连接异常时自动重试或标记为 error 状态。
