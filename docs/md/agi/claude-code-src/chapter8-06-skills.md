Title: 技能系统 (Skill System) 深度剖析 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html

Markdown Content:
技能系统是 Claude Code 最重要的扩展框架之一，允许通过 **Markdown + YAML Frontmatter** 定义可复用的专业提示词，并将其注册为斜杠命令（`/skill-name`）或 LLM 可自动调用的工具。

## 系统全景 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E7%B3%BB%E7%BB%9F%E5%85%A8%E6%99%AF)

```
┌──────────────────────────────────────────────────┐
│                 5 大技能来源                       │
│  ┌──────────┐  ┌────────┐  ┌────────────────────┐│
│  │ Bundled  │  │ Skills │  │  Plugin / Managed  ││
│  │ (编译内置) │  │  Dir   │  │  (插件/策略管理)    ││
│  │ 10+ 技能  │  │ (磁盘)  │  │                    ││
│  └────┬─────┘  └───┬────┘  └────────┬───────────┘│
│       │            │                │             │
│  ┌────┴─────┐  ┌───┴────────────────┤             │
│  │ MCP 技能  │  │ Legacy commands/  │             │
│  │ (远程服务) │  │ (旧格式兼容)       │             │
│  └────┬─────┘  └───┬───────────────┘             │
│       │            │                              │
│       └────────┬───┘                              │
│                ▼                                  │
│   ┌────────────────────────┐                      │
│   │  getSkills() 聚合       │                      │
│   │  去重 → 排序 → Command[]│                      │
│   └──────────┬─────────────┘                      │
│              │                                    │
│    ┌─────────┴──────────┐                         │
│    ▼                    ▼                          │
│ ┌──────────────┐  ┌──────────────────┐            │
│ │ 斜杠命令面板   │  │ SkillTool        │            │
│ │ /skill-name  │  │ (LLM 自动调用)    │            │
│ │ (用户调用)    │  │                  │            │
│ └──────────────┘  └──────────────────┘            │
└──────────────────────────────────────────────────┘
```

## 核心文件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%A0%B8%E5%BF%83%E6%96%87%E4%BB%B6)

| 文件 | 位置 | 功能 |
| --- | --- | --- |
| `bundledSkills.ts` | `src/skills/` | 内置技能注册、文件提取 |
| `loadSkillsDir.ts` | `src/skills/` | 磁盘技能扫描、加载、去重 |
| `mcpSkillBuilders.ts` | `src/skills/` | MCP 技能循环依赖桥接 |
| `bundled/index.ts` | `src/skills/bundled/` | 所有内置技能的初始化入口 |
| `SkillTool.ts` | `src/tools/SkillTool/` | 技能执行工具 (LLM 调用入口) |
| `frontmatterParser.ts` | `src/utils/` | YAML frontmatter 解析 |
| `commands.ts` | `src/` | 命令聚合与排序 |

* * *

## 核心类型定义 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%A0%B8%E5%BF%83%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89)

### BundledSkillDefinition — 内置技能接口 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#bundledskilldefinition-%E2%80%94-%E5%86%85%E7%BD%AE%E6%8A%80%E8%83%BD%E6%8E%A5%E5%8F%A3)

typescript

```
type BundledSkillDefinition = {
  name: string
  description: string
  aliases?: string[]
  whenToUse?: string               // LLM 何时应调用此技能
  argumentHint?: string            // 参数提示
  allowedTools?: string[]          // 技能可使用的工具白名单
  model?: string                   // 指定模型
  disableModelInvocation?: boolean // true = 仅用户可调用，LLM 不可自动触发
  userInvocable?: boolean          // false = 仅 LLM 可调用
  isEnabled?: () => boolean        // 运行时可见性控制
  hooks?: HooksSettings            // 技能级 Hooks
  context?: 'inline' | 'fork'     // inline = 当前会话展开, fork = 子 agent
  agent?: string                   // 指定 agent 名称
  files?: Record<string, string>   // 附带参考文件 (相对路径 → 内容)
  getPromptForCommand: (           // 提示词生成函数
    args: string,
    context: ToolUseContext
  ) => Promise<ContentBlockParam[]>
}
```

### FrontmatterData — 磁盘技能前端数据 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#frontmatterdata-%E2%80%94-%E7%A3%81%E7%9B%98%E6%8A%80%E8%83%BD%E5%89%8D%E7%AB%AF%E6%95%B0%E6%8D%AE)

