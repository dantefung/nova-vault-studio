---
title: "Mission Driver"
date: "2026-07-31"
source: "wiki-ingest"
---

# Mission Driver

> 声明式任务驱动引擎，Loop Engineering 的通用参考实现，通过多层 Loop 嵌套实现 AI 全自主 7×24 运行。

## 定义

Mission Driver 是吸引子引导工程（Attractor-Guided Engineering, AGE）的核心组件。它接受一个目标（roadmap），自动进入多级循环：`CHECK → REVIEW_PLANS → EXEC_PLANS → DRAFT_PLANS → DEEP_AUDIT`，直到目标达成。每一步是独立 AI 子进程，单步失败不影响整体循环。

## 关键设计原则

1. **轨迹可恢复**：所有状态持久化到磁盘（checkbox），崩溃后扫描恢复，非 replay
2. **局部容错**：子流隔离，一个 plan 失败不传播到兄弟或父循环
3. **独立验证**：生成与验收分离，审计由独立子代理在全新会话执行
4. **配置即定制**：引擎是通用 Flow DSL 执行器，通过 flow + prompt + commands 三层配置覆盖实现定制，无需改代码

## 四层定义体系

| 层 | 内容 | 机制 |
|----|------|------|
| Mission Config | 做什么、在哪做、怎么验证 | 静态 JSON 声明 |
| Flow 定义 | 步骤编排、状态转换、错误处理 | 通用状态机 DSL |
| Plan 文件 | 最小工作单元，含关闭契约 | AI 自动生成，checkbox 持久化 |
| Roadmap | 宏观规划，人类可读可控制 | 里程碑分组，todo/ready/done 三态 |

## 稳定保障

多层防线：磁盘持久化 → 子流隔离 → 重试预算（3 次全新 session）→ 死循环检测（ping_pong + max_cycles）→ 看门狗（60 分钟超时）→ 独立审计

## 与 Codex goal 的关键区别

Mission Driver 所有状态在磁盘（文件即状态），Codex goal 运行时状态在内存；Mission Driver 强制独立子代理审计，Codex goal 自审；Mission Driver 支持多 plan 共存，Codex goal 单 goal 单线程。

## 交叉引用

- [[loop-engineering]] — Loop Engineering 概念，Mission Driver 是其具体实现
- [[harness-engineering]] — Harness 的工程化实践
- [[vibe-coding]] — 从 Vibe Coding 到 Human On The Loop 的演进