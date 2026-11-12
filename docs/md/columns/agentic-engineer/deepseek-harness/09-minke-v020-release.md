---
title: "Minke v0.2.0：把电脑变成可随时访问的 Agent Host"
date: "2026-08-21"
source: "微信公众号（lencx）"
url: "https://mp.weixin.qq.com/s/lvakTxriwRymhMQ0AxGNsQ"
---

# Minke v0.2.0：把电脑变成可随时访问的 Agent Host

> 让 Agent 工作流从桌面自然延续到手机和平板，项目、模型和执行环境仍由用户自己掌握。

Minke v0.1.0 把 DeepSeek Harness 带进了桌面应用，v0.2.0 则进一步把电脑变成一个可以随时访问的 Agent Host。

Agent 处理重构、调试或批量文件任务时，工作往往不会在一次对话内结束。人可以离开电脑，但仍需查看进度、审查代码 Diff、运行验证，或者补充下一条指令。Minke v0.2.0 让这条工作流自然地延续到手机和平板。

## 远程控制架构

远程桌面的协议通常以还原桌面显示表面为目标（传输压缩画面、绘图指令或视频编码），到了手机上仍需要缩放或平移。Codex、Claude Code、OpenClaw、Hermes Agent 等工具的远程能力更接近另一种思路：**传输任务、消息、状态和工具结果，让其他设备成为 Agent 的控制面**。Minke 也属于这个方向，但它直接扩展 DSH Web 架构，项目、模型和执行环境仍留在本地电脑。

### 基于 Cordis 插件树

DSH 是一棵由 Cordis 管理的插件树。Agent Loop、Session、模型、工具、Web Server 和 Client UI 都以插件形式挂载到共享 Context。

- Cordis 插件通过 `inject` 声明依赖，通过 `ctx.<service>` 使用其他 Module
- 通过 `ctx.effect()` 管理路由、监听器和运行时资源的注册与释放
- DSH 不需要修改固定的「特权 Core」，新增能力可作为同级插件挂载

Minke 通过 DSH 的 `--patch` Seam 加入这棵树，而不是复制或修改 Agent Loop。`minke-harness-overlay` 同时提供两个面：

- 对话、Session、Agent 和 Workspace 继续由 DSH 原生 `/api` 与 WebSocket 承载
- Minke 只增加 `/minke` RPC，补充 Files、Diff、Terminal 和能力协商
- Tailscale 不参与业务协议，只负责将同一个 Web Origin 带到其他设备

### 同一个 Client，两种 Host Adapter

桌面和移动端运行同一个 Minke Web Client，只在宿主能力的接入方式上产生分支：

- Client 依赖稳定的 Tabs、Files 和 Terminal Interface
- 通过 Electron Preload 是否真实提供能力来选择 Adapter，不依赖 user-agent
- 上层控制器无需知道数据来自 IPC 还是网络

桌面端复用 Electron 能力（`<webview>`、原生打开文件等）；移动端使用 Details 抽屉、触控布局和软键盘适配，不复制桌面状态。通过 PWA（Progressive Web App）支持主屏幕安装、独立窗口启动和资源缓存。

### Host 上的真实能力

- **Files**：都在 Host 上完成，解析真实路径并限制访问根目录，保存时检查内容版本防止静默覆盖
- **Diff**：由 Host 读取 Git 原始版本，再交给 Client 渲染
- **Terminal**：连接真实 PTY（非日志回放），复用 DSH HTTP RPC，通过 Cursor 和 Long Poll 持续读取输出，浏览器断开后释放进程

### 私有接入与安全边界

远程接入采用两阶段生命周期：

1. Minke 从 Tailscale 获取 `*.ts.net` Hostname，加入 DSH 的 Host 信任范围
2. Tailscale Serve 将私有 HTTPS 地址转发到本机随机端口

DSH 始终只监听 Loopback，不会开启公网 Funnel。Tailscale 的设备身份和 ACL 决定谁能访问；DSH `trustedHosts` 负责 Host、Origin 和 DNS Rebinding 防护。远程 Terminal 可以操作宿主机上的真实 Shell，因此远程功能默认关闭。

这套分层让 DSH 继续拥有 Agent 与持久 Session，Minke Host 负责宿主能力，Client 负责设备交互，Tailscale 负责私有网络入口。**替换远程协议或增加 Provider 时，不需要修改 Agent Loop 或重写上层 UI**。

---

# 其他资讯

## Codex Harness

OpenAI 官方发的 Codex Harness 文章在国内自媒体圈突然炸锅。被媒体吹爆的 `harness/app-server` 模块其实早都开源了，并不是这两天才开源的。

## Qwen 3.8 27B

小模型近期在 X 上火爆，各种模型变体和测评不断。Simon Willison 连续多天表示测试上头。本地可部署量化版本，最小的只需几 G 内存。

## Ox Alpha

OpenRouter 上出现的匿名推理模型，专为编程、持续性智能体任务和生产级工作负载设计。适用于长周期软件工程、复杂推理，以及结合文本与视觉上下文的工作流。OpenRouter 仅负责路由，提示词和生成结果保留但不用作训练。

## Omarchy

由 DHH 主导开发、基于 Arch Linux 的程序员 Linux 系统，预配置了桌面、终端、编辑器、Docker、开发环境和 AI 编程工具。键盘优先操作方式，适合喜欢终端和平铺窗口的开发者。

## DeepSeek-V4-Flash-Vision-Exp

DeepSeek 推出的实验性多模态视觉模型，保持 V4-Flash 相当的文本/推理/Agent 能力的同时大幅提升视觉理解，接近 Opus-4.8。可通过 `model='deepseek-v4-flash-vision-exp'` 调用，图片最多转 384 Token，价格与 V4-Flash 相同。

---

## 参考资料

- [Minke v0.2.0](https://github.com/lencx/Minke/releases/tag/v0.2.0)
- [Cordis](https://github.com/cordiverse/cordis)
- [Codex Harness](https://developers.openai.com/blog/codex-as-a-platform)
- [Simon Willison on Qwen 3.8 27B](https://simonwillison.net/2026/Aug/16/qwen-38-27b/)
- [Omarchy](https://github.com/basecamp/omarchy)

---

- [← 上一](./)