typescript

```
type FrontmatterData = {
  'allowed-tools'?: string | string[]   // 工具白名单
  description?: string                   // 技能描述
  'argument-hint'?: string              // 参数提示
  when_to_use?: string                  // 何时使用
  version?: string                      // 版本号
  model?: 'inherit' | 'haiku' | 'sonnet' | string  // 模型控制
  'user-invocable'?: string            // 用户可调用性
  hooks?: HooksSettings                 // 技能级 Hooks
  effort?: 'low' | 'medium' | 'high' | 'max' | number  // 思考力度
  context?: 'inline' | 'fork'          // 执行上下文
  agent?: string                        // agent 名称
  paths?: string | string[]            // glob 模式，条件激活
  shell?: 'bash' | 'powershell'        // Shell 类型
  arguments?: string | string[]         // 参数名列表
}
```

### LoadedFrom — 来源标识 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#loadedfrom-%E2%80%94-%E6%9D%A5%E6%BA%90%E6%A0%87%E8%AF%86)

typescript

```
type LoadedFrom =
  | 'commands_DEPRECATED'  // 旧 /commands/ 目录
  | 'skills'               // /skills/ 目录
  | 'plugin'               // 插件市场
  | 'managed'              // 企业策略管理
  | 'bundled'              // 编译内置
  | 'mcp'                  // MCP 服务器
```

* * *

## 技能生命周期 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%8A%80%E8%83%BD%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

### 阶段 1：定义与注册 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E9%98%B6%E6%AE%B5-1-%E5%AE%9A%E4%B9%89%E4%B8%8E%E6%B3%A8%E5%86%8C)

#### 内置技能注册 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E5%86%85%E7%BD%AE%E6%8A%80%E8%83%BD%E6%B3%A8%E5%86%8C)

`src/skills/bundled/index.ts` 在启动时同步调用 `initBundledSkills()`：

typescript

```
export function initBundledSkills(): void {
  // ━━ 始终注册 ━━
  registerUpdateConfigSkill()
  registerKeybindingsSkill()
  registerVerifySkill()
  registerDebugSkill()
  registerLoremIpsumSkill()
  registerSkillifySkill()
  registerRememberSkill()
  registerSimplifySkill()
  registerBatchSkill()
  registerStuckSkill()

  // ━━ 特性门控注册 ━━
  if (feature('KAIROS') || feature('KAIROS_DREAM'))
    registerDreamSkill()
  if (feature('REVIEW_ARTIFACT'))
    registerHunterSkill()
  if (feature('AGENT_TRIGGERS'))
    registerLoopSkill()
  if (feature('AGENT_TRIGGERS_REMOTE'))
    registerScheduleRemoteAgentsSkill()
  if (feature('BUILDING_CLAUDE_APPS'))
    registerClaudeApiSkill()
  if (shouldAutoEnableClaudeInChrome())
    registerClaudeInChromeSkill()
  if (feature('RUN_SKILL_GENERATOR'))
    registerRunSkillGeneratorSkill()
}
```

`registerBundledSkill()` 将定义转为 `Command` 对象：

typescript

```
function registerBundledSkill(definition: BundledSkillDefinition): void {
  let getPromptForCommand = definition.getPromptForCommand
  let skillRoot: string | undefined

  // 如果技能附带文件 → 包装提示词函数以懒提取
  if (files && Object.keys(files).length > 0) {
    skillRoot = getBundledSkillExtractDir(definition.name)
    let extractionPromise: Promise<string | null> | undefined

    const inner = definition.getPromptForCommand
    getPromptForCommand = async (args, ctx) => {
      // 延迟提取：首次调用时解压，Promise 被 memoize
      extractionPromise ??= extractBundledSkillFiles(definition.name, files)
      const extractedDir = await extractionPromise
      const blocks = await inner(args, ctx)
      if (extractedDir === null) return blocks
      return prependBaseDir(blocks, extractedDir)
    }
  }

  const command: Command = {
    type: 'prompt',
    name: definition.name,
    source: 'bundled',
    loadedFrom: 'bundled',
    skillRoot,
    context: definition.context,
    getPromptForCommand,
    // ...
  }
  bundledSkills.push(command)
}
```

