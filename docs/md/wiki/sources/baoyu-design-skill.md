---
title: "发现一个好用的 AI 设计 Skill：baoyu-design"
date: "2026-06-17"
source: "AI 探索"
url: "https://mp.weixin.qq.com/s/_PJS3PtlWUYSRg1VteRoBg"
---

# 发现一个好用的 AI 设计 Skill：baoyu-design

> 最近看到宝玉分享了 baoyu-design 的新进展：这个 Design Skill 现在可以把生成的动画直接导出成 MP4。安装好这个 Skill 后，只用一句话，让它生成一个 30 秒的视频。过程中它自动安装了 headless Chrome，用来渲染动画画面。最后导出的视频效果，确实有点炸裂。

- **项目地址**：[JimLiu/baoyu-design](https://github.com/jimliu/baoyu-design)

## 它不是普通网页工具，而是一个 Skill

baoyu-design 不是一个普通网页工具。它本来就是一个 Agent Skill，用来把 Claude Design 这类设计能力，放进 Cursor、Claude Code、Codex 这些本地 Agent 工作流里。

**网页工具 vs Skill 方式的区别：**

| 维度 | 网页工具 | Skill 方式 |
|------|----------|-----------|
| 操作 | 打开网站，在网站里生成/预览/导出 | 安装到本地 Agent，按流程完成设计/预览/修改/导出 |
| 产物位置 | 锁在网页产品里 | 落在自己的项目目录里 |
| 可编辑性 | 通常是静态截图 | 可以继续改源码、放进 Git、让 Agent 继续调整 |

这对开发者很友好。

## 它能做什么？

按 GitHub README 的介绍，baoyu-design 可以生成：

- UI 高保真设计稿
- 可交互原型
- 线框图
- 落地页
- Dashboard
- 移动 App 页面
- 幻灯片 / PPT
- 动画视频
- 自包含 HTML 文件

核心产物不是一张静态图片，而是可以继续编辑的本地文件。生成一个页面后，可以预览、可以改源码、可以放进 Git，也可以让 Agent 继续调整细节。在 Cursor 里打开预览，看到某个按钮不顺眼，甚至可以**直接点选元素，让 Agent 去改对应源码**。这比「生成一张不能编辑的设计图」更接近真实工作流。

## 为什么说它是一个好 Skill？

AI Agent 真正好用，不只是模型强，而是有没有好 Skill。

单条 Prompt 很难稳定。今天你让 AI 做一个页面，它可能做得不错；明天换一个需求，它可能又开始乱发挥。原因是 Prompt 只是临时描述，没有把完整流程沉淀下来。

**一个好的 Skill 包含：**

- 什么时候该使用它
- 应该按什么流程工作
- 产物放在哪里
- 怎么预览
- 怎么校验
- 怎么导出
- 在不同 Agent 里怎么适配

baoyu-design 就是这种思路。它不是简单告诉模型「你是一个设计师」，而是把设计方法、组件脚手架、导出工具、预览检查都组织起来，让 Agent 能按一套流程做事。

## 一句话生成视频

实际体验中最惊艳的是视频导出。

只给了一个很短的需求，让它做一个 30 秒左右的演示视频。它会：

1. 生成动画页面
2. 用 headless Chrome 在后台渲染画面
3. 导出成 MP4

**这和做好网页版再录屏不是一回事：**

| | 录屏 | baoyu-design |
|------|------|-------------|
| 方式 | 实时播放时录屏 | 逐帧拍照，精确控制动画时间轴 |
| 稳定性 | 机器一卡就掉帧，可能录进播放器外壳 | 稳定、可复现，不容易掉帧 |
| 速度 | 快 | 慢一些 |

它会精确控制动画时间轴：第 0 秒截一张，第 1/30 秒截一张，第 2/30 秒再截一张……最后把这些帧交给 ffmpeg 编码成视频。

对做技术解释视频、产品演示视频的人来说，这个能力很有用。比如想解释 RAG、Agent 调用工具、API 请求流程、产品操作路径，以前可能要自己画图、剪视频。现在可以让 Agent 先生成动画，再导出成视频素材。

## 安装与使用

```bash
# 默认安装
npx skills add JimLiu/baoyu-design

# 指定 Agent
npx skills add JimLiu/baoyu-design --agent claude-code
npx skills add JimLiu/baoyu-design --agent cursor
npx skills add JimLiu/baoyu-design --agent codex
```

装好后，直接用自然语言提需求。例如：

> 帮我做一个 30 秒动画视频，介绍如何使用 baoyu-design 生成 UI、PPT 和动画视频。

> 帮我设计一个 AI 笔记 App 的首页，要求简洁、适合桌面端，生成 3 个高保真方案。

> 帮我做一个介绍 RAG 工作流程的动画视频，用 60 秒讲清楚：用户提问、检索知识库、模型生成答案这三个步骤。

如果不安装，也可以把 GitHub 链接直接发给 Agent，让它读取仓库里的 `skills/baoyu-design/SKILL.md`，临时跑一次。

## 小结

baoyu-design 值得关注，不只是因为它能生成设计稿、PPT 或动画视频。更重要的是，它代表了一种趋势：AI 能力结合 Agent 可以调用、组合、复用的 Skill。

如果你正在用 Cursor、Claude Code 或 Codex，不妨把 baoyu-design 放进工具箱里试试。哪怕只是拿它做一个产品页面、一个 PPT，或者一个技术解释动画，也能很快感受到 Skill 化工作流的优势。