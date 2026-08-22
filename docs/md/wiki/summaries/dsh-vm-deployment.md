---
title: "DeepSeek Harness 虚拟机部署体验 — 精读摘要"
date: "2026-08-22"
source: "微信公众号：大唐小少"
url: "https://mp.weixin.qq.com/s/XZ6-ZaTNWasCz8c1ElWc0Q"
---

# DeepSeek Harness 虚拟机部署体验 — 精读摘要

## 核心内容

在 CentOS 虚拟机环境中从零部署 DeepSeek Harness 的完整指南，包含环境要求、安装步骤、Web UI 启动、远端访问问题解决和实际运行体验。

## 关键信息

### 环境要求

| 项目 | 要求 |
|------|------|
| 操作系统 | CentOS 8 Stream / CentOS 9 |
| Node.js | ≥ 22.19.0（22 LTS） |
| 内存/磁盘 | 2C4G 以上，npm 缓存约 1~2GB |
| API Key | DeepSeek API Key |
| 端口 | 3080（Web UI） |

### 安装方式

1. `npx @deepseek-ai/dsh web`（最快体验）
2. `npm install -g @deepseek-ai/dsh`（推荐长期使用）
3. 源码安装（pnpm）（插件开发）
4. Python SDK（Python ≥ 3.10）

### 远端访问

直接访问远端会提示 `crypto.randomUUID is not a function`。两个方案：
1. 安装 `dsh-lan-access` 插件：`dsh plugin --profile web add dsh-lan-access`
2. SSH 本地端口转发：`ssh -L 3080:127.0.0.1:3080 root@xx.xx.xx.xx`

### 实际体验

- 4 种模式：标准 / PTC / 极简 / 创造
- 可切换模型，默认 DeepSeek 模型
- 测试任务：生成 24 点游戏 HTML，38 万 Token，约 0.21 元

### DSH 核心设计理念

- **Model + Harness = Agent**：模型负责推理，Harness 负责执行
- **一切皆插件**：220+ npm 包，所有 Agent 能力可插件化替换
- **Cordis 元框架**：插件加载/卸载/依赖管理，可逆副作用
- **四层架构**：接入层 → 业务插件层 → 基础能力插件层 → 核心内核层