#### 磁盘技能加载 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E7%A3%81%E7%9B%98%E6%8A%80%E8%83%BD%E5%8A%A0%E8%BD%BD)

`loadSkillsFromSkillsDir()` 扫描标准目录结构 `skill-name/SKILL.md`：

```
.claude/skills/
├── my-skill/
│   ├── SKILL.md           # 技能定义（frontmatter + prompt）
│   └── reference.txt      # 参考文件（可选）
├── another-skill/
│   └── SKILL.md
```

typescript

```
// 扫描流程
async function loadSkillsFromSkillsDir(
  dir: string,
  source: SettingSource,
  loadedFrom: LoadedFrom
): Promise<Command[]> {
  // 1. 列举目录下所有 SKILL.md
  const entries = await readdir(dir)

  // 2. 跳过 .gitignore 中的目录
  const gitignore = await loadGitignore(dir)

  // 3. 对每个 SKILL.md:
  for (const entry of entries) {
    const content = await readFile(join(dir, entry, 'SKILL.md'))

    // 4. 解析 YAML frontmatter
    const { frontmatter, content: body } = parseFrontmatter(content)

    // 5. 解析字段
    const fields = parseSkillFrontmatterFields(frontmatter)

    // 6. 创建 Command
    const command = createSkillCommand({
      name: entry,
      body,
      ...fields,
      source,
      loadedFrom,
      skillRoot: join(dir, entry),
    })

    commands.push(command)
  }
  return commands
}
```

### 阶段 2：聚合与去重 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E9%98%B6%E6%AE%B5-2-%E8%81%9A%E5%90%88%E4%B8%8E%E5%8E%BB%E9%87%8D)

`commands.ts` 中的 `getSkills()` 并行加载所有来源：

typescript

```
async function getSkills(cwd: string) {
  const [skillDirCommands, pluginSkills] = await Promise.all([
    getSkillDirCommands(cwd),      // 磁盘技能
    getPluginSkills(),              // 插件市场技能
  ])
  const bundledSkills = getBundledSkills()             // 内置技能（同步）
  const builtinPluginSkills = getBuiltinPluginSkillCommands() // 内置插件技能
  return { skillDirCommands, pluginSkills, bundledSkills, builtinPluginSkills }
}
```

最终命令列表的组装顺序（优先级从高到低）：

```
bundledSkills          ← 编译内置（最高优先）
builtinPluginSkills    ← 内置插件技能
skillDirCommands       ← 磁盘技能
workflowCommands       ← 工作流命令
pluginCommands         ← 插件命令
pluginSkills           ← 插件技能
COMMANDS()             ← 内置斜杠命令 (/help, /clear 等)
```

#### 去重机制（双层） [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E5%8E%BB%E9%87%8D%E6%9C%BA%E5%88%B6-%E5%8F%8C%E5%B1%82)

**第一层：文件身份去重**

typescript

```
// 通过 realpath 解决 symlink 去重
async function getFileIdentity(filePath: string): Promise<string | null> {
  try {
    return await realpath(filePath)  // 解析 symlink 到规范路径
  } catch { return null }
}

// 并行计算所有技能文件的 realpath
const fileIds = await Promise.all(
  allSkillsWithPaths.map(({ skill, filePath }) =>
    skill.type === 'prompt' ? getFileIdentity(filePath) : null
  )
)

// 第一个加载的获胜 (managed > user > project)
const seenFileIds = new Map<string, SettingSource>()
for (let i = 0; i < allSkillsWithPaths.length; i++) {
  const fileId = fileIds[i]
  if (seenFileIds.has(fileId)) {
    logForDebugging(`Skipping duplicate skill (same file)`)
    continue
  }
  seenFileIds.set(fileId, skill.source)
  deduplicatedSkills.push(skill)
}
```

**第二层：名称去重**

typescript

```
// getCommands() 中通过 uniqBy('name') 再次处理
const commands = uniqBy(allCommands, 'name')
```

去重设计要点：

*   使用 `realpath()` 而非 inode（避免 NFS/ExFAT/容器环境的不可靠性）
*   优先级：`managed > user > project > additional > legacy`

### 阶段 3：模型发现（上下文提示词注入） [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E9%98%B6%E6%AE%B5-3-%E6%A8%A1%E5%9E%8B%E5%8F%91%E7%8E%B0-%E4%B8%8A%E4%B8%8B%E6%96%87%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%B3%A8%E5%85%A5)

