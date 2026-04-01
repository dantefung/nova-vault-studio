Title: 工具函数库 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html

Markdown Content:
本页目录

*   [文件系统](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F "文件系统")
*   [Git 操作](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#git-%E6%93%8D%E4%BD%9C "Git 操作")
*   [Shell 与进程](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#shell-%E4%B8%8E%E8%BF%9B%E7%A8%8B "Shell 与进程")
*   [认证与安全](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E8%AE%A4%E8%AF%81%E4%B8%8E%E5%AE%89%E5%85%A8 "认证与安全")
*   [字符串与格式](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%A0%BC%E5%BC%8F "字符串与格式")
*   [网络](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E7%BD%91%E7%BB%9C "网络")
*   [终端与 UI](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E7%BB%88%E7%AB%AF%E4%B8%8E-ui "终端与 UI")
*   [数据结构](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84 "数据结构")
*   [Token 与模型](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#token-%E4%B8%8E%E6%A8%A1%E5%9E%8B "Token 与模型")
*   [平台](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E5%B9%B3%E5%8F%B0 "平台")
*   [关键工具函数详解](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E5%85%B3%E9%94%AE%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0%E8%AF%A6%E8%A7%A3 "关键工具函数详解")
    *   [auth.ts (~800 行)](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#auth-ts-800-%E8%A1%8C "auth.ts (~800 行)")
    *   [shell/shellProvider.ts](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#shell-shellprovider-ts "shell/shellProvider.ts")
    *   [file.ts](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#file-ts "file.ts")

## 工具函数库 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0%E5%BA%93)

`src/utils/` 包含 **300+ 个工具函数文件**，按功能分类如下。

## 文件系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F)

> **注意**: 以下文件名部分为示意，实际文件名可能不同。

| 文件 | 功能 |
| --- | --- |
| `file.ts` | 文件读写、权限检查 |
| `path.ts` | 路径规范化、跨平台处理 |
| `glob.ts` | Glob 模式匹配 |
| `tempfile.ts` | 临时文件/目录管理（非 tempDir.ts） |

## Git 操作 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#git-%E6%93%8D%E4%BD%9C)

| 文件 | 功能 |
| --- | --- |
| `git.ts` | Git 状态、diff、log、blame |
| `gitDiff.ts` | Diff 解析与展示 |
| `worktree.ts` | Worktree 管理（非 gitWorktree.ts） |

## Shell 与进程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#shell-%E4%B8%8E%E8%BF%9B%E7%A8%8B)

| 文件 | 功能 |
| --- | --- |
| `shell/shellProvider.ts` | Shell 提供者（非 Shell.ts） |
| `process.ts` | 子进程管理 |
| `execFileNoThrow.ts` | 命令执行封装（非 exec.ts） |
| `signal.ts` | 信号处理 |
| `env.ts` | 环境变量管理 |

## 认证与安全 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E8%AE%A4%E8%AF%81%E4%B8%8E%E5%AE%89%E5%85%A8)

| 文件 | 功能 |
| --- | --- |
| `auth.ts` | 认证工具 (~800 行) |
| `crypto.ts` | 加密工具 |
| `sanitization.ts` | 输入消毒（非 sanitize.ts） |
| `permissions/` | 权限检查（目录，非 permissions.ts） |

## 字符串与格式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%8E%E6%A0%BC%E5%BC%8F)

| 文件 | 功能 |
| --- | --- |
| `stringUtils.ts` | 字符串处理（非 string.ts） |
| `format.ts` | 格式化工具 |
| `markdown.ts` | Markdown 渲染 |
| `truncate.ts` | 文本截断 |
| `cliHighlight.ts` | 语法高亮（非 highlight.ts） |
| `diff.ts` | Diff 显示 |
| `json.ts` | JSON 安全解析 |
| `xml.ts` | XML 解析/生成 |

## 网络 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E7%BD%91%E7%BB%9C)

| 文件 | 功能 |
| --- | --- |
| `http.ts` | HTTP 请求封装（非 fetch.ts） |
| `proxy.ts` | 代理配置 |

## 终端与 UI [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E7%BB%88%E7%AB%AF%E4%B8%8E-ui)

| 文件 | 功能 |
| --- | --- |
| `terminal.ts` | 终端检测、尺寸、能力 |
| `ansiToPng.ts` | ANSI 转 PNG |
| `ansiToSvg.ts` | ANSI 转 SVG |

## 数据结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)

| 文件 | 功能 |
| --- | --- |
| `CircularBuffer.ts` | 环形缓冲区（非 ring.ts） |
| `lockfile.ts` | 文件锁/互斥锁（非 mutex.ts） |
| `queueProcessor.ts` | 队列处理（非 queue.ts） |

## Token 与模型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#token-%E4%B8%8E%E6%A8%A1%E5%9E%8B)

| 文件 | 功能 |
| --- | --- |
| `tokens.ts` | Token 计数（非 tokenizer.ts） |
| `model/` | 模型信息查询（目录，非 modelInfo.ts） |
| `modelCost.ts` | 价格计算（非 pricing.ts） |

## 平台 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E5%B9%B3%E5%8F%B0)

| 文件 | 功能 |
| --- | --- |
| `platform.ts` | 平台检测 (Windows/macOS/Linux) |
| `browser.ts` | 浏览器打开 |

## 关键工具函数详解 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#%E5%85%B3%E9%94%AE%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0%E8%AF%A6%E8%A7%A3)

### auth.ts (~800 行) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#auth-ts-800-%E8%A1%8C)

typescript

```
// src/utils/auth.ts — 真实导出函数
export function isAnthropicAuthEnabled(): boolean
export function getAuthTokenSource(): AuthTokenSource
export function getAnthropicApiKey(): string | null
export function hasAnthropicApiKeyAuth(): boolean
export function getConfiguredApiKeyHelper(): KeyHelper | null
export function calculateApiKeyHelperTTL(): number
export function isAwsAuthRefreshFromProjectSettings(): boolean
```

`awsAuthRefresh` 不是函数，而是一个设置项（字符串，指定用于刷新 AWS 凭证的外部命令）。通过内部的 `runAwsAuthRefresh()` 私有函数执行。

### shell/shellProvider.ts [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#shell-shellprovider-ts)

typescript

```
// src/utils/shell/shellProvider.ts — 真实代码
export type ShellProvider = {
  type: ShellType  // 'bash' | 'powershell'
  shellPath: string
  detached: boolean

  buildExecCommand(
    command: string,
    opts: { id: number | string; sandboxTmpDir?: string; useSandbox: boolean },
  ): Promise<{ commandString: string; cwdFilePath: string }>

  getSpawnArgs(commandString: string): string[]
  // ... 更多方法
}
```

Shell 检测优先级：`CLAUDE_CODE_SHELL` 环境变量 → `SHELL` 环境变量 → `which('bash')` → `which('sh')` → PowerShell (Windows)

### file.ts [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/utils.html#file-ts)

`src/utils/file.ts` 包含文件读写相关工具函数。详细 API 请直接参阅源码。
