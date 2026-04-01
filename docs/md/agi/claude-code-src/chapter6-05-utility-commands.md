Title: 工具与系统命令 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html

Markdown Content:
## 工具与系统命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#%E5%B7%A5%E5%85%B7%E4%B8%8E%E7%B3%BB%E7%BB%9F%E5%91%BD%E4%BB%A4)

## /help — 帮助界面 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#help-%E2%80%94-%E5%B8%AE%E5%8A%A9%E7%95%8C%E9%9D%A2)

typescript

```
// help/ — local-jsx 类型
const helpCommand: LocalJSXCommand = {
  name: 'help',
  type: 'local-jsx',
  Component: ({ commands }) => <HelpV2 commands={commands} />,
}

// HelpV2 显示:
// - 所有可用命令列表
// - 快捷键参考
// - 使用示例
// - 链接到在线文档
```

## /doctor — 环境诊断 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#doctor-%E2%80%94-%E7%8E%AF%E5%A2%83%E8%AF%8A%E6%96%AD)

Doctor 是 3 个主屏幕之一（`src/screens/Doctor.tsx`），使用 React/Ink 渲染。

诊断检查项：

*   使用 `getDoctorDiagnostic()` 获取诊断信息
*   使用 `checkContextWarnings()` 检查上下文警告
*   包含 `SandboxDoctorSection`、`McpParsingWarnings`、`KeybindingWarnings` 等子组件

实际组件使用 useState/useEffect/memo 等 React Hooks，结构较为复杂。

## /login & /logout — 认证管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#login-logout-%E2%80%94-%E8%AE%A4%E8%AF%81%E7%AE%A1%E7%90%86)

*   **`/login`**：`local-jsx` 类型，渲染 `ConsoleOAuthFlow` 组件。登录后依次获取 OAuth tokens、用户 profile、API key、角色/权限。
*   **`/logout`**：`local` 类型，通过加载 `commands/logout/` 模块执行登出流程。

## /install — 安装更新 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#install-%E2%80%94-%E5%AE%89%E8%A3%85%E6%9B%B4%E6%96%B0)

`/install` 是 `local-jsx` 类型命令，使用状态机驱动的安装流程。

安装步骤由多个独立的 Step 组件实现： `CheckGitHubStep` → `ChooseRepoStep` → `InstallAppStep` → `ApiKeyStep` → `CreatingStep` → `SuccessStep / ErrorStep / WarningsStep`

无通用 Flow/Step 组件，每步都是独立组件。

## /agents — Agent 管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#agents-%E2%80%94-agent-%E7%AE%A1%E7%90%86)

`/agents` 是 `local-jsx` 类型命令，列出配置的 Agent：

*   项目级 Agent（`.claude/agents/`）
*   用户级 Agent（`~/.claude/agents/`）
*   托管 Agent（企业远程推送）

显示覆盖/遮蔽关系。

## /tasks — 后台任务管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#tasks-%E2%80%94-%E5%90%8E%E5%8F%B0%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86)

`/tasks` 是 `local-jsx` 类型命令，显示所有后台任务的状态。

使用 `useAppState` 获取任务列表，支持查看任务状态和停止任务等操作。

## /context — 上下文可视化 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#context-%E2%80%94-%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8F%AF%E8%A7%86%E5%8C%96)

两种模式：

*   **交互模式**（`local-jsx`）：将消息转换为 API 视图，经过微压缩处理，分析上下文使用情况，以可视化界面显示
*   **非交互模式**（`local`）：收集上下文数据，格式化为 Markdown 表格输出

## /extra-usage — 订阅管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#extra-usage-%E2%80%94-%E8%AE%A2%E9%98%85%E7%AE%A1%E7%90%86)

typescript

```
// extra-usage/ — 管理额外用量订阅
// - 管理员请求提升配额
// - 查看当前用量
// - 链接到 billing 页面
```

## /desktop — 桌面迁移 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html#desktop-%E2%80%94-%E6%A1%8C%E9%9D%A2%E8%BF%81%E7%A7%BB)

typescript

```
// desktop/ — local-jsx 类型
function DesktopHandoff(): ReactNode {
  // 引导用户从 CLI 迁移到桌面应用
}
```