`getSkillToolCommands()` 过滤出 LLM 可调用的技能：

typescript

```
function getSkillToolCommands(): Command[] {
  return allCommands.filter(cmd =>
    !cmd.disableModelInvocation &&
    cmd.source !== 'builtin'
  )
}
```

#### 预算感知的技能列表 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E9%A2%84%E7%AE%97%E6%84%9F%E7%9F%A5%E7%9A%84%E6%8A%80%E8%83%BD%E5%88%97%E8%A1%A8)

技能列表注入 system prompt 时有严格的 Token 预算控制：

typescript

```
const SKILL_BUDGET_CONTEXT_PERCENT = 0.01  // 上下文窗口的 1%
const MAX_LISTING_DESC_CHARS = 250

function formatCommandsWithinBudget(commands: Command[]): string {
  // 优先级截断策略：
  // 1. 内置技能: 永不截断，完整展示描述
  // 2. 非内置技能: 按预算均分描述长度
  // 3. 极端情况: 非内置技能只展示名称
}
```

### 阶段 4：执行 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E9%98%B6%E6%AE%B5-4-%E6%89%A7%E8%A1%8C)

`SkillTool.ts` 是 LLM 调用技能的入口：

```
LLM → 调用 Skill 工具
        │
        ├── 1. 命令查找: getAllCommands() 合并本地 + MCP 技能
        │
        ├── 2. 上下文决策:
        │       ├── context === 'fork' → executeForkedSkill()
        │       │                        (隔离子 agent, 独立工具集)
        │       └── context === 'inline' → 直接展开到当前会话
        │
        ├── 3. 提示词生成: command.getPromptForCommand(args, ctx)
        │
        ├── 4. 变量替换:
        │       ├── ${CLAUDE_SKILL_DIR} → 技能目录路径
        │       ├── ${CLAUDE_SESSION_ID} → 当前会话 ID
        │       └── $arg_name → 用户参数
        │
        └── 5. Shell 命令执行 (非 MCP 技能):
                executeShellCommandsInPrompt()
                处理 !`...` 和 ```! ... ``` 块
```

* * *

## 多层级目录搜索 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E5%A4%9A%E5%B1%82%E7%BA%A7%E7%9B%AE%E5%BD%95%E6%90%9C%E7%B4%A2)

`getSkillDirCommands()` 按优先级搜索 5 个层级：

```
1. managed    → {MANAGED_FILE_PATH}/.claude/skills/     策略管理（不可禁用）
2. user       → ~/.claude/skills/                        用户级全局
3. project    → {projectDirs}/.claude/skills/            项目级（cwd 向上至 home）
4. additional → {--add-dir}/.claude/skills/              CLI --add-dir 指定
5. legacy     → {projectDirs}/commands/                  旧格式兼容
```

WARNING

`--bare` 模式下跳过除 `--add-dir` 外的所有自动发现。

### 动态技能发现 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E5%8A%A8%E6%80%81%E6%8A%80%E8%83%BD%E5%8F%91%E7%8E%B0)

当 LLM 读写文件时，沿文件路径向上查找 `.claude/skills/` 目录：

typescript

```
async function discoverSkillDirsForPaths(
  filePaths: string[],
  cwd: string
): Promise<string[]> {
  // 从文件的父目录向上走到 cwd
  // 跳过 .gitignore 中的目录
  // 已检查的路径缓存在 dynamicSkillDirs Set 中
}
```

* * *

## 条件技能（paths 激活） [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%9D%A1%E4%BB%B6%E6%8A%80%E8%83%BD-paths-%E6%BF%80%E6%B4%BB)

技能可通过 `paths` frontmatter 字段声明 glob 模式，仅当 LLM 操作匹配的文件时才激活：

yaml

```
---
description: React 组件专家
paths:
  - "src/components/**/*.tsx"
  - "src/hooks/**/*.ts"
---

你是 React 组件开发专家...
```

运行时管理：

typescript

```
// 全局条件技能注册表
const conditionalSkills = new Map<string, Command>()
const activatedConditionalSkillNames = new Set<string>()

// 当 LLM 操作文件时检查
function checkConditionalSkillActivation(filePath: string): void {
  for (const [name, skill] of conditionalSkills) {
    if (matchesGlob(filePath, skill.paths)) {
      activatedConditionalSkillNames.add(name)
    }
  }
}
```

