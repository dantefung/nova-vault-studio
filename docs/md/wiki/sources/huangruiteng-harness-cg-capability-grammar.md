---
title: "Ruiteng Huang：Harness CG——把能力做成可发现、可构造、可演化的语法"
date: "2026-11-21"
source: "X/Twitter"
author: "Ruiteng Huang (@huangruiteng)"
url: "https://x.com/huangruiteng/status/2124030792137609486"
---

# Ruiteng Huang：Harness CG——把能力做成可发现、可构造、可演化的语法

> 引用 Harness CG 论文（arXiv 2611.harness-cg）：本质是能力的发现、构造、调用、演化、组合——把复杂原子能力组合成更复杂的能力，再把能力训进模型。路子类似 dsh plugin，但在 loopx 上表达能力更丰富（基于状态决策的 hook、状态回写的 hook）。

<!-- more -->

本质是能力的发现、构造、调用、演化、组合。将复杂原子能力组合为新的更复杂的能力，将能力训进模型。有点类似 dsh plugin 的路子，但在 loopx 上可以有更丰富的表达能力（基于状态决策时的 hook、状态回写的 hook）

https://github.com/loopx-project/loopx

Harnesses used to be a crutch for weak LLMs. In 2026 and onward, with stronger models, harnesses now offer a mechanism for composing an LLM’s existing and new capabilities to generalize well beyond their training environments.

In our new paper, LM Harnesses are Compositional Generalizers, we explore how various harness abstractions enable LM systems to generalize over task length, task strategies, recursive task depth, and more through composing existing LLM capabilities. These abstractions provide a means for more data-efficient training, especially over long tasks, by keeping trajectories locally in-distribution (LID) — i.e., shaping all individual LLM calls to be in-distribution.

For tasks that take a very long time to roll out, this implies that we can even perform surrogate harness training, meaning we train an individual LLM call instead of doing the very long harness rollout, using purely synthetic tasks, with fake tool calls + sub-agents!

A common idea floating around is that LLMs will absorb harnesses and make them obsolete. We disagree, and argue that we haven’t sufficiently explored what harnesses can provide.

The full paper, logs, codebase, and data are available: https://www.alphaxiv.org/abs/2611.harness-cg

w/ @SOURADIPCHAKR18 @lateinteraction

## 相关页面

- [[concepts/agentic-architectures]]
- [[concepts/loop-engineering-thoughts]]
