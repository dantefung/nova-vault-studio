---
title: "纳米AI（@antiAIvo）：一图看懂 DeepSeek Super-agent 三层架构——事件双筛、Router 调度与 Worker 并发"
date: "2026-11-03"
source: "X/Twitter"
author: "纳米AI (@antiAIvo)"
url: "https://x.com/antiAIvo/status/2117255686862336455"
---

# 纳米 AI（@antiAIvo）：一图看懂 DeepSeek Super-agent 三层架构——事件双筛、Router 调度与 Worker 并发

> 极简动图总结 DeepSeek Super-agent 三层核心设计：第一层事件双筛（代码规则快速过滤 + LLM 语义决策）、第二层 Router 常驻分派与全局上下文记忆（轻量模型无 Bash 权限）、第三层 Worker 独立并发执行并直通后续事件，真正实现从拉取式问答到 7x24 全天候事件监听的范式转变。

<!-- more -->

DeepSeek 前两天发了一篇 Super-agent 设计探索

我把架构画成了动图，方便理解

核心思路一句话：

Agent 不再是你问一句它答一句

而是一个长期在线、自己盯着事件的系统

结构分三层

一、事件进来先过两道筛

群聊、GitHub 评论、CI 结果、邮件日历都能触发

第一道用程序规则快速筛，按来源、群组和白名单

第二道交给 LLM，按策略决定接不接

二、Router 常驻调度

它是唯一对人说话的角色

负责分派任务，并记住跨任务的上下文

用轻量模型就够，而且不给 Bash 权限

三、Worker 并行干活

每个任务一个独立会话，配全套工具和强模型

接手某个 PR 之后，就订阅这个 Thread

后面的评论和 CI 结果直接送到它那里，不再经过 Router

![Deepseek Super-agent 架构](https://pbs.twimg.com/tweet_video_thumb/HWIAH7vbkAASFqC.jpg)

[animated_gif](https://video.twimg.com/tweet_video/HWIAH7vbkAASFqC.mp4)

## 相关页面

- [[sources/criscxuan-deepseek-super-agent-architecture-teardown]]
- [[sources/coderleft-deepseek-super-agent-architecture-deep-dive]]
- [[sources/xiaohu-deepseek-super-agent-experiments-and-security-cost]]
- [[concepts/deepseek-harness-agent-formula]]
