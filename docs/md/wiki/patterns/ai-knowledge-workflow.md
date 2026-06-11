---
title: "AI Knowledge Workflow（AI知识管理工作流）"
date: "2026-06-11"
---

# AI Knowledge Workflow（AI知识管理工作流）

> Obsidian 做底座，Agent 做执行层。知识库从"仓库"变"生产线"：Source Note → Topic Note → Draft Note → Published Note。

## Key Points

- **核心问题**：知识库最大的浪费不是"不够大"，而是"存了不用"
- **最小链路**：Source → Topic → Draft → Published，跑顺了仓库变生产线
- **Agent 做守门人**：核心价值不是整理，是初筛——判断资料值不值得继续加工
- **选题比内容更重要**：Topic Note 先把"写什么"锚住

## 目录设计原则

目录不是给人看的，是给 Agent 认路的。

```
📁 01-Sources     ← 外部资料入库
📁 02-Accounts    ← 各账号内容资产
└─ 账号名
   ├─ Topics      ← 选题池
   ├─ Drafts      ← 草稿区
   └─ Published   ← 发布归档
📁 03-Frameworks  ← 内容框架、写作规范
```

## 三步流转

### 第一步：丢资料给 Agent，做入库判断

判断是否值得收入内容中台。如果值得，生成 Source Note：
- 核心摘要
- 关键观点
- 适合哪个账号
- 可延展成哪些选题
- 建议放入的目录和文件名

**核心价值**：Agent 替做初筛，挡掉不值得继续加工的低质量资料。

### 第二步：拆 Topic Note，把"写什么"钉死

基于 Source Note 拆 3 个选题，每个选题包含：
- 一句话定义
- 目标读者
- 用户痛点
- 核心承诺
- 标题候选（3 个）
- 简短提纲

**选题四标准**：有明确的用户痛点、有真实案例可引用、能讲成可复现的工作流、能给出可操作的方法。

### 第三步：生成 Draft，但不让 Agent 直接定稿

从使用场景和判断出发，不要写成工具说明书；结构清楚但别像模板；每节都有具体做法；结尾给出下一步行动建议。

## 关键洞察

1. **知识库即生产线**：不是存储系统，而是内容生产线。链路跑顺了，输出才能稳定。

2. **Agent 做守门人**：Hermes 核心价值不是整理，是初筛——判断资料值不值得继续加工。

3. **选题比内容更重要**：Topic Note 先把"写什么"锚住，同一篇资料可以写成工具测评、方法论、踩坑总结。

4. **克制比激进更重要**：不追求高级，不搞复杂知识图谱，只解决一个具体问题——让资料别停在资料阶段。

## Related Pages

- [concepts/llm-wiki](concepts/llm-wiki) — LLM Wiki 知识库模式
- [patterns/ai-wealth-creation](patterns/ai-wealth-creation) — AI时代造富模式

## Sources

- 微信公众号《我把Hermes Agent接进 Obsidian 后，知识库终于不只是"存资料"了》(2026-06-11)