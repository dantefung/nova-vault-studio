---
title: "ian-xiaohei-illustrations"
date: "2026-05-29"
---

# 小黑怪诞正文配图 Skill

> 中文文章配图生成 Codex Skill，白底手绘风格，小黑 IP 参与系统运转的荒诞工作者

**GitHub**: https://github.com/helloianneo/ian-xiaohei-illustrations

## Core Concept

把中文文章里的判断、流程、状态和隐喻，变成一张张白底、手绘、怪诞但清爽的正文配图。

**核心目标**：先理解文章里的认知锚点，再把其中一个判断、流程、结构、状态或隐喻，变成一张有记忆点的 16:9 手绘解释图。

## 视觉风格

- **16:9 横版**正文配图
- **纯白背景**，不要纸纹/米色/阴影/渐变
- **黑色手绘线稿**，细线，轻微抖动
- **大量留白**，主体占画面约 40%-60%
- **少量红橙蓝中文手写批注**
- **小黑 IP**：黑色实心、白点眼、细腿、空表情的小角色，必须参与核心动作
- **怪诞、有创意、清爽**，但不幼稚、不卖萌

## 适合谁用

**适合：**
- 写中文文章，需要正文配图的人
- 做知识型、方法论、AI 工作流内容的人
- 想把抽象判断画成具体隐喻的人
- 用 Codex 做内容生产，希望稳定复用视觉语言的人

**不适合：**
- 想要商业插画、品牌 KV、精致扁平插画
- 想要传统 PPT 信息图、复杂架构图
- 想要儿童卡通、可爱 IP、表情包风格

## 安装

```bash
git clone https://github.com/helloianneo/ian-xiaohei-illustrations.git
cd ian-xiaohei-illustrations

mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R ./ian-xiaohei-illustrations "${CODEX_HOME:-$HOME/.codex}/skills/"
```

## 使用方式

**配图规划（不生图）：**
```
Use $ian-xiaohei-illustrations 先不要生图。
请分析下面这篇文章哪里值得配图，输出 5 张左右的 shot list。
```

**直接生成配图：**
```
Use $ian-xiaohei-illustrations 把下面这篇文章生成 4 张小黑怪诞正文配图。
要求：16:9 横版、纯白背景、黑色手绘线稿、少量红橙蓝中文手写批注。
```

**单个概念一张图：**
```
Use $ian-xiaohei-illustrations 为"信任不是喊出来的..."生成一张正文配图。
```

## 工作流程

1. 读取文章/截图/用户主题
2. 提炼核心观点、认知转折、流程结构
3. 输出 shot list：每张图只选一个认知锚点
4. 选择结构类型（Workflow/系统局部/对比/角色状态/概念隐喻等）
5. 重新发明低科技、怪诞但成立的物理隐喻
6. 让小黑承担核心动作
7. 单独调用图像模型生成
8. 按 QA checklist 检查
9. 保存最终 PNG

## 示例

- 两个断点
- 按目的分拣
- 一鱼多吃
- 承接路径
- 信息井
- 想法压机
- 内容发酵
- 信任桥

## 相关项目

- [Ian Handdrawn PPT](https://github.com/helloianneo/ian-handdrawn-ppt) — 中文手绘技术 PPT 页面图生成
- [Awesome Claude Code Skills](https://github.com/helloianneo/awesome-claude-code-skills) — Claude Code Skills 精选合集
- [Obsidian + Claude AI Second Brain](https://github.com/helloianneo/obsidian-ai-second-brain) — Obsidian + Claude AI 个人知识库

## Resources

- [GitHub](https://github.com/helloianneo/ian-xiaohei-illustrations)
- 作者：[@ianneo_ai](https://x.com/ianneo_ai)