Title: 内存目录系统 (memdir) | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html

Markdown Content:
本页目录

*   [核心概念](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5 "核心概念")
*   [文件架构](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#%E6%96%87%E4%BB%B6%E6%9E%B6%E6%9E%84 "文件架构")
    *   [memdir.ts — 核心模块](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#memdir-ts-%E2%80%94-%E6%A0%B8%E5%BF%83%E6%A8%A1%E5%9D%97 "memdir.ts — 核心模块")
    *   [paths.ts — 路径解析](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#paths-ts-%E2%80%94-%E8%B7%AF%E5%BE%84%E8%A7%A3%E6%9E%90 "paths.ts — 路径解析")
    *   [memoryTypes.ts — 四类记忆](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#memorytypes-ts-%E2%80%94-%E5%9B%9B%E7%B1%BB%E8%AE%B0%E5%BF%86 "memoryTypes.ts — 四类记忆")
    *   [memoryScan.ts — 记忆扫描](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#memoryscan-ts-%E2%80%94-%E8%AE%B0%E5%BF%86%E6%89%AB%E6%8F%8F "memoryScan.ts — 记忆扫描")
    *   [findRelevantMemories.ts — AI 检索](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#findrelevantmemories-ts-%E2%80%94-ai-%E6%A3%80%E7%B4%A2 "findRelevantMemories.ts — AI 检索")
    *   [memoryAge.ts — 新鲜度计算](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#memoryage-ts-%E2%80%94-%E6%96%B0%E9%B2%9C%E5%BA%A6%E8%AE%A1%E7%AE%97 "memoryAge.ts — 新鲜度计算")
    *   [teamMemPaths.ts — 团队记忆](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#teammempaths-ts-%E2%80%94-%E5%9B%A2%E9%98%9F%E8%AE%B0%E5%BF%86 "teamMemPaths.ts — 团队记忆")
    *   [teamMemPrompts.ts — 团队记忆提示](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#teammemprompts-ts-%E2%80%94-%E5%9B%A2%E9%98%9F%E8%AE%B0%E5%BF%86%E6%8F%90%E7%A4%BA "teamMemPrompts.ts — 团队记忆提示")

*   [安全防护](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#%E5%AE%89%E5%85%A8%E9%98%B2%E6%8A%A4 "安全防护")

`src/memdir/` 包含 **8 个文件**，实现了 Claude Code 的持久记忆系统。

## 核心概念 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5)

记忆系统基于 `MEMORY.md` 文件：

```
~/.claude/
├── MEMORY.md              # 全局记忆入口（最多 200 行 / 25KB）
├── memories/              # 自动记忆子目录
│   ├── user-preference.md
│   ├── project-setup.md
│   └── ...
project/
├── CLAUDE.md              # 项目级记忆（自动加载）
├── CLAUDE.local.md        # 本地记忆（gitignore）
└── .claude/
    └── memories/          # 项目级自动记忆
```

## 文件架构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#%E6%96%87%E4%BB%B6%E6%9E%B6%E6%9E%84)

### memdir.ts — 核心模块 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#memdir-ts-%E2%80%94-%E6%A0%B8%E5%BF%83%E6%A8%A1%E5%9D%97)

typescript

```
// 常量
const ENTRYPOINT_NAME = 'MEMORY.md'
const MAX_ENTRYPOINT_LINES = 200
const MAX_ENTRYPOINT_BYTES = 25000

// 类型
interface EntrypointTruncation {
  content: string
  lineCount: number
  byteCount: number
  wasLineTruncated: boolean
  wasByteTruncated: boolean
}

// 双重截断（行数 + 字节数）
function truncateEntrypointContent(raw: string): EntrypointTruncation {
  let content = raw
  let wasLineTruncated = false
  let wasByteTruncated = false

  // 1. 行截断
  const lines = content.split('\n')
  if (lines.length > MAX_ENTRYPOINT_LINES) {
    content = lines.slice(0, MAX_ENTRYPOINT_LINES).join('\n')
    wasLineTruncated = true
  }

  // 2. 字节截断
  if (Buffer.byteLength(content) > MAX_ENTRYPOINT_BYTES) {
    content = content.slice(0, MAX_ENTRYPOINT_BYTES)
    wasByteTruncated = true
  }

  return { content, lineCount: lines.length, byteCount: Buffer.byteLength(content), wasLineTruncated, wasByteTruncated }
}

// 四类记忆分类指导
function buildMemoryLines(): string[] {
  // 生成记忆类型分类提示
  // user / feedback / project / reference
}
```

### paths.ts — 路径解析 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#paths-ts-%E2%80%94-%E8%B7%AF%E5%BE%84%E8%A7%A3%E6%9E%90)

typescript

```
// 5 级优先级的自动记忆开关
function isAutoMemoryEnabled(): boolean {
  // 1. 环境变量覆盖
  // 2. bare 模式关闭
  // 3. CCR 模式关闭
  // 4. settings.json 配置
  // 5. 默认启用
}

// 记忆基础目录
function getMemoryBaseDir(): string {
  // CLAUDE_CODE_REMOTE_MEMORY_DIR > ~/.claude
}

// 自动记忆路径（带安全校验）
function getAutoMemPath(): string | null {
  // 项目级记忆目录
  // 校验：拒绝相对路径、根目录、遍历攻击
}
```

### memoryTypes.ts — 四类记忆 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#memorytypes-ts-%E2%80%94-%E5%9B%9B%E7%B1%BB%E8%AE%B0%E5%BF%86)

typescript

```
const MEMORY_TYPES = ['user', 'feedback', 'project', 'reference'] as const
type MemoryType = typeof MEMORY_TYPES[number]
```

| 类型 | 范围 | 用途 |
| --- | --- | --- |
| `user` | 全局 | 用户偏好、习惯 |
| `feedback` | 全局 | 用户反馈、纠正 |
| `project` | 项目 | 项目配置、约定 |
| `reference` | 项目 | 技术参考、API 记录 |

每种类型都有 XML 格式的定义：

xml

```
<scope>全局/项目</scope>
<description>记忆类型描述</description>
<when_to_save>何时保存</when_to_save>
<how_to_use>如何使用</how_to_use>
<body_structure>内容结构</body_structure>
<examples>示例</examples>
```

### memoryScan.ts — 记忆扫描 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#memoryscan-ts-%E2%80%94-%E8%AE%B0%E5%BF%86%E6%89%AB%E6%8F%8F)

typescript

```
interface MemoryHeader {
  filename: string
  filePath: string
  mtimeMs: number
  description: string
  type: MemoryType
}

const MAX_MEMORY_FILES = 200
const FRONTMATTER_MAX_LINES = 30

// 递归扫描 .md 文件
async function scanMemoryFiles(
  memoryDir: string,
  signal?: AbortSignal
): Promise<MemoryHeader[]> {
  // 1. 递归扫描所有 .md 文件
  // 2. 解析 frontmatter（前 30 行）
  // 3. 按修改时间倒序排列（最新优先）
  // 4. 截断到 200 个文件
}

// 格式化为一行一文件的清单
function formatMemoryManifest(memories: MemoryHeader[]): string
```

### findRelevantMemories.ts — AI 检索 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#findrelevantmemories-ts-%E2%80%94-ai-%E6%A3%80%E7%B4%A2)

typescript

```
interface RelevantMemory {
  path: string
  mtimeMs: number
}

// Sonnet 驱动的记忆选择（最多 5 条）
async function findRelevantMemories(
  query: string,
  memoryDir: string,
  signal?: AbortSignal,
  recentTools?: string[],
  alreadySurfaced?: string[]
): Promise<RelevantMemory[]> {
  // 1. 扫描记忆目录获取清单
  // 2. 排除已展示的记忆
  // 3. 发送侧查询到 Sonnet，附带最近工具上下文
  // 4. 模型选择最相关的 ≤5 条记忆
}
```

### memoryAge.ts — 新鲜度计算 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#memoryage-ts-%E2%80%94-%E6%96%B0%E9%B2%9C%E5%BA%A6%E8%AE%A1%E7%AE%97)

typescript

```
function memoryAge(mtimeMs: number): string {
  // "today" / "yesterday" / "N days ago"
}

function memoryFreshnessNote(mtimeMs: number): string {
  // >1 天的记忆包裹在 <system-reminder> 标签中
  // 提醒模型注意时效性
}
```

### teamMemPaths.ts — 团队记忆 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#teammempaths-ts-%E2%80%94-%E5%9B%A2%E9%98%9F%E8%AE%B0%E5%BF%86)

typescript

```
class PathTraversalError extends Error {}

// 路径消毒（防止遍历攻击）
function sanitizePathKey(key: string): string {
  // 拒绝：null 字节、URL 编码遍历、Unicode 规范化攻击
  // 拒绝：反斜杠、绝对路径
}

function isTeamMemoryEnabled(): boolean {
  // 需要 autoMemory + 特性门控
}
```

### teamMemPrompts.ts — 团队记忆提示 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#teammemprompts-ts-%E2%80%94-%E5%9B%A2%E9%98%9F%E8%AE%B0%E5%BF%86%E6%8F%90%E7%A4%BA)

typescript

```
function buildCombinedMemoryPrompt(
  extraGuidelines?: string,
  skipIndex?: boolean
): string {
  // 合并私有记忆 + 团队记忆的提示
  // 两步保存流程：
  //   1. 写入文件（含 frontmatter）
  //   2. 在 MEMORY.md 索引中添加指针
}
```

## 安全防护 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html#%E5%AE%89%E5%85%A8%E9%98%B2%E6%8A%A4)

*   **路径遍历防护**: `sanitizePathKey()` 拒绝 `../`、null 字节、Unicode 攻击
*   **符号链接安全**: `PathTraversalError` 阻止符号链接跟踪
*   **大小限制**: 200 行 / 25KB 入口点截断，200 文件上限
*   **特性门控**: 团队记忆需要独立的特性门控
