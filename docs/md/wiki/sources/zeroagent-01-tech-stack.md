---
title: "从零构建 Agent（一）：技术选型"
date: "2026-11-04"
source: "微信公众号 / 从码农到工匠"
author: "从码农到工匠"
url: "https://mp.weixin.qq.com/s/XJnTETwD9RHeT6SUHUPyqQ"
---

# 从零构建 Agent（一）：技术选型

> 本文是「从零构建 Agent」系列的第 1 篇：技术选型。
> 作者复盘了从 Go 到 Python 再到 TypeScript 的两次选型弯路，用主流开源 Agent 项目的技术栈调查给出结论：**在 Agent 交互层，TypeScript 不是可选项而是必选项**。同时提出工程纪律：可测试性与可观测性必须在项目最开始就埋进去，而不是后期补齐。

<!-- more -->

随着 Agent 技术的爆发以及 Agentic Engineering 的兴起，掌握 Agent 的底层构建逻辑已成为技术人员的核心竞争力。为了彻底弄懂智能体的运行机制，作者决定从零开始构建一个功能完整的 Agent。

「从零构建」并不意味着闭门造车，参考优秀的开源实践是极具性价比的途径。然而，无论是研读 OpenCode 还是 Hermes 的源码，其庞大的代码库都无声地传递着一个事实：**构建一个生产级、功能完善的 Agent 绝非易事**。

一口吃不成胖子。为了稳扎稳打，规划了一条循序渐进的演进路线图：

1. 大模型交互
2. Agent Loop 功能
3. Provider 管理能力
4. 前后端通信
5. Session 持久化功能
6. 上下文治理
7. 高级 Memory 功能
8. Skills 功能
9. Hook / Plugin 功能
10. SubAgent 功能
11. 评估与可观测性（Execution Trace）

在接下来的系列文章中，将如实记录这一过程中的设计重点与踩坑经验。

---

## 1. 坑点：前后端技术选型

现代 Agent 往往需要支持极其丰富的交互形态（如 CLI、TUI、Web、Desktop 等）。在多端适配的要求下，需要采用**前后端分离架构**。所以接下来要考虑的就是：前后端都需要用什么技术？

初始版本打算采用 **TUI（Terminal User Interface，终端用户界面）** 作为首个前端形态——简单来说，就是把命令行终端当成具备富交互能力的 Web 界面来使用。然而，正是这个选择让作者走了不少弯路。

### 1.1 踩坑历程：从 Go 到 Python，最终折戟

**Go 语言（TUI 生态薄弱）**：日常使用 OpenCode 较多，起初误以为其前端是 Go 写的，于是尝试用 Go 开发 TUI。然而 Go 的终端前端生态非常差，绝大多数 UI 组件都需要手工编码实现。即便有 AI 辅助生成，代码的可读性与可维护性依然极差。后来仔细查阅源码才发现这是一场乌龙——**OpenCode 的前端本质上也是 TypeScript 写的**。

**Python Textual（性能与渲染卡顿）**：随后转战 Python 的 Textual 库。Textual 的开箱即用体验确实不错，但在稍复杂的异步渲染与并发交互下，界面频繁出现**卡死和渲染帧丢包**问题。经过数天排查，始终无法定位是 Event Loop 调度导致的 Bug 还是渲染引擎本身的缺陷，体验非常糟糕。

### 1.2 主流开源 Agent 技术栈调查

在连续踩坑后，认真梳理了当前业界主流 Agent 开源项目的技术栈构成：

| Agent 项目 | 前端 / 界面语言 | 后端 / 核心运行时 |
|---|---|---|
| OpenCode | TypeScript (OpenTUI) | TypeScript（核心与后端） |
| Hermes | TypeScript (Ink TUI) | Python（Agent 运行时） |
| Claude Code | TypeScript (Ink TUI) | TypeScript（核心实现） |
| Codex (OpenAI) | TypeScript (CLI) | Python / C++ |
| Cursor | TypeScript（基于 Electron） | TypeScript（核心业务）+ Rust（高性能组件） |
| DeepSeek Harness | TypeScript | TypeScript |

