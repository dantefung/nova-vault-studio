---
title: "让 Agent 不会停下来：goal 命令 - 合集"
date: "2026-06-02"
source: "微信公众号-袁小康"
url: "https://mp.weixin.qq.com/s/DfDFsIhLZJp1NiXz9dp7ug"
---

# 让 Agent 不会停下来：goal 命令

> 合集说明：本文是袁小康「Agent 系列」第 16 篇，尾部关联了前 15 篇相关文章链接（附后），本合集将持续收录该系列所有文章。

## 本篇

| 属性 | 值 |
|------|------|
| 标题 | 让 Agent 不会停下来：goal 命令 |
| 作者 | 袁小康 |
| 来源 | 微信公众号-天空的代码世界 |
| 发布时间 | 2026年6月2日 |
| 链接 | [原文](https://mp.weixin.qq.com/s/DfDFsIhLZJp1NiXz9dp7ug) |

### 核心要点

- **问题根因**：LLM 不调工具仅返回文本时，Loop 直接退出
- **解法**：在 Loop 退出前加一个「目标达成」判断
- **双层校验**：结构化校验（快，扫 todo/plan）+ 小模型语义评估（慢，只在最后用）
- **三层记忆**：todo（短任务）/ Session Plan（长会话）/ /goal（轮次间）

### 正文

<article-content />

---

## 系列文章索引

> 共 16 篇，持续更新中。点击标题跳转原文。

| 序号 | 标题 | 作者 | 日期 |
|------|------|------|------|
| 01 | [Agent 的本质：一个 Loop 循环](https://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650116887&idx=1&sn=28b7c4b5274dbc63ef803c4cbdf4d21e&scene=21#wechat_redirect) | 袁小康 | - |
| 02| [Agent 的手脚：工具 Tools](./article-02.md) | 袁小康 | - |
| 03| [Agent 的上下文记忆：Message 列表](./article-03.md) | 袁小康 | - |
| 04| [Agent 的上下文压缩：3个策略](./article-04.md) | 袁小康 | - |
| 05| [Agent 的万能插座：MCP 协议](./article-05.md) | 袁小康 | - |
| 06| [Agent 的 Skill：可复用的工作流](./article-06.md) | 袁小康 | - |
| 07| [Agent 的 TUI：终端交互界面](./article-07.md) | 袁小康 | - |
| 08| [Agent 的任务规划：TODO](./article-08.md) | 袁小康 | - |
| 09| [Agent 的子代理：隔离上下文](./article-09.md) | 袁小康 | - |
| 10| [Agent 的斜杠命令：Command](./article-10.md) | 袁小康 | - |
| 11| [Agent 的跨会话记忆：Auto Memory](./article-11.md) | 袁小康 | - |
| 12| [Agent 的项目导航：Agent.md](./article-12.md) | 袁小康 | - |
| 13| [Agent 的系统提示词](./article-13.md) | 袁小康 | - |
| 14| [Agent 的持久化任务](./article-14.md) | 袁小康 | - |
| 15| [Agent 的跨会话：Session 持久化](./article-15.md) | 袁小康 | - |
| 16 | [让 Agent 不会停下来：goal 命令](./goal-command.md) | 袁小康 | 2026-06-02 |

---

## 系列架构图

```
Agent Loop
├── 工具 Tools               ← #02
├── 上下文记忆 Message List  ← #03
├── 上下文压缩 Compression   ← #04
├── MCP 协议                ← #05
├── Skill 工作流            ← #06
├── TUI 交互                ← #07
├── TODO 任务规划           ← #08
├── 子代理 Sub-Agent         ← #09
├── Command 斜杠命令        ← #10
├── Auto Memory 跨会话      ← #11
├── Agent.md 项目导航       ← #12
├── 系统提示词              ← #13
├── 任务持久化              ← #14
├── Session 持久化          ← #15
└── /goal 完成条件          ← #16（本篇）
    ├── todo 短任务记忆
    ├── Session Plan 跨会话
    └── 小模型裁判评估
```