* * *

## Frontmatter 解析 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#frontmatter-%E8%A7%A3%E6%9E%90)

typescript

```
const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)---\s*\n?/

function parseFrontmatter(
  markdown: string,
  sourcePath?: string
): ParsedMarkdown {
  const match = markdown.match(FRONTMATTER_REGEX)
  if (!match) return { frontmatter: {}, content: markdown }

  const frontmatterText = match[1]
  const content = markdown.slice(match[0].length)

  try {
    const parsed = parseYaml(frontmatterText)
    return { frontmatter: parsed, content }
  } catch {
    // 容错: 自动引用有问题的 YAML 值
    const quotedText = quoteProblematicValues(frontmatterText)
    const parsed = parseYaml(quotedText)
    return { frontmatter: parsed, content }
  }
}
```

`parseSkillFrontmatterFields()` 统一解析所有 frontmatter 字段，被文件加载和 MCP 加载两条路径共用。

* * *

## 技能磁盘格式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%8A%80%E8%83%BD%E7%A3%81%E7%9B%98%E6%A0%BC%E5%BC%8F)

### 标准 SKILL.md 文件 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%A0%87%E5%87%86-skill-md-%E6%96%87%E4%BB%B6)

markdown

```
---
description: 自动生成 API 文档
when_to_use: 当用户要求生成文档时
argument-hint: <api-endpoint>
allowed-tools:
  - Read
  - Grep
  - Write
model: sonnet
context: fork
effort: high
paths:
  - "src/api/**"
shell: bash
arguments:
  - endpoint
  - format
---

你是 API 文档生成专家。

## 任务
为 `$endpoint` 端点生成 `$format` 格式的文档。

## 参考
!`cat ${CLAUDE_SKILL_DIR}/templates/api-doc.md`
```

### Shell 命令内联 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#shell-%E5%91%BD%E4%BB%A4%E5%86%85%E8%81%94)

技能体中可嵌入动态 Shell 命令（非 MCP 来源才执行）：

markdown

```
当前项目结构：
!`find src -name "*.ts" | head -20`

最近 Git 日志：
!`git log --oneline -5`
```

行内 `!`command`` 和代码块 ````!` 两种格式均支持。

* * *

## 文件提取安全模型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%96%87%E4%BB%B6%E6%8F%90%E5%8F%96%E5%AE%89%E5%85%A8%E6%A8%A1%E5%9E%8B)

内置技能的 `files` 字段允许捆绑参考文件，这些文件在首次调用时懒提取到磁盘。

### 路径遍历防护 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E8%B7%AF%E5%BE%84%E9%81%8D%E5%8E%86%E9%98%B2%E6%8A%A4)

typescript

```
function resolveSkillFilePath(baseDir: string, relPath: string): string {
  const normalized = normalize(relPath)
  if (
    isAbsolute(normalized) ||
    normalized.split(pathSep).includes('..') ||
    normalized.split('/').includes('..')
  ) {
    throw new Error(`bundled skill file path escapes skill dir: ${relPath}`)
  }
  return join(baseDir, normalized)
}
```

### Symlink / TOCTOU 攻击防护 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#symlink-toctou-%E6%94%BB%E5%87%BB%E9%98%B2%E6%8A%A4)

typescript

```
// 1. 每进程随机 nonce 路径
//    /tmp/claude-{uid}/bundled-skills/{VERSION}/{hex-nonce}/
//    → 攻击者无法预测提取目录

// 2. 安全写入标志
const SAFE_WRITE_FLAGS =
  process.platform === 'win32'
    ? 'wx'  // Windows: 独占创建
    : fsConstants.O_WRONLY | fsConstants.O_CREAT
      | fsConstants.O_EXCL    // 文件已存在则失败
      | O_NOFOLLOW            // 拒绝 symlink 跟随

// 3. 严格权限
// 目录: 0o700 (owner rwx)
// 文件: 0o600 (owner rw)

