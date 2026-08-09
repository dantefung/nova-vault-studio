---
title: "Harness 101：复刻 Dynamic Workflow（含代码）"
date: "2026-08-09"
source: "飞书文档"
url: "https://my.feishu.cn/wiki/TM25wR9ozih8yRkaAVKcFjP1nMq"
---

# Harness 101：复刻 Dynamic Workflow（含代码）

> Dynamic Workflow 结合了程序的稳定性和 Agent 的主观能动性：需要判断和探索的地方留给 Agent，循环次数、并发调度、结果聚合和停止条件交还给代码。本文是 DeerFlow 3.0（DeerWork）的开源实践，包含完整代码和 API 设计。

## 前言：Agentic 与 Workflow 的演进

- 2023-2024：Dify/Coze 可视化 Workflow，流程固定但难处理开放任务
- 2025-2026：ReAct Loop + Agent + Skills，灵活性高但稳定性差
- 当前：Dynamic Workflow——模型针对当前任务临时编写 Harness 代码，持续自我迭代

## Skill 的局限性（四个 Failure Mode）

1. **固定步骤也要反复经过模型**：机械流程在 ReAct Loop 中逐轮理解执行，消耗 Token，结果不确定
2. **写在清单里不等于稳定执行**：Skill 本质是指令，由 Claude 按 Turn 决定下一步；Workflow 是脚本，由 Runtime 决定
3. **自我迭代对象只有 Prompt**：改进难以验证，修复一个问题可能引入新问题
4. **跨模型差异会被流程放大**：流程越长，模型差异越容易累积

## Dynamic Workflow 核心概念

**本质**：一段由 Workflow Runtime 注入宿主 API 的 JavaScript 脚本，不依赖特定 Agent Harness。

**分工**：
- JavaScript 负责：去重、排序、流控、循环、并行、If/Else、结果聚合
- `agent()` 负责：语义判断、理解上下文、评价证据、做出决策

### API 一览

| API | 说明 |
|-----|------|
| `agent(instruction, options)` | 启动独立 Context 的 Sub-Agent，默认返回文本，传入 schema 返回结构化对象 |
| `parallel(thunks)` | 并发执行，返回等长数组，单项失败记为 null |
| `pipeline(items, stages)` | 每个 item 独立流过多个 stage，无全局 Barrier |
| `runWorkflow(path, args)` | 调用已保存的 Workflow |
| `progress.group(name)` / `phase` | 进度分组 |
| `log(message)` | 写运行日志 |

### agent() 不是 Prompt 调用

`agent()` 启动一个临时的完整 ReAct Loop——有自己的独立 Context、可用 Tool，可以读文件、搜索代码、运行命令。由 StructuredOutput Tool 提交结果，按 JSON Schema 校验。

## Deer Workflow 开源实现

GitHub: [github.com/deerwork-ai/deer-workflow](https://github.com/deerwork-ai/deer-workflow)

**特点**：
- TypeScript + Bun 实现（兼容 Node.js）
- 默认 Agent Runtime 使用 Codex CLI，也支持 Claude
- 可通过实现 `Agent` 接口替换其他 Coding Agent
- 提供 TUI 界面和 `--print` 无人值守模式

**安装**：
```bash
npm install -g deer-workflow
wd create "创建一个研究 AI Agent 市场格局的 Workflow"
wd run my-workflow.ts
```

## Deep Research 示例

研究流程编排：
- **Search 阶段**：并行搜索官方文档、原始数据、公告
- **Plan 阶段**：根据材料调整问题树
- **并行研究**：每个 Agent 处理一个视角，减少 Context 污染
- **来源核验**：确认支撑力、发布日期、二手转述准确性
- **汇编阶段**：JavaScript 按主题归组、去重、整理引用；总编 Agent 决定叙事顺序

## Journaled Replay 断点续接

- 运行目录使用 `journal.jsonl`，记录 `started` 与 `result`
- 输入未变化的已完成调用即时返回缓存，编辑过或新增的才重跑
- 恢复依赖"调用输入与已完成结果的匹配"，不是 VM 快照
- 不保证文件系统/外部服务的事务回滚——建议每个可重跑单元尽量幂等
- 禁止 `Date.now()`、`new Date()`、`Math.random()` 等非确定性输入

## Skill 与 Workflow 的关系

| Skill | Workflow |
|-------|----------|
| 保存领域术语、判断 Rubric、工具使用经验 | 固定执行次序、并发规模、数据结构 |
| 沟通语气和例外处理原则 | 重试与停止条件 |
| 上下文驱动、渐进式加载 | 可 Review、Diff、测试、版本管理 |

两者不是替代关系，而是上下两层：Skill 教 Agent 什么是好的，Workflow 保证该做的步骤真的发生。

## 对 AI Builder 的启示

- 把机械步骤交还给代码，需要判断的留给 Agent
- Loop Engineering 从优化模型行为扩展到脚本控制流、Agent Prompt、验证器
- 强模型写 Workflow，普通模型跑合适的 Agent
- 每次改动都有 Diff，能在同一批 Eval 上比较

## 资料链接

- [Deer Workflow 开源仓库](https://github.com/deerwork-ai/deer-workflow)
- [Deer Workflow 官网](https://deerwork-ai.github.io/deer-workflow/)
- [Workflow Creator Skill](https://github.com/deerwork-ai/deer-workflow/blob/main/skills/workflow-creator/SKILL.md)
- [Anthropic 官方 Dynamic Workflow 文档](https://code.claude.com/docs/en/workflows)
- [Anthropic 产品公告](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)
- [Anthropic Context Engineering 文章](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [DeerFlow 3.0 (DeerWork)](https://github.com/bytedance/deer-flow)
- [Skill 101 系列文章](https://my.feishu.cn/wiki/NIhSw0tQVif9bck2gGWcqBCznyT)