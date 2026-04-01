Title: 查询引擎 (QueryEngine.ts + query.ts) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html

Markdown Content:
查询引擎是 Claude Code 的心脏，负责与 AI 模型的全部交互。由两个核心文件组成：`QueryEngine.ts`（~1000+ 行，会话管理）和 `query.ts`（~1200+ 行，查询循环）。

## QueryEngine.ts — 会话管理器 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#queryengine-ts-%E2%80%94-%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86%E5%99%A8)

### 类结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#%E7%B1%BB%E7%BB%93%E6%9E%84)

typescript

```
class QueryEngine {
  // === 配置 ===
  private config: QueryEngineConfig   // ~20 个配置字段

  // === 会话状态 ===
  private mutableMessages: Message[]             // 可变消息数组（跨轮次）
  private totalUsage: NonNullableUsage           // 累计 token 使用量
  private permissionDenials: SDKPermissionDenial[]  // 权限拒绝记录（非 Set<string>）
  private readFileState: FileStateCache          // 文件状态缓存
  private abortController: AbortController       // 取消控制器
  private discoveredSkillNames: Set<string>      // 发现的技能名
  private loadedNestedMemoryPaths: Set<string>   // 已加载的嵌套记忆路径

  // === 生命周期 ===
  // prompt 参数：string | ContentBlockParam[]（非仅 string）
  // 第二参数有可选 options: { uuid?, isMeta? }
  async *submitMessage(prompt: string | ContentBlockParam[], options?: { uuid?: string; isMeta?: boolean }): AsyncGenerator<SDKMessage>
  async cancel(): void
  getMessages(): readonly Message[]
}
```

### QueryEngineConfig — 配置对象 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#queryengineconfig-%E2%80%94-%E9%85%8D%E7%BD%AE%E5%AF%B9%E8%B1%A1)

typescript

```
type QueryEngineConfig = {
  cwd: string
  tools: Tools                              // 可用工具列表
  commands: Command[]                       // 可用命令列表
  mcpClients: MCPServerConnection[]         // MCP 服务器连接（非 MCPClient[]）
  agents: AgentDefinition[]                 // Agent 定义
  canUseTool: CanUseToolFn                  // 工具权限检查函数

  // 状态管理
  getAppState: () => AppState
  setAppState: (f: (prev: AppState) => AppState) => void
  readFileCache: FileStateCache             // 文件状态缓存

  // 可选配置
  initialMessages?: Message[]
  customSystemPrompt?: string
  appendSystemPrompt?: string
  userSpecifiedModel?: string               // 用户指定模型
  fallbackModel?: string
  thinkingConfig?: ThinkingConfig
  maxTurns?: number
  maxBudgetUsd?: number
  taskBudget?: { total: number }
  verbose?: boolean
  abortController?: AbortController         // 取消控制器（非 abortSignal）
  handleElicitation?: ToolUseContext['handleElicitation']
  snipReplay?: (msg: Message, store: Message[]) => { messages: Message[]; executed: boolean } | undefined
}
```

### submitMessage() — 异步生成器 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#submitmessage-%E2%80%94-%E5%BC%82%E6%AD%A5%E7%94%9F%E6%88%90%E5%99%A8)

typescript

```
async *submitMessage(
  prompt: string | ContentBlockParam[],
  options?: { uuid?: string; isMeta?: boolean }
): AsyncGenerator<SDKMessage> {
  // 1. 构建用户消息
  // 2. 启动查询循环（通过 query() 函数，非 queryLoop）
  // 3. 后处理
}
```

## query.ts — 核心查询循环 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#query-ts-%E2%80%94-%E6%A0%B8%E5%BF%83%E6%9F%A5%E8%AF%A2%E5%BE%AA%E7%8E%AF)

`query()` 函数（非 `queryLoop()`）是一个 **无限 `while` 循环**，每一轮执行多个处理步骤：

### 完整循环流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#%E5%AE%8C%E6%95%B4%E5%BE%AA%E7%8E%AF%E6%B5%81%E7%A8%8B)

typescript

```
// 导出类型为 QueryParams，函数名为 query（非 queryLoop）
async function* query(params: QueryParams): AsyncGenerator<SDKMessage> {
  while (true) {
    // ======= Step 1: Snip 压缩（Feature-Gated） =======
    // snipModule?.snipCompactIfNeeded() — L404
    // 如果启用了 HISTORY_SNIP 功能

    // ======= Step 2: 微压缩 =======
    // deps.microcompact() — L414-420
    // 工具结果级别的压缩

    // ======= Step 3: 上下文折叠（Feature-Gated） =======
    // contextCollapse?.applyCollapsesIfNeeded() — L436-441
    // 如果启用了 CONTEXT_COLLAPSE 功能
    // 将旧的工具调用结果折叠为摘要

    // ======= Step 4: 自动压缩 =======
    // deps.autocompact() — L454-467
    // 当上下文过大时自动压缩

    // ======= Step 5: 计算 token 预算 =======
    // 根据模型限制和当前消息计算

    // ======= Step 6: API 调用 =======
    // 发送到 AI 模型的 SDK 调用

    // ======= Step 7: 流式工具执行 =======
    // 并发执行返回的工具调用

    // ======= Step 8: 回填工具结果 =======
    // 将工具结果注入消息列表

    // ======= Step 9: 阻塞限制检查 =======
    // L601-619 — 检查上下文是否超限

    // ======= Step 10: 错误恢复 =======
    // 处理 API 错误和重试逻辑

    // ======= Step 11: 停止钩子检查 =======
    // 检查是否应停止循环
    if (shouldStop || stopReason === 'end_turn') {
      break
    }
  }
}
```

