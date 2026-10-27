---
title: "Addy Osmani（Google）：Claude Code 团队如何做代码审查"
date: "2026-10-26"
source: "X/Twitter"
author: "Addy Osmani (@addyosmani)"
url: "https://x.com/addyosmani/status/2114604912520921136"
---

# Claude Code 团队如何做代码审查

> Google 工程师 Addy Osmani 撰写：Claude Code 团队如何让 AI 写 90% 代码的同时，将 PR 合并量翻倍的同时回退率下降 40%。核心思路——不靠人工逐行审，而是把代码审查融入工作流，用六层自动化防线 + 风险分级审批守护质量。

<!-- more -->

## 背景与核心数据

Claude Code 团队在 2026 年 6–9 月观察到：**PR 合并量翻倍，同时回退率下降超过 40%**。这不是因为他们减少了代码审查，而是因为他们重新定义了什么是「审查」。

在 monorepo 中，日合并变更从 5 月的约 2,500 个增至 9 月的超过 30,000 个。Claude Code 本身同样面临巨大压力——手工逐行审已不可能。

代码审查的两个目的：
1. 在发布前发现并纠正 bug
2. 建立对代码库的共同理解

团队把「是否有人读了代码」换成了更精确的问题：**「这个变更可能出什么问题？哪种检查（自动化还是人工）最适合抓到它？」**

## 六个检查层级

每个变更通过层层过滤，bug 很难穿透所有层。即使穿透了，也有回滚机制兜底。

### 1. Pre-PR 验证（最关键）

大部分审查在创建 PR **之前**就完成了：
- 要求 Claude 执行可运行的操作（跑测试、构建、对比设计截图），展示结果而非空说「已完成」
- 一个子 agent 用新上下文 review diff
- 内部 skills：bug hunting、diff reduction、端到端验证、UI 设计规范检查

> Boris Cherny（Claude Code 创建者）估计：验证流程使 Claude 输出质量提升 2–3 倍。

### 2. 每 PR 的 AI 审查

每个 PR 在人工审查前都会收到 Claude 审查：
- 分析 diff 对照整个代码库和 PR 意图
- 检查变更是否真正解决了问题、是否融入更大系统、是否破坏其他部分

### 3. 安全审查（可阻塞合并）

无开放发现才能合并。作者可修复或附简短理由关闭误报线程。后续 commit 解决该问题时自动关闭。

### 4. 自动化阻塞检查

Lint、类型检查、全平台测试、构建——一个典型 CLI PR 在任何人看到之前就有数十项检查在跑。PR 模板包含「如何测试」「如何回滚」等问题。

### 5. 风险分级的审批

| 风险级别 | 审批要求 |
|---------|---------|
| 高（如 auto-updater、CI 工作流） | 必须人工 |
| 中 | 视情况 |
| 低（如文档修复） | 自动化可清 |

风险级别由**变更本身**决定（不是作者身份）。分级器基于变更内容分类，第二个分类器判断是否需要额外审批。受信任作者（通常只有 repo 所有者）可走宽松路径，其他人一律需人工审批。Agent 批准不计入人力要求。

### 6. Merge Queue + 特性开关 + 分段发布

- **Merge Queue**：确保所有检查在 main 上通过后才合并，避免两个成功 PR 合并出坏版本
- **特性开关**：新功能先 behind flag，Anthropic 员工先体验，常能先于用户发现回归
- **分段发布**：先上 latest channel，stable channel 滞后
- **一键回滚**：特性开关可立即关闭无需部署

## 如何改进审查系统本身

审查系统是一个持续改进的循环：

- **用事故做评估指标**：收集引发事故的 PR、它们的 fix-forward 和 revert，由懂代码库的工程师验证 bug 位置和正确性
- **测量噪音**：记录人类对评论的反应——修复、拒绝、澄清为有意、不重要——来校准系统的误报率
- **目标优先级**：① 发现真实 bug，② 减少 review 轮次

### 避免 review 循环永不停止

