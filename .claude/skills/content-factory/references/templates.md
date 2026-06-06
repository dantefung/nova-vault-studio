# Content Factory — 五类标准化模板

## 案例模板（Case）

```markdown
---
title: "案例标题"
date: "YYYY-MM-DD"
source_file: "原始文件名"
category: "case"
tags: ["标签1", "标签2"]
summary: "一句话概括这个案例的核心结果"
---

# 案例标题

> 核心结果：一句话描述最终达成的结果

## 时间线

| 时间 | 事件 |
|------|------|
| YYYY-MM | 背景描述 |
| YYYY-MM | 关键动作1 |
| YYYY-MM | 关键动作2 |
| YYYY-MM | 最终结果 |

## 背景

（案例发生的背景条件，为什么会发生）

## 关键动作

### 动作1
（做了什么，为什么这样做）

### 动作2
（关键转折点）

## 结果

- 可量化结果 1
- 可量化结果 2

## 启示

（从这个案例中可以提炼出的通用原则，1-3 条）

## 关联主题

- [[cases/related-case]]
- [[solutions/related-solution]]

## 原始出处

- `raw/sources/原始文件名`
```

---

## 方案模板（Solution）

```markdown
---
title: "方案标题"
date: "YYYY-MM-DD"
source_file: "原始文件名"
category: "solution"
tags: ["标签1", "标签2"]
summary: "一句话概括这个方案解决的核心问题"
---

# 方案标题

> 问题 → 方案 → 效果

## 问题定义

（这个方案解决的是什么问题，描述要具体）

## 解决思路

（核心思路，一句话）

## 具体步骤

### 步骤1：（阶段名称）
（具体做法）

### 步骤2：（阶段名称）
（具体做法）

## 效果

- 效果点 1（含数据）
- 效果点 2（含数据）

## 适用范围

**适用**：场景 A、场景 B

**不适用**：场景 C（原因）

## 关联主题

- [[concepts/related-concept]]
- [[problems/related-problem]]

## 原始出处

- `raw/sources/原始文件名`
```

---

## 概念模板（Concept）

```markdown
---
title: "概念名称"
date: "YYYY-MM-DD"
source_file: "原始文件名"
category: "concept"
tags: ["标签1", "标签2"]
summary: "一句话定义这个概念"
---

# 概念名称

> 一句话定义

## 定义

（正式的、可引用的定义表述）

## 核心要素

（3-5 个关键构成要素，每个 1-2 句话）

1. **要素1**：...
2. **要素2**：...
3. **要素3**：...

## 典型场景

（这个概念最常出现在哪些场景中）

## 关联概念

- [[concepts/related-concept-1]]
- [[concepts/related-concept-2]]

## 常见误区

（容易混淆或理解错误的地方）

## 原始出处

- `raw/sources/原始文件名`
```

---

## 观点模板（Opinion）

```markdown
---
title: "观点标题"
date: "YYYY-MM-DD"
source_file: "原始文件名"
category: "opinion"
tags: ["标签1", "标签2"]
summary: "一句话概括核心论点"
---

# 观点标题

> 核心论点：...（一句话有立场的判断）

## 论点

（核心论点展开，2-3 段）

## 论据

1. **论据1**：（事实或逻辑支撑）
2. **论据2**：（事实或逻辑支撑）

## 支持声音

（哪些人/观点支持这个论点）

## 反方/质疑

（可能的反对意见或质疑点）

## 适用边界

（这个观点在什么条件下成立，什么条件下不成立）

## 关联主题

- [[opinions/related-opinion]]
- [[concepts/related-concept]]

## 原始出处

- `raw/sources/原始文件名`
```

---

## 问题模板（Problem）

```markdown
---
title: "问题标题"
date: "YYYY-MM-DD"
source_file: "原始文件名"
category: "problem"
tags: ["标签1", "标签2"]
summary: "一句话描述这个问题的核心痛点"
---

# 问题标题

> 核心痛点：...（一句话描述未解决的核心问题）

## 问题描述

（具体描述这个问题是什么）

## 根因分析

### 表面原因
（直接原因）

### 深层原因
（根本原因）

## 约束条件

（在解决这个问题时遇到的实际限制）

## 已有解法

| 解法 | 效果 | 局限性 |
|------|------|--------|
| 解法 A | 效果描述 | 局限性描述 |
| 解法 B | 效果描述 | 局限性描述 |

## 开放问题

（目前还没有满意解法的地方）

## 关联主题

- [[problems/related-problem]]
- [[solutions/related-solution]]

## 原始出处

- `raw/sources/原始文件名`
```

---

## Topic Map JSON Schema

```json
{
  "version": "1.0",
  "topics": [
    {
      "id": "string (unique slug)",
      "title": "string",
      "category": "case | solution | concept | opinion | problem",
      "tags": ["tag1", "tag2"],
      "summary": "string (one sentence)",
      "related": ["topic-id-1", "topic-id-2"],
      "source_file": "string",
      "created_at": "YYYY-MM-DD",
      "updated_at": "YYYY-MM-DD"
    }
  ],
  "tags": {
    "标签名": ["topic-id-1", "topic-id-2"]
  }
}
```

---

## Graph JSON Schema

```json
{
  "version": "1.0",
  "nodes": ["topic-id-1", "topic-id-2"],
  "edges": [
    {
      "from": "topic-id-a",
      "to": "topic-id-b",
      "reason": "string (e.g. '同标签云计算', 'A引用了B')",
      "weight": 0.0
    }
  ]
}
```

**权重参考**：
- 同一清洗文件生成：1.0
- 同标签：0.8
- A 明确引用 B：0.9
- 同一主题大类：0.5