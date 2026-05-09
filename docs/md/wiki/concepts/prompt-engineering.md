---
title: "提示词工程（Prompt Engineering）"
date: "2026-05-09"
---

# 提示词工程（Prompt Engineering）

> 通过设计、优化输入提示词来引导大语言模型产生预期输出的实践学科。

## Key Points

- 核心本质：对 LLM 的控制指令，将输入转化为期望的输出
- 历史演进：萌芽期(2019-2022) → 框架期(2023) → 系统期(2024+)
- 关键价值：控制不确定性、挖掘模型潜力、降低成本、实现复杂任务
- 与传统编程的核心区别：概率性输出 vs 确定性执行

## Details

### 常用技巧

- Few-shot 示例
- 思维链 CoT
- 结构化提示词
- 角色设定

### 结构化框架

- **LangGPT**：变量 + 模板语法，像编程一样写 Prompt
- **CO-STAR**：Context + Objective + Style + Tone + Audience + Response
- **CRISP**：批判性思维提示词框架
- **ICIO**：Instruction + Context + Input + Output format

### 核心模式

- Chain of Thought (CoT)：思维链推理
- ReAct：推理与行动结合
- Tree of Thoughts：思维树搜索

## Related Pages

- [patterns/langgpt-framework](patterns/langgpt-framework)
- [patterns/co-star-framework](patterns/co-star-framework)
- [patterns/chain-of-thought](patterns/chain-of-thought)
- [patterns/react-pattern](patterns/react-pattern)
- [concepts/harness-engineering](concepts/harness-engineering)

## Sources

- docs/md/guide/ai/prompt-engineering/index.md
- docs/md/guide/ai/prompt-engineering/01-01-intro/01-01-what-is-prompt-engineering.md
