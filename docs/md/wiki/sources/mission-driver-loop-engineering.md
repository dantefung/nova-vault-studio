---
title: "Mission Driver：Loop Engineering 的一种通用参考实现"
date: "2026-07-26"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/AFpnWdDXyp6Z9SDi_1MCqw"
---

# Mission Driver：Loop Engineering 的一种通用参考实现

> 一个通用的 AI 任务驱动引擎如何通过 loop 嵌套实现局部容错和稳定保障，是吸引子引导工程（AGE）的核心组件。

## 核心问题：从 Vibe Coding 到自主运行

当前 Human In The Loop 模式有两个问题：**质量失控**（AI 概率采样易走偏、自我宣称完成）和**产能限制**（人 8 小时瓶颈）。目标是从 Human In The Loop 走向 Human On The Loop——AI 7×24 自主运行，人按需介入。

## Mission Driver 是什么

声明式任务驱动引擎。给定目标（roadmap），自动进入循环：`CHECK → REVIEW_PLANS → EXEC_PLANS → DRAFT_PLANS → (无新方案时) DEEP_AUDIT → 回到循环体`。每一步是独立 AI 子进程，单步失败不影响整体。

## 核心机制：Loop 嵌套

- 外层：主循环（五步闭环）
- 内层：Plan Loop（EXEC_PLANS 中执行→检查→审计→验证）
- 可选：Audit Loop（DEEP_AUDIT 多维审计闭环）

子流隔离：一个 plan 执行阻塞不影响其他 plan，阻塞被限制在子流程内部。

## 关键设计

- **磁盘持久化**：所有状态写磁盘，崩溃后扫描 checkbox 断点恢复（非 replay）
- **独立验证**：生成与验收分离，审计由独立子代理在全新会话执行
- **四层定义**：Mission Config（静态声明）→ Flow 定义（状态机 DSL）→ Plan 文件（关闭契约）→ Roadmap（宏观规划）
- **Flow 可替换**：引擎是通用 Flow DSL 执行器，内置五步循环只是默认 flow，可替换为自定义流程（如代码审查流）

## 案例：nop-app-erp

22 天产出 154 模块、352 实体、2890 Java 测试 + 260+ E2E spec，0 failure。仅 28 次人类干预，集中在项目早期。

## 与 Codex goal 对比

| 维度 | Codex goal | Mission Driver |
|------|-----------|---------------|
| 状态持久化 | SQLite + JSONL，运行时状态内存 | checkbox 磁盘持久化 |
| 独立验证 | continuation prompt 自审 | 脚本检查 + AI 独立审计 |
| 任务粒度 | 单 goal | 多 plan 共存 |
| 异步交互 | pause/resume | 随时注入新 plan |
| 失败隔离 | 污染 context window | 子流隔离 |
| 信息可见性 | 需工具解析 | 纯文件，人和 AI 可读 |

## 进一步阅读

- [Mission Driver 源码](https://github.com/entropy-cloud/attractor-guided-engineering-template/tools)
- [nop-app-erp 案例](https://github.com/entropy-cloud/nop-app-erp)
- [AGE 理论分析](https://mp.weixin.qq.com/s/2HugtDY6FTAty4eTD6Tzag)