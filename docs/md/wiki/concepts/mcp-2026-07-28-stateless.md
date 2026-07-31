---
title: "MCP 2026-07-28 无状态版本"
date: "2026-07-31"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/nMtdfXsBMAcDJ7WESU2JPQ"
---

# MCP 2026-07-28 无状态版本

MCP 2026-07-28 版本是 MCP 诞生以来最大的一次变动——从有会话的双向 RPC 协议，变成更接近 Web 原生的无状态请求/响应协议。

---

## 核心变化

### 移除项
- `initialize`/`initialized` 握手
- `Mcp-Session-Id`
- 协议层隐含的长生命周期会话

### 替代方案
- 协议版本、客户端身份和能力改为通过每次请求的 `_meta` 传递
- 每个请求可被独立理解，由普通轮询负载均衡分发到任意实例
- 新增 `server/discover` 端点查询服务端能力（可选调用）

---

## MRTR（Multi Round-Trip Requests）

解决无状态后服务端无法主动向客户端提问的问题：

1. Client 调用工具
2. Server 返回 `resultType: "input_required"`，附上 `inputRequests` 和 `requestState`
3. Client 收集回答后，使用原 JSON-RPC ID 重试，带上 `inputResponses` 和 `requestState`
4. 任意 Server 实例都能继续处理

新增 `resultType`：`complete`（正常完成）、`input_required`（需要补充输入）、`task`（Tasks 扩展）

---

## 其他重要更新

| 特性 | 说明 |
|------|------|
| 请求路由 | Streamable HTTP 携带 `Mcp-Method` 和 `Mcp-Name`，网关无需解析 Body |
| 缓存 | `tools/list` 等结果增加 `ttlMs` 与 `cacheScope`，列表建议确定性顺序 |
| 按需订阅 | `subscriptions/listen` 明确订阅变化，通过 SSE 流接收通知 |
| Tasks 扩展 | 正式从实验性核心迁移到 `io.modelcontextprotocol/tasks` 扩展，支持 `tools/call` 后台任务 |
| 安全 | OAuth Issuer 校验、凭据与签发方绑定，弃用 Dynamic Client Registration |
| 弃用 | Roots、Sampling、Logging、旧 HTTP+SSE Transport，保留 12 个月迁移窗口 |

---

## 核心思想

> MCP 从面向连接的工具协议，走向一套更接近 Web 原生、适合大规模部署的 Agent 基础协议。

无状态不等于应用不能保存状态——关键是"把隐藏在传输层 Session 中的状态，变成协议之外显式传递的业务句柄"。

---

## 交叉引用

- [[concepts/mcp-protocol-rpc]] — MCP 协议选型（JSON-RPC vs gRPC）
- [[MCP]] — MCP 核心概念

> 来源：haoran，微信公众号，2026-07-30