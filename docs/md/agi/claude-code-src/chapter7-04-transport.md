Title: Bridge 传输层 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html

Markdown Content:
本页目录

*   [传输方式对比](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#%E4%BC%A0%E8%BE%93%E6%96%B9%E5%BC%8F%E5%AF%B9%E6%AF%94 "传输方式对比")
*   [WebSocket 传输](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#websocket-%E4%BC%A0%E8%BE%93 "WebSocket 传输")
*   [SSE 传输](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#sse-%E4%BC%A0%E8%BE%93 "SSE 传输")
*   [Hybrid 传输](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#hybrid-%E4%BC%A0%E8%BE%93 "Hybrid 传输")
*   [轮询配置](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#%E8%BD%AE%E8%AF%A2%E9%85%8D%E7%BD%AE "轮询配置")
*   [JWT 工具](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#jwt-%E5%B7%A5%E5%85%B7 "JWT 工具")

## Bridge 传输层 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#bridge-%E4%BC%A0%E8%BE%93%E5%B1%82)

Bridge 支持多种传输方式，适应不同网络环境。

> **代码位置**: 传输实现在 `src/cli/transports/` 目录下（非 `src/bridge/`）。

## 传输方式对比 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#%E4%BC%A0%E8%BE%93%E6%96%B9%E5%BC%8F%E5%AF%B9%E6%AF%94)

| 传输 | 文件 | 位置 | 读取 | 写入 | 适用场景 |
| --- | --- | --- | --- | --- | --- |
| **WebSocket** | `WebSocketTransport.ts` | `cli/transports/` | WS | WS | 标准双向 |
| **SSE** | `SSETransport.ts` | `cli/transports/` | SSE | HTTP POST | 防火墙限制 |
| **Hybrid** | `HybridTransport.ts` | `cli/transports/` | WS | HTTP POST | 最佳可靠性 |

## WebSocket 传输 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#websocket-%E4%BC%A0%E8%BE%93)

`WebSocketTransport`（`src/cli/transports/WebSocketTransport.ts`）实现双向 WebSocket 通信。

特性：

*   使用 CircularBuffer 缓存消息
*   重连状态机，默认 10 分钟重连预算（`DEFAULT_RECONNECT_GIVE_UP_MS = 600_000`）
*   永久关闭码集合（`PERMANENT_CLOSE_CODES = new Set([1002, 4001, 4003])`）
*   睡眠检测（`SLEEP_DETECTION_THRESHOLD_MS`）
*   自动检测 Bun/Node 运行时并使用对应的 WebSocket 实现
*   心跳/keepalive 机制

## SSE 传输 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#sse-%E4%BC%A0%E8%BE%93)

`SSETransport`（`src/cli/transports/SSETransport.ts`）使用 SSE 读取 + HTTP POST 写入。

*   读取：使用 AbortController + fetch 架构（非 axios），通过 SSE 帧解析器处理流式数据
*   写入：HTTP POST 发送 JSON 消息

## Hybrid 传输 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#hybrid-%E4%BC%A0%E8%BE%93)

`HybridTransport`（`src/cli/transports/HybridTransport.ts`）继承自 `WebSocketTransport`（非组合模式）。

*   读取：通过 WebSocket（低延迟）
*   写入：通过 `SerialBatchEventUploader` HTTP POST（可靠性）

`SerialBatchEventUploader` 实现事件队列 → 延迟合批 → HTTP POST，失败重试，串行化保证顺序。

## 轮询配置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#%E8%BD%AE%E8%AF%A2%E9%85%8D%E7%BD%AE)

轮询间隔配置通过 `pollConfig.ts` 和 `pollConfigDefaults.ts` 管理。实际字段名包括 `session_keepalive_interval_v2_ms`、`non_exclusive_heartbeat_interval_ms` 等，与会话类型和状态相关。

## JWT 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/transport.html#jwt-%E5%B7%A5%E5%85%B7)

`jwtUtils.ts` 提供 JWT 解析工具，包括 `decodeJwtPayload` 和 `decodeJwtExpiry` 函数，以及 `createTokenRefreshScheduler()` 用于调度 token 刷新。
