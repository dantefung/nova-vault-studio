Title: Connect 服务器 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html

Markdown Content:
本页目录

*   [架构](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#%E6%9E%B6%E6%9E%84 "架构")
*   [types.ts — 类型定义](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#types-ts-%E2%80%94-%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89 "types.ts — 类型定义")
*   [createDirectConnectSession.ts — 会话创建](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#createdirectconnectsession-ts-%E2%80%94-%E4%BC%9A%E8%AF%9D%E5%88%9B%E5%BB%BA "createDirectConnectSession.ts — 会话创建")
*   [directConnectManager.ts — 会话管理器](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#directconnectmanager-ts-%E2%80%94-%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86%E5%99%A8 "directConnectManager.ts — 会话管理器")
*   [使用场景](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF "使用场景")

## Direct-Connect 服务器 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#direct-connect-%E6%9C%8D%E5%8A%A1%E5%99%A8)

`src/server/` 包含 **3 个文件**，实现本地 Direct-Connect 服务器模式。

## 架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#%E6%9E%B6%E6%9E%84)

```
┌─────────────────────┐
│   SDK 客户端         │
│   (编程接口调用)     │
└────────┬────────────┘
         │ HTTP POST /sessions
         ▼
┌─────────────────────┐
│ Direct-Connect Server│
│   (本地 HTTP)        │
│ ┌─────────────────┐ │
│ │ Session Manager  │ │
│ │ (WebSocket)      │ │
│ └─────────────────┘ │
└─────────────────────┘
```

## types.ts — 类型定义 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#types-ts-%E2%80%94-%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89)

typescript

```
// 连接响应
const connectResponseSchema = z.object({
  session_id: z.string(),
  ws_url: z.string(),
  work_dir: z.string().optional(),
})

// 服务器配置
interface ServerConfig {
  port: number
  host: string
  authToken: string
  unix?: string              // Unix socket 路径
  idleTimeoutMs?: number     // 空闲超时
  maxSessions?: number       // 最大会话数
  workspace?: string         // 默认工作目录
}

// 会话状态
type SessionState =
  | 'starting'
  | 'running'
  | 'detached'
  | 'stopping'
  | 'stopped'

// 会话信息
interface SessionInfo {
  id: string
  status: SessionState
  createdAt: number
  workDir: string
  process: ChildProcess
  sessionKey?: string
}

// 会话索引条目
interface SessionIndexEntry {
  sessionId: string
  transcriptSessionId: string
  cwd: string
  permissionMode?: string
  createdAt: number
  lastActiveAt: number
}

// 会话索引
type SessionIndex = Record<string, SessionIndexEntry>
```

## createDirectConnectSession.ts — 会话创建 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#createdirectconnectsession-ts-%E2%80%94-%E4%BC%9A%E8%AF%9D%E5%88%9B%E5%BB%BA)

`createDirectConnectSession`（`src/server/createDirectConnectSession.ts`）创建 Direct-Connect 会话。

主要流程：

1.   HTTP POST 到 `/sessions` 端点
2.   验证响应（失败时抛出 `DirectConnectError`）
3.   解析 `connectResponseSchema` 响应，返回 `{ config, workDir }`

参数包括 `serverUrl`、`authToken`（可选）、`cwd`、`dangerouslySkipPermissions`。

## directConnectManager.ts — 会话管理器 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#directconnectmanager-ts-%E2%80%94-%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86%E5%99%A8)

`DirectConnectSessionManager`（`src/server/directConnectManager.ts`）管理与 Direct-Connect 服务器的 WebSocket 连接。

内部使用 `jsonParse` 解析、`isStdoutMessage` 检查和逐行 NDJSON 解析。

主要功能：

*   **连接**：建立 WebSocket 连接并路由消息
*   **发送消息**：发送用户消息
*   **权限响应**：回复权限请求
*   **中断**：发送中断信号

回调接口包括 `onMessage`、`onPermissionRequest`、`onConnected`、`onDisconnected`、`onError`。

## 使用场景 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html#%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF)

| 场景 | 说明 |
| --- | --- |
| **SDK 集成** | 其他应用通过 HTTP/WS 调用 Claude Code |
| **远程开发** | SSH 环境中运行 Claude Code 服务器 |
| **多会话** | 同时管理多个独立会话 |
| **无头模式** | 不需要终端 UI 的自动化场景 |