// 4. 不自动重试
// EEXIST 时不 unlink+重建（防止中间路径 symlink 替换攻击）
```

### MCP 技能安全沙箱 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#mcp-%E6%8A%80%E8%83%BD%E5%AE%89%E5%85%A8%E6%B2%99%E7%AE%B1)

typescript

```
// MCP 应来远程不可信 — 禁止执行嵌入的 Shell 命令
if (loadedFrom !== 'mcp') {
  finalContent = await executeShellCommandsInPrompt(body, skillRoot, shell)
}
// MCP 来源的 !`...` 块不会被执行，仅作为纯文本传递
```

* * *

## MCP 技能集成 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#mcp-%E6%8A%80%E8%83%BD%E9%9B%86%E6%88%90)

### 循环依赖解耦 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96%E8%A7%A3%E8%80%A6)

`mcpSkillBuilders.ts` 作为无依赖的叶节点模块，通过写一次注册打破 import 环：

```
mcpClient.ts ──import──→ mcpSkills.ts ──import──→ loadSkillsDir.ts
                                                        │
                                            (循环! mcpClient.ts ←──×)
                                                        │
mcpSkillBuilders.ts ←── registerMCPSkillBuilders() ─────┘
       │
       └── getMCPSkillBuilders() ──→ mcpSkills.ts (运行时获取)
```

typescript

```
type MCPSkillBuilders = {
  createSkillCommand: typeof createSkillCommand
  parseSkillFrontmatterFields: typeof parseSkillFrontmatterFields
}

let builders: MCPSkillBuilders | null = null

// loadSkillsDir.ts 模块初始化时注册
function registerMCPSkillBuilders(b: MCPSkillBuilders): void {
  builders = b
}

// mcpSkills.ts 运行时获取
function getMCPSkillBuilders(): MCPSkillBuilders {
  if (!builders) throw new Error('MCP skill builders not registered')
  return builders
}
```

### MCP 技能特殊处理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#mcp-%E6%8A%80%E8%83%BD%E7%89%B9%E6%AE%8A%E5%A4%84%E7%90%86)

*   名称格式: `<server>:<skill>`
*   Shell 命令禁止执行
*   `${CLAUDE_SKILL_DIR}` 无意义（远程技能无本地目录）
*   `loadedFrom: 'mcp'` 标记

* * *

## 内置技能详解 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E5%86%85%E7%BD%AE%E6%8A%80%E8%83%BD%E8%AF%A6%E8%A7%A3)

### 始终注册的技能 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E5%A7%8B%E7%BB%88%E6%B3%A8%E5%86%8C%E7%9A%84%E6%8A%80%E8%83%BD)

| 技能名 | 用户可调 | LLM可调 | 限制 | 核心功能 |
| --- | --- | --- | --- | --- |
| `update-config` | ✅ | ✅ | 无 | 修改 settings.json/hooks 配置 |
| `keybindings` | ✅ | ✅ | `isKeybindingCustomizationEnabled()` | 自定义快捷键配置 |
| `verify` | ✅ | ✅ | ANT-ONLY | 运行应用并验证代码变更 |
| `debug` | ✅ | ❌ | 无 | 启用调试日志，tails debug log |
| `lorem-ipsum` | ✅ | ✅ | 无 | Token 对齐测试工具 |
| `skillify` | ✅ | ❌ | ANT-ONLY | 从当前会话提取可复用技能 |
| `remember` | ✅ | ✅ | ANT-ONLY + autoMem | 审查自动记忆，分类/提升 |
| `simplify` | ✅ | ✅ | 无 | 代码审查、清理、简化 |
| `batch` | ✅ | ❌ | 无 | 并行 worktree agent 批量变更 |
| `stuck` | ✅ | ✅ | ANT-ONLY | 诊断卡住的会话 |

### 特性门控技能 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E7%89%B9%E6%80%A7%E9%97%A8%E6%8E%A7%E6%8A%80%E8%83%BD)

| 技能名 | Feature Flag | 说明 |
| --- | --- | --- |
| `dream` | `KAIROS` / `KAIROS_DREAM` | 后台思考与规划 |
| `hunter` | `REVIEW_ARTIFACT` | 审查工件、深度代码审查 |
| `loop` | `AGENT_TRIGGERS` | 循环执行 cron 计划任务 |
| `schedule-remote-agents` | `AGENT_TRIGGERS_REMOTE` | 远程 agent 定时调度 |
| `claude-api` | `BUILDING_CLAUDE_APPS` | Claude API/SDK 开发辅助 |
| `claude-in-chrome` | 动态检测 | Chrome 浏览器集成 |
| `run-skill-generator` | `RUN_SKILL_GENERATOR` | 技能生成器 |

### batch 技能工作流 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#batch-%E6%8A%80%E8%83%BD%E5%B7%A5%E4%BD%9C%E6%B5%81)

```
/batch "为所有 API 端点添加错误处理"

