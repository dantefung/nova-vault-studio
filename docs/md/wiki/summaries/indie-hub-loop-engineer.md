---
title: "开始Loop Engineer之前，请先把loop、hook、goal用好"
date: "2026-06-26"
source: "空格丶"
url: "https://mp.weixin.qq.com/s/RWs-wFHYwtyC43-RehoJDw"
---

## 核心内容

Loop Engineering 对个人来说落地太难，但 loop/hook/goal 这三个能力用起来很稳，已经能让 Agent 价值上一个台阶。

## 三个核心能力

| 能力 | 触发方式 | 用途 |
|------|----------|------|
| /loop | 时间触发，到点自动跑预设任务 | 播客处理、凌晨省token集中跑、RSS归类 |
| /hook | 事件触发，AI干完某件事自动跑脚本 | AI腔扫描、Git commit前密钥扫描 |
| /goal | 目标驱动，AI自己规划/执行/验证 | 30分钟以上复杂任务 |

## /loop实践案例

**每日播客流水线**：晚上10点跑，拉过去24小时更新→按关键词过滤3-5个→推送到飞书知识库

**凌晨3点省token集中跑**：把不需要实时的任务（RSS归类/热点抓取/选题生成/对话归档/截图整理）打包到凌晨，节省白天token限额

## /hook实践案例

**AI腔扫描器**：Claude写完.md文件后自动扫描黑名单词典，命中则让Claude重写
**Commit前密钥扫描**：git commit前扫描API key，命中则阻断

## /goal关键五件事

1. 先写意图不要写步骤
2. 要求AI先把意图翻译成goal
3. 判断要不要多Agent并行
4. 主线程保留协调权
5. 目标漂移时必须显式说明改了什么

## Loop Engineering完整6模块

自动化、Worktree、Skill、连接器、子Agent、状态文件

## 关联概念

[[Loop Engineering]] [[hook机制]] [[goal驱动]] [[Claude Code]] [[Codex]]
