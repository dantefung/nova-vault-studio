---
title: "Obsidian+Hermes知识库生产线"
date: "2026-06-11"
---

# Obsidian+Hermes知识库生产线

> Obsidian 做底座，Hermes Agent 做执行层。知识库从"仓库"变"生产线"：Source Note → Topic Note → Draft Note → Published Note。

## Key Points

- **核心问题**：Obsidian 用户常见困境——插件装了一堆，目录搭得挺完整，标签也认真打了。但隔段时间一看，里面还是堆满了"以后再看"的文章。库越来越大，输出没见长
- **核心认知**：知识库最大的浪费不是"不够大"，而是"存了不用"
- **目录设计原则**：目录不是给人看的，是给 Agent 认路的

## 目录设计

```
📁 01-Sources     ← 外部资料入库
📁 02-Accounts    ← 各账号内容资产
└─ 超级猛
   ├─ Topics      ← 选题池
   ├─ Drafts      ← 草稿区
   └─ Published   ← 发布归档
📁 03-Frameworks  ← 内容框架、写作规范、账号定位
```

**最小流转链路**：Source Note → Topic Note → Draft Note → Published Note

## 实操流程

### 第一步：丢资料给 Hermes，做入库判断

先把链接或正文扔给 Hermes 走第一轮，判断是否值得收入 Obsidian 内容中台。如果值得，生成 Source Note，包含：
- 核心摘要
- 关键观点
- 适合哪个账号
- 可延展成哪些选题
- 建议放入的目录和文件名

**核心价值**：Hermes 替我做初筛，挡掉不值得继续加工的低质量资料。

### 第二步：拆 Topic Note，把"写什么"钉死

入库之后不急着写正文。让 Hermes 先拆选题，基于 Source Note 为账号拆 3 个选题。

## Related Pages

- [concepts/llm-wiki](concepts/llm-wiki) — LLM Wiki 知识库模式
- [patterns/ai-knowledge-workflow](patterns/ai-knowledge-workflow) — AI知识管理工作流

## Sources

- 微信公众号《我把Hermes Agent接进 Obsidian 后，知识库终于不只是"存资料"了》(2026-06-11)