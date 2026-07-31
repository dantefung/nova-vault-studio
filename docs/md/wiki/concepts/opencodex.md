---
title: "OpenCodex：Codex 本地模型路由层"
date: "2026-07-30"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/Saq_dHCQ40IbHRgJPOdWDw"
---

# OpenCodex：Codex 本地模型路由层

OpenCodex 是在 Codex 和上游模型提供商之间插入一层本地代理，统一管理多模型切换，解决"换模型要重启 Codex → session 丢失"的痛点。

---

## 核心问题

**痛点**：在 ChatGPT Plus / GPT 中转站 / MiniMax / DeepSeek 之间切换时，每次都要：打开切换工具 → 改配置 → 重启 Codex → session 丢失。

OpenCodex 架构：

```
Codex → http://127.0.0.1:10100/v1 → OpenCodex → 上游 provider
```

Codex 固定指向 OpenCodex，所有上游在 OpenCodex 里统一管理，**Codex 无需重启、session 不丢**。

---

## 关键配置

- Codex 的 `~/.codex/config.toml` 中，custom provider 的 `base_url` 指向 OpenCodex，`Key` 填 placeholder（如 `ocx-local`）
- **真正的 API key 填在 OpenCodex 的 provider 配置里**，不是填在 Codex 里——这是核心边界
- 安装：`npm install -g @bitkyc08/opencodex`
- 启动：`ocx start --port 10100`
- 健康检查：`curl http://127.0.0.1:10100/healthz`

---

## 核心边界

> Codex 只负责**用**模型，OpenCodex 负责**管**模型从哪里来。

这个边界搞清楚后，不需要再装 CC Switch / CodeX++ 等工具——只要不动 `~/.codex/config.toml`，那些工具安装不动也无妨。

---

## 特性

- GUI 界面管理多 provider
- 多账号聚合，根据用量自动切换
- 可装为系统服务（`ocx service install`）随系统启动

---

## 交叉引用

- [[codex]] — OpenAI 官方 AI 编程客户端
- [[ai-model-router]] — 模型路由层通用概念

> 来源：林大友，微信公众号，2026-07-30
