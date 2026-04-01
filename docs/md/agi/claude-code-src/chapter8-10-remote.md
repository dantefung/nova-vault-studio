Title: 远程会话管理 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html

Markdown Content:
本页目录

*   [架构](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#%E6%9E%B6%E6%9E%84 "架构")
*   [RemoteSessionManager.ts — 核心管理器](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#remotesessionmanager-ts-%E2%80%94-%E6%A0%B8%E5%BF%83%E7%AE%A1%E7%90%86%E5%99%A8 "RemoteSessionManager.ts — 核心管理器")
*   [SessionsWebSocket.ts — WebSocket 客户端](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#sessionswebsocket-ts-%E2%80%94-websocket-%E5%AE%A2%E6%88%B7%E7%AB%AF "SessionsWebSocket.ts — WebSocket 客户端")
*   [sdkMessageAdapter.ts — 消息转换](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#sdkmessageadapter-ts-%E2%80%94-%E6%B6%88%E6%81%AF%E8%BD%AC%E6%8D%A2 "sdkMessageAdapter.ts — 消息转换")
*   [remotePermissionBridge.ts — 权限桥接](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#remotepermissionbridge-ts-%E2%80%94-%E6%9D%83%E9%99%90%E6%A1%A5%E6%8E%A5 "remotePermissionBridge.ts — 权限桥接")
*   [远程 vs 本地对比](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#%E8%BF%9C%E7%A8%8B-vs-%E6%9C%AC%E5%9C%B0%E5%AF%B9%E6%AF%94 "远程 vs 本地对比")

## 远程会话管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#%E8%BF%9C%E7%A8%8B%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86)

`src/remote/` 包含 **4 个文件**，实现通过 CCR (Claude Code Remote) 的远程会话管理。

## 架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#%E6%9E%B6%E6%9E%84)

```
┌────────────────┐      ┌──────────────┐      ┌──────────────┐
│   本地客户端    │ ←WS→ │   CCR 服务    │ ←──→ │  远程 Worker  │
│ (浏览器/CLI)   │      │ (WebSocket)   │      │ (无头 Claude) │
└────────────────┘      └──────────────┘      └──────────────┘
```

## RemoteSessionManager.ts — 核心管理器 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#remotesessionmanager-ts-%E2%80%94-%E6%A0%B8%E5%BF%83%E7%AE%A1%E7%90%86%E5%99%A8)

typescript

```
// 权限响应（判别联合，字段名为 behavior 而非 type）
type RemotePermissionResponse =
  | { behavior: 'allow'; updatedInput: Record<string, unknown> }
  | { behavior: 'deny'; message: string }
```

`RemoteSessionManager`（`src/remote/RemoteSessionManager.ts`）管理与 CCR 的 WebSocket 连接。主要功能：

*   **连接**：通过 `SessionsWebSocket` 建立 WS 连接
*   **消息路由**：处理 `control_request`、`control_cancel_request`、`control_response` 等控制消息，以及通过 `convertSDKMessage` 转换的 SDK 消息
*   **发送消息**：通过 `sendEventToRemoteSession` 发送
*   **权限响应**：通过 WS 发送 `control_response`
*   **取消会话**：发送 `interrupt` 消息

回调接口包括 `onMessage`、`onPermissionRequest`、`onPermissionCancelled`、`onConnected`、`onDisconnected`、`onReconnecting`、`onError`。

## SessionsWebSocket.ts — WebSocket 客户端 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#sessionswebsocket-ts-%E2%80%94-websocket-%E5%AE%A2%E6%88%B7%E7%AB%AF)

`SessionsWebSocket` 连接到 CCR 的 `/v1/sessions/ws/{id}/subscribe` 端点。

特性：

*   构造器使用 4 个位置参数（`sessionId`、`orgUuid`、`getAccessToken`、`callbacks`）
*   重连策略与心跳机制
*   永久关闭码判断（4003 Unauthorized 等）
*   自动检测 Bun/Node.js 运行时并使用对应的 WebSocket 实现

## sdkMessageAdapter.ts — 消息转换 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#sdkmessageadapter-ts-%E2%80%94-%E6%B6%88%E6%81%AF%E8%BD%AC%E6%8D%A2)

`convertSDKMessage`（`src/remote/sdkMessageAdapter.ts`）将 SDK 消息转换为内部消息格式。

返回类型为 `ConvertedMessage`，包含三种可能：

*   `{ type: 'message'; message: Message }` — 转换成功
*   `{ type: 'stream_event'; event: StreamEvent }` — 流式事件
*   `{ type: 'ignored' }` — 忽略

支持的 SDK 消息类型包括 `assistant`、`user`、`stream_event`、`result`、`system` 等。

工具函数：`isSessionEndMessage`、`isSuccessResult`、`getResultText`。

## remotePermissionBridge.ts — 权限桥接 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#remotepermissionbridge-ts-%E2%80%94-%E6%9D%83%E9%99%90%E6%A1%A5%E6%8E%A5)

为远程权限 UI 创建合成消息。`createSyntheticAssistantMessage` 生成看起来像助手工具调用的合成消息，用于在远程 UI 中展示权限请求。`createToolStub` 为本地不存在的 MCP 工具创建最小存根以支持权限 UI。

## 远程 vs 本地对比 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html#%E8%BF%9C%E7%A8%8B-vs-%E6%9C%AC%E5%9C%B0%E5%AF%B9%E6%AF%94)

| 方面 | 本地 (Direct-Connect) | 远程 (CCR) |
| --- | --- | --- |
| 连接 | 本地 WS | CCR WebSocket |
| 消息发送 | WS 直发 | HTTP POST (teleport API) |
| 权限响应 | WS 直发 | WS 直发 |
| 重连 | 10 分钟预算 | 5 次 × 2 秒间隔 |
| 认证 | Bearer token | 动态 OAuth token |
| 观察模式 | 不支持 | `viewerOnly` |
