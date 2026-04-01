Title: 命令路由 (commands.ts) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html

Markdown Content:
`commands.ts` (~754 行) 是 Claude Code 的命令中枢，管理 **70+ 个斜杠命令**（含内部构建可达 100+）的导入、注册、分类与路由。

## 命令类型体系 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E5%91%BD%E4%BB%A4%E7%B1%BB%E5%9E%8B%E4%BD%93%E7%B3%BB)

Claude Code 定义了 3 种命令类型（由 `CommandBase` + 类型联合构成）：

typescript

```
// 命令联合类型 (src/types/command.ts L207)
type Command = CommandBase & (PromptCommand | LocalCommand | LocalJSXCommand)

// 命令基础属性 (L169-L200)
interface CommandBase {
  name: string
  description: string
  aliases?: string[]
  isEnabled?: () => boolean
  isHidden?: boolean
  availability?: CommandAvailability[]
  hasUserSpecifiedDescription?: boolean
  isMcp?: boolean
  argumentHint?: string
  whenToUse?: string
  version?: string
  disableModelInvocation?: boolean
  userInvocable?: boolean
  loadedFrom?: 'commands_DEPRECATED' | 'skills' | 'plugin' | 'managed' | 'bundled' | 'mcp'
  kind?: 'workflow'
  immediate?: boolean
  isSensitive?: boolean
  userFacingName?: () => string
}

// 1. 本地命令 — 懒加载本地模块 (L88-L92)
interface LocalCommand {
  type: 'local'
  supportsNonInteractive: boolean
  load: () => Promise<LocalCommandModule>
}

// 2. 本地 JSX 命令 — 懒加载 JSX 组件模块 (L139-L149)
interface LocalJSXCommand {
  type: 'local-jsx'
  load: () => Promise<LocalJSXCommandModule>
}

// 3. 提示命令 — 发送给 AI 模型的技能 (L24-L52)
interface PromptCommand {
  type: 'prompt'
  progressMessage: string
  contentLength: number
  argNames?: string[]
  allowedTools?: string[]
  model?: string
  source: SettingSource | 'builtin' | 'mcp' | 'plugin' | 'bundled'
  pluginInfo?: { pluginManifest: PluginManifest; repository: string }
  disableNonInteractive?: boolean
  hooks?: HooksSettings
  skillRoot?: string
  context?: 'inline' | 'fork'
  agent?: string
  effort?: EffortValue
  paths?: string[]
  getPromptForCommand(args: string, context: ToolUseContext): Promise<ContentBlockParam[]>
}
```

注意

文档中曾提到 `ResumeEntrypoint` 类型，实际代码中 `ResumeEntrypoint` 是一个字面量联合类型（`'cli_flag' | 'slash_command_picker' | ...`），而非独立的命令类型。

## 命令导入清单 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E5%91%BD%E4%BB%A4%E5%AF%BC%E5%85%A5%E6%B8%85%E5%8D%95)

`commands.ts` 通过记忆化函数返回 **~73 个基础命令** + 条件命令：

### 会话管理命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86%E5%91%BD%E4%BB%A4)

| 命令 | 类型 | 文件 | 功能 |
| --- | --- | --- | --- |
| `/init` | local | `commands/init.ts` | 项目初始化、CLAUDE.md 创建 |
| `/resume` | local-jsx | `commands/resume/` | 会话恢复浏览器 |
| `/session` | local-jsx | `commands/session/` | 会话 QR 码 + URL |
| `/branch` | local | `commands/branch/` | 工作目录分支 |
| `/clear` | local | `commands/clear/` | 清除会话 |
| `/exit` | local | `commands/exit/` | 退出程序 |
| `/compact` | local | `commands/compact/` | 手动会话压缩 |

### 代码操作命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E4%BB%A3%E7%A0%81%E6%93%8D%E4%BD%9C%E5%91%BD%E4%BB%A4)

