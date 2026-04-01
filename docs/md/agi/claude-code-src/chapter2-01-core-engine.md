> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [plain-sun-1ffe.hunshcn429.workers.dev](https://plain-sun-1ffe.hunshcn429.workers.dev/core/)

> Anthropic Claude Code v2.1.88 — 逐行逐目录的完整技术剖析

核心引擎层是 Claude Code 最关键的中枢，由 `src/` 根目录下的多个核心文件构成，负责工具抽象、AI 查询循环、命令路由、状态管理、权限安全和提示词构建。

核心文件清单 [​](#核心文件清单)
-------------------

<table tabindex="0"><thead><tr><th>文件</th><th>行数</th><th>核心职责</th></tr></thead><tbody><tr><td><code>Tool.ts</code></td><td>~792</td><td>工具基础接口定义（~55 成员）</td></tr><tr><td><code>tools.ts</code></td><td>~388</td><td>工具注册表、工具池构建</td></tr><tr><td><code>QueryEngine.ts</code></td><td>~1000+</td><td>查询引擎类，会话生命周期管理</td></tr><tr><td><code>query.ts</code></td><td>~1200+</td><td>queryLoop — 核心查询循环</td></tr><tr><td><code>commands.ts</code></td><td>~754</td><td>~73 个基础命令导入、路由、过滤</td></tr><tr><td><code>context.ts</code></td><td>~300</td><td>系统上下文构建（Git + CLAUDE.md）</td></tr><tr><td><code>history.ts</code></td><td>~200</td><td>历史记录异步读写</td></tr><tr><td><code>cost-tracker.ts</code></td><td>~150</td><td>实时成本追踪</td></tr><tr><td><code>costHook.ts</code></td><td>~100</td><td>成本相关 React Hook</td></tr><tr><td><code>setup.ts</code></td><td>~200</td><td>首次运行引导</td></tr><tr><td><code>main.tsx</code></td><td>~1300</td><td>Commander.js + 启动逻辑</td></tr><tr><td><code>Task.ts</code></td><td>~100</td><td>任务接口定义</td></tr><tr><td><code>tasks.ts</code></td><td>~200</td><td>任务注册 / 管理</td></tr><tr><td><code>ink.ts</code></td><td>~50</td><td>Ink 引擎导出桥接</td></tr><tr><td><code>projectOnboardingState.ts</code></td><td>~80</td><td>项目首次使用状态</td></tr></tbody></table>

核心模块交互图 [​](#核心模块交互图)
---------------------

```
                    ┌──────────────┐
                    │  commands.ts │ ← 70+ 斜杠命令
                    │  命令路由器   │
                    └───────┬──────┘
                            │
         ┌──────────────────▼──────────────────┐
         │          QueryEngine.ts              │
         │  submitMessage() → 异步生成器        │
         │  管理: messages, usage, fileState    │
         └──────────────────┬──────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │            query.ts                  │
         │  queryLoop() — 12 步无限循环         │
         │  预算 → 压缩 → API → 工具 → 恢复    │
         └──┬───────────────┬──────────────┬───┘
            │               │              │
     ┌──────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
     │   Tool.ts   │ │ context.ts  │ │ history.ts │
     │  工具接口   │ │ 上下文构建  │ │ 历史记录   │
     └──────┬──────┘ └─────────────┘ └────────────┘
            │
     ┌──────▼──────┐
     │  tools.ts   │
     │  工具注册表  │ ← 23 直接导入 + 11 懒加载 + feature-gated
     └─────────────┘

```

本章内容导航 [​](#本章内容导航)
-------------------

<table tabindex="0"><thead><tr><th>文档</th><th>核心内容</th></tr></thead><tbody><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/tool-system.html">工具系统</a></td><td>Tool 接口 ~55 成员详解、ToolUseContext、buildTool 工厂、工具注册与过滤</td></tr><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/query-engine.html">查询引擎</a></td><td>QueryEngine 类、queryLoop 管线、Token 预算、错误恢复</td></tr><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/command-system.html">命令路由</a></td><td>3 种命令类型、~73 命令导入、过滤系统、技能集成</td></tr><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/state-management.html">状态管理</a></td><td>AppState 80+ 字段、Store 模式、DeepImmutable、SpeculationState</td></tr><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/context-system.html">上下文系统</a></td><td>Git 上下文、CLAUDE.md 记忆、系统提示词组合</td></tr><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/history.html">历史记录</a></td><td>异步生成器读取、粘贴内容管理、去重</td></tr><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/cost-tracker.html">成本追踪</a></td><td>实时成本计算、多模型定价、会话累计</td></tr><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/permissions.html">权限安全</a></td><td>7 种权限模式、权限规则、YOLO 分类器</td></tr><tr><td><a href="https://plain-sun-1ffe.hunshcn429.workers.dev/core/prompts.html">提示词系统</a></td><td>~1000 行系统提示词、静态 / 动态分区、Section 注册</td></tr></tbody></table>