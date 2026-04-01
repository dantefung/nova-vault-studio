Title: 工具管理服务 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/services/tools-service.html

Markdown Content:
## 工具管理服务 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/tools-service.html#%E5%B7%A5%E5%85%B7%E7%AE%A1%E7%90%86%E6%9C%8D%E5%8A%A1)

`src/services/tools/` 管理工具的注册、发现、过滤和生命周期。

## 工具组装管道 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/tools-service.html#%E5%B7%A5%E5%85%B7%E7%BB%84%E8%A3%85%E7%AE%A1%E9%81%93)

`assembleToolPool`（`src/tools.ts`）组装工具池，签名：

typescript

```
// src/tools.ts
export function assembleToolPool(
  permissionContext: ToolPermissionContext,
  mcpTools: Tools,
): Tools
```

内部流程：

1.   通过 `getTools(permissionContext)` 获取内置工具（包含 feature-gated 工具，如 Task 工具通过 `isTodoV2Enabled()` 控制，Worktree 工具通过 `isWorktreeModeEnabled()` 控制）
2.   过滤在 deny 列表中的 MCP 工具
3.   分区排序（内置工具作为前缀，保证 prompt-cache 稳定性）
4.   通过 `uniqBy` 去重合并

## 工具过滤 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/tools-service.html#%E5%B7%A5%E5%85%B7%E8%BF%87%E6%BB%A4)

> **注意**: 源码中没有 `ToolRegistry` 接口。工具通过函数式组合（`assembleToolPool` + `mergeAndFilterTools`）进行管理。

`mergeAndFilterTools`（`src/utils/toolPool.ts`）签名：

typescript

```
// src/utils/toolPool.ts
export function mergeAndFilterTools(
  initialTools: Tools,
  assembled: Tools,
  mode: ToolPermissionContext['mode'],
): Tools
```

内部流程：

1.   `initialTools` 优先，通过 `uniqBy` 去重
2.   分区排序（内置工具作为前缀，MCP 工具在后）
3.   若启用了 `COORDINATOR_MODE`，则应用协调器工具过滤

## 工具查找 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/tools-service.html#%E5%B7%A5%E5%85%B7%E6%9F%A5%E6%89%BE)

工具查找通过 `findToolByName`（`src/Tool.ts`）实现，从 `assembleToolPool` 返回的数组中按名称查找。

## 工具使用计数 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/tools-service.html#%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8%E8%AE%A1%E6%95%B0)

工具使用跟踪通过分析事件系统（`logEvent`）记录，并非单独的 Map 计数器。每次工具调用通过 `tool_use` 事件记录到遥测系统。
