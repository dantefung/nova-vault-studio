Title: 会话管理命令 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html

Markdown Content:
## 会话管理命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html#%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86%E5%91%BD%E4%BB%A4)

## /clear — 清除对话 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html#clear-%E2%80%94-%E6%B8%85%E9%99%A4%E5%AF%B9%E8%AF%9D)

`clearConversation()` 是最复杂的命令之一，执行 20+ 步清理：

1.   触发 `SessionEnd` hooks（通过 `executeSessionEndHooks`）
2.   计算需保留的后台任务 agentId
3.   清空消息（`setMessages(() => [])`）
4.   清除会话缓存（`clearSessionCaches(preservedAgentIds)`，传入保留的 agentId）
5.   重置工作目录和文件状态
6.   清理 AppState（保留后台任务）
7.   重新生成 session ID（`regenerateSessionId({ setCurrentAsParent: true })`）
8.   保存 worktree 状态
9.   触发 `SessionStart` hooks（通过 `processSessionStartHooks`）

> 注意：实际函数签名接受解构参数对象 `{ setMessages, readFileState, discoveredSkillNames, loadedNestedMemoryPaths, getAppState, setAppState, setConversationId, ... }`，而非 `CommandContext`。代码位于 `src/commands/clear/conversation.ts`。

### clearSessionCaches() — 20+ 缓存清除 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html#clearsessioncaches-%E2%80%94-20-%E7%BC%93%E5%AD%98%E6%B8%85%E9%99%A4)

`clearSessionCaches(preservedAgentIds)` 清理 20+ 项缓存，包括：上下文缓存、命令缓存、技能缓存、提示词缓存、图片路径缓存、LSP 诊断缓存、工具 schema 缓存、MCP 输出缓存、GrowthBook 缓存、文件读取缓存等。

## /compact — 上下文压缩 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html#compact-%E2%80%94-%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8E%8B%E7%BC%A9)

`/compact` 命令触发手动会话压缩。主要流程：

1.   **Session Memory Compact**（如果启用了自动记忆功能）：提取会话记忆
2.   **Reactive Compact**：通过 `tryReactiveCompact` 执行反应式压缩
3.   **Traditional Compact**：通过压缩服务生成会话摘要，替换旧消息

压缩完成后更新消息列表。

## /resume — 恢复会话 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html#resume-%E2%80%94-%E6%81%A2%E5%A4%8D%E4%BC%9A%E8%AF%9D)

Resume 命令使用 `local-jsx` 类型，渲染一个会话选择界面。

主要功能：

1.   通过 `getHistory()` 列出历史会话
2.   支持搜索过滤
3.   选择后加载对应会话

> 注意：实际组件和选择器的实现位于 `src/commands/resume/` 目录中。

## /export — 导出对话 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html#export-%E2%80%94-%E5%AF%BC%E5%87%BA%E5%AF%B9%E8%AF%9D)

导出命令将当前对话渲染为 Markdown 文件并保存到工作目录。

主要步骤：

1.   将消息列表转换为文本格式（区分 Human/Assistant 角色）
2.   生成带时间戳的文件名
3.   写入到当前工作目录

## /diff — 文件变更 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html#diff-%E2%80%94-%E6%96%87%E4%BB%B6%E5%8F%98%E6%9B%B4)

`/diff` 命令使用 `local-jsx` 类型，显示当前会话中的所有文件变更。

主要功能：

1.   从消息历史中收集所有文件变更
2.   按文件分组显示差异
3.   支持滚动浏览

实际组件位于 `src/commands/diff/` 目录中。
