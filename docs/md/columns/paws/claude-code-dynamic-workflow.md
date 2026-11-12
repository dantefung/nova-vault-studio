---
title: "Claude Code 动态工作流"
date: "2026-07-31"
source: "Claude 官方"
url: ""
---

# Claude Code 动态工作流

Claude 在 Claude Code 引入了动态工作流。

## 什么是动态工作流？

即 Claude 在处理一个任务时，可以动态安排合适的多个 agents 一起工作。再也不需要人为去配置 agent team、subagents。自己人为配置多个 subagents 可能都不知道要配哪些 agents 好。

Claude Code 这个动态工作流类似 GSD 工作流，都是 AI 自主安排，自动调用多个 agents 来处理任务。

## 使用方法

使用动态工作流时启用自动模式。启用后，有 2 种方式启动工作流：

1. 直接输入：`创建(动态)工作流程`
2. 用 `/effort ultracode` 来启动