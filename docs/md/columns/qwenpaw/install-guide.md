---
title: "QwenPaw 安装指南"
date: "2026-07-31"
source: "QwenPaw 官方文档"
url: "https://qwenpaw.agentscope.io"
---

# QwenPaw 安装指南

QwenPaw 提供了 7 种安装方式，可以按需选择：

## 方式一：pip 安装（适合开发者）

需要 Python 3.11~3.13，推荐先建虚拟环境：

```bash
pip install qwenpaw
```

然后初始化并启动：

```bash
qwenpaw init --defaults    # 快速初始化（默认配置）
qwenpaw app                # 启动服务（默认 http://127.0.0.1:8088）
```

## 方式二：脚本安装（零配置，推荐）

无需预装 Python，安装脚本自动管理一切。

**macOS / Linux：**

```bash
curl -fsSL https://qwenpaw.agentscope.io/install.sh | bash
```

**Windows（PowerShell）：**

```powershell
irm https://qwenpaw.agentscope.io/install.ps1 | iex
```

然后执行 `qwenpaw init --defaults` → `qwenpaw app` 即可。

## 方式三：Docker

```bash
docker pull agentscope/qwenpaw:latest
docker run -p 127.0.0.1:8088:8088 \
  -v qwenpaw-data:/app/working \
  -v qwenpaw-secrets:/app/working.secret \
  agentscope/qwenpaw:latest
```

## 方式四：AgentScope Platform（免安装）

直接打开 [platform.agentscope.io](https://platform.agentscope.io)，注册后一键部署，浏览器即用。

## 其他方式

| 方式 | 说明 |
|------|------|
| 阿里云 ECS | 一键部署，云上稳定运行 |
| 魔搭创空间 | 一键配置，云端运行 |
| 桌面应用 | 下载 GitHub Releases 的 `.exe` / `.dmg`，双击即用 |

## 启动后配置

1. 浏览器访问 `http://127.0.0.1:8088/` 进入控制台
2. 配置模型（必需）→ 设置 API Key 或下载本地模型
3. 开始对话测试