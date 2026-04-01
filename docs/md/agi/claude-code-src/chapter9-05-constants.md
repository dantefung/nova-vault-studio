Title: 常量定义 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html

Markdown Content:
## 常量定义 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E5%B8%B8%E9%87%8F%E5%AE%9A%E4%B9%89)

`src/constants/` 包含 **21 个常量文件**，定义了系统级配置值。

## 文件清单 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E6%96%87%E4%BB%B6%E6%B8%85%E5%8D%95)

> **注意**: 以下文件列表已根据实际 `src/constants/` 目录修正。此前文档中列出的 `models.ts`、`pricing.ts`、`providers.ts`、`permissions.ts`、`features.ts`、`limits.ts`、`colors.ts`、`keybindings.ts`、`errors.ts`、`paths.ts`、`versions.ts`、`env.ts`、`regex.ts`、`analytics.ts`、`mcp.ts`、`bridge.ts`、`ui.ts`、`security.ts`**均不存在**。

| 文件 | 主要常量 |
| --- | --- |
| `prompts.ts` | 系统提示词 (~800 行) |
| `apiLimits.ts` | API 速率限制、Token 限制 |
| `betas.ts` | Beta 特性标识 |
| `common.ts` | `feature()` 函数、通用常量 |
| `cyberRiskInstruction.ts` | 网络安全风险提示 |
| `errorIds.ts` | 错误码定义 |
| `figures.ts` | Unicode 符号 (✓, ✗, →, ...) |
| `files.ts` | 文件相关常量（大小限制等） |
| `github-app.ts` | GitHub App 配置 |
| `keys.ts` | 快捷键名称常量 |
| `messages.ts` | 消息类型常量 |
| `oauth.ts` | OAuth 配置常量 |
| `outputStyles.ts` | 输出风格定义 |
| `product.ts` | 产品信息（名称、版本等） |
| `spinnerVerbs.ts` | 加载动画动词 |
| `system.ts` | 系统级常量 |
| `systemPromptSections.ts` | Section 注册辅助 |
| `toolLimits.ts` | 工具行为限制 |
| `tools.ts` | 工具名称常量 |
| `turnCompletionVerbs.ts` | 轮次完成动词 |
| `xml.ts` | XML 标签常量 |

## 关键常量详解 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E5%85%B3%E9%94%AE%E5%B8%B8%E9%87%8F%E8%AF%A6%E8%A7%A3)

### 系统提示词 (prompts.ts) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E7%B3%BB%E7%BB%9F%E6%8F%90%E7%A4%BA%E8%AF%8D-prompts-ts)

`prompts.ts` 约 800 行，通过 `systemPromptSection()` 注册机制组装系统提示词。

`systemPromptSection` 定义在 `systemPromptSections.ts` 中：

typescript

```
// src/constants/systemPromptSections.ts — 真实代码
type ComputeFn = () => string | null | Promise<string | null>

type SystemPromptSection = {
  name: string
  compute: ComputeFn
  cacheBreak: boolean
}

export function systemPromptSection(
  name: string,
  compute: ComputeFn,
): SystemPromptSection {
  return { name, compute, cacheBreak: false }
}
```

实际注册的 section 名称包括：`session_guidance`、`memory`、`ant_model_override`、`env_info_simple`、`language`、`output_style`、`scratchpad`、`frc`、`brief` 等。通过 `resolveSystemPromptSections()` 解析计算最终提示词。

### 模型配置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E6%A8%A1%E5%9E%8B%E9%85%8D%E7%BD%AE)

### 模型配置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E6%A8%A1%E5%9E%8B%E9%85%8D%E7%BD%AE-1)

`src/constants/models.ts` 不存在。模型信息分散在 `src/utils/model/` 目录中，包括模型名称、上下文窗口大小、最大输出 tokens、是否支持 thinking/caching 等配置。

### 定价 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E5%AE%9A%E4%BB%B7)

`src/constants/pricing.ts` 不存在。定价逻辑在 `src/utils/modelCost.ts` 中，按模型计算 input/output/cache 的 token 成本。

### 特性门控 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E7%89%B9%E6%80%A7%E9%97%A8%E6%8E%A7)

`src/constants/features.ts` 不存在。特性门控通过 `bun:bundle` 编译时处理，使用 `src/constants/common.ts` 中的 `feature()` 函数。约 47 个特性门控在编译时解析为布尔值。

### 系统限制 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E7%B3%BB%E7%BB%9F%E9%99%90%E5%88%B6)

`src/constants/limits.ts` 不存在。限制值分散在多个文件中：

*   `apiLimits.ts` — API 速率限制、Token 限制
*   `toolLimits.ts` — 工具行为限制
*   `files.ts` — 文件大小限制

### 安全常量 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E5%AE%89%E5%85%A8%E5%B8%B8%E9%87%8F)

`src/constants/security.ts` 不存在。安全相关检查通过 `BASH_SECURITY_CHECK_IDS` enum 及分散在各工具实现中的检查函数完成，非集中式的正则数组。

### 环境变量 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/constants.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

`src/constants/env.ts` 不存在。环境变量处理在 `src/utils/env.ts` 中。支持的环境变量包括认证相关（`ANTHROPIC_API_KEY`、`AWS_ACCESS_KEY_ID` 等）、配置相关（`CLAUDE_CODE_SHELL` 等）和代理相关（`HTTP_PROXY` 等）。
