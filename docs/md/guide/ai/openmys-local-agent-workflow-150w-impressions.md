---
title: "从零到 150 万曝光：开源我的全部软件、Skill 与本地 Agent 工作流"
author: "周瑟夫 Joseph (@openmys)"
date: "2026-11-01"
source: "X (Twitter)"
url: "https://x.com/openmys/status/2116911476422402222"
tags: [ai-agent, workflow, claude-code, prompt-engineering, frontend-design, growth]
---

# 从零到 150 万曝光：开源我的全部软件、Skill 与本地 Agent 工作流

> **作者**：周瑟夫 Joseph ([@openmys](https://x.com/openmys))  
> **原文链接**：https://x.com/openmys/status/2116911476422402222  
> **发布时间**：2026-11-01  
> **核心摘要**：深圳初创公司 Founder 深度拆解本地单人多项目推进的完整 AI Agent 工业级工作栈。涵盖前端设计（Paper MCP / framesbase / Motion+ / Jakub Krehel interfaces）、功能开发（Claude Opus 5.5 作为高维主 Agent 统筹、Codex 审查、Gemini 视觉、双机硬件环境）、多项目调度（Linear 单一事实依据、单一主对话架构）以及社区调研与内容发布全流程。

---

![Cover image](https://pbs.twimg.com/media/HWCwahMbgAA85vX.jpg)![](https://pbs.twimg.com/media/HWCwhDPa4AAoQ63.jpg)

大家好，我是周瑟夫 Joseph。今天我将分享我是怎么部署我的本地工具栈，同时推进多个项目开发并发布的。

但在聊具体的软件和工作流之前，我想先分享一个一个想法：**在这个注意力极度稀缺的年代，视觉效果比你的产品功能还重要。**

📌Note to my English-speaking friends: Today’s post is a full workflow breakdown written mainly for the Chinese community. I’ll keep sharing my daily builds in English as usual! (If you're curious about my local agent stack, X’s auto-translate actually works pretty well on this one.)

作为一名创业者与创作者（大部分时间这两种身份是重合的），如何让大家看到你的作品？如何让大家关注到你的作品？我见过太多优秀的产品，因为宣传上的视觉效果不够抓人眼球而泯然众人。

诚然，很多技术大佬并不屑于这些噱头。但作为一名在深圳的初创公司创业者，社交平台上的曝光带给我的绝不仅仅只有虚荣心，而是让我认识了很多新的朋友，这对我非常有帮助。

我甚至可以说——**对于初创公司来说，Founder 的社交媒体声量，是一种比重和产品品质平级的资产。**

秉承着分享与开源一切作品的想法，今天我将毫无藏私地把我在使用的软件、Skill 以及我的一切工作流程，全部分享给大家。

我正式开始发布内容是从 **10 月 12 号**算起。无论 X 还是小红书，当时都可以说是**完全从零开始**。

到现在这二十来天的成绩如下。这点曝光跟大 V 比可能微不足道，但对于一个冷启动的创作者来说，倒是一个挺不错的开局：

- **X (Twitter)**：170 多万曝光 / 3,000 多粉丝
- **小红书**：1,000+ 粉丝 / 1.2 万赞（因为众所周知的不让发外链原因经常被限流）
- **微信公众号**：2,000 多粉丝
![](https://pbs.twimg.com/media/HWCwoPSa8AAiamm.jpg)

![x数据，170万曝光，15500个赞](https://pbs.twimg.com/media/HWCwqVUaIAABp-e.jpg)

x数据，170万曝光，15500个赞

这一个月发出去的每一个帖子，全都是我自己独立创作出来的作品，这年头在社交媒体上做一名创作者，远远比汉化搬运型“博主”需要消耗的精力多得多。

我本地的开发环境到底是怎么配合、怎么配置的，如何从“想法”最后到一个真正可以发布的内容呢？

## 工作站总览

![](https://pbs.twimg.com/media/HWC7iYObUAA-H4X.jpg)

![](https://pbs.twimg.com/media/HWDC7sPbQAA5kv2.jpg)

![](https://pbs.twimg.com/media/HWDC9u7bkAAqT0k.jpg)

## 前端设计：从设计参考到动态页面

![](https://pbs.twimg.com/media/HWCwubIakAEfhGP.jpg)

我来讲一下最重要的前端设计类工作，从 cinetty 这个在终端一键生成 TUI 架构的 Skill 是怎么诞生的说起。

<video src="https://video.twimg.com/amplify_video/2116902997997633536/vid/avc1/1080x1440/CDxrEeyzczxqyyMt.mp4?tag=29" controls=""></video>

日常收集的设计参考，我全都放在 Eagle 里归类管理；这是目前我用下来最喜欢的文件管理器；需要现成的页面区块或动效原件时，就从 framesbase（前端素材库）和 Motion+（动效库）（闲鱼可以直接搜）里调取。

因为主 agent 一直带着这些积累下来的设计知识和我的个人标准在协调，动手做界面时，不必每次对着空白对话重新交代一遍我喜欢什么风格。

在这套设计流程里，Paper MCP [@paper](https://x.com/paper) 是一个很重要的工具，agent 可以直接读写设计画布。

以做我的硬件官网为例，我不会一上来就让 agent 直接写前端代码，而是先让它在 Paper 画布上同时出几版不同的原型。我从里面挑中一版，再基于这一版迭代三轮，逐步把设计磨到满意。

Paper 这一阶段解决的是静态设计。等静态画面完全敲定之后，再通过 Motion 这类动效库，配合 framesbase 和 Motion+ 里的动效原件，把原本静止的设计稿一步步落成带动态效果、真正可交互的页面。**先确定静态设计，再完成动态交互，两步各自打磨。**

比如 cinetty 的宣传片，最开始的初版是在 Paper 里把每个分镜头做出来再慢慢修改。

![](https://pbs.twimg.com/media/HWC7rNYbsAADkFZ.jpg)

![](https://pbs.twimg.com/media/HWDDMkzbcAEB42G.jpg)

![](https://pbs.twimg.com/media/HWDDOOna0AAIsfm.jpg)

可以看到光是 cinetty 一个宣传视频就迭代了多少版本。

具体推进界面设计时，我也会按任务给 agent 配上对应的设计技能。到了打磨界面的阶段，Jakub Krehel 的 interfaces 技能集会派上用场，拿来做多版界面方案比较，或者逐项做交互、界面文字与可访问性检查都很顺手。

专门做产品落地页时，我会配合使用 Elaya 的 ai-design-skills，用来梳理落地页的内容组织，以及把已经定稿的静态设计做成动态展示。

原有的项目约定和个人标准不会被通用模板覆盖，方法只是帮手，怎么取舍依然听我的。

说白了，我的判断很简单：**工具栈确保了下限，个人审美决定上限，agent 的品位是跟着人类的品位走的。**

至于我是怎么在平时一点点做审美积累的，这个话题太大，留到另一篇再细聊。

## 功能开发：主对话统筹与多模型分工

![](https://pbs.twimg.com/media/HWCw5hVa0AAfEvS.jpg)

在功能开发上，我的主力环境是 Claude Code，主 agent 用的是 Claude Opus。平时我把想法和要求直接交给主 agent（Opus 5.5 high），**它自己不亲自下场写代码，而是退后一步保持全局视野，负责拆解任务和协调推进。**

我用的是自制的 Claude 桌面端，配合自己的工具栈使用非常顺手。

不同模型在开发里按各自的长处分工：GPT（Codex）主要负责工程实现与独立代码审查；Claude 和 Gemini 都能做界面与视觉。

遇到需要理清思路和推进工程的任务，我会配合使用 Matt Pocock 的技能集，用来澄清需求、拆分任务，以及做后续的问题诊断和代码审查。如果是跨阶段的梳理，就换上 pstack，让它帮着做整体规划、架构判断、阶段复盘，以及在切换节奏时做工作上下文梳理。

平时具体的工程执行、代码审查和功能验证，都由 agent 按照既定要求自己往前推，不需要每走一步都停下来问我。我们也会按任务安排独立审查，去检查代码是不是符合项目规范和最初的需求，并且用实际操作去验证功能真的能用。

这里配合了一个带登录状态的 agent 浏览器，同时推荐开源的 egolite。agent 可以直接操作网页、跑通真实流程，再把页面结果展示给我。

在我的桌子旁边还放着第二台 MacBook Air，专门留给 agent 做真机键鼠和界面操作测试，让它们的界面验证和我主力电脑上的工作分开，互不打扰。

对我来说，产品真正上线、放进真实场景里使用才有意义。**工程上的检查和验证交给 agent 推进，我把省下来的精力放在设计审美和产品取舍上**：设计是不是符合最初的意图，视觉效果我自己满不满意，这些关键判断由我自己把关。

## 多项目管理：一个主对话与共享工作台

![](https://pbs.twimg.com/media/HWCw_0gacAEz-gH.jpg)

我平时会同时开发好几个项目。过去我还在使用终端的时候，是我得在脑子里自己记着每个项目的进展，在一堆对话窗口之间来回切换、挨个追问。

![](https://pbs.twimg.com/media/HWC7ylwbEAE7H78.jpg)

![](https://pbs.twimg.com/media/HWDDSs3aUAA-djL.jpg)

![](https://pbs.twimg.com/media/HWDDUTdbgAEA6kY.jpg)

Grok Bot 那种单一主对话、在背后自己协调其他线程的设计启发了我。我现在日常只跟一个主对话打交道，并且自己给 Claude Code 做了一套桌面端，把原本偏命令行的交互，变成了接近 personal agent 的日常使用体验。

**这种单一入口之所以能顺畅运转，关键在于连续协作：它越来越懂我的标准。**我在工作里的偏好、项目约定、审美取向，还有一路下来的工作记录，都在日常协作里持续积累，不会因为每次换个任务就从零开始。

为了做出这种连续性，我在背后确实做了不少工程上的努力。这些积累有独立的记录和知识库支撑，让很多话不用反复交代。

光有一个主对话还不够，**多条项目线同时推进时，大家必须看着同一份事实干活。我把 Linear 当成共用的工作依据。**我的原话、讨论后的决定、拆出来的具体任务、阶段进展，以及最后交回的验证证据，全都留在 Linear 的条目里。

Linear 非常适合作为调度层，以 Issue 为单位进行状态与上下文同步，并且很适合作为证据交回审阅端。

以条目为依据推进工作，只要那边有了新变化，主 agent 就会收到并主动接着往下跟进。

## 内容调研与对外发布：社区追踪与录制归档

![](https://pbs.twimg.com/media/HWCxBsSacAAjV4F.jpg)

当产品和页面在工作台里打磨得差不多了，内容调研与对外发布这条线也在同步运转。

我平时用 [@bot](https://x.com/bot)帮我盯着 X 上的状态，追踪我关心的热点，并在合适的时机给我定点提醒。

每次准备发帖前，我会先让 Grok 去调研一下相关话题，看看大家正在讨论什么、有哪些讨论者参与、哪些帖子反响好；等帖子发出去之后，再让它帮我复盘回看帖子的实际表现。在这个过程里，Gemini 也会负责文案和视频理解方面的工作。

我桌上摆着 groki，我可以直接对着桌上的小机器人语音交代任务、听它念出回复，不用特意切回某个聊天窗口，就能把指令转交给背后的 agent 并随时接上社区动态。

![我的esp32开发流程](https://pbs.twimg.com/media/HWCxNw1bMAEMmXH.jpg)

我的esp32开发流程

而在一条想法真正变成大家在 X 上看到的成品之前，最后一步是录制与整理。日常无论是为已完成的工作留存演示画面，还是制作对外发布的视频，我们都会用 Screen Studio 和 CleanShot 来做录屏与截图。

截图、录屏和最终交付物，也会归档到 Eagle 里，变成下一轮创作可以直接调用的积累。一条做好的视频和内容最后能不能发出去，依然由我自己看过再决定。

## 日常操作：把注意力留给正在做的事

最后回到每天手边的日常操作。除了前面提到的屏幕与小机器人，我桌上还摆着一台 Stream Deck 和我常用的罗技鼠标。

Stream Deck 和罗技鼠标都是我用得很顺手的设备，但它们都有替代品。真正重要的是，能把一组经常重复的操作变成随手可用的快捷操作。

注意力很珍贵。每次停下来找按钮、切换界面、重复操作，都会打断正在进行的思考。我用这些设备，是希望**少把注意力花在操作工具上，让它留在创作上。**

## 写在最后

当然，这套工作流本身也是一个还在不断迭代的「作品」。每当我在日常开发里遇到新的困难，就会顺手写个新工具或者改掉一段流程——我会用自己的痛点进行迭代。

**最好的工具栈，永远是结合自己真实工作流里的那一套。**

后面随着手头几个新产品的正式发布，以及我在审美积累上的一些具体方法，我还会继续毫无保留地分享出来。如果你觉得这篇内容有用，不妨点个关注，我们一起前行。
