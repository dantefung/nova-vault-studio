---
title: "WquGuru：magpie项目全AI自动化构建深度分析（19天1204版本）"
date: "2026-10-12"
source: "X/Twitter"
url: "https://x.com/wquguru/status/2109650264601117141"
---

# WquGuru：magpie项目全AI自动化构建深度分析

> magpie被同行喷"快餐式服务"，但我拉下来分析了过去19天的2862个commit，发现了一套值得学习的agent驱动开发方法论。

## magpie是什么

本地LLM网关，能把Claude Code、Codex、Gemini CLI等编程agent接到任意模型和订阅上。yetone维护，9月22日首个commit，19天9474星，2862个commit（yetone占85%），383个社区PR。

## 对比OpenClaw

OpenClaw头19天：1423个commit，99%是Peter Steinberger自己提的，tag约10个。
magpie：2862个commit，1204个版本，一天平均60+版本。

## 核心机制：路由表 + 错题本

CLAUDE.md只引用两个文件：AGENTS.md（路由表）和LESSONS.md（错题本）。

**LESSONS.md**：agent每晚复盘当天commit，找三类问题：
1. 哪些修完又返工了
2. 哪些压根不该合
3. 哪些验证做得太糙

**Seen N×规则**：同一条教训在3个不同日子出现，就从LESSONS.md挪进code-standards.md，从经验变成硬规则。已有8条转正。

## PR验收标准（6条）

除常规要求外，有三条特殊：
1. **回退测试**：旧代码放回去，新测试必须真挂
2. **真实使用**：改了哪家接入就得用真账号、真配置、真接口验
3. **没跑的要写出来**：A check that wasn't run is listed as not run, never left out

## 人类参与点

- 产品决定（"Don't reverse deliberate decisions"）
- 安全闸门（风险检查命中等maintainer放行）
- 社区建议（474个commit标题里有来自X或Discord的报告人）

## 值得抄的

路由表谁都会写，真正要抄的是错题本。同一条错误犯满三天就升成硬规则，印证"事不过三"。
