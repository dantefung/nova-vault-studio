---
title: "浏览器自动化生态横纵分析报告"
date: "2026-05-14"
source: "原创"
url: ""
---

# 浏览器自动化生态横纵分析报告

> 研究时间：2026-05-14 | 所属领域：AI Agent 技术 | 研究对象类型：技术生态

## 一句话定义

浏览器自动化生态是一个从协议层到成品代理的五层技术栈，协议层（CDP）→ 自动化框架（Playwright/Puppeteer）→ 托管浏览器（Steel/Browserbase）→ Agent框架（browser-use/Stagehand）→ 成品代理（Operator/ChatGPT Agent），每一层解决不同的问题，共同构成 AI Agent 操作网页的完整基础设施。

---

## 二、纵向分析：从协议到代理的演进

### 2.1 协议层的诞生（2011年）

Chrome DevTools Protocol（CDP）的诞生是一个意外的起点。2011年，Google 开发 CDP 原本是为 Chrome DevTools 调试工具提供内部接口，并非为外部自动化设计。但它基于 WebSocket 的事件驱动架构，恰好比传统的 WebDriver HTTP 请求-响应模型更适合自动化场景。

CDP 暴露了浏览器的核心能力：网络控制（拦截、修改请求）、DOM 操作、运行时性能分析、屏幕截图等。这为后续所有自动化工具奠定了基础。

### 2.2 自动化框架的崛起（2017-2020年）

**Puppeteer（2017）**：Google 团队基于 CDP 构建了 Puppeteer，主要面向 Chromium 自动化。它让开发者可以直接用 JavaScript 控制浏览器，成为早期浏览器自动化的标准选择。

**Playwright（2020）**：由 former Puppeteer 工程师离开 Google 后加入 Microsoft 开发。Playwright 的核心创新是跨浏览器抽象——它不仅支持 Chromium，还支持 Firefox 和 WebKit。2020年5月 Playwright 1.0 正式发布，2023年加入 WebDriver BiDi 支持，形成双协议支持。

这一层的核心价值是：
- 跨浏览器一致性
- 可靠的等待机制（auto-wait）
- 网络拦截能力

### 2.3 AI-Native 控制层的诞生（2023-2025年）

当 LLM 开始被用于控制浏览器时，传统的框架显得过于"确定性"。AI 需要更灵活的交互方式：

**Stagehand（2024）**：TypeScript SDK，将自然语言转换为浏览器操作。三个核心原语：`act()`（执行动作）、`extract()`（提取数据）、`observe()`（观察状态）。它在 Playwright 基础上添加了 AI 层，但保留开发者对底层的控制。

**Browser Use（2024）**：Python 库，78k+ GitHub stars，为 LLM 提供直接控制浏览器的能力。它构建 DOM 树供 LLM 推理，执行动作，并处理 agent 循环。支持多页内存，agent 可以在多次导航中积累上下文。

**关键转折（2025年8月）**：Browser Use 宣布放弃 Playwright，完全基于 CDP 重写。原因是：1）Playwright 的 Node.js 中间层在高频 CDP 调用时引入显著延迟；2）直接使用 CDP 可以实现异步反应能力和跨域 iframe 支持。

### 2.4 托管浏览器层的成熟（2024-2025年）

本地运行浏览器有诸多不便：冷启动慢、IP 被封、环境差异。于是托管浏览器服务兴起：

**Browserbase**：最成熟的云浏览器平台，估值约 3 亿美元。支持 Playwright、Puppeteer、Selenium，集成了 stealth 反检测和住宅代理。

**Steel**：新兴竞争者，提供类似的基础设施。

**Browserless**：专注无头浏览器服务。

### 2.5 Agent 框架层的爆发（2024-2025年）

这一层将浏览器自动化封装为 Agent 可用的工具：

**Playwright MCP（2025）**：Microsoft 官方 MCP 服务器，将 Playwright 暴露为 MCP 工具。支持两种模式：snapshot 模式（使用 accessibility tree，token 成本低）和 vision 模式（发送截图）。任何 MCP 兼容客户端（Claude Desktop、Cursor）都可以控制浏览器。

### 2.6 成品代理层的出现（2025年）

OpenAI Operator 和 ChatGPT Agent 代表了最终的形态：用户只需要告诉代理目标，它会自动完成整个浏览任务。这一层整合了以下所有层的能力。

---

## 三、横向分析：五层架构对比

### 3.1 第一层：协议层

| 协议 | 特点 | 代表工具 |
|------|------|---------|
| **CDP** | 事件驱动、低延迟、Chromium only | 底层所有工具 |
| **WebDriver** | HTTP 请求-响应、跨浏览器 | Selenium |
| **BiDi** | 双向通信、新一代标准 | Playwright 支持 |

**核心洞察**：整个现代浏览器自动化生态（Playwright、Puppeteer、Browser Use、Stagehand）都建立在 CDP 之上，而非 WebDriver。

### 3.2 第二层：自动化框架

| 框架 | 语言 | 跨浏览器 | GitHub Stars | 核心优势 |
|------|------|---------|--------------|---------|
| **Playwright** | TS/Py/Java | ✅ Firefox/WebKit | 100k+ | 跨浏览器、可靠性 |
| **Puppeteer** | JS | ❌ Chromium only | 100k+ | 轻量、Chromium 深度集成 |
| **Selenium** | 多语言 | ✅ 全面 | 30k+ | 成熟生态、企业级 |

