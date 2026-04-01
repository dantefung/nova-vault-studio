Title: MCP 工具 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html

Markdown Content:
MCP (Model Context Protocol) 工具家族实现与外部 MCP 服务器的交互，包含 4 个工具。

> **注意**: 以下所有工具的 `call()` 方法均为普通 `async` 函数，返回 `Promise<ToolResult>`，不是 AsyncGenerator。

## MCPTool — 调用 MCP 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html#mcptool-%E2%80%94-%E8%B0%83%E7%94%A8-mcp-%E5%B7%A5%E5%85%B7)

### 工作原理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html#%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)

MCPTool 是一个 **元工具**，它将外部 MCP 服务器提供的工具适配为 Claude Code 内置工具格式：

typescript

```
// MCP 工具包装在 services/mcp/client.ts 中完成
// 每个 MCP 服务器的工具通过 MCPServerConnection 注册
// 命名格式: mcp__{server}__{tool}

// 工具的 inputSchema 直接使用 MCP 服务器提供的 JSON Schema
// 无需 convertJsonSchemaToZod 转换

// 工具的 call() 通过 MCPServerConnection 的内部逻辑处理
// 权限检查由上层权限系统统一处理
```

### 命名约定 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html#%E5%91%BD%E5%90%8D%E7%BA%A6%E5%AE%9A)

MCP 工具名称格式: `mcp__{server}__{tool}`

```
mcp__filesystem__read_file     — filesystem 服务器的 read_file 工具
mcp__github__create_issue      — github 服务器的 create_issue 工具
mcp__postgres__query           — postgres 服务器的 query 工具
```

## ListMcpResourcesTool — 列出 MCP 资源 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html#listmcpresourcestool-%E2%80%94-%E5%88%97%E5%87%BA-mcp-%E8%B5%84%E6%BA%90)

typescript

```
const inputSchema = z.object({
  server: z.string().optional().describe('MCP 服务器名称，不指定则列出所有'),
})
```

执行时遍历指定或所有 MCP 客户端，获取各服务器提供的资源列表并格式化返回。

## ReadMcpResourceTool — 读取 MCP 资源 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html#readmcpresourcetool-%E2%80%94-%E8%AF%BB%E5%8F%96-mcp-%E8%B5%84%E6%BA%90)

typescript

```
const inputSchema = z.object({
  server: z.string().describe('MCP 服务器名称'),
  uri: z.string().describe('资源 URI'),
})
```

执行时查找指定名称的 MCP 客户端，通过 MCP 协议的 `resources/read` 方法读取指定 URI 的资源内容。

## McpAuthTool — MCP 认证 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html#mcpauthtool-%E2%80%94-mcp-%E8%AE%A4%E8%AF%81)

McpAuthTool 通过 `createMcpAuthTool()` 闭包创建，服务器信息通过闭包传入，无需输入参数。

typescript

`const inputSchema = z.object({})  // 无输入参数`

执行时启动 OAuth 认证流程，引导用户完成 MCP 服务器的授权。

## MCP 配置层级 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html#mcp-%E9%85%8D%E7%BD%AE%E5%B1%82%E7%BA%A7)

MCP 服务器配置有 **6 层合并**：

```
优先级（从低到高）:
1. 全局默认              — Claude Code 内置
2. 用户配置              — ~/.claude/settings.json
3. 项目配置              — .claude/settings.json
4. 企业托管配置          — 远程推送
5. 环境变量              — CLAUDE_MCP_SERVERS
6. CLI 参数              — --mcp-server
```

### 配置格式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html#%E9%85%8D%E7%BD%AE%E6%A0%BC%E5%BC%8F)

json

```
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": { "DEBUG": "true" }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    }
  },
  "allowedMcpServers": ["filesystem", "github"],
  "deniedMcpServers": ["untrusted-server"]
}
```
