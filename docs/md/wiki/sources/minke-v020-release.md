---
title: "DSH：Minke v0.2.0 发布了"
date: "2026-08-21"
source: "微信公众号（lencx）"
url: "https://mp.weixin.qq.com/s/lvakTxriwRymhMQ0AxGNsQ"
---

# DSH：Minke v0.2.0 发布了

应用功能没啥可介绍的，主要想聊点开发细节。DSH 架构设计很有意思，值得每个搞 Agent 的人学习。

Minke v0.2.0 正式发布。v0.1.0 把 DeepSeek Harness 带进了桌面应用，v0.2.0 则进一步把电脑变成一个可以随时访问的 Agent Host。

Agent 处理重构、调试或批量文件任务时，工作往往不会在一次对话内结束。人可以离开电脑，但仍然需要查看进度、审查代码 Diff、运行验证，或者补充下一条指令。Minke v0.2.0 希望让这条工作流自然地延续到手机和平板，同时保持项目、模型和执行环境仍由用户自己掌握。

## 远程控制

远程桌面的协议实现并不完全相同：有的传输压缩画面，有的传输绘图指令，现代方案还会使用视频编码。但它们通常都以还原桌面显示表面为目标，因此桌面尺寸的窗口、侧栏和终端到了手机上，往往仍需要缩放或平移。

Codex、Claude Code、OpenClaw 和 Hermes Agent 等工具的远程能力更接近另一种思路：传输任务、消息、状态和工具结果，让其他设备成为 Agent 的控制面。Minke 也属于这个方向，但它直接扩展 DSH Web 架构，项目、模型和执行环境仍留在本地电脑。

### 基于 Cordis 插件树

DSH 是一棵由 Cordis 管理的插件树。Agent Loop、Session、模型、工具、Web Server 和 Client UI 都以插件形式挂载到共享 Context：

Cordis 插件通过 `inject` 声明依赖，通过 `ctx.<service>` 使用其他 Module，并通过 `ctx.effect()` 管理路由、监听器和运行时资源的注册与释放。DSH 因此不需要修改一个固定的「特权 Core」；新增能力可以作为同级插件挂载。

Minke 正是通过 DSH 的 `--patch` Seam 加入这棵树，而不是复制或修改 Agent Loop。`minke-harness-overlay` 同时提供两个面：

远程控制因此不是独立于 DSH 的附加服务器。对话、Session、Agent 和 Workspace 继续由 DSH 原生 `/api` 与 WebSocket 承载；Minke 只增加 `/minke` RPC，补充 Files、Diff、Terminal 和能力协商。Tailscale 不参与这些业务协议，只负责将同一个 Web Origin 带到其他设备。

### 同一个 Client，两种 Host Adapter

桌面和移动端运行同一个 Minke Web Client，只在宿主能力的接入方式上产生分支：

Client 依赖稳定的 Tabs、Files 和 Terminal Interface，并通过 Electron Preload 是否真实提供能力来选择 Adapter，而不是依赖 user-agent。上层控制器无需知道数据来自 IPC 还是网络，因此两端可以复用核心交互，同时采用适合各自设备的布局。

复用 Interface 并不意味着复制桌面状态。对话和文件来自同一个 Host，但 Tabs 的打开状态与布局属于当前客户端；Electron `<webview>`、原生打开文件等能力在浏览器中也会明确标记为不可用。移动端则使用 Details 抽屉、触控布局和软键盘适配，而不是等比缩小桌面 UI。

**PWA**（Progressive Web App，渐进式网页应用）通过 Web App Manifest、Service Worker 和 HTTPS，为 Web 应用提供主屏幕安装、独立窗口启动、资源缓存和弱网恢复等能力。Minke 主要缓存应用外壳；对话、文件和 Terminal 等实时数据仍来自用户电脑上的 Minke Host。

### Host 上的真实能力

