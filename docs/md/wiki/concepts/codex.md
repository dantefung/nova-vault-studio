---
title: "OpenAI Codex"
date: "2026-06-30"
source: "sources/codex-beginners-guide"
---

# OpenAI Codex

> OpenAI 官方的 AI 编程客户端，支持桌面 App / VS Code / 终端三种形态，内置 GPT-Image-2 生图模型，以低门槛、高额度、Computer Use 能力为主要卖点，直接竞品是 Claude Code。

## 核心差异（vs Claude Code）

| 维度 | Codex | Claude Code |
|------|-------|-------------|
| 部署难度 | App 安装，无需终端 | 需终端配置 |
| 额度 | 免费额度 + 常规重置 | Opus 4.7 后消耗极快 |
| 封号风险 | 低 | 高 |
| 生图 | 内置 GPT-Image-2 | 无原生生图 |
| Computer Use | 支持（Mac） | 无 |
| PPT 生成 | 内置插件（.pptx） | 无 |

## 界面布局

三栏式：左侧项目管理/单聊，中间对话区（模型/速度/权限/上下文进度），右侧终端/文件预览/任务追踪。

## 四类典型场景

1. **给文章配图**：安装插图 Skill → 扫描段落 → GPT-Image-2 逐张生成插入
2. **生成可编辑 PPT**：内置 PPT 插件 → 输出 .pptx，可自由编辑
3. **自动化任务**：重复工作封装为定时自动任务，面板管理
4. **Computer Use**（Mac）：AI 虚拟鼠标操作电脑，可打通飞书等外部应用

## 相关页面

- [[gpt-image2-prompts|sources 原文]]
- [[prompt-as-code|Prompt-as-Code]]

## 来源

- 阿西. [《Codex 零基础小白上手指南（附实战全流程）》](../sources/codex-beginners-guide.md). 2026-06-30. X Article.
