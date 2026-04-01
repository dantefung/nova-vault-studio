Title: 插件与技能系统 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html

Markdown Content:
本页目录

*   [架构关系](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%9E%B6%E6%9E%84%E5%85%B3%E7%B3%BB "架构关系")
*   [插件系统 (plugins/)](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%8F%92%E4%BB%B6%E7%B3%BB%E7%BB%9F-plugins "插件系统 (plugins/)")
    *   [builtinPlugins.ts](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#builtinplugins-ts "builtinPlugins.ts")
    *   [bundled/index.ts](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#bundled-index-ts "bundled/index.ts")

*   [技能系统 (skills/)](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%8A%80%E8%83%BD%E7%B3%BB%E7%BB%9F-skills "技能系统 (skills/)")
    *   [bundledSkills.ts — 技能注册](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#bundledskills-ts-%E2%80%94-%E6%8A%80%E8%83%BD%E6%B3%A8%E5%86%8C "bundledSkills.ts — 技能注册")
    *   [内置技能清单](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E5%86%85%E7%BD%AE%E6%8A%80%E8%83%BD%E6%B8%85%E5%8D%95 "内置技能清单")
        *   [常驻技能](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E5%B8%B8%E9%A9%BB%E6%8A%80%E8%83%BD "常驻技能")
        *   [特性门控技能](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E7%89%B9%E6%80%A7%E9%97%A8%E6%8E%A7%E6%8A%80%E8%83%BD "特性门控技能")

    *   [loadSkillsDir.ts — 技能加载](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#loadskillsdir-ts-%E2%80%94-%E6%8A%80%E8%83%BD%E5%8A%A0%E8%BD%BD "loadSkillsDir.ts — 技能加载")
    *   [技能加载流程](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%8A%80%E8%83%BD%E5%8A%A0%E8%BD%BD%E6%B5%81%E7%A8%8B "技能加载流程")
    *   [mcpSkillBuilders.ts — 依赖解耦](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#mcpskillbuilders-ts-%E2%80%94-%E4%BE%9D%E8%B5%96%E8%A7%A3%E8%80%A6 "mcpSkillBuilders.ts — 依赖解耦")

*   [batch 技能详解](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#batch-%E6%8A%80%E8%83%BD%E8%AF%A6%E8%A7%A3 "batch 技能详解")
*   [remember 技能详解](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#remember-%E6%8A%80%E8%83%BD%E8%AF%A6%E8%A7%A3 "remember 技能详解")

## 插件与技能系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%8F%92%E4%BB%B6%E4%B8%8E%E6%8A%80%E8%83%BD%E7%B3%BB%E7%BB%9F)

Claude Code 的扩展性通过**插件**(Plugins)和**技能**(Skills)两个系统实现。

## 架构关系 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%9E%B6%E6%9E%84%E5%85%B3%E7%B3%BB)

```
┌─────────────┐    ┌─────────────┐
│   Plugins   │    │   Skills    │
│ (容器/包)    │    │ (能力单元)   │
│             │    │             │
│ ┌─────────┐ │    │ ┌─────────┐ │
│ │ Skill A │ │    │ │ Skill X │ │
│ │ Skill B │ │    │ │ Skill Y │ │
│ └─────────┘ │    │ └─────────┘ │
└─────────────┘    └─────────────┘
       │                  │
       └────────┬─────────┘
                ▼
        Command[] 注册
                │
                ▼
        命令面板可用
```

## 插件系统 (`plugins/`) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%8F%92%E4%BB%B6%E7%B3%BB%E7%BB%9F-plugins)

### builtinPlugins.ts [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#builtinplugins-ts)

`builtinPlugins.ts` 管理内置插件的注册和获取。

主要导出：

*   `BUILTIN_MARKETPLACE_NAME = 'builtin'`
*   `registerBuiltinPlugin(definition)` — 注册内置插件到 `BUILTIN_PLUGINS` Map
*   `isBuiltinPluginId(pluginId)` — 检查是否以 `@builtin` 结尾
*   `getBuiltinPlugins()` — 返回 `{ enabled, disabled }` 插件分组（基于用户设置的 `defaultEnabled` 字段）
*   `getBuiltinPluginSkillCommands()` — 将启用的插件技能转为 Command 对象

### bundled/index.ts [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#bundled-index-ts)

typescript

```
function initBuiltinPlugins(): void {
  // 当前为脚手架 — 尚无内置插件注册
}
```

## 技能系统 (`skills/`) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%8A%80%E8%83%BD%E7%B3%BB%E7%BB%9F-skills)

### bundledSkills.ts — 技能注册 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#bundledskills-ts-%E2%80%94-%E6%8A%80%E8%83%BD%E6%B3%A8%E5%86%8C)

typescript

```
interface BundledSkillDefinition {
  name: string
  description: string
  aliases?: string[]
  whenToUse?: string
  argumentHint?: string
  allowedTools?: string[]
  model?: string
  disableModelInvocation?: boolean
  userInvocable?: boolean
  isEnabled?: () => boolean
  hooks?: HooksSettings
  context?: string
  agent?: string
  files?: Record<string, string>  // 内嵌文件
  getPromptForCommand(): Promise<string>  // 懒加载提示
}

// 注册技能（含文件提取）
function registerBundledSkill(definition: BundledSkillDefinition): void {
  // 1. 添加到内部注册表
  // 2. 处理文件提取（如果有 files 字段）
}

// 确定性提取路径
function getBundledSkillExtractDir(skillName: string): string

// 安全文件提取
// - O_NOFOLLOW | O_EXCL (防符号链接攻击)
// - 0o700 目录权限，0o600 文件权限
// - TOCTOU 安全
```

### 内置技能清单 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E5%86%85%E7%BD%AE%E6%8A%80%E8%83%BD%E6%B8%85%E5%8D%95)

#### 常驻技能 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E5%B8%B8%E9%A9%BB%E6%8A%80%E8%83%BD)

| 技能名 | 功能 |
| --- | --- |
| `updateConfig` | 更新项目配置 |
| `keybindings` | 快捷键配置 |
| `verify` | 代码验证（Anthropic 内部） |
| `debug` | 启用调试日志 |
| `loremIpsum` | Lorem Ipsum 生成 |
| `skillify` | 技能文件生成 |
| `remember` | 记忆审查 — 分类/提升 |
| `simplify` | 简化代码 |
| `batch` | 批量并行编排（5-30 workers） |
| `stuck` | 卡住时的调试辅助 |

#### 特性门控技能 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E7%89%B9%E6%80%A7%E9%97%A8%E6%8E%A7%E6%8A%80%E8%83%BD)

| 技能名 | 特性门控 | 功能 |
| --- | --- | --- |
| `dream` | KAIROS | 后台思考 |
| `hunter` | REVIEW_ARTIFACT | 代码审查 |
| `loop` | AGENT_TRIGGERS | Agent 循环触发 |
| `scheduleRemoteAgents` | AGENT_TRIGGERS_REMOTE | 远程 Agent 调度 |
| `claudeApi` | BUILDING_CLAUDE_APPS | Claude API 辅助 |
| `claudeInChrome` | - | Chrome 集成 |
| `runSkillGenerator` | RUN_SKILL_GENERATOR | 技能生成器 |

### loadSkillsDir.ts — 技能加载 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#loadskillsdir-ts-%E2%80%94-%E6%8A%80%E8%83%BD%E5%8A%A0%E8%BD%BD)

技能加载模块的主要导出：

*   `LoadedFrom` 类型：`'commands_DEPRECATED' | 'skills' | 'plugin' | 'managed' | 'bundled' | 'mcp'`
*   `getSkillsPath(source, dir)` — 解析技能路径
*   `estimateSkillFrontmatterTokens(skill)` — 估算 Token 数
*   `getFileIdentity(filePath)` — 通过 `realpath` 解析符号链接，返回 `Promise<string | null>`（async 函数），确保同一文件不重复加载
*   `parseSkillFrontmatterFields(frontmatter, markdownContent, skillName)` — 解析 YAML frontmatter（前 30 行），提取 name、description、whenToUse、model、hooks、paths 等字段。注意实际接受 3 个参数。

### 技能加载流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#%E6%8A%80%E8%83%BD%E5%8A%A0%E8%BD%BD%E6%B5%81%E7%A8%8B)

```
┌──────────────────┐
│ initBundledSkills │
│ (启动时)          │
└────────┬─────────┘
         ▼
┌──────────────────┐   ┌──────────────────┐
│ 扫描 skills/ 目录 │   │ 加载 MCP 技能     │
│ (文件系统)        │   │ (MCP 服务器)      │
└────────┬─────────┘   └────────┬──────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
         ┌─────────────────┐
         │ 去重（realpath）  │
         │ .gitignore 过滤  │
         └────────┬────────┘
                  ▼
         ┌──────────────────┐
         │ Command[] 注册    │
         │ (skils → commands)│
         └──────────────────┘
```

### mcpSkillBuilders.ts — 依赖解耦 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#mcpskillbuilders-ts-%E2%80%94-%E4%BE%9D%E8%B5%96%E8%A7%A3%E8%80%A6)

typescript

```
interface MCPSkillBuilders {
  createSkillCommand: (def: MCPSkillDef) => Command
  parseSkillFrontmatterFields: (content: string) => SkillMetadata
}

// 一次性注册（打破循环依赖）
function registerMCPSkillBuilders(b: MCPSkillBuilders): void
function getMCPSkillBuilders(): MCPSkillBuilders
```

## batch 技能详解 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#batch-%E6%8A%80%E8%83%BD%E8%AF%A6%E8%A7%A3)

```
/batch "为所有 API 端点添加日志"

┌─────────────────────────────┐
│ 1. Research Phase            │
│    扫描代码库，理解模式      │
├─────────────────────────────┤
│ 2. Decompose Phase           │
│    拆分为 5-30 个独立任务    │
├─────────────────────────────┤
│ 3. Spawn Workers Phase       │
│    为每个任务创建 git worktree│
│    启动并行 Agent             │
├─────────────────────────────┤
│ 4. Track PRs Phase           │
│    监控各 PR 状态             │
│    处理失败重试               │
└─────────────────────────────┘
```

## remember 技能详解 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html#remember-%E6%8A%80%E8%83%BD%E8%AF%A6%E8%A7%A3)

```
/remember

1. 扫描自动记忆目录
2. 逐条分类（保留/删除/提升）
3. 提升到 CLAUDE.md 或 CLAUDE.local.md
4. 清理冗余记忆
```