Files 操作都在 Host 上完成。Host 会解析真实路径并限制访问根目录，避免通过符号链接绕过边界；保存时检查内容版本，防止静默覆盖磁盘上的新修改；Diff 则由 Host 读取 Git 原始版本，再交给 Client 渲染。

Terminal 连接的是真实 PTY，而不是日志回放。当前远程 Terminal 复用 DSH 的 HTTP RPC，通过 Cursor 和 Long Poll 持续读取输出，并限制活动 Session 与缓存大小；浏览器断开后，Host 会释放对应进程。未来如需更高吞吐量，可以在保持 Terminal Interface 不变的情况下增加 WebSocket Adapter。

### 私有接入与安全边界

远程接入采用两阶段生命周期：Minke 先从 Tailscale 获取准确的 `*.ts.net` Hostname，并加入 DSH 的 Host 信任范围；本地 Harness 页面启动后，再由 Tailscale Serve 将私有 HTTPS 地址转发到本机随机端口。DSH 始终只监听 Loopback，也不会开启公网 Funnel。

Tailscale 的设备身份和 ACL 决定谁能访问；DSH `trustedHosts` 只负责 Host、Origin 和 DNS Rebinding 防护，并不等同于身份认证。由于远程 Terminal 可以操作宿主机上的真实 Shell，远程功能默认关闭，访问权限也应按照主机控制权限管理。

这套分层让 DSH 继续拥有 Agent 与持久 Session，Minke Host 负责宿主能力，Client 负责设备交互，Tailscale 负责私有网络入口。替换远程协议或增加 Provider 时，不需要修改 Agent Loop 或重写上层 UI。目前完整验证的接入方式仍只有 Tailscale Serve over HTTPS，其他方式需要继续验证。

---

# 其他资讯

## Codex Harness

最近 OpenAI 官方发了篇关于 Codex Harness 的文章，在国内自媒体圈突然炸锅了。被媒体吹爆的 `harness/app-server` 模块其实早都开源了，并不是这两天开源的。

## Qwen 3.8 27B

这个小模型最近在 X 上也是火的一塌糊涂，各种模型变体和测评都有。技术大佬 Simon Willison 也连续多天表示测试上头。可以本地部署一个试试，社区有很多量化版本，最小的只需几 G 内存。

## Ox Alpha

今天 OpenRouter 上出现了一款匿名模型，引起社区高度关注。Ox Alpha 是一款专为编程、持续性智能体任务和生产级工作负载而设计的推理模型，适用于长周期软件工程、复杂推理，以及结合文本与视觉上下文的工作流。该模型由第三方提供商开发和运营，在预览期间保持匿名。OpenRouter 仅负责将请求路由至该模型，提示词和生成结果会由提供商保留，但不会用于训练。

## Omarchy

Omarchy 是由 DHH 主导开发的一款面向程序员的 Linux 系统，它基于 Arch Linux，提前配置好了桌面、终端、编辑器、Docker、开发环境和多种 AI 编程工具，安装后就能直接开始工作。它采用简洁美观的界面和键盘优先的操作方式，适合喜欢终端和平铺窗口、又不想花大量时间折腾 Linux 配置的开发者；不过它的设计比较有个性，与 Windows 和 macOS 的使用习惯有明显区别。

## DeepSeek-V4-Flash-Vision-Exp

DeepSeek 推出了实验性多模态视觉理解模型 DeepSeek-V4-Flash-Vision-Exp，在保持与 V4-Flash 正式版相当的文本、推理和 Agent 能力的同时，大幅提升了视觉理解与多模态 Agent 表现，相关能力已接近 Opus-4.8，可用于生成 PPT、重构网站和制作动态前端等场景。用户可通过 `model='deepseek-v4-flash-vision-exp'` 调用 API，支持 Chat Completions、Messages 和 Responses 三种格式，以及 Base64、外部 URL 和 Files API 三种图片传入方式；图片最多转换为 384 个 Token，价格与 V4-Flash 相同。
