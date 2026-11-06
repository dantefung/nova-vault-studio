---
title: "Han Cheng e/acc（@ashfold）：发布 dim——为 Agent 构造新的容器与躯体"
date: "2026-11-06"
source: "X/Twitter"
author: "Han Cheng e/acc (@ashfold)"
url: "https://x.com/ashfold/status/2118247562838933827"
coverImage: "../images/ashfold-dim-event-timeline-agent-harness-release/001.jpg"
---

# Han Cheng e/acc（@ashfold）：发布 dim——为 Agent 构造新的容器与躯体

> 开源 agent harness「dim」发布：以持续延伸的事件时间线（不可变事件 + capability 状态机消费分发）取代传统消息列表式 harness；支持接入环境事件与结构化召回历史（元提示机制）、通过时间线分支实现同一 agent 的「分神」并行探索与自我反思（goal/pursuit 模式）、以及基于 rutis 的多语言多设备插件体系为 agent 构造躯体，MIT 协议。

<!-- more -->

今天，我们开源 dim——一个以事件时间线为核心的 agent harness。

我们希望 agent 不只是响应一轮轮对话，还能感知环境、回顾历史、并行探索，并持续推进目标。

随着模型越来越聪明，agent 架构也需要随之改变：少一些约束，多一些引导，让模型有更大的空间去理解、探索和行动。

围绕这个想法，dim 有四个主要的架构特点。

## 以事件时间线驱动 Agent

许多 agent harness 以消息列表和模型请求为中心。dim 则以一条持续延伸的事件时间线为核心。

用户输入、agent 的判断和行动、工具执行结果，以及 harness 自身的工作，都可以成为时间线上的事件。这条时间线记录了 agent 与世界交互的过程，也保存了它持续运行的历史。

事件一旦写入就不可更改，并会被分发。我们把负责消费和处理事件的状态机称为 capability。它们各自推进相关工作，让发生的事情得到处理和落地。

因此，agent 的历史不再只有对话，还包括它的观察、行动和结果。

## 感知环境，召回历史

我们希望 agent 不只是等待用户输入，也能主动了解自己所处的环境。

在 dim 中，agent 可以选择接入更多环境事件。例如，它可以了解用户正在通过哪个终端、网页或客户端与自己交互，也可以感知周围配置的变化。

开发者、使用者，甚至 agent 自身，都可以定义**元提示**，帮助 agent 理解发生的事情。

agent 还可以结构化地召回整条时间线上的历史，包括过去的对话、事件、行动和结果。

有了更完整的环境和历史信息，agent 就能在更丰富的上下文中理解任务，也有机会发展出更主动的探索和行动能力。

## 通过时间线分支“分神”

dim 支持创建时间线分支，让 agent 并行探索、反思和推进多条任务线。

我们把这种能力称为**分神**。与 subagent 或多 session 协作不同，分神代表同一个 agent 在不同分支中开展思考和工作。

各个分支拥有与主分支相同的资源、隔离区域和规则，并在提示词层面保持统一的“我”的认识。

分神让 agent 有机会从不同角度思考问题，也能通过自我反思持续推进长期目标。dim 的 **goal（pursuit）模式**就是这种能力的一个例子。

## 用插件构造 Agent 的躯体

模型提供思考能力，工具、设备和运行环境则让 agent 能够与世界交互。我们把这些能力看作 agent 的躯体。

dim 基于 rutis 构建多插件体系。开发者可以使用 TypeScript、Go、Python、Swift、Kotlin 等语言构造插件，接入不同生态的能力，帮助 agent 扩展和迭代自己的躯体。

插件可以运行在不同设备上。dim 的 timeline、store、execution 等组件也可以远程挂载，为云端 agent 提供更多可能。

我们希望未来移动设备、ESP32 等都能成为 agent 的主体或分支，并通过不同的网络栈互联。

## 一起把它做好

dim 以 MIT 协议开源。我们希望每个人都能基于这个框架实践自己的想法，构造属于自己的 agent。

我们会继续完善仓库里的代码和文档。上手时如果遇到问题、发现说明不清楚，或者有想探索的使用场景，欢迎到仓库的 Issues 留下具体反馈。

后续我们还会陆续发布文章和视频教程，把上手过程、运行机制和使用方法讲清楚，欢迎关注。

源码与上手说明： https://github.com/arcships/dim

## 相关页面

- [[sources/antivo-deepseek-super-agent-distributed-master-worker]]
- [[sources/pinminlw-malaysia-personal-tax-number-tin-online-guide]]
- [[concepts/agentic-architectures]]
- [[concepts/loop-engineering]]