调研结果非常明确：**在 Agent 交互层，TypeScript 不是可选项，而是绝对的必选项**。

事实也证明，切换到 TypeScript 生态（如基于 OpenTUI / Ink）后，界面卡死与渲染异常的问题迎刃而解。即便遇到边界问题，大模型对 TS / Node.js 生态庞大的知识储备也能以极高的效率自动修复。

在选定 TS 作为前端后，出于**技术栈统一**与**上下文零成本共享**的考虑，后端同步选用 TypeScript 也是顺理成章的最优解。

> **结论**：对于构建现代 Agent 而言，全栈 TypeScript 是历经市场验证的捷径，盲目尝试其他非主流 UI 语言大概率都是弯路。

---

## 2. 工程经验：可测试性与可观测性先行

无论是在 Harness Engineering（驾驭工程学）还是在 Loop Engineering（循环工程学）中，**可测试性（Testability）与可观测性（Observability）** 都是决定项目上限的基石。

许多开发者习惯在项目后期才补齐这两项能力，但对于 Agent 这种具有**非确定性（Non-deterministic）** 特征的系统而言，**越早构建这两项能力，获得的复利回报就越高**。无论是人还是 AI 编写的代码，都需要依赖良好的测试与观测手段来验证决策逻辑是否符合预期。

### 2.1 后端可观测性：全链路 Trace 与结构化日志

在 Agent 控制流尚未完全稳定前，必须建立结构化的日志机制（Console / Structured Logger），对关键节点进行监控：

- 前端发送给后端的 **Request / Response 载荷**；
- 后端通过 **SSE（Server-Sent Events）** 推送给前端的即时 **Event 流**；
- 发送给 LLM 的完整 **Prompt**、**Tool Call 声明**，以及大模型返回的原始**思考链（Reasoning Tokens）**。

当 Agent 出现行为异常或无限循环时，这些清晰的链条能够让开发者（以及负责 Debug 的 AI Agent）瞬间定位问题所在。

### 2.2 前端可观测性与 TUI 自动化测试

相比于浏览器环境（借助 Chrome DevTools 或 Playwright），TUI 的测试和调试门槛更高。

在 TUI 架构中，可以引入 **node-pty（伪终端驱动）**：通过脚本模拟用户输入，直接捕获 TUI 终端输出的原始字节流与渲染帧。通过这种方式，能够编写自动化脚本，甚至让 AI 驱动测试脚本，自动发现并修复前后端联调中的基础 Bug。

需要强调的是，这种端到端的界面级测试处于**测试金字塔的最外层**，具备一定的复杂性与脆弱性，更适合作为**低频运行的 On-demand 校验，而非高频 CI 阻断**。

---

## 3. 总结

本文是「从零构建 Agent」系列的第一篇，围绕**技术选型**这一主题，记录了项目启动阶段的路线规划与踩坑经验。

- **技术选型上**，TypeScript 是 Agent 前后端的必选项；
- **工程实践上**，可测试性与可观测性要在一开始就埋进去。

选对栈、打好底，后续的 Agent Loop、SubAgent、Memory、自进化等能力才有稳固的落脚点。

---

## 相关链接

- 系列后续：[从零构建 Agent（二）：大模型交互](/md/wiki/sources/zeroagent-02-llm-interaction)
- 系列已有：[从零构建 Agent（十二）：长期 Memory 管理](/md/wiki/sources/zeroagent-12-longterm-memory-management)
- Demo 源码：[significantfrank/ZeroAgent](https://github.com/significantfrank/ZeroAgent)
- 交叉参考：[Harness Engineering](/md/wiki/concepts/harness-engineering)、[Loop Engineering](/md/wiki/concepts/loop-engineering)
