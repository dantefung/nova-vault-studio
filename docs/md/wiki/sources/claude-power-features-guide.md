---
title: "Claude 能做到这一切：16 个 90% 用户不知道的 Power Features（功能定位 + 拿即用 Prompt）"
date: "2026-07-02"
source: "X @Etudecn (淘沙者 TheSandPicker)"
url: "https://x.com/Etudecn/status/2075253417103208674"
---

# Claude 能做到这一切：16 个 Power Features 全指南

> 这不是一篇「5 个 prompt 让你变强」的水文。这是 **16 个真实功能** 在哪儿开、怎么用、拿来即跑。

## 一句话核心

> 大多数人每天用 Claude，但只用到了 5% 的能力。这份指南列出另外 95%——每个功能都能在几分钟内启用，之后每天都能用上。

## 9 大功能模块速览

| 模块 | 一句话 | 在哪儿 |
|------|--------|--------|
| **Projects** | Claude 真正记住你——文档/指令/上下文全持久化 | claude.ai → Projects |
| **Artifacts** | 在对话里直接做出能用的应用，不是复制粘贴的代码 | 默认开启，输出面板 → Artifacts |
| **Adaptive Thinking** | 一步步推理整个问题，看得到思考过程 | 模型选择 → Extended Thinking |
| **Memory** | Claude 慢慢记住你的身份/工作/偏好 | Settings → Memory |
| **Claude in Chrome** | 看得到你屏幕 + 操作浏览器 | Chrome 扩展 |
| **Claude Cowork** | 桌面 Claude，能直接读你的真实文件 | 桌面 App |
| **Scheduled Tasks** | 设定时间和频率，Claude 自动跑把结果存盘 | Cowork |
| **Cowork Skills** | 给 Cowork 装插件——PPT/PDF/工作流 | Cowork → Customize → Skills |
| **CLAUDE.md** | 项目级规则文件，每次会话自动读 | 项目根目录 |
| **Claude Code** | 终端里的 AI——读代码/写代码/跑测试/修 bug | CLI / VS Code / JetBrains |
| **Claude Design** | 视觉设计独立工具——产品页/PPT/原型 | claude.ai/design |
| **Prompt Caching** | 大段重复上下文缓存，调用成本降 90% | API |

## 4 个最关键的角色 Prompt（最值得保存）

### 🎭 私人心理咨询师（CBT）

```plaintext
You are a cognitive behavioral therapist with 20 years of experience.
- 不要立即给建议，先问问题帮我理解自己的思维模式
- 识别认知扭曲（灾难化/黑白思维/读心/算命）—— 发现就指出
- 一次只问一个问题，不要让我 overwhelmed
- 当我自己得出结论才是目标，不要把答案直接递给我
- 温暖但诚实，思维明显扭曲时不要一味认可
- 如果我回避重要的事，直接点出来
```

### 🔥 严厉的导师（压力测试你的想法）

```plaintext
You are a brutally honest mentor. You've built and failed at multiple companies.
- 我错了就具体地指出我错在哪
- 点出我看不到的东西，尤其是我因为太想做而回避的问题
- 问我想不到的问题
- 是坏主意就说坏主意，不要"话说回来..."
- 每次回复结尾给一句最重要的事
```

### 🏋️ 私人教练（按你的真实数据定制）

把年龄/体重/目标/器材/每周天数/每次时长/伤病/水平填进去，让 Claude 给你 12 周计划，每周反馈后调整。

### 🛡️ 魔鬼代言人（commit 前的最后检查）

```plaintext
I've made a decision and I want you to build the strongest possible case against it.
- 列出 3 个最现实的失败方式
- 不要平衡"积极面"，我已经相信决策，我需要反面
- 找出我可能错的假设
- 告诉我需要什么才能让它变成一个真正坏主意
```

## 4 个零门槛实战 Prompt

### Artifacts：习惯追踪器（10 分钟跑通）

```plaintext
Build me a habit tracker as a working web app.
- 追踪 5 个每日习惯，可勾选
- 每个习惯显示 7 天连续天数，断则归零
- 设计：暗色背景，简洁极简
- 勾选时加一个小动画让点击有满足感
- 刷新页面数据不丢失（持久化）
```

→ 在对话中直接跑出来，点击即用，免费版即可。

### Scheduled Tasks：每日 7:30 早报

```plaintext
Every weekday morning at 7:30am, do the following:
1. 搜过去 24 小时 AI 和 crypto 重要新闻
2. 选 5 个最重要的故事（关注意外/反直觉/对建设者和投资人有真实影响）
3. 每个故事写：标题 + 2 句总结 + 为什么重要
4. 存到 /briefs/brief-[date].md
语调：直接、有分析、无废话，3 分钟可读完。
```

### CLAUDE.md：内容创作项目规则

```markdown
# Project: AI Newsletter

## About this project
Weekly newsletter about AI and crypto for builders and investors.
35000 subscribers. Tone: 直接、有分析、偶尔不羁。

## Writing rules
- 短段落，最多 3 句
- 编辑内容不用 bullet points
- 不用 em dash，用 hyphen 或改写句子
- 数字比形容词强：写 "saves 3 hours" 而不是 "saves significant time"
- 永远不用："delve"、"groundbreaking"、"game-changing"
- 缩写可以鼓励

## Content rules
- 读者已经知道什么是 LLM，不要解释基础
- 开头放最意外或最反直觉的东西
- 每篇文章必须有 "so what" ——读者应该怎么做/想得不同

## File structure
- /drafts: 草稿
- /published/YYYY-MM-DD-title.md: 已发布
- /research: 研究笔记
```

### Prompt Caching：API 降本 90%

```json
{
  "model": "claude-opus-4-6",
  "system": [
    {
      "type": "text",
      "text": "[你的大 system prompt 或参考文档]",
      "cache_control": {"type": "ephemeral"}
    }
  ],
  "messages": [
    {"role": "user", "content": "[每次变的用户消息]"}
  ]
}
```

> 缓存持续 5 分钟，每次调用重置计时器。**适用于系统 prompt、大文档和工具定义**。如果你在做规模化开发却没用这个，是在扔钱。

## 起步建议

> 从清单里挑一个功能——**就一个**。今天设好。不需要一次全部搞定。知道有什么，就已经赢了一半。

**最推荐起步顺序**：

1. **Memory**（零门槛、立刻见效）
2. **Projects**（彻底告别每次重新介绍自己）
3. **CLAUDE.md**（写一次，受益每个项目会话）
4. **Artifacts**（打开新世界——能"做"而不是只能"说"）
5. **Claude in Chrome / Cowork**（解锁 Claude 看电脑/操作电脑的能力）

## 适用人群速查

| 你是什么角色 | 最值得开启 |
|------------|----------|
| 内容创作者 | Memory + Projects + CLAUDE.md + Claude Design |
| 程序员 | Claude Code + CLAUDE.md + Prompt Caching + Adaptive Thinking |
| 知识工作者 | Artifacts + Scheduled Tasks + Memory |
| 跨境/投资人 | Chrome 扩展 + Scheduled Tasks + Claude Design |
| 需要决策辅导 | 导师/咨询师/教练/魔鬼代言人 4 个角色 Prompt |

---

*—— 来源：X @Etudecn（淘沙者 TheSandPicker），382 行原文，本摘要提 16 个功能定位 + 8 个拿即用 Prompt，全图已归档至同目录 images。*
