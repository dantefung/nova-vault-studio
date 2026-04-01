Title: 遥测分析系统 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html

Markdown Content:
## 遥测分析系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#%E9%81%A5%E6%B5%8B%E5%88%86%E6%9E%90%E7%B3%BB%E7%BB%9F)

Claude Code 的分析系统采用 **双 Sink 管道** 架构，同时向 Datadog 和 1P (First-Party) 后端发送事件。

## 架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#%E6%9E%B6%E6%9E%84)

```
事件产生
  │
  ├── 事件采样 (per-event-name sampling config)
  │
  ├── Sink 1: Datadog
  │   ├── 白名单过滤（仅允许的事件类型）
  │   └── Datadog API → 异步批量发送
  │
  └── Sink 2: 1P (First-Party)
      ├── OpenTelemetry BatchLogRecordProcessor
      └── 自定义后端 → 异步批量发送
```

## 核心 API [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#%E6%A0%B8%E5%BF%83-api)

typescript

```
// 记录事件
function logEvent(
  eventName: string,
  properties?: AnalyticsProperties,
  metadata?: AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
): void

// 安全标记类型 — 防止意外泄露代码或文件路径
type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS = {
  [key: string]: string | number | boolean | null
}
```

## Datadog Sink [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#datadog-sink)

typescript

```
// 允许事件白名单（部分）— 实际是 Set 类型
const DATADOG_ALLOWED_EVENTS = new Set([
  'session_start',
  'session_end',
  'query_start',
  'query_end',
  'tool_use',
  'error',
  'compact',
  'permission_check',
  // ...约 50 个事件类型
])

// 事件不在白名单中 → 静默丢弃
```

## 1P Sink [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#_1p-sink)

typescript

```
// 基于 OpenTelemetry
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'

// 批量处理
const processor = new BatchLogRecordProcessor(exporter, {
  maxExportBatchSize: 100,
  scheduledDelayMillis: 5000,  // 5 秒批次
  exportTimeoutMillis: 30000,
})
```

## 事件采样 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#%E4%BA%8B%E4%BB%B6%E9%87%87%E6%A0%B7)

typescript

```
// 事件采样：通过远程配置（EVENT_SAMPLING_CONFIG_NAME = 'tengu_event_sampling_config'）
// 控制每个事件的采样率，非本地硬编码常量
// 示例配置格式:
// {
//   'keystroke': 0.01,          // 1% 采样
//   'render_frame': 0.001,      // 0.1% 采样
//   'query_start': 1.0,         // 100% 采样
//   'error': 1.0,               // 100% 采样
// }
```

## GrowthBook 特性门控 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#growthbook-%E7%89%B9%E6%80%A7%E9%97%A8%E6%8E%A7)

GrowthBook 集成用于运行时特性门控（`src/services/analytics/growthbook.ts`）。通过 `getGrowthBookConfigOverrides` 等函数配置，属性包括 userId、platform、version、build 等。

缓存策略：

*   本地缓存 stale 值
*   后台异步刷新
*   失败时降级到缓存

获取特性值通过 `getFeatureValue_CACHED_MAY_BE_STALE` 函数（命名强调返回值可能是 stale 的）。

## Sink Killswitch [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#sink-killswitch)

通过 GrowthBook 远程控制 Sink 开关。紧急情况可远程关闭任一 Sink，通过特性门控判断是否启用。

## 退出时 Flush [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/analytics.html#%E9%80%80%E5%87%BA%E6%97%B6-flush)

进程退出前会确保所有未发送的事件输出，通过 `process.on('exit')` 和 SIGINT 处理器注册。各 Sink 分别 flush 待发送事件。
