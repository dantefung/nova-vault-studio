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
| /loop | 时间触发，到点自动跑预设任务 | 播客处理、凌晨省 token 集中跑、RSS 归类 |
| /hook | 事件触发，AI 干完某件事自动跑脚本 | AI 腔扫描、Git commit 前密钥扫描 |
| /goal | 目标驱动，AI 自己规划/执行/验证 | 30 分钟以上复杂任务 |

## /loop 实践案例

**每日播客流水线**：晚上 10 点跑，拉过去 24 小时更新→按关键词过滤 3-5 个→推送到飞书知识库

**凌晨 3 点省 token 集中跑**：把不需要实时的任务（RSS 归类/热点抓取/选题生成/对话归档/截图整理）打包到凌晨，节省白天 token 限额

## /hook 实践案例

**AI 腔扫描器**：Claude 写完.md 文件后自动扫描黑名单词典，命中则让 Claude 重写
**Commit 前密钥扫描**：git commit 前扫描 API key，命中则阻断

## /goal 关键五件事

1. 先写意图不要写步骤
2. 要求 AI 先把意图翻译成 goal
3. 判断要不要多 Agent 并行
4. 主线程保留协调权
5. 目标漂移时必须显式说明改了什么

## Loop Engineering 完整 6 模块

自动化、Worktree、Skill、连接器、子 Agent、状态文件

## 关联概念

[[Loop Engineering]] [[hook 机制]] [[goal 驱动]] [[Claude Code]] [[Codex]]
