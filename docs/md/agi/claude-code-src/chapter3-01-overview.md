Title: 工具百科概览 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/tools/

Markdown Content:
## 工具百科概览 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E5%B7%A5%E5%85%B7%E7%99%BE%E7%A7%91%E6%A6%82%E8%A7%88)

Claude Code 内置 **~38 个工具**，每个工具位于 `src/tools/` 下的独立目录中。工具是 AI 与外部世界交互的唯一通道。

## 完整工具列表 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E5%AE%8C%E6%95%B4%E5%B7%A5%E5%85%B7%E5%88%97%E8%A1%A8)

### 文件操作工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 | 安全性 |
| --- | --- | --- | --- |
| **FileReadTool** | `FileReadTool/` | 读取文件内容（支持行范围） | 只读 |
| **FileEditTool** | `FileEditTool/` | 精确编辑文件（查找替换） | 写入 |
| **FileWriteTool** | `FileWriteTool/` | 创建/覆写文件 | 写入 |

### 执行工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E6%89%A7%E8%A1%8C%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 | 安全性 |
| --- | --- | --- | --- |
| **BashTool** | `BashTool/` (18 个文件) | Shell 命令执行 | 最高风险 |
| **PowerShellTool** | `PowerShellTool/` | PowerShell 执行 | 最高风险 |
| **REPLTool** | `REPLTool/` | 代码执行沙盒 | 高风险 |

### 搜索工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E6%90%9C%E7%B4%A2%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 | 安全性 |
| --- | --- | --- | --- |
| **GlobTool** | `GlobTool/` | 文件路径模式搜索 | 只读 |
| **GrepTool** | `GrepTool/` | 文件内容正则搜索 | 只读 |
| **ToolSearchTool** | `ToolSearchTool/` | 搜索可用工具 | 只读 |
| **WebSearchTool** | `WebSearchTool/` | 网络搜索 | 只读 |

### AI 代理工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#ai-%E4%BB%A3%E7%90%86%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 | 安全性 |
| --- | --- | --- | --- |
| **AgentTool** | `AgentTool/` (15 个文件 + built-in/ 子目录) | 启动子 Agent | 递归风险 |
| **SendMessageTool** | `SendMessageTool/` | 发送消息给队友 | 低风险 |
| **SkillTool** | `SkillTool/` | 调用技能命令 | 取决于技能 |

### Web 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#web-%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 | 安全性 |
| --- | --- | --- | --- |
| **WebFetchTool** | `WebFetchTool/` | 获取网页内容 | 网络访问 |
| **WebSearchTool** | `WebSearchTool/` | 网络搜索 | 网络访问 |

### MCP 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#mcp-%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 | 安全性 |
| --- | --- | --- | --- |
| **MCPTool** | `MCPTool/` | 调用 MCP 服务器工具 | 取决于工具 |
| **ListMcpResourcesTool** | `ListMcpResourcesTool/` | 列出 MCP 资源 | 只读 |
| **ReadMcpResourceTool** | `ReadMcpResourceTool/` | 读取 MCP 资源 | 只读 |
| **McpAuthTool** | `McpAuthTool/` | MCP 认证 | 认证 |

### Task 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#task-%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 | 安全性 |
| --- | --- | --- | --- |
| **TaskCreateTool** | `TaskCreateTool/` | 创建后台任务 | 中等 |
| **TaskGetTool** | `TaskGetTool/` | 获取任务状态 | 只读 |
| **TaskListTool** | `TaskListTool/` | 列出所有任务 | 只读 |
| **TaskUpdateTool** | `TaskUpdateTool/` | 更新任务 | 低风险 |
| **TaskStopTool** | `TaskStopTool/` | 停止任务 | 中等 |
| **TaskOutputTool** | `TaskOutputTool/` | 获取任务输出 | 只读 |

