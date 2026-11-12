---
title: "121期：简单聊聊一些新的 AI 编程实践"
date: "2026-11-08"
source: "本地归档"
url: ""
---

# 121期：简单聊聊一些新的 AI 编程实践

> 一份 AI Coding 实战通讯的第 121 期速览：从 AI4SE 全链路框架出发，串起「代码知识库 → 夜间批处理 → 自动化循环 → 多 Agent 任务管理 → Harness 质量门 → 持续复盘」这条当前一线团队正在跑的工作流，并给出后续话题预告。

<PdfViewer repo-path="docs/md/books/ai-software/121期：简单聊聊一些新的 AI 编程实践.pdf" />

---

## 内容速览

### 1. AI4SE 框架

AI4SE（AI for Software Engineering）的整体框架，覆盖从**需求、设计、编码到测试**的全链路 AI 辅助。

### 2. 代码知识库：让 AI 理解你的代码，而不是每次从零开始

| 项目 | 地址 | 说明 |
|:---|:---|:---|
| **codegraph** | [github.com/colbymchenry/codegraph](https://github.com/colbymchenry/codegraph) | 为 Claude Code、Cursor 等 AI 编程工具构建的**本地代码知识图谱**；代码变更时自动同步，减少 token 消耗和工具调用次数，100% 本地运行 |
| **openwiki** | [github.com/langchain-ai/openwiki](https://github.com/langchain-ai/openwiki) | LangChain 团队出品的 CLI 工具，自动为代码库生成并维护 **Agent 可读的 Markdown 文档 / wiki**，让 AI 更好地理解项目上下文 |
| **Understand-Anything** | [github.com/Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | 将代码库转化为**可交互的知识图谱**，支持探索、搜索和提问；帮助团队成员快速理解业务逻辑，BA 也可以基于现状分析下一轮需求 |
| **GitNexus** | [github.com/abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) | **零服务端**的代码智能引擎，为 AI 编程工具提供代码上下文与语义搜索能力 |
| **graphify** | [github.com/Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | 把代码库、文档、SQL Schema、配置文件等统一构建成**可查询的知识图谱**，支持 Claude Code / Cursor / Gemini CLI；本地确定性 AST 解析，**无需向量数据库** |

### 3. Runner 夜间任务：自定义的 `overnight-runner` 命令

作者自研的夜间运行工具，核心理念：

- **充分利用夜间执行**；
- **把 plan 装入队列**；
- **决策模式分层**：
  - 白天：等待一个窗口，没回应就自动决策；
  - 夜间：完全自动决策；
- **决策记录**：把决策写进日志，第二天分析决策日志后再做下一轮 plan。

### 4. Loop 框架

- **BMAD-Loop** — [github.com/bmad-code-org/bmad-loop](https://github.com/bmad-code-org/bmad-loop)
  BMAD（Breakthrough Method for Agile AI Driven Development）的自动化循环框架，端到端跑完所有任务，达到 **L4 级别的自动化**。

### 5. Agent 任务管理工具

| 工具 | 定位 |
|:---|:---|
| **mutical** | 多 Agent 任务调度与管理 |
| **herdr** | AI Agent 编排和协作工具 |
| **termio.sh** | 社群大佬开发的**终端优先的 Agent 开发环境**，Tmux 替代方案，支持 CLI / TUI Agent 运行时 |

### 6. Harness 反馈（质量门）

作者的五道质量门清单：

1. **业务术语质量门**
2. **需求质量门** — SDD validation
3. **代码质量门** — lint、sonar
4. **架构质量门** — archunit
5. **功能质量门** — chrome-mcp、agent-browser、playwright E2E 测试

另有 **retro skill**，用于持续优化 harness 与其它 skills。

### 7. 后续话题预告

- **AI 时代的研发团队管理**（彭明）：估算 / 工作流（工作方法）/ 度量
- **Skill 测评**

---

## 为什么值得读

这一期把「AI 编程」从**单点工具使用**拉回到**工程体系**的视角：代码知识库解决「AI 每次从零开始」的上下文成本，夜间 Runner 与 Loop 框架解决「让 AI 在无人值守时持续推进」，多 Agent 编排工具解决「并发协作」，而五道质量门与 retro skill 则补上了「怎么保证 AI 产出可被信任、并且持续变好」这一环。

对已经在跑 Harness / AI Native 流程的团队，这几份清单可以直接当自审表用。
