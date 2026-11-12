---
title: "DeepSeek V4 Flash + OMP / Pi 配置指南"
date: "2026-08-08"
source: "小G《换掉 Claude Code，DeepSeek V4 Flash + OMP / Pi 太丝滑了！》精读"
---

# DeepSeek V4 Flash + OMP / Pi 配置指南

## 一句话洞察

DeepSeek V4 Flash 正式版上线，Agent 能力大幅增强（四项基准超 V4 Pro Preview），原生支持 Responses API + 内置联网搜索，OMP 和 Pi 均已内置 provider 无需手写模型配置。关键是：**价格极低，几乎等于免费送**。

## 核心要点

### DeepSeek V4 Flash 亮点

- 四项 Agent 基准超 V4 Pro Preview：Terminal Bench 2.1、DeepSWE、Toolathlon Verified、DSBench-FullStack
- 原生支持 Responses API（含内置 `web_search` 工具，无需第三方搜索引擎）
- 已适配 Codex
- 价格极低

### OMP vs Pi

| 对比项 | Pi | OMP |
|--------|------|------|
| 性质 | 上游开源项目 | Pi 的 fork |
| 开发者 | Mario Zechner | eagle-omp 社区 |
| 工具集 | read/write/edit/bash 四个基础工具 | 扩展工具：Hashline、LSP、DAP、browser、子 Agent、模型角色路由 |
| 配置目录 | `~/.pi/agent/` | `~/.omp/agent/` |
| 安装方式 | npm（Node.js 22.19+） | curl/brew/bun |
| DeepSeek 支持版本 | 0.70.1+ | 当前版本内置 |

### 接入步骤

1. 在 DeepSeek 开放平台创建 API Key
2. 配置环境变量 `DEEPSEEK_API_KEY`
3. 查询模型列表确认 DeepSeek V4 Flash 可用（`omp models list | grep deepseek` / `pi models list | grep deepseek`）
4. 选择模型启动（`--model deepseek-v4-flash` 或 `/model` 命令切换）
5. 可选：设为默认模型（OMP 通过 `modelRoles` 配置，Pi 通过 `settings.json`）

### 注意事项

- 不要用 `echo` 打印 API Key，用 `${DEEPSEEK_API_KEY:+set}` 判断是否存在
- Pi 低于 0.70.1 找不到 V4 Flash，先升级
- 手写 `models.json` 时优先参考官方内置模型定义，V4 涉及推理内容回放和工具调用兼容
- OMP 的 `models.db` 是缓存，不要直接编辑

## 与已有知识的关联

- 与 [[codex]] 相关：DeepSeek V4 Flash 已适配 Codex，OMP/Pi 是 Codex 之外的 Coding Agent 选择
- 与 [[opencodex]] 相关：OpenCodex 作为模型路由层，可管理包括 DeepSeek 在内的多 provider 切换
- 当前模型（deepseek-v4-flash）正是本文介绍的核心模型