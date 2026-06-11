---
title: "Open Design（开源Claude Design替代）"
date: "2026-06-11"
---

# Open Design（开源Claude Design替代）

> 本地优先的开源 Claude Design 替代——100+ skills / 150 brand-grade `DESIGN.md` 设计系统 / 261 插件 / 跑在 21 个本地 CLI 上。

## Key Points

- **核心定位**：本地优先 + 开源（Apache 2.0）的 Claude Design 替代
- **核心思路**：当 Anthropic 给 Claude Design 装上的"agent-native"循环停止封闭、变成文件系统里的 skills + design systems + plugins，你的 coding agents 就能读、写、remix
- **你的 CLI = 设计引擎**；**你的笔记本 = 工作室**；**你团队的 `DESIGN.md` = 品牌合约**

## 核心数据

- **Skills**：100+
- **DESIGN.md 设计系统**：150 brand-grade
- **插件**：261
- **Coding Agent 适配**：21（Claude Code / OpenClaw / Codex / Cursor / OpenCode / Qwen / Copilot / Hermes / Kimi 等）
- **仓库大小**：225MB

## 与 Figma 的区别

不是 canvas 上的像素——而是**真实 CSS / 真实字体 / 真实组件**的 single-page artifacts，直接导出为 HTML / PDF / PPTX / MP4，已经被你的设计系统塑造过、已经在你日常用的 agent 里可运行。

## Agent-Native 循环

```
发现 brief → 锁定方向 → 流式 artifact → 批评 → 交付
```

这个循环不闭源——以文件形式暴露给本地 agent。

## 核心页面

| 页面 | 作用 |
|------|------|
| **Home** | 总览入口，选 skill + design system + 写 brief 一次启动 |
| **Automation** | 把重复设计工作流编排成可复用可调度的自动化 |
| **Design System** | 提炼品牌合约 `DESIGN.md` |
| **Studio** | 项目内，流式输出原型/工件/HyperFrames/decks/images |
| **Plugins** | 261 插件扩展点 |

## 相关概念

- [[llm-wiki]] — 知识管理方法论同源：filesystem 化、agent 协作
- [[harness-engineering]] — Harness 进化论

## Sources

- GitHub nexu-io/open-design (2026-06-04)