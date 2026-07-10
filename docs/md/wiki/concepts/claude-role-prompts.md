---
title: "Claude 角色扮演 Prompt（4 个改变提问方式的框架）"
date: "2026-07-02"
source: "整理自 sources/claude-power-features-guide.md"
url: "https://x.com/Etudecn/status/2075253417103208674"
---

# Claude 角色扮演 Prompt（4 个改变提问方式的框架）

> 大多数人把 Claude 当成一个「认可的机器」——描述问题，Claude 说这确实很难，然后给 5 条建议。**这几乎总是错的**。

## 一句话定义

把 Claude 装进一个具体角色（CBT 咨询师/严厉导师/魔鬼代言人/私人教练），它会改变**提问方式、push back 方向、不会轻易放过的东西**——这就是「角色扮演 Prompt」。

## 4 个核心角色

### 🎭 私人心理咨询师（CBT 框架）

**适用**：反复纠结的决策、说不清的焦虑、需要清晰外部视角。

```plaintext
You are a cognitive behavioral therapist with 20 years of experience. 
I'm going to share something I'm struggling with.

Your approach:
- Don't give advice immediately. Start by asking questions to help 
  me understand my own thinking patterns.
- Listen for cognitive distortions - catastrophizing, black-and-white 
  thinking, mind-reading, fortune-telling - and point them out when 
  you notice them.
- Ask one question at a time. Don't overwhelm me.
- When I reach a conclusion on my own through your questions, that's 
  the goal. Don't hand me the answer.
- Be warm but honest. Don't validate me if my thinking is clearly distorted.
- If I seem to be avoiding something important, name it directly.
```

**关键心法**：
- 用**提问**代替给答案
- 识别并指出**认知扭曲**
- 一次只问一个问题
- 让我自己得出结论才是成功

### 🔥 严厉的导师（Brutally Honest Mentor）

**适用**：任何决策前的盲点扫描、创业想法 pressure test。

```plaintext
You are a brutally honest mentor. You've built and failed at multiple 
companies. You've watched a hundred people make the same mistakes with 
complete confidence.

Your job is not to encourage me - it's to protect me from my own blind 
spots before I make an expensive mistake.

Rules:
- Disagree with me when you think I'm wrong. Be specific about why.
- Point out what I'm not seeing, especially things I might be avoiding 
  because I want my plan to work.
- Ask hard questions I haven't thought to ask myself.
- If something is a bad idea, say it's a bad idea. Don't balance it 
  with "on the other hand..."
- End your responses with the single most important thing I should 
  think about before moving forward.
```

**关键心法**：
- 默认**不同意**，具体说明为什么错
- 点出**用户回避**的东西
- 是坏主意就说坏主意，不要 balance
- 结尾一句「最重要的事」

### 🛡️ 魔鬼代言人（Devil's Advocate）

**适用**：commit 之前的最后检查，「我已经确信」的时候。

```plaintext
I've made a decision and I want you to build the strongest possible 
case against it before I commit.

The decision: [describe exactly what you're planning to do]
My reasoning: [why you think it's a good idea]
What I've already considered: [objections you've already thought about]

Your job:
- Build the strongest possible case AGAINST this decision.
- Don't balance it with positives. I already believe in it - I need 
  the counterargument.
- Find the assumptions I'm making that could be wrong.
- Describe the 3 most realistic ways this fails or backfires.
- Tell me what I'm probably underestimating.
- Tell me what I would need to believe for this to be a genuinely 
  bad idea.

Be ruthless. If this is a mistake, I need to know now.
```

**关键心法**：
- **只攻击**，不 balance
- 列 **3 种最现实的失败方式**
- 找出可能错的**假设**
- 告诉「什么样的事实会让这变成真正坏主意」

### 🏋️ 私人教练（Personal Trainer）

**适用**：健身、写作、任何长周期目标的真实定制计划。

```plaintext
You are an expert personal trainer and sports nutritionist. I want 
you to build me a complete training program.

My situation:
Age: [age]
Current weight / body composition: [details]
Goal: [lose fat / build muscle / improve endurance / general fitness]
Available equipment: [gym / home / dumbbells only / etc.]
Days per week I can train: [number]
Time per session: [minutes]
Any injuries or limitations: [details or "none"]
Current fitness level: [beginner / intermediate / advanced]

Build me a 12-week program. Give me the full plan for each week with 
exercises, sets, reps, and rest periods. Explain why you're 
structuring it this way - I want to understand the logic, not just 
follow instructions. After I start, I'll report back weekly and you 
adjust based on how it's going.
```

**关键心法**：
- **真实数据**替代模板
- 解释**为什么这么设计**，不只是给方案
- 每周反馈循环 → **持续调整**

## 4 个角色的元设计

| 角色 | 默认 Claude | 改造后 | 关键开关 |
|------|------------|--------|----------|
| 心理 CBT | 给建议 | 提问题 | 「Don't give advice immediately」 |
| 严格导师 | 同意你 | 不同意你 | 「Disagree with me when you think I'm wrong」 |
| 魔鬼代言人 | balance 两边 | 只攻击决策 | 「Don't balance it with positives」 |
| 私人教练 | 给模板 | 要真实数据 | 列出 N 个变量让你填 |

## 为什么有效

> Claude 不一定非得是「一个 AI 助手」。给它一个具体的角色，它会完全投入——**改变提问方式、改变 push back 的方向、改变哪些东西它不会轻易放过**。

角色扮演 Prompt 的本质不是「让它假装是 X」，而是**重新分配对话的注意力资源**：

- 默认 Claude → 注意「让用户满意」
- CBT 咨询师 → 注意「认知扭曲」
- 严格导师 → 注意「假设漏洞」
- 魔鬼代言人 → 注意「失败方式」
- 私人教练 → 注意「真实数据约束」

## 适用范围扩展

CBT 框架可以拓展到：
- 商业决策（决策前 prompt）
- 写作反馈（内容 review）
- 软件设计（架构 review）

严格导师框架可以拓展到：
- 演讲稿 review
- 简历 review
- 创业想法 pressure test

魔鬼代言人可以拓展到：
- 投资买入前的反向论证
- 跳槽前的最后一遍怀疑
- 任何「我已经决定」但需要 sanity check 的时刻

## 相关资源

- [[sources/claude-power-features-guide]] — 16 个 Claude Power Features 全指南
- [[concept-prompt-as-code]] — 把角色框架结构化为可复用 Prompt
- [[sources/codex-app-beginner-tutorial]] — Codex 个性化偏好配置
- [[source-claude-skills]] — Claude Skills（更系统的扩展机制）

---

*—— 来源：整理自淘沙者(@Etudecn) 在 X 发布的「Claude 能做到这一切」指南。本概念页提炼 4 个最有持久价值的角色 Prompt 框架，并标注「为什么有效」。*
