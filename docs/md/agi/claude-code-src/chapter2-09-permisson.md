Title: 权限安全系统 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html

Markdown Content:
## 权限安全系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#%E6%9D%83%E9%99%90%E5%AE%89%E5%85%A8%E7%B3%BB%E7%BB%9F)

Claude Code 实现了多层权限安全系统，确保 AI 在执行工具时不会未经授权地访问系统资源。

## 权限模式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#%E6%9D%83%E9%99%90%E6%A8%A1%E5%BC%8F)

系统支持 **7 种权限模式**（含 feature-gated 模式）：

| 模式 | 行为 | 适用场景 |
| --- | --- | --- |
| `default` | 敏感工具调用需要用户确认 | 默认安全模式 |
| `plan` | 仅规划，不执行写入操作 | 审查模式 |
| `acceptEdits` | 自动接受文件编辑 | 信任编辑 |
| `bypassPermissions` | 跳过所有权限检查 | 开发调试（危险） |
| `dontAsk` | 不询问用户 | 非交互式模式 |
| `auto` | Feature-gated，使用分类器自动判断 | ANT 内部用途 |
| `bubble` | Feature-gated，冒泡到父级权限 | 协调器子任务 |

注意

文档原先列出的 `remote`、`managed`、`custom` 模式在实际代码的 `PermissionMode` 类型中不存在。

## 权限规则 (settings.json) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#%E6%9D%83%E9%99%90%E8%A7%84%E5%88%99-settings-json)

json

```
{
  "permissions": {
    "allow": [
      "Read(**)",
      "Glob(**)",
      "Grep(**)",
      "WebSearch"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "FileWrite(/etc/**)"
    ],
    "ask": [
      "Bash(*)",
      "FileWrite(**)"
    ],
    "defaultMode": "default",
    "additionalDirectories": ["/opt/project"]
  }
}
```

### 规则匹配语法 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#%E8%A7%84%E5%88%99%E5%8C%B9%E9%85%8D%E8%AF%AD%E6%B3%95)

```
工具名称(参数模式)

示例:
  Read(**)              — 允许读取所有文件
  Bash(git *)           — 允许 git 开头的 bash 命令
  FileWrite(src/**)     — 允许写入 src 目录下的文件
  WebFetch(https://*)   — 允许 HTTPS 请求
  Bash(rm -rf *)        — 拒绝 rm -rf 命令
```

## 权限检查流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#%E6%9D%83%E9%99%90%E6%A3%80%E6%9F%A5%E6%B5%81%E7%A8%8B)

```
tool.checkPermissions(context)
    ↓
1. 检查 deny 规则 → 匹配则 DENIED
    ↓
2. 检查 allow 规则 → 匹配则 ALLOWED
    ↓
3. 检查 ask 规则 → 匹配则 ASK_USER
    ↓
4. 检查工具默认 → isReadOnly() ? ALLOWED : ASK_USER
    ↓
5. 权限模式兜底:
   - default → ASK_USER
   - auto → 调用 YOLO 分类器
   - bypassAll → ALLOWED
   - plan → DENIED (禁止执行)
```

## YOLO 分类器 (auto 模式) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#yolo-%E5%88%86%E7%B1%BB%E5%99%A8-auto-%E6%A8%A1%E5%BC%8F)

在 `auto` 权限模式下，使用 AI 分类器判断操作安全性。核心函数为 `classifyYoloAction`（`src/utils/permissions/yoloClassifier.ts`），返回 `YoloClassifierResult`。

相关导出：

*   `AutoModeRules`: 自动模式规则类型
*   `getDefaultExternalAutoModeRules()`: 获取默认规则
*   `buildDefaultExternalSystemPrompt()`: 构建分类器系统提示词
*   `buildTranscriptForClassifier()`: 构建分类器输入上下文
*   `formatActionForClassifier()`: 格式化操作描述
*   `YOLO_CLASSIFIER_TOOL_NAME`: 分类器工具名 `'classify_result'`

分类器使用 AI 模型评估操作风险，低风险且符合规则则允许，高风险或不确定则拒绝（回退到 ASK_USER）。

### 分类器规则配置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#%E5%88%86%E7%B1%BB%E5%99%A8%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE)

json

```
{
  "autoMode": {
    "rules": [
      { "pattern": "Read(**)", "action": "allow" },
      { "pattern": "Bash(git *)", "action": "allow" },
      { "pattern": "Bash(npm *)", "action": "allow" },
      { "pattern": "FileWrite(src/**)", "action": "allow" },
      { "pattern": "Bash(rm *)", "action": "deny" },
      { "pattern": "Bash(sudo *)", "action": "deny" }
    ]
  }
}
```

