---
title: "还在用grill-me？Matt Pocock建议grill-with-docs"
date: "2026-07-21"
source: "运维有术"
url: "https://mp.weixin.qq.com/s/Yia6XDvAkw8ygjRXFmPmgg"
---

## 核心观点

Matt Pocock 的 grill-with-docs 把团队术语对齐变成可复用的仓库资产。两个原语（grilling + domain-modeling）+ 两个产物（CONTEXT.md glossary + ADR）。

## 关键概念

- **grilling**：纯访谈原语，一次一个问题，不落文件
- **domain-modeling**：沉淀原语，术语立即写 CONTEXT.md，决策触发 ADR
- **CONTEXT.md**：项目独有术语表（glossary only），不含实现细节
- **ADR**：满足三条门槛才写（Hard to reverse / Surprising without context / Real trade-off）

## 职责矩阵

| Skill | 落文件 | 场景 |
|-------|--------|------|
| grill-me | ❌ | 无代码库的纯讨论 |
| grill-with-docs | ✅ CONTEXT.md/ADR | 有代码库的真实工程 |
| domain-modeling | ✅ glossary | 被其他 skill 驱动 |

## ADR 三条门槛

1. Hard to reverse——改起来代价不小
2. Surprising without context——不读上下文会觉得奇怪
3. The result of a real trade-off——真有备选方案且被严肃评估

## 四反模式

1. 过早记录（ADR 可逆选择也写）
2. 术语过多（通用概念也塞进去）
3. CONTEXT.md 写成 spec（含实现细节）
4. 文档与代码漂移

## 关联概念

[[Matt Pocock]] [[grill-with-docs]] [[CONTEXT.md]] [[ADR]] [[术语对齐]] [[文档化反模式]] [[Skills For Real Engineers]]