**选型建议**：
- 测试和 CI 工作流 → Playwright
- 轻量 Chromium 爬虫 → Puppeteer
- 企业级跨浏览器 → Selenium

### 3.3 第三层：AI-Native 控制框架

| 框架 | 语言 | 自然语言控制 | 多页内存 | 成本 |
|------|------|-------------|---------|------|
| **Stagehand** | TypeScript | ✅ | ❌ | 中等 |
| **Browser Use** | Python | ✅ | ✅ | 较高 |
| **Skyvern** | - | ✅ | ✅ | 最高 |

| 维度 | Stagehand | Browser Use | Playwright MCP |
|------|-----------|-------------|-----------------|
| 自然语言控制 | Yes | Yes | No |
| 代码级控制 | Full | Limited | Yes |
| Selector 弹性 | High | High | Low |
| 多页内存 | Manual | 原生 | Manual |
| 成本/动作 | 中等 | 高 | 低 |
| 最佳场景 | 混合工作流 | 自主研究 | MCP 集成 |

### 3.4 第四层：托管浏览器

| 平台 | 估值 | 特点 | 反检测 |
|------|------|------|-------|
| **Browserbase** | ~$300M | 最成熟、Stagehand 集成 | 内置 |
| **Steel** | 新兴 | 竞争者 | 内置 |
| **Hyperbrowser** | - | - | - |

### 3.5 第五层：成品代理

| 产品 | 特点 |
|------|------|
| **OpenAI Operator** | 端到端任务自动化 |
| **ChatGPT Agent** | 集成在 ChatGPT 中 |

---

## 四、横纵交汇洞察

### 4.1 历史如何塑造了今天的技术分层

回顾浏览器自动化的发展历程，几个关键决策塑造了今天的技术格局：

**CDP 的意外统治**：CDP 最初为调试设计，事件驱动架构意外适合自动化。这个"巧合"让整个行业统一在 CDP 之上，而非 WebDriver。

**Playwright 的跨浏览器赌注**：Microsoft 团队选择支持 Firefox 和 WebKit，而不只是 Chromium。这个决定在测试场景极其有价值，但也增加了架构复杂度。

**Browser Use 的"叛逃"**：2025年8月 Browser Use 放弃 Playwright 直接使用 CDP，代表了 AI 自动化对性能要求的极限——每毫秒延迟都重要。

### 4.2 各层的历史根源

**协议层的今天**：它最初"不是为自动化设计的"，但正因为没有预设自动化场景的假设，反而成了最灵活的基础。

**框架层的今天**：Playwright 最初为测试场景设计，所以在"可靠性"上投入最多。但这也为 AI 自动化提供了稳定的底层。

**AI-Native 层的今天**：它的诞生是因为传统框架的"确定性"与 AI 的"概率性"不匹配。Stagehand 选择保留开发者控制，Browser Use 选择完全自主，两种哲学并存。

### 4.3 未来推演

**最可能的剧本（60%概率）**：
- DOM-first（85-90%场景）+ Vision-fallback（边缘案例）成为标准架构
- CDP 原生支持 AI Agent 场景（如异步事件、跨域 iframe）
- 云浏览器基础设施成为标配

**最危险的剧本（20%概率）**：
- 浏览器被操作系统级 AI 助手替代
- 纯 API 化网页交互（无需浏览器渲染）

**最乐观的剧本（20%概率）**：
- Agentic Browser 成为通用计算平台
- 浏览器自动化被抽象为基础设施，开发者无需关心

### 4.4 技术选型建议

根据任务类型选择合适的层：

| 任务 | 推荐方案 |
|------|---------|
| 读取已知 URL 内容 | Firecrawl、Jina Reader |
| 按查询搜索 | Exa、Tavily |
| 点击/输入/导航 | Stagehand / Browser Use / Playwright MCP |
| 生产规模运行 | Browserbase / Browser Use Cloud / Hyperbrowser |
| QA 测试 | Playwright |

---

## 五、信息来源

1. Suprbrowser: How AI Browser Automation Works. https://suprbrowser.ai/articles/how-ai-browser-automation-works-insider-guide
2. FastCRW: Browser Automation for AI Agents (2026). https://fastcrw.com/blog/browser-automation-ai-agents
3. Browser Use: Leaving Playwright for CDP. https://browser-use.com/posts/playwright-to-cdp
4. Dev.to: AI Browser Automation 5 Layers. https://dev.to/joeseifi/ai-browser-automation-5-layers-every-agent-builder-should-know-72n
5. FP8: Browser Use vs Stagehand vs Playwright MCP. https://fp8.co/articles/Browser-Use-vs-Stagehand-vs-Playwright-MCP-AI-Agent-Browser-Automation
6. Webfuse: CDP vs Playwright vs Puppeteer. https://www.webfuse.com/blog/cdp-vs-playwright-vs-puppeteer

---

## 方法论说明

本报告采用横纵分析法（Horizontal-Vertical Analysis）进行深度研究。该方法由数字生命卡兹克（Khazix）提出，融合了语言学中的历时-共时分析（Saussure）、社会科学中的纵向-横截面研究设计、商学院案例研究法、以及竞争战略分析的核心思想。核心原则：纵向追时间深度，横向追同期广度，最终交汇出判断。