## BashTool 安全系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#bashtool-%E5%AE%89%E5%85%A8%E7%B3%BB%E7%BB%9F)

BashTool 是最安全敏感的工具，拥有多项安全检查：

typescript

```
// BashTool 18 个模块
src/tools/BashTool/
├── BashTool.tsx              # 工具定义
├── BashToolResultMessage.tsx  # 结果渲染组件
├── prompt.ts                 # 安全提示词
├── bashCommandHelpers.ts     # 命令辅助函数
├── bashPermissions.ts        # 权限检查
├── bashSecurity.ts           # 安全检查
├── commandSemantics.ts       # 命令语义分析
├── commentLabel.ts           # 注释标签
├── destructiveCommandWarning.ts # 破坏性命令警告
├── modeValidation.ts         # 模式验证
├── pathValidation.ts         # 路径验证
├── readOnlyValidation.ts     # 只读验证
├── sedEditParser.ts          # sed 编辑解析
├── sedValidation.ts          # sed 验证
├── shouldUseSandbox.ts       # 沙盒判断
├── toolName.ts               # 工具名称
├── UI.tsx                    # UI 组件
├── utils.ts                  # 工具函数
└── ...
```

### 危险模式检测 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#%E5%8D%B1%E9%99%A9%E6%A8%A1%E5%BC%8F%E6%A3%80%E6%B5%8B)

BashTool 的安全检查通过 `BASH_SECURITY_CHECK_IDS`（`src/tools/BashTool/bashSecurity.ts`）管理，是一个数字枚举对象，包含 23+ 种安全检查类型：

typescript

```
// src/tools/BashTool/bashSecurity.ts
const BASH_SECURITY_CHECK_IDS = {
  INCOMPLETE_COMMANDS: 1,
  JQ_SYSTEM_FUNCTION: 2,
  JQ_FILE_ARGUMENTS: 3,
  OBFUSCATED_FLAGS: 4,
  SHELL_METACHARACTERS: 5,
  DANGEROUS_VARIABLES: 6,
  NEWLINES: 7,
  DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,
  DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,
  DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10,
  IFS_INJECTION: 11,
  GIT_COMMIT_SUBSTITUTION: 12,
  PROC_ENVIRON_ACCESS: 13,
  MALFORMED_TOKEN_INJECTION: 14,
  BACKSLASH_ESCAPED_WHITESPACE: 15,
  BRACE_EXPANSION: 16,
  CONTROL_CHARACTERS: 17,
  UNICODE_WHITESPACE: 18,
  MID_WORD_HASH: 19,
  ZSH_DANGEROUS_COMMANDS: 20,
  BACKSLASH_ESCAPED_OPERATORS: 21,
  COMMENT_QUOTE_DESYNC: 22,
  QUOTED_NEWLINE: 23,
  // ...
}
```

每个安全检查函数返回带 `checkId` 的结果，用于定位触发了哪项安全规则。

## Hook 安全拦截 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#hook-%E5%AE%89%E5%85%A8%E6%8B%A6%E6%88%AA)

Claude Code 支持在工具执行前后运行 Hook：

typescript

```
// Hook 类型 — 实际有 27 种事件（非 6 种）
// PrePrompt 和 PostResponse 不存在
type HookEvent =
  | 'PreToolUse' | 'PostToolUse' | 'PostToolUseFailure'
  | 'Notification' | 'UserPromptSubmit'
  | 'SessionStart' | 'SessionEnd' | 'Stop' | 'StopFailure'
  | 'SubagentStart' | 'SubagentStop'
  | 'PreCompact' | 'PostCompact'
  | 'PermissionRequest' | 'PermissionDenied'
  | 'Setup' | 'TeammateIdle'
  | 'TaskCreated' | 'TaskCompleted'
  | 'Elicitation' | 'ElicitationResult'
  | 'ConfigChange' | 'WorktreeCreate' | 'WorktreeRemove'
  | 'InstructionsLoaded' | 'CwdChanged' | 'FileChanged'

// Hook 可以阻止工具执行
interface HookResult {
  allow: boolean       // 是否允许继续
  message?: string     // 拒绝原因
  modified?: unknown   // 修改后的输入
}
```

## 企业策略 (policyLimits) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html#%E4%BC%81%E4%B8%9A%E7%AD%96%E7%95%A5-policylimits)

策略限制通过 `src/services/policyLimits/` 模块管理，主要函数为 `isPolicyAllowed`。

可控制内容包括：

*   工具白名单/黑名单（allowedTools / deniedTools）
*   MCP 服务器白名单/黑名单（allowedMcpServers / deniedMcpServers）
*   使用限制（单次会话最大成本、最大 token 等）
*   安全限制（强制权限模式、禁止 auto 模式等）