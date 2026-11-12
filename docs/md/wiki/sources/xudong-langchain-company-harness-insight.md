---
title: "Xudong Han：LangChain 公司级 Harness 的中文解读——Agent 以谁的身份干活"
date: "2026-10-27"
source: "X/Twitter"
author: "Xudong Han (@Xudong07452910)"
url: "https://x.com/Xudong07452910/status/2114876984304263464"
---

# LangChain 公司级 Harness 的中文解读：Agent 以谁的身份干活

> LangChain 公开了内部销售、研发、内容三个团队的 Agent Harness 架构。其中最棘手的问题是「Agent 到底以谁的身份干活」。做企业 Agent 的工程师，这些细节平时讨论不多，但真落地一个都绕不过去。

<!-- more -->

## 原始推文

```text
最近 LangChain 分享了内部销售、研发和内容团队的 Agent Harness 架构，里面有不少值得借鉴的工程细节。

他们发现，最棘手的问题之一是「Agent 到底以谁的身份干活」。

比如销售 Agent 查询 Salesforce 可以用公司统一账号，但发邮件必须使用用户自己的授权，而且只能在私聊中操作。

Coding Agent 也一样。帮你提交 PR 时，用你的 GitHub 身份；在后台自动审查代码时，则切换成独立的 GitHub App。

内容 Agent 发公司 Twitter，用的是公司账号，但只有白名单用户能真正发帖。

除此之外，还有几项关键设计：

1. Agent 直接接入 Slack，不用员工换平台；需要时还能从工讨论里「拆」出独立线程
2. Memory 分全局和个人两层，由 Agent 自己决定一条事实记到哪一层
3. 代码在沙箱里执行，经安全代理访问外部服务
4. 大量任务是定时或事件触发的，不一定等人开口。比如新 PR 自动 Review，或者你跟它说一声，它自己挂上每天销售简报

Demo 阶段跑得通的 Agent，一进公司就会撞上身份和权限边界。这些细节平时讨论不多，但真落地一个都绕不过去。

这些细节平时讨论得不算多，但真到落地时，一个都绕不过去。推荐做企业 Agent 的朋友读读。

原文：https://t.co/4nUIFAJkzG
```

---

## 核心提炼

### 一、身份问题是企业 Agent 的第一道门槛

Demo 阶段跑得通的 Agent，一进公司就会撞上**身份和权限边界**。LangChain 的三种 Agent 各自示范了身份的处理方式：

| Agent | 场景 | 身份 |
|---|---|---|
| 销售 Agent（GTM） | 查询 Salesforce | 公司统一账号（固定凭据） |
| 销售 Agent（GTM） | 发邮件 | 用户自己的授权，且**只能在私聊中操作** |
| Coding Agent（OpenSWE） | 帮你提交 PR | 你的 GitHub 身份 |
| Coding Agent（OpenSWE） | 后台自动审查代码 | 独立的 GitHub App |
| 内容 Agent（Content Studio） | 发公司 Twitter | 公司账号 |
| 内容 Agent（Content Studio） | 真正发帖 | **仅白名单用户**有权限 |

**规律**：同一台 Agent 在不同工具上可能拥有完全不同的身份语义；「工具可用范围」（私聊 vs 频道）与「调用授权范围」（白名单）构成两层独立约束。

### 二、其余四项关键设计

1. **Agent 直接接入 Slack**，不用员工换平台；需要时还能从工讨论里「拆」（breakout）出独立线程，避免污染人之间的对话。
2. **Memory 分全局和个人两层**，由 Agent 自己决定一条事实记到哪一层。
3. **代码在沙箱里执行**，经安全代理（secret proxy）访问外部服务。
4. **大量任务是定时或事件触发的**，不一定等人开口——新 PR 自动 Review，或者你跟它说一声，它自己挂上每天销售简报。

---

## 相关页面

- [[sources/langchain-five-components-company-harness]] — LangChain 官方原文：构建「公司级 Harness」的五个组件
- [[concepts/harness-engineering]] — Harness 工程：为 Agent 打造安全与自适应工作台
- [[sources/yihui-loop-engineering-explained]] — yihui：Loop Engineering 到底是什么
- [[patterns/agent-iteration-environment]] — Agent 迭代环境闭环模式
- [[concepts/agent-token-architecture]] — Agent 的本质：用 Token 换架构
- [[concepts/ai-friendly-backend]] — 后端架构 AI Friendly 标准与路径