曾有一个 PR 在 CLI 项目中一夜之间循环了 50+ 轮——agent 作者和 agent 审查者来回拉扯。解决办法：

- 限制 review 轮次（3 轮后仅 review 新 diff）
- 指定 bug 类别，让作者一次修所有同类问题
- 审查 agent 夜间跑在 current codebase 上，帮识别历史 bug

> 用 git blame 追踪 review 系统反复标记的内容，发现 ~59% 是首次提交就存在的旧代码——系统在挖老 bug，没找到新 bug。

## 人类仍在环中：哪些事必须人做

- **是否该做这个？** 设定产品愿景、品味和目标——一个团队声称解决了代码审查瓶颈，但对组外变更仍做人工审查
- **审计危险代码**（billing、auto-updater、CI 工作流）
- **架构审查**——这些决策设定其他人遵循的约定
- **验证 proof**（测试输出、命令运行结果、截图、reviewer 评论）
- **承担责任**——每个发出的变更都由一个人负责

## 团队上下文：当机器读 diff 时，人如何学习代码？

团队没有正式的代码库理解机制。没有人脑中装着 Claude Code 的完整心智模型。

当想了解某个模块时，问 Claude 生成针对该切片的 explainer——几分钟内，总是最新的。部分人还会让 Claude 生成可视化 mini artifact。

这比逐行读 trivial diff 更能聚焦注意力（例如一行 copy 改动教不了你什么）。

## 「你落地，你负责」文化

合并小/中变更的人，出了问题通常自己修。原因：
- 小变更易 review、debug、回滚
- 所有东西都能被回滚（特性开关、revert、分段发布可在数分钟内反转）
- blast radius 设了门槛：更贵的代码获得更多眼睛
- 回归被遥测和内部使用快速暴露
- 不追责——修正问题的人拥有它，因为他最有上下文

## 实施清单（可直接用于团队）

### PR 之前
- 给 agent 一份 checklist，列在短小的 CLAUDE.md 里
- 设置 hook 自动调用 formatter 和 linter
- 本地运行 `/code-review` 和 `/security-review`，或用新上下文子 agent review
- 创建 REVIEW.md 跟踪反复出现的问题

### 每个 PR
- 强制 CI
- PR 模板包含 Testing / Risk / How to revert
- 在一个 repo 上试点 AI 审查（Code Review for Claude Code 或 GitHub Action），迭代 REVIEW.md 几周再推广
- 添加自动化安全审查
- 要求所有 review 线程解决后才能合并
- 按风险分级应用审查强度

### 审批
- 风险级别基于变更而非作者，从严开始逐步放松
- 受信任作者走宽松路径
- Bot 批准不能替代人工
- 新 commit 推送后撤销原批准
- 用 CODEOWNERS 和 branch protection 指定人类审批人

### 合并与合并后
- 设置 merge queue
- 实验特性开关
- 先面向内部用户发布，再分段 rollout
- 建立一键 revert 机制
- 通过记录事故和 revert 建立 eval 集合
- 每次变更 reviewer prompt/tools/model 后重新评分
- 用 revert 和 incident 率作为 guardrail 跟踪人力投入

## 未来方向

Code Review 宣布时目标是人工做最终审批，仅发布发现。但团队走得更远：**owners 决定哪些低风险变更在自动化检查通过后可以直接合并**。这个边界仍在演化。

每当审查系统漏掉东西时，团队问自己：「模型的上下文里缺少了什么？」然后把它变成 CLAUDE.md 文件、skill 或新检查。

## 相关页面

- [[concepts/agent-token-architecture]] — Token 与上下文窗口的工程映射。
- [[concepts/harness-engineering]] — Harness 工程化的一般原理。
- [[patterns/agent-skill-design-patterns]] — Agent Skill 设计模式。
- [[sources/vibe-coding-to-engineering-ai-coding]] — Vibe Coding 到工程化 AI 编程。

---

*原文为英文 X Article（约 20,768 字符），抓取接口仅返回纯文本正文，未返回配图。本文为中文精读重写，保留全部核心论据、数据与实施清单。*
