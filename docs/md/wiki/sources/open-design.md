---
title: "Open Design — 开源 Claude Design 替代"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/nexu-io/open-design"
---

# Open Design — 开源 Claude Design 替代

> 本地优先的开源 Claude Design 替代——100+ skills / 150 brand-grade `DESIGN.md` 设计系统 / 261 插件 / 跑在 21 个本地 CLI 上。

<!-- more -->

## 定位

**The local-first, open-source [Claude Design](https://x.com/claudeai/status/2045156267690213649) alternative.**

- 🎨 **本地优先** + 开源（Apache 2.0）
- 🖥️ macOS / Windows 原生桌面应用
- ⚡ **100+ skills**
- ✨ **150 brand-grade `DESIGN.md` 设计系统**
- 📦 **261 即用插件**
- 🖼️ 生成 web / desktop / mobile 原型、live dashboards / artifacts、decks、images、video、**HyperFrames** 动效
- 🔒 沙箱 iframe 预览 + HTML / PDF / PPTX / MP4 导出
- 🤖 跑在 **21 个本地 CLI**：Claude Code / OpenClaw / Codex / Cursor / OpenCode / Qwen / Copilot / Hermes / Kimi / Antigravity 等

## 核心思路

> 当 Anthropic 给 Claude Design 装上的"agent-native"循环——发现 brief / 锁定方向 / 流式 artifact / 批评 / 交付——停止封闭、变成一个**文件系统的 skills + design systems + plugins**，**你本机的 coding agents 就能读、写、remix**。

**你的 CLI = 设计引擎**；**你的笔记本 = 工作室**；**你团队的 `DESIGN.md` = 品牌合约**。

### 与 Figma 的区别

**不是 canvas 上的像素**——而是**真实 CSS / 真实字体 / 真实组件**的 single-page artifacts，**直接导出**为 HTML / PDF / PPTX / MP4，已经被你的设计系统塑造过、已经在你日常用的 agent 里可运行。

## 架构

- **`apps/web`** — Next.js 16 App Router + React 18 web runtime
- **`apps/daemon`** — 本地特权守护进程 + `od` bin，owner /api/*、agent spawning、skills、design systems、artifacts
- **`apps/desktop`** — Electron shell，通过 sidecar IPC 发现 web URL
- **`apps/packaged`** — 打包版 Electron 运行时入口
- **`packages/contracts`** — 纯 TypeScript web/daemon 应用合约层
- **`packages/sidecar-proto`** — Open Design sidecar 业务协议
- **`packages/sidecar`** — 通用 sidecar 运行时
- **`packages/platform`** — 通用 OS 进程原语
- **`tools/dev`** — 本地开发生命周期控制平面
- **`tools/pack`** — 打包构建/启动/停止/日志控制平面
- **`e2e`** — 端到端 Playwright UI 自动化

## 核心页面

| 页面 | 作用 |
|------|------|
| **Home** | 总览入口，选 skill + design system + 写 brief 一次启动 |
| **Automation** | 把重复设计工作流编排成可复用可调度的自动化 |
| **Design System** | 提炼品牌合约 `DESIGN.md` |
| **Studio** | 项目内，流式输出原型/工件/HyperFrames/decks/images |
| **Plugins** | 261 插件扩展点 |
| **Integrations** | 集成 |

## Agent-Native 循环

```
发现 brief → 锁定方向 → 流式 artifact → 批评 → 交付
```

这个循环**不闭源**——以文件形式暴露给本地 agent。

## 0.9.0 亮点

- 🔥 内置 **official Model Router**（无 CLI 安装、无 API key 配置，开箱即用）
- 🏅 **Open Design Fellow** 项目开放（与核心团队一起塑形产品）

## 仓库规模

| 维度 | 数据 |
|------|------|
| 仓库大小 | 225MB（本地桌面 + 21 CLI 适配） |
| Skills | 100+ |
| DESIGN.md 设计系统 | 150 brand-grade |
| 插件 | 261 |
| 媒体提供商 | 14 |
| Coding Agent 适配 | 21 |
| 许可证 | Apache 2.0 |

## 多语言 README

英 / 西 / 葡 / 德 / 法 / 简中 / 繁中 / 韩 / 日 / 阿 / 俄 / 乌 / 土 — 13 语

## 关联概念

- [[llm-wiki]] — 知识管理方法论同源：filesystem 化、agent 协作
- [[mattpocock-skills]] — Skills 范式：把流程封装成可调用单元
- [[gstack-skills]] — 另一套 AI 编程助手技能集
- [[huashu-nuwa]] — 同仓库已装的 nuwa-skill 也是 agent-native 的代表
- [[harness-engineering]] — Harness 进化论

## 参考链接

- 仓库：https://github.com/nexu-io/open-design
- 官网：https://open-design.ai/
- 0.9.0 Release：https://github.com/nexu-io/open-design/releases
- Discord：https://discord.gg/qhbcCH8Am4
- 推特：https://x.com/nexudotio
