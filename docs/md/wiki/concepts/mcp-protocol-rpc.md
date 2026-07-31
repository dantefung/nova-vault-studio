---
title: "MCP 协议选型：JSON-RPC vs gRPC"
date: "2026-07-31"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/IkiF31FcXDrd2zmliufxJQ"
---

# MCP 协议选型：JSON-RPC vs gRPC

Model Context Protocol（MCP）选择 JSON-RPC 2.0 而非 gRPC 等二进制 RPC 框架，是一组经过反复权衡的取舍。

---

## MCP 两层架构

| 层级 | 职责 | 技术 |
|------|------|------|
| 数据层 | "说什么" | JSON-RPC 2.0 消息结构、tools/resources/prompts 原语 |
| 传输层 | "怎么送" | stdio / Streamable HTTP / WebSocket |

**关键**：同一套 JSON-RPC 消息格式可以跑在不同传输通道上，这层解耦是后续所有取舍的地基。

---

## 四个选型理由

### 1. stdio 优先：gRPC 进不来

MCP 主流用法是将 server 作为本地进程，通过 stdio 对话。JSON-RPC 是纯文本，一根管道就能跑通——不占端口、不碰防火墙、不需要证书。gRPC 绑死 HTTP/2，需要配网络栈、端口、TLS，对本地小脚本而言是杀鸡用牛刀。

### 2. 瓶颈不在序列化

AI 场景的真正瓶颈是大模型推理时间（2-3 秒级），协议序列化省下的 2-3 毫秒可以忽略不计。MCP 明确用"原始二进制性能"换回"灵活性和易用性"。

### 3. 门槛决定生态

JSON-RPC 任何语言都自带 JSON 库，拼字典打印出去就是合法请求。gRPC 要求先写 `.proto` schema，再用 `protoc` 编译器生成桩代码——凭空多出一个 build 步骤，对快速试错的 AI 开发者是直接劝退的门槛。

### 4. JSON 是大模型和调试的母语

- 大模型天生擅长生成/解析 JSON，MCP 的工具定义、资源内容本身就是 JSON 结构化数据，"线上格式"和"AI 格式"是同一种东西
- 调试时 JSON 报文是纯文本，肉眼可读；gRPC 二进制报文需要 Wireshark 解码

---

## JSON-RPC 支撑有状态协议

MCP 是有状态协议（连接管理、能力协商、服务端主动推送），JSON-RPC 完全可以承载：

- **生命周期管理**：客户端发 `initialize` 请求，带 `protocolVersion` 和 `capabilities`，服务端回应支持的 capabilities
- **通知机制**：`notification` 是没有 `id` 的 JSON-RPC 消息，对端不回也不该回——正好用于 `tools/list_changed` 等主动推送

---

## 交叉引用

- [[concepts/mcp-2026-07-28-stateless]] — MCP 2026-07-28 无状态版本更新
- [[MCP]] — MCP 核心概念
- [[matt-pocock-on-ramp]] — on-ramp 输入分类器

> 来源：朱小厮，微信公众号，2026-07-31
