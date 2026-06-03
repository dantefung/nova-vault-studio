---
title: "2.8万 Star 的 oh-my-codex：Codex 真正缺的不是模型，是工作流"
source: "微信公众号-wayn"
url: "https://mp.weixin.qq.com/s/UjEfMLz19GK79gQQwBVJRQ"
date: "2026-05-26"
---

# oh-my-codex：Codex 真正缺的不是模型，是工作流

2.8 万 Star 的 oh-my-codex 不是让模型更聪明的魔法包，而是一套把 Codex 管起来的**工程流程**：先问清需求，先写计划，先审风险，再进入长任务执行。

## 核心价值

普通 prompt 在教模型"怎么回答"，oh-my-codex 的重点是规定"**什么时候不能急着回答**"。

解决的问题：长任务、模糊需求、多 Agent、计划漂移、验证不完整。

## 适用场景

- 小修小改：原生 Codex CLI 就够
- 复杂任务（功能重构、复杂 bug、一整个功能交给 Codex）：oh-my-codex 才有价值

## AI 编程最危险的不是慢，是太快

- 你一句话还没说清，它已经开始改文件
- 你只是想讨论方案，它已经建了新模块
- 你让它修一个 bug，它顺手重构半个目录

## 工作流顺序

`$deep-interview` → `$ralplan` → `$prometheus-strict` → `$ultragoal`

先问清楚 → 写计划 → 高风险任务审一遍 → 最后执行

### $deep-interview

适合处理一句话说不清的需求。比如"帮我重构登录模块"——这句话其实什么都没说清楚：重构到什么程度？只改前端还是连后端？旧 token 兼容性？测试怎么验收？

先问清楚，比给 Codex 加十个工具更实际。