1. Research Phase
   │  扫描代码库，理解现有错误处理模式
   ▼
2. Decompose Phase
   │  拆分为 5-30 个独立子任务
   ▼
3. Spawn Workers Phase
   │  为每个子任务:
   │  ├── 创建 git worktree (隔离分支)
   │  ├── 启动独立 Agent
   │  └── 每个 Worker 独立提交代码
   ▼
4. Track & Merge Phase
      监控各 Worker 状态
      处理失败重试
      创建 PR
```

### remember 技能工作流 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#remember-%E6%8A%80%E8%83%BD%E5%B7%A5%E4%BD%9C%E6%B5%81)

```
/remember

1. 扫描 ~/.claude/memories/ 目录
2. 对每条自动记忆进行分类:
   ├── 保留  (有价值但不提升)
   ├── 删除  (过时或冗余)
   └── 提升  (重要 → CLAUDE.md 或 CLAUDE.local.md)
3. 执行操作
4. 清理冗余文件
```

### debug 技能工作流 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#debug-%E6%8A%80%E8%83%BD%E5%B7%A5%E4%BD%9C%E6%B5%81)

```
/debug

1. 设置 CLAUDE_CODE_DEBUG=1 环境变量
2. 启动 tail -f 监听 debug log
3. 创建 Claude Code Guide agent
4. 引导用户复现问题
```

* * *

## 技能 Token 估算 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%8A%80%E8%83%BD-token-%E4%BC%B0%E7%AE%97)

typescript

```
function estimateSkillFrontmatterTokens(skill: SkillDefinition): number {
  // 估算各字段的 token 消耗:
  // name + description + whenToUse + argumentHint
  // 用于系统提示词的预算分配
  return nameTokens + descTokens + whenToUseTokens + hintTokens
}
```

* * *

## /skills 命令 UI [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#skills-%E5%91%BD%E4%BB%A4-ui)

typescript

```
// commands/skills/index.ts
const skills: Command = {
  type: 'local-jsx',
  name: 'skills',
  description: 'List available skills',
  load: () => import('./skills.js'),
}

// 渲染 SkillsMenu 组件
// 展示所有已加载的技能，包括来源、状态、描述
```

* * *

## 与插件系统的区别 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E4%B8%8E%E6%8F%92%E4%BB%B6%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%8C%BA%E5%88%AB)

| 方面 | 技能 (Skills) | 内置插件 (Builtin Plugins) |
| --- | --- | --- |
| **粒度** | 单个能力单元 | 技能 + Hooks + MCP 的容器 |
| **开关** | 无独立开关 | `/plugin` UI 中可启用/禁用 |
| **ID 格式** | 技能名 | `{name}@builtin` |
| **持久化** | 无状态 | 用户偏好持久化到 settings |
| **`Command.source`** | `'bundled'` / source | `'bundled'`（保持兼容） |
| **可包含** | 提示词 + 参考文件 | 技能 + hooks + MCP 服务器 |

* * *

## 架构决策总结 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/skills.html#%E6%9E%B6%E6%9E%84%E5%86%B3%E7%AD%96%E6%80%BB%E7%BB%93)

| 决策 | 原因 |
| --- | --- |
| **延迟文件提取** | bundled skill 的 `files` 仅首次调用时解压，Promise memoize 防竞态 |
| **MCP 桥接解耦** | `mcpSkillBuilders.ts` 无依赖叶节点，写一次注册打破 import 环 |
| **realpath 去重** | 避免 inode 在 NFS/ExFAT/容器环境的不可靠性 |
| **安全分层** | nonce 路径 + O_NOFOLLOW + O_EXCL + 0o600 权限 + MCP shell 禁执行 |
| **条件激活** | `paths` frontmatter + `discoverSkillDirsForPaths()` 按需加载 |
| **预算感知列表** | 内置技能描述永不截断，非内置按 1% 上下文窗口均分 |
| **来源优先级** | managed > user > project 确保企业策略覆盖用户设置 |
