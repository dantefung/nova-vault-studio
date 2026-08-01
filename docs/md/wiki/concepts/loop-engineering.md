---
title: "Loop Engineering"
date: "2026-06-26"
source: "飞天闪客"
url: "https://mp.weixin.qq.com/s/2HugtDY6FTAty4eTD6Tzag"
---

# Loop Engineering

## 一句话定义

Loop Engineering 是对 AI Agent 定时/循环调度机制的工程化包装，本质是让程序与 Agent 循环沟通以完成持续任务的模式。概念被 KOL 层层炒作后，从简单的定时任务升级到了"新编程范式"的高度。

## 核心争议

### 支持方的叙事

- **Boris (Claude Code)**: `/loop` 命令让 Agent 按时间间隔自动执行任务，"loops 就是未来"
- **Peter (OpenClaw)**: "Prompt Engineering 已死，Loop Engineering 当立"
- **Addy (Google)**: 将 Loop 定义为包含 Automations + Worktrees + Skills + Plugins + Sub-agents 的五组件框架

### 批评方的观点

- Loop 本质就是 crontab 的 Agent 包装版，不是一个新概念
- Addy 的五组件框架元素不互为正交、Scope 不在同一维度，是粗糙分类
- 每个推动者都有自己的利益驱动（产品宣传/维持热度/刷存在感）
- 真正需要 Loop 的用户还是极少数，大多数人连 Agent 都还没用起来

## 五组件框架 (Addy)

| 组件 | 实质 |
|------|------|
| Automations | 定时任务 / 钩子触发 |
| Worktrees | Git 分支管理 |
| Skills | Agent 技能包 |
| Plugins / MCP | 工具扩展机制 |
| Sub-agents | 子智能体分工 |

## 循环思想的真正脉络

抛开炒作，循环思想在 AI Agent 领域有其实际位置：

1. **人-Agent 循环**: Agent 出现后就有的模式 — Agent 代替人类与大模型循环沟通
2. **程序-Agent 循环**: 用程序与 Agent 循环沟通，解决更大更持久的问题
3. **自愈系统**: 分布式系统（Raft 选主循环）、k8s（循环监控）早已实践

循环这层壳不重要，重要的是这套机制能持续运行并自动恢复 — 需要算法和边界条件的精巧设计，以及系统本身的 Harness 配置。

## KOL 利益驱动模型

技术热词的膨胀是多方利益合力的产物：

- **产品创始人**: 宣传自己产品功能 → 造概念
- **竞品创始人**: 维持热度 → 标题党放大
- **技术博主**: 抢夺定义权 → 快速出文章蹭热点
- **自媒体**: 无脑二道贩子 → 加速焦虑传播
- **技术人员**: FOMO 焦虑 → 被动接受并继续传播

## 具体实现

- [Mission Driver](/md/wiki/concepts/mission-driver) — 声明式任务驱动引擎，通过多层 Loop 嵌套实现 AI 全自主运行，AGE 理论（吸引子引导工程）的核心组件。22 天产出 154 模块 ERP 的实战案例。

## 相关概念

- [[harness-engineering]] — Harness 是 Loop 的前置概念，Loop 被放在 Harness 之上
- [[vibe-coding]] — 另一个被 KOL 随口一说就火起来的技术名词，同样的炒作模式
- [[agent-loop]] — Agent 循环执行任务的实际工程模式
- [[context-engineering]] — Prompt → Context → Harness → Loop 概念演进路线中的一环
