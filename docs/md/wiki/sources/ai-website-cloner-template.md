---
title: "ai-website-cloner-template — 输入 URL 用 AI 克隆网站为 Next.js 代码（16.4k Stars）"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/JCodesMore/ai-website-cloner-template"
---

# ai-website-cloner-template — 输入 URL 用 AI 克隆网站为 Next.js 代码（16.4k Stars）

> Clone any website with one command using AI coding agents. 输入网站链接，AI 自动分析页面结构、布局设计、文案模块、交互逻辑，生成相似风格的 Next.js 网站模板。

<!-- more -->

## 核心定位

一个**可复用模板**，用于将任意网站逆工程为干净、现代的 Next.js 代码库。指向 URL，运行 `/clone-website`，AI agent 会检查站点、提取设计 token 和资产、编写组件规格，并派发并行构建器重建每个区块。

**推荐：Claude Code + Opus 4.7**，但支持多种 AI coding agents。

## 工作流程

`/clone-website<target-url>` 执行多阶段 pipeline：

1. **Reconnaissance** — 截图、设计 token 提取、交互扫描（scroll、click、hover、responsive）
2. **Foundation** — 更新字体、颜色、全局样式，下载所有资产
3. **Component Specs** — 编写详细规格文件（`docs/research/components/`），含精确 `getComputedStyle()` 值、状态、行为、内容
4. **Parallel Build** — 在 git worktrees 中派发构建 agent，每 section/component 一个
5. **Assembly & QA** — 合并 worktrees、拼接页面、视觉 diff 对比原站

每个 builder agent 接收完整组件规格 inline——精确 CSS 值、交互模型、多状态内容、响应式断点、资产路径。**不靠猜**。

## 技术栈

- **Next.js 16** — App Router, React 19, TypeScript strict
- **shadcn/ui** — Radix primitives + Tailwind CSS v4
- **Tailwind CSS v4** — oklch design tokens
- **Lucide React** — 默认图标（克隆时替换为提取的 SVG）

## 支持平台（13+）

| Agent | 状态 |
|-------|------|
| **Claude Code（推荐）** | Opus 4.7 |
| Codex CLI | Supported |
| OpenCode | Supported |
| GitHub Copilot | Supported |
| Cursor | Supported |
| Windsurf | Supported |
| Gemini CLI | Supported |
| Cline | Supported |
| Roo Code | Supported |
| Continue | Supported |
| Amazon Q | Supported |
| Augment Code | Supported |
| Aider | Supported |

## 适用场景

- **平台迁移** — 将 WordPress/Webflow/Squarespace 上的站点重建为现代 Next.js 代码库
- **丢失源码** — 站点在线但 repo 没了、开发者跑了、栈太旧了，用现代格式把代码拿回来
- **学习** — 解构生产站点如何实现特定布局、动画和响应式行为

## 禁用场景

- 钓鱼或冒充
- 将他人设计据为己有（logo、品牌资产、原创文案归原主所有）
- 违反服务条款（部分站点明确禁止抓取或复制）

## 文件结构

```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # 提取的 SVG 图标
  lib/utils.ts      # cn() utility
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/           # 下载的目标站图片
  videos/           # 下载的目标站视频
  seo/              # Favicons, OG images
docs/
  research/         # 提取输出 &组件规格
  design-references/ # 截图
scripts/
  sync-agent-rules.sh  # 重新生成 agent instruction 文件
  sync-skills.mjs      # 重新生成 /clone-website 支持所有平台
AGENTS.md           # Agent 指令（单一源）
CLAUDE.md           # Claude Code 配置（导入 AGENTS.md）
GEMINI.md           # Gemini CLI 配置（导入 AGENTS.md）
```

## 数据

- **16.4k Stars** · **2.5k Forks** · **40 Commits**
- TypeScript 23% · CSS 22.2% · JavaScript 20.5% · Dockerfile 20.2% · Shell 14.1%
- MIT License

## 使用方式

1. **GitHub 点击 "Use this template"** 创建自己的副本（不要直接 clone）
2. `npm install`
3. `claude --chrome`
4. `/clone-website <target-url>`
5. 自定义（可选）