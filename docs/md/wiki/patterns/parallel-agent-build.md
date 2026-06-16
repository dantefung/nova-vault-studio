---
title: "Parallel Agent Build"
date: "2026-06-13"
source: "ai-website-cloner-template"
url: "https://github.com/JCodesMore/ai-website-cloner-template"
---

# Parallel Agent Build

在 git worktrees 中派发构建 agent，每 section/component 一个，并行构建后合并。

## 核心思想

并行化加速：每个 builder agent 独立工作，最后合并结果。

## 工作流程

1. 派发多个 build agent 到独立 worktrees
2. 每个 agent 构建一个 section/component
3. 合并所有 worktrees
4. 拼接页面
5. 视觉 diff 对比原站

## 相关

- [[ai-website-cloning]] — AI 网站克隆