### Step 1-2: 预算与截断 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#step-1-2-%E9%A2%84%E7%AE%97%E4%B8%8E%E6%88%AA%E6%96%AD)

查询循环的前两步处理 snip 压缩和微压缩：

*   **Snip 压缩**（Feature-Gated）：若启用了 `HISTORY_SNIP` 功能，通过 `snipModule?.snipCompactIfNeeded()` 处理
*   **微压缩**：`deps.microcompact()` 调用 `microcompactMessages`（`src/services/compact/microCompact.ts`），在工具结果级别截断过长输出

### Step 3: 微压缩 (Microcompact) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#step-3-%E5%BE%AE%E5%8E%8B%E7%BC%A9-microcompact)

微压缩在工具结果级别操作，通过 `microcompactMessages`（`src/services/compact/microCompact.ts`）实现。处理包括移除重复的 import 语句、压缩连续空行、截断长日志输出、压缩大型 JSON 输出等。

### Step 5-6: 自动压缩与阻塞压缩 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#step-5-6-%E8%87%AA%E5%8A%A8%E5%8E%8B%E7%BC%A9%E4%B8%8E%E9%98%BB%E5%A1%9E%E5%8E%8B%E7%BC%A9)

*   **自动压缩**：通过 `deps.autocompact()` 调用 `autoCompactIfNeeded`（`src/services/compact/autoCompact.ts`），当上下文过大时调用 AI（通常用 Haiku）生成会话摘要，替换旧消息
*   **阻塞压缩**：更激进的压缩，在 API 返回 prompt-too-long 时触发，可能删除更多历史消息

### Step 8: API 调用 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#step-8-api-%E8%B0%83%E7%94%A8)

通过 `deps.callModel`（即 `queryModelWithStreaming`）发送流式请求到 AI 模型。支持多个提供商：Anthropic Direct、AWS Bedrock、Azure Foundry、Google Vertex AI。

### Step 11: 4 级错误恢复 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#step-11-4-%E7%BA%A7%E9%94%99%E8%AF%AF%E6%81%A2%E5%A4%8D)

查询循环包含多级错误恢复机制：

1.   **反应式压缩** (Reactive Compact)：prompt too long 或上下文溢出时触发 `tryReactiveCompact`
2.   **上下文折叠排空** (Collapse Drain)：上下文溢出时折叠旧内容
3.   **最大输出 token 恢复**：`max_output_tokens` 错误时，升级 max_tokens 并重试（最多 3 次）
4.   **媒体错误恢复**：图片/PDF 过大时降级处理

## Token 预算系统 (query/tokenBudget.ts) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#token-%E9%A2%84%E7%AE%97%E7%B3%BB%E7%BB%9F-query-tokenbudget-ts)

### 预算组成 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#%E9%A2%84%E7%AE%97%E7%BB%84%E6%88%90)

实际导出类型为 `BudgetTracker` 和 `TokenBudgetDecision`（非 `TokenBudget` 接口）：

typescript

```
// src/query/tokenBudget.ts
export type BudgetTracker = {
  continuationCount: number
  lastDeltaTokens: number
  lastGlobalTurnTokens: number
  startedAt: number
}

export type TokenBudgetDecision = ContinueDecision | StopDecision

export function checkTokenBudget(
  tracker: BudgetTracker,
  agentId: string | undefined,
  budget: number | null,
  globalTurnTokens: number,
): TokenBudgetDecision
```

### 预算计算逻辑 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#%E9%A2%84%E7%AE%97%E8%AE%A1%E7%AE%97%E9%80%BB%E8%BE%91)

```
模型上下文窗口 (如 200K tokens)
  - 系统提示词 (~2K-5K tokens)
  - 用户上下文 (~1K-3K tokens)
  - 安全边际 (~10%)
  = 可用预算 (~170K tokens)

消息历史占用 → 与可用预算比较
  → 低于 70%: 正常发送
  → 70%-85%: 触发自动压缩
  → 85%-95%: 触发阻塞压缩
  → >95%: 触发紧急折叠
```

## 停止钩子 (query/stopHooks.ts) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#%E5%81%9C%E6%AD%A2%E9%92%A9%E5%AD%90-query-stophooks-ts)

查询循环在每轮结束时检查是否应停止：

1.   检查 `stop_reason` — `end_turn` 表示完成，`max_tokens` 表示继续
2.   检查最大轮次限制
3.   运行相关钩子检查是否应停止

## 查询配置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#%E6%9F%A5%E8%AF%A2%E9%85%8D%E7%BD%AE)

查询循环的关键常量分布在多个文件中，包括输出 token 恢复最大次数、压缩时保留消息数、工具结果截断阈值、压缩触发阈值等。具体数值见相关源文件。

## 查询依赖 (query/deps.ts) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html#%E6%9F%A5%E8%AF%A2%E4%BE%9D%E8%B5%96-query-deps-ts)

typescript

```
// src/query/deps.ts
export type QueryDeps = {
  callModel: typeof queryModelWithStreaming
  microcompact: typeof microcompactMessages
  autocompact: typeof autoCompactIfNeeded
  uuid: () => string
}
```

通过 `productionDeps()` 创建生产环境依赖，测试中可注入仿制实现。