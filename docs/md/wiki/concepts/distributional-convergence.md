---
title: "distributional-convergence"
date: "2026-10-14"
source: "wiki-ingest"
---

# 分布收敛（Distributional Convergence）

> AI 生成内容趋同的根本原因：当没有具体约束时，模型倾向于选择训练数据里最常见、最保险的输出方案。

## 概念来源

Anthropic 在 [Improving Frontend Design Through Skills](https://claude.com/resources/articles/improving-frontend-design-through-skills) 一文中解释了为什么 AI 生成的前端总是喜欢用蓝紫色——罪魁祸首叫 Distributional Convergence。

用大白话说：**你没有告诉 AI 具体怎么设计，它就容易选择训练数据里最常见、最保险的设计方案。**

## 扩展到写作风格

CloudHu 将此概念扩展到 AI 写作领域，解释了为什么 AI 文案总有股"AI味"：

- AI 的训练素材来源于人类
- AI 的口癖（如【不是...而是...】句式）很可能是人类自己的表达偏好在训练中被学习和放大后的结果
- 绝大多数用户没有指定句式要求，所以 AI 倾向于使用已训练好的表达方式
- 人类本身就喜欢铺垫：批评前先夸两句、强调前先说背景、安慰时赋予积极意义

## 两种"不是...而是..."的浓度差异

- **浓AI味**："你赚到的不是100美元，而是属于普通人的财富自由入场券。"——强行上升到宏大叙事
- **淡AI味**："他不是不想帮你，而是确实没有这个能力。"——单纯表达客观事实

AI味本质：**就算它不用特定句式，它也特别喜欢在不需要强调的时候强行强调。**

## 反制方法

反向提示词只需一句话：不要使用【不是...而是...】句式，直接说人话。指定具体约束就能打破分布收敛。

## Related Pages

- [[concepts/agent-loop]]

## Sources

- CloudHu《为什么AI总爱说"不是...而是..."》：x.com/CloudHuxxx/status/2110024203563122688
