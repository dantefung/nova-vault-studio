Title: 配置命令 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html

Markdown Content:
## 配置命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html#%E9%85%8D%E7%BD%AE%E5%91%BD%E4%BB%A4)

## /config — 设置界面 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html#config-%E2%80%94-%E8%AE%BE%E7%BD%AE%E7%95%8C%E9%9D%A2)

`/config` 是 `local-jsx` 类型命令，渲染 `Settings` 组件。

Settings 组件包含多个标签页：

*   **Config**: 通用配置（模型、权限模式等）
*   **Permissions**: 权限规则列表
*   **Hooks**: 钩子配置
*   **MCP**: MCP 服务器管理

## /permissions — 权限规则管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html#permissions-%E2%80%94-%E6%9D%83%E9%99%90%E8%A7%84%E5%88%99%E7%AE%A1%E7%90%86)

`/permissions` 是 `local-jsx` 类型命令，显示当前权限规则列表。

通过懒加载 `commands/permissions/` 目录中的模块渲染权限配置界面。

## /hooks — 钩子配置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html#hooks-%E2%80%94-%E9%92%A9%E5%AD%90%E9%85%8D%E7%BD%AE)

`/hooks` 是 `local-jsx` 类型命令，用于配置生命周期钩子。

钩子事件类型：

*   `PreToolUse` — 工具执行前
*   `PostToolUse` — 工具执行后
*   `SessionStart` — 会话开始
*   `SessionEnd` — 会话结束
*   `Notification` — 通知产生
*   `Stop` — AI 停止

## /model — 模型选择 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html#model-%E2%80%94-%E6%A8%A1%E5%9E%8B%E9%80%89%E6%8B%A9)

`/model` 是 `local-jsx` 类型命令，渲染 `ModelPicker` 组件。

ModelPicker 功能：

*   模型列表（显示可用模型）
*   快速模式切换（Fast ↔ Standard）
*   Effort 级别调整
*   Extra Usage 订阅管理

## /vim — Vim 模式切换 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html#vim-%E2%80%94-vim-%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2)

`/vim` 是 `local` 类型命令，切换编辑器模式（vim ↔ normal）。

通过懒加载 `commands/vim/` 目录中的模块执行切换逻辑。

## /advisor — 顾问模型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html#advisor-%E2%80%94-%E9%A1%BE%E9%97%AE%E6%A8%A1%E5%9E%8B)

`/advisor` 是 `local` 类型命令，用于设置或取消顾问模型。

顾问模型在主模型之前运行，提供额外分析。通过 `appState.advisorModel` 设置。

辅助函数：`canUserConfigureAdvisor`、`isValidAdvisorModel`、`isAdvisorEnabled`。
