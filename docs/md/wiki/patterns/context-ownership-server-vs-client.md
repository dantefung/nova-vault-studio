---
title: "上下文所有权：服务端 Store vs 客户端历史"
date: "2026-11-04"
source: "微信公众号 / 从码农到工匠"
url: "https://mp.weixin.qq.com/s/6lGd8uea2fsqKzeR5QL_6Q"
---

# 上下文所有权：服务端 Store vs 客户端历史

> Agent 的多轮上下文放在服务端还是客户端，是一次**所有权归属**决策而非技术细节：服务端持有省事但受限，客户端持有可控但需自付裁剪成本。

## Problem Context

模型本身无状态，每次请求都必须显式携带历史。多轮对话因此必须回答一个问题：**历史存在哪里？**

Responses API 给出两条路径：

- **服务端 Store**：`store: true` + 下一轮传 `previous_response_id`
- **客户端历史**：自己维护消息数组，每轮把全部历史塞进 `input`

两者不是非此即彼的互斥选项，但**必须显式选定所有权方**，否则会同时踩到两边的坑。

## Solution

### 服务端 Store

```json
// 第一轮
{ "model": "glm-5.3", "input": "我有三只猫。kitty, tom, and jerry.", "store": true }

// 第二轮：不带历史，只带指针
{ "model": "glm-5.3",
  "previous_response_id": "resp_20260913132836cc9a47c398b04d1c",
  "input": "它们分别叫什么名字？" }
```

模型服务根据 `previous_response_id` 找到上一轮响应，因此能理解「它们」指代 kitty / tom / jerry。

**三个约束**：

1. `previous_response_id` 依赖服务端确实保存了上一轮响应，**通常必须配 `store: true`**。
2. **服务商可能不支持**——实测 DeepSeek 不支持有状态存储，GLM-5.3 支持。
3. 引入服务端状态、保留时间、隐私与成本约束。

### 客户端历史

```json
{
  "model": "gpt-4o-mini",
  "input": [
    { "role": "user", "content": "我有三只猫。kitty, tom, and jerry." },
    { "role": "assistant", "content": "哇，三只猫！名字取得真有意思.." },
    { "role": "user", "content": "它们分别叫什么名字？" }
  ],
  "store": false
}
```

客户端每轮把完整历史重发，并自行 `history.push(...)` 累积。

| | 服务端 Store | 客户端历史 |
|---|---|---|
| 行为 | 依赖服务商实现，**能力不统一** | 行为明确，**跨服务商可迁移** |
| 本地持久化 | 难，需额外导出机制 | 容易 |
| Token 成本 | 请求只带增量 | 历史越长，`input` token 越多 |
| 裁剪/摘要 | 受制于服务商 | **客户端自行处理** |
| 敏感信息 | 离开本机即出边界 | 可在本地过滤后再发 |

## Trade-offs

**选服务端 Store**：服务商明确支持且已验证；追求最少客户端代码；对话历史短。

**选客户端历史**：服务商不支持 `store`（如 DeepSeek）；需要完整控制会话历史；需要本地持久化与敏感信息保护；历史很长、需要自行裁剪摘要。

**混合**：可以用 `store: false` 让客户端管理主历史，只在需要服务端连续响应时才用 `previous_response_id`。关键仍是**清楚上下文的所有权归谁**。

## Related Pages

- [[concepts/responses-api-agent-loop]] — 协议层的完整能力清单
- [[patterns/agent-loop]] — 循环每轮都要消费上下文
- [[concepts/agent-token-architecture]] — 上下文预算与 Token 架构
- [[sources/zeroagent-02-llm-interaction]] — 原始归档

## Sources

- 《从零构建 Agent（二）：大模型交互》，公众号「从码农到工匠」，2026-09-15：「有状态 Store」「客户端维护上下文」两节的对照与「上下文的所有权」总结论；DeepSeek / GLM-5.3 支持度实测
