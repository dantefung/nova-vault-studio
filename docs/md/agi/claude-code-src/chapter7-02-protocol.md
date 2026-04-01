Title: Bridge 协议 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/protocol.html

Markdown Content:
## Bridge 协议 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/protocol.html#bridge-%E5%8D%8F%E8%AE%AE)

Bridge 协议定义了 CLI 与 claude.ai 之间的通信格式。

> **重要说明**: 以下描述已根据实际代码修正。Bridge 使用 SDK 消息类型（`SDKMessage`、`SDKControlRequest`、`SDKControlResponse`），而非自定义的 `BridgeMessage` 格式。

## 消息格式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/protocol.html#%E6%B6%88%E6%81%AF%E6%A0%BC%E5%BC%8F)

typescript

```
// bridgeMessaging.ts — 类型守卫函数（非自定义消息类型）
// 实际使用 SDK 标准消息类型:
//   SDKMessage — SDK 消息
//   SDKControlRequest — SDK 控制请求
//   SDKControlResponse — SDK 控制响应
//
// 导出的类型守卫:
//   isSDKMessage()
//   isSDKControlResponse()
//   isSDKControlRequest()
//   isEligibleBridgeMessage()
```

## 握手流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/protocol.html#%E6%8F%A1%E6%89%8B%E6%B5%81%E7%A8%8B)

```
CLI                         claude.ai Web
 │                              │
 ├── Bridge 启用 ────────────→  │
 │                              │
 │  ←── Session 创建 ──────────┤
 │                              │
 ├── 连接确认 ───────────────→  │
 │   (workDir, capabilities)    │
 │                              │
 │  ←── 配置同步 ──────────────┤
 │   (permissions, tools)       │
 │                              │
 │      ═══ 双向通信 ═══       │
```

## 权限代理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/protocol.html#%E6%9D%83%E9%99%90%E4%BB%A3%E7%90%86)

typescript

```
// 实际类型为 BridgePermissionCallbacks，非 PermissionProxy
type BridgePermissionCallbacks = {
  sendRequest(): Promise<void>
  sendResponse(): Promise<void>
  cancelRequest(): Promise<void>
  onResponse(): Promise<BridgePermissionResponse>
}

interface BridgePermissionResponse {
  behavior: 'allow' | 'deny'
}
```

## 心跳机制 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/protocol.html#%E5%BF%83%E8%B7%B3%E6%9C%BA%E5%88%B6)

typescript

```
// 心跳通过 HTTP POST 实现（bridgeApi.heartbeatWork()）
// 而非 setInterval + WebSocket
// generalCapMs 在 bridgeMain.ts 中为 30_000
```

## 附件处理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/protocol.html#%E9%99%84%E4%BB%B6%E5%A4%84%E7%90%86)

typescript

```
// 实际类型为 Zod 推导类型，字段为:
interface InboundAttachment {
  file_uuid: string    // 文件 UUID
  file_name: string    // 文件名
}
```

实际函数名为 `extractInboundAttachments(msg)` 用于提取附件列表，`resolveInboundAttachments()` 用于解析附件内容。 其他导出: `prependPathRefs()`、`resolveAndPrepend()`。
