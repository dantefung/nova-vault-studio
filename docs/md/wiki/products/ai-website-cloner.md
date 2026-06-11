---
title: "AI Website Cloner（网站克隆为Next.js）"
date: "2026-06-11"
---

# AI Website Cloner（网站克隆为Next.js）

> Clone any website with one command using AI coding agents. 输入网站链接，AI 自动分析页面结构、布局设计、文案模块、交互逻辑，生成相似风格的 Next.js 网站模板。

## Key Points

- **核心定位**：将任意网站逆工程为干净、现代的 Next.js 代码库
- **推荐**：Claude Code + Opus 4.7
- **支持13+ 平台**：Claude Code、Codex CLI、OpenCode、GitHub Copilot、Cursor、Windsurf、Gemini CLI、Cline、Roo Code、Continue、Amazon Q、Augment Code、Aider

## 工作流程

`/clone-website<target-url>` 执行多阶段 pipeline：

1. **Reconnaissance** — 截图、设计 token 提取、交互扫描（scroll、click、hover、responsive）
2. **Foundation** — 更新字体、颜色、全局样式，下载所有资产
3. **Component Specs** — 编写详细规格文件，含精确 `getComputedStyle()` 值、状态、行为、内容
4. **Parallel Build** — 在 git worktrees 中派发构建 agent，每 section/component 一个
5. **Assembly & QA** — 合并 worktrees、拼接页面、视觉 diff 对比原站

## 技术栈

- **Next.js 16** — App Router, React 19, TypeScript strict
- **shadcn/ui** — Radix primitives + Tailwind CSS v4
- **Tailwind CSS v4** — oklch design tokens
- **Lucide React** — 默认图标（克隆时替换为提取的 SVG）

## 适用场景

- **平台迁移** — 将 WordPress/Webflow/Squarespace 上的站点重建为现代 Next.js 代码库
- **丢失源码** — 站点在线但 repo 没了、开发者跑了、栈太旧了，用现代格式把代码拿回来

## 数据

- **16.4k Stars**

## Related Pages

- [patterns/vibe-coding](patterns/vibe-coding) — 氛围编程建站模式

## Sources

- GitHub JCodesMore/ai-website-cloner-template (2026-06-04)