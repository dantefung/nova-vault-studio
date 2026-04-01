Title: 后台服务 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html

Markdown Content:
本页目录

*   [后台服务一览](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#%E5%90%8E%E5%8F%B0%E6%9C%8D%E5%8A%A1%E4%B8%80%E8%A7%88 "后台服务一览")
*   [autoDream — 记忆整合](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#autodream-%E2%80%94-%E8%AE%B0%E5%BF%86%E6%95%B4%E5%90%88 "autoDream — 记忆整合")
*   [extractMemories — 自动记忆提取](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#extractmemories-%E2%80%94-%E8%87%AA%E5%8A%A8%E8%AE%B0%E5%BF%86%E6%8F%90%E5%8F%96 "extractMemories — 自动记忆提取")
*   [PromptSuggestion — 提示预测](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#promptsuggestion-%E2%80%94-%E6%8F%90%E7%A4%BA%E9%A2%84%E6%B5%8B "PromptSuggestion — 提示预测")
*   [AgentSummary — 进度摘要](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#agentsummary-%E2%80%94-%E8%BF%9B%E5%BA%A6%E6%91%98%E8%A6%81 "AgentSummary — 进度摘要")
*   [SessionMemory — 会话记忆](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#sessionmemory-%E2%80%94-%E4%BC%9A%E8%AF%9D%E8%AE%B0%E5%BF%86 "SessionMemory — 会话记忆")
*   [MagicDocs — 自动文档](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#magicdocs-%E2%80%94-%E8%87%AA%E5%8A%A8%E6%96%87%E6%A1%A3 "MagicDocs — 自动文档")

## 后台服务 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#%E5%90%8E%E5%8F%B0%E6%9C%8D%E5%8A%A1)

Claude Code 运行多个后台服务，在不影响主交互的情况下执行辅助任务。

## 后台服务一览 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#%E5%90%8E%E5%8F%B0%E6%9C%8D%E5%8A%A1%E4%B8%80%E8%A7%88)

| 服务 | 触发条件 | 功能 |
| --- | --- | --- |
| **autoDream** | 24h + 5 sessions | 跨会话记忆整合（实际: executeAutoDream/initAutoDream） |
| **extractMemories** | 每次会话结束 | 自动提取记忆（实际: executeExtractMemories/initExtractMemories） |
| **SessionMemory** | 长会话 | Markdown 记忆文件维护 |
| **MagicDocs** | MAGIC DOC 标记 | 自动更新文档 |
| **AgentSummary** | 持续运行 | 30s 周期 3-5 字进度摘要（实际: startAgentSummarization） |
| **PromptSuggestion** | 每次响应后 | 下一提示预测 + 预执行 |
| **toolUseSummary** | SDK 模式 | 工具调用批量摘要 |

## autoDream — 记忆整合 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#autodream-%E2%80%94-%E8%AE%B0%E5%BF%86%E6%95%B4%E5%90%88)

`executeAutoDream` 和 `initAutoDream`（`src/services/autoDream/autoDream.ts`）实现跨会话记忆整合。

门控条件：24 小时 + 至少 5 个新会话。启动后台 Agent 执行：

1.   分析近期会话的模式和教训
2.   更新 MEMORY.md 索引
3.   创建新的记忆条目
4.   清理过时记忆

## extractMemories — 自动记忆提取 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#extractmemories-%E2%80%94-%E8%87%AA%E5%8A%A8%E8%AE%B0%E5%BF%86%E6%8F%90%E5%8F%96)

`executeExtractMemories` 和 `initExtractMemories`（`src/services/extractMemories/extractMemories.ts`）在会话结束时自动提取关键记忆。

使用 AI 分析对话，提取用户偏好、项目模式、调试经验、重要决定等分类记忆，并写入记忆文件。

## PromptSuggestion — 提示预测 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#promptsuggestion-%E2%80%94-%E6%8F%90%E7%A4%BA%E9%A2%84%E6%B5%8B)

typescript

```
// 预测用户的下一个提示
// 注意: 源码中没有 generatePromptSuggestion、predictNextPrompt、speculativeExecute 函数
// 实际实现通过其他方式处理提示建议
```

## AgentSummary — 进度摘要 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#agentsummary-%E2%80%94-%E8%BF%9B%E5%BA%A6%E6%91%98%E8%A6%81)

`startAgentSummarization`（`src/services/AgentSummary/agentSummary.ts`）周期性生成 3-5 字进度摘要，用于在状态行显示当前 Agent 正在做什么。

## SessionMemory — 会话记忆 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#sessionmemory-%E2%80%94-%E4%BC%9A%E8%AF%9D%E8%AE%B0%E5%BF%86)

通过子 Agent 维护会话 Markdown 记忆文件，主要步骤：

1.   读取现有会话记忆
2.   分析新消息
3.   更新 Markdown 文件

## MagicDocs — 自动文档 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/background.html#magicdocs-%E2%80%94-%E8%87%AA%E5%8A%A8%E6%96%87%E6%A1%A3)

`updateMagicDocs`（`src/services/MagicDocs/magicDocs.ts`）处理带 MAGIC DOC 标记的文件自动更新。扫描项目目录中带标记的 Markdown 文件，通过 AI 分析项目变更并更新文档内容。
