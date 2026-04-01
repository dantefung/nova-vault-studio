Title: prompts.ts) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html

Markdown Content:
本页目录

*   [系统提示词架构](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E7%B3%BB%E7%BB%9F%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%9E%B6%E6%9E%84 "系统提示词架构")
*   [静态提示词核心内容](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E9%9D%99%E6%80%81%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%A0%B8%E5%BF%83%E5%86%85%E5%AE%B9 "静态提示词核心内容")
    *   [身份定义](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E8%BA%AB%E4%BB%BD%E5%AE%9A%E4%B9%89 "身份定义")
    *   [工具使用指南](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97 "工具使用指南")
    *   [输出格式规范](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E8%BE%93%E5%87%BA%E6%A0%BC%E5%BC%8F%E8%A7%84%E8%8C%83 "输出格式规范")
    *   [安全约束](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E5%AE%89%E5%85%A8%E7%BA%A6%E6%9D%9F "安全约束")

*   [systemPromptSection() — 动态 Section 注册](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#systempromptsection-%E2%80%94-%E5%8A%A8%E6%80%81-section-%E6%B3%A8%E5%86%8C "systemPromptSection() — 动态 Section 注册")
    *   [Section 组装流程](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#section-%E7%BB%84%E8%A3%85%E6%B5%81%E7%A8%8B "Section 组装流程")

*   [constants/ 目录其他文件](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#constants-%E7%9B%AE%E5%BD%95%E5%85%B6%E4%BB%96%E6%96%87%E4%BB%B6 "constants/ 目录其他文件")
*   [关键常量摘要](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E5%85%B3%E9%94%AE%E5%B8%B8%E9%87%8F%E6%91%98%E8%A6%81 "关键常量摘要")

## 提示词系统 (constants/prompts.ts) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%B3%BB%E7%BB%9F-constants-prompts-ts)

`constants/prompts.ts` (~800 行) 是 Claude Code 的“大脑配置”，定义了 AI 的行为、能力边界和人格特征。

## 系统提示词架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E7%B3%BB%E7%BB%9F%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%9E%B6%E6%9E%84)

系统提示词由 **静态部分** 和 **动态部分** 组成：

```
完整系统提示词
├── 静态部分 (编译时确定)
│   ├── 核心身份与能力
│   ├── 工具使用指南
│   ├── 输出格式规范
│   ├── 安全约束
│   └── Ant-specific 部分 (ANT_SPECIFIC flag)
└── 动态部分 (运行时注入)
    ├── Git 上下文 (分支/状态/提交)
    ├── CLAUDE.md 记忆
    ├── 内存目录内容
    ├── 注册的 Section
    └── 工具列表与描述
```

## 静态提示词核心内容 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E9%9D%99%E6%80%81%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%A0%B8%E5%BF%83%E5%86%85%E5%AE%B9)

### 身份定义 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E8%BA%AB%E4%BB%BD%E5%AE%9A%E4%B9%89)

```
你是 Claude，一个由 Anthropic 构建的 AI 编码助手。
你在用户的终端中运行，可以帮助他们完成各种编程任务。
```

### 工具使用指南 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97)

```
工具调用的核心规则：
1. 优先使用工具获取信息，而非猜测
2. 文件操作前先读取目标文件
3. 每次修改后验证结果
4. 使用 GlobTool/GrepTool 搜索而非假设文件位置
5. 一次修改一个文件，避免大规模重构
```

### 输出格式规范 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E8%BE%93%E5%87%BA%E6%A0%BC%E5%BC%8F%E8%A7%84%E8%8C%83)

```
Markdown 格式要求：
- 代码块使用正确的语言标记
- 文件路径使用反引号
- 关键概念加粗
- 列表使用 - 而非 *
```

### 安全约束 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E5%AE%89%E5%85%A8%E7%BA%A6%E6%9D%9F)

```
安全规则：
1. 不执行可能造成数据丢失的命令
2. 不修改系统配置文件
3. 不安装未经验证的软件包
4. 不访问用户未授权的文件
5. 遇到安全问题时停止并报告
```

## systemPromptSection() — 动态 Section 注册 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#systempromptsection-%E2%80%94-%E5%8A%A8%E6%80%81-section-%E6%B3%A8%E5%86%8C)

> **注意**: `systemPromptSection()` 定义在 `systemPromptSections.ts` 中，在 `prompts.ts` 中被 `import` 使用。

typescript

```
// 记忆化的 Section 注册系统
// systemPromptSection() 返回 SystemPromptSection 对象（非注册到全局 Map 的副作用函数）
type ComputeFn = () => string | null | Promise<string | null>

type SystemPromptSection = {
  name: string
  compute: ComputeFn    // 非 generator，返回 string | null | Promise
  cacheBreak: boolean
}

function systemPromptSection(name: string, compute: ComputeFn): SystemPromptSection {
  return { name, compute, cacheBreak: false }
}

// 另有 DANGEROUS_uncachedSystemPromptSection() 用于每轮重新计算的 section
function DANGEROUS_uncachedSystemPromptSection(
  name: string, compute: ComputeFn, _reason: string
): SystemPromptSection {
  return { name, compute, cacheBreak: true }
}
```

### Section 组装流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#section-%E7%BB%84%E8%A3%85%E6%B5%81%E7%A8%8B)

typescript

```
// 实际函数名为 resolveSystemPromptSections（非 buildFullSystemPrompt）
// 接受 sections 数组并返回 Promise
async function resolveSystemPromptSections(
  sections: SystemPromptSection[]
): Promise<(string | null)[]>
```

## constants/ 目录其他文件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#constants-%E7%9B%AE%E5%BD%95%E5%85%B6%E4%BB%96%E6%96%87%E4%BB%B6)

`constants/` 包含 21 个文件：

| 文件 | 内容 |
| --- | --- |
| `prompts.ts` | ~800 行系统提示词 |
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
| `spinnerVerbs.ts` | 加载动画动词 ("思考中"...) |
| `system.ts` | 系统级常量 |
| `systemPromptSections.ts` | Section 注册辅助 |
| `toolLimits.ts` | 工具行为限制 |
| `tools.ts` | 工具名称常量 |
| `turnCompletionVerbs.ts` | 轮次完成动词 |
| `xml.ts` | XML 标签常量 |

## 关键常量摘要 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html#%E5%85%B3%E9%94%AE%E5%B8%B8%E9%87%8F%E6%91%98%E8%A6%81)

typescript

```
// apiLimits.ts
const MAX_CONTEXT_WINDOW = 200_000      // Claude 最大上下文窗口
const MAX_OUTPUT_TOKENS = 16_384        // 默认最大输出 token
const RATE_LIMIT_RETRY_DELAY = 60_000   // 速率限制重试延迟

// files.ts
const MAX_FILE_READ_SIZE = 500_000      // 文件读取最大字节
const MAX_FILE_WRITE_SIZE = 1_000_000   // 文件写入最大字节
const BINARY_FILE_THRESHOLD = 0.1       // 二进制检测阈值

// toolLimits.ts
const MAX_CONCURRENT_TOOLS = 10         // 最大并发工具数
const TOOL_TIMEOUT_MS = 120_000         // 工具执行超时

// product.ts
const PRODUCT_NAME = 'Claude Code'
const PRODUCT_VERSION = '2.1.88'
```