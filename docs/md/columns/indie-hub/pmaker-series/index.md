---
title: "PMaker 系列专栏"
date: "2026-08-21"
source: "pmaker.space（空格的键盘）"
---

# PMaker 系列专栏

> 全站采集自 [pmaker.space](https://pmaker.space)，作者「空格的键盘」。一套从 AI 基础到产品实践的完整知识体系，共 145 篇。

---

## 目录结构

- [learn/](./learn/) — AI 基础知识（60 篇）：基础认知、大模型、提示词工程、上下文与 RAG、Agent 与 Skill、成本与安全
- [basics/](./basics/) — 产品基础（10 篇）：产品工作流程、互联网行业、商业模式、技术理解、思维模型与进阶路线
- [patterns/](./patterns/) — 产品实践模式（75 篇）：发现问题、定义产品、设计结构、设计交互、设计界面、与 AI 协作、验证与迭代

---

## 阅读路线

```
AI 基础          →  基础认知 → 大模型 → 提示词 → 上下文/RAG → Agent → 成本与安全
产品基础          →  工作流 → 行业地图 → 商业模式 → 技术理解 → 思维模型 → 进阶路线
发现问题          →  需求定义 → 真伪判断 → 用户访谈 → 优先级
定义产品          →  产品定义 → 生命周期 → 商业模式 → 一句话 → 演进蓝图
设计结构          →  信息架构 → 导航 → 页面地图 → 数据模型
设计交互          →  路径 → 状态 → 反馈 → 异常 → 权限
设计界面          →  层级 → 颜色 → 排版 → 间距 → 设计系统
与 AI 协作        →  能力边界 → 上下文 → 规格/提示/约束 → 原型到代码
验证与迭代        →  三层验证 → 指标体系 → 北极星 → 安全检查
```

---

## AI 基础知识（60 篇）

### 基础认知

| # | 文章 |
|---|------|
| 01 | [AI 名词地图](./learn/01-ai-glossary.md) |
| 02 | [AI 发展简史](./learn/02-ai-history.md) |
| 03 | [AI 目前到了哪一步](./learn/03-ai-current-state.md) |
| 04 | [AI 行业的四层](./learn/04-ai-industry-layers.md) |
| 05 | [主流模型厂商的差异](./learn/05-ai-model-providers.md) |
| 06 | [从哪里拿到模型](./learn/06-ai-model-access.md) |

### 大模型

| # | 文章 |
|---|------|
| 07 | [大模型的运作原理](./learn/07-ai-next-token.md) |
| 08 | [大模型与搜索引擎的区别](./learn/08-ai-not-search.md) |
| 09 | [训练与推理的区别](./learn/09-ai-train-vs-infer.md) |
| 10 | [训练数据从哪来](./learn/10-ai-training-data.md) |
| 11 | [模型的六种类型](./learn/11-ai-model-types.md) |
| 12 | [推理模型与普通模型](./learn/12-ai-reasoning-models.md) |
| 13 | [开源与闭源](./learn/13-ai-open-vs-closed.md) |
| 14 | [Token 与计费单位](./learn/14-ai-token.md) |
| 15 | [参数量与跑分怎么看](./learn/15-ai-params.md) |
| 16 | [温度与随机性](./learn/16-ai-temperature.md) |
| 17 | [调用一个模型需要什么](./learn/17-ai-how-to-call.md) |
| 18 | [常用调用参数](./learn/18-ai-call-params.md) |
| 19 | [选型与降级](./learn/19-ai-model-selection.md) |
| 20 | [幻觉产生的原因](./learn/20-ai-hallucination.md) |
| 21 | [知识截止日期](./learn/21-ai-cutoff.md) |
| 22 | [多模态：图片怎么被读懂](./learn/22-ai-modality.md) |

### 提示词工程

| # | 文章 |
|---|------|
| 23 | [提示词不是咒语](./learn/23-ai-what-is-prompt.md) |
| 24 | [提示词的四个部件](./learn/24-ai-prompt-parts.md) |
| 25 | [系统提示与用户提示](./learn/25-ai-prompt-roles.md) |
| 26 | [为什么用 Markdown 写提示词](./learn/26-ai-prompt-markdown.md) |
| 27 | [给例子比讲道理管用](./learn/27-ai-few-shot.md) |
| 28 | [控制输出格式](./learn/28-ai-output-format.md) |
| 29 | [几个高杠杆技巧](./learn/29-ai-prompt-techniques.md) |
| 30 | [提示词怎么迭代](./learn/30-ai-prompt-iterate.md) |
| 31 | [提示词的沉淀与版本](./learn/31-ai-prompt-assets.md) |

### 上下文与 RAG

| # | 文章 |
|---|------|
| 32 | [向量与语义相似度](./learn/32-ai-embedding.md) |
| 33 | [相似不等于相关](./learn/33-ai-similarity.md) |
| 34 | [关键词、向量与混合检索](./learn/34-ai-retrieval-methods.md) |
| 35 | [上下文窗口](./learn/35-ai-context-window.md) |
| 36 | [上下文中段丢失](./learn/36-ai-context-rot.md) |
| 37 | [对话压缩](./learn/37-ai-compaction.md) |
| 38 | [长期记忆的实现方式](./learn/38-ai-long-memory.md) |
| 39 | [RAG：知识库的三步](./learn/39-ai-rag.md) |
| 40 | [切分：RAG 成败的第一步](./learn/40-ai-rag-chunking.md) |
| 41 | [RAG 答不准的三个环节](./learn/41-ai-rag-fails.md) |
| 42 | [微调还是 RAG](./learn/42-ai-finetune-vs-rag.md) |

### Agent 与 Skill

| # | 文章 |
|---|------|
| 43 | [模型、Agent、应用的分层](./learn/43-ai-agent-layers.md) |
| 44 | [工具调用](./learn/44-ai-tool-calling.md) |
| 45 | [Agent 循环](./learn/45-ai-agent-loop.md) |
| 46 | [Skill 与 MCP](./learn/46-ai-skill-mcp.md) |
| 47 | [多 Agent 协作](./learn/47-ai-multi-agent.md) |
| 48 | [提示词的分层](./learn/48-ai-prompt-layers.md) |
| 49 | [Agent 跑偏的三种形态](./learn/49-ai-agent-drift.md) |
| 50 | [权限分级与人工断点](./learn/50-ai-permissions.md) |
| 51 | [Agent 评测](./learn/51-ai-agent-eval.md) |

### 成本与安全

| # | 文章 |
|---|------|
| 52 | [一次调用的计费构成](./learn/52-ai-billing.md) |
| 53 | [生图为什么贵几十倍](./learn/53-ai-image-cost.md) |
| 54 | [缓存命中与省钱](./learn/54-ai-cache-savings.md) |
| 55 | [提示注入](./learn/55-ai-prompt-injection.md) |
| 56 | [对话数据的去向](./learn/56-ai-data-usage.md) |
| 57 | [AI 代码的常见漏洞](./learn/57-ai-ai-code-vulns.md) |
| 58 | [什么能交给 AI](./learn/58-ai-what-to-trust.md) |
| 59 | [核实 AI 回答的三个动作](./learn/59-ai-verify-answer.md) |
| 60 | [人机边界](./learn/60-ai-human-boundary.md) |

---

## 产品基础（10 篇）

| # | 文章 |
|---|------|
| 61 | [产品经理在干什么](./basics/61-basics-what-pm-does.md) |
| 62 | [产品的工作流程](./basics/62-basics-product-workflow.md) |
| 63 | [产品的类型与方向](./basics/63-basics-product-types.md) |
| 64 | [互联网行业地图](./basics/64-basics-industry-map.md) |
| 65 | [常见的商业模式](./basics/65-basics-business-models.md) |
| 66 | [理解技术](./basics/66-basics-understand-tech.md) |
| 67 | [术语表](./basics/67-basics-glossary.md) |
| 68 | [产品思维模型](./basics/68-basics-thinking-models.md) |
| 69 | [工具与模板](./basics/69-basics-tools.md) |
| 70 | [进阶路线与书单](./basics/70-basics-roadmap.md) |

---

## 产品实践模式（75 篇）

### 发现问题

| # | 文章 |
|---|------|
| 71 | [什么是需求](./patterns/71-need-what-is-need.md) |
| 72 | [需求的四个来源](./patterns/72-need-need-sources.md) |
| 73 | [真需求与伪需求](./patterns/73-need-real-vs-fake.md) |
| 74 | [问行为不问意愿](./patterns/74-need-ask-behavior.md) |
| 75 | [先找现有替代方案](./patterns/75-need-existing-workaround.md) |
| 76 | [值不值得做](./patterns/76-need-worth-doing.md) |
| 77 | [场景锚点](./patterns/77-need-scene-anchor.md) |
| 78 | [用户访谈怎么问](./patterns/78-need-interview.md) |
| 79 | [五个为什么](./patterns/79-need-five-whys.md) |
| 80 | [需求池与优先级](./patterns/80-need-backlog-priority.md) |

### 定义产品

| # | 文章 |
|---|------|
| 81 | [定义由三部分组成](./patterns/81-define-definition-three-parts.md) |
| 82 | [产品的生命周期](./patterns/82-define-lifecycle.md) |
| 83 | [商业模式怎么接上](./patterns/83-define-connect-business.md) |
| 84 | [一句话产品](./patterns/84-define-one-sentence.md) |
| 85 | [唯一主线](./patterns/85-define-single-thread.md) |
| 86 | [目标用户收窄](./patterns/86-define-narrow-audience.md) |
| 87 | [反面清单](./patterns/87-define-not-doing-list.md) |
| 88 | [最小切片](./patterns/88-define-thin-slice.md) |
| 89 | [借形](./patterns/89-define-borrow-form.md) |
| 90 | [产品演进蓝图](./patterns/90-define-roadmap-blueprint.md) |

### 设计结构

| # | 文章 |
|---|------|
| 91 | [什么是信息架构](./patterns/91-ia-what-is-ia.md) |
| 92 | [四种组织结构](./patterns/92-ia-four-structures.md) |
| 93 | [网页与移动端的差别](./patterns/93-ia-web-vs-mobile.md) |
| 94 | [四种导航形式](./patterns/94-ia-nav-forms.md) |
| 95 | [一屏一件事](./patterns/95-ia-one-screen-one-job.md) |
| 96 | [分组与命名](./patterns/96-ia-grouping-naming.md) |
| 97 | [宽而浅](./patterns/97-ia-wide-shallow.md) |
| 98 | [内容清单](./patterns/98-ia-content-inventory.md) |
| 99 | [卡片分类](./patterns/99-ia-card-sorting.md) |
| 100 | [页面地图](./patterns/100-ia-sitemap.md) |
| 101 | [三种结构图](./patterns/101-ia-three-diagrams.md) |
| 102 | [数据模型先行](./patterns/102-ia-data-model-first.md) |

### 设计交互

| # | 文章 |
|---|------|
| 103 | [交互管的是行为](./patterns/103-interaction-basics.md) |
| 104 | [常用组件有哪些](./patterns/104-interaction-common-components.md) |
| 105 | [提示的五种形式](./patterns/105-interaction-hint-types.md) |
| 106 | [四态齐全](./patterns/106-interaction-four-states.md) |
| 107 | [操作必有反馈](./patterns/107-interaction-feedback.md) |
| 108 | [可撤销优于确认](./patterns/108-interaction-undoable.md) |
| 109 | [权限即视图](./patterns/109-interaction-permission-as-view.md) |
| 110 | [画用户路径](./patterns/110-interaction-user-journey.md) |
| 111 | [列状态清单](./patterns/111-interaction-state-checklist.md) |
| 112 | [首次体验设计](./patterns/112-interaction-first-run.md) |
| 113 | [表单克制](./patterns/113-interaction-form-restraint.md) |
| 114 | [提示语怎么写](./patterns/114-interaction-wording.md) |

### 设计界面

| # | 文章 |
|---|------|
| 115 | [视觉层级从哪来](./patterns/115-visual-visual-hierarchy.md) |
| 116 | [颜色基础](./patterns/116-visual-color-basics.md) |
| 117 | [排版基础](./patterns/117-visual-typography-basics.md) |
| 118 | [一套间距](./patterns/118-visual-spacing-scale.md) |
| 119 | [字号阶梯](./patterns/119-visual-type-scale.md) |
| 120 | [一个强调色](./patterns/120-visual-one-accent.md) |
| 121 | [留白优先](./patterns/121-visual-whitespace-first.md) |
| 122 | [对齐轴](./patterns/122-visual-alignment.md) |
| 123 | [先定组件后拼页](./patterns/123-visual-components-first.md) |
| 124 | [建一份最小设计系统](./patterns/124-visual-design-system.md) |
| 125 | [响应式怎么落](./patterns/125-visual-responsive.md) |

### 与 AI 协作

| # | 文章 |
|---|------|
| 126 | [它会做的和不会做的](./patterns/126-ai-collab-ai-can-cannot.md) |
| 127 | [上下文是怎么回事](./patterns/127-ai-collab-what-is-context.md) |
| 128 | [规格、提示、约束的分工](./patterns/128-ai-collab-spec-prompt-rules.md) |
| 129 | [先规格后代码](./patterns/129-ai-collab-spec-before-code.md) |
| 130 | [一次一件](./patterns/130-ai-collab-one-thing-at-a-time.md) |
| 131 | [参考锚定](./patterns/131-ai-collab-reference-anchor.md) |
| 132 | [三段式提示](./patterns/132-ai-collab-three-part-prompt.md) |
| 133 | [上下文预算](./patterns/133-ai-collab-context-budget.md) |
| 134 | [从原型到代码](./patterns/134-ai-collab-prototype-to-code.md) |
| 135 | [约束沉淀](./patterns/135-ai-collab-rules-distilled.md) |

### 验证与迭代

| # | 文章 |
|---|------|
| 136 | [能用、好用、有人用](./patterns/136-validate-three-layers-of-validation.md) |
| 137 | [指标体系怎么搭](./patterns/137-validate-metrics-system.md) |
| 138 | [先埋点后上线](./patterns/138-validate-track-before-launch.md) |
| 139 | [一个北极星](./patterns/139-validate-north-star.md) |
| 140 | [拿真实数据判断](./patterns/140-validate-real-data.md) |
| 141 | [五秒测试](./patterns/141-validate-five-second-test.md) |
| 142 | [走查清单](./patterns/142-validate-launch-checklist.md) |
| 143 | [真实数据压测](./patterns/143-validate-real-data-stress.md) |
| 144 | [AI 代码的安全检查](./patterns/144-validate-ai-code-check.md) |
| 145 | [北极星拆解](./patterns/145-validate-north-star-split.md) |

---

## 外部链接

- [PMaker 官网](https://pmaker.space)
- [空格的键盘 · 小红书](https://xhslink.com/m/7IKqVTqRKp3)
- [空格的键盘 · 公众号](https://mp.weixin.qq.com/s/SPOH_g4SXSxXA1e3ozBBYQ)