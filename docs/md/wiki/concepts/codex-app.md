---
title: "Codex App（OpenAI 桌面端 AI 工作台）"
date: "2026-07-02"
source: "整理自 sources/codex-app-beginner-tutorial.md"
url: "https://openai.com/codex/"
---

# Codex App（OpenAI 桌面端 AI 工作台）

> 把 AI Agent 装进电脑的工作台——不只是聊天，更能直接「做事」。

## 一句话定义

Codex App 是 OpenAI 推出的桌面端 AI Agent 应用（Mac 优先），把 AI 模型接入本地文件系统、终端命令、浏览器、第三方账号、电脑操控能力，让用户可以用自然语言驱动几乎所有能在电脑上完成的操作。

## 三层形态对比

| 形态 | 部署位置 | 核心能力 | 适用场景 |
|------|----------|----------|----------|
| **ChatGPT 普通对话** | 网页/App | 单轮问答、文案、生成 | 轻量任务 |
| **Codex App 本地版** | 桌面 App | 读本地文件、改代码、跑命令 | 项目工作 |
| **云端 Codex** | OpenAI 服务器 | 持续运行、不受本地关机影响 | 长任务 |

## 核心特性

### 1. 工作现场（左中右三栏）

- **左**：导航栏（对话、项目、插件、自动化）
- **中**：对话区（与 AI 交互）
- **右**：结果区（产物、来源、预览、Git diff）

最大差异：Codex 不是「问答」，是「工作现场」——中间说做了什么，右边看到产出。

### 2. 四大能力扩展

| 概念 | 类比 | 实例 |
|------|------|------|
| **Plugin 插件** | 能力包 | Browser Use、Computer Use、GitHub |
| **Connector 连接器** | 账号接入 | Gmail、Drive、Slack |
| **Skill 技能** | 工作流说明书 | 「按我的风格写教程」 |
| **MCP** | 工具接入通道 | 让外部服务接入 |

### 3. 电脑操控（Computer Use）

最强大也最危险的能力——Codex 可以直接操作 macOS 上的 App（点击、输入、查看界面）。

**安全边界**：
- 不要操控微信、社媒账号
- 不要操控付费软件、公司工具
- 第一次先用无风险 App 试水

### 4. 自动化

定时或延后执行任务：
- 每日自动整理项目状态
- 每周检查仓库问题
- 半小时后继续当前线程
- 定时生成日报/周报

### 5. 个性化偏好

类似 Claude 的自定义说明，可以写：
- 语言偏好
- 风格要求
- 风险提示规则
- 教程类内容的固定模板

## 与 Claude Code 的对比

| 维度 | Codex App | Claude Code |
|------|-----------|-------------|
| 形态 | 桌面 App | CLI（命令行） |
| 上手难度 | 小白友好 | 偏技术用户 |
| Computer Use | ✅ 内置 | ❌ |
| 自动化 | ✅ 内置 | ❌ |
| 第三方账号连接 | ✅ Gmail/Drive/Slack | ❌ |
| 项目工作流 | GUI | 命令行 |

**定位差异**：Codex App 主打「普通人也能用的桌面 AI 工作台」，Claude Code 主打「开发者的 CLI 工具」。

## 相关概念

- [[pages/concept-codex]]：OpenAI Codex 产品总览
- [[pages/prompt-as-code]]：Codex 偏好的 Prompt 写法（中文优先、风险标注、教程模板）
- [[sources/codex-beginners-guide]]：另一篇 Codex 入门指南（@axichuhai）
- [[sources/codex-app-beginner-tutorial]]：本文原文（@gengdaJ）