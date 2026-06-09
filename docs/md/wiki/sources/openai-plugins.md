---
title: "openai/plugins — OpenAI 官方 Codex 插件示例集合"
date: "2026-06-09"
source: "GitHub"
url: "https://github.com/openai/plugins"
---

# openai/plugins — OpenAI 官方 Codex 插件示例集合

> Codex plugin examples. Each plugin has a required `.codex-plugin/plugin.json` manifest and optional skills/, agents/, commands/, hooks.json, and other surfaces.

<!-- more -->

## 核心内容

- OpenAI 官方维护的 Codex 插件示例仓库
- 标准化 `.codex-plugin/plugin.json` manifest 规范
- 支持 skills/、`.app.json`、`.mcp.json`、agent-level agents/、commands/、hooks.json 等多种扩展面

## 高光示例

| 插件 | 覆盖范围 |
|------|----------|
| `plugins/figma` | use_figma, Code to Canvas, Code Connect, design system rules |
| `plugins/notion` | planning, research, meetings, knowledge capture |
| `plugins/build-ios-apps` | SwiftUI implementation, refactors, performance, debugging |
| `plugins/build-macos-apps` | macOS SwiftUI/AppKit workflows, build/run/debug loops, packaging |
| `plugins/build-web-apps` | deployment, UI, payments, database workflows |
| `plugins/expo` | Expo + React Native apps, SDK upgrades, EAS workflows, Codex Run actions |
| `plugins/netlify` | Netlify 部署集成 |
| `plugins/remotion` | Remotion 视频生成集成 |
| `plugins/google-slides` | Google Slides 集成 |

## 技术栈

- JavaScript 58.9% / Python 32.8% / Standard ML 2.0% / Shell 1.4% / TypeScript 1.0%

## 数据

- **2.5k Stars** · **301 Forks** · **264 Commits**
- MIT License