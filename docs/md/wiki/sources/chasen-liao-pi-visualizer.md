---
title: "Chasen：用 Gemini 4 Neon 做了一个 Pi 的交互式可视化——4 个工具怎么撑起一个 Agent"
date: "2026-11-22"
source: "X/Twitter"
author: "Chasen (@chasen_liao)"
url: "https://x.com/chasen_liao/status/2124352577852821919"
---

# Chasen：用 Gemini 4 Neon 做了一个 Pi 的交互式可视化——4 个工具怎么撑起一个 Agent

> 把 Pi 的设计拆开讲的交互式网页：① read / bash / edit / write 四个工具怎么撑起一个 Agent；② MCP 工具还没开始用、为什么就可能占掉一大块上下文；③ 为什么 Pi 不把 Plan Mode、子代理和权限弹窗全塞进内核；④ 哪些能力该内置、哪些交给扩展。可以跟着图解看状态怎么变化。

<!-- more -->

为了方便大家理解 Pi，我用 Gemini 4 Neon 做了一个交互式可视化网页，把这些设计拆开讲：

① read、bash、edit、write，4 个工具怎么撑起一个 Agent

② MCP 工具还没开始用，为什么就可能占掉一大块上下文

③ 为什么 Pi 不把 Plan Mode、子代理和权限弹窗全塞进内核

④ 哪些能力该内置，哪些交给扩展

不只是看文字，可以跟着图解一步步看状态怎么变化

最近想学 Pi，或者想搞懂 Agent Harness 怎么设计的，可以打开玩玩👇

https://pi-visualizer-lemon.vercel.app/

[video](https://video.twimg.com/amplify_video/2124351290855874560/vid/avc1/1920x1080/MObDcaq_5odWDhrN.mp4?tag=29)

## 相关页面

- [[concepts/agentic-architectures]]
- [[patterns/progressive-disclosure]]
