---
title: "RiverAi7z（@RiverAi7z）：Pi 的 Session Control——让不同终端里的 Coding Agent 直接互相发消息"
date: "2026-11-04"
source: "X/Twitter"
author: "RiverAi7z (@RiverAi7z)"
url: "https://x.com/RiverAi7z/status/2099124247667044548"
---

# RiverAi7z（@RiverAi7z）：Pi 的 Session Control——让不同终端里的 Coding Agent 直接互相发消息

> 分享 Pi 作者为 Pi 编码智能体开发的 control.ts 扩展：用 `pi --session-control` 启动后，Agent 可自动发现其他在线会话、跨终端发送任务、查询回复并等待对方完成一轮工作；底层基于本机 Unix Socket 实现，无需额外部署服务，为多 Agent 本地协同提供了轻量可靠的通信层。

<!-- more -->

我就说多看 Pi 的作者的 github 能发现好东西吧

他给 Pi 写的 control.ts 能让 Pi 在不同终端里的 coding agent 可以直接互相发消息。

 用 pi --session-control 启动后，agent 就能发现其他在线会话、发送任务、查询回复，还能等待对方完成一轮工作。底层是本机 Unix socket，不需要额外部署

 服务 https://t.co/5rXE1PQPdR

[video](https://video.twimg.com/amplify_video/2099122274297335808/vid/avc1/3180x2160/t85QoKkZjrGenCmV.mp4?tag=29)

安装方式
```bash
   mkdir -p ~/.pi/agent/extensions

   curl -fL \
     https://t.co/9vBM1NOZMf \
     -o ~/.pi/agent/extensions/control.ts
 ```

 然后启动：

 ```bash
   pi --session-control
 ```

https://t.co/pWKTIGH27K

## 相关页面

- [[sources/copperforge-orca-multi-agent-orchestration-guide]]
- [[sources/stephan-pi-matt-implement-flow-open-source]]
- [[concepts/multi-agent]]
- [[concepts/agent-autonomous-pipeline]]
