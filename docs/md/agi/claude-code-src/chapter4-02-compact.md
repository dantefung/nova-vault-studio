Title: 上下文压缩系统 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html

Markdown Content:
本页目录

*   [三层压缩架构](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#%E4%B8%89%E5%B1%82%E5%8E%8B%E7%BC%A9%E6%9E%B6%E6%9E%84 "三层压缩架构")
*   [Microcompact（工具结果压缩）](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#microcompact-%E5%B7%A5%E5%85%B7%E7%BB%93%E6%9E%9C%E5%8E%8B%E7%BC%A9 "Microcompact（工具结果压缩）")
    *   [API 级别优化](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#api-%E7%BA%A7%E5%88%AB%E4%BC%98%E5%8C%96 "API 级别优化")

*   [Autocompact（全量摘要压缩）](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#autocompact-%E5%85%A8%E9%87%8F%E6%91%98%E8%A6%81%E5%8E%8B%E7%BC%A9 "Autocompact（全量摘要压缩）")
*   [Session Memory Compact](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#session-memory-compact "Session Memory Compact")
*   [Reactive Compact](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#reactive-compact "Reactive Compact")
*   [压缩策略对比](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#%E5%8E%8B%E7%BC%A9%E7%AD%96%E7%95%A5%E5%AF%B9%E6%AF%94 "压缩策略对比")

## 上下文压缩系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8E%8B%E7%BC%A9%E7%B3%BB%E7%BB%9F)

Compact 系统是 Claude Code 管理 AI 上下文窗口的核心机制，采用 **三层递进压缩** 策略。

## 三层压缩架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#%E4%B8%89%E5%B1%82%E5%8E%8B%E7%BC%A9%E6%9E%B6%E6%9E%84)

```
┌──────────────────────────────────────────────────┐
│ 第 1 层: Microcompact（工具结果压缩）               │
│ 触发: 每次 AI 响应前                               │
│ 效果: 截断过长的工具输出                            │
├──────────────────────────────────────────────────┤
│ 第 2 层: Autocompact（全量摘要压缩）                │
│ 触发: 上下文占用 > 阈值 (如 80%)                   │
│ 效果: AI 生成对话摘要，替换历史消息                  │
├──────────────────────────────────────────────────┤
│ 第 3 层: Session Memory Compact                  │
│ 触发: 超长会话或手动 /compact                      │
│ 效果: 提取关键记忆到 Markdown + 压缩               │
└──────────────────────────────────────────────────┘
```

## Microcompact（工具结果压缩） [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#microcompact-%E5%B7%A5%E5%85%B7%E7%BB%93%E6%9E%9C%E5%8E%8B%E7%BC%A9)

`microcompactMessages`（`src/services/compact/microCompact.ts`）在每次 AI 响应前处理消息，对过长的工具输出进行截断。处理流程：

1.   遍历消息中的工具结果 block
2.   估算每个工具结果的 token 大小
3.   对超过阈值的结果进行 head-tail 截断（保留头尾，去掉中间）

### API 级别优化 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#api-%E7%BA%A7%E5%88%AB%E4%BC%98%E5%8C%96)

发送给 API 前会进一步清理消息，包括移除 thinking blocks（减少 token 消耗）和移除空的 tool_use blocks。这个逻辑嵌入在查询循环内部，而非单独的 `prepareForAPI` 函数。

## Autocompact（全量摘要压缩） [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#autocompact-%E5%85%A8%E9%87%8F%E6%91%98%E8%A6%81%E5%8E%8B%E7%BC%A9)

`autoCompactIfNeeded`（`src/services/compact/autoCompact.ts`）在上下文占用超过阈值时触发。流程：

1.   检查上下文占用比例是否超过阈值
2.   空闲时间检查（超过 1 小时空闲可强制触发）
3.   AI 生成对话摘要（通过内部压缩流程，使用 Sonnet 模型）
4.   构建压缩后的消息序列，保留最近几轮对话

## Session Memory Compact [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#session-memory-compact)

`trySessionMemoryCompaction`（`src/services/compact/sessionMemoryCompact.ts`）在超长会话或手动 `/compact` 时触发，流程：

1.   使用 AI 从对话中提取关键记忆（如决策、模式、洞察、待办事项）
2.   将记忆写入 Markdown 文件
3.   执行 autocompact 压缩

## Reactive Compact [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#reactive-compact)

当 API 返回 "prompt too long" 错误时的紧急压缩，实际函数名 `tryReactiveCompact`（位于 `src/services/compact/reactiveCompact.ts`，在 `src/query.ts` 中调用）。

处理流程：

1.   强制执行更激进的 microcompact
2.   立即执行 autocompact，只保留最近少量对话和更短的摘要

## 压缩策略对比 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/compact.html#%E5%8E%8B%E7%BC%A9%E7%AD%96%E7%95%A5%E5%AF%B9%E6%AF%94)

| 特性 | Microcompact | Autocompact | Session Memory |
| --- | --- | --- | --- |
| **触发时机** | 每次请求前 | 上下文超限 | 超长会话/手动 |
| **处理对象** | 工具输出 | 全量对话 | 关键记忆 |
| **是否使用 AI** | 否 | 是 (Sonnet) | 是 (Sonnet) |
| **延迟** | <10ms | 2-5s | 5-10s |
| **信息损失** | 低 | 中 | 低（记忆持久化） |
| **可逆性** | 不可逆 | 不可逆 | 可逆（有文件） |
