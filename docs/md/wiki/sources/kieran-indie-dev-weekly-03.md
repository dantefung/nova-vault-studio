---
title: "周报 #3 追逐模型的热潮褪去，我的 10x 工作流是如何工作的"
date: "2026-10-25"
source: "博客"
author: "Kieran Zhang"
url: "https://kieran.build/zh/blog/indie-dev-weekly-03/"
---

# 周报 #3 追逐模型的热潮褪去，我的 10x 工作流是如何工作的

> 作者观察到 AI 脚步在放缓、FOMO 情绪消失，转而专注于构建多 Agent 协作的信任环境。通过 Lody 编排层 + Claude Desktop 的两套工作流，在过去两周实现了 GitHub 1100 次贡献、303 个 PR，平均每天 80+ contributions、20+ PR。

<!-- more -->

## 情绪面：AI 脚步放缓，我的 FOMO 消失了

最近明显感受到 AI 的脚步在放缓，自己的 FOMO 情绪消失很多。原因有三：

- **强如 OpenAI 也在没活烂整**：Tibo 那个 28 天计划，天天不知道在搞什么东西。
- **再也没有出现像 OpenClaw 这种现象级的产品**：说明很多人可能生活中真的用不上 AI，除非 AGI 已经到来。
- **现有模型能力已足够**：现在模型的 Coding、Design 以及 3D 能力都足够强，能完成很多以前想都不敢想的作品。即使未来几个月没有更强的模型出现，依然能完成很多 idea。

所以现在的重点是静下心来学习薄弱部分（比如 UI/UX 设计），构建和 Agent 协作的信任环境，把效率高质量地提高，成为一个 10x 工程师。

## 一、介绍工具以及工作流

这部分是读者可能最感兴趣的——看到新的工具或工作流，直接拿来用或尝试。但本着对文字负责的态度，**请读者只作为参考，找到最合适自己的**。

### 开发机器

- **MacBook Pro**：48G + 512G，磁盘空间太少了，准备换新的 Mac Mini。
- **Omarchy 小主机**：64G + 2T，铭凡家的 X1 Pro H470，逐渐成为日常主力机。

### 两套工作流

1. **偏向自动化和长程任务的 orchestration 模式**：多 Agent 系统，使用 [Lody](https://lody.ai/login?ref=5e9e10e4e62e4efd960e909ec80bd9f6) 作为编排层。
2. **直接使用 Claude Desktop**：用于需要实时把控方向的 UI/UX 打磨。

## 二、基于 Lody 的多 Agent 编排系统

### Lody 简介

[Lody](https://lody.ai/login?ref=5e9e10e4e62e4efd960e909ec80bd9f6) 是一个编排多 Harness 的控制面软件，基于 ACP 协议控制不同电脑上的不同 harness，几乎覆盖所有主流 Harness。Lody 还拥有 Agent Role 具名代理的功能，可以配置不同分工的 Agent 预设。

### Agent Team 分工

| 角色 | 模型 | 职责 |
|------|------|------|
| Planner | Opus 5.5 | 架构和方案设计，human in the loop 的沟通主循环 |
| Linux-worker | DeepSeek V4.1 Flash | 力工模型，主要负责实现代码，在 Omarchy 上工作 |
| Apple-worker | DeepSeek V4.1 Flash | 同上，在 Mac 上工作 |
| Critic | GPT Sol 6.1 | 对抗性审查设计方案 |
| Writer | Gemini Argon 4 | 中文文字润色，主要是网站 SEO 和 App 文案 |

### 工作流程

Planner 是主循环，负责和作者设计架构方案和做特性 spec。定下来具体怎么做以后，由两个 worker 来实施（因为项目是跨平台开发，所以有两个 worker 分别在 Omarchy 和 Mac 上进行）。

- 派发工作遵循作者设计的 brief 格式
- 最后由自部署的检视系统进行检视
- Critic 主要对涉及到协议或决策变更进行对抗性审查
- 一般在 planner 和 critic 达成一致之后的决策问题再由作者决定

**典型节奏**：睡前开启一个大特性或大的架构设计讨论，拆成好几个 GitHub Issue，留给 Lody 在睡觉的时候跑，第二天起床查看结果。作者形容这"很像 QQ 农场去收菜"。

零碎的 bug 也可以这么操作：某天只和 planner 沟通这些小 bug，它会调查清楚现状后开启一个 issue，描述好 bug 的现象，在睡觉前开启一个 goal 去清理白天记录的这些问题。

### 成果数据

这套工作流持续快一个月了，过去两周作者在 GitHub 上一共有 **1100 次 contributions、303 个 PR**，平均每天大约 **80 次 contributions、20 多个 PR**，勉强达到了 10x 的目标。

## 三、单独使用 Claude 进行 UI/UX 的打磨

对于 UI/UX 的打磨，作者更倾向于直接使用 Claude Desktop，原因：

1. 看实时的效果非常方便
2. 前端的工作更需要人一直去把控方向

作为前端和设计小白，作者还在摸索之中，目前比较喜欢**先产出多种 Prototype 方案，然后对比微调喜欢的那个原型，最后再落实到项目上**。

### 小技巧

可以单独在应用里做一个 **Design 页面**或者建立自己的 **StoryBook**，方便以后浏览所有打磨过的组件。

### 审美和品味的积累

目前作者还在参考和学习的阶段，会去大量浏览其他产品或者设计师的设计。**看多了之后，想到一个场景可能就会马上浮现出 UI 的样子**，大概知道应该怎么做。然后再用上面的流程，从原型开始设计和打磨。

## 边界与判断

- **这不是通用答案**：作者明确提醒读者"只作为参考，找到最合适自己的"
- **双工作流分工明确**：Lody 用于长程自动化任务（夜间跑工），Claude Desktop 用于需要实时把控的 UI/UX
- **成果可验证**：GitHub 数据公开可查（1100 contributions / 303 PRs over 2 weeks）
- **依赖特定硬件**：需要 Omarchy 小主机 + MacBook Pro 双机配合

## 相关页面

- [[concepts/agentic-architectures]] — Agent 架构形态谱系。
- [[patterns/agent-skill-design-patterns]] — Agent Skill 设计模式。
- [[sources/agent-relay-multi-agent-hands-on]] — Agent Relay 多 Agent 协作实测。
- [[concepts/harness-engineering]] — Harness 工程化的一般原理。

---

*原文发布于 kieran.build，配图已本地化。原帖同步发布于 [X](https://x.com/ninthbit_ai/status/2114011345058435098)。*
