---
title: "MCP 工具命名空间隔离"
date: "2026-11-04"
source: "微信公众号 / 从码农到工匠"
url: "https://mp.weixin.qq.com/s/61d6LK7SCqJuRx9KhenM1A"
---

# MCP 工具命名空间隔离

> 多 MCP Server 并存时，用 `serverName__toolName` 前缀为工具名加命名空间，并以反向索引完成调用路由——这是多 Server 共存的基础设施，不是可选优化。

## Problem Context

Agent 动态连接多个 MCP Server 后，**工具名冲突是必然事件**：Server A 暴露 `echo`，Server B 也暴露 `echo`。模型看到两个同名工具，无法区分调用哪个；客户端收到调用也无法路由到正确的 Server。

常见错误做法是「后注册的覆盖先注册的」或「让用户手动改工具名」——前者静默丢工具，后者把集成成本转嫁给用户，都不可接受。

## Solution

### 前缀规则

```
serverName__toolName
```

用**双下划线**分隔，因为工具名本身不会包含双下划线——这个前提保证了前缀切分可逆，不会产生歧义。

示例：Server `serverA` 和 `serverB` 都提供 `echo`，模型侧看到的是 `serverA__echo` 和 `serverB__echo`。

### 反向索引

在客户端管理器里维护一张 `prefixedName → { serverName, originalName }` 的映射表，让「模型看到的名字」能反查到「真实 Server 与真实工具名」：

```ts
export class McpClientManager {
    readonly #clients = new Map<string, Client>();
    readonly #transports = new Map<string, Transport>();
    readonly #toolIndex = new Map<string, { serverName: string; originalName: string }>();
}
```

注册时写入索引：

```ts
const prefixedName = `${serverName}__${mcpTool.name}`;
entries.push({ originalName: mcpTool.name, prefixedName, serverName, tool });
this.#toolIndex.set(prefixedName, { serverName, originalName: mcpTool.name });
```

调用时经索引路由：

```ts
async callTool(prefixedName: string, args: Record<string, unknown>): Promise<McpCallResult> {
    const index = this.#toolIndex.get(prefixedName);
    if (index === undefined) {
        return { output: `Unknown MCP tool: ...`, error: 'server_disconnected' };
    }
    const result = await client.callTool({
        name: index.originalName,      // ← 还原成 Server 侧的真实工具名
        arguments: args,
    });
    ...
}
```

**注意还原这一步**：发往 Server 的必须是原始工具名，前缀只是 Agent 侧的寻址手段。

### 配套的两条约定

1. **Schema 直通但放宽 strict**：MCP 工具的 `inputSchema` 是 JSON Schema，与 `FunctionTool.parameters` 兼容可直接透传；但 `strict` 统一设为 `false`——MCP Server 的 schema 可能包含可选参数。
2. **异常不 crash Agent**：任何调用异常都转成 `McpCallResult`（`error: 'mcp_call_error'`）回传给模型。协议层还有 `isError` 标志位——Server 可以返回 HTTP 200 但标记 `isError: true`，表示**工具执行失败**而非协议错误，两者语义不同。

## Trade-offs

- **模型看到的长名字会占用 token**：每个工具名都带前缀，工具数量多时 prompt 变长。对工具名可读性的收益通常值得这点开销。
- **前缀不可省略**：一旦某条路径忘了走索引（比如直接透传 prefixedName 给 Server），调用会失败且报错信息不直观。命名空间隔离应当是**唯一入口**强制的，而不是靠调用方自觉。

## Related Pages

- [[concepts/mcp-protocol-rpc]] — MCP 协议的 JSON-RPC 与传输层选型
- [[patterns/plugin-first-agent-runtime]] — 插件化运行时与工具解耦
- [[concepts/responses-api-agent-loop]] — 工具声明经由 Responses API 传给模型
- [[patterns/agent-event-decoupling]] — 工具调用事件的观测路径
- [[sources/zeroagent-05-mcp]] — 原始归档

## Sources

- 《从零构建 Agent（五）：MCP 工具协议》，公众号「从码农到工匠」，2026-10-13：2.1 节 McpClientManager 的三个数据结构；2.2 节命名空间隔离与前缀格式；2.4 节 callTool 路由与异常不 crash 的处理
