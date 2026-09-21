---
title: "grill-with-docs 技能：文档化追问直到方案无懈可击"
date: "2026-09-21"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# grill-with-docs 技能：文档化追问直到方案无懈可击

## 定位

grill-with-docs 是一个**文档化访谈技能**，对你的计划或设计进行无情追问，同时要求 Agent 将决策过程和结论**全部沉淀到项目 `docs/` 目录下**。

## 与 grill-me 的区别

| 维度 | grill-me | grill-with-docs |
|------|----------|-----------------|
| **方向** | 追问你的方案 | 挑战你的方案 against docs |
| **主体** | Agent 追问用户 | 用户（或 Agent）挑战 Agent |
| **输出** | 决策树完备 | CONTEXT.md + ADR 更新 |

## 核心用法

开发大型项目以前，**一定要使用 grill-me 和 grill-with-docs skill**：

```bash
npx skills add mattpocock/skills --skill grill-with-docs grill-me
```

**要求**：让 agent 把决策过程和结论都沉淀到项目的 `docs/` 目录下。

## 追问策略

grill-with-docs 会针对每个决策点追问：

1. **有没有文档支撑这个决定？**
2. **这个决策和现有文档矛盾吗？**
3. **如果 X 失败了，文档有记录吗？**
4. **受益人知道这个决定吗？**
5. **这个决定影响到谁，他们看过文档吗？**

## 输出要求

所有决策必须落入 `docs/` 目录，建议结构：

```
docs/
├── CONTEXT.md          # 上下文与决策背景
├── DECISIONS/          # ADR（架构决策记录）
│   ├── 001-xxx.md
│   └── 002-xxx.md
└── RATIONALE/         # 决策理由
```

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[grill-me](./grill-me.md)、[caveman](./caveman.md)
