---
title: "AGENTS.md 视觉指令：让版式自己解释"
date: "2026-10-22"
source: "用户整理（孙可可）"
url: ""
---

# AGENTS.md 视觉指令：让版式自己解释

> 避免 AI slop、让界面更好看的秘诀，在 AGENTS.md 里加一句：`Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.`

<!-- more -->

## 结论

用 Opus 和 Astra 写了不少 UI 之后发现的一个规律：AI 生成的界面容易出现「一层不够，再加一层说明文字」的堆叠——标题下面再写一句副标题，字段旁边再补一句提示，区块上方再来一段解释。

**解决办法不是加规则堆砌，而是加一条让版式承担解释职责的指令。**

```text
Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
```

## 为什么这一句有效

AI 生成 UI 的默认倾向是「不确定信息是否被理解，就补一句说明」。这产生两个后果：

1. **视觉噪音**：每个区块都被二次标签覆盖，层级靠文字而非版面表达
2. **AI slop 的典型特征**：所有页面都长成一样——大标题 + 副标题 + 三个卡片 + 每卡一行小字

反过来要求「让版式来解释」，等于把信息表达的责任从**文字**移交给**结构**：

| 维度 | 依赖二次说明文字 | 依赖版式 |
|------|----------------|----------|
| 层级 | 标题 + 副标题 | 字号、间距、分组、位置 |
| 分组 | 「其他设置」等标签 | 留白、对齐、容器边界 |
| 关系 | 「这依赖于…」等说明 | 并列、嵌套、从属的视觉关系 |
| 冗余度 | 文字重复视觉已表达的信息 | 无重复 |

## 落地写法

放在 AGENTS.md 的 UI / 视觉规范段落，与其他约束并列：

```markdown
## UI 规范

- Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
- 优先用字号、间距与分组建立层级，不要用副标题复述标题
- 同一信息只出现一次：视觉已表达的，文字不再重复
```

**关键**：这是一条**删除型**约束而非**新增型**约束。AI 缺的往往不是「该加什么」，而是「哪些不用加」。

## 与既有前端反 slop 方法的关系

本仓已有多处针对 AI 生成界面「同质化、模板化」的记录——[taste-skill](/md/wiki/sources/taste-skill) 提供的三档设计旋钮、[UI Polish](/md/wiki/patterns/ui-polish) 补交互与状态细节。它们解决的是**加什么**（更好的配色、动效、状态）；这一句解决的是**去掉什么**。

两者互补：先减掉冗余文字，剩下的版面才有空间做精细打磨。

## 边界

- 「不必要」需要判断力：真正需要解释的复杂操作、错误提示、合规说明仍应保留
- 适用前提是界面已用视觉层级建立了一致结构；若版面本身没有层级，删掉说明文字会让信息丢失
- 对可访问性有影响：纯视觉传达的信息需确保有等效的语义标签或 aria 描述
- 单条指令不能替代完整设计规范；它是减少 AI slop 的一个低成本杠杆

## 相关页面

- [[sources/taste-skill]] — AI 前端防丑 Skill：三档设计旋钮。
- [[patterns/ui-polish]] — UI 精致打磨：交互、动效与组件状态。
- [[patterns/claude-skills-ui-ux]] — Claude Skills 的 UI/UX 能力。
- [[sources/claude-code-18-ui-ux-design-skills]] — Claude Code 的 18 个 UI/UX 设计 Skills。
- [[patterns/engineering-taste]] — 工程品味：判断「什么值得加」。

---

*归档说明：本页为用户提供的经验整理，已将原文口语表述改写为可执行的规范条目并补充适用边界与与既有前端方法的关系，未添加原文没有的结论。*
