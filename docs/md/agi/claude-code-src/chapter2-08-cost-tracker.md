Title: tracker.ts) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/cost-tracker.html

Markdown Content:
## 成本追踪 (cost-tracker.ts) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/cost-tracker.html#%E6%88%90%E6%9C%AC%E8%BF%BD%E8%B8%AA-cost-tracker-ts)

`cost-tracker.ts` 和 `costHook.ts` 实现实时的 AI API 调用成本追踪，支持多模型差异化定价。

## 成本追踪函数（非类） [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/cost-tracker.html#%E6%88%90%E6%9C%AC%E8%BF%BD%E8%B8%AA%E5%87%BD%E6%95%B0-%E9%9D%9E%E7%B1%BB)

注意

成本追踪使用 **函数式** 风格实现，而非 OOP 类模式。状态存储在 AppState 中。

typescript

```
// 核心函数（非 CostTracker 类）
function getStoredSessionCosts(sessionId: string): StoredCostState | undefined  // 获取存储的会话成本
function restoreCostStateForSession(sessionId: string): boolean  // 恢复会话成本状态
function saveCurrentSessionCosts(fpsMetrics?: FpsMetrics): void  // 保存当前会话成本
function addToTotalSessionCost(cost: number, usage: Usage, model: string): number  // 累加成本
```

## 模型定价 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/cost-tracker.html#%E6%A8%A1%E5%9E%8B%E5%AE%9A%E4%BB%B7)

typescript

```
// utils/modelCost.ts
type ModelCosts = {
  inputTokens: number              // 每百万输入 token 价格 ($)
  outputTokens: number             // 每百万输出 token 价格 ($)
  promptCacheReadTokens: number    // 缓存读取价格
  promptCacheWriteTokens: number   // 缓存写入价格
  webSearchRequests: number        // 网页搜索请求价格
}

// 定价常量（按层级划分，非单一 Record）
const COST_TIER_3_15: ModelCosts = {      // Sonnet 系列
  inputTokens: 3,
  outputTokens: 15,
  promptCacheWriteTokens: 3.75,
  promptCacheReadTokens: 0.3,
  webSearchRequests: 0.01,
}

const COST_TIER_15_75: ModelCosts = {     // Opus 4/4.1
  inputTokens: 15,
  outputTokens: 75,
  promptCacheWriteTokens: 18.75,
  promptCacheReadTokens: 1.5,
  webSearchRequests: 0.01,
}
// 其他层级: COST_TIER_5_25 (Opus 4.5), COST_TIER_30_150 (Opus 4.6 fast), COST_HAIKU_35, COST_HAIKU_45
```

## costHook.ts — React 集成 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/cost-tracker.html#costhook-ts-%E2%80%94-react-%E9%9B%86%E6%88%90)

typescript

```
// 成本相关 Hook
function useCostSummary() {
  // 返回成本摘要信息（非 useCost/useTokenUsage）
}
```

## StatusLine 集成 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/cost-tracker.html#statusline-%E9%9B%86%E6%88%90)

成本信息实时显示在 StatusLine 中：

`claude-sonnet-4  |  CTX: 45K/200K  |  $0.42  |  ↑2.1K ↓15.3K`

*   **CTX**: 上下文使用量 / 模型限制
*   **$0.42**: 当前会话成本
*   **↑2.1K**: 输入 token 数
*   **↓15.3K**: 输出 token 数