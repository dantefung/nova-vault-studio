Title: Bridge 会话管理 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/session.html

Markdown Content:
## Bridge 会话管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/session.html#bridge-%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86)

## 会话创建 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/session.html#%E4%BC%9A%E8%AF%9D%E5%88%9B%E5%BB%BA)

> **注意**: `BridgeSessionConfig` 接口在源码中不存在，`createBridgeSession` 使用内联参数类型。

typescript

```
// createBridgeSession 实际参数:
async function createBridgeSession(params: {
  environmentId: string
  title: string
  events: unknown
  gitRepoUrl: string
  branch: string
  signal: AbortSignal
  baseUrl: string
  getAccessToken: () => Promise<string>
  permissionMode: PermissionMode
}): Promise<BridgeSession>
```

## 会话运行器 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/session.html#%E4%BC%9A%E8%AF%9D%E8%BF%90%E8%A1%8C%E5%99%A8)

> **注意**: `sessionRunner.ts` 并非 SessionRunner 类，而是导出 `safeFilenameId()` 函数和 `PermissionRequest` 类型，用于子进程生成相关代码。

typescript

```
// sessionRunner.ts 实际导出:
export function safeFilenameId(id: string): string
export type PermissionRequest = { ... }
```

## Session ID 兼容 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/session.html#session-id-%E5%85%BC%E5%AE%B9)

> **注意**: 实际函数名为 `toCompatSessionId()` 和 `toInfraSessionId()`，而非 `normalizeSessionId()`。

typescript

```
// sessionIdCompat.ts 实际导出:
export function toCompatSessionId(id: string): string   // cse_/session_ 标签转换
export function toInfraSessionId(id: string): string
export function setCseShimGate(enabled: boolean): void
```

## 容量唤醒 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/session.html#%E5%AE%B9%E9%87%8F%E5%94%A4%E9%86%92)

typescript

```
// capacityWake.ts
// 实际导出的是工厂函数 createCapacityWake，而非 capacityWake
export type CapacitySignal = { signal: AbortSignal; cleanup: () => void }
export type CapacityWake = { signal(): CapacitySignal; wake(): void }

export function createCapacityWake(outerSignal: AbortSignal): CapacityWake
```

## 可信设备 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/bridge/session.html#%E5%8F%AF%E4%BF%A1%E8%AE%BE%E5%A4%87)

typescript

```
// trustedDevice.ts
// 设备信任管理（跳过某些安全检查）
// 注意：不存在 TrustedDevice 接口，实际导出为函数:
export function getTrustedDeviceToken(): string | undefined
export function clearTrustedDeviceTokenCache(): void
export function clearTrustedDeviceToken(): void
export function enrollTrustedDevice(): Promise<void>
```
