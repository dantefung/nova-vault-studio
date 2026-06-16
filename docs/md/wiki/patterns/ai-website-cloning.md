---
title: "AI Website Cloning"
date: "2026-06-13"
source: "ai-website-cloner-template"
url: "https://github.com/JCodesMore/ai-website-cloner-template"
---

# AI Website Cloning

输入网站链接，AI 自动分析页面结构、布局设计、文案模块、交互逻辑，生成相似风格的 Next.js 网站模板。

## 工作流程

`/clone-website<target-url>` 执行多阶段 pipeline：

1. **Reconnaissance** — 截图、设计 token 提取、交互扫描（scroll、click、hover、responsive）
2. **Foundation** — 更新字体、颜色、全局样式，下载所有资产
3. **Component Specs** — 编写详细规格文件，含精确 `getComputedStyle()` 值、状态、行为、内容
4. **Parallel Build** — 在 git worktrees 中派发构建 agent，每 section/component 一个
5. **Assembly & QA** — 合并 worktrees、拼接页面、视觉 diff 对比原站

## 推荐工具

Claude Code + Opus 4.7

## 关键创新

每个 builder agent 接收完整组件规格 inline——精确 CSS 值、交互模型、多状态内容、响应式断点、资产路径。**不靠猜**。

## 相关

- [[vibe-coding]] — AI 原生开发
- [[parallel-agent-build]] — 并行 Agent 构建
