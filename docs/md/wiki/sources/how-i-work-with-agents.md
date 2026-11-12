---
title: "我如何与 Agent 协作"
date: "2026-10-25"
source: "X/Twitter"
author: "Thorsten Ball (@thorstenball)"
url: "https://x.com/thorstenball/status/2114386050638336082"
---

# 我如何与 Agent 协作

> 一段来自开发者的实践总结： October 2026 版 Agent 工作流心得。核心观点——用最新最强的模型，描述 What 而非 How，让 Agent 看到完整的 SDLC，要求它给出不可辩驳的证明。

<!-- more -->

## 背景

这是作者发送给朋友的 DM 集合，截至 2026 年 10 月的实践总结。作者有多年底层系统开发经验（Raincoat、Haskell 等领域），近年深度使用 AI Agent 进行工程工作。

## 十条实践原则

### 1. 用最新最强的模型

Everything else is potentially a waste of time. If a model is wrong 10% of the time, you don't know which 10%, so you end up making multiple attempts. When do you really want to hire a generalist who's 50% cheaper but also randomly 20% dumber? Who's still using Opus 4.5? Exactly.

**核心判断**：模型的可靠性比成本重要。偶尔的随机错误比系统性缺陷更难调试。

### 2. 停止担心堆积 slop

「它会把你的代码库变成无法维护的垃圾。」六个月前也许是对的。现在？我不太确定它真的会产生 slop。即使产生了，也不确定结果就无法维护。

**态度转变**：早期的 slop 焦虑正在被实际经验修正。

### 3. Prompt 描述 What，不描述 How

Describe **What** you want, not **How** you'd do it. You'll often get better results.

示例：
- 「把字节码编译器和 VM 做到尽可能快。不要停，直到它快 2 倍。」
- 「最终应该这样工作」

**关键**：给 Agent 目标而非路径，让它自己找最优解。

### 4. 让 SDLC 对 Agent 完全可见

What stopped hallucinations? Tool calls. They let agents touch our reality. If the agent can't see something, it makes it up. So let it run what it builds end to end, let it read production logs, deploy, watch the rollout, cut the release, flip the flag, triage the bug report and email the customer. Anything you can see, the agent should see too.

**做法**：给 Agent 完整的可观测性——从构建到部署到监控到客服的全链路。

### 5. 给 Agent SDLC 工具

We have custom plugins for:
- Bug reports
- Emailing users
- "Is our system healthy?" checks
- Granting feature flags

**原则**：工具即权限边界。给什么工具，Agent 就能做什么。

### 6. 评估 Agent 的知识

Knowledge piles up in the codebase: AGENTS.md files, skills, scripts, docs. But do agents actually use it? Spawn five blind agents, control vs. treatment, and find out. Agents are really, really good at running experiments.

**方法**：A/B 测试——一组给知识上下文，一组不给，看差异。Agent 本身擅长做实验。

### 7. 本地开发体验很差

Each agent should be able to install and run whatever it needs to get job done. Easy in remote machines, yucky in local dev. Hard to not run into resource conflicts locally when you want agents testing stuff end to end.

**结论**：Agent 工作流更适合远程机器，本地开发的资源冲突难以避免。

### 8. 不要和 Agent 迭代，让它构建迭代工具

Not "let's try this... ah no, let's try that." Instead: "Generate 20 variations and a little page that lets me combine and test them."

Not only applies to solution space, but also problem space: "Give me 4 theories on why this is slow, then check all four."

**核心**：让 Agent 生成探索空间，而不是来回试错。

### 9. 要求不可辩驳的证明

Biggest game changer. Agents are really good at producing proof: end-to-end walkthroughs, demo videos, before/after numbers. You have to build up trust and an instinct for this. Put "this is not evidence" in your AGENTS.md.

**做法**：在 AGENTS.md 中明确标注「这只是陈述，不是证据」，训练自己识别什么是真正的 proof。

### 10. 不要让 Agent 等你，让 Agent 等你

If you worry about TTFT, you're probably doing something wrong. Lean into async. Give them bigger tasks, be more ambitious. Batch instead of back and forth.

**心态**：Async-first。给大任务、批处理，而非来回确认。

## 附加要点

### 自动化/调度/唤醒/心跳是杀手级功能

Didn't realize it, but missed it dearly once it was off. Use it all the time:
- "Check the logs in 2hrs."
- "Let me know once this is live"
- "Check every day at 9am"

### 停止手动管理上下文

Every thought you spend wondering about "is it using 300k or 380k tokens?" is wasted time. Compaction works incredibly well. Don't manage context by hand. One thread = one task. Some threads are 46 messages, some are 3,714.

### 线程是你的公司记忆

(In Amp) "Why did we do this?" The more team uses Amp the more knowledge multiplies. Threads are connected to git commits. Game changer. Avoids duplicate work.

### Agent 不要替人写作

Except: debugging steps, incident reports, some docs. Mechanical stuff where human on other end doesn't matter that much.

### 只审查高爆炸半径的代码

There are <5 central files -- those I review. Database migrations, yes. Closure vs. class, a neater type, variable names, even duplication: I don't care anymore. Does it work? Do I understand it at the arrows-in-a-diagram level? Did the agent test it end to end? Can I change it in a month? If yes, might review code.

**审查标准**：
- 能工作吗？
- 在箭头流程图层面我能理解吗？
- Agent 端到端测试过了吗？
- 一个月后我能改它吗？

## 边界与判断

- **个人实践总结**：这是单个开发者的经验，不一定适用于所有团队
- **模型选择激进**：主张「只用最新最强模型」，对成本敏感的项目需谨慎
- **Remote-first**：明确提到本地开发体验差，适合有远程机器的团队
- **Amp 工具链**：提到使用 Amp 作为 Agent 平台，线程与 git commit 关联

## 相关页面

- [[concepts/agentic-architectures]] — Agent 架构形态谱系。
- [[patterns/agent-skill-design-patterns]] — Agent Skill 设计模式。
- [[sources/agent-relay-multi-agent-hands-on]] — Agent Relay 多 Agent 协作实测。
- [[concepts/harness-engineering]] — Harness 工程化的一般原理。

---

*原文为 X Article 长文，抓取接口仅返回纯文本正文，未返回配图。*
