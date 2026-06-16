---
title: "Agent Skill"
date: "2026-06-12"
source: "Agent skill 迭代式编写实战"
url: "https://mp.weixin.qq.com/s/59Z2eVOg914_bpRD6-WsYg"
---

# Agent Skill

模块化的能力包，沉淀了领域知识的资产 bundle。

## 定义

资产包括：
- 自然语言指令
- 元数据
- 可选资源（脚本、模板）

让 AI Agent 在需要时自动加载和使用。

## 与 MCP 的关系

如果说 MCP 为 agent 提供了"手"来操作工具，那么 skill 就是"操作手册"，教 agent 怎么用这些工具。

## 时间线

- 2025 年 10 月中旬：Anthropic 正式发布 Claude Skills
- 两个月后：Agent Skills 作为开放标准发布
- 后续：Cursor、OpenCode、Qoder 等主流工具陆续跟进

## 通俗理解

skill 就是给 agent 准备的业务 SOP 大礼包，涵盖：
- 执行流程
- 背景知识
- 工具使用说明
- 模板素材
- 常见问题的处理方式

## 核心设计模式

- [[progressive-disclosure]] — 三层渐进式加载
- [[decision-tree]] — 用决策树替代模糊判断
- [[negative-constraint-with-alternative]] — 负向约束配合替代方案
- [[self-review-mechanism]] — 执行后自查清单
- [[eval-mechanism]] — 外部动态验证

## 适用场景

- 半自动化重复流程
- 领域知识导向
- 上下文受限

## 不适用场景

- 简单任务（直接用基础提示词即可）
- 流程完全确定性（写代码自动化更合适）
- agent 职责高度单一