| 命令 | 类型 | 文件 | 功能 |
| --- | --- | --- | --- |
| `/commit` | prompt | `commands/commit.ts` | Git 提交 |
| `/commit-push-pr` | prompt | `commands/commit-push-pr.ts` | 提交→推送→PR 全流程 |
| `/review` | prompt | `commands/review.ts` | 代码审查 |
| `/security-review` | prompt | `commands/security-review.ts` | 安全审查 |
| `/diff` | local-jsx | `commands/diff/` | 差异查看器 |
| `/pr_comments` | local-jsx | `commands/pr_comments/` | PR 评论 |

### 配置命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E9%85%8D%E7%BD%AE%E5%91%BD%E4%BB%A4)

| 命令 | 类型 | 文件 | 功能 |
| --- | --- | --- | --- |
| `/config` | local-jsx | `commands/config/` | 设置编辑器 |
| `/permissions` | local-jsx | `commands/permissions/` | 权限规则管理 |
| `/hooks` | local-jsx | `commands/hooks/` | 钩子配置 |
| `/model` | local-jsx | `commands/model/` | 模型选择器 |
| `/theme` | local-jsx | `commands/theme/` | 主题选择 |
| `/vim` | local | `commands/vim/` | Vim 模式切换 |
| `/voice` | local | `commands/voice/` | 语音模式切换 |

### 工具命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E5%B7%A5%E5%85%B7%E5%91%BD%E4%BB%A4)

| 命令 | 类型 | 文件 | 功能 |
| --- | --- | --- | --- |
| `/help` | local-jsx | `commands/help/` | 帮助文档 |
| `/export` | local-jsx | `commands/export/` | 导出会话 |
| `/copy` | local | `commands/copy/` | 复制到剪贴板 |
| `/stats` | local | `commands/stats/` | 会话统计 |
| `/cost` | local | `commands/cost/` | 成本查看 |
| `/doctor` | local-jsx | `commands/doctor/` | 健康诊断 |
| `/memory` | local | `commands/memory/` | 内存管理 |

### 高级/实验命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E9%AB%98%E7%BA%A7-%E5%AE%9E%E9%AA%8C%E5%91%BD%E4%BB%A4)

| 命令 | 类型 | 条件 | 功能 |
| --- | --- | --- | --- |
| `/agents` | local-jsx | — | Agent 管理界面 |
| `/tasks` | local-jsx | — | 后台任务管理 |
| `/bridge` | local-jsx | BRIDGE_MODE | Bridge 双向控制 |
| `/mcp` | local | — | MCP 服务器管理 |
| `/ultraplan` | prompt | ULTRAPLAN | 超级计划模式 |
| `/statusline` | prompt | — | 状态栏设置 |
| `/insights` | local | — | 会话分析洞察 |

## 命令过滤系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E5%91%BD%E4%BB%A4%E8%BF%87%E6%BB%A4%E7%B3%BB%E7%BB%9F)

### 3 种过滤列表 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#_3-%E7%A7%8D%E8%BF%87%E6%BB%A4%E5%88%97%E8%A1%A8)

typescript

```
// 远程模式安全命令 (L619, Set<Command>, 17个)
const REMOTE_SAFE_COMMANDS: Set<Command> = new Set([
  session, exit, clear, help, theme, color, vim,
  cost, usage, copy, btw, feedback, plan,
  keybindings, statusline, stickers, mobile
])

// Bridge 模式安全命令 (L651, Set<Command>, 6个)
const BRIDGE_SAFE_COMMANDS: Set<Command> = new Set([
  compact, clear, cost, summary, releaseNotes, files
])

// 内部专用命令 (L225, 31个, process.env.USER_TYPE === 'ant')
const INTERNAL_ONLY_COMMANDS: Command[] = [
  backfillSessions, breakCache, bughunter, commit, commitPushPr,
  ctx_viz, goodClaude, issue, initVerifiers, mockLimits,
  bridgeKick, version, resetLimits, resetLimitsNonInteractive,
  onboarding, share, summary, teleport, antTrace, perfIssue,
  env, oauthRefresh, debugToolCall, agentsPlatform, autofixPr,
  // + 条件性: forceSnip, ultraplan, subscribePr
]
```

