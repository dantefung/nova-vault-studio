Title: CLI 入口点 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html

Markdown Content:
Claude Code 有多个入口点，适应不同运行模式。

## 入口文件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6)

```
src/entrypoints/
├── cli.tsx          # 主 CLI 入口
├── mcp.ts           # MCP 服务器模式入口
├── init.ts          # 非交互式初始化
├── sdk/             # SDK 模式入口
│   ├── index.ts
│   └── types.ts
```

## 主入口 `cli.tsx`[​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#%E4%B8%BB%E5%85%A5%E5%8F%A3-cli-tsx)

CLI 入口是所有交互式使用的起点：

typescript

```
// cli.tsx 核心流程
// 注意：实际代码是一个 async function main()，
// 内部通过 if 分支处理各种模式，而非独立函数
async function main() {
  const args = process.argv.slice(2)

  // 1. 快速路径 (--version, --daemon, --bridge 等)
  if (args.length === 1 && (args[0] === '--version' || ...)) return

  // 2. 认证检查
  // 3. 模式分发 (-p / --resume / REPL)
  // 全部内联逻辑，无 handleSpecialFlags/parseArgs/runPrint/runResume/runRepl 等函数
}
```

### 关键 CLI 参数 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#%E5%85%B3%E9%94%AE-cli-%E5%8F%82%E6%95%B0)

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `--print`, `-p` | string | 非交互式模式 |
| `--resume`, `-r` | string? | 恢复会话 |
| `--model` | string | 覆盖模型 |
| `--permission-mode` | string | 权限模式 |
| `--output-format` | string | 输出格式 (text/json/stream-json) |
| `--max-turns` | number | 最大轮次 |
| `--system-prompt` | string | 自定义系统提示 |
| `--append-system-prompt` | string | 追加系统提示 |
| `--allowedTools` | string[] | 允许的工具 |
| `--disallowedTools` | string[] | 禁用的工具 |
| `--add-dir` | string[] | 额外工作目录 |
| `--mcp-config` | string | MCP 配置文件路径 |
| `--dangerouslySkipPermissions` | boolean | 跳过所有权限 |
| `--verbose` | boolean | 详细输出 |
| `--debug` | boolean | 调试模式 |

## MCP 服务器入口 `mcp.ts`[​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#mcp-%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%85%A5%E5%8F%A3-mcp-ts)

将 Claude Code 作为 MCP 服务器暴露：

typescript

```
// mcp.ts
// 注意：使用 @modelcontextprotocol/sdk 的 Server，非 StdioMCPServer
async function startMCPServer(cwd: string, debug: boolean, verbose: boolean) {
  const server = new Server(
    { name: 'claude/tengu', version: MACRO.VERSION },
    // ...
  )

  // 通过 getTools(toolPermissionContext) 获取工具
  // 而非 assembleToolPool()

  await server.connect(transport)  // stdin/stdout 通道
}
```

## SDK 入口 `sdk/index.ts`[​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#sdk-%E5%85%A5%E5%8F%A3-sdk-index-ts)

提供编程接口供其他应用集成：

typescript

```
// sdk/ 目录实际文件:
// controlSchemas.ts, coreSchemas.ts, coreTypes.ts
// 注意：SDKSession 类型定义在 src/entrypoints/agentSdkTypes.ts，非 sdk/ 目录

// agentSdkTypes.ts
export type SDKSession = {
  // ... 会话类型定义
}

// 创建会话函数名为 unstable_v2_createSession
export function unstable_v2_createSession(_options: SDKSessionOptions): SDKSession
```

## CLI 处理器目录 `cli/handlers/`[​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#cli-%E5%A4%84%E7%90%86%E5%99%A8%E7%9B%AE%E5%BD%95-cli-handlers)

| 处理器 | 功能 |
| --- | --- |
| `agents.ts` | 列出配置的 Agent（含覆盖/遮蔽显示） |
| `auth.ts` | OAuth 登录流程，SSO 支持 |
| `autoMode.ts` | 自动模式配置/导出/审查 |
| `mcp.tsx` | MCP 服务器 CRUD + 健康检查 |
| `plugins.ts` | 插件安装/启用/禁用/更新/市场 |
| `util.tsx` | setupToken、doctor、install（React/Ink 渲染） |

## CLI Transport 层 `cli/transports/`[​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#cli-transport-%E5%B1%82-cli-transports)

| 文件 | 功能 |
| --- | --- |
| `Transport.ts` | Transport 接口定义 |
| `WebSocketTransport.ts` | WS 读写，10 分钟重连预算 |
| `SSETransport.ts` | SSE 读取 + HTTP POST 写入 |
| `HybridTransport.ts` | WS 读取 + HTTP POST 写入 |
| `ccrClient.ts` | CCR v2 客户端，心跳、epoch |
| `SerialBatchEventUploader.ts` | 串行批量上传器 |
| `WorkerStateUploader.ts` | Worker 状态合并上传 |
| `transportUtils.ts` | 自动选择传输方式 |

## 结构化 IO [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#%E7%BB%93%E6%9E%84%E5%8C%96-io)

`structuredIO.ts`（约 300 行）实现 NDJSON stdin/stdout 协议，用于 SDK 模式的结构化通信。

主要职责：

*   通过 `WriteStream`/`ReadStream` 进行 NDJSON 格式读写
*   权限请求/响应通过 `control_request`/`control_response` 类型的消息传递
*   出站事件通过 `stream_event` 类型消息发送

## RemoteIO [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html#remoteio)

`remoteIO.ts` 继承自 StructuredIO，用于远程模式下的双向流式传输。

主要增强：

*   WebSocket/SSE 传输支持
*   CCR v2 客户端集成
*   Keep-alive 心跳维护
