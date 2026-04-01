Title: Bash 执行工具 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html

Markdown Content:
BashTool 是 Claude Code 中 **最复杂、安全敏感度最高** 的工具，拥有 18 个文件和 50+ 安全检查。

## 目录结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

```
src/tools/BashTool/
├── BashTool.tsx              # 工具定义、buildTool 调用
├── prompt.ts                 # 工具描述、安全提示词
├── UI.tsx                    # 命令执行渲染组件
├── bashCommandHelpers.ts     # 命令辅助函数
├── bashPermissions.ts        # 权限检查
├── bashSecurity.ts           # 安全检查
├── BashToolResultMessage.tsx # 结果消息渲染
├── commandSemantics.ts       # 命令语义分析
├── commentLabel.ts           # 注释标签
├── destructiveCommandWarning.ts # 破坏性命令警告
├── modeValidation.ts         # 模式验证
├── pathValidation.ts         # 路径验证
├── readOnlyValidation.ts     # 只读模式验证
├── sedEditParser.ts          # sed 编辑解析
├── sedValidation.ts          # sed 命令验证
├── shouldUseSandbox.ts       # 沙箱判断
├── toolName.ts               # 工具名称常量
└── utils.ts                  # 工具函数
```

## 输入 Schema [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html#%E8%BE%93%E5%85%A5-schema)

typescript

```
const inputSchema = z.object({
  command: z.string().describe('要执行的 Bash 命令'),
  timeout: z.number().optional()
    .describe('命令超时时间（毫秒），默认 120000'),
  description: z.string().optional()
    .describe('人类可读的命令描述'),
})
```

## 执行流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html#%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B)

> **注意**: `call()` 方法是普通 `async` 函数，返回 `Promise<ToolResult>`，不是 AsyncGenerator。

typescript

```
async call(input: BashToolInput, toolUseContext, _canUseTool?, parentMessage?, onProgress?) {

  // ======= 快速路径 =======
  // 若有 _simulatedSedEdit，走 applySedEdit() 快速路径

  // ======= 1. 安全检查层 =======

  // 1a. 危险模式检测（bashSecurity.ts）
  const dangerResult = validateDangerousPatterns(validationContext)
  // 检查未转义反引号、COMMAND_SUBSTITUTION_PATTERNS 等

  // 1b. 路径验证（pathValidation.ts）
  const pathCheck = validateCommandPaths(command, args, cwd, toolPermissionContext)

  // ======= 2. 执行层 =======

  // 2a. 创建输出收集器
  const accumulator = new EndTruncatingAccumulator()

  // 2b. 执行命令（外部 runShellCommand）
  const shellResult = runShellCommand(command, {
    cwd: context.workingDirectory,
    timeout,
    abortSignal: context.abortSignal,
  })

  // 2c. 循环消费异步生成器，通过 onProgress 发送进度更新

  // ======= 3. 后处理层 =======

  // 3a. 跟踪 git 操作
  trackGitOperations(command, result)

  // 3b. 语义解析退出码/输出
  interpretCommandResult(result)

  // 3c. 检查工作目录
  resetCwdIfOutsideProject()

  // 3d. 标注沙箱违规
  SandboxManager.annotateStderrWithSandboxFailures(result)

  // ======= 4. 输出处理层 =======

  // 4a. 输出格式化和截断（utils.ts）
  const { totalLines, truncatedContent } = formatOutput(result.stdout + result.stderr)
  // 使用 getMaxOutputLength() 获取阈值

  // 4b. 大输出持久化到磁盘供模型后续读取

  return toolResult(
    `Exit code: ${result.exitCode}\n` +
    (truncatedContent || '(no output)')
  )
}
```

## 危险模式检测 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html#%E5%8D%B1%E9%99%A9%E6%A8%A1%E5%BC%8F%E6%A3%80%E6%B5%8B)

`bashSecurity.ts` 包含以下安全检查机制：

*   **命令替换模式** (`COMMAND_SUBSTITUTION_PATTERNS`)：检测 `$()`、`${}`、进程替换等
*   **危险 zsh 命令** (`ZSH_DANGEROUS_COMMANDS`)：`zmodload`、`emulate`、`sysopen` 等
*   **安全检查 ID** (`BASH_SECURITY_CHECK_IDS`)：23+ 种检查类型编号
*   **验证函数** (`validateDangerousPatterns`)：检查未转义反引号、命令替换模式等，返回 `PermissionResult`

## 交互命令检测 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html#%E4%BA%A4%E4%BA%92%E5%91%BD%E4%BB%A4%E6%A3%80%E6%B5%8B)

typescript

```
// bashPermissions.ts
// 无独立 isInteractiveCommand 函数
// 交互性通过 isNonInteractiveSession 布尔参数传入
// startSpeculativeClassifierCheck 和 executeAsyncClassifierCheck 使用此参数

// 命令处理辅助函数:
// stripSafeWrappers — 去除安全包装
// stripAllLeadingEnvVars — 去除前导环境变量
```

## Shell 提供者 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html#shell-%E6%8F%90%E4%BE%9B%E8%80%85)

typescript

```
// BashTool 不使用 ShellProvider 接口
// Shell 执行通过外部 runShellCommand 函数处理
// 命令处理辅助函数在 bashCommandHelpers.ts 和 bashPermissions.ts 中
```

## 输出截断策略 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html#%E8%BE%93%E5%87%BA%E6%88%AA%E6%96%AD%E7%AD%96%E7%95%A5)

`utils.ts` 中的 `formatOutput()` 函数处理输出截断：

1.   通过 `getMaxOutputLength()` 获取最大输出长度阈值
2.   如果内容未超出阈值，直接返回
3.   如果超出，截断并添加 `[N lines truncated]` 标记
4.   返回 `{ totalLines, truncatedContent, isImage? }`

## 权限 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html#%E6%9D%83%E9%99%90)

*   `isReadOnly()` = `false`
*   `isDestructive()` = `true`
*   `isConcurrencySafe()` = `false`
*   权限模式: `Bash(command_pattern)`
*   每个命令单独确认（除非匹配 allow 规则）