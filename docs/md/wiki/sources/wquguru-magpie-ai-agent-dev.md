---
title: "WquGuru：magpie项目全AI自动化构建深度分析（19天1204版本）"
date: "2026-10-12"
source: "X/Twitter"
url: "https://x.com/wquguru/status/2109650264601117141"
---

# WquGuru：magpie 项目全 AI 自动化构建深度分析

> magpie 被同行喷“快餐式服务”，但我拉下来分析了过去 19 天的 2862 个 commit，发现了一套值得学习的 agent 驱动开发方法论。

## magpie 是什么

本地 LLM 网关，能把 Claude Code、Codex、Gemini CLI 等编程 agent 接到任意模型和订阅上。yetone 维护，9 月 22 日首个 commit，19 天 9474 星，2862 个 commit（yetone 占 85%），383 个社区 PR。

## 对比 OpenClaw

OpenClaw 头 19 天：1423 个 commit，99%是 Peter Steinberger 自己提的，tag 约 10 个。
magpie：2862 个 commit，1204 个版本，一天平均 60+版本。

## 核心机制：路由表 + 错题本

CLAUDE.md 只引用两个文件：AGENTS.md（路由表）和 LESSONS.md（错题本）。

**LESSONS.md**：agent 每晚复盘当天 commit，找三类问题：
1. 哪些修完又返工了
2. 哪些压根不该合
3. 哪些验证做得太糙

**Seen N×规则**：同一条教训在 3 个不同日子出现，就从 LESSONS.md 挪进 code-standards.md，从经验变成硬规则。已有 8 条转正。

## PR 验收标准（6 条）

除常规要求外，有三条特殊：
1. **回退测试**：旧代码放回去，新测试必须真挂
2. **真实使用**：改了哪家接入就得用真账号、真配置、真接口验
3. **没跑的要写出来**：A check that wasn't run is listed as not run, never left out

## 人类参与点

- 产品决定（"Don't reverse deliberate decisions"）
- 安全闸门（风险检查命中等 maintainer 放行）
- 社区建议（474 个 commit 标题里有来自 X 或 Discord 的报告人）

## 值得抄的

路由表谁都会写，真正要抄的是错题本。同一条错误犯满三天就升成硬规则，印证“事不过三”。
