---
title: "grill-me 技能：无情采访直到决策树完备"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# grill-me 技能：无情采访直到决策树完备

## 定位

grill-me 是一个**访谈者技能**，对你的计划或设计进行无情追问，直到决策树的**每个分支都被解决**。

## 与 grill-with-docs 的区别

| 维度 | grill-me | grill-with-docs |
|------|----------|-----------------|
| **方向** | 追问你的方案 | 挑战你的方案 against docs |
| **主体** | Agent 追问用户 | 用户（或 Agent）挑战 Agent |
| **输出** | 决策树完备 | CONTEXT.md + ADR 更新 |

## 追问策略

grill-me 会针对每个决策点追问：

1. **为什么这样做而不是那样做？** — 找默认假设
2. **如果 X 失败了怎么办？** — 找单点故障
3. **这个决策的受益人是谁？** — 找利益冲突
4. **有数据支撑这个决定吗？** — 找直觉决策
5. **这个决定会影响到谁，他们知道吗？** — 找盲区

## 结束条件

直到被问者无法继续回答，或明确说「这个分支我还没想清楚」——这本身就是有价值的输出。

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[grill-with-docs](./grill-with-docs.md)、[caveman](./caveman.md)