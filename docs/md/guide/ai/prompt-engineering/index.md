---
title: 提示词工程
date: 2026-05-06
---

> **摘要** — 提示词工程（Prompt Engineering）是通过设计、优化输入提示词来引导大语言模型产生预期输出的实践学科。本专栏收录方法论、模式、工具与案例。

```mermaid
graph TD
    A[提示词工程专栏] --> B[第一章<br/>01-概念入门]
    A --> C[第二章<br/>02-方法框架]
    A --> D[第三章<br/>03-核心模式]
    A --> E[第四章<br/>04-输出控制]
    A --> F[第五章<br/>05-官方指南]
    A --> G[第六章<br/>06-避坑反模式]
    A --> H[第七章<br/>07-案例研究]
    A --> I[第八章<br/>08-资源导航]
```

```markmap height=350
# 提示词工程专栏
## 第一章：01-概念入门
- 提示词工程是什么
## 第二章：02-方法框架
- LangGPT / CO-STAR / CRISP / ICIO
## 第三章：03-核心模式
- CoT / ReAct / Tree of Thoughts
- 类推提示 / 多模态提示 / 提示链
## 第四章：04-输出控制
- 伪代码控制 / 输出格式 / Token优化
## 第五章：05-官方指南
- OpenAI / 谷歌 68 页圣经
## 第六章：06-避坑反模式
- 常见错误与最佳实践
## 第七章：07-案例研究
- 李继刚系列
## 第八章：08-资源导航
- 提示词库 / 工具 / 论文
```

---

# 提示词工程

> 提示词工程（Prompt Engineering）是通过设计、优化输入提示词来引导大语言模型产生预期输出的实践学科。本专栏收录方法论、模式、工具与案例。

---

## 第一章：01-概念入门

- [01-01 什么是提示词工程](./01-01-intro/01-01-what-is-prompt-engineering.md) — 从自然语言到控制指令的本质理解

---

## 第二章：02-方法框架

- [02-01 LangGPT — 人人都能写出高质量提示词](./02-01-methods/02-01-langgpt-getting-started.md) — 变量 + 模板语法，像编程一样写 Prompt
- [02-02 结构化提示词系统论述](./02-01-methods/02-02-structured-prompt-systematic.md) — 构建高性能 Prompt 的系统方法论
- [02-03 Agents 基石：提示词结构化方法论](./02-01-methods/02-03-agents-prompt-foundations.md) — 结构化 Prompt 的工程化实践
- [02-04 提示工程、RAG 和微调](./02-01-methods/02-04-langgpt-rag-finetuning.md) — 如何让 LLM 应用性能登峰造极
- [02-05 CO-STAR 框架](./02-01-methods/02-05-co-star-framework.md) — 结构化提示词构建方法
- [02-06 CRISP 框架](./02-01-methods/02-06-crisp-framework.md) — 批判性思维提示词框架
- [02-07 ICIO 框架](./02-01-methods/02-07-icio-framework.md) — 指令 + 上下文 + 输入 + 输出格式

---

## 第三章：03-核心模式

- [03-01 Chain of Thought (CoT)](./03-02-patterns/03-01-chain-of-thought.md) — 思维链推理
- [03-02 ReAct](./03-02-patterns/03-02-react.md) — 推理与行动结合
- [03-03 Tree of Thoughts](./03-02-patterns/03-03-tree-of-thoughts.md) — 思维树搜索
- [03-04 类推提示法](./03-02-patterns/03-04-analogical-reasoning.md) — Large Language Models as Analogical Reasoners
- [03-05 多模态提示词](./03-02-patterns/03-05-multimodal-prompting.md) — 文本、图像、音频、视频的联合提示策略
- [03-06 提示链与多提示词协同](./03-02-patterns/03-06-prompt-chaining.md) — Prompt Chain、Prompt Tree、Prompt Graph

---

## 第四章：04-输出控制

- [04-01 借助伪代码控制 LLM 输出](./04-03-output-control/04-01-pseudocode-control.md) — 精准控制输出结构和执行逻辑
- [04-02 控制 LLM 输出格式](./04-03-output-control/04-02-output-format-control.md) — Function Calling / JSON Schema / Regex 解析
- [04-03 Token 优化](./04-03-output-control/04-03-token-optimization.md) — 降本增效的 Token 使用策略
- [04-04 角色扮演技巧](./04-03-output-control/04-04-persona-techniques.md) — System Prompt 角色设定

---

## 第五章：05-官方指南

- [05-01 谷歌 68 页提示词圣经](./05-04-official-guides/05-01-google-68-prompt-bible.md) — CTF 黄金公式 + 元提示词模板
- [05-02 OpenAI 官方提示词指南](./05-04-official-guides/05-02-openai-official-guide.md) — 六条核心策略官方原文

---

## 第六章：06-避坑反模式

- [06-01 提示词反模式](./06-05-anti-patterns/06-01-anti-patterns.md) — 常见错误与避坑指南

---

## 第七章：07-案例研究

- [07-01 李继刚：如何写好 Prompt](./07-06-case-studies/07-01-li-jigang-get-started.md) — 模型理解 + 行业 KnowHow + 表达力
- [07-02 李继刚：提示词的道与术](./07-06-case-studies/07-02-li-jigang-dao-shu.md) — 从 lisp 格式到表达本质的深层思考

---

## 第八章：08-资源导航

- [08-01 优质提示词库](./08-07-resources/08-01-prompt-libraries.md) — 收录各平台优质提示词集合
- [08-02 提示词工具](./08-07-resources/08-02-prompt-tools.md) — 调试、优化、版本管理工具
- [08-03 论文与博客](./08-07-resources/08-03-papers-blogs.md) — 必读论文与技术博客精选
