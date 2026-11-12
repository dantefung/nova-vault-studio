---
title: "Viking（@vikingmute）：从 Addy Osmani 的 Agent 管理文章里提炼出的 3 条最佳实践"
date: "2026-11-10"
source: "X/Twitter"
author: "Viking (@vikingmute)"
url: "https://x.com/vikingmute/status/2119675476725924171"
---

# Viking（@vikingmute）：从 Addy Osmani 的 Agent 管理文章里提炼出的 3 条最佳实践

> 对 Addy Osmani《Your coding agents made you a manager》的三点提炼：① 让 AI 有明确的验证机制——不要相信 Agent 自己说「做完了」，而要它提供新的 E2E case 通过流程、截图甚至录屏，让它自己跑检查直到通过；② 设计完全自动化的流程循环——定义什么叫做完了、明确自验证机制、确定边界、确定约束（运行多少轮、最大花费 token、时长等）、确定 review 流程，全程不需要人类干预；③ 把重复的错误积累到文件中——上下文一长 Agent 经常重复犯错，手动纠正两次就把对应问题持久化进 AGENTS.md，下次不用再手动纠正。

<!-- more -->

几天文章中很好的最佳实践，有些在他之前的文章中说过，我觉得再看一遍还有收获：

1 让 AI 有明确的验证机制：明确算是验证通过，不要相信 agent 自己说做完了，让它提供新的 E2E case 的通过流程，截图甚至是录屏，让它自己能跑检查，直到通过。

2 设计完全自动化流程，不需要任何的人类的干预，设定这样一个循环：

  2-1 定义什么叫做完了

  2-2 明确自验证机制（和上一条正好呼应）

  2-3 确定边界

  2-4 确定约束（比如运行多少轮，最大花费的 token，时长等等）

  2-5 确定 review 流程

3 把重复的错误积累到文件中，这个非常简单但是很实用，上下文一长我发现 agent 经常会出现同样的问题，假如你手动纠正它两次，那么就把对应的问题持久化到 agents.md 文件中，下次就不用手动去纠正了。

Addy Osmani 的 新文章《Your Coding agents made you a manager》 认真读完了

现在工程师做的事情已经慢慢像管理转变了，要使用好 Agents ，和当一个好的工程经理几乎是一样，曾经对 manager 那些抱怨，现在回到了我们自己身上，在 AI 没有诞生的时候，我的目标就是走优秀的单打独斗工程师，不想转管理，不想天天日历里面满满的会议。

而现在其实任务已经发生了转变，其实我现在每天做的不是代码实现，而是在做管理了。

所以要新的 mindset 和新的方法论，文中就拆出了一系列具体的最佳的实践，我觉得还是非常受用的。

## 相关页面

- [[sources/addyosmani-your-coding-agents-made-you-a-manager]]
- [[sources/smartpigai-managing-coding-agents-not-writing-code]]
- [[concepts/harness-engineering]]
- [[concepts/agent-autonomous-pipeline]]
