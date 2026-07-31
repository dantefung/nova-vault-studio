---
title: "OpenCode /goal 目标驱动模式"
date: "2026-07-31"
source: "OpenCode 社区"
url: ""
---

# OpenCode `/goal` 目标驱动模式

OpenCode 原生没有内置的 `/goal` 命令，但可以通过自定义命令或安装社区插件的方式实现类似 `/goal` 的"目标驱动、自动迭代"功能。

## 方式一：自定义命令（原生方式）

OpenCode 支持通过 Markdown 文件定义自定义命令，存放在 `~/.config/opencode/commands/` 或项目根目录的 `.opencode/commands/` 下。

你可以编写一个 `goal.md` 文件，在其中定义 `/goal` 命令的编排逻辑（包括设定目标、启动子任务、审查、重试等），从而实现自动读码、改码、自检的循环。这种方式零外部依赖，完全基于 OpenCode 原生的 `task` 工具和 `commands` 机制。

## 方式二：社区插件（推荐）

社区提供了 `opencode-goal-plugin` 等插件，为 OpenCode 注入了目标驱动模式（Goal Mode）。安装插件后，即可直接使用 `/goal` 命令，实现自动续跑、独立验证、任务状态管理（暂停/恢复/完成）等功能。

**安装方式**：在 `opencode.json` 配置中添加插件（如 `"plugin": ["@heimoshuiyu/opencode-goal-plugin"]`），并重新启动 OpenCode。

**使用方式**：在聊天中输入 `/goal` 你的任务目标（例如 `/goal 重构项目接口，完成标准：通过所有测试`），AI 会自动循环执行，直到验证通过或达到限制。

## 总结

虽然 OpenCode 原生不直接提供 `/goal` 命令，但通过自定义命令或安装插件，可以完美实现类似 Claude Code 或 Codex 的"目标驱动"编码循环。