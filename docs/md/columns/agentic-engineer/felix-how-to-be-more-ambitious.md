---
title: "How to be more ambitious: A tutorial for humans with models"
date: "2026-10-13"
source: "felixrieseberg.com"
url: "https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/"
---

# How to be more ambitious: A tutorial for humans with models

> Felix Rieseberg（Anthropic Claude 团队工程师）关于如何更聪明地与 AI 协作、把事情做到极致的深度教程。

## 四种 Ambition

### Speed（速度）

同样的工作更短时间内完成，AI 经济价值的基础，不需要太多创造力。

### Altitude（高度）

提升抽象层级，关注结果而非单个任务。

**核心问题**：你想要发生什么？目标背后的目标是什么？

**示例**：不再让 Claude 修单个崩溃，而是让它保持应用永不相崩溃。

**进阶示例（QBR 季度回顾）**：
- 阶段1：给出数据，让 Claude 告诉你"本季度发生了什么、为什么、下一步该做什么"
- 阶段2：让 Claude 找出最紧急的三个决策，并给出正反论点
- 阶段3：让 Claude 设计一个比季度 deck 更好的方式来发现问题和调配资源

### Depth（深度）

像领域顶尖专家一样完成任务，使用他们使用的工具、技术和知识。

**技巧**：
1. 坚持使用业内顶尖专家使用的工具：Claude 达到专业级时，要求它使用数据库和统计模型而非 markdown 表格
2. 选择看似不切实际的目标，然后告诉模型这些目标非常合理：需要 5s 加载？要求 200ms
3. 挑战你已知的东西：给模型原始数据，让它 adversarially 验证假设
4. 创造新知识：让模型从日志中构建客户模拟，找出预测流失的最早信号
5. 使用外部评判者：不要让模型评判自己的工作，用工具获取即时反馈

**配套提示词**：

```
I want a deeper version of this task, not a bigger one. Before rewriting it:
(1) say what a top professional in this field would do here that I'm not asking for;
(2) name the rawest material they would start from instead of what has already been digested for me;
(3) name the specific methods and tools they would use;
(4) say what, other than you or me, would show the result is right.
Then rewrite my prompt to ask for exactly that.
```

### Range（广度）

从多个不同领域的视角考虑工作，跨领域调用知识、工具和技术。

**技巧**：
1. **把名词换成动词**：季度回顾不是"a deck"，而是"让忙碌的人相信一个关于因果的故事，并在 30 分钟内做出不确定性决策"
2. ** Assemble the crew**：问自己：如果要完成这个任务，人类会组建什么样的团队？

## 为什么 ambition 很重要

心理学上有自我效能感（self-efficacy）：相信自身能力的人会实际完成更多。

**三个已验证的 hacks**：
1. **相信某事是可能的，就能完成它**：1939年 George Dantzig 迟到抄了两个"作业题"，结果是两个未解决的统计问题
2. **看别人做过后你也能做**：人类跑进 4 分钟 mile 后，46 天内就有多人做到；sub-2 hour marathon 也在发生
3. **给自己失败的权利**：Linux 最初只是" hobby, won't be big"

## 总结

在能力每隔几周就突飞猛进的世界里，我们需要技巧来做以前从未想过或认为不可能的事情。

---

**关于作者**：Felix Rieseberg，Anthropic EM，负责过 Claude.ai、Cowork、Claude Code Desktop。Electron 联合维护者，曾在 Notion、Stripe、Slack、Microsoft 工作。
