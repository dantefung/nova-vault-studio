---
title: "Agent 技术选型：全栈 TypeScript 与工程纪律前置"
date: "2026-11-04"
source: "微信公众号 / 从码农到工匠"
url: "https://mp.weixin.qq.com/s/XJnTETwD9RHeT6SUHUPyqQ"
---

# Agent 技术选型：全栈 TypeScript 与工程纪律前置

> 构建现代 Agent 的技术栈决策：交互层 TypeScript 不是可选项而是必选项，且可测试性与可观测性必须在项目第一天就埋进去，而不是后期补齐。

## Key Points

- **在 Agent 交互层，TypeScript 不是可选项而是必选项**——这不是偏好，是六个主流开源 Agent 项目的一致事实。
- **全栈 TypeScript** 的真正理由不是「一门语言」，而是**技术栈统一带来的上下文零成本共享**：模型对 TS / Node.js 生态的知识储备能以极高效率自动修复边界问题。
- **可测试性与可观测性越早建，复利回报越高**——Agent 是非确定性系统，事后补齐的观测能力无法还原失控时的事件序列。
- **TUI 自动化测试用 `node-pty`**：脚本模拟输入、捕获终端原始字节流与渲染帧，是一种行之有效的端到端测试手段。
- **界面级测试属于测试金字塔最外层**：脆弱且复杂，只适合低频 On-demand 校验，不适合做高频 CI 阻断。

## Details

### 选型失败的两次弯路

| 尝试 | 失败原因 | 教训 |
|---|---|---|
| **Go 做 TUI** | 终端前端生态薄弱，绝大多数 UI 组件要手工编码，AI 辅助生成后可读性与可维护性依然极差 | 生态缺失不是 AI 能补的 |
| **Python Textual** | 稍复杂的异步渲染与并发交互下频繁卡死、渲染帧丢包；排查数天无法定位是 Event Loop 调度 Bug 还是渲染引擎缺陷 | 开箱即用的体验不等于能扛住并发 |

两次踩坑的共同点：**选择时看的是「能不能快速做出 Demo」，而不是「生态里有没有人踩过并发渲染的坑」**。

### 主流开源 Agent 的技术栈事实

| Agent 项目 | 前端 / 界面语言 | 后端 / 核心运行时 |
|---|---|---|
| OpenCode | TypeScript (OpenTUI) | TypeScript（核心与后端） |
| Hermes | TypeScript (Ink TUI) | Python（Agent 运行时） |
| Claude Code | TypeScript (Ink TUI) | TypeScript（核心实现） |
| Codex (OpenAI) | TypeScript (CLI) | Python / C++ |
| Cursor | TypeScript（基于 Electron） | TypeScript（核心业务）+ Rust（高性能组件） |
| DeepSeek Harness | TypeScript | TypeScript |

**结论**：在 Agent 交互层，TypeScript 是绝对必选项；盲目尝试其他非主流 UI 语言大概率都是弯路。

### 可观测性：三个必须结构化记录的通道

在 Agent 控制流尚未完全稳定前，必须建立结构化日志（Console / Structured Logger），监控三个关键节点：

1. **前端 → 后端的 Request / Response 载荷**
2. **后端 → 前端的 SSE 即时 Event 流**
3. **发给 LLM 的完整 Prompt、Tool Call 声明、模型返回的原始 Reasoning Tokens**

这三样齐全时，Agent 行为异常或陷入无限循环能被瞬间定位；缺一样就会变成「靠猜」。

### TUI 自动化测试

浏览器环境有 Chrome DevTools / Playwright，TUI 没有现成方案。引入 **`node-pty`（伪终端驱动）**：脚本模拟用户输入，直接捕获终端输出的原始字节流与渲染帧，从而编写自动化脚本，甚至让 AI 驱动测试脚本自动发现并修复前后端联调 Bug。

但必须给它正确定位：**端到端界面测试处于测试金字塔最外层**，复杂且脆弱，只作低频 On-demand 校验，不作高频 CI 阻断。

## Context

出自「从零构建 Agent」系列第一篇，记录项目启动阶段的路线规划与踩坑经验。该系列后续的演进路线为：大模型交互 → Agent Loop → Provider 管理 → 前后端通信 → Session 持久化 → 上下文治理 → 高级 Memory → Skills → Hook/Plugin → SubAgent → 评估与可观测性。

技术选型一旦定了，后续所有章节都在这个约束下展开——这也是「选型先行」的代价与收益。

## Related Pages

- [[concepts/responses-api-agent-loop]] — 选型确定后第一件做的事：确定模型交互接口标准
- [[patterns/agent-event-decoupling]] — 可观测性在事件层的具体落地方式
- [[concepts/harness-engineering]] — 「可测试性与可观测性先行」属于 Harness 工程的实践纪律
- [[concepts/loop-engineering]] — 另一条同源的方法论主线
- [[sources/zeroagent-01-tech-stack]] — 原始归档
- [[sources/zeroagent-12-longterm-memory-management]] — 同系列第 12 篇

## Sources

- 《从零构建 Agent（一）：技术选型》，公众号「从码农到工匠」，2026-09-14：第 1 节技术选型踩坑与主流 Agent 技术栈调查；第 2 节可测试性与可观测性先行