### 命令可用性检查 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E5%91%BD%E4%BB%A4%E5%8F%AF%E7%94%A8%E6%80%A7%E6%A3%80%E6%9F%A5)

typescript

```
function meetsAvailabilityRequirement(command: Command): boolean {
  // 根据 command.availability 检查
  // 处理 'claude-ai' 和 'console' 两种可用性类型
  // 认证状态可能在会话中间改变，所以不做 memoize
}
```

### 命令发现流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E5%91%BD%E4%BB%A4%E5%8F%91%E7%8E%B0%E6%B5%81%E7%A8%8B)

typescript

```
// loadAllCommands() — 记忆化加载所有命令源（需要 cwd 参数）
const loadAllCommands = memoize(async (cwd: string): Promise<Command[]> => {
  // 合并所有命令源: 内置 + 技能 + 插件 + 工作流 + bundled
})

// getCommands() — 获取过滤后的最终命令列表
async function getCommands(cwd: string): Promise<Command[]> {
  const commands = await loadAllCommands(cwd)

  // 1. 过滤 meetsAvailabilityRequirement
  // 2. 过滤 isCommandEnabled
  // 3. 处理动态技能去重
  return filteredCommands
}

// 相关辅助函数
getMcpSkillCommands()        // L545 — 过滤 MCP prompt 类型命令
getSkillToolCommands()       // L563 — 获取所有可调用的 prompt 命令
getSlashCommandToolSkills()  // L584 — 过滤为纯技能
isBridgeSafeCommand()        // L676 — 检查 Bridge 模式安全性
```

## 命令执行上下文 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87)

注意

代码中**不存在**`CommandContext` 接口。`LocalJSXCommandContext`（`src/types/command.ts`）是最接近的类型，用于本地JSX命令。各命令使用解构的参数对象（字段因命令而异）。

## clearConversation() — 会话清除流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#clearconversation-%E2%80%94-%E4%BC%9A%E8%AF%9D%E6%B8%85%E9%99%A4%E6%B5%81%E7%A8%8B)

会话清除是最复杂的命令操作之一。实际函数接受解构参数对象 `{ setMessages, readFileState, discoveredSkillNames, loadedNestedMemoryPaths, getAppState, setAppState, setConversationId, ... }`，而非 `CommandContext`。

主要步骤：

1.   运行 SessionEnd hooks（`executeSessionEndHooks('clear', ...)`）
2.   计算需保留的后台任务 agentId
3.   清除消息（`setMessages(() => [])`）
4.   清除会话缓存（`clearSessionCaches(preservedAgentIds)`）
5.   重置工作目录、文件状态、技能缓存
6.   清理 AppState（保留后台任务，清除前台任务）
7.   重新生成 session ID（`regenerateSessionId({ setCurrentAsParent: true })`）
8.   保存 worktree 状态
9.   运行 SessionStart hooks（`processSessionStartHooks('clear')`）

### clearSessionCaches() — 20+ 缓存清除 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html#clearsessioncaches-%E2%80%94-20-%E7%BC%93%E5%AD%98%E6%B8%85%E9%99%A4)

```
contextCache          → 清除
commandsCache         → 清除
skillsCache           → 清除
promptCacheBreaker    → 清除
imagePathCache        → 清除
sessionIngressCache   → 清除
lspDiagnosticsCache   → 清除
completionCache       → 清除
toolSchemaCache       → 清除
mcpOutputStorage      → 清除
growthBookCache       → 清除
fileReadCache         → 清除
fileStateCache        → 清除
readFileTimestamps    → 清除
systemPromptSections  → 重置
...
```