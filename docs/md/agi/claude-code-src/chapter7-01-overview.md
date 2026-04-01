Title: Bridge 系统概览 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/

Markdown Content:
## Bridge 系统概览 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/#bridge-%E7%B3%BB%E7%BB%9F%E6%A6%82%E8%A7%88)

`src/bridge/` 包含 **31 个文件**，实现了 Claude Code CLI 与 claude.ai Web 界面之间的双向桥接。

## Bridge 架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/#bridge-%E6%9E%B6%E6%9E%84)

```
┌────────────────┐          ┌────────────────────┐
│  Claude Code   │ ←Bridge→ │    claude.ai Web    │
│  (CLI/本地)     │          │    (浏览器)          │
├────────────────┤          ├────────────────────┤
│ replBridge.ts  │ ←HTTP→   │ Bridge API         │
│ bridgeMain.ts  │ ←WS→     │ WebSocket          │
│ bridgeUI.ts    │          │ Frontend           │
└────────────────┘          └────────────────────┘
```

## 核心文件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/#%E6%A0%B8%E5%BF%83%E6%96%87%E4%BB%B6)

| 文件 | 功能 |
| --- | --- |
| `bridgeMain.ts` | Bridge 主逻辑 |
| `bridgeApi.ts` | HTTP API 客户端 |
| `bridgeConfig.ts` | Bridge 配置 |
| `bridgeEnabled.ts` | 开启/关闭控制 |
| `bridgeMessaging.ts` | 消息协议 |
| `bridgePermissionCallbacks.ts` | 权限代理 |
| `bridgeUI.ts` | Bridge UI 集成 |
| `bridgeStatusUtil.ts` | 状态工具 |
| `bridgeDebug.ts` | 调试工具 |
| `bridgePointer.ts` | 指针管理 |
| `replBridge.ts` | REPL Bridge 适配 |
| `replBridgeHandle.ts` | Bridge 句柄 |
| `replBridgeTransport.ts` | 传输层 |
| `initReplBridge.ts` | Bridge 初始化 |
| `remoteBridgeCore.ts` | 远程 Bridge 核心 |
| `createSession.ts` | 会话创建 |
| `sessionRunner.ts` | 会话运行器 |
| `sessionIdCompat.ts` | ID 兼容层 |
| `codeSessionApi.ts` | Code Session API |
| `inboundMessages.ts` | 入站消息处理 |
| `inboundAttachments.ts` | 入站附件处理 |
| `flushGate.ts` | 刷新门控 |
| `capacityWake.ts` | 容量唤醒 |
| `pollConfig.ts` | 轮询配置 |
| `pollConfigDefaults.ts` | 轮询默认值 |
| `jwtUtils.ts` | JWT 令牌工具 |
| `trustedDevice.ts` | 可信设备 |
| `workSecret.ts` | 工作密钥 |
| `types.ts` | 类型定义 |
| `debugUtils.ts` | 调试工具 |
| `envLessBridgeConfig.ts` | 无环境 Bridge 配置 |

## 文档导航 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/#%E6%96%87%E6%A1%A3%E5%AF%BC%E8%88%AA)

| 文档 | 涵盖内容 |
| --- | --- |
| [Bridge 协议](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/protocol.html) | 消息格式、握手、心跳 |
| [会话管理](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/session.html) | 创建、运行、恢复会话 |
| [传输层](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html) | HTTP API、WebSocket、轮询 |
