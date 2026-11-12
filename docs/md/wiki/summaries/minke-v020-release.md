---
title: "Minke v0.2.0 发布：DSH 桌面应用与远程控制"
date: "2026-08-21"
source: "微信公众号（lencx）"
url: "https://mp.weixin.qq.com/s/lvakTxriwRymhMQ0AxGNsQ"
---

# Minke v0.2.0 发布摘要

## 概述

Minke v0.2.0 正式发布。v0.1.0 把 DeepSeek Harness 带进桌面应用，v0.2.0 进一步把电脑变成可随时访问的 Agent Host——Agent 工作流从桌面自然延续到手机和平板，项目、模型和执行环境仍由用户自己掌握。

## 远程控制架构

不同于远程桌面方案（传输压缩画面/绘图指令），Minke 采用「传输任务、消息、状态和工具结果」的思路，让其他设备成为 Agent 的控制面。它直接扩展 DSH Web 架构，项目、模型和执行环境留在本地电脑。

### 核心设计

- **Cordis 插件树**：DSH 是一棵由 Cordis 管理的插件树，Minke 通过 `--patch` Seam 加入，不复制或修改 Agent Loop
- **`minke-harness-overlay`**：提供两个面——DSH 原生 `/api` + WebSocket 承载对话/Session/Agent/Workspace，Minke 只增加 `/minke` RPC（Files/Diff/Terminal/能力协商）
- **Tailscale**：不参与业务协议，只负责将同一个 Web Origin 带到其他设备

### 同一个 Client，两种 Host Adapter

桌面和移动端运行同一个 Minke Web Client，通过 Electron Preload 是否提供能力来选择 Adapter（不依赖 user-agent）。移动端使用 Details 抽屉、触控布局和软键盘适配，不复制桌面状态。通过 PWA 支持主屏幕安装。

### Host 上的真实能力

- **Files**：Host 解析真实路径 + 限制根目录 + 保存时检查版本防止静默覆盖
- **Diff**：Host 读 Git 原始版本 → Client 渲染
- **Terminal**：连接真实 PTY（非日志回放），DSH HTTP RPC + Cursor + Long Poll，断开后释放进程

### 安全边界

两阶段接入：Tailscale 获取 `*.ts.net` Hostname 加入 DSH 信任范围 → Tailscale Serve 私有 HTTPS 转发。DSH 只监听 Loopback，不开启公网 Funnel。远程 Terminal 可操作真实 Shell，因此远程功能默认关闭。

## 其他资讯

| 主题 | 要点 |
|------|------|
| **Codex Harness** | OpenAI 官方文章在国内炸锅，但 `harness/app-server` 模块其实早都开源了 |
| **Qwen 3.8 27B** | 小模型在 X 上火爆，Simon Willison 连续测试上头，本地可部署量化版本（几 G 内存） |
| **Ox Alpha** | OpenRouter 匿名推理模型，专为编程/持续性智能体任务设计 |
| **Omarchy** | DHH 主导开发的程序员 Linux 系统（基于 Arch），预配置 AI 编程工具 |
| **DeepSeek-V4-Flash-Vision-Exp** | 实验性多模态模型，保持 V4-Flash 能力的同时大幅提升视觉理解，接近 Opus-4.8 |

## 参考链接

- [Minke v0.2.0](https://github.com/lencx/Minke/releases/tag/v0.2.0)
- [Cordis](https://github.com/cordiverse/cordis)
- [Omarchy](https://github.com/basecamp/omarchy)