### 其他工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E5%85%B6%E4%BB%96%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 | 安全性 |
| --- | --- | --- | --- |
| **AskUserQuestionTool** | `AskUserQuestionTool/` | 向用户提问 | 无风险 |
| **TodoWriteTool** | `TodoWriteTool/` | 写入待办事项 | 低风险 |
| **NotebookEditTool** | `NotebookEditTool/` | 编辑 Jupyter Notebook | 写入 |
| **SleepTool** | `SleepTool/` | 延迟执行 | 无风险 |
| **SyntheticOutputTool** | `SyntheticOutputTool/` | 合成输出 | 无风险 |
| **BriefTool** | `BriefTool/` | 简要模式工具 | 无风险 |
| **ConfigTool** | `ConfigTool/` | 配置工具 | 低风险 |
| **RemoteTriggerTool** | `RemoteTriggerTool/` | 远程触发 | 中等 |
| **LSPTool** | `LSPTool/` | LSP 操作 | 只读 |

### Worktree 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#worktree-%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 |
| --- | --- | --- |
| **EnterWorktreeTool** | `EnterWorktreeTool/` | 进入 Git worktree |
| **ExitWorktreeTool** | `ExitWorktreeTool/` | 退出 Git worktree |
| **EnterPlanModeTool** | `EnterPlanModeTool/` | 进入计划模式 |
| **ExitPlanModeTool** | `ExitPlanModeTool/` | 退出计划模式 |

### Team 工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#team-%E5%B7%A5%E5%85%B7)

| 工具 | 目录 | 功能 |
| --- | --- | --- |
| **TeamCreateTool** | `TeamCreateTool/` | 创建团队 |
| **TeamDeleteTool** | `TeamDeleteTool/` | 删除团队 |
| **ScheduleCronTool** | `ScheduleCronTool/` | 调度 Cron 任务 |

## 工具目录标准结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E5%B7%A5%E5%85%B7%E7%9B%AE%E5%BD%95%E6%A0%87%E5%87%86%E7%BB%93%E6%9E%84)

每个工具目录通常包含：

```
src/tools/ExampleTool/
├── ExampleTool.ts   # buildTool() 工厂调用，定义 name/inputSchema/call
├── prompt.ts        # 工具描述和使用示例
├── UI.tsx           # renderToolUseMessage / renderToolResultMessage
├── types.ts         # 工具特有类型（可选）
└── utils.ts         # 辅助函数（可选）
```

## 共享工具代码 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E5%85%B1%E4%BA%AB%E5%B7%A5%E5%85%B7%E4%BB%A3%E7%A0%81)

```
src/tools/shared/             # 工具间共享代码
├── gitOperationTracking.ts  # Git 操作跟踪
└── spawnMultiAgent.ts       # 多 Agent 启动

src/tools/utils.ts             # 工具级工具函数
src/tools/testing/             # 测试辅助
```

## 文档导航 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/#%E6%96%87%E6%A1%A3%E5%AF%BC%E8%88%AA)

| 文档 | 包含工具 |
| --- | --- |
| [文件操作工具](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/file-tools.html) | FileReadTool, FileEditTool, FileWriteTool |
| [Bash 执行工具](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/bash-tool.html) | BashTool（18 个文件详解） |
| [搜索工具](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/search-tools.html) | GlobTool, GrepTool, ToolSearchTool |
| [Agent 工具](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/agent-tool.html) | AgentTool（15 个文件 + built-in/ 详解） |
| [Web 工具](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/web-tools.html) | WebFetchTool, WebSearchTool |
| [MCP 工具](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/mcp-tools.html) | MCPTool, ListMcpResourcesTool, ReadMcpResourceTool, McpAuthTool |
| [Task 工具](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/task-tools.html) | TaskCreate/Get/List/Update/Stop/Output |
| [其他工具](https://plain-sun-1ffe.hunshcn429.workers.dev/tools/other-tools.html) | AskUserQuestion, TodoWrite, Notebook, Sleep, 等 |